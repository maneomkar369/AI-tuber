import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage } from '../types';
import { MOOD_CONFIGS } from '../utils/moodConfig';

interface ChatBubbleProps {
  message: ChatMessage;
  isLast?: boolean;
}

function ChatBubble({ message, isLast }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const moodConfig = message.mood ? MOOD_CONFIGS[message.mood] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}
    >
      {/* Miya avatar */}
      {!isUser && (
        <div className="relative mr-3 mt-auto shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber-500 to-teal-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-cyber-600/30">
            み
          </div>
          {isLast && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-miya-bg shadow-lg shadow-green-400/30" />
          )}
        </div>
      )}

      {/* Bubble */}
      <div className="max-w-[80%] relative">
        {/* Mood tag - floating above */}
        {!isUser && moodConfig && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 mb-2 ml-1.5"
          >
            <span className="text-xs">{moodConfig.emoji}</span>
            <span className="text-xs font-semibold" style={{ color: `${moodConfig.color}99` }}>
              {moodConfig.hindiLabel}
            </span>
          </motion.div>
        )}

        <div
          className={`rounded-2xl px-4 py-3.5 relative overflow-hidden shadow-lg ${
            isUser
              ? 'bg-gradient-to-br from-cyber-600/95 to-cyber-700/85 text-white rounded-br-md backdrop-blur-sm border border-cyber-500/25 shadow-cyber-600/20'
              : 'glass-strong rounded-bl-md border border-miya-border/30'
          }`}
        >
          {/* Subtle shimmer line on Miya messages */}
          {!isUser && (
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, ${moodConfig?.color ?? '#8b5cf6'}40, transparent)` }}
            />
          )}

          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>

          <span className={`text-xs mt-2 block text-right ${isUser ? 'text-white/50' : 'text-miya-muted/60'}`}>
            {new Date(message.timestamp).toLocaleTimeString('hi-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-sm font-bold ml-3 mt-auto shrink-0 shadow-lg shadow-teal-600/30">
          あ
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 mb-4"
    >
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber-500 to-teal-500 flex items-center justify-center text-sm font-bold shrink-0 shadow-lg shadow-cyber-600/30">
        み
      </div>
      <div className="glass-strong rounded-2xl rounded-bl-md px-5 py-3.5 shadow-lg border border-miya-border/30">
        <div className="flex gap-2 items-center h-5">
          <span className="text-xs text-miya-muted/70 mr-2 font-medium">Miya सोच रही है</span>
          <div className="w-2 h-2 rounded-full bg-cyber-400 typing-dot-1" />
          <div className="w-2 h-2 rounded-full bg-teal-400 typing-dot-2" />
          <div className="w-2 h-2 rounded-full bg-cyber-400 typing-dot-3" />
        </div>
      </div>
    </motion.div>
  );
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isTyping: boolean;
  streamingText: string;
  onSendMessage: (text: string) => void;
}

export default function ChatInterface({
  messages,
  isTyping,
  streamingText,
  onSendMessage,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, streamingText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input || !input.value.trim()) return;
    onSendMessage(input.value.trim());
    input.value = '';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-0.5">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            {/* Hero icon */}
            <div className="relative mb-8">
              <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-lavender-500/25 to-sakura-500/25 rounded-full" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-lavender-500/15 to-sakura-500/15 border-2 border-lavender-500/25 flex items-center justify-center shadow-2xl">
                <span className="text-4xl">🌸</span>
              </div>
            </div>

            <h3 className="text-xl font-bold bg-gradient-to-r from-cyber-300 to-teal-400 bg-clip-text text-transparent mb-3">
              Miya से बात करो!
            </h3>
            <p className="text-base text-miya-muted/80 max-w-[320px] leading-relaxed">
              नमस्ते! मैं Miya हूँ, तुम्हारी AI companion। हिंदी, मराठी या English में बात करो!
            </p>

            <div className="flex flex-wrap gap-2.5 mt-8 justify-center max-w-md">
              {[
                { text: 'नमस्ते Miya! 🌸', icon: '👋' },
                { text: 'कैसी हो आज?', icon: '💬' },
                { text: 'Tell me about yourself', icon: '✨' },
                { text: 'कुछ मज़ेदार बताओ!', icon: '😄' },
              ].map((suggestion) => (
                <motion.button
                  key={suggestion.text}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSendMessage(suggestion.text)}
                  className="glass glass-hover rounded-xl px-4 py-3 text-sm text-cyber-300 cursor-pointer flex items-center gap-2 group/s shadow-lg border border-miya-border/20 font-medium"
                >
                  <span className="opacity-60 group-hover/s:opacity-100 transition-opacity text-xs">{suggestion.icon}</span>
                  {suggestion.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isLast={i === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}

        {/* Streaming response */}
        {isTyping && streamingText && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber-500 to-teal-500 flex items-center justify-center text-sm font-bold mr-3 mt-auto shrink-0 shadow-lg shadow-cyber-600/30">
              み
            </div>
            <div className="max-w-[80%] glass-strong rounded-2xl rounded-bl-md px-4 py-3.5 relative overflow-hidden shadow-lg border border-miya-border/30">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-500/40 to-transparent" />
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{streamingText}</p>
              <span className="inline-block w-0.5 h-5 bg-cyber-400 ml-0.5 animate-pulse rounded-full shadow-lg shadow-cyber-400/50" />
            </div>
          </motion.div>
        )}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && !streamingText && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-5 relative border-t border-miya-border/20">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-miya-border/30 to-transparent" />
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative group">
            <input
              ref={inputRef}
              type="text"
              placeholder="Miya से कुछ कहो..."
              className="w-full glass-strong rounded-2xl px-5 py-4 text-base text-miya-text placeholder-miya-muted/40 outline-none input-glow transition-all duration-300 shadow-lg border border-miya-border/30"
              disabled={isTyping}
            />
            {/* Focus ring subtle glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyber-500/0 via-cyber-500/8 to-teal-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            disabled={isTyping}
            className="btn-primary rounded-2xl px-6 py-4 text-base font-semibold flex items-center gap-2 shadow-xl"
          >
            <span>भेजो</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </motion.button>
        </div>
      </form>
    </div>
  );
}
