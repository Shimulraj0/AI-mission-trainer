import React, { useState, useEffect } from 'react';
import { 
  Orbit, Compass, ShieldCheck, Target, Radio, Sun, 
  MapPin, Award, ArrowRight, Zap, Activity, Globe, Satellite,
  Globe2, Wind, RefreshCw, ChevronRight, AlertTriangle
} from 'lucide-react';
import { Language, CadetProfile, IssTelemetry, DonkiResponse } from '../types/mission';
import { translations, formatNumber } from '../services/localization';
import { sound } from '../services/soundEffects';
import { nasaService } from '../services/nasaService';

interface MissionControlViewProps {
  language: Language;
  useBengaliDigits: boolean;
  cadet: CadetProfile;
  onSelectChallenge: (challengeId: string) => void;
  onOpenTeeVault: () => void;
  onOpenFlightDirector: () => void;
  onOpenNasaDataCenter: () => void;
}

export const MissionControlView: React.FC<MissionControlViewProps> = ({
  language,
  useBengaliDigits,
  cadet,
  onSelectChallenge,
  onOpenTeeVault,
  onOpenFlightDirector,
  onOpenNasaDataCenter,
}) => {
  const t = translations[language].missionControl;
  const statusT = translations[language].status;

  const [issData, setIssData] = useState<IssTelemetry | null>(nasaService.getIss());
  const [donkiData, setDonkiData] = useState<DonkiResponse | null>(nasaService.getDonki());
  const [isSyncing, setIsSyncing] = useState<boolean>(nasaService.getIsSyncing());

  useEffect(() => {
    const unsub = nasaService.subscribe(() => {
      setIssData(nasaService.getIss());
      setDonkiData(nasaService.getDonki());
      setIsSyncing(nasaService.getIsSyncing());
    });
    return () => unsub();
  }, []);

  const radiationInfo = nasaService.getDynamicRadiationRisk();

  const challengesList = [
    {
      id: 'iss_docking',
      title: language === 'bn' ? 'আইএসএস ডকিং সিমুলেশন' : 'ISS Orbital Docking',
      desc: language === 'bn' ? 'আন্তর্জাতিক স্পেস স্টেশনে আরসিএস থ্রাস্টার দিয়ে নিখুঁত ডকিং সম্পন্ন করুন।' : 'RCS thruster alignment into the ISS Harmony docking port.',
      icon: Orbit,
      color: 'from-cyan-500 to-blue-600',
      badge: '+250 XP',
      isCompleted: cadet.completedMissions.includes('iss_docking'),
    },
    {
      id: 'earth_observation',
      title: language === 'bn' ? 'নাসা ভূ-পর্যবেক্ষণ ও ঘূর্ণিঝড় ট্র্যাকিং' : 'NASA Earth Recon & Cyclone Tracking',
      desc: language === 'bn' ? 'ইওনেট (EONET) মাল্টিস্পেকট্রাল স্যাটেলাইট ডেটা দিয়ে বঙ্গোপসাগরের ঘূর্ণিঝড় ও প্লাবন ট্র্যাক করুন।' : 'Process live NASA EONET imagery to track Bay of Bengal storms and monsoon floods.',
      icon: Globe2,
      color: 'from-emerald-500 to-cyan-600',
      badge: '+280 XP',
      isCompleted: cadet.completedMissions.includes('earth_observation'),
    },
    {
      id: 'asteroid_deflector',
      title: language === 'bn' ? 'নাসা গ্রহাণু প্রতিরোধ মিশন' : 'NASA Asteroid Deflection',
      desc: language === 'bn' ? 'লাইভ নাসা নিওডব্লিউএস (NeoWs) ডেটাসেট ব্যবহার করে পৃথিবীর দিকে ধেয়ে আসা গ্রহাণু বিচ্যুত করুন।' : 'Deflect real Near-Earth Asteroids via kinetic impactor physics.',
      icon: Target,
      color: 'from-amber-500 to-orange-600',
      badge: '+300 XP',
      isCompleted: cadet.completedMissions.includes('asteroid_deflector'),
    },
    {
      id: 'mars_rover',
      title: language === 'bn' ? 'মঙ্গল রোভার পাথফাইন্ডার' : 'Mars Rover Pathfinder',
      desc: language === 'bn' ? 'জেজেরো ক্রেটারে পারসিভিয়ারেন্স রোভার ড্রাইভ করে প্রাচীন শিলা নমুনা সংগ্রহ করুন।' : 'Navigate Perseverance across Jezero Crater to collect astrobiology core samples.',
      icon: Compass,
      color: 'from-red-500 to-rose-600',
      badge: '+300 XP',
      isCompleted: cadet.completedMissions.includes('mars_rover'),
    },
    {
      id: 'bangabandhu_satellite',
      title: language === 'bn' ? 'বঙ্গবন্ধু স্যাটেলাইট-১ লিংক' : 'Bangabandhu-1 Telemetry Link',
      desc: language === 'bn' ? 'গাজীপুর ও বেতবুনিয়া ভূ-উপগ্রহ কেন্দ্র থেকে ১১৯.১° পূর্ব স্লটে ট্রান্সপন্ডার সিগন্যাল লক করুন।' : 'Calibrate ground antennas at Gazipur & Betbunia to maintain 119.1°E Ku-Band connectivity.',
      icon: Satellite,
      color: 'from-blue-600 to-indigo-600',
      badge: '+350 XP',
      isCompleted: cadet.completedMissions.includes('bangabandhu_satellite'),
    },
    {
      id: 'space_weather',
      title: language === 'bn' ? 'স্পেস ওয়েদার ও শিল্ড কন্ট্রোল' : 'Space Weather & EVA Shield',
      desc: language === 'bn' ? 'নাসা ডনকি (DONKI) সৌরঝড় সতর্কতায় ম্যাগনেটিক শিল্ড সক্রিয় করে স্পেসওয়াক রক্ষা করুন।' : 'Deploy magnetic deflector shields to protect junior astronauts during solar flares.',
      icon: Sun,
      color: 'from-purple-500 to-pink-600',
      badge: '+200 XP',
      isCompleted: cadet.completedMissions.includes('space_weather'),
    },
  ];

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1633] via-[#091126] to-[#070b16] border border-cyan-500/30 p-5 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              SPARRSO FLIGHT ACADEMY
            </span>

            {/* Live NASA API Telemetry Status Pill */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenNasaDataCenter();
              }}
              className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 hover:bg-emerald-900/80 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>NASA REAL-TIME PIPELINE</span>
            </button>

            {/* Live Radiation Status */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
                radiationInfo.level === 'CRITICAL' || radiationInfo.level === 'HIGH'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Kp {formatNumber(radiationInfo.kp, useBengaliDigits)} ({radiationInfo.level})</span>
            </span>

            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              TEE ATTESTED
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.welcomeCadet},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
              {cadet.callsign}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.overviewText}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onSelectChallenge('earth_observation');
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
            >
              <Globe2 className="w-4 h-4 fill-slate-950" />
              <span>{language === 'bn' ? 'নাসা ভূ-পর্যবেক্ষণ মিশন চালু করুন' : 'Launch Earth Recon Sim'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenNasaDataCenter();
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 font-mono text-xs sm:text-sm flex items-center gap-2 active:scale-95 transition-all"
            >
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>{language === 'bn' ? 'নাসা ডেটা সেন্টার' : 'NASA Data Operations'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* NASA Live Feeds Real-Time Control Bar */}
      <div className="flutter-card p-3 sm:p-4 rounded-2xl border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 bg-[#0a1226]/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-white font-mono">
                {language === 'bn' ? 'নাসা লাইভ ডেটাসেট হাব (NASA OPEN APIS)' : 'NASA OPEN APIS LIVE TELEMETRY'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                CONNECTED
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'bn'
                ? 'আইএসএস ট্র্যাকিং, ডনকি স্পেস ওয়েদার, নিওডব্লিউএস গ্রহাণু ও ইওনেট সরাসরি গেমপ্লে নিয়ন্ত্রণ করছে।'
                : 'ISS orbit, DONKI solar storms, NeoWs asteroids & EONET natural events dynamically driving challenges.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenNasaDataCenter();
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <span>{language === 'bn' ? 'লাইভ ফিড বিস্তারিত দেখুন' : 'Explore Live Telemetry'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Live Telemetry Tickers: ISS Bangladesh Pass & Bangabandhu-1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ISS Live Orbit Card with Bangladesh Ground Pass tracking */}
        <div className="flutter-card rounded-2xl p-4 border border-cyan-500/25 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">{t.issTitle}</h3>
                <span className="text-[10px] font-mono text-emerald-400">● LIVE NASA TELEMETRY</span>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              {formatNumber(27600, useBengaliDigits)} km/h
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-black/40 p-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 text-[10px] block">{t.issAltitude}</span>
              <span className="text-white font-bold">
                {formatNumber(issData?.altitude_km || 408.2, useBengaliDigits)} km
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">
                {language === 'bn' ? 'বাংলাদেশ থেকে দূরত্ব' : 'Dist to Dhaka'}
              </span>
              <span className="text-amber-400 font-bold">
                {formatNumber(issData?.bangladesh_tracking?.distance_km || 1420, useBengaliDigits)} km
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">
                {language === 'bn' ? 'গ্রাউন্ড ট্র্যাক স্ট্যাটাস' : 'Ground Pass'}
              </span>
              <span className="text-emerald-400 font-bold truncate block">
                {language === 'bn'
                  ? issData?.bangladesh_tracking?.status_bn || 'দিগন্তের বাইরে'
                  : issData?.bangladesh_tracking?.status || 'BEYOND_HORIZON'}
              </span>
            </div>
          </div>
        </div>

        {/* Bangabandhu-1 Telemetry Card */}
        <div className="flutter-card rounded-2xl p-4 border border-emerald-500/25 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">{t.bs1Title}</h3>
                <span className="text-[10px] font-mono text-emerald-400">● {t.bs1Slot}</span>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              35,786 km GEO
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/40 p-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 text-[10px] block">
                {language === 'bn' ? 'ট্রান্সপন্ডার সক্রিয়' : 'Active Transponders'}
              </span>
              <span className="text-white font-bold">
                40/40 (26 Ku + 14 C Band)
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">
                {language === 'bn' ? 'ভূ-উপগ্রহ কেন্দ্র' : 'Earth Stations'}
              </span>
              <span className="text-emerald-400 font-bold truncate block">
                Gazipur & Betbunia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Cadet Challenges Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            {t.activeCadetMissions}
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {formatNumber(cadet.completedMissions.length, useBengaliDigits)} /{' '}
            {formatNumber(6, useBengaliDigits)}{' '}
            {language === 'bn' ? 'সম্পন্ন' : 'Completed'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challengesList.map((ch) => {
            const Icon = ch.icon;

            return (
              <div
                key={ch.id}
                onClick={() => {
                  sound.playClick();
                  onSelectChallenge(ch.id);
                }}
                className="flutter-card group cursor-pointer rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1326] transition-all duration-200 flex flex-col justify-between space-y-4 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${ch.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                        ch.isCompleted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {ch.isCompleted
                        ? language === 'bn' ? '✓ সম্পন্ন' : '✓ Cleared'
                        : ch.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {ch.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono text-cyan-400 group-hover:text-cyan-300">
                  <span>{language === 'bn' ? 'সিমুলেশন শুরু করুন' : 'Launch Simulation'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TEE Enclave Health Callout */}
      <div className="flutter-card-glow rounded-2xl p-4 sm:p-5 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              {t.teeHealth}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono">
                ACTIVE • EAL6+
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">{t.teeDescription}</p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenTeeVault();
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold whitespace-nowrap active:scale-95 transition-all"
        >
          {language === 'bn' ? 'টিইই ভল্ট ও অ্যান্টি-ট্যাম্পার পরিদর্শন' : 'Inspect TEE Security Enclave'}
        </button>
      </div>
    </div>
  );
};
