import React, { useState, useEffect } from 'react';
import { Radio, Signal, Sliders, CheckCircle2, ShieldCheck, MapPin, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SatelliteBS1, Language } from '../../types/mission';
import { translations, formatNumber } from '../../services/localization';
import { sound } from '../../services/soundEffects';
import { teeEnclave } from '../../services/teeEnclave';

interface BangabandhuSatelliteGameProps {
  language: Language;
  useBengaliDigits: boolean;
  onMissionSuccess: (missionId: string, points: number) => void;
}

export const BangabandhuSatelliteGame: React.FC<BangabandhuSatelliteGameProps> = ({
  language,
  useBengaliDigits,
  onMissionSuccess,
}) => {
  const t = translations[language].challenges.bangabandhuSatellite;

  const [satelliteData, setSatelliteData] = useState<SatelliteBS1 | null>(null);
  const [station, setStation] = useState<'gazipur' | 'betbunia'>('gazipur');
  const [azimuth, setAzimuth] = useState(122); // Target 128.4°
  const [elevation, setElevation] = useState(41); // Target 46.2°
  const [frequencyGhz, setFrequencyGhz] = useState(12.4); // Target 12.5 GHz
  const [rfPowerBoost, setRfPowerBoost] = useState(false);
  const [monsoonWeather, setMonsoonWeather] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    fetch('/api/bangladesh/satellite')
      .then((res) => res.json())
      .then((data) => setSatelliteData(data))
      .catch(() => {});
  }, []);

  // Compute live Signal to Noise Ratio (SNR in dB) based on antenna alignment
  const targetAzimuth = station === 'gazipur' ? 128.4 : 126.8;
  const targetElevation = station === 'gazipur' ? 46.2 : 48.1;
  const targetFreq = 12.5;

  const azError = Math.abs(azimuth - targetAzimuth);
  const elError = Math.abs(elevation - targetElevation);
  const freqError = Math.abs(frequencyGhz - targetFreq);

  let calculatedSnr = Math.max(
    4.0,
    20.5 - (azError * 1.8 + elError * 2.2 + freqError * 8.0)
  );

  // Weather attenuation penalty
  if (monsoonWeather && !rfPowerBoost) {
    calculatedSnr = Math.max(4.0, calculatedSnr - 4.2);
  }

  const snr = parseFloat(calculatedSnr.toFixed(1));
  const isOptimal = snr >= 17.5;

  // Handle link lock
  useEffect(() => {
    if (isOptimal && !isLocked) {
      setIsLocked(true);
      sound.playSuccess();
      confetti({ particleCount: 90, spread: 80 });

      // Commit into TEE Enclave
      teeEnclave.executeEnclaveAction('BS1_TELEMETRY_LOCKED', {
        station,
        snr,
        azimuth,
        elevation,
      }, (state) => ({
        ...state,
        satelliteSnr: snr,
        score: (state.score || 0) + 350,
      }));

      onMissionSuccess('bangabandhu_satellite', 350);
    }
  }, [isOptimal, isLocked, station, snr, azimuth, elevation]);

  return (
    <div className="flutter-card rounded-2xl p-4 sm:p-6 hud-panel space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              {language === 'bn' ? t.titleBn : t.title}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          GEO 119.1°E Slot
        </span>
      </div>

      {/* Earth Station Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => {
            sound.playClick();
            setStation('gazipur');
            setIsLocked(false);
          }}
          className={`p-3 rounded-xl border text-left font-mono transition-all ${
            station === 'gazipur'
              ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {language === 'bn' ? 'গাজীপুর ভূ-উপগ্রহ কেন্দ্র' : 'Gazipur Primary Station'}
            </span>
            <span className="text-[10px] text-cyan-400">11m Dish</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            23.9999° N, 90.4203° E • Latency: 242ms
          </p>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setStation('betbunia');
            setIsLocked(false);
          }}
          className={`p-3 rounded-xl border text-left font-mono transition-all ${
            station === 'betbunia'
              ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {language === 'bn' ? 'বেতবুনিয়া ভূ-উপগ্রহ কেন্দ্র' : 'Betbunia Backup Station'}
            </span>
            <span className="text-[10px] text-cyan-400">9m Dish</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            22.5204° N, 92.0016° E • Latency: 248ms
          </p>
        </button>
      </div>

      {/* Live SNR Meter & Weather Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/40 p-3.5 rounded-xl border border-cyan-500/20 items-center">
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Signal className="w-4 h-4 text-cyan-400" />
              {t.snr}:
            </span>
            <span
              className={`font-bold text-sm ${
                isOptimal ? 'text-emerald-400' : snr > 12 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {formatNumber(snr, useBengaliDigits)} dB
            </span>
          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOptimal
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                  : 'bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
              style={{ width: `${Math.min(100, (snr / 20) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>0 dB</span>
            <span className="text-emerald-400 font-bold">17.5 dB (Lock Threshold)</span>
            <span>20 dB</span>
          </div>
        </div>

        {/* Weather & RF Power Booster */}
        <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">{t.weatherCondition}:</span>
            <span className="text-amber-400 font-bold">
              {monsoonWeather ? '-4.2 dB Rain Fade' : 'Clear Sky'}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setRfPowerBoost(!rfPowerBoost);
            }}
            className={`w-full py-1.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 border transition-all ${
              rfPowerBoost
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-md'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${rfPowerBoost ? 'text-emerald-400 fill-emerald-400' : 'text-slate-400'}`} />
            <span>
              {rfPowerBoost
                ? language === 'bn' ? '✓ আপলিংক পাওয়ার বুস্ট সক্রিয় (+৪.২ dB)' : '✓ RF High-Power Amplifier Active'
                : t.boostPower}
            </span>
          </button>
        </div>
      </div>

      {/* Sliders for Azimuth, Elevation, Frequency */}
      <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        {/* Azimuth */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">{t.azimuth} (Target ~{targetAzimuth}°):</span>
            <span className="text-cyan-400 font-bold">
              {formatNumber(azimuth.toFixed(1), useBengaliDigits)}°
            </span>
          </div>
          <input
            type="range"
            min="115"
            max="140"
            step="0.2"
            value={azimuth}
            onChange={(e) => {
              setAzimuth(parseFloat(e.target.value));
              sound.playClick();
            }}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Elevation */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">{t.elevation} (Target ~{targetElevation}°):</span>
            <span className="text-cyan-400 font-bold">
              {formatNumber(elevation.toFixed(1), useBengaliDigits)}°
            </span>
          </div>
          <input
            type="range"
            min="35"
            max="60"
            step="0.2"
            value={elevation}
            onChange={(e) => {
              setElevation(parseFloat(e.target.value));
              sound.playClick();
            }}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Frequency */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">{t.frequency} (Target ~12.5 GHz):</span>
            <span className="text-cyan-400 font-bold">
              {formatNumber(frequencyGhz.toFixed(2), useBengaliDigits)} GHz
            </span>
          </div>
          <input
            type="range"
            min="11.5"
            max="13.5"
            step="0.05"
            value={frequencyGhz}
            onChange={(e) => {
              setFrequencyGhz(parseFloat(e.target.value));
              sound.playClick();
            }}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

      {/* Lock Confirmation */}
      {isLocked && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold font-mono">
              {language === 'bn' ? 'বঙ্গবন্ধু-১ টেলিমেট্রি লিংক লক সম্পন্ন!' : 'BS-1 SATELLITE LINK LOCKED!'}
            </div>
            <p>{t.successMsg}</p>
            <div className="text-[11px] text-emerald-300 font-mono pt-1">
              +350 XP • {language === 'bn' ? 'টিইই ক্রিপ্টোগ্রাফিক সনদ প্রাপ্ত' : 'TEE Cryptographic Attestation Sealed'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
