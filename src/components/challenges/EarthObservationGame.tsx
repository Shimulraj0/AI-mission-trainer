import React, { useState, useEffect, useRef } from 'react';
import { Globe2, Eye, Wind, AlertTriangle, CheckCircle2, Radio, Sliders, Layers, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EarthEvent, Language } from '../../types/mission';
import { translations, formatNumber } from '../../services/localization';
import { sound } from '../../services/soundEffects';
import { teeEnclave } from '../../services/teeEnclave';
import { nasaService } from '../../services/nasaService';

interface EarthObservationGameProps {
  language: Language;
  useBengaliDigits: boolean;
  onMissionSuccess: (missionId: string, points: number) => void;
}

export const EarthObservationGame: React.FC<EarthObservationGameProps> = ({
  language,
  useBengaliDigits,
  onMissionSuccess,
}) => {
  const t = translations[language].challenges.earthObservation;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [events, setEvents] = useState<EarthEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EarthEvent | null>(null);
  const [sensorBand, setSensorBand] = useState<'visible' | 'thermal' | 'watervapor'>('thermal');
  const [contrast, setContrast] = useState(65);
  const [targetEyeAligned, setTargetEyeAligned] = useState(false);
  const [sensorX, setSensorX] = useState(140);
  const [sensorY, setSensorY] = useState(120);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await nasaService.fetchEarthEvents();
      if (data && data.length > 0) {
        setEvents(data);
        setSelectedEvent(data[0]);
      }
    };
    loadEvents();
  }, []);

  // Check alignment with cyclone eye (center around x: 180, y: 150)
  const targetX = 180;
  const targetY = 150;
  const alignmentDist = Math.hypot(sensorX - targetX, sensorY - targetY);
  const isAligned = alignmentDist < 30;

  const handleTransmitWarning = async () => {
    if (!isAligned || isTransmitting || isCompleted) return;

    setIsTransmitting(true);
    sound.playRadarPing();

    setTimeout(async () => {
      sound.playSuccess();
      confetti({ particleCount: 85, spread: 75 });
      setIsCompleted(true);
      setIsTransmitting(false);

      // Commit to TEE Enclave
      await teeEnclave.executeEnclaveAction('EARTH_RECON_VERIFIED', {
        eventId: selectedEvent?.id || 'CYCLONE_BOB',
        sensorBand,
        alignmentDist,
      }, (state) => ({
        ...state,
        earthReconCompleted: true,
        score: (state.score || 0) + 280,
      }));

      onMissionSuccess('earth_observation', 280);
    }, 1200);
  };

  // Canvas Multispectral Satellite Display
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 460);
    const height = (canvas.height = 280);

    ctx.clearRect(0, 0, width, height);

    // Deep ocean background (Bay of Bengal)
    ctx.fillStyle = sensorBand === 'thermal' ? '#070b19' : sensorBand === 'watervapor' ? '#091629' : '#030814';
    ctx.fillRect(0, 0, width, height);

    // Coastal coastline of Bangladesh (Delta representation)
    ctx.strokeStyle = sensorBand === 'thermal' ? '#06b6d4' : sensorBand === 'watervapor' ? '#38bdf8' : '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 40);
    ctx.quadraticCurveTo(140, 70, 220, 50); // Sundarbans / Coastal Belt
    ctx.quadraticCurveTo(300, 80, 400, 110); // Chittagong coastline
    ctx.stroke();

    // Delta label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px monospace';
    ctx.fillText('BANGLADESH COAST & SUNDARBANS', 80, 30);
    ctx.fillText('BAY OF BENGAL', 180, 260);

    // Cyclone vortex bands (centered at targetX, targetY)
    const bandColor =
      sensorBand === 'thermal'
        ? 'rgba(239, 68, 68, 0.7)' // Red convective core in thermal IR
        : sensorBand === 'watervapor'
        ? 'rgba(168, 85, 247, 0.65)' // Purple/violet moisture plume
        : 'rgba(255, 255, 255, 0.8)'; // White clouds

    // Swirling spiral arms
    ctx.save();
    ctx.translate(targetX, targetY);

    for (let r = 15; r < 100; r += 18) {
      ctx.strokeStyle = bandColor;
      ctx.lineWidth = Math.max(1, 4 - r * 0.03);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 1.6);
      ctx.stroke();
    }

    // Cyclone Eye
    ctx.fillStyle = '#050a17';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Sensor Reticle (Player moving reticle)
    ctx.save();
    ctx.translate(sensorX, sensorY);

    ctx.strokeStyle = isAligned ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 2;

    // Crosshair rings
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-35, 0);
    ctx.lineTo(35, 0);
    ctx.moveTo(0, -35);
    ctx.lineTo(0, 35);
    ctx.stroke();

    ctx.restore();
  }, [sensorBand, sensorX, sensorY, isAligned]);

  return (
    <div className="flutter-card rounded-2xl p-4 sm:p-6 hud-panel space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            {language === 'bn' ? t.titleBn : t.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          NASA EONET & MODIS Feed
        </span>
      </div>

      {/* Target Natural Event Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {events.map((ev) => {
          const isSelected = selectedEvent?.id === ev.id;

          return (
            <button
              key={ev.id}
              onClick={() => {
                sound.playClick();
                setSelectedEvent(ev);
                setIsCompleted(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-cyan-950/80 border-2 border-cyan-400 text-cyan-200 shadow-md'
                  : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'bn' ? ev.title_bn : ev.title}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Event Telemetry Banner */}
      {selectedEvent && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/40 p-3 rounded-xl border border-cyan-500/20 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">{t.category}</span>
            <span className="text-cyan-300 font-bold">
              {language === 'bn' ? selectedEvent.category_bn : selectedEvent.category}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">{t.stormPressure}</span>
            <span className="text-amber-300 font-bold">
              {formatNumber(selectedEvent.pressure_hpa || 982, useBengaliDigits)} hPa
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">{t.cloudTemp}</span>
            <span className="text-rose-400 font-bold">
              {formatNumber(selectedEvent.cloud_top_temp_c || -74, useBengaliDigits)}°C
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">{language === 'bn' ? 'উপগ্রহ ট্র্যাক' : 'SENSOR'}</span>
            <span className="text-emerald-300 font-bold truncate block">
              {selectedEvent.satellite_mission}
            </span>
          </div>
        </div>
      )}

      {/* Multispectral Sensor Band Switcher */}
      <div className="flex flex-wrap gap-2 items-center justify-between text-xs font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-cyan-400" />
          {t.spectralBand}:
        </span>

        <div className="flex gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setSensorBand('visible');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              sensorBand === 'visible'
                ? 'bg-slate-200 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.visibleBand}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setSensorBand('thermal');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              sensorBand === 'thermal'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.infraredBand}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setSensorBand('watervapor');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              sensorBand === 'watervapor'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.waterVaporBand}
          </button>
        </div>
      </div>

      {/* Multispectral Radar Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-[#040813] flex justify-center items-center">
        <canvas ref={canvasRef} className="w-full max-w-[460px] h-[260px]" />

        {/* Alignment Indicator */}
        <div className="absolute top-2 left-2 text-[11px] font-mono bg-black/70 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/20">
          <div className="text-slate-300">
            {language === 'bn' ? 'চোখের কেন্দ্র বিচ্যুতি' : 'EYE OFFSET'}:{' '}
            <span className={isAligned ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
              {formatNumber(Math.round(alignmentDist), useBengaliDigits)} km
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {isAligned ? '✓ TARGET EYE LOCKED' : 'ALIGN RETICLE OVER CYCLONE CORE'}
          </div>
        </div>
      </div>

      {/* Sensor Reticle Sliders (Azimuth / Latitude adjustments) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">{language === 'bn' ? 'স্যাটেলাইট দ্রাঘিমাংশ (X):' : 'Satellite Sensor Longitude (X):'}</span>
            <span className="text-cyan-400 font-bold">{formatNumber(sensorX, useBengaliDigits)}</span>
          </div>
          <input
            type="range"
            min="60"
            max="300"
            value={sensorX}
            onChange={(e) => setSensorX(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">{language === 'bn' ? 'স্যাটেলাইট অক্ষাংশ (Y):' : 'Satellite Sensor Latitude (Y):'}</span>
            <span className="text-cyan-400 font-bold">{formatNumber(sensorY, useBengaliDigits)}</span>
          </div>
          <input
            type="range"
            min="50"
            max="230"
            value={sensorY}
            onChange={(e) => setSensorY(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

      {/* Transmit Early Warning Action Button */}
      <button
        onClick={handleTransmitWarning}
        disabled={!isAligned || isTransmitting || isCompleted}
        className={`w-full py-3 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg ${
          isAligned && !isCompleted
            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-emerald-500/30 animate-pulse'
            : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
        }`}
      >
        <Send className="w-4 h-4" />
        <span>
          {isTransmitting
            ? language === 'bn' ? 'টেলিমেট্রি ব্রডকাস্ট হচ্ছে...' : 'Transmitting Recon Telemetry...'
            : isCompleted
            ? language === 'bn' ? '✓ সতর্কবার্তা সফলভাবে প্রেরিত' : '✓ Early Warning Dispatched'
            : t.transmitWarning}
        </span>
      </button>

      {/* Success Banner */}
      {isCompleted && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold font-mono">
              {language === 'bn' ? 'ঘূর্ণিঝড় রিকনেসান্স সফল!' : 'CYCLONE RECONNAISSANCE VERIFIED!'}
            </div>
            <p>{t.successMsg}</p>
            <div className="text-[11px] text-emerald-300 font-mono">
              +280 XP • {language === 'bn' ? 'টিইই এনক্লেভে রেকর্ড সংরক্ষিত' : 'TEE Attestation Sealed'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
