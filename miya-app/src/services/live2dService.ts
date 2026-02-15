/**
 * Live2D Model Service
 * Handles loading, rendering, and controlling Live2D Cubism models
 * using pixi.js and pixi-live2d-display.
 */

import * as PIXI from 'pixi.js';
// Use the Cubism 4-only build (avoids "Could not find Cubism 2 runtime" error)
import { Live2DModel, MotionPreloadStrategy } from 'pixi-live2d-display/cubism4';
import type { Live2DModelConfig, Live2DExpressionParams } from '../types/live2d';
import type { AvatarExpression } from '../types';

// Register Live2D with PIXI - use any to bypass version mismatch between pixi.js v7 and pixi-live2d-display
Live2DModel.registerTicker(PIXI.Ticker as any);

import { FACE_MOTION_MAP } from './expressionManager';

export class Live2DService {
  private app: PIXI.Application | null = null;
  private model: Live2DModel | null = null;
  private config: Live2DModelConfig | null = null;
  private lipSyncInterval: number | null = null;
  private analyser: AnalyserNode | null = null;

  /**
   * Initialize the PIXI application and attach to a canvas element
   */
  async init(canvas: HTMLCanvasElement, width: number, height: number): Promise<void> {
    if (this.app) {
      this.destroy();
    }

    // Ensure non-zero dimensions — fallback to 800×800 to prevent WebGL errors
    const w = width > 0 ? width : 800;
    const h = height > 0 ? height : 800;

    // Explicitly set canvas dimensions BEFORE creating the PIXI Application.
    // Without this, the WebGL context may report 0 for MAX_TEXTURE_IMAGE_UNITS
    // which causes checkMaxIfStatementsInShader to throw.
    canvas.width = w * (window.devicePixelRatio || 1);
    canvas.height = h * (window.devicePixelRatio || 1);

    try {
      this.app = new PIXI.Application({
        view: canvas,
        width: w,
        height: h,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        // Request WebGL2 — needed for 32-bit index buffers used by Cubism 4 models.
        // Falls back to WebGL1 automatically if unavailable.
        preferWebGLVersion: 2,
        powerPreference: 'high-performance',
      } as any);  // `as any` because preferWebGLVersion is a valid v7 option but not in all type defs
    } catch (error) {
      // If PIXI.Application constructor fails (e.g. WebGL context error),
      // ensure this.app is null so loadModel won't try to use a broken app.
      this.app = null;
      throw error;
    }

    // Log the WebGL version that was actually obtained
    const gl = (this.app.renderer as any).gl as WebGLRenderingContext | undefined;
    if (gl) {
      const isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
      console.log(`[Live2D] Renderer created — WebGL${isWebGL2 ? '2' : '1'}`);
      if (!isWebGL2) {
        console.warn(
          '[Live2D] WebGL2 not available — 32-bit index buffers may not be supported. ' +
          'Check chrome://gpu or update your GPU driver.'
        );
      }
    }
  }

  /**
   * Load a Live2D model from configuration
   */
  async loadModel(config: Live2DModelConfig): Promise<void> {
    if (!this.app || !this.app.renderer) {
      throw new Error('PIXI app not initialized. Call init() first.');
    }

    this.config = config;

    try {
      // Remove existing model
      if (this.model) {
        this.app.stage.removeChild(this.model as any);
        this.model.destroy();
        this.model = null;
      }

      // Load new model
      this.model = await Live2DModel.from(config.modelPath, {
        motionPreload: MotionPreloadStrategy.IDLE,
        autoInteract: false,
      });

      // Guard: the app may have been destroyed while model was loading (StrictMode)
      if (!this.app || !this.app.renderer) {
        this.model.destroy();
        this.model = null;
        throw new Error('PIXI app was destroyed during model loading.');
      }

      // Configure model transforms
      this.model.scale.set(config.scale);
      this.model.x = (this.app.renderer.width / window.devicePixelRatio) / 2 + config.offsetX;
      this.model.y = (this.app.renderer.height / window.devicePixelRatio) / 2 + config.offsetY;
      this.model.anchor.set(0.5, 0.5);

      // Enable auto-update
      this.model.autoUpdate = true;

      // Add to stage
      this.app.stage.addChild(this.model as any);

      // Start idle animation
      this.playMotion('Idle', 0);

      console.log('[Live2D] Model loaded successfully:', config.modelPath);
    } catch (error) {
      console.error('[Live2D] Failed to load model:', error);
      throw error;
    }
  }

  /**
   * Set expression based on mood/avatar expression.
   * Plays both a body motion and a face motion for full expressiveness.
   */
  setExpression(expression: AvatarExpression): void {
    if (!this.model || !this.config) return;

    const expressionConfig = this.config.expressions[expression];
    if (!expressionConfig) {
      console.warn(`[Live2D] No expression config for: ${expression}`);
      return;
    }

    // Play body motion (random index from the group)
    if (expressionConfig.motion) {
      this.playRandomMotion(expressionConfig.motion, 2);
    }

    // Also play corresponding face motion
    const faceGroup = FACE_MOTION_MAP[expression];
    if (faceGroup && faceGroup !== expressionConfig.motion) {
      this.playRandomMotion(faceGroup, 1);
    }

    this.applyExpressionParams(expressionConfig);
  }

