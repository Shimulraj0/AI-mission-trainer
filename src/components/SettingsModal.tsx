import React, { useState } from 'react';
import { 
  Settings, Globe, Palette, Volume2, VolumeX, Check, 
  Terminal, ShieldCheck, Sparkles, Search, Sliders,
  Smartphone, Download, Copy, CheckCircle2, Zap
} from 'lucide-react';
import { Language, SUPPORTED_LANGUAGES, LanguageOption } from '../types/mission';
import { translations } from '../services/localization';
import { sound } from '../services/soundEffects';
import { themeService, OPENCODE_THEMES, CliTheme } from '../services/themeService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  useBengaliDigits: boolean;
  onBengaliDigitsToggle: () => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  currentTheme: CliTheme;
  onThemeChange: (themeId: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  useBengaliDigits,
  onBengaliDigitsToggle,
  isMuted,
  onMuteToggle,
  currentTheme,
  onThemeChange,
}) => {
  const t = translations[language].settings;

  const [activeTab, setActiveTab] = useState<'language' | 'theme' | 'audio' | 'apk'>('language');
  const [langSearch, setLangSearch] = useState('');
  const [themeCategory, setThemeCategory] = useState<'all' | 'cyber' | 'neon' | 'retro' | 'arctic' | 'matrix'>('all');
  const [copiedSha, setCopiedSha] = useState(false);

  if (!isOpen) return null;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.region.toLowerCase().includes(langSearch.toLowerCase())
  );

  const filteredThemes = OPENCODE_THEMES.filter(
    (th) => themeCategory === 'all' || th.category === themeCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#080d1c] border border-cyan-500/40 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {t.title}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                  v4.2.0
                </span>
              </h2>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Settings Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('language');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'language'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t.languageTitle}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('theme');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'theme'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{t.themeTitle}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('audio');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'audio'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio & FX</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('apk');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'apk'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/30'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Android APK</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              v4.2
            </span>
          </button>
        </div>

        {/* TAB 1: ALL LANGUAGE MODE */}
        {activeTab === 'language' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  {t.languageTitle}
                </h3>
                <p className="text-xs text-slate-400">{t.languageDesc}</p>
              </div>

              {/* Language Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder="Search languages..."
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none w-full sm:w-48"
                />
              </div>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredLanguages.map((langOpt) => {
                const isSelected = language === langOpt.code;

                return (
                  <button
                    key={langOpt.code}
                    onClick={() => {
                      sound.playClick();
                      onLanguageChange(langOpt.code);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all active:scale-98 flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{langOpt.flag}</span>
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-1.5">
                          <span>{langOpt.nativeName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{langOpt.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{langOpt.region}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: OPENCODE CLI THEME LIST */}
        {activeTab === 'theme' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-cyan-400" />
                    {t.themeTitle}
                  </h3>
                  <p className="text-xs text-slate-400">{t.themeDesc}</p>
                </div>

                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-300">opencode {currentTheme.cliFlag}</span>
                </div>
              </div>

              {/* Theme Category Filters */}
              <div className="flex gap-1.5 overflow-x-auto pt-2.5 pb-1 scrollbar-none text-xs font-mono">
                {(['all', 'cyber', 'neon', 'retro', 'arctic', 'matrix'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sound.playClick();
                      setThemeCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                      themeCategory === cat
                        ? 'bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredThemes.map((theme) => {
                const isSelected = currentTheme.id === theme.id;

                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      sound.playClick();
                      onThemeChange(theme.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all active:scale-98 flex flex-col justify-between space-y-2.5 ${
                      isSelected
                        ? 'bg-slate-900 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-2">
                          <span>{theme.name}</span>
                          {isSelected && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500 text-slate-950 font-mono font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                          {theme.description}
                        </p>
                      </div>

                      {/* Color Preview Swatches */}
                      <div className="flex items-center gap-1 p-1 bg-black/60 rounded-lg border border-slate-800 shrink-0">
                        {theme.previewColors.map((col, idx) => (
                          <span
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: col }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                      <span className="text-cyan-400">{theme.cliFlag}</span>
                      <span className="uppercase text-slate-500">{theme.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: AUDIO & NUMERAL CONFIG */}
        {activeTab === 'audio' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                {t.audioTitle}
              </h3>
              <p className="text-xs text-slate-400">{t.audioDesc}</p>
            </div>

            <div className="space-y-3">
              {/* Sound Synthesizer Toggle */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-white">Space Web Audio FX</div>
                  <div className="text-[11px] text-slate-400">
                    Real-time procedural synthesizer for RCS bursts, sirens, and radar pings
                  </div>
                </div>

                <button
                  onClick={onMuteToggle}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                    !isMuted
                      ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950 border-rose-500/50 text-rose-300'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isMuted ? 'MUTED' : 'ACTIVE'}</span>
                </button>
              </div>

              {/* Bengali Numerals Mode Toggle */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-white">{t.bengaliDigits}</div>
                  <div className="text-[11px] text-slate-400">
                    Render all telemetry, coordinates, and altitudes in Bengali numerals (০-৯)
                  </div>
                </div>

                <button
                  onClick={onBengaliDigitsToggle}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    useBengaliDigits
                      ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {useBengaliDigits ? '১২৩ ACTIVE' : '123 STANDARD'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANDROID APK RELEASE */}
        {activeTab === 'apk' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Download Card */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-cyan-950/40 border border-emerald-500/40 rounded-xl p-4 sm:p-5 space-y-4 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-300 font-mono">
                      junior-astronaut-mission-trainer.apk
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      v4.2.0 • Signed
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>Size: <b className="text-white">0.49 MB</b></span>
                    <span>•</span>
                    <span>Android 5.0+ (API 21-34)</span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      v1+v2+v3 Signed
                    </span>
                  </div>
                </div>

                <a
                  href="/api/download/apk"
                  download="junior-astronaut-mission-trainer.apk"
                  onClick={() => sound.playSuccess()}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs font-mono shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download APK (0.49 MB)</span>
                </a>
              </div>

              {/* SHA-256 Hash Card */}
              <div className="bg-[#050813] border border-slate-800 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-cyan-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    SHA-256 Checksum
                  </span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      navigator.clipboard.writeText('0fd365f5e45e86509d7f04e457c23457c9d38bebacc0f0c9e0924b7c97d8f92d');
                      setCopiedSha(true);
                      setTimeout(() => setCopiedSha(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-cyan-300 font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    {copiedSha ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[11px] font-mono text-slate-300 break-all select-all bg-black/40 p-2 rounded border border-slate-900">
                  0fd365f5e45e86509d7f04e457c23457c9d38bebacc0f0c9e0924b7c97d8f92d
                </div>
              </div>
            </div>

            {/* Install Steps */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                Quick Installation Steps
              </h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-sans">
                <li>Tap <b>Download APK</b> above to save the Android package.</li>
                <li>Tap the downloaded notification in your notification bar or Files app.</li>
                <li>If prompted with "Install unknown apps", grant permission to your browser.</li>
                <li>Tap <b>Install</b> and launch Junior Astronaut Mission Trainer!</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs active:scale-95 transition-all shadow-md"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
