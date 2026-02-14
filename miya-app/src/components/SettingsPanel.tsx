import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { UserSettings, PersonalityTraits } from '../types';
import { checkOllamaConnection } from '../services/ollamaService';

interface SettingsPanelProps {
  settings: UserSettings;
  personality: PersonalityTraits;
  onUpdateSettings: (s: Partial<UserSettings>) => void;
  onUpdatePersonality: (p: Partial<PersonalityTraits>) => void;
  onClearChat: () => void;
  onClose: () => void;
}

export default function SettingsPanel({
  settings,
  personality,
  onUpdateSettings,
  onUpdatePersonality,
  onClearChat,
  onClose,
}: SettingsPanelProps) {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    const ok = await checkOllamaConnection(settings.ollamaEndpoint);
    setConnected(ok);
    setChecking(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

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
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-500/30 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyber-500/25 to-lavender-500/20 flex items-center justify-center border border-cyber-500/30 shadow-lg shadow-cyber-500/10">
            <span className="text-xl">⚙️</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-miya-text tracking-tight">सेटिंग्स</h2>
            <p className="text-xs text-miya-muted/70 font-medium">Settings</p>
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
        {/* Connection Status */}
        <div className="glass rounded-3xl p-5 shadow-xl border border-miya-border/30">
          <h3 className="text-xs font-bold text-miya-muted/70 mb-4 uppercase tracking-[0.15em] flex items-center gap-2.5">
            <span className="text-base">🔗</span> Ollama Connection
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-miya-muted/80 block mb-2 font-semibold">API Endpoint</label>
              <input
                type="text"
                value={settings.ollamaEndpoint}
                onChange={(e) => onUpdateSettings({ ollamaEndpoint: e.target.value })}
                className="w-full bg-miya-surface/70 rounded-xl px-4 py-3 text-sm text-miya-text outline-none border border-miya-border/30 input-glow transition-all duration-300 shadow-inner"
              />
            </div>
            <div>
              <label className="text-xs text-miya-muted/80 block mb-2 font-semibold">Model Name</label>
              <input
                type="text"
                value={settings.modelName}
                onChange={(e) => onUpdateSettings({ modelName: e.target.value })}
                className="w-full bg-miya-surface/70 rounded-xl px-4 py-3 text-sm text-miya-text outline-none border border-miya-border/30 input-glow transition-all duration-300 shadow-inner"
              />
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-miya-surface/50 border border-miya-border/20 shadow-inner">
              <div className="relative">
                <div
                  className={`w-3 h-3 rounded-full shadow-lg ${
                    connected === null
                      ? 'bg-yellow-400 shadow-yellow-400/30'
                      : connected
                      ? 'bg-green-400 shadow-green-400/30'
                      : 'bg-red-400 shadow-red-400/30'
                  }`}
                />
                {connected && (
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-50" />
                )}
              </div>
              <span className="text-sm text-miya-text/80 flex-1 font-medium">
                {checking
                  ? 'Checking...'
                  : connected === null
                  ? 'Unknown'
                  : connected
                  ? 'Connected'
                  : 'Not connected'}
              </span>
              <button
                onClick={checkConnection}
                className="text-xs text-cyber-400 hover:text-cyber-300 cursor-pointer font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-cyber-500/10"
              >
                Retry
              </button>
            </div>
          </div>
        </div>

        {/* User Settings */}
        <div className="glass rounded-3xl p-5 shadow-xl border border-miya-border/30">
          <h3 className="text-xs font-bold text-miya-muted/70 mb-4 uppercase tracking-[0.15em] flex items-center gap-2.5">
            <span className="text-base">👤</span> Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-miya-muted/80 block mb-2 font-semibold">तुम्हारा नाम</label>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) => onUpdateSettings({ userName: e.target.value })}
                placeholder="अपना नाम बताओ..."
                className="w-full bg-miya-surface/70 rounded-xl px-4 py-3 text-sm text-miya-text outline-none border border-miya-border/30 input-glow transition-all duration-300 placeholder-miya-muted/30 shadow-inner"
              />
            </div>
            <div>
              <label className="text-xs text-miya-muted/80 block mb-2 font-semibold">भाषा / Language</label>
              <div className="grid grid-cols-3 gap-2">
                {(['hindi', 'marathi', 'mixed'] as const).map((lang) => (
                  <motion.button
                    key={lang}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onUpdateSettings({ language: lang })}
                    className={`py-3 rounded-xl text-sm cursor-pointer transition-all duration-300 font-semibold shadow-md ${
                      settings.language === lang
                        ? 'btn-primary'
                        : 'bg-miya-surface/60 text-miya-muted hover:bg-miya-surface border border-miya-border/20 hover:border-miya-border/40'
                    }`}
                  >
                    {lang === 'hindi' ? 'हिंदी' : lang === 'marathi' ? 'मराठी' : 'Mixed'}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Personality Sliders */}
        <div className="glass rounded-3xl p-5 shadow-xl border border-miya-border/30">
          <h3 className="text-xs font-bold text-miya-muted/70 mb-4 uppercase tracking-[0.15em] flex items-center gap-2.5">
            <span className="text-base">🎭</span> Miya का स्वभाव
          </h3>
          <div className="space-y-4">
            <PersonalitySlider
              label="खुशमिज़ाज़ (Cheerfulness)"
              value={personality.cheerfulness}
              onChange={(v) => onUpdatePersonality({ cheerfulness: v })}
            />
            <PersonalitySlider
              label="शर्मीली (Shyness)"
              value={personality.shyness}
              onChange={(v) => onUpdatePersonality({ shyness: v })}
            />
            <PersonalitySlider
              label="चंचल (Playfulness)"
              value={personality.playfulness}
              onChange={(v) => onUpdatePersonality({ playfulness: v })}
            />
            <PersonalitySlider
              label="बुद्धिमान (Intelligence)"
              value={personality.intelligence}
              onChange={(v) => onUpdatePersonality({ intelligence: v })}
            />
            <PersonalitySlider
              label="देखभाल (Caring)"
              value={personality.caring}
              onChange={(v) => onUpdatePersonality({ caring: v })}
            />
            <PersonalitySlider
              label="Possessive (Possessiveness)"
              value={personality.possessiveness}
              onChange={(v) => onUpdatePersonality({ possessiveness: v })}
            />
          </div>
        </div>

        {/* Voice & Live2D Settings */}
        <div className="glass rounded-3xl p-5 border border-teal-500/15 shadow-xl">
          <h3 className="text-xs font-bold text-teal-300/90 mb-4 uppercase tracking-[0.15em] flex items-center gap-2.5">
            <span className="text-base">🎤</span> Voice & Live2D
          </h3>
          <div className="space-y-3.5">
            {/* Voice Enabled Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-miya-muted">Voice Reply</label>
              <button
                onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  settings.voiceEnabled ? 'bg-teal-500' : 'bg-miya-border/40'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings.voiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* TTS Provider */}
            <div>
              <label className="text-xs text-miya-muted mb-1 block">TTS Provider</label>
              <select
                value={settings.ttsProvider}
                onChange={(e) => onUpdateSettings({ ttsProvider: e.target.value as 'browser' | 'elevenlabs' })}
                className="w-full bg-miya-surface/60 border border-miya-border/30 rounded-xl py-2.5 px-3 text-sm text-miya-text focus:outline-none focus:border-teal-500/50"
              >
                <option value="browser">Browser (Free)</option>
                <option value="elevenlabs">ElevenLabs</option>
              </select>
            </div>

            {/* ElevenLabs settings */}
            {settings.ttsProvider === 'elevenlabs' && (
              <>
                <input
                  type="password"
                  placeholder="ElevenLabs API Key"
                  value={settings.elevenLabsApiKey}
                  onChange={(e) => onUpdateSettings({ elevenLabsApiKey: e.target.value })}
                  className="w-full bg-miya-surface/60 border border-miya-border/30 rounded-xl py-2.5 px-3 text-sm text-miya-text focus:outline-none focus:border-teal-500/50"
                />
                <input
                  type="text"
                  placeholder="Voice ID"
                  value={settings.elevenLabsVoiceId}
                  onChange={(e) => onUpdateSettings({ elevenLabsVoiceId: e.target.value })}
                  className="w-full bg-miya-surface/60 border border-miya-border/30 rounded-xl py-2.5 px-3 text-sm text-miya-text focus:outline-none focus:border-teal-500/50"
                />
              </>
            )}

            {/* Speech Rate & Pitch */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-miya-muted mb-1 block">Speed: {settings.ttsRate.toFixed(1)}x</label>
                <input
                  type="range" min="0.5" max="2" step="0.1"
                  value={settings.ttsRate}
                  onChange={(e) => onUpdateSettings({ ttsRate: parseFloat(e.target.value) })}
                  className="w-full accent-teal-500"
                />
              </div>
              <div>
                <label className="text-xs text-miya-muted mb-1 block">Pitch: {settings.ttsPitch.toFixed(1)}</label>
                <input
                  type="range" min="0.5" max="2" step="0.1"
                  value={settings.ttsPitch}
                  onChange={(e) => onUpdateSettings({ ttsPitch: parseFloat(e.target.value) })}
                  className="w-full accent-teal-500"
                />
              </div>
            </div>

            {/* Recognition Language */}
            <div>
              <label className="text-xs text-miya-muted mb-1 block">Speech Recognition Language</label>
              <select
                value={settings.recognitionLang}
                onChange={(e) => onUpdateSettings({ recognitionLang: e.target.value })}
                className="w-full bg-miya-surface/60 border border-miya-border/30 rounded-xl py-2.5 px-3 text-sm text-miya-text focus:outline-none focus:border-teal-500/50"
              >
                <option value="hi-IN">Hindi</option>
                <option value="mr-IN">Marathi</option>
                <option value="en-IN">English (India)</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>

            {/* Live2D Model Path */}
            <div>
              <label className="text-xs text-miya-muted mb-1 block">Live2D Model Path</label>
              <input
                type="text"
                value={settings.live2dModelPath}
                onChange={(e) => onUpdateSettings({ live2dModelPath: e.target.value })}
                className="w-full bg-miya-surface/60 border border-miya-border/30 rounded-xl py-2.5 px-3 text-sm text-miya-text font-mono text-xs focus:outline-none focus:border-teal-500/50"
                placeholder="/live2d/miya/miya.model3.json"
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass rounded-3xl p-5 border border-red-500/20 shadow-xl">
          <h3 className="text-xs font-bold text-red-400/90 mb-3 uppercase tracking-[0.15em] flex items-center gap-2.5">
            <span className="text-base">⚠️</span> Danger Zone
          </h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (confirm('सारी चैट डिलीट हो जाएगी। पक्का?')) {
                onClearChat();
              }
            }}
            className="w-full py-3 rounded-xl text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 cursor-pointer transition-all duration-300 border border-red-500/15 hover:border-red-500/30 font-semibold shadow-lg"
          >
            🗑️ सारी चैट मिटाओ (Clear All Chat)
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function PersonalitySlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs text-miya-text/80 font-semibold">{label}</span>
        <span className="text-sm text-lavender-300 font-bold tabular-nums">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-miya-surface/80 rounded-full appearance-none cursor-pointer shadow-inner
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-gradient-to-r
          [&::-webkit-slider-thumb]:from-lavender-500
          [&::-webkit-slider-thumb]:to-sakura-500
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:shadow-lavender-600/40
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:duration-200
          [&::-webkit-slider-thumb]:hover:scale-125
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-miya-bg"
      />
    </div>
  );
}
