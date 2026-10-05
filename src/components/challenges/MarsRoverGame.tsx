import React, { useState, useEffect, useRef } from 'react';
import { Compass, Battery, Thermometer, Wind, CheckCircle2, AlertOctagon, RotateCcw, Crosshair } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MarsData, Language } from '../../types/mission';
import { translations, formatNumber } from '../../services/localization';
import { sound } from '../../services/soundEffects';
import { teeEnclave } from '../../services/teeEnclave';

interface MarsRoverGameProps {
  language: Language;
  useBengaliDigits: boolean;
  onMissionSuccess: (missionId: string, points: number) => void;
}

export const MarsRoverGame: React.FC<MarsRoverGameProps> = ({
  language,
  useBengaliDigits,
  onMissionSuccess,
}) => {
  const t = translations[language].challenges.marsRover;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [marsData, setMarsData] = useState<MarsData | null>(null);
  // Rover grid position
  const [roverX, setRoverX] = useState(2); // grid 0-4
  const [roverY, setRoverY] = useState(4); // grid 0-4
  const [roverAngle, setRoverAngle] = useState(0); // 0 = up, 90 = right, 180 = down, 270 = left
  const [battery, setBattery] = useState(100);
  const [samplesCollected, setSamplesCollected] = useState(0);
  const [isDrilling, setIsDrilling] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Grid rocks & science targets
  const [samples, setSamples] = useState([
    { id: 1, x: 1, y: 1, name: 'Clay Mudstone', gathered: false },
    { id: 2, x: 3, y: 0, name: 'Olivine Igneous', gathered: false },
    { id: 3, x: 4, y: 3, name: 'Carbonate Rim', gathered: false },
  ]);

  const hazards = [
    { x: 2, y: 2, name: 'Basalt Boulder' },
    { x: 0, y: 3, name: 'Sand Dune Trap' },
    { x: 3, y: 2, name: 'Crater Ridge' },
  ];

  useEffect(() => {
    fetch('/api/nasa/mars')
      .then((res) => res.json())
      .then((data) => setMarsData(data))
      .catch(() => {});
  }, []);

  const moveForward = () => {
    if (battery <= 5 || hasCompleted) return;
    sound.playClick();

    let nx = roverX;
    let ny = roverY;
    if (roverAngle === 0) ny -= 1;
    if (roverAngle === 90) nx += 1;
    if (roverAngle === 180) ny += 1;
    if (roverAngle === 270) nx -= 1;

    // Bounds check
    if (nx < 0 || nx > 4 || ny < 0 || ny > 4) {
      sound.playWarning();
      return;
    }

    // Hazard check
    const hitHazard = hazards.find((h) => h.x === nx && h.y === ny);
    if (hitHazard) {
      sound.playWarning();
      setBattery((b) => Math.max(0, b - 15));
      return;
    }

    setRoverX(nx);
    setRoverY(ny);
    setBattery((b) => Math.max(0, b - 4));

    // Update inside TEE
    teeEnclave.executeEnclaveAction('ROVER_STEP', { x: nx, y: ny }, (state) => ({
      ...state,
      roverPosition: { x: nx, y: ny },
    }));
  };

  const turnRover = (direction: 'left' | 'right') => {
    if (battery <= 2 || hasCompleted) return;
    sound.playClick();
    setRoverAngle((ang) => (ang + (direction === 'right' ? 90 : 270)) % 360);
    setBattery((b) => Math.max(0, b - 2));
  };

  const drillSample = async () => {
    if (isDrilling || hasCompleted) return;

    // Check if on sample spot
    const target = samples.find((s) => s.x === roverX && s.y === roverY && !s.gathered);
    if (!target) {
      sound.playWarning();
      return;
    }

    setIsDrilling(true);
    sound.playThruster();

    setTimeout(async () => {
      sound.playSuccess();
      target.gathered = true;
      setSamples([...samples]);
      const nextCount = samplesCollected + 1;
      setSamplesCollected(nextCount);
      setIsDrilling(false);

      // Commit to TEE Enclave
      await teeEnclave.executeEnclaveAction('MARS_SAMPLE_GATHERED', {
        sampleName: target.name,
        totalCollected: nextCount,
      }, (state) => ({
        ...state,
        marsSampleCount: nextCount,
        score: (state.score || 0) + 150,
      }));

      if (nextCount >= 3) {
        setHasCompleted(true);
        confetti({ particleCount: 80, spread: 75 });
        onMissionSuccess('mars_rover', 300);
      }
    }, 1200);
  };

  const resetRover = () => {
    setRoverX(2);
    setRoverY(4);
    setRoverAngle(0);
    setBattery(100);
    setSamplesCollected(0);
    setHasCompleted(false);
    setSamples([
      { id: 1, x: 1, y: 1, name: 'Clay Mudstone', gathered: false },
      { id: 2, x: 3, y: 0, name: 'Olivine Igneous', gathered: false },
      { id: 3, x: 4, y: 3, name: 'Carbonate Rim', gathered: false },
    ]);
  };

  // Render Grid on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;
    const cellSize = size / 5;

    ctx.clearRect(0, 0, size, size);

    // Martian terrain rust background
    ctx.fillStyle = '#1c0f0d';
    ctx.fillRect(0, 0, size, size);

    // Grid lines
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }

    // Draw hazards (Boulders / Dunes)
    hazards.forEach((h) => {
      ctx.fillStyle = 'rgba(220, 38, 38, 0.4)';
      ctx.beginPath();
      ctx.arc(
        h.x * cellSize + cellSize / 2,
        h.y * cellSize + cellSize / 2,
        cellSize * 0.35,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Draw Science Core Targets
    samples.forEach((s) => {
      if (!s.gathered) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.beginPath();
        ctx.arc(
          s.x * cellSize + cellSize / 2,
          s.y * cellSize + cellSize / 2,
          cellSize * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw Perseverance Rover
    const rx = roverX * cellSize + cellSize / 2;
    const ry = roverY * cellSize + cellSize / 2;

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate((roverAngle * Math.PI) / 180);

    // Rover chassis
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-cellSize * 0.25, -cellSize * 0.3, cellSize * 0.5, cellSize * 0.6);

    // Rover wheels
    ctx.fillStyle = '#e2e8f0';
    [-1, 1].forEach((side) => {
      [-cellSize * 0.25, 0, cellSize * 0.25].forEach((pos) => {
        ctx.fillRect(side * (cellSize * 0.28) - 2, pos - 4, 4, 8);
      });
    });

    // Mastcam arrow pointing forward
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(0, -cellSize * 0.38);
    ctx.lineTo(-cellSize * 0.15, -cellSize * 0.2);
    ctx.lineTo(cellSize * 0.15, -cellSize * 0.2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }, [roverX, roverY, roverAngle, samples]);

  const isOnSample = samples.some((s) => s.x === roverX && s.y === roverY && !s.gathered);

  return (
    <div className="flutter-card rounded-2xl p-4 sm:p-6 hud-panel space-y-4">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500" />
            {language === 'bn' ? t.titleBn : t.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-red-950/70 text-red-300 border border-red-500/40">
            Jezero Crater, Mars
          </span>
          <button
            onClick={resetRover}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            title="Reset Rover"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* NASA Mars Telemetry Strip */}
      {marsData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/40 p-2.5 rounded-xl border border-red-500/20 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span>
              {t.temperature}:{' '}
              <strong className="text-cyan-300">
                {formatNumber(marsData.temperature_celsius, useBengaliDigits)}°C
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Wind className="w-4 h-4 text-emerald-400" />
            <span>
              {t.pressure}:{' '}
              <strong className="text-emerald-300">
                {formatNumber(marsData.atmospheric_pressure_pa, useBengaliDigits)} Pa
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Battery className="w-4 h-4 text-amber-400" />
            <span>
              {language === 'bn' ? 'ব্যাটারি' : 'Power'}:{' '}
              <strong className={battery > 25 ? 'text-amber-300' : 'text-rose-400'}>
                {formatNumber(battery, useBengaliDigits)}%
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Crosshair className="w-4 h-4 text-purple-400" />
            <span>
              {t.samplesCollected}:{' '}
              <strong className="text-purple-300 font-bold">
                {formatNumber(samplesCollected, useBengaliDigits)} /{' '}
                {formatNumber(3, useBengaliDigits)}
              </strong>
            </span>
          </div>
        </div>
      )}

      {/* Grid Canvas & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Canvas Display */}
        <div className="relative rounded-xl overflow-hidden border border-red-500/30 flex justify-center bg-[#0d0706]">
          <canvas ref={canvasRef} className="w-[280px] h-[280px]" />

          {/* Victory Overlay */}
          {hasCompleted && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
              <h3 className="text-base font-bold text-white mb-1">
                {language === 'bn' ? 'মঙ্গল বিজ্ঞান মিশন সফল!' : 'MARTIAN SCIENCE SUCCESS!'}
              </h3>
              <p className="text-xs text-slate-300 mb-3">{t.successMsg}</p>
              <button
                onClick={resetRover}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                {language === 'bn' ? 'পুনরায় অনুসন্ধান' : 'Survey Again'}
              </button>
            </div>
          )}
        </div>

        {/* Driving Controls */}
        <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <div className="text-center font-mono text-xs text-slate-300">
            {language === 'bn' ? 'রোভার নেভিগেশন কমান্ড' : 'ROVER DRIVE COMMANDS'}
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
            <div />
            <button
              onClick={moveForward}
              disabled={battery <= 0 || hasCompleted}
              className="py-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-200 font-bold text-xs font-mono active:scale-95 disabled:opacity-50"
            >
              ▲ {language === 'bn' ? 'সামনে' : 'FWD'}
            </button>
            <div />

            <button
              onClick={() => turnRover('left')}
              disabled={battery <= 0 || hasCompleted}
              className="py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono active:scale-95 disabled:opacity-50"
            >
              ◀ {language === 'bn' ? 'বাম' : 'LEFT'}
            </button>

            <button
              onClick={drillSample}
              disabled={!isOnSample || isDrilling || hasCompleted}
              className={`py-3 rounded-xl border text-xs font-mono font-bold active:scale-95 transition-all ${
                isOnSample
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 animate-pulse'
                  : 'bg-slate-800/50 text-slate-500 border-slate-800'
              }`}
            >
              {isDrilling ? '...' : language === 'bn' ? 'ড্রিল' : 'DRILL'}
            </button>

            <button
              onClick={() => turnRover('right')}
              disabled={battery <= 0 || hasCompleted}
              className="py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono active:scale-95 disabled:opacity-50"
            >
              ▶ {language === 'bn' ? 'ডান' : 'RIGHT'}
            </button>
          </div>

          {/* Drill Status Hint */}
          <div className="text-[11px] font-mono text-center">
            {isOnSample ? (
              <span className="text-emerald-400 font-semibold">
                {language === 'bn'
                  ? '✓ প্রাচীন শিলার কোর পাওয়া গেছে! ড্রিল বোতাম চাপুন!'
                  : '✓ Rock core detected! Press DRILL to sample.'}
              </span>
            ) : (
              <span className="text-slate-400">
                {language === 'bn'
                  ? 'সবুজ মার্কারের দিকে রোভার চালান'
                  : 'Drive toward green science targets'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
