import React, { useState, useEffect, useRef } from 'react';
import { Sun, Shield, AlertTriangle, Zap, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DonkiEvent, Language } from '../../types/mission';
import { translations, formatNumber } from '../../services/localization';
import { sound } from '../../services/soundEffects';
import { teeEnclave } from '../../services/teeEnclave';

interface SpaceWeatherShieldGameProps {
  language: Language;
  useBengaliDigits: boolean;
  onMissionSuccess: (missionId: string, points: number) => void;
}

export const SpaceWeatherShieldGame: React.FC<SpaceWeatherShieldGameProps> = ({
  language,
  useBengaliDigits,
  onMissionSuccess,
}) => {
  const t = translations[language].challenges.spaceWeather;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [donkiEvents, setDonkiEvents] = useState<DonkiEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DonkiEvent | null>(null);
  const [shieldActive, setShieldActive] = useState(false);
  const [waveProgress, setWaveProgress] = useState(0); // 0 to 100
  const [isStormActive, setIsStormActive] = useState(false);
  const [shieldEnergy, setShieldEnergy] = useState(100);
  const [missionOutcome, setMissionOutcome] = useState<'success' | 'failure' | null>(null);

  useEffect(() => {
    fetch('/api/nasa/donki')
      .then((res) => res.json())
      .then((data) => {
        if (data.events && data.events.length > 0) {
          setDonkiEvents(data.events);
          setSelectedEvent(data.events[0]);
        }
      })
      .catch(() => {});
  }, []);

  const startSolarStorm = () => {
    if (isStormActive) return;
    setIsStormActive(true);
    setWaveProgress(0);
    setMissionOutcome(null);
    sound.playWarning();
  };

  // Solar storm wave progression
  useEffect(() => {
    if (!isStormActive || missionOutcome) return;

    const interval = setInterval(() => {
      setWaveProgress((prev) => {
        const next = prev + 1.8;
        if (next >= 85 && next <= 95) {
          // Critical impact window!
          if (shieldActive) {
            // Shield successfully deflected CME!
            setIsStormActive(false);
            setMissionOutcome('success');
            sound.playSuccess();
            confetti({ particleCount: 75, spread: 70 });

            teeEnclave.executeEnclaveAction('SOLAR_CME_DEFLECTED', {
              cmeSpeed: selectedEvent?.cmeSpeed_km_s || 940,
              kpIndex: selectedEvent?.kp_index || 6.3,
            }, (state) => ({
              ...state,
              evaShieldActive: true,
              score: (state.score || 0) + 200,
            }));

            onMissionSuccess('space_weather', 200);
            return next;
          }
        } else if (next > 95) {
          // Wave breached without shield!
          setIsStormActive(false);
          setMissionOutcome('failure');
          sound.playWarning();
          return next;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isStormActive, shieldActive, missionOutcome, selectedEvent]);

  // Shield battery decay while active
  useEffect(() => {
    if (!shieldActive) return;
    const interval = setInterval(() => {
      setShieldEnergy((e) => Math.max(0, e - 2));
    }, 100);
    return () => clearInterval(interval);
  }, [shieldActive]);

  const toggleShield = () => {
    if (shieldEnergy <= 0) return;
    const next = !shieldActive;
    setShieldActive(next);
    if (next) sound.playThruster();
  };

  // Render Solar Flare Wave on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 460);
    const height = (canvas.height = 200);

    ctx.clearRect(0, 0, width, height);

    // Sun on the left
    const sunGrad = ctx.createRadialGradient(20, height / 2, 5, 20, height / 2, 70);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.4, '#f59e0b');
    sunGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(20, height / 2, 70, 0, Math.PI * 2);
    ctx.fill();

    // Spacecraft Habitat on the right
    const shipX = width - 60;
    const shipY = height / 2;

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(shipX, shipY, 14, 0, Math.PI * 2);
    ctx.fill();

    // Spacewalking Astronaut symbol
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(shipX, shipY - 24, 6, 0, Math.PI * 2);
    ctx.fill();

    // Magnetic Deflector Shield (if active)
    if (shieldActive) {
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(shipX - 10, shipY, 32, -Math.PI / 2.2, Math.PI / 2.2, true);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Solar Storm Wave Moving Left to Right
    if (isStormActive) {
      const waveX = (waveProgress / 100) * (shipX - 30);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.lineWidth = 5;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 15;

      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(waveX + i * 15, height / 2, 80, -Math.PI / 2.4, Math.PI / 2.4);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }
  }, [waveProgress, shieldActive, isStormActive]);

  return (
    <div className="flutter-card rounded-2xl p-4 sm:p-6 hud-panel space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            {language === 'bn' ? t.titleBn : t.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-amber-950/70 text-amber-300 border border-amber-500/40">
          NASA DONKI Space Weather
        </span>
      </div>

      {/* DONKI Space Weather Event Card */}
      {selectedEvent && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/40 p-3 rounded-xl border border-amber-500/20 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">{t.solarStormLevel}</span>
            <span className="text-amber-300 font-bold">{selectedEvent.classification}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">{t.cmeSpeed}</span>
            <span className="text-cyan-300 font-bold">
              {formatNumber(selectedEvent.cmeSpeed_km_s, useBengaliDigits)} km/s
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">{t.kpIndex}</span>
            <span className="text-rose-400 font-bold">
              Kp {formatNumber(selectedEvent.kp_index, useBengaliDigits)} (G2 Storm)
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">{t.radiationRisk}</span>
            <span className="text-rose-300 font-semibold">{selectedEvent.radiation_risk}</span>
          </div>
        </div>
      )}

      {/* Canvas Storm Field */}
      <div className="relative rounded-xl overflow-hidden border border-amber-500/30 bg-[#09060f] flex justify-center items-center">
        <canvas ref={canvasRef} className="w-full max-w-[460px] h-[190px]" />

        {/* Shield Power & Status Badge */}
        <div className="absolute top-2 right-2 text-right text-[11px] font-mono bg-black/70 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/20">
          <div className="text-slate-300">
            {language === 'bn' ? 'শিল্ড শক্তি' : 'DEFLECTOR POWER'}:{' '}
            <strong className="text-cyan-400">{formatNumber(shieldEnergy, useBengaliDigits)}%</strong>
          </div>
          <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div
              className={`h-full ${shieldEnergy > 20 ? 'bg-cyan-400' : 'bg-rose-500'}`}
              style={{ width: `${shieldEnergy}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls: Trigger Storm & Toggle Deflector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          onClick={startSolarStorm}
          disabled={isStormActive}
          className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-98"
        >
          <Sun className="w-4 h-4 animate-spin-slow" />
          <span>
            {isStormActive
              ? language === 'bn' ? 'সৌরঝড় ধাবমান...' : 'CME Wave Incoming...'
              : language === 'bn' ? 'সৌর করোনাল বিস্ফোরণ শুরু করুন' : 'Simulate Solar Flare CME'}
          </span>
        </button>

        <button
          onClick={toggleShield}
          disabled={shieldEnergy <= 0}
          className={`py-3 px-4 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 border transition-all active:scale-98 ${
            shieldActive
              ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/40 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>
            {shieldActive
              ? language === 'bn' ? 'ম্যাগনেটিক শিল্ড সক্রিয় [ON]' : 'MAGNETIC SHIELD ENGAGED'
              : t.deployShield}
          </span>
        </button>
      </div>

      {/* Outcome Banner */}
      {missionOutcome === 'success' && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold font-mono">
              {language === 'bn' ? 'সৌরঝড় প্রতিহত করা হয়েছে!' : 'SOLAR RADIATION DEFLECTED!'}
            </div>
            <p>{t.successMsg}</p>
            <div className="text-[11px] text-emerald-300 font-mono">
              +200 XP • {language === 'bn' ? 'টিইই এনক্লেভে রেকর্ড নিশ্চিত' : 'TEE Attestation Signed'}
            </div>
          </div>
        </div>
      )}

      {missionOutcome === 'failure' && (
        <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 flex items-start gap-3 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold font-mono">
              {language === 'bn' ? 'রেডিয়েশন শিল্ড ব্যর্থ!' : 'RADIATION BREACH!'}
            </div>
            <p>
              {language === 'bn'
                ? 'সৌর কণা আঘাত করার ঠিক পূর্বে ম্যাগনেটিক শিল্ড অন করতে হবে। পুনরায় চেষ্টা করুন!'
                : 'Shield was not engaged during the critical impact window. Retry timing!'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
