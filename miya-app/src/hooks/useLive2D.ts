/**
 * useLive2D Hook
 * Manages the Live2D model lifecycle, expressions, and interactions.
 * Handles React StrictMode double-mount gracefully.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { live2dService } from '../services/live2dService';
import { getExpressionForMood, getDefaultModelConfig } from '../services/expressionManager';
import type { MoodType } from '../types';
import type { Live2DModelConfig, Live2DModelState } from '../types/live2d';

interface UseLive2DOptions {
  modelConfig?: Live2DModelConfig;
  autoLoad?: boolean;
}

interface UseLive2DReturn {
  state: Live2DModelState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  loadModel: (config?: Live2DModelConfig) => Promise<void>;
  setMoodExpression: (mood: MoodType) => void;
  startTalking: () => void;
  stopTalking: () => void;
  handleMouseMove: (x: number, y: number) => void;
  handleTap: (x: number, y: number) => void;
  resize: (width: number, height: number) => void;
  destroy: () => void;
}

export function useLive2D(options: UseLive2DOptions = {}): UseLive2DReturn {
  const { modelConfig, autoLoad = true } = options;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Track whether this effect cycle has been cancelled (StrictMode cleanup)
  const destroyedRef = useRef(false);

  const [state, setState] = useState<Live2DModelState>({
    isLoaded: false,
    isLoading: false,
    error: null,
    currentExpression: 'idle',
    isSpeaking: false,
    isLipSyncing: false,
  });

  const loadModel = useCallback(
    async (config?: Live2DModelConfig) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setState(prev => ({ ...prev, error: 'Canvas element not ready' }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const modelCfg = config || modelConfig || getDefaultModelConfig();

        // Initialize PIXI app
        await live2dService.init(canvas, canvas.clientWidth, canvas.clientHeight);

        // Abort if the effect was cleaned up while we were awaiting (StrictMode)
        if (destroyedRef.current) {
          live2dService.destroy();
          return;
        }

        // Load the model
        await live2dService.loadModel(modelCfg);

        // Abort again in case cleanup happened during model load
        if (destroyedRef.current) {
          live2dService.destroy();
          return;
        }

        setState(prev => ({
          ...prev,
          isLoaded: true,
          isLoading: false,
          error: null,
        }));
      } catch (error: any) {
        console.error('[useLive2D] Load failed:', error);
        setState(prev => ({
          ...prev,
          isLoaded: false,
          isLoading: false,
          error: error.message || 'Failed to load Live2D model',
        }));
      }
    },
    [modelConfig]
  );

  const setMoodExpression = useCallback((mood: MoodType) => {
    const expression = getExpressionForMood(mood);
    live2dService.setExpression(expression);
    setState(prev => ({ ...prev, currentExpression: expression }));
  }, []);

  const startTalking = useCallback(() => {
    live2dService.startTalkingAnimation();
    setState(prev => ({ ...prev, isSpeaking: true, isLipSyncing: true }));
  }, []);

  const stopTalking = useCallback(() => {
    live2dService.stopLipSync();
    setState(prev => ({ ...prev, isSpeaking: false, isLipSyncing: false }));
  }, []);

  const handleMouseMove = useCallback((x: number, y: number) => {
    live2dService.lookAt(x, y);
  }, []);

  const handleTap = useCallback((x: number, y: number) => {
    live2dService.handleTap(x, y);
  }, []);

  const resize = useCallback((width: number, height: number) => {
    live2dService.resize(width, height);
  }, []);

  const destroy = useCallback(() => {
    live2dService.destroy();
    setState({
      isLoaded: false,
      isLoading: false,
      error: null,
      currentExpression: 'idle',
      isSpeaking: false,
      isLipSyncing: false,
    });
  }, []);

  // Auto-load on mount.
  // Uses a single rAF to wait for the canvas element to exist in the DOM,
  // then calls loadModel exactly once. No retry loop — PIXI init should not
  // be retried via requestAnimationFrame as it can exhaust WebGL contexts.
  useEffect(() => {
    if (!autoLoad) return;

    // Reset the cancelled flag for this effect cycle
    destroyedRef.current = false;

    // Single-frame delay so React has committed the DOM and the canvas ref is set
    const rafId = requestAnimationFrame(() => {
      if (destroyedRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) {
        console.warn('[useLive2D] Canvas ref not available after mount — skipping init');
        return;
      }

      loadModel();
    });

    return () => {
      destroyedRef.current = true;
      cancelAnimationFrame(rafId);
      live2dService.destroy();
    };
  }, [autoLoad, loadModel]);

  return {
    state,
    canvasRef,
    loadModel,
    setMoodExpression,
    startTalking,
    stopTalking,
    handleMouseMove,
    handleTap,
    resize,
    destroy,
  };
}
