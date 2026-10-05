import React, { useState } from 'react';
import { Orbit, Target, Compass, Satellite, Sun, Globe2 } from 'lucide-react';
import { Language } from '../types/mission';
import { translations } from '../services/localization';
import { sound } from '../services/soundEffects';
import { IssDockingGame } from './challenges/IssDockingGame';
import { AsteroidDeflectorGame } from './challenges/AsteroidDeflectorGame';
import { MarsRoverGame } from './challenges/MarsRoverGame';
import { BangabandhuSatelliteGame } from './challenges/BangabandhuSatelliteGame';
import { SpaceWeatherShieldGame } from './challenges/SpaceWeatherShieldGame';
import { EarthObservationGame } from './challenges/EarthObservationGame';

interface SimulationsHubViewProps {
  language: Language;
  useBengaliDigits: boolean;
  activeChallengeId: string;
  onSelectChallenge: (id: string) => void;
  onMissionSuccess: (missionId: string, points: number) => void;
}

export const SimulationsHubView: React.FC<SimulationsHubViewProps> = ({
  language,
  useBengaliDigits,
  activeChallengeId,
  onSelectChallenge,
  onMissionSuccess,
}) => {
  const t = translations[language].challenges;

  const challengeTabs = [
    { id: 'iss_docking', label: language === 'bn' ? 'আইএসএস ডকিং' : 'ISS Docking', icon: Orbit },
    { id: 'earth_observation', label: language === 'bn' ? 'নাসা ভূ-পর্যবেক্ষণ' : 'NASA Earth Recon', icon: Globe2 },
    { id: 'asteroid_deflector', label: language === 'bn' ? 'গ্রহাণু ডিফ্লেক্টর' : 'Asteroid Deflector', icon: Target },
    { id: 'mars_rover', label: language === 'bn' ? 'মঙ্গল রোভার' : 'Mars Rover', icon: Compass },
    { id: 'bangabandhu_satellite', label: language === 'bn' ? 'বঙ্গবন্ধু স্যাটেলাইট-১' : 'Bangabandhu-1', icon: Satellite },
    { id: 'space_weather', label: language === 'bn' ? 'স্পেস ওয়েদার শিল্ড' : 'Space Weather', icon: Sun },
  ];

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Simulation Selector Bar */}
      <div className="flex gap-2 overflow-x-auto p-1.5 bg-slate-900/60 rounded-2xl border border-slate-800 scrollbar-none">
        {challengeTabs.map((tab) => {
          const isActive = activeChallengeId === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onSelectChallenge(tab.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap flex items-center gap-2 transition-all active:scale-95 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Challenge Simulator Component */}
      <div>
        {activeChallengeId === 'iss_docking' && (
          <IssDockingGame
            language={language}
            useBengaliDigits={useBengaliDigits}
            onMissionSuccess={onMissionSuccess}
          />
        )}

        {activeChallengeId === 'earth_observation' && (
          <EarthObservationGame
            language={language}
            useBengaliDigits={useBengaliDigits}
            onMissionSuccess={onMissionSuccess}
          />
        )}

        {activeChallengeId === 'asteroid_deflector' && (
          <AsteroidDeflectorGame
            language={language}
            useBengaliDigits={useBengaliDigits}
            onMissionSuccess={onMissionSuccess}
          />
        )}

        {activeChallengeId === 'mars_rover' && (
          <MarsRoverGame
            language={language}
            useBengaliDigits={useBengaliDigits}
            onMissionSuccess={onMissionSuccess}
          />
        )}

        {activeChallengeId === 'bangabandhu_satellite' && (
          <BangabandhuSatelliteGame
            language={language}
            useBengaliDigits={useBengaliDigits}
            onMissionSuccess={onMissionSuccess}
          />
        )}

        {activeChallengeId === 'space_weather' && (
          <SpaceWeatherShieldGame
            language={language}
            useBengaliDigits={useBengaliDigits}
            onMissionSuccess={onMissionSuccess}
          />
        )}
      </div>
    </div>
  );
};
