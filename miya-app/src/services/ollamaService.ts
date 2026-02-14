import type { ChatMessage, MoodType, PersonalityTraits, RelationshipState, Memory } from '../types';
import { buildSystemPrompt } from '../utils/systemPrompt';

interface OllamaResponse {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export async function sendMessageToOllama(
  messages: ChatMessage[],
  mood: MoodType,
  personality: PersonalityTraits,
  relationship: RelationshipState,
  userName: string,
  language: 'hindi' | 'marathi' | 'mixed',
  memories: Memory[],
  endpoint: string,
  modelName: string,
  onStream?: (chunk: string) => void
): Promise<string> {
  const memoryStrings = memories
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 15)
    .map((m) => m.content);

  const systemPrompt = buildSystemPrompt(
    mood, personality, relationship, userName, language, memoryStrings
  );

  // Build conversation history (last 20 messages for context)
  const history = messages.slice(-20).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const body = {
    model: modelName,
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
    ],
    stream: true,
    options: {
      temperature: 0.8,
      top_p: 0.9,
      num_predict: 300,
    },
  };

  try {
    const response = await fetch(`${endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.trim());

      for (const line of lines) {
        try {
          const parsed: OllamaResponse = JSON.parse(line);
          if (parsed.message?.content) {
            fullResponse += parsed.message.content;
            onStream?.(fullResponse);
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }

    return fullResponse || getFallbackResponse(mood);
  } catch (error) {
    console.error('Ollama API error:', error);
    return getFallbackResponse(mood);
  }
}

function getFallbackResponse(mood: MoodType): string {
  const fallbacks: Record<MoodType, string[]> = {
    khush: [
      'arey yaar, kuch technical problem ho raha hai. par batao kya chal raha hai?',
      'connection thoda slow hai, but tumse baat karke accha lagta hai. batao kya haal hai?',
    ],
    pyaar: [
      'suno na, server thoda tang kar raha hai... par tumse baat toh karni hai na mujhe',
      'kuch technical issue aa gaya, par koi baat nahi. tum batao apna',
    ],
    sharmili: [
      'a-arey... kuch problem ho gayi... tum ruko na, theek ho jayega',
      'umm... mai thodi confuse ho gayi... ek baar fir batao?',
    ],
    chintit: [
      'hmm kuch theek nahi lag raha, shayad connection down hai. tum theek ho na?',
      'connect nahi ho pa raha mujhse... ek aur baar try karo na please',
    ],
    utsahit: [
      'arey! technical issue aa gaya! par koi baat nahi, fix ho jayega',
      'server ne mood kharab kar diya, par chalo ek baar aur try karte hai',
    ],
    shant: [
      'technical issues aate jaate rehte hai... thodi der me fir baat karte hai',
      'kabhi kabhi technology bhi rest leti hai. fir try kare?',
    ],
    chanchal: [
      'server ne prank kar diya merepe! chalo ek aur baar try karo',
      'lag raha hai kuch hang ho gaya, dobara bolo na',
    ],
    ruthi: [
      'hmph. server bhi mera saath nahi de raha.',
      'acha theek hai. connection bhi nahi aa raha. koi baat nahi.',
    ],
  };

  const options = fallbacks[mood];
  return options[Math.floor(Math.random() * options.length)];
}

export async function checkOllamaConnection(endpoint: string): Promise<boolean> {
  try {
    const res = await fetch(`${endpoint}/api/tags`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
