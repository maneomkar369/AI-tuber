/**
 * SubtitleOverlay Component
 * Displays conversation subtitles/captions at the bottom of the screen.
 * Shows both user speech input and Miya's responses.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubtitleOverlayProps {
  /** Current subtitle text to display */
  text: string;
  /** Who is speaking */
  speaker: 'user' | 'miya' | null;
  /** Whether to show the subtitle */
  visible: boolean;
  /** Auto-hide after this many ms (0 = no auto-hide) */
  autoHideMs?: number;
}

export default function SubtitleOverlay({
  text,
  speaker,
  visible,
  autoHideMs = 5000,
}: SubtitleOverlayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible && text) {
      setShow(true);

      if (autoHideMs > 0) {
        const timer = setTimeout(() => setShow(false), autoHideMs);
        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [visible, text, autoHideMs]);

  return (
    <AnimatePresence>
      {show && text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 max-w-2xl w-[90%]"
        >
          <div
            className={`
              rounded-2xl px-6 py-4 backdrop-blur-xl shadow-2xl
              ${speaker === 'miya'
                ? 'bg-gradient-to-r from-cyber-900/80 to-teal-900/80 border border-teal-500/20'
                : 'bg-gradient-to-r from-slate-900/80 to-gray-900/80 border border-white/10'
              }
            `}
          >
            {/* Speaker label */}
            <div className="flex items-center gap-2 mb-1.5">
              {speaker === 'miya' ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/80">
                  Miya
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80">
                  You
                </span>
              )}
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  speaker === 'miya' ? 'bg-teal-400' : 'bg-blue-400'
                } animate-pulse`}
              />
            </div>

            {/* Subtitle text */}
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-medium">
              {text}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
