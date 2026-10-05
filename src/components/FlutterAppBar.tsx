import React from 'react';
import { ShieldCheck, Volume2, VolumeX, Sparkles, Orbit, Cpu, Settings, Globe, Smartphone } from 'lucide-react';
import { Language, CadetProfile, SUPPORTED_LANGUAGES } from '../types/mission';
import { translations } from '../services/localization';
import { sound } from '../services/soundEffects';

interface FlutterAppBarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  useBengaliDigits: boolean;
  onBengaliDigitsToggle: () => void;
  cadet: CadetProfile;
  isMuted: boolean;
  onMuteToggle: () => void;
  onOpenTeeVault: () => void;
  onOpenFlightDirector: () => void;
  onOpenNasaDataCenter: () => void;
  onOpenSettings: () => void;
  onOpenApkDownload: () => void;
}

export const FlutterAppBar: React.FC<FlutterAppBarProps> = ({
  language,
  onLanguageChange,
  useBengaliDigits,
  onBengaliDigitsToggle,
  cadet,
  isMuted,
  onMuteToggle,
  onOpenTeeVault,
  onOpenFlightDirector,
  onOpenNasaDataCenter,
  onOpenSettings,
  onOpenApkDownload,
}) => {
  const t = translations[language] || translations['en'];
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0f1d]/90 backdrop-blur-md border-b border-cyan-500/20 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Leading: Astronaut Icon & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={onOpenTeeVault}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-400 p-[2px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0b1329] rounded-[10px] flex items-center justify-center">
                <Orbit className="w-5 h-5 text-cyan-400 animate-spin-slow group-hover:scale-110 transition-transform" />
              </div>
            </div>
            {/* TEE Enclave verification status dot */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0a0f1d]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base tracking-wide bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                {t.appTitle}
              </h1>
              <span className="hidden md:inline-flex items-center text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                SPARRSO • NASA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Center / Right: Cadet Badge & TEE Status */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* NASA Real-Time Feeds Pill Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenNasaDataCenter();
            }}
            title="Real-Time NASA Telemetry Operations"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition-all text-xs font-mono shadow-sm hover:shadow-cyan-500/20 active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden lg:inline text-[11px] font-semibold">NASA LIVE</span>
            <span className="lg:hidden text-[10px]">NASA</span>
          </button>

          {/* TEE Enclave Pill Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTeeVault();
            }}
            title={t.teeTooltip}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-all text-xs font-mono shadow-sm hover:shadow-emerald-500/20 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline text-[11px] font-semibold">{t.teeBadge}</span>
            <span className="lg:hidden text-[10px]">TEE</span>
          </button>

          {/* AI Flight Director Quick Button with High Thinking Pill */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenFlightDirector();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-purple-500/40 text-purple-300 hover:border-purple-400 hover:bg-purple-900/40 transition-all text-xs font-mono active:scale-95 group shadow-sm"
          >
            <Cpu className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline font-semibold">Gemini 3.1</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200 border border-purple-400/30">
              THINKING
            </span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => {
              onMuteToggle();
              sound.playClick();
            }}
            aria-label="Toggle Sound"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Android APK Download Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenApkDownload();
            }}
            title="Download Android APK (v4.2.0 Universal Signed)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 transition-all text-xs font-mono shadow-sm hover:shadow-emerald-500/20 active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-bold text-[11px]">APK</span>
            <span className="hidden md:inline text-[9px] px-1 py-0.2 bg-emerald-500/20 rounded text-emerald-200">
              v4.2
            </span>
          </button>

          {/* Settings & Language Mode Modal Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            title="Settings: All Languages & OpenCode Themes"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 transition-all text-xs font-mono active:scale-95"
          >
            <span className="text-sm">{currentLang.flag}</span>
            <span className="font-bold uppercase text-[11px]">{currentLang.code}</span>
            <Settings className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Cadet Rank Indicator */}
          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-700/60">
            <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 text-xs font-bold font-mono">
              {cadet.callsign.slice(0, 2)}
            </div>
            <div className="text-left text-[11px] leading-tight">
              <span className="block font-semibold text-slate-200">{cadet.callsign}</span>
              <span className="text-cyan-400 font-mono text-[10px]">
                {language === 'bn' ? cadet.rankBn : cadet.rank}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
