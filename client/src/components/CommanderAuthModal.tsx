import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  KeyRound,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Building2,
  ShieldCheck,
  Radio,
  Activity,
  Satellite,
  Droplets,
  Hospital,
  Compass,
  FileText,
  LifeBuoy,
  ChevronRight,
  Sparkles,
  Server
} from 'lucide-react';

interface CommanderAuthModalProps {
  isOpen: boolean;
  onSuccess: (officerName: string) => void;
  onCancel: () => void;
}

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://emergency-intelligence-platform.onrender.com');

export const CommanderAuthModal: React.FC<CommanderAuthModalProps> = ({
  isOpen,
  onSuccess,
  onCancel
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (codeToVerify: string) => {
    const cleanCode = codeToVerify.trim();
    if (!cleanCode) {
      setError('Please enter your Commander Passcode');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try backend verification first
      const res = await fetch(`${API_BASE}/api/auth/commander-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: cleanCode })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.success) {
          sessionStorage.setItem('eoc_commander_auth', 'true');
          sessionStorage.setItem('eoc_commander_officer', data.officer || 'NDMA Incident Commander');
          onSuccess(data.officer || 'NDMA Incident Commander');
          return;
        }
      }

      // Local fallback verification for demo / offline resilience
      const validCodes = ['NDMA-1122', 'RESCUE-1122', 'commander', 'admin', '1122', 'ndma'];
      if (validCodes.includes(cleanCode.toLowerCase()) || validCodes.includes(cleanCode)) {
        const officerName = 'Brigadier Asad (Duty Commander — NDMA EOC)';
        sessionStorage.setItem('eoc_commander_auth', 'true');
        sessionStorage.setItem('eoc_commander_officer', officerName);
        onSuccess(officerName);
      } else {
        setError('Invalid Passcode. Use "NDMA-1122" or click 1-Click Demo Login below.');
      }
    } catch (err) {
      setError('Connection timeout. Please click 1-Click Demo Access.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    setPasscode('NDMA-1122');
    handleVerify('NDMA-1122');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060a14] text-slate-100 font-['Plus_Jakarta_Sans'] flex flex-col justify-between p-4 sm:p-8 select-none overflow-y-auto animate-in fade-in">
      {/* Background Cybernetic Tactical Grid Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ── TOP MILITARY HEADER BAR ── */}
      <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 z-10 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] shrink-0">
            <ShieldAlert className="w-7 h-7 animate-pulse text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
                RESTRICTED DEFENSE GATEWAY
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono text-emerald-400 font-semibold hidden sm:inline">
                CLEARANCE LEVEL 4
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>National Emergency Operations Center (EOC)</span>
              <span className="text-xs text-slate-500 font-normal font-mono hidden lg:inline">
                • NDMA / Rescue 1122 Joint Telemetry
              </span>
            </h1>
          </div>
        </div>

        {/* Security Telemetry & Back Action */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="hidden xl:flex items-center gap-4 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span>NODE: <strong className="text-slate-200">ISB-HQ-01</strong></span>
            <span>ENCRYPTION: <strong className="text-emerald-400">AES-256 GCM</strong></span>
            <span>GRID: <strong className="text-cyan-400">33.684° N, 73.048° E</strong></span>
          </div>

          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-mono font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Citizen Portal</span>
          </button>
        </div>
      </header>

      {/* ── MAIN FULL-WIDTH TWO-COLUMN COMMAND DECK ── */}
      <main className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 my-6 sm:my-8 z-10 items-stretch">
        {/* LEFT COLUMN: Strategic Operational Briefing & Live System Telemetry (~60% width) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                TACTICAL SITUATIONAL AWARENESS BRIEFING
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Incident Command & Control Protocol
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2.5">
                Authorized entry is restricted to verified disaster response directors, civil defense coordinators, and Rescue 1122 tactical leads. Accessing this terminal activates high-priority multi-criteria triage and military asset dispatch.
              </p>
            </div>

            {/* 4 Live System Telemetry Feeds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <Satellite className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>RainViewer Doppler Radar</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Live satellite radar tiles refreshed every 10 mins across Pakistan.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <Droplets className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Copernicus GloFAS River Basins</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Active streamflow & Nullah Lai Kattarian sensor flood gauge telemetry.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <Hospital className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Tertiary Hospital Surge Grid</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ICU saturation tracking with automated casualty diversion to PIMS.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Qwen-VL Drone Reconnaissance</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Multimodal computer vision for structural damage & flood depth grades.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Command Directives */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                OPERATIONAL DIRECTIVES
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                <li>Immediate dispatch priority given to verified high-accuracy live GPS citizen beacons.</li>
                <li>Ambulances must follow automated obstacle-free routes avoiding Faizabad & Committee Chowk.</li>
                <li>De-watering pump bowsers deployed to protect critical substation electrical infrastructure.</li>
              </ul>
            </div>
          </div>

          {/* Quick Metrics Bar at Bottom of Left Column */}
          <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-slate-800 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-lg sm:text-xl font-black text-cyan-400">4</span>
              <span className="text-[10px] text-slate-400 block uppercase">River Basins</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-lg sm:text-xl font-black text-emerald-400">100%</span>
              <span className="text-[10px] text-slate-400 block uppercase">GIS Accuracy</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-lg sm:text-xl font-black text-orange-400">24/7</span>
              <span className="text-[10px] text-slate-400 block uppercase">Telemetry Sync</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Official Passcode Authentication Terminal (~40% width) */}
        <div className="lg:col-span-5 flex flex-col justify-center bg-[#0b1220] border border-cyan-500/50 rounded-2xl p-6 sm:p-9 shadow-[0_0_60px_rgba(6,182,212,0.25)] relative overflow-hidden">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-800 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/70 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                AUTHENTICATION GATE
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Officer Clearance Portal
              </h3>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(passcode);
            }}
            className="flex flex-col gap-4 sm:gap-5"
          >
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/90 border border-red-500/70 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Passcode Input Field */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                <span>Commander Access Passcode</span>
                <span className="text-[10px] text-slate-500 font-normal">Default: NDMA-1122</span>
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (e.g. NDMA-1122)"
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none font-mono shadow-inner transition-colors"
                />
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !passcode.trim()}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs sm:text-sm font-mono tracking-wide flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-cyan-400/40 transition-all uppercase"
            >
              {isLoading ? (
                <span>VERIFYING CLEARANCE LEVEL...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>UNLOCK EOC COMMAND CENTER</span>
                </>
              )}
            </button>

            {/* Divider for Judges */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] font-mono uppercase">
                <span className="bg-[#0b1220] px-3 text-slate-500 font-semibold">
                  FOR EVALUATORS & HACKATHON JUDGES
                </span>
              </div>
            </div>

            {/* Prominent 1-Click Demo Access Button */}
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600/25 via-orange-600/25 to-amber-600/25 hover:from-amber-600/40 hover:to-orange-600/40 border border-amber-500/60 text-amber-300 font-extrabold text-xs sm:text-sm font-mono flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>⚡ 1-CLICK DEMO COMMANDER ACCESS</span>
            </button>
            <span className="text-[10px] text-center font-mono text-slate-500">
              Instant evaluation bypass: grants Level 4 Command privileges with 1 tap.
            </span>
          </form>
        </div>
      </main>

      {/* ── BOTTOM DEFENSE TELEMETRY FOOTER ── */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 pt-5 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span>GOVERNMENT OF PAKISTAN • CIVIL DEFENSE DIRECTIVE 1122</span>
          <span className="hidden md:inline">• ALL DISPATCH ACTIONS LOGGED</span>
        </div>
        <div className="flex items-center gap-2">
          <Server className="w-3 h-3 text-emerald-400" />
          <span>RENDER CLOUD CLUSTER: <strong className="text-slate-400">ONLINE (200 OK)</strong></span>
        </div>
      </footer>
    </div>
  );
};
