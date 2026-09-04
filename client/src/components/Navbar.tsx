import React, { useMemo } from 'react';
import {
  ShieldAlert,
  PlusCircle,
  MapPin,
  Hospital,
  Droplets,
  LayoutDashboard,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';

export type DashboardTab = 'all' | 'map' | 'reports' | 'hospitals' | 'sensors';

interface NavbarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenSafeRouteModal: () => void;
  onOpenPriorityModal: () => void;
  onOpenCitizenModal: () => void;
  onOpenLayersModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({
  activeTab,
  onSelectTab,
  onOpenCitizenModal
}) => {
  const {
    activeRegion,
    regions,
    setActiveRegion,
    isConnectedToServer,
    reports,
    hospitals,
    weather
  } = useCrisis();

  const overloadedCount = useMemo(() => hospitals.filter(h => h.capacity >= 85).length, [hospitals]);

  const tabs: { id: DashboardTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = useMemo(() => [
    { id: 'all',       label: 'Overview',       icon: LayoutDashboard },
    { id: 'map',       label: 'Tactical Map',   icon: MapPin },
    { id: 'reports',   label: 'Distress Wire',  icon: Radio,     badge: reports.length,                                      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
    { id: 'hospitals', label: 'Hospitals & ICU', icon: Hospital, badge: overloadedCount > 0 ? `${overloadedCount} Alert` : undefined, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    { id: 'sensors',   label: 'Hydrology',      icon: Droplets },
  ], [reports.length, overloadedCount]);

  const handleOpenInNewTab = (tabId: DashboardTab, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/#${tabId}`, '_blank');
  };

  return (
    // h-14 = 56px, single row, overflow:hidden keeps SOS from ever spilling right
    <header className="h-14 w-full bg-[#0b0f1c] border-b border-white/[0.06] px-4 sm:px-6 flex items-center justify-between gap-4 select-none sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.6)]">

      {/* ── LEFT: Brand ── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Logo mark */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-950 via-slate-900 to-slate-950 border border-orange-500/60 flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.4)] shrink-0 transition-transform hover:scale-105">
          <ShieldAlert className="w-5 h-5 text-orange-400" />
        </div>

        {/* Wordmark */}
        <div className="flex items-center gap-2">
          <span className="font-black text-[17px] sm:text-[18px] tracking-tight text-white whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            CRISIS<span className="text-orange-400">MAP</span>
          </span>
          {/* "PAKISTAN EOC" badge */}
          <span className="hidden sm:inline text-[9px] bg-rose-950/80 border border-rose-700/60 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
            PAKISTAN EOC
          </span>
          {/* Live status dot */}
          <span className={`w-2 h-2 rounded-full shrink-0 ${isConnectedToServer ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)]' : 'bg-amber-400'}`} />
          <span className="hidden sm:inline text-[11px] text-emerald-400 font-mono font-semibold">
            {isConnectedToServer ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* ── CENTER: Navigation Tabs ── */}
      <nav className="flex items-center gap-1 bg-slate-950/70 border border-white/[0.08] p-1 rounded-xl shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { onSelectTab(tab.id); window.location.hash = tab.id; }}
              title={tab.label}
              className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? 'bg-orange-500/20 text-orange-200 border border-orange-500/40 shadow-[0_0_14px_rgba(234,88,12,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span className="font-semibold tracking-tight">{tab.label}</span>

              {tab.badge !== undefined && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border leading-none ${tab.badgeColor || 'bg-white/10 text-slate-300 border-white/20'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── RIGHT: Controls ── */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Region selector + weather */}
        <div className="relative z-30 flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg px-2.5 py-1.5 font-mono">
          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <select
            value={activeRegion.id}
            onChange={(e) => {
              const found = regions.find(r => r.id === e.target.value);
              if (found) setActiveRegion(found);
            }}
            className="bg-transparent text-slate-200 text-[13px] focus:outline-none cursor-pointer max-w-[180px]"
          >
            {regions.map(r => (
              <option key={r.id} value={r.id} className="bg-slate-900">{r.name}</option>
            ))}
          </select>
          {weather && (
            <span className="text-orange-400 text-[13px] font-bold pl-2 border-l border-white/10 hidden sm:inline">
              {weather.temperature}°
            </span>
          )}
        </div>

        {/* SOS button — always fully visible */}
        <button
          onClick={onOpenCitizenModal}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-[13px] font-bold font-mono transition-all shrink-0 shadow-[0_0_14px_rgba(244,63,94,0.3)] hover:shadow-[0_0_20px_rgba(244,63,94,0.5)]"
        >
          <PlusCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">+ SOS</span>
        </button>
      </div>
    </header>
  );
});
Navbar.displayName = 'Navbar';
