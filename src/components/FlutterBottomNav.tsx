import React from 'react';
import { Compass, Gamepad2, ShieldAlert, Cpu, UserCheck } from 'lucide-react';
import { Language } from '../types/mission';
import { translations } from '../services/localization';
import { sound } from '../services/soundEffects';

export type NavTab = 'control' | 'simulations' | 'tee' | 'ai' | 'profile';

interface FlutterBottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
  tamperCount: number;
}

export const FlutterBottomNav: React.FC<FlutterBottomNavProps> = ({
  currentTab,
  onTabChange,
  language,
  tamperCount,
}) => {
  const t = translations[language].nav;

  const tabs: Array<{ id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }> = [
    { id: 'control', label: t.missionControl, icon: Compass },
    { id: 'simulations', label: t.simulations, icon: Gamepad2 },
    { id: 'tee', label: t.teeVault, icon: ShieldAlert, badge: tamperCount > 0 ? tamperCount : undefined },
    { id: 'ai', label: t.flightDirector, icon: Cpu },
    { id: 'profile', label: t.cadetProfile, icon: UserCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0f1d]/95 backdrop-blur-xl border-t border-cyan-500/20 py-1.5 px-2 sm:px-6 shadow-2xl">
      <div className="max-w-2xl mx-auto flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onTabChange(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 sm:px-4 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {/* Flutter Material active pill background */}
              {isActive && (
                <div className="absolute inset-0 bg-cyan-950/60 border border-cyan-500/30 rounded-xl -z-10 shadow-inner" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-cyan-400' : ''}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 text-[9px] font-mono font-bold bg-rose-500 text-white rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] sm:text-xs mt-1 tracking-tight text-center truncate max-w-[80px] sm:max-w-none">
                {tab.label}
              </span>

              {/* Indicator dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-0.5 shadow-sm shadow-cyan-400/80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
