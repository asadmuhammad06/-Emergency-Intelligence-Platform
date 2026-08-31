import React from 'react';
import {
  AlertTriangle,
  Play,
  RotateCcw,
  Navigation,
  Send,
  PlusCircle,
  Radio,
  Layers,
  Hospital,
  Droplets,
  Zap,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';

interface NavbarProps {
  onOpenSafeRouteModal: () => void;
  onOpenPriorityModal: () => void;
  onOpenCitizenModal: () => void;
  onOpenLayersModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSafeRouteModal,
  onOpenPriorityModal,
  onOpenCitizenModal
}) => {
  const {
    activeRegion,
    regions,
    setActiveRegion,
    simulationRunning,
    simulationStep,
    startSimulation,
    resetSimulation,
    isConnectedToServer,
    reports,
    hospitals,
    layers,
    toggleLayer
  } = useCrisis();

  const totalTrapped = reports
    .filter(r => r.category === 'RESCUE_NEEDED')
    .reduce((sum, r) => sum + (r.headcount || 0), 0);

  const overloadedHospitals = hospitals.filter(h => h.capacity >= 85).length;

  return (
    <header className="bg-[#0b1329]/95 backdrop-blur-md border-b border-cyan-950/80 px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 select-none sticky top-0 z-50">
      {/* Brand & Mission Badge */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400/40">
            <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                <span>CRISIS<span className="text-cyan-400">MAP</span></span>
                <span className="text-xs bg-red-950/80 border border-red-500/50 text-red-300 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider uppercase">
                  Pakistan EOC
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              National Emergency Intelligence & Decision Engine
            </p>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <span className={`w-2 h-2 rounded-full ${isConnectedToServer ? 'bg-emerald-400 animate-ping-slow' : 'bg-amber-400'}`}></span>
          <span className="text-slate-300 font-mono text-[11px]">
            {isConnectedToServer ? 'LIVE MESH SYNC' : 'OFFLINE MODE'}
          </span>
        </div>
      </div>

      {/* Center Tactical Telemetry KPIs */}
      <div className="hidden lg:flex items-center gap-3 bg-slate-900/90 border border-slate-800/90 px-3 py-1.5 rounded-lg text-xs font-mono">
        <div className="flex items-center gap-1.5 text-red-400">
          <Flame className="w-3.5 h-3.5" />
          <span className="text-slate-400">Trapped:</span>
          <span className="font-bold text-red-300">{totalTrapped} Citizens</span>
        </div>
        <div className="h-3.5 w-px bg-slate-700"></div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <Hospital className="w-3.5 h-3.5" />
          <span className="text-slate-400">Overloaded Beds:</span>
          <span className="font-bold text-amber-300">{overloadedHospitals} Facilities</span>
        </div>
        <div className="h-3.5 w-px bg-slate-700"></div>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="text-slate-400">Active SOS:</span>
          <span className="font-bold text-cyan-300">{reports.length} Reports</span>
        </div>
      </div>

      {/* Right Controls & Action CTAs */}
      <div className="flex items-center gap-2 flex-wrap justify-end w-full md:w-auto">
        {/* Region Selector */}
        <select
          value={activeRegion.id}
          onChange={(e) => {
            const found = regions.find(r => r.id === e.target.value);
            if (found) setActiveRegion(found);
          }}
          className="bg-slate-900/90 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
        >
          {regions.map(r => (
            <option key={r.id} value={r.id}>
              📍 {r.name}
            </option>
          ))}
        </select>

        {/* 1-Click Simulation Showstopper for Hackathon Judges */}
        <div className="flex items-center bg-slate-900 border border-cyan-800/60 rounded-lg p-0.5">
          <button
            onClick={startSimulation}
            disabled={simulationRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              simulationRunning
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 animate-pulse cursor-wait'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${simulationRunning ? 'animate-spin' : 'fill-white'}`} />
            <span>{simulationRunning ? `Simulating (Step ${simulationStep}/7)...` : '🌊 Run Flood Simulation'}</span>
          </button>

          <button
            onClick={resetSimulation}
            title="Reset Disaster State"
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-r-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Find Safest Route Modal Trigger */}
        <button
          onClick={onOpenSafeRouteModal}
          className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:text-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span>Find Safest Route</span>
        </button>

        {/* Where to send resources Dispatch Modal Trigger */}
        <button
          onClick={onOpenPriorityModal}
          className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 hover:border-rose-400 text-rose-300 hover:text-rose-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-[0_0_10px_rgba(244,63,94,0.2)]"
        >
          <Send className="w-3.5 h-3.5 text-rose-400" />
          <span>Send Resources</span>
        </button>

        {/* Submit Citizen SOS */}
        <button
          onClick={onOpenCitizenModal}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">SOS Report</span>
        </button>
      </div>
    </header>
  );
};
