import React, { useState } from 'react';
import { Cpu, Send, Sparkles, Bot, User, Brain, AlertCircle, CheckCircle } from 'lucide-react';
import { Language, ChatMessage } from '../types/mission';
import { translations } from '../services/localization';
import { sound } from '../services/soundEffects';

interface AiFlightDirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AiFlightDirectorModal: React.FC<AiFlightDirectorModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = translations[language].flightDirector;

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'orion',
      text:
        language === 'bn'
          ? 'নমস্কার ক্যাডেট! আমি ফ্লাইট ডিরেক্টর আকাশ। মহাকাশ মিশনের কক্ষপথীয় মেকানিক্স, ডেল্টা-ভি বাজেট, বঙ্গবন্ধু স্যাটেলাইট-১ টেলিমেট্রি বা টিইই সিকিউরিটি বিষয়ে আপনার যেকোনো জটিল প্রশ্ন করুন। আমার হাই-থিংকিং এআই ইঞ্জিন প্রস্তুত!'
          : 'Cadet, greetings from Space Mission Control. I am Flight Director Orion. Ask me any complex challenge regarding orbital mechanics, Hohmann transfers, Bangabandhu Satellite-1 telemetry, or TEE hardware isolation. High Reasoning mode is fully online!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isOpen) return null;

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    sound.playClick();
    const cadetMsg: ChatMessage = {
      id: `cadet-${Date.now()}`,
      sender: 'cadet',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, cadetMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const resp = await fetch('/api/gemini/flight-director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          language,
          missionContext: {
            organization: 'SPARRSO / NASA Junior Astronaut Academy',
            teeEnabled: true,
          },
        }),
      });

      const data = await resp.json();
      sound.playRadarPing();

      const orionMsg: ChatMessage = {
        id: `orion-${Date.now()}`,
        sender: 'orion',
        text: data.answer || 'Mission Control link established. Flight parameters verified.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, orionMsg]);
    } catch (_err) {
      sound.playWarning();
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'orion',
        text:
          language === 'bn'
            ? 'ব্যাকআপ রেডিও লিংকে মেসেজ গ্রহণ করা হয়েছে। ক্যাডেট, আপনার ডেল্টা-ভি এবং কক্ষপথীয় ট্র্যাজেক্টরি নিরাপদ।'
            : 'Backup radio link engaged. Cadet, maintain orbital insertion vectors and monitor TEE registers.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl h-[85vh] flex flex-col bg-[#090d1a] border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-900 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-400/50 flex items-center justify-center text-purple-300">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {t.title}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-purple-900/80 text-purple-200 border border-purple-400/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-300" />
                  HIGH THINKING
                </span>
              </div>
              <p className="text-xs text-purple-300/80">{t.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Preset Prompt Recommendations */}
        <div className="p-3 bg-black/40 border-b border-slate-800/80 overflow-x-auto scrollbar-none flex gap-2 shrink-0">
          <span className="text-[11px] font-mono text-purple-300/80 whitespace-nowrap self-center mr-1">
            {t.suggestedQuestions}
          </span>
          {t.presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(preset)}
              className="px-2.5 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-mono whitespace-nowrap active:scale-95 transition-all text-left"
            >
              {preset.length > 45 ? `${preset.slice(0, 45)}...` : preset}
            </button>
          ))}
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isOrion = msg.sender === 'orion';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isOrion ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isOrion
                      ? 'bg-purple-950 border border-purple-500/50 text-purple-300'
                      : 'bg-cyan-950 border border-cyan-500/50 text-cyan-300'
                  }`}
                >
                  {isOrion ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isOrion
                      ? 'bg-slate-900/90 border border-purple-500/30 text-slate-200 shadow-md'
                      : 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-100 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-[10px] font-mono text-slate-400">
                    <span className="font-semibold text-purple-300">
                      {isOrion ? (language === 'bn' ? 'ফ্লাইট ডিরেক্টর আকাশ' : 'Flight Director Orion') : 'Cadet'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {/* Thinking Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-300">
                <Brain className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-xs font-mono text-purple-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>
                  {language === 'bn'
                    ? 'জেমিনি ৩.১ প্রো গভীর যুক্তি বিশ্লেষণ করছে (ThinkingLevel.HIGH)...'
                    : 'Gemini 3.1 Pro performing multi-step reasoning (ThinkingLevel.HIGH)...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-black/60 border-t border-purple-500/20 flex gap-2 items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendQuery();
            }}
            placeholder={t.promptPlaceholder}
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => handleSendQuery()}
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t.consultBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