  /**
   * Play a random motion from a motion group
   */
  playRandomMotion(group: string, priority: number = 2): void {
    if (!this.model) return;
    try {
      // Use undefined index to let pixi-live2d-display pick randomly
      this.model.motion(group, undefined, priority);
    } catch (e) {
      console.warn(`[Live2D] Motion group not available: ${group}`);
    }
  }

  /**
   * Apply expression parameters to the model
   */
  private applyExpressionParams(params: Live2DExpressionParams): void {
    if (!this.model) return;

    // If there's a named expression file, use it
    if (params.expressionFile) {
      try {
        this.model.expression(params.expressionFile);
      } catch (e) {
        console.warn('[Live2D] Expression file not found:', params.expressionFile);
      }
    }

    // Apply direct parameter overrides
    if (params.params) {
      const coreModel = (this.model as any).internalModel?.coreModel;
      if (coreModel) {
        for (const [paramId, value] of Object.entries(params.params)) {
          try {
            const paramIndex = coreModel.getParameterIndex(paramId);
            if (paramIndex >= 0) {
              coreModel.setParameterValueByIndex(paramIndex, value);
            }
          } catch {
            // Parameter not found in this model - silently skip
          }
        }
      }
    }

    // Play associated motion
    if (params.motion) {
      this.playMotion(params.motion, 1);
    }
  }

  /**
   * Play a motion from a motion group
   */
  playMotion(group: string, index: number = 0, priority: number = 2): void {
    if (!this.model) return;
    try {
      this.model.motion(group, index, priority);
    } catch (e) {
      console.warn(`[Live2D] Motion not available: ${group}[${index}]`);
    }
  }

  /**
   * Start lip sync from audio analyser data
   */
  startLipSync(audioContext: AudioContext, source: MediaElementAudioSourceNode | MediaStreamAudioSourceNode): void {
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    source.connect(this.analyser);

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const updateLipSync = () => {
      if (!this.analyser || !this.model) return;

      this.analyser.getByteFrequencyData(dataArray);

      // Calculate volume from frequency data
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const volume = Math.min(1, (sum / dataArray.length / 128));

      // Apply mouth open parameter
      this.setMouthOpenness(volume);

      this.lipSyncInterval = requestAnimationFrame(updateLipSync);
    };

    updateLipSync();
  }

  /**
   * Manual lip sync with volume level (for TTS without audio source)
   */
  setMouthOpenness(value: number): void {
    if (!this.model) return;

    const coreModel = (this.model as any).internalModel?.coreModel;
    if (coreModel) {
      // Try common mouth parameter names
      const mouthParams = ['ParamMouthOpenY', 'PARAM_MOUTH_OPEN_Y', 'ParamMouthForm'];
      for (const paramId of mouthParams) {
        try {
          const idx = coreModel.getParameterIndex(paramId);
          if (idx >= 0) {
            coreModel.setParameterValueByIndex(idx, value);
            break;
          }
        } catch {
          // continue to next param name
        }
      }
    }
  }

  /**
   * Stop lip sync
   */
  stopLipSync(): void {
    if (this.lipSyncInterval) {
      cancelAnimationFrame(this.lipSyncInterval);
      this.lipSyncInterval = null;
    }
    this.setMouthOpenness(0);
  }

  /**
   * Simulate talking with random mouth movements
   */
  startTalkingAnimation(): void {
    this.stopLipSync();

    const animate = () => {
      if (!this.model) return;
      // Random mouth opening for natural talking feel
      const openness = 0.3 + Math.random() * 0.7;
      this.setMouthOpenness(openness);

      const delay = 80 + Math.random() * 120;
      this.lipSyncInterval = window.setTimeout(() => {
        this.lipSyncInterval = requestAnimationFrame(animate);
      }, delay) as unknown as number;
    };

    animate();
  }

  /**
   * Make the model look at a point (for mouse tracking)
   */
  lookAt(x: number, y: number): void {
    if (!this.model) return;
    this.model.focus(x, y);
  }

  /**
   * Handle pointer tap on the model
   */
  handleTap(x: number, y: number): void {
    if (!this.model) return;
    this.model.tap(x, y);
  }

  /**
   * Resize the canvas and reposition the model
   */
  resize(width: number, height: number): void {
    if (!this.app || !this.app.renderer) return;
    this.app.renderer.resize(width, height);

    if (this.model && this.config) {
      this.model.x = width / 2 + this.config.offsetX;
      this.model.y = height / 2 + this.config.offsetY;
    }
  }

  /**
   * Get the current Live2D model instance
   */
  getModel(): Live2DModel | null {
    return this.model;
  }

  /**
   * Check if model is loaded
   */
  isModelLoaded(): boolean {
    return this.model !== null;
  }

  /**
   * Destroy everything and clean up
   */
  destroy(): void {
    this.stopLipSync();

    if (this.model) {
      this.model.destroy();
      this.model = null;
    }

    if (this.app) {
      this.app.destroy(false, { children: true, texture: true, baseTexture: true });
      this.app = null;
    }

    this.config = null;
    this.analyser = null;
  }
}

// Singleton instance
export const live2dService = new Live2DService();
