import React, { useState } from 'react';
import {
  X,
  Send,
  AlertTriangle,
  Users,
  Hospital,
  Droplets,
  Zap,
  CheckCircle2,
  Anchor,
  Flame,
  Truck,
  ShieldAlert,
  Sparkles,
  Layers
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';
import { PriorityZone } from '../types';

interface PriorityDispatchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PriorityDispatch: React.FC<PriorityDispatchProps> = ({
  isOpen,
  onClose
}) => {
  const {
    priorityZones,
    dispatchedUnits,
    approveDispatch,
    setHighlightedCoords
  } = useCrisis();

  const [activeZoneId, setActiveZoneId] = useState<string>(
    priorityZones[0]?.id || 'zone_rwp_nullah_lai'
  );
  const [dispatchSuccessZone, setDispatchSuccessZone] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedZone = priorityZones.find(z => z.id === activeZoneId) || priorityZones[0];

  const handleDispatch = async (zone: PriorityZone) => {
    await approveDispatch(zone.id, zone.recommendedDispatch);
    setDispatchSuccessZone(zone.id);
    setTimeout(() => {
      setDispatchSuccessZone(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in select-none">
      <div className="bg-[#0e1628] border border-rose-500/40 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(244,63,94,0.25)] overflow-hidden font-['Plus_Jakarta_Sans'] text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-950 border border-rose-500/50 text-rose-400">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Autonomous Resource Allocation & Dispatch Matrix
                </h3>
                <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                  DECISION INTELLIGENCE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                "Where should we send resources?" — Algorithmic priority ranking based on casualty headcount, hospital saturation, and accessibility.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Ranked Zone List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                Ranked Emergency Hotspots
              </h4>
              <span className="text-[11px] text-cyan-400 font-mono font-semibold">
                {priorityZones.length} Zones Computed
              </span>
            </div>

            {priorityZones.map((zone) => {
              const isSelected = zone.id === selectedZone?.id;
              const isRank1 = zone.rank === 1;

              return (
                <div
                  key={zone.id}
                  onClick={() => setActiveZoneId(zone.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] ring-1 ring-rose-500'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg font-mono font-extrabold text-xs flex items-center justify-center ${
                          isRank1
                            ? 'bg-rose-600 text-white shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        #{zone.rank}
                      </span>
                      <span className="font-bold text-xs text-white truncate max-w-[180px]">
                        {zone.zoneName.split('—')[1] || zone.zoneName}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-rose-300">
                      Score: {zone.urgencyScore}
                    </span>
                  </div>

                  {/* Micro stats */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/50 p-2 rounded-lg mt-2">
                    <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{zone.affectedPeopleCount} Trapped</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <Hospital className="w-3.5 h-3.5" />
                      <span>{zone.overloadedHospitalsCount} Overloaded Hosp</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>{zone.waterShortageReported ? 'No Water Reported' : 'Water Available'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Access: <strong>{zone.roadAccessibility}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Intelligence & One-Click Dispatch Panel */}
          {selectedZone && (
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {/* Zone Heading & Status */}
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                      TARGET ZONE ANALYSIS
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        selectedZone.status === 'DISPATCH_CONFIRMED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                          : 'bg-amber-950 text-amber-300 border-amber-500/50'
                      }`}
                    >
                      {selectedZone.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white">
                    {selectedZone.zoneName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedZone.keySummary}
                  </p>
                </div>

                {/* Algorithmic Key Drivers */}
                <div>
                  <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase mb-2">
                    Decision Matrix Drivers:
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Affected Population</span>
                      <span className="font-extrabold text-sm text-red-400">{selectedZone.affectedPeopleCount} Citizens</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Hospital Saturation</span>
                      <span className="font-extrabold text-sm text-amber-400">{selectedZone.overloadedHospitalsCount} Overloaded</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Potable Water Status</span>
                      <span className="font-extrabold text-sm text-cyan-400">
                        {selectedZone.waterShortageReported ? 'CRITICAL (0%)' : 'STABLE'}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Road Accessibility</span>
                      <span className="font-extrabold text-sm text-rose-400">{selectedZone.roadAccessibility}</span>
                    </div>
                  </div>
                </div>

                {/* Recommended Asset Package */}
                <div className="bg-rose-950/20 border border-rose-900/60 p-3.5 rounded-xl">
                  <h5 className="text-xs font-bold text-rose-300 font-mono uppercase mb-2 flex items-center gap-1.5">
                    <Anchor className="w-4 h-4 text-rose-400" />
                    Recommended Autonomous Dispatch Package:
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-900/90 p-2 rounded border border-rose-900/40">
                      <span className="text-[10px] text-slate-400 block">Inflatable Jet-Boats</span>
                      <span className="font-bold text-white text-sm">{selectedZone.recommendedDispatch.boats} Units</span>
                    </div>
                    <div className="bg-slate-900/90 p-2 rounded border border-rose-900/40">
                      <span className="text-[10px] text-slate-400 block">Clean Water Bowsers</span>
                      <span className="font-bold text-cyan-400 text-sm">
                        {selectedZone.recommendedDispatch.waterBowsersLiters.toLocaleString()} Liters
                      </span>
                    </div>
                    <div className="bg-slate-900/90 p-2 rounded border border-rose-900/40">
                      <span className="text-[10px] text-slate-400 block">Field Medical Teams</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {selectedZone.recommendedDispatch.medicalTeams} Squads
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tactical Action Plan */}
                <div>
                  <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase mb-2">
                    Action Directives:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedZone.actionPlan.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800/60">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dispatch Trigger Bar */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setHighlightedCoords(selectedZone.centerCoords);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  Locate Zone on Map
                </button>

                <button
                  onClick={() => handleDispatch(selectedZone)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-extrabold shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {dispatchSuccessZone === selectedZone.id
                      ? '✓ DISPATCH CONFIRMED & EN ROUTE!'
                      : 'Approve & Dispatch Rescue Fleet'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
