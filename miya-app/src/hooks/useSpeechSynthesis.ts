/**
 * useSpeechSynthesis Hook
 * Provides text-to-speech functionality with lip sync integration.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { TTSConfig } from '../types/speech';
import {
  isTTSSupported,
  getAvailableVoices,
  speakWithBrowserTTS,
  speakWithElevenLabs,
  getDefaultTTSConfig,
} from '../services/speechService';

interface UseSpeechSynthesisOptions {
  config?: Partial<TTSConfig>;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
  onWordBoundary?: (charIndex: number, charLength: number) => void;
}

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  config: TTSConfig;
  speak: (text: string) => Promise<void>;
  cancel: () => void;
  updateConfig: (update: Partial<TTSConfig>) => void;
}

export function useSpeechSynthesis(
  options: UseSpeechSynthesisOptions = {}
): UseSpeechSynthesisReturn {
  const { onSpeakStart, onSpeakEnd, onWordBoundary } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [config, setConfig] = useState<TTSConfig>(() => ({
    ...getDefaultTTSConfig(),
    ...options.config,
  }));

  const cancelRef = useRef<(() => void) | null>(null);
  const isSupported = isTTSSupported();

  // Load voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const available = getAvailableVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported]);

  const speak = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Cancel any current speech
      cancelRef.current?.();
      setIsSpeaking(true);

      try {
        if (config.provider === 'elevenlabs' && config.elevenLabsApiKey && config.elevenLabsVoiceId) {
          // ElevenLabs TTS
          const result = await speakWithElevenLabs(
            text,
            config.elevenLabsApiKey,
            config.elevenLabsVoiceId,
            () => onSpeakStart?.(),
            () => {
              setIsSpeaking(false);
              onSpeakEnd?.();
            }
          );
          cancelRef.current = result.cancel;
        } else {
          // Browser TTS
          const result = speakWithBrowserTTS(
            text,
            config,
            () => onSpeakStart?.(),
            () => {
              setIsSpeaking(false);
              onSpeakEnd?.();
            },
            onWordBoundary
          );
          cancelRef.current = result.cancel;
          await result.promise;
        }
      } catch (error) {
        console.error('[TTS] Error:', error);
        setIsSpeaking(false);
        onSpeakEnd?.();
      }
    },
    [config, onSpeakStart, onSpeakEnd, onWordBoundary]
  );

  const cancel = useCallback(() => {
    cancelRef.current?.();
    setIsSpeaking(false);
    onSpeakEnd?.();
  }, [onSpeakEnd]);

  const updateConfig = useCallback((update: Partial<TTSConfig>) => {
    setConfig(prev => ({ ...prev, ...update }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelRef.current?.();
      if (isSupported) {
        speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    isSpeaking,
    isSupported,
    voices,
    config,
    speak,
    cancel,
    updateConfig,
  };
}
