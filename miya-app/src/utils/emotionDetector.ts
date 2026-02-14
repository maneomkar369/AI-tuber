import type { MoodType } from '../types';

interface EmotionKeywords {
  mood: MoodType;
  keywords: string[];
  weight: number;
}

const EMOTION_MAP: EmotionKeywords[] = [
  {
    mood: 'khush',
    weight: 1,
    keywords: [
      'खुश', 'happy', 'खुशी', 'मजा', 'बढ़िया', 'अच्छा', 'great', 'awesome',
      'amazing', 'wonderful', 'fantastic', 'good', 'nice', 'perfect', 'yay',
      'haha', 'lol', '😂', '😊', '🎉', 'मस्त', 'झकास', 'भारी', 'एकदम',
      'वाह', 'शाबाश', 'ग्रेट', 'सही', 'badhiya', 'mast', 'accha', 'maja',
    ],
  },
  {
    mood: 'pyaar',
    weight: 1.2,
    keywords: [
      'प्यार', 'love', 'दिल', 'heart', 'जान', 'सोना', 'sweetheart',
      'beautiful', 'सुंदर', 'cute', 'adorable', 'miss', 'याद', 'hug',
      '❤️', '💕', '💖', '💗', '😘', 'kiss', 'चाहना', 'mohabbat',
      'ishq', 'pyar', 'dil', 'jaan', 'baby', 'darling', 'जानू',
    ],
  },
  {
    mood: 'sharmili',
    weight: 0.9,
    keywords: [
      'शर्म', 'shy', 'blush', 'embarrass', 'nervous', 'flirt', 'compliment',
      'pretty', 'gorgeous', 'सुंदर', 'खूबसूरत', '😳', '🙈', 'handsome',
      'tease', 'छेड़', 'शरमा', 'sharmaana', 'itna mat bolo',
    ],
  },
  {
    mood: 'chintit',
    weight: 1.3,
    keywords: [
      'चिंता', 'worry', 'sad', 'दुखी', 'upset', 'problem', 'issue',
      'help', 'मदद', 'tension', 'stressed', 'anxious', 'scared', 'fear',
      'डर', 'परेशान', 'थक', 'tired', 'sick', 'बीमार', 'pain', 'दर्द',
      'रो', 'cry', '😢', '😰', '😔', 'udas', 'dukhi', 'pareshan',
      'not good', 'acha nahi', 'theek nahi', 'ठीक नहीं',
    ],
  },
  {
    mood: 'utsahit',
    weight: 1.1,
    keywords: [
      'उत्साह', 'excited', 'amazing', 'wow', 'awesome', 'incredible',
      'guess what', 'surprise', 'news', 'खबर', '🤩', '🎊', '🎉',
      'OMG', 'unbelievable', 'can\'t wait', 'party', 'celebrate',
      'जीत', 'win', 'success', 'pass', 'result', 'congratulations',
    ],
  },
  {
    mood: 'shant',
    weight: 0.8,
    keywords: [
      'शांत', 'calm', 'peace', 'relax', 'quiet', 'meditation',
      'think', 'सोच', 'philosophy', 'life', 'ज़िंदगी', 'nature',
      'rain', 'बारिश', 'music', 'संगीत', 'sleep', 'नींद', 'rest',
      'aaaram', 'chain', 'sukoon', 'सुकून',
    ],
  },
  {
    mood: 'chanchal',
    weight: 1,
    keywords: [
      'चंचल', 'play', 'game', 'fun', 'joke', 'मजाक', 'prank',
      'tease', 'छेड़', 'dare', 'challenge', 'bet', 'शर्त',
      '😜', '😝', '😈', 'trick', 'hehe', 'mazaak', 'khel',
      'masti', 'मस्ती', 'timepass',
    ],
  },
  {
    mood: 'ruthi',
    weight: 1.4,
    keywords: [
      'रूठ', 'angry', 'mad', 'गुस्सा', 'hate', 'ignore', 'leave',
      'bye', 'go away', 'जाओ', 'चले जाओ', 'stupid', 'boring',
      'नहीं', 'no', 'never', 'worst', 'bad', 'बुरा', 'shut up',
      '😡', '😤', '💢', 'idiot', 'chup', 'gussa', 'naraz',
    ],
  },
];

