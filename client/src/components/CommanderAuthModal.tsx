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
  Radio
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
      // Resilient fallback
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-[#0b111e] border border-cyan-500/50 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.3)] font-['Plus_Jakarta_Sans'] text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-cyan-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  SECURITY LEVEL 4
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <h3 className="font-extrabold text-base text-white">
                EOC Commander Authentication
              </h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify(passcode);
          }}
          className="p-5 sm:p-6 flex flex-col gap-4"
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Restricted Government Terminal. Access is reserved for <strong className="text-white">NDMA, PDMA, and Rescue 1122</strong> operational commanders to control hospital surge diversion, telemetry grids, and military asset dispatch.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Passcode Input */}
          <div>
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Commander Access Passcode</span>
              <span className="text-[10px] text-slate-500 font-normal">Default: NDMA-1122</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. NDMA-1122)"
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono"
              />
            </div>
          </div>

          {/* Unlock Button */}
          <button
            type="submit"
            disabled={isLoading || !passcode.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs sm:text-sm font-mono tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
          >
            {isLoading ? (
              <span>AUTHENTICATING CREDENTIALS...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>UNLOCK COMMAND CENTER</span>
              </>
            )}
          </button>

          {/* 1-Click Demo Login for Judges */}
          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] font-mono uppercase">
              <span className="bg-[#0b111e] px-2 text-slate-500">FOR JUDGES & EVALUATORS</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-amber-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/50 text-amber-300 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>⚡ 1-CLICK DEMO COMMANDER ACCESS</span>
          </button>

          {/* Cancel & Return to Citizen Portal */}
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-center text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 pt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Citizen Survival Portal</span>
          </button>
        </form>
      </div>
    </div>
  );
};

