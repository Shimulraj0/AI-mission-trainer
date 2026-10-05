import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, RefreshCw, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../../types/mission';
import { translations, formatNumber } from '../../services/localization';
import { sound } from '../../services/soundEffects';
import { teeEnclave } from '../../services/teeEnclave';

interface IssDockingGameProps {
  language: Language;
  useBengaliDigits: boolean;
  onMissionSuccess: (missionId: string, points: number) => void;
}

export const IssDockingGame: React.FC<IssDockingGameProps> = ({
  language,
  useBengaliDigits,
  onMissionSuccess,
}) => {
  const t = translations[language].challenges.issDocking;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ship physics state
  const [posX, setPosX] = useState(150); // canvas center offset
  const [posY, setPosY] = useState(140);
  const [distance, setDistance] = useState(120); // meters to docking port
  const [velX, setVelX] = useState(0.8);
  const [velY, setVelY] = useState(-0.6);
  const [approachSpeed, setApproachSpeed] = useState(1.4); // m/s
  const [fuel, setFuel] = useState(100);
  const [isDocked, setIsDocked] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [failureReason, setFailureReason] = useState('');
  const [isVerifyingTee, setIsVerifyingTee] = useState(false);

  // Key controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDocked || hasFailed) return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        thrust('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        thrust('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        thrust('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        thrust('right');
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        thrust('forward');
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        thrust('retro');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDocked, hasFailed, fuel]);

  // Thrust action with TEE State synchronization
  const thrust = (direction: 'up' | 'down' | 'left' | 'right' | 'forward' | 'retro') => {
    if (fuel <= 0 || isDocked || hasFailed) return;

    sound.playRcs();
    setFuel((prev) => Math.max(0, prev - 1.5));

    // Update inside TEE
    teeEnclave.executeEnclaveAction('RCS_THRUST', { direction }, (state) => ({
      ...state,
      fuel: Math.max(0, (state.fuel || 100) - 1.5),
    }));

    const power = 0.35;
    if (direction === 'up') setVelY((v) => v - power);
    if (direction === 'down') setVelY((v) => v + power);
    if (direction === 'left') setVelX((v) => v - power);
    if (direction === 'right') setVelX((v) => v + power);
    if (direction === 'forward') setApproachSpeed((s) => Math.min(3.0, s + 0.3));
    if (direction === 'retro') setApproachSpeed((s) => Math.max(0.1, s - 0.3));
  };

  // Physics animation tick
  useEffect(() => {
    if (isDocked || hasFailed) return;

    const interval = setInterval(() => {
      setPosX((x) => x + velX * 0.5);
      setPosY((y) => y + velY * 0.5);
      setDistance((d) => {
        const nextDist = d - approachSpeed * 0.4;
        if (nextDist <= 5) {
          // Check docking conditions
          checkDockingCapture();
          return 5;
        }
        return nextDist;
      });

      // Drifting dampening
      setVelX((v) => v * 0.985);
      setVelY((v) => v * 0.985);
    }, 50);

    return () => clearInterval(interval);
  }, [velX, velY, approachSpeed, posX, posY, distance, isDocked, hasFailed]);

  // Check docking capture
  const checkDockingCapture = async () => {
    const targetX = 0;
    const targetY = 0;
    const alignmentError = Math.hypot(posX - targetX, posY - targetY);

    if (alignmentError < 35 && approachSpeed <= 0.45) {
      // Soft capture success!
      setIsDocked(true);
      sound.playSuccess();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

      // Commit to TEE Enclave
      setIsVerifyingTee(true);
      await teeEnclave.executeEnclaveAction('ISS_DOCK_VERIFIED', { alignmentError, approachSpeed }, (state) => ({
        ...state,
        dockingAligned: true,
        score: (state.score || 0) + 250,
      }));
      setIsVerifyingTee(false);

      onMissionSuccess('iss_docking', 250);
    } else {
      // Docking failure / Hard contact
      setHasFailed(true);
      sound.playWarning();
      if (approachSpeed > 0.45) {
        setFailureReason(
          language === 'bn'
            ? 'অতিরিক্ত দ্রুত গতিতে আঘাত! ক্যাপচারের জন্য বেগ প্রতি সেকেন্ডে ০.৪৫ মিটারের নিচে হওয়া আবশ্যক।'
            : 'Excessive contact velocity! Approach speed must be below 0.45 m/s.'
        );
      } else {
        setFailureReason(
          language === 'bn'
            ? 'ডকিং পোর্ট সঠিকভাবে সারিবদ্ধ হয়নি! পোর্ট সেন্টারের সাথে সমন্বয় করুন।'
            : 'Docking port misalignment! Center crosshair inside the capture ring.'
        );
      }
    }
  };

  const resetSimulation = () => {
    setPosX(140);
    setPosY(130);
    setDistance(120);
    setVelX(0.7);
    setVelY(-0.5);
    setApproachSpeed(1.2);
    setFuel(100);
    setIsDocked(false);
    setHasFailed(false);
    setFailureReason('');
  };

  // Render HUD on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 460);
    const height = (canvas.height = 300);
    const cx = width / 2;
    const cy = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Deep space background grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // ISS Harmony Module Docking Port (Target)
    const scaleByDist = Math.max(0.3, (140 - distance) / 100);
    ctx.save();
    ctx.translate(cx, cy);

    // Outer Target Rings
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 45 * scaleByDist, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, 75 * scaleByDist, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Crosshairs
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(20, 0);
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 20);
    ctx.stroke();

    ctx.restore();

    // Player Craft Reticle / Crosshair (Moving)
    const playerCanvasX = cx + posX;
    const playerCanvasY = cy + posY;

    ctx.save();
    ctx.translate(playerCanvasX, playerCanvasY);

    const isNearAlignment = Math.hypot(posX, posY) < 35;
    ctx.strokeStyle = isNearAlignment ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 2;

    // Corner brackets
    const bSize = 14;
    ctx.beginPath();
    // Top-left
    ctx.moveTo(-bSize, -bSize + 6);
    ctx.lineTo(-bSize, -bSize);
    ctx.lineTo(-bSize + 6, -bSize);
    // Top-right
    ctx.moveTo(bSize - 6, -bSize);
    ctx.lineTo(bSize, -bSize);
    ctx.lineTo(bSize, -bSize + 6);
    // Bottom-left
    ctx.moveTo(-bSize, bSize - 6);
    ctx.lineTo(-bSize, bSize);
    ctx.lineTo(-bSize + 6, bSize);
    // Bottom-right
    ctx.moveTo(bSize - 6, bSize);
    ctx.lineTo(bSize, bSize);
    ctx.lineTo(bSize, bSize - 6);
    ctx.stroke();

    // Center pip
    ctx.fillStyle = isNearAlignment ? '#10b981' : '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // Velocity Vector
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(velX * 25, velY * 25);
    ctx.stroke();

    ctx.restore();
  }, [posX, posY, velX, velY, distance]);

  const alignmentDist = Math.round(Math.hypot(posX, posY));
  const isAligned = alignmentDist < 35;

  return (
    <div className="flutter-card rounded-2xl p-4 sm:p-6 hud-panel space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            {language === 'bn' ? t.titleBn : t.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold flex items-center gap-1.5 ${
              isAligned
                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
            }`}
          >
            {isAligned ? t.aligned : t.notAligned}
          </span>
          <button
            onClick={resetSimulation}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 active:scale-95"
            title="Reset Docking Sim"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Docking Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-[#050914] flex justify-center items-center">
        <canvas ref={canvasRef} className="w-full max-w-[460px] h-[260px] sm:h-[300px]" />

        {/* HUD Telemetry Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 text-[11px] font-mono bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/20 text-slate-300">
          <div>
            {language === 'bn' ? 'দূরত্ব' : 'RANGE'}:{' '}
            <span className="text-cyan-400 font-bold">
              {formatNumber(Math.max(0, Math.round(distance)), useBengaliDigits)} m
            </span>
          </div>
          <div>
            {language === 'bn' ? 'আপাত বেগ' : 'REL VEL'}:{' '}
            <span
              className={`font-bold ${
                approachSpeed <= 0.45 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatNumber(approachSpeed.toFixed(2), useBengaliDigits)} m/s
            </span>
          </div>
          <div>
            {language === 'bn' ? 'অক্ষীয় ত্রুটি' : 'OFFSET'}:{' '}
            <span className={isAligned ? 'text-emerald-400' : 'text-amber-400'}>
              {formatNumber(alignmentDist, useBengaliDigits)} px
            </span>
          </div>
        </div>

        {/* Fuel Bar Overlay */}
        <div className="absolute top-2 right-2 text-right text-[11px] font-mono bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/20">
          <div className="text-slate-300">
            {language === 'bn' ? 'আরসিএস জ্বালানি' : 'RCS FUEL'}:{' '}
            <span className="text-cyan-300 font-bold">{formatNumber(Math.round(fuel), useBengaliDigits)}%</span>
          </div>
          <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div
              className={`h-full transition-all ${
                fuel > 30 ? 'bg-cyan-400' : 'bg-rose-500'
              }`}
              style={{ width: `${fuel}%` }}
            />
          </div>
        </div>

        {/* Success Modal Overlay */}
        {isDocked && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {language === 'bn' ? 'ডকিং সফল হয়েছে!' : 'DOCKING CAPTURE CONFIRMED!'}
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mb-3">{t.successMsg}</p>
            <div className="text-xs font-mono text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30 mb-4 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>+250 XP | {language === 'bn' ? 'টিইই এনক্লেভ সত্যায়িত' : 'TEE Attested'}</span>
            </div>
            <button
              onClick={resetSimulation}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
            >
              {language === 'bn' ? 'পুনরায় অনুশীলন করুন' : 'Simulate Again'}
            </button>
          </div>
        )}

        {/* Failure Overlay */}
        {hasFailed && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center mb-2">
              <ShieldAlert className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {language === 'bn' ? 'ডকিং ব্যাহত হয়েছে!' : 'DOCKING ABORTED!'}
            </h3>
            <p className="text-xs text-rose-300 max-w-sm mb-4">{failureReason}</p>
            <button
              onClick={resetSimulation}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-600 font-bold text-xs hover:bg-slate-700"
            >
              {language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Retry Sequence'}
            </button>
          </div>
        )}
      </div>

      {/* Flight Control Buttons (Touch / Mouse & Keyboard) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {/* Direction Pad */}
        <div className="col-span-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-2 font-mono text-center">
            {language === 'bn' ? 'আরসিএস থ্রাস্টার ভেক্টর' : 'RCS PITCH & YAW'}
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => thrust('up')}
              className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:border-cyan-500 border border-slate-700 flex items-center justify-center text-cyan-300 active:scale-95 transition-all"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => thrust('left')}
                className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:border-cyan-500 border border-slate-700 flex items-center justify-center text-cyan-300 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => thrust('down')}
                className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:border-cyan-500 border border-slate-700 flex items-center justify-center text-cyan-300 active:scale-95 transition-all"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => thrust('right')}
                className="w-10 h-8 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:border-cyan-500 border border-slate-700 flex items-center justify-center text-cyan-300 active:scale-95 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Speed Adjustment: Forward / Retro Burn */}
        <div className="col-span-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="text-[11px] text-slate-400 mb-1 font-mono text-center">
            {language === 'bn' ? 'অক্ষীয় বেগ নিয়ন্ত্রণ' : 'AXIAL BURN'}
          </div>
          <div className="grid grid-cols-2 gap-2 my-auto">
            <button
              onClick={() => thrust('forward')}
              className="py-2.5 px-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-200 text-xs font-mono font-bold active:scale-95 flex items-center justify-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'bn' ? 'সামনে (+Z)' : 'Accel (+Z)'}</span>
            </button>
            <button
              onClick={() => thrust('retro')}
              className="py-2.5 px-2 rounded-lg bg-amber-950/80 border border-amber-500/40 hover:bg-amber-900 text-amber-200 text-xs font-mono font-bold active:scale-95 flex items-center justify-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 rotate-180" />
              <span>{language === 'bn' ? 'ব্রেক (-Z)' : 'Retro (-Z)'}</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-400 text-center mt-1">
            {language === 'bn' ? 'শর্টকাট: W/A/S/D ও F/R কী' : 'Keys: W/A/S/D & F/R'}
          </div>
        </div>
      </div>
    </div>
  );
};
