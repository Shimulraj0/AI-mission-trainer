import React, { useState, useEffect } from 'react';
import { FlutterAppBar } from './components/FlutterAppBar';
import { FlutterBottomNav, NavTab } from './components/FlutterBottomNav';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { MissionControlView } from './components/MissionControlView';
import { SimulationsHubView } from './components/SimulationsHubView';
import { CadetProfileView } from './components/CadetProfileView';
import { TeeVaultModal } from './components/TeeVaultModal';
import { AiFlightDirectorModal } from './components/AiFlightDirectorModal';
import { NasaOperationsModal } from './components/NasaOperationsModal';
import { SettingsModal } from './components/SettingsModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { Language, CadetProfile } from './types/mission';
import { sound } from './services/soundEffects';
import { teeEnclave } from './services/teeEnclave';
import { themeService, CliTheme } from './services/themeService';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('astronaut_lang');
      if (saved) return saved as Language;
    }
    return 'bn';
  });
  const [useBengaliDigits, setUseBengaliDigits] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<NavTab>('control');
  const [activeChallengeId, setActiveChallengeId] = useState<string>('iss_docking');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isTeeVaultOpen, setIsTeeVaultOpen] = useState<boolean>(false);
  const [isFlightDirectorOpen, setIsFlightDirectorOpen] = useState<boolean>(false);
  const [isNasaDataCenterOpen, setIsNasaDataCenterOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<CliTheme>(themeService.getTheme());
  const [tamperCount, setTamperCount] = useState<number>(0);

  // Subscribe to theme updates
  useEffect(() => {
    const unsub = themeService.subscribe((theme) => {
      setCurrentTheme(theme);
    });
    return () => unsub();
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('astronaut_lang', newLang);
    }
  };

  const handleThemeChange = (themeId: string) => {
    themeService.setTheme(themeId);
  };

  // Cadet Profile State
  const [cadet, setCadet] = useState<CadetProfile>({
    id: 'SPARRSO-CADET-71-BD',
    name: 'Tanvir Hossain',
    callsign: 'MEGHNA-71',
    rank: 'Orbital Pilot',
    rankBn: 'অরবিটাল পাইলট',
    rankLevel: 2,
    exp: 450,
    completedMissions: [],
    badges: ['iss_docking', 'tee_guardian'],
    teeIntegrityScore: 100,
    joinedDate: '2026-10-04',
  });

  // Listen to TEE state changes
  useEffect(() => {
    const unsub = teeEnclave.onStateChange(() => {
      const pcr = teeEnclave.getPcrRegisters();
      setTamperCount(pcr.tamperCount);
    });
    return () => unsub();
  }, []);

  const handleMuteToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const handleMissionSuccess = (missionId: string, earnedPoints: number) => {
    setCadet((prev) => {
      const completed = Array.from(new Set([...prev.completedMissions, missionId]));
      const newExp = prev.exp + earnedPoints;

      // Update Rank according to XP
      let rank = 'Astronaut Cadet';
      let rankBn = 'নভোচারী ক্যাডেট';
      let rankLevel = 1;

      if (newExp >= 1200) {
        rank = 'Galactic Admiral';
        rankBn = 'গ্যালাকটিক অ্যাডমিরাল';
        rankLevel = 5;
      } else if (newExp >= 850) {
        rank = 'Space Commander';
        rankBn = 'স্পেস কমান্ডার';
        rankLevel = 4;
      } else if (newExp >= 550) {
        rank = 'Mission Specialist';
        rankBn = 'মিশন স্পেশালিস্ট';
        rankLevel = 3;
      } else if (newExp >= 300) {
        rank = 'Orbital Pilot';
        rankBn = 'অরবিটাল পাইলট';
        rankLevel = 2;
      }

      return {
        ...prev,
        completedMissions: completed,
        exp: newExp,
        rank,
        rankBn,
        rankLevel,
      };
    });
  };

  const handleSelectChallenge = (challengeId: string) => {
    setActiveChallengeId(challengeId);
    setCurrentTab('simulations');
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* 60fps Ambient Cosmic Starfield */}
      <StarfieldCanvas />

      {/* Flutter App Bar */}
      <FlutterAppBar
        language={language}
        onLanguageChange={handleLanguageChange}
        useBengaliDigits={useBengaliDigits}
        onBengaliDigitsToggle={() => setUseBengaliDigits(!useBengaliDigits)}
        cadet={cadet}
        isMuted={isMuted}
        onMuteToggle={handleMuteToggle}
        onOpenTeeVault={() => setIsTeeVaultOpen(true)}
        onOpenFlightDirector={() => setIsFlightDirectorOpen(true)}
        onOpenNasaDataCenter={() => setIsNasaDataCenterOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenApkDownload={() => setIsApkModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 transition-all duration-300">
        {currentTab === 'control' && (
          <MissionControlView
            language={language}
            useBengaliDigits={useBengaliDigits}
            cadet={cadet}
            onSelectChallenge={handleSelectChallenge}
            onOpenTeeVault={() => setIsTeeVaultOpen(true)}
            onOpenFlightDirector={() => setIsFlightDirectorOpen(true)}
            onOpenNasaDataCenter={() => setIsNasaDataCenterOpen(true)}
          />
        )}

        {currentTab === 'simulations' && (
          <SimulationsHubView
            language={language}
            useBengaliDigits={useBengaliDigits}
            activeChallengeId={activeChallengeId}
            onSelectChallenge={setActiveChallengeId}
            onMissionSuccess={handleMissionSuccess}
          />
        )}

        {currentTab === 'tee' && (
          <div className="pb-20">
            <TeeVaultModal
              isOpen={true}
              onClose={() => setCurrentTab('control')}
              language={language}
              useBengaliDigits={useBengaliDigits}
              cadet={cadet}
            />
          </div>
        )}

        {currentTab === 'ai' && (
          <div className="pb-20">
            <AiFlightDirectorModal
              isOpen={true}
              onClose={() => setCurrentTab('control')}
              language={language}
            />
          </div>
        )}

        {currentTab === 'profile' && (
          <CadetProfileView
            language={language}
            useBengaliDigits={useBengaliDigits}
            cadet={cadet}
            onOpenTeeVault={() => setIsTeeVaultOpen(true)}
          />
        )}
      </main>

      {/* Modals for when triggered from the App Bar */}
      {isTeeVaultOpen && (
        <TeeVaultModal
          isOpen={isTeeVaultOpen}
          onClose={() => setIsTeeVaultOpen(false)}
          language={language}
          useBengaliDigits={useBengaliDigits}
          cadet={cadet}
        />
      )}

      {isFlightDirectorOpen && (
        <AiFlightDirectorModal
          isOpen={isFlightDirectorOpen}
          onClose={() => setIsFlightDirectorOpen(false)}
          language={language}
        />
      )}

      {isNasaDataCenterOpen && (
        <NasaOperationsModal
          isOpen={isNasaDataCenterOpen}
          onClose={() => setIsNasaDataCenterOpen(false)}
          language={language}
          useBengaliDigits={useBengaliDigits}
          onLaunchChallenge={(id) => {
            setActiveChallengeId(id);
            setCurrentTab('simulations');
          }}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          language={language}
          onLanguageChange={handleLanguageChange}
          useBengaliDigits={useBengaliDigits}
          onBengaliDigitsToggle={() => setUseBengaliDigits(!useBengaliDigits)}
          isMuted={isMuted}
          onMuteToggle={handleMuteToggle}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
        />
      )}

      {isApkModalOpen && (
        <ApkDownloadModal
          isOpen={isApkModalOpen}
          onClose={() => setIsApkModalOpen(false)}
          language={language}
        />
      )}

      {/* Flutter Bottom Navigation Bar */}
      <FlutterBottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        language={language}
        tamperCount={tamperCount}
      />
    </div>
  );
}
