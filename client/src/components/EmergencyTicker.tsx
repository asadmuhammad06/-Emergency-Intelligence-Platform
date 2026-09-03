import React, { useState, useEffect } from 'react';
import { useCrisis } from '../context/CrisisContext';
import {
  AlertTriangle,
  Radio,
  Clock,
  Droplets,
  Hospital,
  Users,
  Truck,
  CloudRain
} from 'lucide-react';

interface EmergencyTickerProps {
  onOpenCitizenModal?: () => void;
  onOpenSafeRoute?: () => void;
}

export const EmergencyTicker: React.FC<EmergencyTickerProps> = () => {
  const {
    simulatedMetrics,
    hospitals,
    dispatchedUnits,
    weather,
    activeRegion
  } = useCrisis();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const overloadedCount = hospitals.filter(h => h.capacity >= 85).length;
  const availableIcu = hospitals.reduce((sum, h) => sum + (h.icuAvailable || 0), 0);

  const items = [
    {
      icon: AlertTriangle,
      color: 'text-rose-400 bg-rose-950/80 border-rose-800/80',
      label: 'FLASH FLOOD ACTIVE',
      detail: `Nullah Lai @ Kattarian gauge at ${simulatedMetrics.nullahGaugeFeet} ft (Danger Threshold: 20.0 ft)`
    },
    {
      icon: Users,
      color: 'text-amber-400 bg-amber-950/80 border-amber-800/80',
      label: 'CASUALTY TRIAGE',
      detail: `${simulatedMetrics.trappedCitizens} Civilians Stranded • ${simulatedMetrics.activeSos} Active SOS Beacons`
    },
    {
      icon: Hospital,
      color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80',
      label: 'MEDICAL SURGE',
      detail: `${availableIcu} ICU Beds Available across Twin Cities • ${overloadedCount} Facilities Diverting`
    },
    {
      icon: Truck,
      color: 'text-cyan-400 bg-cyan-950/80 border-cyan-800/80',
      label: 'FIELD MOBILIZATION',
      detail: `${dispatchedUnits.length > 0 ? dispatchedUnits[0].unitName : 'Rescue 1122 Tactical Alpha'} En Route (ETA 8m)`
    },
    {
      icon: CloudRain,
      color: 'text-sky-400 bg-sky-950/80 border-sky-800/80',
      label: `${activeRegion.name.toUpperCase()} METEO`,
      detail: `${weather?.temperature ?? 26}°C • Rain: ${weather?.precipitation ?? 0} mm/h • Risk: ${weather?.floodRiskLevel ?? 'MODERATE'}`
    }
  ];

  return (
    <div className="w-full bg-[#050813] border-b border-white/[0.08] text-slate-200 text-xs flex items-center h-8 relative overflow-hidden select-none z-50">
      {/* Fixed Left Badge: EOC Command Status */}
      <div className="flex items-center gap-2 px-3 sm:px-4 bg-[#080d1e] border-r border-white/[0.08] h-full shrink-0 z-20 shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <span className="font-mono font-black text-[10px] tracking-widest text-rose-400 uppercase hidden sm:inline">
          LIVE EOC WIRE
        </span>
        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 border-l border-white/10 pl-2">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-300 font-bold">{currentTime || '12:00:00'}</span>
          <span className="text-[9px] text-slate-500 font-semibold">PKT</span>
        </div>
      </div>

      {/* Scrolling Marquee Container */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap will-change-transform">
          {/* First loop */}
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m1-${idx}`} className="flex items-center gap-2 font-mono text-[11px]">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider flex items-center gap-1 ${item.color}`}>
                  <Icon className="w-2.5 h-2.5 shrink-0" />
                  {item.label}
                </span>
                <span className="text-slate-300 hover:text-white transition-colors">
                  {item.detail}
                </span>
                <span className="text-slate-700 mx-2">•</span>
              </div>
            );
          })}

          {/* Second identical loop for smooth infinite marquee */}
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m2-${idx}`} className="flex items-center gap-2 font-mono text-[11px]">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider flex items-center gap-1 ${item.color}`}>
                  <Icon className="w-2.5 h-2.5 shrink-0" />
                  {item.label}
                </span>
                <span className="text-slate-300 hover:text-white transition-colors">
                  {item.detail}
                </span>
                <span className="text-slate-700 mx-2">•</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed Right Quick Action */}
      <div className="hidden md:flex items-center gap-2 px-3 bg-[#080d1e] border-l border-white/[0.08] h-full shrink-0 z-20 font-mono text-[11px]">
        <span className="text-slate-400 text-[10px]">DEFCON:</span>
        <span className="text-rose-400 font-bold text-[10px] bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/60">
          LEVEL 2 (MONSOON CRITICAL)
        </span>
      </div>
    </div>
  );
};

