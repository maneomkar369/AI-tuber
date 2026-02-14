import { motion } from 'framer-motion';
import type { RelationshipState, Memory } from '../types';
import { getRelationshipTier } from '../utils/emotionDetector';

interface RelationshipPanelProps {
  relationship: RelationshipState;
  memories: Memory[];
  onClose: () => void;
}

export default function RelationshipPanel({
  relationship,
  memories,
  onClose,
}: RelationshipPanelProps) {
  const tierInfo = getRelationshipTier(relationship.affection);

  const recentMemories = memories
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="absolute inset-0 z-50 glass-strong flex flex-col overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between relative border-b border-miya-border/20">
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500/25 to-sakura-500/20 flex items-center justify-center border border-teal-500/30 shadow-lg shadow-teal-500/10">
            <span className="text-xl">💝</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-miya-text tracking-tight">रिश्ता</h2>
            <p className="text-xs text-miya-muted/70 font-medium">Relationship Status</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.08, rotate: 90 }}
          whileTap={{ scale: 0.92 }}
          onClick={onClose}
          className="w-9 h-9 rounded-xl glass glass-hover flex items-center justify-center text-miya-muted hover:text-white cursor-pointer transition-all duration-300 text-base shadow-lg"
        >
          ✕
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Relationship Tier */}
        <div className="relative glass rounded-3xl p-6 text-center overflow-hidden shadow-xl border border-miya-border/30">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/8 to-sakura-500/5" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />
          <div className="relative">
            <div className="text-3xl mb-3 font-bold tracking-tight" style={{ color: tierInfo.color }}>
              {tierInfo.label}
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-miya-muted/80 font-medium">
              <span className="flex items-center gap-1.5 bg-miya-surface/40 px-3 py-1.5 rounded-full">
                <span className="text-xs">📅</span>
                {relationship.daysKnown} दिन
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-miya-border/50" />
              <span className="flex items-center gap-1.5 bg-miya-surface/40 px-3 py-1.5 rounded-full">
                <span className="text-xs">💬</span>
                {relationship.totalMessages} संदेश
              </span>
            </div>
          </div>
        </div>

        {/* Stat Bars */}
        <div className="space-y-3">
          <StatBar
            label="प्यार (Affection)"
            value={relationship.affection}
            color="from-sakura-500 to-rose-400"
            bgColor="sakura"
            emoji="💕"
          />
          <StatBar
            label="भरोसा (Trust)"
            value={relationship.trust}
            color="from-lavender-500 to-blue-400"
            bgColor="lavender"
            emoji="🤝"
          />
          <StatBar
            label="करीबी (Intimacy)"
            value={relationship.intimacy}
            color="from-purple-500 to-pink-400"
            bgColor="purple"
            emoji="💖"
          />
        </div>

        {/* Milestones */}
        <div className="glass rounded-3xl p-5 shadow-xl border border-miya-border/30">
          <h3 className="text-xs font-bold text-miya-muted/70 mb-4 uppercase tracking-[0.15em] flex items-center gap-2.5">
            <span className="text-base">🏆</span> Milestones
          </h3>
          <div className="space-y-1.5">
            <MilestoneItem
              unlocked={relationship.totalMessages >= 1}
              label="पहली बात"
              desc="First conversation"
              icon="💬"
            />
            <MilestoneItem
              unlocked={relationship.totalMessages >= 10}
              label="नई दोस्ती"
              desc="10 messages exchanged"
              icon="🤝"
            />
            <MilestoneItem
              unlocked={relationship.totalMessages >= 50}
              label="अच्छे दोस्त"
              desc="50 messages exchanged"
              icon="💛"
            />
            <MilestoneItem
              unlocked={relationship.affection >= 50}
              label="दिल करीब"
              desc="Affection reached 50"
              icon="💗"
            />
            <MilestoneItem
              unlocked={relationship.affection >= 80}
              label="सच्चा प्यार"
              desc="Affection reached 80"
              icon="💕"
            />
            <MilestoneItem
              unlocked={relationship.trust >= 70}
              label="पूरा भरोसा"
              desc="Trust reached 70"
              icon="🔐"
            />
          </div>
        </div>

        {/* Memories */}
        {recentMemories.length > 0 && (
          <div className="glass rounded-3xl p-5 shadow-xl border border-miya-border/30">
            <h3 className="text-xs font-bold text-miya-muted/70 mb-4 uppercase tracking-[0.15em] flex items-center gap-2.5">
              <span className="text-base">🧠</span> Miya को याद है...
            </h3>
            <div className="space-y-2">
              {recentMemories.map((mem) => (
                <div
                  key={mem.id}
                  className="text-sm text-miya-text/90 bg-miya-surface/50 rounded-xl px-4 py-3 flex items-start gap-3 border border-miya-border/20 hover:border-miya-border/40 transition-all duration-300 hover:bg-miya-surface/70"
                >
                  <span className="text-sm mt-0.5 shrink-0">
                    {mem.type === 'fact' ? '📌' : mem.type === 'preference' ? '⭐' : '💭'}
                  </span>
                  <span className="leading-relaxed">{mem.content}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StatBar({
  label,
  value,
  color,
  bgColor,
  emoji,
}: {
  label: string;
  value: number;
  color: string;
  bgColor: string;
  emoji: string;
}) {
  const glowMap: Record<string, string> = {
    sakura: 'rgba(0, 255, 204, 0.15)',
    lavender: 'rgba(0, 184, 255, 0.15)',
    purple: 'rgba(77, 210, 255, 0.15)',
  };

  return (
    <div className="glass rounded-2xl p-4 shadow-lg border border-miya-border/30">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-miya-text/80 flex items-center gap-2 font-medium">
          <span className="text-sm">{emoji}</span> {label}
        </span>
        <span className="text-sm font-bold text-cyber-300 tabular-nums">{value}/100</span>
      </div>
      <div className="w-full h-3 bg-miya-surface/80 rounded-full overflow-hidden relative shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${color} relative`}
          style={{ boxShadow: `0 0 16px ${glowMap[bgColor]}` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}

function MilestoneItem({
  unlocked,
  label,
  desc,
  icon,
}: {
  unlocked: boolean;
  label: string;
  desc: string;
  icon: string;
}) {
  return (
    <div
      className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-300 ${
        unlocked ? 'bg-cyber-600/10 border border-cyber-500/20 shadow-md' : 'opacity-40'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-lg ${
          unlocked
            ? 'bg-gradient-to-br from-cyber-500/25 to-teal-500/25 border border-cyber-500/30'
            : 'bg-miya-surface/50 border border-miya-border/30'
        }`}
      >
        {unlocked ? icon : '🔒'}
      </div>
      <div>
        <div className="text-sm font-semibold text-miya-text/90">{label}</div>
        <div className="text-xs text-miya-muted/70">{desc}</div>
      </div>
      {unlocked && (
        <div className="ml-auto text-green-400/70 text-sm font-bold">✓</div>
      )}
    </div>
  );
}
