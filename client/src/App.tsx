import { useState } from 'react';
import { CrisisProvider } from './context/CrisisContext';
import { Navbar } from './components/Navbar';
import { LiveFeed } from './components/LiveFeed';
import { MapView } from './components/MapView';
import { SafestRouteModal } from './components/SafestRouteModal';
import { PriorityDispatch } from './components/PriorityDispatch';
import { CitizenReportModal } from './components/CitizenReportModal';
import { AnalyticsDrawer } from './components/AnalyticsDrawer';
import {
  Navigation,
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function DashboardContent() {
  const [isSafeRouteOpen, setIsSafeRouteOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isCitizenOpen, setIsCitizenOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [routeOriginCoords, setRouteOriginCoords] = useState<[number, number] | undefined>(undefined);

  const handleOpenSafeRoute = (coords?: [number, number]) => {
    if (coords) setRouteOriginCoords(coords);
    setIsSafeRouteOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#080d1a] overflow-hidden text-slate-100 font-['Plus_Jakarta_Sans']">
      {/* Top Operations Navbar */}
      <Navbar
        onOpenSafeRouteModal={() => handleOpenSafeRoute()}
        onOpenPriorityModal={() => setIsPriorityOpen(true)}
        onOpenCitizenModal={() => setIsCitizenOpen(true)}
      />

      {/* Main Tactical Split Layout */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Live Intel Feed (Collapsible) */}
        <div
          className={`transition-all duration-300 ease-in-out relative z-20 ${
            isSidebarOpen ? 'w-full md:w-96' : 'w-0 overflow-hidden'
          }`}
        >
          <LiveFeed
            onOpenSafeRoute={(coords) => {
              setRouteOriginCoords(coords);
              setIsSafeRouteOpen(true);
            }}
          />
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-4 z-[400] bg-slate-900/90 border border-slate-700 text-slate-300 p-2 rounded-xl shadow-lg hover:bg-slate-800 hover:text-white transition-all hidden md:flex items-center justify-center"
          title={isSidebarOpen ? "Collapse Live Feed" : "Open Live Feed"}
          style={{ left: isSidebarOpen ? '390px' : '16px' }}
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Center / Right Tactical Map Area */}
        <div className="flex-1 h-full relative">
          <MapView
            onSelectRouteFromCoords={(coords) => {
              setRouteOriginCoords(coords);
              setIsSafeRouteOpen(true);
            }}
            onDispatchToSector={() => {
              setIsPriorityOpen(true);
            }}
          />

          {/* Quick Tactical Floating Actions for Judge Demo */}
          <div className="absolute bottom-6 left-6 z-[400] flex flex-wrap gap-2">
            <button
              onClick={() => handleOpenSafeRoute()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-2 border border-emerald-400/40 transition-transform active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Find Safest Route</span>
            </button>

            <button
              onClick={() => setIsPriorityOpen(true)}
              className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.5)] flex items-center gap-2 border border-rose-400/40 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Send Resources (AI Matrix)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry HUD */}
      <AnalyticsDrawer />

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