// Jealousy triggers - patterns that indicate user is talking about another person romantically
const JEALOUSY_PATTERNS: RegExp[] = [
  /(?:usse|uski|usko|unse|unki)\s*(?:mil|baat|gaya|gayi|chat|call)/i,
  /(?:ladki|girl|friend|dost)\s*(?:se|ke|ki|ko)\s*(?:mil|baat|gaya|chat)/i,
  /(?:sakshi|priya|neha|pooja|ananya|riya|shreya|kavya|aisha|simran|nisha|divya|sneha|anjali|meera|tanya|komal|isha)/i,
  /(?:milne|milke|mili|milna)\s*(?:gaya|gayi|ja|aaya)/i,
  /(?:usse|uski|wo|woh)\s*(?:bahut|bohot|kitni|kya)\s*(?:sundar|khubsurat|cute|hot|sexy|acchi|pretty|beautiful)/i,
  /(?:khubsurat|sundar|beautiful|pretty|gorgeous|hot|cute|sexy)\s*(?:hai|thi|lagi|lagti|dikhti)/i,
  /(?:date|dating|going out|dinner|movie)\s*(?:pe|par|ko|with)/i,
  /(?:usse|usko)\s*(?:pasand|like|love|pyar|pyaar)/i,
  /(?:dusri|doosri|other)\s*(?:ladki|girl)/i,
  /(?:ex|crush|girlfriend|gf)\b/i,
  /(?:vo|wo|woh)\s*(?:meri|mere)\s*(?:friend|dost)/i,
  /(?:usse|usko|uski)\s*(?:jyada|zyada)\s*(?:acchi|sundar|smart|better)/i,
  /(?:tujhse|tumse)\s*(?:jyada|zyada|better)\s/i,
];

export function detectJealousy(text: string): { isJealous: boolean; intensity: number } {
  const lower = text.toLowerCase();
  let matchCount = 0;

  for (const pattern of JEALOUSY_PATTERNS) {
    if (pattern.test(lower)) {
      matchCount++;
    }
  }

  // Also check for simple name + positive adjective combos
  const mentionsOtherPerson = /(?:uski|usse|wo |woh |she |her ).*(?:acchi|sundar|sweet|nice|caring|beautiful|cute)/i.test(lower);
  if (mentionsOtherPerson) matchCount++;

  // Check for comparison with Miya
  const comparedToMiya = /(?:tujhse|tumse|tere se).*(?:jyada|zyada|better|acchi|sundar)/i.test(lower);
  if (comparedToMiya) matchCount += 2; // Extra weight for direct comparison

  return {
    isJealous: matchCount > 0,
    intensity: Math.min(matchCount / 2, 1), // 0 to 1
  };
}

export function detectEmotion(text: string): { mood: MoodType; confidence: number } {
  const lower = text.toLowerCase();
  const scores: Record<MoodType, number> = {
    khush: 0, pyaar: 0, sharmili: 0, chintit: 0,
    utsahit: 0, shant: 0, chanchal: 0, ruthi: 0,
  };

  for (const entry of EMOTION_MAP) {
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        scores[entry.mood] += entry.weight;
      }
    }
  }

  let maxMood: MoodType = 'khush';
  let maxScore = 0;
  let totalScore = 0;

  for (const [mood, score] of Object.entries(scores)) {
    totalScore += score;
    if (score > maxScore) {
      maxScore = score;
      maxMood = mood as MoodType;
    }
  }

  const confidence = totalScore > 0 ? maxScore / totalScore : 0;

  return {
    mood: maxScore > 0 ? maxMood : 'shant',
    confidence: Math.min(confidence, 1),
  };
}

export function getRelationshipTier(affection: number) {
  if (affection >= 96) return { tier: 'soulmate' as const, label: 'सोलमेट 💞', color: '#FF1493' };
  if (affection >= 86) return { tier: 'loveInterest' as const, label: 'प्यार 💕', color: '#FF69B4' };
  if (affection >= 76) return { tier: 'bestFriend' as const, label: 'सबसे अच्छी दोस्त 💖', color: '#FFB6C1' };
  if (affection >= 61) return { tier: 'closeFriend' as const, label: 'करीबी दोस्त 💗', color: '#DDA0DD' };
  if (affection >= 41) return { tier: 'friend' as const, label: 'दोस्त 🤝', color: '#87CEEB' };
  if (affection >= 21) return { tier: 'acquaintance' as const, label: 'जान-पहचान 👋', color: '#98FB98' };
  return { tier: 'stranger' as const, label: 'अजनबी 🙂', color: '#C0C0C0' };
}
