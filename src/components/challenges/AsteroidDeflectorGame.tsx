import React, { useState, useEffect } from 'react';
import { Shield, Target, AlertTriangle, CheckCircle, Zap, RefreshCw, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AsteroidNeo, Language } from '../../types/mission';
import { translations, formatNumber } from '../../services/localization';
import { sound } from '../../services/soundEffects';
import { teeEnclave } from '../../services/teeEnclave';

interface AsteroidDeflectorGameProps {
  language: Language;
  useBengaliDigits: boolean;
  onMissionSuccess: (missionId: string, points: number) => void;
}

export const AsteroidDeflectorGame: React.FC<AsteroidDeflectorGameProps> = ({
  language,
  useBengaliDigits,
  onMissionSuccess,
}) => {
  const t = translations[language].challenges.asteroidDeflection;

  const [asteroids, setAsteroids] = useState<AsteroidNeo[]>([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState<AsteroidNeo | null>(null);
  const [loading, setLoading] = useState(true);
  const [burnDeltaV, setBurnDeltaV] = useState(420); // m/s
  const [interceptAngle, setInterceptAngle] = useState(38); // degrees
  const [isFiring, setIsFiring] = useState(false);
  const [deflectionResult, setDeflectionResult] = useState<{
    success: boolean;
    deflectionDistanceKm: number;
    message: string;
  } | null>(null);

  // Fetch live NASA NeoWs or curated NASA dataset
  useEffect(() => {
    fetch('/api/nasa/neo')
      .then((res) => res.json())
      .then((data) => {
        if (data.asteroids && data.asteroids.length > 0) {
          setAsteroids(data.asteroids);
          setSelectedAsteroid(data.asteroids[0]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const fireKineticImpactor = async () => {
    if (!selectedAsteroid || isFiring) return;
    setIsFiring(true);
    sound.playThruster();

    // Kinetic impactor deflection physics:
    // Required delta-v depends on asteroid mass and velocity
    const targetVelocity = selectedAsteroid.close_approach_data.relative_velocity_km_s;
    const avgDiameter = (selectedAsteroid.estimated_diameter_meters.min + selectedAsteroid.estimated_diameter_meters.max) / 2;

    // Simulation calculation with realistic physics model
    const optimalAngle = 42;
    const angleTolerance = Math.abs(interceptAngle - optimalAngle);
    const powerRatio = burnDeltaV / (avgDiameter * 1.1);

    setTimeout(async () => {
      sound.playRadarPing();

      const deflectionKm = Math.round(burnDeltaV * 72 * Math.cos((interceptAngle * Math.PI) / 180) / Math.max(1, avgDiameter / 100));
      const isSuccessful = deflectionKm >= 18000 && angleTolerance <= 14;

      if (isSuccessful) {
        sound.playSuccess();
        confetti({ particleCount: 90, spread: 80 });

        // Commit to TEE Enclave
        await teeEnclave.executeEnclaveAction('ASTEROID_DEFLECTED', {
          asteroidId: selectedAsteroid.id,
          deflectionKm,
          burnDeltaV
        }, (state) => ({
          ...state,
          asteroidDeflected: true,
          score: (state.score || 0) + 300
        }));

        setDeflectionResult({
          success: true,
          deflectionDistanceKm: deflectionKm,
          message: language === 'bn'
            ? `কাইনেটিক ইমপ্যাক্টর সফলভাবে আঘাত করেছে! ${selectedAsteroid.name} এর কক্ষপথ ${formatNumber(deflectionKm, useBengaliDigits)} কিমি বিচ্যুত হয়ে পৃথিবী থেকে সম্পূর্ণ নিরাপদ দূরত্বে সরে গেছে!`
            : `Kinetic impactor intercept successful! ${selectedAsteroid.name} deflected by ${deflectionKm.toLocaleString()} km, steering safely clear of Earth!`
        });

        onMissionSuccess('asteroid_deflector', 300);
      } else {
        sound.playWarning();
        setDeflectionResult({
          success: false,
          deflectionDistanceKm: deflectionKm,
          message: language === 'bn'
            ? `অপর্যাপ্ত বিচ্যুতি (${formatNumber(deflectionKm, useBengaliDigits)} কিমি)! ডেল্টা-ভি বৃদ্ধি করুন এবং ইন্টারসেপ্ট কোণ প্রায় ৪২ ডিগ্রিতে সমন্বয় করুন।`
            : `Insufficient orbital deflection (${deflectionKm.toLocaleString()} km)! Increase Delta-V and adjust intercept angle closer to 42° for maximum kinetic transfer.`
        });
      }

      setIsFiring(false);
    }, 1200);
  };

  return (
    <div className="flutter-card rounded-2xl p-4 sm:p-6 hud-panel space-y-4">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            {language === 'bn' ? t.titleBn : t.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-indigo-950/70 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          NASA NeoWs Feed
        </span>
      </div>

      {/* Asteroid Selector Tabs */}
      <div className="space-y-1.5">
        <label className="text-xs text-slate-400 font-mono">
          {language === 'bn' ? 'নাসা ট্র্যাকিং রাডার থেকে লক্ষ্যবস্তু নির্বাচন করুন:' : 'Select Target Near-Earth Object (NEO):'}
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {asteroids.map((ast) => {
            const isSelected = selectedAsteroid?.id === ast.id;
            return (
              <button
                key={ast.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedAsteroid(ast);
                  setDeflectionResult(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-950/80 border-2 border-amber-400 text-amber-200 shadow-md'
                    : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {ast.is_potentially_hazardous && (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>{ast.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Asteroid Data Card */}
      {selectedAsteroid && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/40 p-3 rounded-xl border border-cyan-500/20 font-mono text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">{t.diameter}</span>
            <span className="text-cyan-300 font-bold">
              {formatNumber(selectedAsteroid.estimated_diameter_meters.min, useBengaliDigits)} -{' '}
              {formatNumber(selectedAsteroid.estimated_diameter_meters.max, useBengaliDigits)} m
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">{t.velocity}</span>
            <span className="text-emerald-300 font-bold">
              {formatNumber(selectedAsteroid.close_approach_data.relative_velocity_km_s, useBengaliDigits)} km/s
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">{t.missDist}</span>
            <span className="text-slate-200">
              {formatNumber(
                (selectedAsteroid.close_approach_data.miss_distance_km / 1000).toFixed(0),
                useBengaliDigits
              )}{' '}
              k km
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">{language === 'bn' ? 'ঝুঁকি শ্রেণি' : 'STATUS'}</span>
            <span
              className={`font-bold inline-block px-1.5 py-0.5 rounded text-[10px] ${
                selectedAsteroid.is_potentially_hazardous
                  ? 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {selectedAsteroid.is_potentially_hazardous ? t.hazardous : t.safe}
            </span>
          </div>
        </div>
      )}

      {/* Impactor Trajectory Controls */}
      <div className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">
              {language === 'bn' ? 'ইমপ্যাক্টর ডেল্টা-ভি থ্রাস্ট (Delta-V):' : 'Impactor Burn Delta-V:'}
            </span>
            <span className="text-cyan-400 font-bold">
              {formatNumber(burnDeltaV, useBengaliDigits)} m/s
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="900"
            step="10"
            value={burnDeltaV}
            onChange={(e) => setBurnDeltaV(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">
              {language === 'bn' ? 'ইন্টারসেপ্ট আঘাতের কোণ (Angle):' : 'Kinetic Intercept Vector Angle:'}
            </span>
            <span className="text-amber-400 font-bold">
              {formatNumber(interceptAngle, useBengaliDigits)}°
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            step="1"
            value={interceptAngle}
            onChange={(e) => setInterceptAngle(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        <button
          onClick={fireKineticImpactor}
          disabled={isFiring}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold text-sm font-mono tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
        >
          {isFiring ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{language === 'bn' ? 'কাইনেটিক ইমপ্যাক্টর ধাবমান...' : 'Impactor In Flight...'}</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>{t.kineticBurn}</span>
            </>
          )}
        </button>
      </div>

      {/* Result Card */}
      {deflectionResult && (
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 animate-fadeIn ${
            deflectionResult.success
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
          }`}
        >
          {deflectionResult.success ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <div className="font-bold font-mono">
              {deflectionResult.success
                ? language === 'bn' ? 'মিশন সফল!' : 'DEFLECTION CONFIRMED'
                : language === 'bn' ? 'বিচ্যুতি অপর্যাপ্ত' : 'DEFLECTION INSUFFICIENT'}
            </div>
            <p>{deflectionResult.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};
