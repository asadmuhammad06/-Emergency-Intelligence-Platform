// Data: live API weather, facilities, overlays, and distress; community reports arrive over SSE.
import { useState, useEffect } from 'react';
import { CrisisProvider, useCrisis } from './context/CrisisContext';
import { Navbar, DashboardTab } from './components/Navbar';
import { LiveFeed } from './components/LiveFeed';
import { MapView } from './components/MapView';
import { SafestRouteModal } from './components/SafestRouteModal';
import { PriorityDispatch } from './components/PriorityDispatch';
import { CitizenReportModal } from './components/CitizenReportModal';
import { EmergencyTicker } from './components/EmergencyTicker';
import { CommanderQwenDrawer } from './components/CommanderQwenDrawer';
import {
  Navigation,
  Send,
  Play,
  RotateCcw,
  PlusCircle,
  Hospital,
  Droplets,
  Truck,
  Activity,
  Radio,
  Users,
  Bot
} from 'lucide-react';

function DashboardContent() {
  const {
    simulationRunning,
    simulationStep,
    startSimulation,
    resetSimulation,
    hospitals,
    reliefHubs,
    dispatchedUnits,
    reports,
    weather,
    radar,
    intelLoading,
    simulatedMetrics
  } = useCrisis();

  const [activeTab, setActiveTab] = useState<DashboardTab>('all');
  const [isSafeRouteOpen, setIsSafeRouteOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isCitizenOpen, setIsCitizenOpen] = useState(false);
  const [isQwenOpen, setIsQwenOpen] = useState(false);
  const [routeOriginCoords, setRouteOriginCoords] = useState<[number, number] | undefined>(undefined);

  // Sync activeTab with URL hash so tabs can be opened in new windows/tabs
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as DashboardTab;
      if (['all', 'map', 'reports', 'hospitals', 'sensors'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenSafeRoute = (coords?: [number, number]) => {
    if (coords) setRouteOriginCoords(coords);
    setIsSafeRouteOpen(true);
  };

  const scrollToMap = () => {
    const mapEl = document.getElementById('tactical-map');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const overloadedHospitals = hospitals.filter(h => h.capacity >= 85).length;
  const availableIcu = hospitals.reduce((sum, h) => sum + h.icuAvailable, 0);
  const totalDrinkingWater = reliefHubs.reduce((sum, h) => sum + (h.drinkingWaterLiters || 0), 0);
  const totalFoodPacks = reliefHubs.reduce((sum, h) => sum + (h.foodPackets || 0), 0);
  const totalBoats = reliefHubs.reduce((sum, h) => sum + (h.rescueBoats || 0), 0);

  return (
    <div className="min-h-screen w-full bg-[#080d1a] text-slate-100 font-['Plus_Jakarta_Sans'] overflow-x-hidden">
      {/* Live Emergency Broadcast Ticker */}
      <EmergencyTicker
        onOpenCitizenModal={() => setIsCitizenOpen(true)}
        onOpenSafeRoute={() => handleOpenSafeRoute()}
      />

      {/* Sleek Single-Line Navbar with Tabs and Popout Options */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenSafeRouteModal={() => handleOpenSafeRoute()}
        onOpenPriorityModal={() => setIsPriorityOpen(true)}
        onOpenCitizenModal={() => setIsCitizenOpen(true)}
      />

      {/* VIEW MODE: Standalone Tactical Map Tab */}
      {activeTab === 'map' && (
        <section className="relative w-full h-[calc(100vh-56px)] bg-slate-950">
          <MapView
            onSelectRouteFromCoords={(coords) => {
              setRouteOriginCoords(coords);
              setIsSafeRouteOpen(true);
            }}
            onDispatchToSector={() => {
              setIsPriorityOpen(true);
            }}
          />
        </section>
      )}

      {/* VIEW MODE: Standalone Distress Wire Tab */}
      {activeTab === 'reports' && (
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span>Real-Time Citizen Distress Stream</span>
            </h2>
            <button
              onClick={() => setIsCitizenOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono transition-colors"
            >
              + Ingest SOS Report
            </button>
          </div>
          <LiveFeed
            onOpenSafeRoute={(coords) => {
              setRouteOriginCoords(coords);
              setIsSafeRouteOpen(true);
            }}
          />
        </main>
      )}

      {/* VIEW MODE: Standalone Hospitals Tab */}
      {activeTab === 'hospitals' && (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-['Plus_Jakarta_Sans']">
                <Hospital className="w-5 h-5 text-emerald-400" />
                <span>Hospital Triage & Bed Saturation Matrix</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Live monitoring across primary trauma centers in Islamabad / Rawalpindi
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              {availableIcu} ICU Beds Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.map(h => (
              <div key={h.id} className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-xl font-mono text-xs">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white font-['Plus_Jakarta_Sans']">{h.name}</h3>
                    <span className="text-[10px] text-slate-400">{h.address || 'Emergency Unit'}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${h.capacity >= 85 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                    {h.capacity >= 85 ? 'OVERLOAD DIVERSION' : 'NORMAL TRIAGE'}
                  </span>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Occupancy:</span>
                    <span className="font-bold text-white">{h.occupiedBeds} / {h.totalBeds} ({h.capacity}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        h.capacity >= 85 ? 'bg-rose-500' : h.capacity >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${h.capacity}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px]">ICU Available</span>
                    <span className="text-emerald-400 font-bold">{h.icuAvailable} Beds</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Power Backup</span>
                    <span className="text-cyan-400 font-bold">100% (Aux Gen)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleOpenSafeRoute(h.coords);
                  }}
                  className="w-full py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Route Ambulances to this Facility</span>
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VIEW MODE: Standalone Hydrology Tab */}
      {activeTab === 'sensors' && (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-['Plus_Jakarta_Sans']">
                <Droplets className="w-5 h-5 text-cyan-400" />
                <span>Hydrological Sensors & Logistics Reserve</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Real-time water level gauges, NDMA relief stocks & deployed units
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* River Gauges */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-xl font-mono text-xs">
              <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2 font-['Plus_Jakarta_Sans']">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>RIVER CATCHMENT SENSORS</span>
              </h3>
              <div className="space-y-3">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-rose-900/40">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200 font-bold">Nullah Lai @ Kattarian Bridge</span>
                    <span className="text-rose-400 font-bold text-sm">22.4 ft</span>
                  </div>
                  <p className="text-[11px] text-rose-300/90 mt-1">
                    Danger Level: 20.0 ft &bull; Discharge: 34,000 cusecs (Critical Surge)
                  </p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-amber-900/40">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200 font-bold">Nullah Lai @ Gawalmandi</span>
                    <span className="text-amber-400 font-bold text-sm">19.2 ft</span>
                  </div>
                  <p className="text-[11px] text-amber-300/90 mt-1">
                    Danger Level: 18.0 ft &bull; Embankment water overtopping road
                  </p>
                </div>
              </div>
            </div>

            {/* Relief Stocks */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-xl font-mono text-xs">
              <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2 font-['Plus_Jakarta_Sans']">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>RELIEF & CLEAN WATER RESERVE</span>
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block mb-1">Potable Water</span>
                  <span className="font-bold text-cyan-300 text-sm">{totalDrinkingWater.toLocaleString()} L</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block mb-1">Ration Packs</span>
                  <span className="font-bold text-emerald-300 text-sm">{totalFoodPacks.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block mb-1">Rescue Boats</span>
                  <span className="font-bold text-amber-300 text-sm">{totalBoats}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Managed by NDMA, Rescue 1122 & Pakistan Red Crescent Society (PRCS).
              </p>
            </div>
          </div>
        </main>
      )}

      {/* VIEW MODE: Default Scrollable "Overview" Tab */}
      {activeTab === 'all' && (
        <>
          {/* Hero: Tactical Geospatial EOC Map Viewport */}
          <section id="tactical-map" className="relative w-full h-[460px] lg:h-[500px] bg-slate-950 border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
            <MapView
              onSelectRouteFromCoords={(coords) => {
                setRouteOriginCoords(coords);
                setIsSafeRouteOpen(true);
              }}
              onDispatchToSector={() => {
                setIsPriorityOpen(true);
              }}
            />
          </section>

          {/* Core Telemetry KPI Strip — Cleanly Separated Below Map */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: Citizens Trapped */}
              <div className="relative overflow-hidden bg-slate-950/85 backdrop-blur-xl border border-rose-500/40 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] tactical-glow-rose hover:border-rose-400 transition-all group">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-500/15 blur-xl group-hover:bg-rose-500/25 transition-all"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-rose-400 uppercase">
                      PRIORITY ZERO
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800/80 px-1.5 py-0.5 rounded">
                    URGENT
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-rose-950/90 border border-rose-600/50 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_16px_rgba(244,63,94,0.35)] group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Trapped Civilians</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-2xl sm:text-3xl text-white font-mono leading-none tracking-tight drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]">
                        {simulatedMetrics.trappedCitizens}
                      </span>
                      <span className="text-[10px] text-rose-400 font-mono font-bold">SO-1122</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: ICU Saturation */}
              <div className="relative overflow-hidden bg-slate-950/85 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] tactical-glow-amber hover:border-amber-400 transition-all group">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/15 blur-xl group-hover:bg-amber-500/25 transition-all"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 uppercase">
                      HOSPITAL SURGE
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80 px-1.5 py-0.5 rounded">
                    TRIAGE ACTIVE
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-950/90 border border-amber-600/50 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_16px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform">
                    <Hospital className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">ICU Saturation</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-2xl sm:text-3xl text-white font-mono leading-none tracking-tight drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                        {simulatedMetrics.icuSaturation}%
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">{availableIcu} Beds Free</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Active SOS Signals */}
              <div className="relative overflow-hidden bg-slate-950/85 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] tactical-glow-cyan hover:border-cyan-400 transition-all group">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-500/15 blur-xl group-hover:bg-cyan-500/25 transition-all"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                      DISTRESS MESH
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 px-1.5 py-0.5 rounded">
                    LIVE INTEL
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-cyan-950/90 border border-cyan-600/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_16px_rgba(6,182,212,0.35)] group-hover:scale-105 transition-transform">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Active SOS Beacons</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-2xl sm:text-3xl text-white font-mono leading-none tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                        {simulatedMetrics.activeSos}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">{reports.length} Total Logs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: River Hydrology Gauge */}
              <div className="relative overflow-hidden bg-slate-950/85 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] tactical-glow-emerald hover:border-emerald-400 transition-all group">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/15 blur-xl group-hover:bg-emerald-500/25 transition-all"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                      HYDROLOGY GAUGE
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                    KATTARIAN SENSOR
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-950/90 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_16px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Nullah Lai Level</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-2xl sm:text-3xl text-white font-mono leading-none tracking-tight drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                        {simulatedMetrics.nullahGaugeFeet}
                      </span>
                      <span className="text-sm font-bold text-emerald-400 font-mono ml-0.5">ft</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5 hidden sm:inline">(Limit 20.0ft)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Scrollable Command Operations Container */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Section 1: Tactical Quick Actions Deck */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h2 className="font-bold text-base tracking-wider uppercase text-white font-mono">
                    RAPID CRISIS ACTION DIRECTIVES
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                  AUTONOMOUS DECISION MATRIX
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Crisis Simulation */}
                <div className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 transition-all shadow-xl flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                        <Play className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        simulationRunning
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-800 animate-pulse'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {simulationRunning ? `STEP ${simulationStep}/7` : 'READY'}
                      </span>
                    </div>
                    <h3 className="font-black text-base text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                      Crisis Simulation
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Execute 7-stage real-time flash flood & road inundation progression.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-900 font-mono text-xs">
                    <button
                      onClick={() => {
                        startSimulation();
                        scrollToMap();
                      }}
                      disabled={simulationRunning}
                      className="flex-1 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{simulationRunning ? 'Running...' : 'Run Scenario'}</span>
                    </button>
                    <button
                      onClick={resetSimulation}
                      title="Reset Disaster Matrix"
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card 2: Safest Evacuation Pathfinder */}
                <div className="bg-slate-950/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 transition-all shadow-xl flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                        <Navigation className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border bg-emerald-950 text-emerald-300 border-emerald-800">
                        94% RISK CUT
                      </span>
                    </div>
                    <h3 className="font-black text-base text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
                      Safe Evacuation Route
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Bypass submerged Faizabad corridor via elevated 9th Ave flyover to PIMS.
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-900 font-mono text-xs">
                    <button
                      onClick={() => handleOpenSafeRoute()}
                      className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Calculate Safe Route</span>
                    </button>
                  </div>
                </div>

                {/* Card 3: AI Priority Dispatch Matrix */}
                <div className="bg-slate-950/90 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-4 transition-all shadow-xl flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.25)]">
                        <Send className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border bg-rose-950 text-rose-300 border-rose-800">
                        4 CLUSTERS
                      </span>
                    </div>
                    <h3 className="font-black text-base text-white mb-1.5 group-hover:text-rose-300 transition-colors">
                      Resource Dispatch Matrix
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Autonomous asset optimizer for jet-boats, water bowsers & medical squads.
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-900 font-mono text-xs">
                    <button
                      onClick={() => setIsPriorityOpen(true)}
                      className="w-full py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Open Dispatch Matrix</span>
                    </button>
                  </div>
                </div>

                {/* Card 4: Citizen SOS Intake */}
                <div className="bg-slate-950/90 border border-slate-800 hover:border-slate-600 rounded-2xl p-4 transition-all shadow-xl flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-rose-400 shadow-md">
                        <PlusCircle className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border bg-slate-900 text-slate-300 border-slate-700">
                        HOTLINE
                      </span>
                    </div>
                    <h3 className="font-black text-base text-white mb-1.5 group-hover:text-white transition-colors">
                      Citizen SOS Hotline
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      NLP multi-lingual intake parsing Urdu, Roman Urdu & English distress calls.
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-900 font-mono text-xs">
                    <button
                      onClick={() => setIsCitizenOpen(true)}
                      className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-bold flex items-center justify-center gap-1.5 transition-all hover:text-white"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>+ Ingest Distress SOS</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Split Tactical Operations & Infrastructure Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
              {/* Left Column: Live Ground Intel Feed (7 cols) */}
              <div className="min-w-0">
                <LiveFeed
                  onOpenSafeRoute={(coords) => {
                    setRouteOriginCoords(coords);
                    setIsSafeRouteOpen(true);
                  }}
                />
              </div>

              {/* Right Column: Critical Infrastructure & Sensors (5 cols) */}
              <div className="min-w-0 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-6 pr-1">
                {/* 1. Hospital Bed Surge & ICU Saturation Card */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl font-mono text-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Hospital className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-black text-base text-white font-['Plus_Jakarta_Sans']">
                        HOSPITAL BED CAPACITY & SURGE
                      </h3>
                    </div>
                    <span className="text-xs text-cyan-300 font-bold bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-md">
                      {simulatedMetrics.icuSaturation}% <span className="text-[9px]">SIMULATED</span>
                    </span>
                  </div>

                  <div className="space-y-4">
                    {intelLoading && hospitals.length === 0 && (
                      <div className="space-y-2 animate-pulse">
                        <div className="h-4 rounded bg-slate-800" />
                        <div className="h-3 rounded bg-slate-900" />
                      </div>
                    )}
                    {hospitals.map(h => (
                      <div key={h.id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-slate-200 font-bold truncate pr-2">{h.name}</span>
                          <span className={`font-bold font-mono ${h.capacity >= 85 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {h.capacity}% ({h.occupiedBeds}/{h.totalBeds})
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              h.capacity >= 85 ? 'bg-rose-500' : h.capacity >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${h.capacity}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Live meteorological and radar telemetry */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl font-mono text-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Droplets className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-black text-base text-white font-['Plus_Jakarta_Sans']">
                        HYDRO-METEO RADAR
                      </h3>
                    </div>
                    <span className="text-xs text-cyan-300 font-bold bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-md">
                      {radar ? 'LIVE FRAME' : 'CONNECTING'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block mb-1">Precipitation</span>
                      <span className="text-cyan-300 font-black text-lg">{weather?.precipitation ?? '--'} mm/h</span>
                    </div>
                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block mb-1">Flood risk</span>
                      <span className="text-amber-300 font-black text-lg">{weather?.floodRiskLevel ?? '--'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Relief & Potable Water Supply Depots */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl font-mono text-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Droplets className="w-5 h-5 text-sky-400" />
                      <h3 className="font-black text-base text-white font-['Plus_Jakarta_Sans']">
                        RELIEF & WATER DEPOT STOCKS
                      </h3>
                    </div>
                    <span className="text-xs text-sky-400 font-bold bg-sky-950/80 border border-sky-800/60 px-2.5 py-1 rounded-md">
                      {reliefHubs.length} DEPOTS <span className="text-[9px]">SIMULATED</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center mb-3">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">Water Reserves</span>
                      <span className="font-black text-cyan-300 text-sm sm:text-base">{totalDrinkingWater.toLocaleString()} L</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">Food Packs</span>
                      <span className="font-black text-emerald-300 text-sm sm:text-base">{totalFoodPacks.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">Jet Boats</span>
                      <span className="font-black text-amber-300 text-sm sm:text-base">{totalBoats} Units</span>
                    </div>
                  </div>
                </div>

                {/* 4. Active Dispatched Fleet Status */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl font-mono text-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-5 h-5 text-rose-400" />
                      <h3 className="font-black text-base text-white font-['Plus_Jakarta_Sans']">
                        ACTIVE DEPLOYED UNITS
                      </h3>
                    </div>
                    <span className="text-xs text-rose-300 font-bold bg-rose-950/80 border border-rose-800/60 px-2.5 py-1 rounded-md">
                      {dispatchedUnits.length} EN ROUTE
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {dispatchedUnits.length === 0 ? (
                      <p className="text-slate-500 text-center py-4 text-xs sm:text-sm">No active dispatch missions currently deployed.</p>
                    ) : (
                      dispatchedUnits.map(unit => (
                        <div key={unit.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-white text-xs sm:text-sm block">{unit.unitName}</span>
                            <span className="text-xs text-slate-400">{unit.type}</span>
                          </div>
                          <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-md font-bold font-mono">
                            ETA: {unit.etaMin}m
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </>
      )}

      {/* Modals */}
      <SafestRouteModal
        isOpen={isSafeRouteOpen}
        onClose={() => setIsSafeRouteOpen(false)}
        initialCoords={routeOriginCoords}
      />

      <PriorityDispatch
        isOpen={isPriorityOpen}
        onClose={() => setIsPriorityOpen(false)}
      />

      <CitizenReportModal
        isOpen={isCitizenOpen}
        onClose={() => setIsCitizenOpen(false)}
      />

      {/* Floating Commander Qwen AI Copilot Trigger */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsQwenOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-500 hover:to-amber-500 text-white font-mono text-xs font-black tracking-wide shadow-[0_0_25px_rgba(234,88,12,0.6)] border border-orange-400/50 transition-all hover:scale-105 active:scale-95 group"
          title="Open Commander Qwen EOC AI Copilot"
        >
          <div className="w-5 h-5 rounded-lg bg-black/40 flex items-center justify-center border border-white/20">
            <Bot className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          </div>
          <span className="hidden sm:inline">COMMANDER QWEN (AI COPILOT)</span>
          <span className="sm:hidden">QWEN AI</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      {/* Commander Qwen EOC AI Drawer */}
      <CommanderQwenDrawer
        isOpen={isQwenOpen}
        onClose={() => setIsQwenOpen(false)}
        onOpenSafeRouteModal={() => setIsSafeRouteOpen(true)}
        onOpenPriorityModal={() => setIsPriorityOpen(true)}
        onOpenCitizenModal={() => setIsCitizenOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CrisisProvider>
      <DashboardContent />
    </CrisisProvider>
  );
}
