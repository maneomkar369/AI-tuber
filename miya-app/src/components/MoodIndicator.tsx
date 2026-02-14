import { motion } from 'framer-motion';
import type { MoodType } from '../types';
import { MOOD_CONFIGS } from '../utils/moodConfig';

interface MoodIndicatorProps {
  currentMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
}

export default function MoodIndicator({ currentMood, onMoodChange }: MoodIndicatorProps) {
  const moods = Object.values(MOOD_CONFIGS);

  return (
    <div>
      <h3 className="text-[10px] font-semibold text-miya-muted/60 mb-2.5 uppercase tracking-[0.15em] px-1">
        Miya का मूड
      </h3>
      <div className="grid grid-cols-4 gap-1.5">
        {moods.map((mood) => {
          const isActive = currentMood === mood.id;
          return (
            <motion.button
              key={mood.id}
              onClick={() => onMoodChange(mood.id)}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className={`relative flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'glass-strong shadow-lg'
                  : 'hover:bg-miya-surface/40'
              }`}
              style={isActive ? {
                boxShadow: `0 4px 20px ${mood.color}20, 0 0 30px ${mood.color}10`,
                borderColor: `${mood.color}30`,
              } : {}}
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="moodActive"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                  style={{ background: mood.color }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              <span className={`text-lg transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {mood.emoji}
              </span>
              <span className={`text-[9px] font-medium transition-colors duration-200 ${
                isActive ? 'text-miya-text' : 'text-miya-muted/60'
              }`}>
                {mood.hindiLabel}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
