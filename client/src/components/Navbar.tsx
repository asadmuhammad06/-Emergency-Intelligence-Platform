import React, { useMemo } from 'react';
import {
  ShieldAlert,
  PlusCircle,
  MapPin,
  Hospital,
  Droplets,
  LayoutDashboard,
  Radio,
  ExternalLink,
  FileText,
  Lock
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';

export type DashboardTab = 'all' | 'map' | 'reports' | 'hospitals' | 'sensors';

interface NavbarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenSafeRouteModal: () => void;
  onOpenPriorityModal: () => void;
  onOpenCitizenModal?: () => void;
  onOpenSitrepModal?: () => void;
  onOpenLayersModal?: () => void;
  onLockEoc?: () => void;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({
  activeTab,
  onSelectTab,
  onOpenSitrepModal,
  onLockEoc
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

  const tabs = useMemo(() => [
    { id: 'all' as DashboardTab,       label: 'Overview',       shortLabel: 'Overview',  icon: LayoutDashboard },
    { id: 'map' as DashboardTab,       label: 'Tactical Map',   shortLabel: 'Map',       icon: MapPin },
    { id: 'reports' as DashboardTab,   label: 'Distress Wire',  shortLabel: 'Wire',      icon: Radio,     badge: reports.length,                                      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
    { id: 'hospitals' as DashboardTab, label: 'Hospitals & ICU', shortLabel: 'Hospitals', icon: Hospital, badge: overloadedCount > 0 ? overloadedCount : undefined,   badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    { id: 'sensors' as DashboardTab,   label: 'Hydrology',      shortLabel: 'Hydrology', icon: Droplets },
  ], [reports.length, overloadedCount]);

  return (
    <>
      <header className="h-14 w-full bg-[#0b0f1c] border-b border-white/[0.06] px-2 sm:px-3 lg:px-5 flex items-center justify-between gap-1 sm:gap-2 select-none sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.6)]">

        {/* ── LEFT: Brand ── */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Logo mark */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-950 via-slate-900 to-slate-950 border border-orange-500/60 flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.4)] shrink-0 transition-transform hover:scale-105">
            <ShieldAlert className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-orange-400" />
          </div>

          {/* Wordmark */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="font-black text-[14px] sm:text-[17px] tracking-tight text-white whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              CRISIS<span className="text-orange-400">MAP</span>
            </span>
            {/* Live status dot */}
            <span className={`w-2 h-2 rounded-full shrink-0 ${isConnectedToServer ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)]' : 'bg-amber-400'}`} />
            <span className="hidden 2xl:inline text-[11px] text-emerald-400 font-mono font-semibold">
              {isConnectedToServer ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        {/* ── CENTER: All 5 Navigation Tabs (Visible on desktop md+, never pushed inside) ── */}
        <nav className="hidden md:flex items-center gap-0.5 sm:gap-1 bg-slate-950/80 border border-white/[0.08] p-0.5 sm:p-1 rounded-xl shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] shrink-0 flex-nowrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { onSelectTab(tab.id); window.location.hash = tab.id; }}
                title={tab.label}
                className={`group relative flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs lg:text-[13px] font-medium transition-all duration-150 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-orange-500/20 text-orange-200 border border-orange-500/40 shadow-[0_0_14px_rgba(234,88,12,0.25)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors ${isActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="font-semibold tracking-tight">
                  <span className="hidden 2xl:inline">{tab.label}</span>
                  <span className="2xl:hidden">{tab.shortLabel}</span>
                </span>

                {tab.badge !== undefined && (
                  <span className={`text-[9px] font-mono font-bold px-1 sm:px-1.5 py-0.2 rounded border leading-none ${tab.badgeColor || 'bg-white/10 text-slate-300 border-white/20'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── RIGHT: Controls (Sleek & compact) ── */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

          {/* Region selector */}
          <div className="relative z-30 flex items-center gap-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-1.5 sm:px-2 py-1 font-mono">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <select
              value={activeRegion.id}
              onChange={(e) => {
                const found = regions.find(r => r.id === e.target.value);
                if (found) setActiveRegion(found);
              }}
              className="bg-transparent text-slate-200 text-xs sm:text-[13px] focus:outline-none cursor-pointer max-w-[85px] sm:max-w-[120px] md:max-w-[150px]"
            >
              {regions.map(r => (
                <option key={r.id} value={r.id} className="bg-slate-900">{r.name}</option>
              ))}
            </select>
            {weather && (
              <span className="text-orange-400 text-xs font-bold pl-1 border-l border-white/10 hidden lg:inline">
                {weather.temperature}°
              </span>
            )}
          </div>

          {/* SITREP Executive Briefing Button */}
          {onOpenSitrepModal && (
            <button
              onClick={onOpenSitrepModal}
              className="flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:border-blue-400 px-1.5 sm:px-2 py-1 rounded-lg text-xs font-bold font-mono transition-all shrink-0 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              title="Generate & Export Official NDMA Situation Report (PDF)"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden sm:inline">SITREP</span>
            </button>
          )}

          {onLockEoc && (
            <button
              onClick={onLockEoc}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-red-950/80 border border-slate-700/80 hover:border-red-500/50 text-slate-300 hover:text-red-300 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all shrink-0"
              title="Lock Terminal & Exit EOC to Gateway"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400" />
              <span>Lock Terminal</span>
            </button>
          )}
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAVIGATION BAR (< md) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b0f1c]/95 backdrop-blur-xl border-t border-white/[0.1] px-1 py-1.5 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.7)] select-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { onSelectTab(tab.id); window.location.hash = tab.id; }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-orange-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-orange-400' : ''}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 text-[8px] font-mono font-black px-1 rounded-full bg-rose-600 text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium">
                {tab.shortLabel}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-orange-400 mt-0.5 shadow-[0_0_6px_rgba(234,88,12,0.9)]" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
});
Navbar.displayName = 'Navbar';
