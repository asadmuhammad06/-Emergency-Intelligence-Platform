// Data: live external API incidents and community-reported records; no local incident fixtures.
import React from 'react';
import {
  AlertTriangle,
  Radio,
  MapPin,
  Users,
  Navigation,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';
import { EmergencyReport, ReportCategory } from '../types';

interface LiveFeedProps {
  onOpenSafeRoute: (coords: [number, number]) => void;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ onOpenSafeRoute }) => {
  const {
    reports,
    activeCategoryFilter,
    setActiveCategoryFilter,
    setHighlightedCoords,
    calculateSafeRoute,
    intelLoading
  } = useCrisis();

  const categories: { label: string; value: ReportCategory | 'ALL' }[] = [
    { label: 'All Reports', value: 'ALL' },
    { label: 'Rescue Needed', value: 'RESCUE_NEEDED' },
    { label: 'Road Blocks', value: 'ROAD_BLOCKED' },
    { label: 'Hospitals', value: 'HOSPITAL_CAPACITY' },
    { label: 'Water Shortage', value: 'WATER_SHORTAGE' },
    { label: 'Power Grid', value: 'POWER_OUTAGE' },
  ];

  const filteredReports = activeCategoryFilter === 'ALL'
    ? reports
    : reports.filter(r => r.category === activeCategoryFilter);

  const getCategoryBadge = (cat: ReportCategory) => {
    switch (cat) {
      case 'RESCUE_NEEDED':
        return <span className="bg-rose-950/80 text-rose-300 border border-rose-500/50 text-[10px] font-mono font-bold px-2 py-0.5 rounded">RESCUE NEEDED</span>;
      case 'ROAD_BLOCKED':
        return <span className="bg-amber-950/80 text-amber-300 border border-amber-500/50 text-[10px] font-mono font-bold px-2 py-0.5 rounded">ROAD BLOCKED</span>;
      case 'HOSPITAL_CAPACITY':
        return <span className="bg-purple-950/80 text-purple-300 border border-purple-500/50 text-[10px] font-mono font-bold px-2 py-0.5 rounded">MEDICAL OVERLOAD</span>;
      case 'WATER_SHORTAGE':
        return <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 text-[10px] font-mono font-bold px-2 py-0.5 rounded">WATER SHORTAGE</span>;
      case 'POWER_OUTAGE':
        return <span className="bg-yellow-950/80 text-yellow-300 border border-yellow-500/50 text-[10px] font-mono font-bold px-2 py-0.5 rounded">POWER OUTAGE</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded">INCIDENT</span>;
    }
  };

  const handleLocateOnMap = (coords: [number, number]) => {
    setHighlightedCoords(coords);
    const mapEl = document.getElementById('tactical-map');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCalculateRoute = (coords: [number, number]) => {
    calculateSafeRoute(coords);
    onOpenSafeRoute(coords);
    const mapEl = document.getElementById('tactical-map');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl flex flex-col h-[650px] overflow-hidden text-slate-200 select-none shadow-2xl">
      {/* Feed Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="font-extrabold text-base text-white tracking-wide font-['Plus_Jakarta_Sans']">
              GROUND INTELLIGENCE & DISTRESS WIRE
            </h3>
          </div>
          <span className="text-xs font-mono bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 px-3 py-1 rounded-full font-bold">
            {reports.length} ACTIVE INCIDENTS
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategoryFilter(cat.value)}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeCategoryFilter === cat.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {intelLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(item => (
              <div key={item} className="h-32 rounded-2xl border border-slate-800 bg-slate-900/70" />
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-sm">
            Live external feed has no reports matching this filter.
          </div>
        ) : (
          filteredReports.map((report) => {
            const isHighSeverity = report.severity >= 8;

            return (
              <div
                key={report.id}
                className={`p-4 rounded-2xl border transition-all duration-200 bg-slate-900/70 hover:bg-slate-900 ${
                  isHighSeverity
                    ? 'border-rose-900/50 hover:border-rose-500/60 shadow-[0_0_16px_rgba(244,63,94,0.1)]'
                    : 'border-slate-800/80 hover:border-cyan-700/60'
                }`}
              >
                {/* Top Meta Line */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="min-w-0 flex items-center gap-2 flex-wrap">
                    {getCategoryBadge(report.category)}
<<<<<<< Updated upstream
                   <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded">
                     source: {report.source === 'community-reported' ? 'community-reported' : 'live'}
                   </span>
=======
                    {report.source === 'SIMULATED' && (
                      <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                        SIMULATED
                      </span>
                    )}
>>>>>>> Stashed changes
                    {report.languageDetected && (
                      <span className="text-xs font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        {report.languageDetected}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 font-mono text-xs">
                    <span className={`font-bold px-2 py-0.5 rounded-md ${isHighSeverity ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                      SEV {report.severity}/10
                    </span>
                  </div>
                </div>

                {/* Raw Text Extract */}
<<<<<<< Updated upstream
                <p className="line-clamp-3 text-sm text-slate-100 font-medium leading-relaxed mb-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  {report.title || report.rawText || 'Live incident update'}
=======
                <p className="text-sm text-slate-100 font-medium leading-relaxed mb-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 line-clamp-3 overflow-hidden">
                  "{report.rawText}"
>>>>>>> Stashed changes
                </p>

                {/* AI Extracted Entity Pills */}
                <div className="space-y-2 text-xs sm:text-sm mb-3.5 font-mono">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate font-semibold">{report.location || report.locationName}</span>
                  </div>
                  {report.description && report.description !== report.title && (
                    <p className="line-clamp-2 text-slate-400 text-xs pl-6">{report.description}</p>
                  )}

                  {report.headcount > 0 && (
                    <div className="flex items-center gap-2 text-rose-400 font-bold">
                      <Users className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{report.headcount} Trapped Citizens In Need</span>
                    </div>
                  )}

                  {report.needs && report.needs.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/60">
                      <span className="text-xs text-slate-400">Needs:</span>
                      {report.needs.map((need, idx) => (
                        <span
                          key={idx}
                          className="bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 text-xs px-2.5 py-0.5 rounded-md font-medium"
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-slate-800/60 font-mono">
                  <button
                    onClick={() => handleLocateOnMap(report.coords)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Focus Map</span>
                  </button>

                  <button
                    onClick={() => handleCalculateRoute(report.coords)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Safe Detour</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
