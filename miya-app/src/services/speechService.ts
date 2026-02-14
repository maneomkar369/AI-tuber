/**
 * Speech Service
 * Handles both speech recognition (STT) and text-to-speech (TTS).
 * Uses browser-native Web Speech API with optional ElevenLabs integration.
 */

import type { TTSConfig } from '../types/speech';

// ═══════════════════════════════════════════════════════════
//  Speech Recognition (STT)
// ═══════════════════════════════════════════════════════════

const SpeechRecognitionAPI =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export function isSpeechRecognitionSupported(): boolean {
  return !!SpeechRecognitionAPI;
}

export function createSpeechRecognition(
  lang: string = 'hi-IN',
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void
): { start: () => void; stop: () => void; abort: () => void } | null {
  if (!SpeechRecognitionAPI) {
    onError('Speech recognition not supported in this browser');
    return null;
  }

  const recognition = new SpeechRecognitionAPI();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = lang;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    if (finalTranscript) {
      onResult(finalTranscript.trim(), true);
    } else if (interimTranscript) {
      onResult(interimTranscript.trim(), false);
    }
  };

  recognition.onerror = (event: any) => {
    const errorMsg =
      event.error === 'no-speech' ? 'No speech detected'
      : event.error === 'audio-capture' ? 'No microphone found'
      : event.error === 'not-allowed' ? 'Microphone permission denied'
      : `Speech error: ${event.error}`;
    onError(errorMsg);
  };

  recognition.onend = () => {
    onEnd();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        // Already started - ignore
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {
        // Not started - ignore
      }
    },
    abort: () => {
      try {
        recognition.abort();
      } catch (e) {
        // Not started - ignore
      }
    },
  };
}

// ═══════════════════════════════════════════════════════════
//  Text-to-Speech (TTS)
// ═══════════════════════════════════════════════════════════

export function isTTSSupported(): boolean {
  return 'speechSynthesis' in window;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  return speechSynthesis.getVoices();
}

/**
 * Find the best voice for Hindi/Indian English
 */
export function findBestVoice(voiceName?: string): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();

  // If specific voice name requested
  if (voiceName) {
    const match = voices.find(v => v.name === voiceName);
    if (match) return match;
  }

  // Priority: Hindi voice > Indian English > any female English voice
  const priorities = [
    (v: SpeechSynthesisVoice) => v.lang.startsWith('hi'),
    (v: SpeechSynthesisVoice) => v.lang === 'en-IN',
    (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('female') && v.lang.startsWith('en'),
    (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('zira'),
    (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('google') && v.lang.startsWith('en'),
    (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
  ];

  for (const criterion of priorities) {
    const found = voices.find(criterion);
    if (found) return found;
  }

  return voices[0] || null;
}

/**
 * Speak text using browser TTS
 * Returns a Promise that resolves when speaking completes.
 * Also provides callbacks for lip sync integration.
 */
export function speakWithBrowserTTS(
  text: string,
  config: TTSConfig,
  onStart?: () => void,
  onEnd?: () => void,
  onBoundary?: (charIndex: number, charLength: number) => void
): { cancel: () => void; promise: Promise<void> } {
  const utterance = new SpeechSynthesisUtterance(text);

  const voice = findBestVoice(config.browserVoiceName);
  if (voice) utterance.voice = voice;

  utterance.rate = config.rate;
  utterance.pitch = config.pitch;
  utterance.volume = config.volume;
  utterance.lang = 'hi-IN';

  const promise = new Promise<void>((resolve, reject) => {
    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      onEnd?.();
      resolve();
    };

    utterance.onerror = (event) => {
      onEnd?.();
      if (event.error !== 'canceled') {
        reject(new Error(`TTS Error: ${event.error}`));
      } else {
        resolve();
      }
    };

    utterance.onboundary = (event) => {
      onBoundary?.(event.charIndex, event.charLength);
    };

    // Cancel any current speech first
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  });

  return {
    cancel: () => {
      speechSynthesis.cancel();
    },
    promise,
  };
}

/**
 * Speak text using ElevenLabs API
 * Returns audio element for lip sync integration
 */
export async function speakWithElevenLabs(
  text: string,
  apiKey: string,
  voiceId: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<{ audio: HTMLAudioElement; cancel: () => void }> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);

  audio.onplay = () => onStart?.();
  audio.onended = () => {
    onEnd?.();
    URL.revokeObjectURL(audioUrl);
  };
  audio.onerror = () => {
    onEnd?.();
    URL.revokeObjectURL(audioUrl);
  };

  audio.play();

  return {
    audio,
    cancel: () => {
      audio.pause();
      audio.currentTime = 0;
      URL.revokeObjectURL(audioUrl);
      onEnd?.();
    },
  };
}

/**
 * Default TTS configuration
 */
export function getDefaultTTSConfig(): TTSConfig {
  return {
    provider: 'browser',
    rate: 1.0,
    pitch: 1.2, // Slightly higher for anime/cute voice
    volume: 0.8,
    recognitionLang: 'hi-IN',
  };
}
