/**
 * Live2DCanvas Component
 * Renders the Live2D model with fallback UI when model is not available.
 * Handles mouse tracking, click interactions, and expression syncing.
 */

import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLive2D } from '../hooks/useLive2D';
import type { MoodType } from '../types';
import MiyaAvatar from './MiyaAvatar';

interface Live2DCanvasProps {
  mood: MoodType;
  isTyping: boolean;
  isSpeaking: boolean;
  width?: number;
  height?: number;
  onModelLoaded?: () => void;
  onModelError?: (error: string) => void;
}

export default function Live2DCanvas({
  mood,
  isTyping,
  isSpeaking,
  width = 800,
  height = 800,
  onModelLoaded,
  onModelError,
}: Live2DCanvasProps) {
  const {
    state,
    canvasRef,
    loadModel,
    setMoodExpression,
    startTalking,
    stopTalking,
    handleMouseMove,
    handleTap,
    resize,
  } = useLive2D({ autoLoad: true });

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync mood to expression
  useEffect(() => {
    if (state.isLoaded) {
      setMoodExpression(mood);
    }
  }, [mood, state.isLoaded, setMoodExpression]);

  // Handle talking animation
  useEffect(() => {
    if (!state.isLoaded) return;

    if (isSpeaking || isTyping) {
      startTalking();
    } else {
      stopTalking();
    }
  }, [isSpeaking, isTyping, state.isLoaded, startTalking, stopTalking]);

  // Notify parent of model state changes
  useEffect(() => {
    if (state.isLoaded) onModelLoaded?.();
    if (state.error) onModelError?.(state.error);
  }, [state.isLoaded, state.error, onModelLoaded, onModelError]);

  // Mouse tracking for eye follow
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!state.isLoaded || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      handleMouseMove(x, y);
    },
    [state.isLoaded, handleMouseMove]
  );

  // Click interaction
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!state.isLoaded || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      handleTap(x, y);
    },
    [state.isLoaded, handleTap]
  );

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        resize(w, h);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [resize]);

  // Retry loading
  const handleRetry = useCallback(() => {
    loadModel();
  }, [loadModel]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ width, height }}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      {/* Live2D Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: state.isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      />

      {/* Loading State */}
      <AnimatePresence>
        {state.isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-cyber-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-cyber-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <p className="mt-4 text-sm text-miya-muted animate-pulse">Loading Live2D model...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error / Fallback State - Show SVG Avatar */}
      <AnimatePresence>
        {!state.isLoading && !state.isLoaded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* Fallback to SVG Avatar */}
            <MiyaAvatar mood={mood} isTyping={isTyping} size={Math.min(width, height) * 0.85} />

            {/* Model status info */}
            {state.error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-3 max-w-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                  <div>
                    <p className="text-xs text-amber-300 font-medium">Live2D model not loaded</p>
                    <p className="text-[10px] text-miya-muted mt-0.5">
                      Place your .model3.json in <code className="text-cyber-300">/public/live2d/miya/</code>
                    </p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="ml-2 text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2 cursor-pointer flex-shrink-0"
                  >
                    Retry
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speaking Indicator Overlay */}
      {state.isLoaded && (isSpeaking || isTyping) && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-teal-400 to-cyber-400"
                animate={{
                  height: [4, 12 + Math.random() * 10, 4],
                }}
                transition={{
                  duration: 0.4 + Math.random() * 0.3,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
