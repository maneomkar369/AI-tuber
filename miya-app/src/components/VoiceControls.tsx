/**
 * VoiceControls Component
 * Provides microphone and speaker controls with visual feedback.
 * Shows waveform animation when listening, and speaking indicator.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Settings2 } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  isSTTSupported: boolean;
  isTTSSupported: boolean;
  interimTranscript: string;
  onToggleListen: () => void;
  onToggleMute: () => void;
  onOpenVoiceSettings?: () => void;
}

export default function VoiceControls({
  isListening,
  isSpeaking,
  isMuted,
  isSTTSupported,
  isTTSSupported,
  interimTranscript,
  onToggleListen,
  onToggleMute,
  onOpenVoiceSettings,
}: VoiceControlsProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Interim transcript bubble */}
      <AnimatePresence>
        {isListening && interimTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="glass rounded-2xl px-5 py-3 max-w-md text-center"
          >
            <p className="text-sm text-miya-text/80 italic">
              {interimTranscript}
              <span className="inline-block w-1 h-4 bg-teal-400 ml-1 animate-pulse" />
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control buttons */}
      <div className="flex items-center gap-3">
        {/* Microphone Button */}
        {isSTTSupported && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleListen}
              onMouseEnter={() => setShowTooltip('mic')}
              onMouseLeave={() => setShowTooltip(null)}
              className={`
                relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer
                transition-all duration-300 shadow-lg
                ${isListening
                  ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'
                  : 'glass glass-hover shadow-black/20 hover:shadow-cyber-500/20'
                }
              `}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-miya-muted group-hover:text-teal-400" />
              )}

              {/* Listening pulse ring */}
              {isListening && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-400"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border border-red-300"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  />
                </>
              )}
            </motion.button>

            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip === 'mic' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 glass rounded-lg px-3 py-1.5 whitespace-nowrap"
                >
                  <span className="text-xs text-miya-muted">
                    {isListening ? 'Stop listening' : 'Start voice input'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Waveform visualizer when listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-0.5 overflow-hidden"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-gradient-to-t from-red-400 to-rose-300"
                  animate={{
                    height: [3, 8 + Math.random() * 16, 3],
                  }}
                  transition={{
                    duration: 0.3 + Math.random() * 0.4,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Speaking indicator */}
        <AnimatePresence>
          {isSpeaking && !isListening && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-0.5 overflow-hidden"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-gradient-to-t from-teal-400 to-cyber-400"
                  animate={{
                    height: [3, 6 + Math.random() * 12, 3],
                  }}
                  transition={{
                    duration: 0.4 + Math.random() * 0.3,
                    repeat: Infinity,
                    delay: i * 0.08,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Volume/Mute Button */}
        {isTTSSupported && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleMute}
              onMouseEnter={() => setShowTooltip('vol')}
              onMouseLeave={() => setShowTooltip(null)}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center cursor-pointer
                transition-all duration-300 shadow-lg
                ${isMuted
                  ? 'glass opacity-60 shadow-black/10'
                  : 'glass glass-hover shadow-black/20 hover:shadow-teal-500/20'
                }
              `}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-miya-muted" />
              ) : (
                <Volume2 className="w-5 h-5 text-teal-400" />
              )}
            </motion.button>

            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip === 'vol' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 glass rounded-lg px-3 py-1.5 whitespace-nowrap"
                >
                  <span className="text-xs text-miya-muted">
                    {isMuted ? 'Unmute voice' : 'Mute voice'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Voice Settings Button */}
        {onOpenVoiceSettings && (
          <motion.button
            whileHover={{ scale: 1.05, rotate: 45 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenVoiceSettings}
            className="w-10 h-10 rounded-full glass glass-hover flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
          >
            <Settings2 className="w-4 h-4 text-miya-muted" />
          </motion.button>
        )}
      </div>

      {/* Status text */}
      <AnimatePresence mode="wait">
        {isListening && (
          <motion.p
            key="listening"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-red-400/80 font-medium"
          >
            Listening...
          </motion.p>
        )}
        {isSpeaking && !isListening && (
          <motion.p
            key="speaking"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-teal-400/80 font-medium"
          >
            Miya is speaking...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
