import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMiyaStore } from './store/useMiyaStore';
import { useMiyaChat } from './hooks/useMiyaChat';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import Live2DCanvas from './components/Live2DCanvas';
import VoiceControls from './components/VoiceControls';
import SubtitleOverlay from './components/SubtitleOverlay';
import ChatInterface from './components/ChatInterface';
import RelationshipPanel from './components/RelationshipPanel';
import SettingsPanel from './components/SettingsPanel';
import ParticleBackground from './components/ParticleBackground';
import FloatingMenu from './components/FloatingMenu';
import { getRelationshipTier } from './utils/emotionDetector';
import { MOOD_CONFIGS } from './utils/moodConfig';

function App() {
  const {
    currentMood,
    relationship, memories,
    personality, setPersonality,
    settings, updateSettings,
    clearMessages,
    isTyping,
    messages,
  } = useMiyaStore();

  const { sendMessage } = useMiyaChat();
  const [streamingText, setStreamingText] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitleText, setSubtitleText] = useState('');
  const [subtitleSpeaker, setSubtitleSpeaker] = useState<'user' | 'miya' | null>(null);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const lastResponseRef = useRef('');

  // Speech Recognition
  const {
    isListening,
    interimTranscript,
    isSupported: isSTTSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    lang: settings.language === 'hindi' ? 'hi-IN' : settings.language === 'marathi' ? 'mr-IN' : 'hi-IN',
    onFinalTranscript: (text) => {
      // Auto-send recognized speech as message
      handleSendMessage(text);
      setSubtitleText(text);
      setSubtitleSpeaker('user');
      setShowSubtitle(true);
    },
  });

  // Speech Synthesis (TTS)
  const {
    isSpeaking,
    isSupported: isTTSSupported,
    speak,
    cancel: cancelSpeech,
  } = useSpeechSynthesis({
    onSpeakStart: () => {
      setSubtitleText(lastResponseRef.current);
      setSubtitleSpeaker('miya');
      setShowSubtitle(true);
    },
    onSpeakEnd: () => {
      setTimeout(() => setShowSubtitle(false), 2000);
    },
  });

  const handleSendMessage = useCallback(
    async (text: string) => {
      setStreamingText('');
      await sendMessage(text, (chunk) => {
        setStreamingText(chunk);
        lastResponseRef.current = chunk;
      });
      setStreamingText('');

      // Speak the response if not muted
      if (!isMuted && lastResponseRef.current) {
        speak(lastResponseRef.current);
      }
    },
    [sendMessage, isMuted, speak]
  );

  const handleToggleListen = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      cancelSpeech(); // Stop speaking when user starts talking
      startListening();
    }
  }, [isListening, startListening, stopListening, cancelSpeech]);

  const handleToggleMute = useCallback(() => {
    if (!isMuted) {
      cancelSpeech();
    }
    setIsMuted(prev => !prev);
  }, [isMuted, cancelSpeech]);

  const moodConfig = MOOD_CONFIGS[currentMood];
  const tierInfo = getRelationshipTier(relationship.affection);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-miya-bg noise-overlay">
      {/* Background */}
      <ParticleBackground />

      {/* Ambient mood layers */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[2000ms]"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 45%, ${moodConfig.color}08, transparent 70%),
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 75, 75, 0.06), transparent 65%),
            radial-gradient(circle at 80% 20%, rgba(255, 100, 50, 0.04), transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(211, 47, 47, 0.05), transparent 50%)
          `,
        }}
      />

      {/* Main Content - Full Screen Live2D / Avatar */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <div className="relative">
          {/* Dramatic Backlight Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
              style={{
                background: 'radial-gradient(circle, rgba(255, 75, 75, 0.25) 0%, rgba(255, 100, 50, 0.15) 30%, transparent 60%)',
                filter: 'blur(60px)',
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]"
              style={{
                background: 'radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, rgba(255, 140, 100, 0.2) 35%, transparent 65%)',
                filter: 'blur(40px)',
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]"
              style={{
                background: 'radial-gradient(circle, rgba(211, 47, 47, 0.2) 0%, rgba(255, 107, 107, 0.1) 40%, transparent 70%)',
                filter: 'blur(30px)',
              }}
            />
          </div>

          {/* Live2D Canvas (falls back to SVG avatar automatically) */}
          <Live2DCanvas
            mood={currentMood}
            isTyping={isTyping}
            isSpeaking={isSpeaking}
            width={600}
            height={600}
          />

          {/* Status Badge - Top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2"
          >
            <div className="glass rounded-full px-5 py-2.5 flex items-center gap-3">
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <div className="absolute w-2.5 h-2.5 rounded-full bg-teal-400" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping opacity-50" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold bg-gradient-to-r from-cyber-300 to-teal-400 bg-clip-text text-transparent">
                  Miya
                </span>
                <span className="text-xs text-miya-muted">•</span>
                <span className="text-xs font-medium" style={{ color: tierInfo.color }}>
                  {tierInfo.label}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Voice Controls - Below avatar */}
        <div className="mt-4">
          <VoiceControls
            isListening={isListening}
            isSpeaking={isSpeaking}
            isMuted={isMuted}
            isSTTSupported={isSTTSupported}
            isTTSSupported={isTTSSupported}
            interimTranscript={interimTranscript}
            onToggleListen={handleToggleListen}
            onToggleMute={handleToggleMute}
          />
        </div>
      </div>

      {/* Subtitle Overlay */}
      <SubtitleOverlay
        text={subtitleText}
        speaker={subtitleSpeaker}
        visible={showSubtitle}
        autoHideMs={6000}
      />

      {/* Floating Menu */}
      <FloatingMenu
        onChatOpen={() => setShowChat(true)}
        onSettingsOpen={() => setShowSettings(true)}
        onProfileOpen={() => setShowProfile(true)}
      />

      {/* Overlay Panels */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full md:w-[480px] glass-strong z-40 flex flex-col"
            style={{ boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.3)' }}
          >
            {/* Chat Header */}
            <div className="p-5 flex items-center justify-between relative">
              <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-cyber-500/20 to-transparent" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-500 to-teal-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-cyber-600/20">
                  み
                </div>
                <div>
                  <h2 className="text-base font-semibold text-miya-text">Miya Chat</h2>
                  <div className="flex items-center gap-2 text-xs text-miya-muted">
                    <span className="flex items-center gap-1">
                      💕 {relationship.affection}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      💬 {relationship.totalMessages}
                    </span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowChat(false)}
                className="w-9 h-9 rounded-lg glass glass-hover flex items-center justify-center text-miya-muted hover:text-white cursor-pointer transition-colors"
              >
                ✕
              </motion.button>
            </div>

            {/* Chat Interface */}
            <ChatInterface
              messages={messages}
              isTyping={isTyping}
              streamingText={streamingText}
              onSendMessage={handleSendMessage}
            />
          </motion.div>
        )}

        {showProfile && (
          <RelationshipPanel
            relationship={relationship}
            memories={memories}
            onClose={() => setShowProfile(false)}
          />
        )}

        {showSettings && (
          <SettingsPanel
            settings={settings}
            personality={personality}
            onUpdateSettings={updateSettings}
            onUpdatePersonality={setPersonality}
            onClearChat={clearMessages}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
