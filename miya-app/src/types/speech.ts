// ===== Speech Types =====

export interface SpeechRecognitionState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
}

export interface SpeechSynthesisState {
  isSpeaking: boolean;
  isPaused: boolean;
  error: string | null;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
}

export interface TTSConfig {
  /** TTS provider: browser built-in or elevenlabs API */
  provider: 'browser' | 'elevenlabs';
  /** Voice name for browser TTS */
  browserVoiceName?: string;
  /** ElevenLabs API key */
  elevenLabsApiKey?: string;
  /** ElevenLabs voice ID */
  elevenLabsVoiceId?: string;
  /** Speaking rate (0.5-2.0) */
  rate: number;
  /** Pitch (0.5-2.0) */
  pitch: number;
  /** Volume (0-1) */
  volume: number;
  /** Language for speech recognition */
  recognitionLang: string;
}

/** Extends SpeechRecognition for TypeScript */
export interface WebSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}
