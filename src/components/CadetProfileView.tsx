import React from 'react';
import { Award, UserCheck, ShieldCheck, Printer, Star, Satellite, Orbit, Target, Compass, Sun, QrCode } from 'lucide-react';
import { Language, CadetProfile } from '../types/mission';
import { translations, formatNumber } from '../services/localization';
import { sound } from '../services/soundEffects';

interface CadetProfileViewProps {
  language: Language;
  useBengaliDigits: boolean;
  cadet: CadetProfile;
  onOpenTeeVault: () => void;
}

export const CadetProfileView: React.FC<CadetProfileViewProps> = ({
  language,
  useBengaliDigits,
  cadet,
  onOpenTeeVault,
}) => {
  const t = translations[language].cadetProfile;

  const allBadges = [
    {
      id: 'iss_docking',
      title: language === 'bn' ? 'আইএসএস হারমোনি ডকমাস্টার' : 'ISS Harmony Dockmaster',
      desc: language === 'bn' ? 'সফল সফট ডকিং সম্পন্ন' : 'Zero-velocity capture at Harmony',
      icon: Orbit,
      unlocked: cadet.completedMissions.includes('iss_docking'),
    },
    {
      id: 'asteroid_deflector',
      title: language === 'bn' ? 'নাসা নিওডব্লিউএস গ্রহাণু শিকারী' : 'NeoWs Asteroid Hunter',
      desc: language === 'bn' ? 'বিপজ্জনক গ্রহাণু বিচ্যুত' : 'Deflected hazardous NEO target',
      icon: Target,
      unlocked: cadet.completedMissions.includes('asteroid_deflector'),
    },
    {
      id: 'mars_rover',
      title: language === 'bn' ? 'মঙ্গল অ্যাস্ট্রোবায়োলজিস্ট' : 'Martian Astrobiologist',
      desc: language === 'bn' ? 'জেজেরো ক্রেটার কোর নমুনা' : 'Gathered Jezero rock cores',
      icon: Compass,
      unlocked: cadet.completedMissions.includes('mars_rover'),
    },
    {
      id: 'bangabandhu_satellite',
      title: language === 'bn' ? 'বঙ্গবন্ধু কক্ষপথীয় অগ্রদূত' : 'Bangabandhu Orbital Pioneer',
      desc: language === 'bn' ? '১১৯.১° পূর্ব স্লট টেলিমেট্রি লক' : 'Locked 119.1°E transponder link',
      icon: Satellite,
      unlocked: cadet.completedMissions.includes('bangabandhu_satellite'),
    },
    {
      id: 'space_weather',
      title: language === 'bn' ? 'সৌরঝড় শিল্ডমাস্টার' : 'Solar Storm Shieldmaster',
      desc: language === 'bn' ? 'স্পেসওয়াক সুরক্ষা সম্পন্ন' : 'Deflected G2 solar CME radiation',
      icon: Sun,
      unlocked: cadet.completedMissions.includes('space_weather'),
    },
    {
      id: 'tee_guardian',
      title: language === 'bn' ? 'টিইই ক্রিপ্টোগ্রাফিক অভিভাবক' : 'TEE Cryptographic Guardian',
      desc: language === 'bn' ? 'হার্ডওয়্যার এনক্লেভ অখণ্ডতা রক্ষা' : 'EAL6+ hardware state integrity',
      icon: ShieldCheck,
      unlocked: true, // unlocked by default for participating in TEE
    },
  ];

  const handlePrintCertificate = () => {
    sound.playSuccess();
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Cadet ID Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1428] via-[#091024] to-[#060a17] border border-cyan-500/30 p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-[2px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0a1122] rounded-[14px] flex items-center justify-center font-bold text-3xl font-mono text-cyan-300">
                {cadet.callsign.slice(0, 2)}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              ACTIVE
            </span>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                {cadet.name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {cadet.callsign}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              {t.academy} • {t.cadetId}: <span className="text-cyan-400 font-bold">{cadet.id}</span>
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/30">
                {language === 'bn' ? cadet.rankBn : cadet.rank}
              </span>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                {formatNumber(cadet.exp, useBengaliDigits)} XP
              </span>
            </div>
          </div>

          <button
            onClick={handlePrintCertificate}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printCert}</span>
          </button>
        </div>
      </div>

      {/* Earned Mission Badges */}
      <div className="space-y-3">
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          {t.badgesEarned}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allBadges.map((badge) => {
            const Icon = badge.icon;

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center text-center space-y-2 ${
                  badge.unlocked
                    ? 'flutter-card border-cyan-500/30 bg-[#0a1224]'
                    : 'bg-slate-900/30 border-slate-800/60 opacity-40'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    badge.unlocked
                      ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-bold text-xs text-white">{badge.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{badge.desc}</p>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    badge.unlocked
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {badge.unlocked ? (language === 'bn' ? '✓ অর্জিত' : '✓ EARNED') : 'LOCKED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Printable Certificate Preview Card */}
      <div className="rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-b from-[#091224] to-[#050914] p-6 sm:p-8 space-y-5 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500" />

        <div className="space-y-1">
          <div className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-400 uppercase font-bold">
            {t.certHeader}
          </div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-white">
            {language === 'bn'
              ? 'জুনিয়র নভোচারী মহাকাশ যোগ্যতা সনদ'
              : 'JUNIOR ASTRONAUT CERTIFICATE OF EXCELLENCE'}
          </h2>
          <p className="text-xs font-mono text-slate-400">
            SPARRSO ACADEMY • NASA DATA CHALLENGE VALIDATION
          </p>
        </div>

        <div className="max-w-xl mx-auto py-2">
          <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
            "{t.certBody}"
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-3 border-t border-cyan-500/20 text-xs font-mono text-left">
          <div>
            <span className="text-slate-400 text-[10px] block">ASTRONAUT</span>
            <span className="text-white font-bold">{cadet.name}</span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] block">RANK</span>
            <span className="text-emerald-400 font-bold">
              {language === 'bn' ? cadet.rankBn : cadet.rank}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] block">ISSUED BY</span>
            <span className="text-cyan-300 font-bold">SPARRSO / TEE</span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] block">AUTHENTICITY</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              EAL6+
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-[10px] font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>{t.verifiedSeal}</span>
        </div>
      </div>
    </div>
  );
};
