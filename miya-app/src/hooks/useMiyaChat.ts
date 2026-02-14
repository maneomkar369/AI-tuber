import { useCallback } from 'react';
import type { ChatMessage, MoodType } from '../types';
import { useMiyaStore } from '../store/useMiyaStore';
import { sendMessageToOllama } from '../services/ollamaService';
import { detectEmotion, detectJealousy } from '../utils/emotionDetector';

export function useMiyaChat() {
  const {
    messages, addMessage, setTyping, isTyping,
    currentMood, setMood,
    relationship, updateAffection, updateTrust,
    personality,
    memories, addMemory,
    settings,
  } = useMiyaStore();

  const sendMessage = useCallback(
    async (text: string, onStream?: (chunk: string) => void) => {
      if (isTyping || !text.trim()) return;

      // Add user message
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };
      addMessage(userMsg);

      // Check for jealousy triggers FIRST (highest priority)
      const jealousyResult = detectJealousy(text);

      if (jealousyResult.isJealous) {
        // Snap to ruthi immediately - no gradual transition
        setMood('ruthi');
        // Jealousy DECREASES affection and trust
        updateAffection(-2 * jealousyResult.intensity);
        updateTrust(-1 * jealousyResult.intensity);
      } else {
        // Normal emotion detection
        const { mood: detectedMood, confidence } = detectEmotion(text);

        if (confidence > 0.3) {
          const reactMood = getReactiveMood(detectedMood, currentMood);
          setMood(reactMood);
        }

        // Only increase affection for non-jealousy interactions
        updateAffection(0.5);
        updateTrust(0.3);
      }

      // Try to extract memories from user message
      extractMemories(text, addMemory);

      // Get AI response
      setTyping(true);
      try {
        const allMessages = [...messages, userMsg];
        const response = await sendMessageToOllama(
          allMessages,
          currentMood,
          personality,
          relationship,
          settings.userName,
          settings.language,
          memories,
          settings.ollamaEndpoint,
          settings.modelName,
          onStream
        );

        const assistantMsg: ChatMessage = {
          id: `miya-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
          mood: currentMood,
        };
        addMessage(assistantMsg);
      } finally {
        setTyping(false);
      }
    },
    [
      messages, addMessage, setTyping, isTyping,
      currentMood, setMood, relationship, updateAffection, updateTrust,
      personality, memories, addMemory, settings,
    ]
  );

  return { sendMessage, isTyping, messages, currentMood };
}

function getReactiveMood(userMood: MoodType, currentMood: MoodType): MoodType {
  // Miya reacts emotionally to user's detected mood
  const reactions: Record<MoodType, MoodType[]> = {
    khush: ['khush', 'utsahit', 'chanchal'],     // Happy user → Miya is happy/excited
    pyaar: ['pyaar', 'sharmili'],                  // Loving user → Miya is loving/shy
    sharmili: ['chanchal', 'pyaar'],               // Shy user → Miya is playful/loving
    chintit: ['chintit', 'pyaar'],                 // Worried user → Miya is worried/caring
    utsahit: ['utsahit', 'khush'],                 // Excited user → Miya is excited/happy
    shant: ['shant', 'pyaar'],                     // Calm user → Miya is calm/loving
    chanchal: ['chanchal', 'khush'],               // Playful user → Miya is playful/happy
    ruthi: ['chintit', 'pyaar'],                   // Angry user → Miya is worried/caring
  };

  const options = reactions[userMood] || [currentMood];
  return options[Math.floor(Math.random() * options.length)];
}

function extractMemories(
  text: string,
  addMemory: (m: { id: string; type: 'fact' | 'preference' | 'event'; content: string; timestamp: number; importance: number }) => void
) {
  const lower = text.toLowerCase();

  // Name detection
  const nameMatch = text.match(/(?:मेरा नाम|my name is|i'm|i am|मैं )\s*(.{2,20}?)(?:\s|$|\.)/i);
  if (nameMatch) {
    addMemory({
      id: `mem-${Date.now()}-name`,
      type: 'fact',
      content: `User's name might be: ${nameMatch[1]}`,
      timestamp: Date.now(),
      importance: 9,
    });
  }

  // Like/dislike detection
  const likeMatch = text.match(/(?:मुझे|i like|i love|favourite|favorite|पसंद)\s+(.{2,30}?)(?:\s|$|\.)/i);
  if (likeMatch) {
    addMemory({
      id: `mem-${Date.now()}-like`,
      type: 'preference',
      content: `User likes: ${likeMatch[1]}`,
      timestamp: Date.now(),
      importance: 7,
    });
  }

  // Sad/problem detection
  if (lower.match(/(?:problem|issue|sad|दुखी|परेशान|tension|stressed)/)) {
    addMemory({
      id: `mem-${Date.now()}-emotion`,
      type: 'event',
      content: `User seemed stressed/sad at this time`,
      timestamp: Date.now(),
      importance: 6,
    });
  }
}
