/**
 * useLive2D Hook
 * Manages the Live2D model lifecycle, expressions, and interactions.
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
  const initRef = useRef(false);

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

        // Load the model
        await live2dService.loadModel(modelCfg);

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

  // Auto-load on mount if autoLoad is true
  // Use requestAnimationFrame to ensure the canvas has been laid out with real dimensions
  useEffect(() => {
    if (!autoLoad || initRef.current) return;

    const tryLoad = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Wait until the canvas has non-zero dimensions (layout complete)
      if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
        initRef.current = true;
        loadModel();
      } else {
        // Canvas not laid out yet — retry on next frame
        requestAnimationFrame(tryLoad);
      }
    };

    // Delay one frame to let React commit the DOM
    requestAnimationFrame(tryLoad);
  }, [autoLoad, loadModel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      live2dService.destroy();
    };
  }, []);

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
