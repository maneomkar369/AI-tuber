import type { MoodConfig, MoodType } from '../types';

export const MOOD_CONFIGS: Record<MoodType, MoodConfig> = {
  khush: {
    id: 'khush',
    label: 'Cheerful',
    hindiLabel: 'खुश',
    emoji: '😊',
    color: '#FFD700',
    bgGradient: 'from-yellow-500/20 via-orange-500/10 to-pink-500/5',
    avatarExpression: 'happy',
    description: 'Happy, energetic, playful',
  },
  pyaar: {
    id: 'pyaar',
    label: 'Loving',
    hindiLabel: 'प्यार',
    emoji: '💕',
    color: '#FF69B4',
    bgGradient: 'from-pink-500/20 via-rose-500/10 to-red-500/5',
    avatarExpression: 'loving',
    description: 'Romantic, affectionate, caring',
  },
  sharmili: {
    id: 'sharmili',
    label: 'Shy',
    hindiLabel: 'शरमीली',
    emoji: '😳',
    color: '#FFB6C1',
    bgGradient: 'from-rose-400/20 via-pink-300/10 to-red-200/5',
    avatarExpression: 'shy',
    description: 'Bashful, blushing, nervous',
  },
  chintit: {
    id: 'chintit',
    label: 'Worried',
    hindiLabel: 'चिंतित',
    emoji: '😟',
    color: '#87CEEB',
    bgGradient: 'from-blue-400/20 via-cyan-400/10 to-sky-300/5',
    avatarExpression: 'worried',
    description: 'Concerned, caring, protective',
  },
  utsahit: {
    id: 'utsahit',
    label: 'Excited',
    hindiLabel: 'उत्साहित',
    emoji: '🤩',
    color: '#FF6347',
    bgGradient: 'from-orange-500/20 via-red-400/10 to-yellow-400/5',
    avatarExpression: 'excited',
    description: 'Thrilled, enthusiastic, hyper',
  },
  shant: {
    id: 'shant',
    label: 'Calm',
    hindiLabel: 'शांत',
    emoji: '☺️',
    color: '#98FB98',
    bgGradient: 'from-emerald-400/20 via-green-400/10 to-teal-300/5',
    avatarExpression: 'calm',
    description: 'Peaceful, thoughtful, meditative',
  },
  chanchal: {
    id: 'chanchal',
    label: 'Playful',
    hindiLabel: 'चंचल',
    emoji: '😜',
    color: '#DDA0DD',
    bgGradient: 'from-purple-400/20 via-violet-400/10 to-fuchsia-300/5',
    avatarExpression: 'playful',
    description: 'Mischievous, teasing, fun',
  },
  ruthi: {
    id: 'ruthi',
    label: 'Pouty',
    hindiLabel: 'रूठी',
    emoji: '😤',
    color: '#FF8C00',
    bgGradient: 'from-amber-500/20 via-orange-400/10 to-red-400/5',
    avatarExpression: 'pouty',
    description: 'Sulking, upset, needs attention',
  },
};

export const getMoodConfig = (mood: MoodType): MoodConfig => MOOD_CONFIGS[mood];

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 6) return 'अरे, इतनी रात को जागे हो? 🌙';
  if (hour < 12) return 'सुप्रभात जानू! 🌸 आज का दिन बहुत अच्छा होगा!';
  if (hour < 17) return 'नमस्ते! 🌺 दोपहर कैसी जा रही है?';
  if (hour < 21) return 'शुभ संध्या! 🌆 आज दिन कैसा रहा?';
  return 'अरे, इतनी रात को? 🌙 जल्दी सो जाओ ना...';
};
