// ===== Mood Types =====
export type MoodType =
  | 'khush'      // खुश - Cheerful
  | 'pyaar'      // प्यार - Loving
  | 'sharmili'   // शरमीली - Shy
  | 'chintit'    // चिंतित - Worried
  | 'utsahit'    // उत्साहित - Excited
  | 'shant'      // शांत - Calm
  | 'chanchal'   // चंचल - Playful
  | 'ruthi';     // रूठी - Pouty

export interface MoodConfig {
  id: MoodType;
  label: string;
  hindiLabel: string;
  emoji: string;
  color: string;
  bgGradient: string;
  avatarExpression: AvatarExpression;
  description: string;
}

// ===== Avatar Types =====
export type AvatarExpression = 
  | 'happy' | 'loving' | 'shy' | 'worried' 
  | 'excited' | 'calm' | 'playful' | 'pouty';

export interface AvatarState {
  expression: AvatarExpression;
  isBlinking: boolean;
  isTalking: boolean;
  blushIntensity: number; // 0-1
}

// ===== Chat Types =====
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  mood?: MoodType;
  emotion?: string;
}

// ===== Relationship Types =====
export type RelationshipTier = 
  | 'stranger' | 'acquaintance' | 'friend' 
  | 'closeFriend' | 'bestFriend' | 'loveInterest' | 'soulmate';

export interface RelationshipState {
  affection: number;       // 0-100
  trust: number;           // 0-100
  intimacy: number;        // 0-100
  tier: RelationshipTier;
  daysKnown: number;
  lastInteraction: number;
  totalMessages: number;
}

// ===== Personality Types =====
export interface PersonalityTraits {
  cheerfulness: number;    // 0-100
  shyness: number;         // 0-100
  playfulness: number;     // 0-100
  intelligence: number;    // 0-100
  caring: number;          // 0-100
  possessiveness: number;  // 0-100
}

// ===== Memory Types =====
export interface Memory {
  id: string;
  type: 'fact' | 'preference' | 'event' | 'emotion' | 'joke';
  content: string;
  timestamp: number;
  importance: number; // 1-10
}

// ===== Settings Types =====
export interface UserSettings {
  userName: string;
  language: 'hindi' | 'marathi' | 'mixed';
  theme: 'dark' | 'light';
  avatarStyle: number;
  ollamaEndpoint: string;
  modelName: string;
  // Voice settings
  voiceEnabled: boolean;
  ttsProvider: 'browser' | 'elevenlabs';
  ttsRate: number;
  ttsPitch: number;
  ttsVolume: number;
  elevenLabsApiKey: string;
  elevenLabsVoiceId: string;
  recognitionLang: string;
  // Live2D settings
  live2dModelPath: string;
  live2dScale: number;
}

// ===== Store Types =====
export interface MiyaStore {
  // Chat
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (msg: ChatMessage) => void;
  setTyping: (v: boolean) => void;
  clearMessages: () => void;

  // Mood
  currentMood: MoodType;
  moodHistory: { mood: MoodType; timestamp: number }[];
  setMood: (mood: MoodType) => void;

  // Relationship
  relationship: RelationshipState;
  updateAffection: (delta: number) => void;
  updateTrust: (delta: number) => void;

  // Personality
  personality: PersonalityTraits;
  setPersonality: (traits: Partial<PersonalityTraits>) => void;

  // Memory
  memories: Memory[];
  addMemory: (m: Memory) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (s: Partial<UserSettings>) => void;

  // UI
  showSettings: boolean;
  showRelationship: boolean;
  toggleSettings: () => void;
  toggleRelationship: () => void;
}
