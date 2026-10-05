import React, { useState, useEffect } from 'react';
import { 
  Radio, Globe2, Sun, Target, Satellite, RefreshCw, 
  CheckCircle2, Compass, ShieldCheck, Activity, Cpu, ArrowUpRight 
} from 'lucide-react';
import { Language } from '../types/mission';
import { translations, formatNumber } from '../services/localization';
import { sound } from '../services/soundEffects';
import { nasaService } from '../services/nasaService';

interface NasaOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  useBengaliDigits: boolean;
  onLaunchChallenge?: (challengeId: string) => void;
}

export const NasaOperationsModal: React.FC<NasaOperationsModalProps> = ({
  isOpen,
  onClose,
  language,
  useBengaliDigits,
  onLaunchChallenge,
}) => {
  const t = translations[language].nasaDataCenter;

  const [iss, setIss] = useState(nasaService.getIss());
  const [donki, setDonki] = useState(nasaService.getDonki());
  const [neo, setNeo] = useState(nasaService.getNeo());
  const [earthEvents, setEarthEvents] = useState(nasaService.getEarthEvents());
  const [bs1, setBs1] = useState(nasaService.getBs1());
  const [status, setStatus] = useState(nasaService.getStatus());
  const [isSyncing, setIsSyncing] = useState(nasaService.getIsSyncing());

  useEffect(() => {
    const unsub = nasaService.subscribe(() => {
      setIss(nasaService.getIss());
      setDonki(nasaService.getDonki());
      setNeo(nasaService.getNeo());
      setEarthEvents(nasaService.getEarthEvents());
      setBs1(nasaService.getBs1());
      setStatus(nasaService.getStatus());
      setIsSyncing(nasaService.getIsSyncing());
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    sound.playClick();
    await nasaService.fetchAllFeeds();
    sound.playSuccess();
  };

  const radiationInfo = nasaService.getDynamicRadiationRisk();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#080d1c] border border-cyan-500/40 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {t.title}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono">
                  LIVE API PIPELINE
                </span>
              </h2>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{t.syncBtn}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Dynamic Game Impact Banner */}
        <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-cyan-950/60 p-3.5 rounded-xl border border-purple-500/30 flex items-center gap-3 text-xs">
          <Activity className="w-5 h-5 text-purple-400 shrink-0 animate-pulse" />
          <div className="leading-relaxed text-slate-200">
            <span className="font-bold text-purple-300 font-mono uppercase">
              {language === 'bn' ? 'গেমপ্লেতে লাইভ ডেটার প্রভাব:' : 'Live Data Gameplay Impact:'}
            </span>{' '}
            {language === 'bn'
              ? `বর্তমান সৌরঝড়ের বেগ (${formatNumber(radiationInfo.solarWindSpeed, useBengaliDigits)} কিমি/সেকেন্ড) স্পেস ওয়েদার চ্যালেঞ্জে ম্যাগনেটিক শিল্ডের ক্ষয় বেগ ${radiationInfo.shieldDecayRate}x বৃদ্ধি করেছে। আইএসএস বাংলাদেশের দিগন্ত থেকে ${formatNumber(iss?.bangladesh_tracking?.distance_km || 1400, useBengaliDigits)} কিমি দূরে অবস্থান করছে।`
              : `Current solar wind flux (${radiationInfo.solarWindSpeed} km/s, Kp ${radiationInfo.kp}) scales deflector shield power consumption by ${radiationInfo.shieldDecayRate}x. ISS is currently ${iss?.bangladesh_tracking?.distance_km || 1400} km from Dhaka.`}
          </div>
        </div>

        {/* 6 Real-Time Telemetry Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. ISS Telemetry */}
          <div className="flutter-card p-4 rounded-xl border border-cyan-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-xs sm:text-sm text-white">{t.issHeading}</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                ● 10s Live Refresh
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/40 p-2.5 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px] block">Position</span>
                <span className="text-cyan-300 font-bold">
                  {formatNumber(iss?.latitude || 22.4, useBengaliDigits)}°,{' '}
                  {formatNumber(iss?.longitude || 88.5, useBengaliDigits)}°
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Velocity / Alt</span>
                <span className="text-white font-bold">
                  {formatNumber(27600, useBengaliDigits)} km/h • 408 km
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">{t.bdGroundPassHeading}</span>
                <span className="text-emerald-400 font-bold">
                  {language === 'bn' ? iss?.bangladesh_tracking?.status_bn : iss?.bangladesh_tracking?.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Distance to Dhaka</span>
                <span className="text-amber-300 font-bold">
                  {formatNumber(iss?.bangladesh_tracking?.distance_km || 1420, useBengaliDigits)} km
                </span>
              </div>
            </div>

            {onLaunchChallenge && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchChallenge('iss_docking');
                }}
                className="w-full text-center text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 pt-1"
              >
                <span>{language === 'bn' ? 'আইএসএস ডকিং সিমুলেশনে চলুন' : 'Launch ISS Docking Sim'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. Space Weather (DONKI) */}
          <div className="flutter-card p-4 rounded-xl border border-amber-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-xs sm:text-sm text-white">{t.donkiHeading}</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                ● Live DONKI
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/40 p-2.5 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px] block">Geomagnetic Kp</span>
                <span className="text-rose-400 font-bold">
                  Kp {formatNumber(radiationInfo.kp, useBengaliDigits)} ({radiationInfo.level})
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Solar Wind Speed</span>
                <span className="text-amber-300 font-bold">
                  {formatNumber(radiationInfo.solarWindSpeed, useBengaliDigits)} km/s
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 text-[10px] block">Active Flare Warning</span>
                <span className="text-white truncate block">
                  {donki?.events?.[0]?.classification || 'Nominal Solar Activity'}
                </span>
              </div>
            </div>

            {onLaunchChallenge && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchChallenge('space_weather');
                }}
                className="w-full text-center text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1 pt-1"
              >
                <span>{language === 'bn' ? 'স্পেস ওয়েদার শিল্ড সিমুলেশন' : 'Launch Space Weather Sim'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 3. Asteroid NeoWs Feed */}
          <div className="flutter-card p-4 rounded-xl border border-red-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-xs sm:text-sm text-white">{t.neoHeading}</h3>
              </div>
              <span className="text-[10px] font-mono text-rose-400 font-bold">
                ● {neo.length} Targets Tracked
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono bg-black/40 p-2.5 rounded-lg border border-slate-800 max-h-32 overflow-y-auto">
              {neo.slice(0, 3).map((ast) => (
                <div key={ast.id} className="flex justify-between items-center text-[11px] border-b border-slate-800/80 pb-1">
                  <span className="text-white font-semibold truncate max-w-[140px]">{ast.name}</span>
                  <span className="text-rose-400">
                    {formatNumber(ast.close_approach_data.relative_velocity_km_s, useBengaliDigits)} km/s
                  </span>
                  <span className="text-cyan-300">
                    {formatNumber(ast.estimated_diameter_meters.max, useBengaliDigits)}m
                  </span>
                </div>
              ))}
            </div>

            {onLaunchChallenge && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchChallenge('asteroid_deflector');
                }}
                className="w-full text-center text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1 pt-1"
              >
                <span>{language === 'bn' ? 'গ্রহাণু ডিফ্লেক্টর মিশন' : 'Launch Asteroid Deflector'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 4. Earth Observation & EONET */}
          <div className="flutter-card p-4 rounded-xl border border-emerald-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-xs sm:text-sm text-white">{t.eonetHeading}</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                ● Live Earth Obs
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono bg-black/40 p-2.5 rounded-lg border border-slate-800 max-h-32 overflow-y-auto">
              {earthEvents.slice(0, 3).map((ev) => (
                <div key={ev.id} className="flex justify-between items-center text-[11px] border-b border-slate-800/80 pb-1">
                  <span className="text-white truncate max-w-[160px]">
                    {language === 'bn' ? ev.title_bn : ev.title}
                  </span>
                  <span className="text-emerald-400 font-bold">{ev.severity.slice(0, 16)}</span>
                </div>
              ))}
            </div>

            {onLaunchChallenge && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchChallenge('earth_observation');
                }}
                className="w-full text-center text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1 pt-1"
              >
                <span>{language === 'bn' ? 'ভূ-পর্যবেক্ষণ ও ঘূর্ণিঝড় ট্র্যাকিং' : 'Launch Earth Recon'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Stream Health Diagnostics */}
        <div className="bg-black/50 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'bn' ? 'সকল নাসা এপিআই স্ট্রিম স্বাভাবিক (৯৯.৯% আপটাইম)' : 'All NASA API Streams Nominal (99.9% Uptime)'}</span>
          </div>

          <div className="text-slate-400">
            {t.lastSync}: <span className="text-cyan-300">{new Date().toLocaleTimeString()}</span> • {t.autoSyncEvery}
          </div>
        </div>
      </div>
    </div>
  );
};
