import React from 'react';
import {
  ShieldAlert,
  LifeBuoy,
  Building2,
  Lock,
  MapPin,
  Radio,
  Users,
  Zap,
  PhoneCall,
  Activity,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface RoleGatewayProps {
  onSelectCitizen: () => void;
  onSelectCommander: () => void;
  isCommanderAuthenticated: boolean;
}

export const RoleGateway: React.FC<RoleGatewayProps> = ({
  onSelectCitizen,
  onSelectCommander,
  isCommanderAuthenticated
}) => {
  return (
    <div className="min-h-screen w-full bg-[#080d1a] text-slate-100 font-['Plus_Jakarta_Sans'] flex flex-col items-center justify-center p-4 sm:p-8 select-none relative overflow-hidden">
      {/* Subtle Ambient Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#080d1a] to-[#050811] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-8 sm:gap-10 z-10 my-auto">
        {/* Official Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>National Disaster Intelligence Network</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Pakistan Emergency <span className="text-red-500">Crisis</span> Platform
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Select your operational role below. Citizens in distress access an ultra-lightweight survival intake, while authorized commanders enter the secure tactical operations center.
          </p>
        </div>

        {/* The Two Main Role Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
          {/* ============================================================ */}
          {/* OPTION 1: CITIZEN SURVIVAL MODE (FREE / OPEN TO EVERYONE)    */}
          {/* ============================================================ */}
          <div className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-red-500/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-red-500/40 flex items-center justify-center text-red-400 shadow-sm group-hover:scale-105 transition-transform">
                  <LifeBuoy className="w-6 h-6 text-red-400" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-950/80 border border-red-600/50 text-[10px] font-mono font-black text-red-300 uppercase tracking-widest">
                  PUBLIC ACCESS • NO LOGIN
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl sm:text-2xl font-black text-white mb-2 flex items-center gap-2">
                <span>Citizen Survival Mode</span>
              </h2>
              <span className="text-xs font-mono text-red-400 font-bold block mb-3">
                شہری ہنگامی امدادی پورٹل
              </span>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Designed for victims and families affected by flash floods. Lightweight, sub-second load time, zero clutter, and automatic device GPS locking.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2.5 mb-8 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Automatic high-accuracy device GPS coordinate lock</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-red-400 shrink-0" />
                  <span>1-Tap Roman Urdu & English distress chips</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Nearest safe relief shelter & 1-click 1122 hotlines</span>
                </div>
              </div>
            </div>

            {/* Enter Button */}
            <button
              onClick={onSelectCitizen}
              className="w-full py-4 px-5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all uppercase"
            >
              <span>Enter Citizen Survival Mode</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* ============================================================ */}
          {/* OPTION 2: EOC COMMANDER MODE (RESTRICTED AUTHENTICATION)     */}
          {/* ============================================================ */}
          <div className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  RESTRICTED • LEVEL 4 COMMAND
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl sm:text-2xl font-black text-white mb-2 flex items-center gap-2">
                <span>EOC Commander Center</span>
              </h2>
              <span className="text-xs font-mono text-blue-400 font-bold block mb-3">
                کمانڈ اینڈ کنٹرول ہیڈکوارٹر
              </span>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Restricted operational terminal for NDMA, PDMA, and Rescue 1122. Houses full tactical GIS maps, live radar, and hospital ICU surge telemetry.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2.5 mb-8 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Real-time citizen GPS pings & live distress wire</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Hospital ICU saturation & casualty diversion</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Commander AI priority solver & Qwen-VL drone damage</span>
                </div>
              </div>
            </div>

            {/* Enter Button */}
            <button
              onClick={onSelectCommander}
              className="w-full py-4 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all uppercase"
            >
              <span>
                {isCommanderAuthenticated ? 'Enter Tactical Command Center' : 'Authenticate & Enter EOC'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500 text-center">
          <span>National Disaster Management Authority (NDMA) • Emergency Telemetry Grid</span>
        </div>
      </div>
    </div>
  );
};

