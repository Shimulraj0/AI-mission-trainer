import React, { useState, useEffect } from 'react';
import { 
  Download, Smartphone, ShieldCheck, CheckCircle2, Copy, 
  ExternalLink, Zap, Terminal, Sparkles, AlertCircle, RefreshCw 
} from 'lucide-react';
import { Language } from '../types/mission';
import { translations } from '../services/localization';
import { sound } from '../services/soundEffects';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface ApkInfo {
  fileName: string;
  version: string;
  versionCode: number;
  packageName: string;
  appName: string;
  appNameBn: string;
  fileSizeMB: string;
  fileSizeBytes: number;
  sha256: string;
  minSdkVersion: number;
  targetSdkVersion: number;
  builtAt: string;
  features: string[];
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [apkInfo, setApkInfo] = useState<ApkInfo | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/apk-info')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setApkInfo(data);
        })
        .catch(() => {
          // fallback default
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isBn = language === 'bn';
  const sha256 = apkInfo?.sha256 || '0fd365f5e45e86509d7f04e457c23457c9d38bebacc0f0c9e0924b7c97d8f92d';
  const sizeMB = apkInfo?.fileSizeMB || '0.49';

  const handleCopySha = () => {
    sound.playClick();
    navigator.clipboard.writeText(sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    sound.playSuccess();
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = '/api/download/apk';
    link.setAttribute('download', 'junior-astronaut-mission-trainer.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#070b16] border border-cyan-500/40 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-cyan-600 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#080e22] rounded-[10px] flex items-center justify-center text-cyan-400">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {isBn ? 'অ্যান্ড্রয়েড APK প্যাকেজ' : 'Android APK Release'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-mono">
                  v4.2.0 • Signed
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isBn
                  ? 'স্মার্টফোনে ইন্সটলেশনের জন্য প্রস্তুত অফিশিয়াল সাইনড APK'
                  : 'Production signed standalone APK for Android devices'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Primary Download Card */}
        <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-indigo-950/40 border border-cyan-500/40 rounded-xl p-5 space-y-4 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-cyan-300 font-mono">
                  junior-astronaut-mission-trainer.apk
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/70 text-cyan-200 border border-cyan-500/30">
                  Universal (ARM64/x86)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{isBn ? 'আকার' : 'Size'}: <b className="text-white">{sizeMB} MB</b></span>
                <span>•</span>
                <span>Android 5.0+ (API 21-34)</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  v1+v2+v3 Signed
                </span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm font-mono shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{isBn ? 'ডাউনলোড হচ্ছে...' : 'Downloading...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>{isBn ? 'APK ডাউনলোড করুন' : 'Download APK'}</span>
                </>
              )}
            </button>
          </div>

          {/* SHA-256 Checksum Card */}
          <div className="bg-[#050813] border border-slate-800 rounded-lg p-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                SHA-256 Cryptographic Checksum
              </span>
              <button
                onClick={handleCopySha}
                className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-cyan-300 font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-300 break-all select-all bg-black/40 p-2 rounded border border-slate-900">
              {sha256}
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            {isBn ? 'APK প্যাকেজে অন্তর্ভুক্ত ফিচারসমূহ' : 'Key Native Features'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <b className="text-white block">{isBn ? '১০০% অফলাইন প্লে' : '100% Offline Gameplay'}</b>
                <span className="text-slate-400 text-[11px]">
                  {isBn
                    ? 'ইন্টারনেট ছাড়াই পুরো সিমুলেশন ও গেম খেলা যায়'
                    : 'Complete Vite bundle loads offline via asset protocol'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <b className="text-white block">{isBn ? 'TEE ক্রিপ্টোগ্রাফিক সুরক্ষা' : 'TEE Cryptographic Enclave'}</b>
                <span className="text-slate-400 text-[11px]">
                  {isBn
                    ? 'মিশন স্টেট ও র‍্যাংক সুরক্ষিত হার্ডওয়্যার এনক্লেভে লক করা'
                    : 'Tamper-resistant mission telemetry and PCR registers'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
              <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <b className="text-white block">{isBn ? '২৪টি ওপেনকোড থিম' : '24 OpenCode CLI Themes'}</b>
                <span className="text-slate-400 text-[11px]">
                  {isBn
                    ? 'সাইবারপাংক, ম্যাট্রিক্স, মনোকাই ও ভাইব্রেন্ট মোড'
                    : 'Full palette variations with custom glow effects'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <b className="text-white block">{isBn ? 'নাসা ও স্পারসো লাইভ ফিড' : 'NASA & SPARRSO Link'}</b>
                <span className="text-slate-400 text-[11px]">
                  {isBn
                    ? 'আইএসএস ট্র্যাকিং, সৌরঝড় এবং বঙ্গবন্ধু স্যাটেলাইট-১'
                    : 'Live ISS orbit, solar flares, and Gazipur ground station'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <h4 className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            {isBn ? 'অ্যান্ড্রয়েড ফোনে যেভাবে ইন্সটল করবেন (How to Install)' : 'How to Install on Android'}
          </h4>
          <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside font-sans">
            <li>
              <b>{isBn ? 'ডাউনলোড সম্পন্ন করুন' : 'Download the APK'}</b>: {isBn ? 'উপরের "APK ডাউনলোড করুন" বাটনে চাপ দিয়ে ফাইলটি সেভ করুন।' : 'Tap Download APK above to save the .apk package.'}
            </li>
            <li>
              <b>{isBn ? 'ফাইল ওপেন করুন' : 'Open Downloaded File'}</b>: {isBn ? 'নোটিফিকেশন বার অথবা Files অ্যাপ থেকে ডাউনলোড ফাইলটিতে ট্যাপ করুন।' : 'Tap the file notification or find it in your Downloads folder.'}
            </li>
            <li>
              <b>{isBn ? 'অনুমতি দিন' : 'Allow Installation'}</b>: {isBn ? 'যদি "Unknown source" বা "অজানা উৎস" সতর্কবার্তা আসে, Settings-এ গিয়ে অনুমতি চালু করুন।' : 'If prompted with "Install unknown apps", tap Settings and toggle Allow.'}
            </li>
            <li>
              <b>{isBn ? 'মিশন শুরু করুন' : 'Install & Launch'}</b>: {isBn ? '"Install" এ ট্যাপ করে জুনিয়র নভোচারী মিশন শুরু করুন!' : 'Tap Install and launch your Junior Astronaut training!'}
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
          <span>Package: org.juniorastronaut.trainer</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
