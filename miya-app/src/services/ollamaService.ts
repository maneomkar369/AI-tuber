import { Ollama } from 'ollama/browser';
import type { ChatMessage, MoodType, PersonalityTraits, RelationshipState, Memory } from '../types';
import { buildSystemPrompt } from '../utils/systemPrompt';

// Create a configurable Ollama client instance
let ollamaClient: Ollama = new Ollama({ host: 'http://localhost:11434' });

/**
 * Update the Ollama client when the endpoint changes
 */
export function setOllamaEndpoint(endpoint: string): void {
  ollamaClient = new Ollama({ host: endpoint });
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
  // Update client if endpoint changed
  setOllamaEndpoint(endpoint);

  const memoryStrings = memories
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 15)
    .map((m) => m.content);

  const systemPrompt = buildSystemPrompt(
    mood, personality, relationship, userName, language, memoryStrings
  );

  // Build conversation history (last 20 messages for context)
  const history = messages.slice(-20).map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  try {
    const response = await ollamaClient.chat({
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
    });

    let fullResponse = '';

    for await (const chunk of response) {
      if (chunk.message?.content) {
        fullResponse += chunk.message.content;
        onStream?.(fullResponse);
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
    const client = new Ollama({ host: endpoint });
    await client.list();
    return true;
  } catch {
    return false;
  }
}
