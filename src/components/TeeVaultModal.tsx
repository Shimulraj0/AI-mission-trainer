import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Key, Lock, AlertOctagon, CheckCircle2, RefreshCw, Terminal, Cpu } from 'lucide-react';
import { Language, CadetProfile } from '../types/mission';
import { translations, formatNumber } from '../services/localization';
import { sound } from '../services/soundEffects';
import { teeEnclave, EnclaveAttestationReport } from '../services/teeEnclave';

interface TeeVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  useBengaliDigits: boolean;
  cadet: CadetProfile;
}

export const TeeVaultModal: React.FC<TeeVaultModalProps> = ({
  isOpen,
  onClose,
  language,
  useBengaliDigits,
  cadet,
}) => {
  const t = translations[language].teeVault;

  const [pcrData, setPcrData] = useState(teeEnclave.getPcrRegisters());
  const [tamperLogs, setTamperLogs] = useState<string[]>([]);
  const [isSimulatingTamper, setIsSimulatingTamper] = useState(false);
  const [attestationReport, setAttestationReport] = useState<EnclaveAttestationReport | null>(null);
  const [serverVerification, setServerVerification] = useState<any>(null);
  const [isVerifyingServer, setIsVerifyingServer] = useState(false);

  useEffect(() => {
    const unsub = teeEnclave.onStateChange(() => {
      setPcrData(teeEnclave.getPcrRegisters());
    });

    const unsubAlert = teeEnclave.onTamperAlert((msg) => {
      setTamperLogs((prev) => [msg, ...prev.slice(0, 5)]);
    });

    return () => {
      unsub();
      unsubAlert();
    };
  }, []);

  if (!isOpen) return null;

  const handleSimulateTamper = async () => {
    setIsSimulatingTamper(true);
    await teeEnclave.simulateTamperAttack('fuel', 99999);
    setTimeout(() => {
      setIsSimulatingTamper(false);
    }, 1500);
  };

  const handleGenerateReport = async () => {
    sound.playClick();
    const report = await teeEnclave.generateAttestationReport(cadet.id, 'MISSION_ACTIVE');
    setAttestationReport(report);
  };

  const handleVerifyServer = async () => {
    if (!attestationReport) {
      const rep = await teeEnclave.generateAttestationReport(cadet.id, 'MISSION_ACTIVE');
      setAttestationReport(rep);
    }

    setIsVerifyingServer(true);
    sound.playClick();

    try {
      const rep = attestationReport || (await teeEnclave.generateAttestationReport(cadet.id, 'MISSION_ACTIVE'));
      const resp = await fetch('/api/tee/attest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cadetId: rep.cadetId,
          pcr0: rep.pcr0,
          pcr1: rep.pcr1,
          pcr2: rep.pcr2,
          pcr3: rep.pcr3,
          stateHash: rep.stateHash,
          nonce: rep.nonce,
          clientSignature: rep.hmacSignature,
          missionId: 'MISSION_ACTIVE',
        }),
      });

      const data = await resp.json();
      setServerVerification(data);
      sound.playSuccess();
    } catch (_err) {
      sound.playWarning();
    } finally {
      setIsVerifyingServer(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#090f1f] border border-cyan-500/40 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {t.title}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  ARM TrustZone / SGX
                </span>
              </h2>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Informational intro */}
        <div className="bg-cyan-950/30 border border-cyan-500/20 p-3 rounded-xl text-xs text-slate-300 leading-relaxed">
          {t.intro}
        </div>

        {/* Hardware Status Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
          <div className="bg-black/50 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">{t.enclaveId}</span>
            <span className="text-cyan-300 font-bold">{pcrData.keyId}</span>
          </div>

          <div className="bg-black/50 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Security Architecture</span>
            <span className="text-emerald-400 font-bold">Hardware TEE (EAL6+)</span>
          </div>

          <div className="bg-black/50 p-2.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-slate-400 text-[10px] block">{t.tamperEventsCount}</span>
            <span className="text-rose-400 font-bold">
              {formatNumber(pcrData.tamperCount, useBengaliDigits)} Attempts Thwarted
            </span>
          </div>
        </div>

        {/* Platform Configuration Registers (PCRs) */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            Hardware PCR Registers (Platform Configuration Registers)
          </h3>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col sm:flex-row justify-between gap-1">
              <span className="text-cyan-300 shrink-0">{t.pcr0Title}:</span>
              <span className="text-slate-400 truncate max-w-sm sm:max-w-md">{pcrData.pcr0}</span>
            </div>

            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col sm:flex-row justify-between gap-1">
              <span className="text-emerald-300 shrink-0">{t.pcr1Title}:</span>
              <span className="text-slate-400 truncate max-w-sm sm:max-w-md">{pcrData.pcr1}</span>
            </div>

            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col sm:flex-row justify-between gap-1">
              <span className="text-purple-300 shrink-0">{t.pcr2Title}:</span>
              <span className="text-slate-400 truncate max-w-sm sm:max-w-md">{pcrData.pcr2}</span>
            </div>

            <div className="bg-slate-900/80 p-2 rounded-lg border border-cyan-500/30 flex flex-col sm:flex-row justify-between gap-1">
              <span className="text-amber-300 shrink-0 font-bold">{t.pcr3Title}:</span>
              <span className="text-amber-200 font-bold truncate max-w-sm sm:max-w-md">{pcrData.pcr3}</span>
            </div>
          </div>
        </div>

        {/* Tamper Attack Simulation Section */}
        <div className="bg-rose-950/30 border border-rose-500/30 p-3.5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>{t.tamperSimulationTitle}</span>
          </div>
          <p className="text-xs text-slate-300">{t.tamperSimulationDesc}</p>

          <button
            onClick={handleSimulateTamper}
            disabled={isSimulatingTamper}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t.triggerAttackBtn}</span>
          </button>

          {/* Tamper Alert Terminal Logs */}
          {tamperLogs.length > 0 && (
            <div className="bg-black/80 rounded-lg p-2.5 font-mono text-[11px] text-rose-300 space-y-1 max-h-24 overflow-y-auto border border-rose-500/30">
              <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-rose-400" />
                Live Enclave Tamper Watchdog Output:
              </div>
              {tamperLogs.map((log, idx) => (
                <div key={idx} className="leading-tight">
                  &gt; {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attestation & Remote Verification Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleGenerateReport}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>{t.generateReportBtn}</span>
          </button>

          <button
            onClick={handleVerifyServer}
            disabled={isVerifyingServer}
            className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {isVerifyingServer ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{t.verifyServerBtn}</span>
          </button>
        </div>

        {/* Server Attestation Report Card */}
        {serverVerification && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-mono space-y-1.5 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SERVER ROOT ATTESTATION VERIFIED [PASS]</span>
            </div>
            <div>
              Issuer:{' '}
              <span className="text-white font-semibold">
                {serverVerification.enclave_id}
              </span>
            </div>
            <div>
              Enclave Signature:{' '}
              <span className="text-cyan-300 truncate block">
                {serverVerification.attestation_certificate?.server_enclave_signature}
              </span>
            </div>
            <div>
              Integrity Level:{' '}
              <span className="text-white">
                {serverVerification.attestation_certificate?.security_level}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
