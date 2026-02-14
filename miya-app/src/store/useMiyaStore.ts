import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  MiyaStore, ChatMessage, MoodType, PersonalityTraits,
  RelationshipState, Memory, UserSettings,
} from '../types';

const defaultRelationship: RelationshipState = {
  affection: 30,
  trust: 20,
  intimacy: 10,
  tier: 'acquaintance',
  daysKnown: 1,
  lastInteraction: Date.now(),
  totalMessages: 0,
};

const defaultPersonality: PersonalityTraits = {
  cheerfulness: 75,
  shyness: 60,
  playfulness: 70,
  intelligence: 80,
  caring: 85,
  possessiveness: 40,
};

const defaultSettings: UserSettings = {
  userName: '',
  language: 'mixed',
  theme: 'dark',
  avatarStyle: 0,
  ollamaEndpoint: 'http://localhost:11434',
  modelName: 'llama3:8b',
  // Voice defaults
  voiceEnabled: true,
  ttsProvider: 'browser',
  ttsRate: 1.0,
  ttsPitch: 1.2,
  ttsVolume: 0.8,
  elevenLabsApiKey: '',
  elevenLabsVoiceId: '',
  recognitionLang: 'hi-IN',
  // Live2D defaults
  live2dModelPath: '/live2d/miya/miya.model3.json',
  live2dScale: 0.25,
};

export const useMiyaStore = create<MiyaStore>()(
  persist(
    (set) => ({
      // Chat
      messages: [],
      isTyping: false,
      addMessage: (msg: ChatMessage) =>
        set((s) => ({
          messages: [...s.messages, msg],
          relationship: {
            ...s.relationship,
            totalMessages: s.relationship.totalMessages + 1,
            lastInteraction: Date.now(),
          },
        })),
      setTyping: (v: boolean) => set({ isTyping: v }),
      clearMessages: () => set({ messages: [] }),

      // Mood
      currentMood: 'khush' as MoodType,
      moodHistory: [],
      setMood: (mood: MoodType) =>
        set((s) => ({
          currentMood: mood,
          moodHistory: [
            ...s.moodHistory.slice(-50),
            { mood, timestamp: Date.now() },
          ],
        })),

      // Relationship
      relationship: defaultRelationship,
      updateAffection: (delta: number) =>
        set((s) => {
          const newAff = Math.max(0, Math.min(100, s.relationship.affection + delta));
          let tier = s.relationship.tier;
          if (newAff >= 96) tier = 'soulmate';
          else if (newAff >= 86) tier = 'loveInterest';
          else if (newAff >= 76) tier = 'bestFriend';
          else if (newAff >= 61) tier = 'closeFriend';
          else if (newAff >= 41) tier = 'friend';
          else if (newAff >= 21) tier = 'acquaintance';
          else tier = 'stranger';
          return { relationship: { ...s.relationship, affection: newAff, tier } };
        }),
      updateTrust: (delta: number) =>
        set((s) => ({
          relationship: {
            ...s.relationship,
            trust: Math.max(0, Math.min(100, s.relationship.trust + delta)),
          },
        })),

      // Personality
      personality: defaultPersonality,
      setPersonality: (traits: Partial<PersonalityTraits>) =>
        set((s) => ({ personality: { ...s.personality, ...traits } })),

      // Memory
      memories: [],
      addMemory: (m: Memory) =>
        set((s) => ({ memories: [...s.memories.slice(-100), m] })),

      // Settings
      settings: defaultSettings,
      updateSettings: (s: Partial<UserSettings>) =>
        set((state) => ({ settings: { ...state.settings, ...s } })),

      // UI
      showSettings: false,
      showRelationship: false,
      toggleSettings: () => set((s) => ({ showSettings: !s.showSettings, showRelationship: false })),
      toggleRelationship: () => set((s) => ({ showRelationship: !s.showRelationship, showSettings: false })),
    }),
    {
      name: 'miya-store',
      partialize: (state) => ({
        messages: state.messages.slice(-100),
        currentMood: state.currentMood,
        moodHistory: state.moodHistory.slice(-50),
        relationship: state.relationship,
        personality: state.personality,
        memories: state.memories,
        settings: state.settings,
      }),
    }
  )
);
