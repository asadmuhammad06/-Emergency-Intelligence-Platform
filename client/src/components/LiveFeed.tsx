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
    calculateSafeRoute
  } = useCrisis();

  const categories: { label: string; value: ReportCategory | 'ALL'; icon: string }[] = [
    { label: 'All', value: 'ALL', icon: '📡' },
    { label: 'Rescue', value: 'RESCUE_NEEDED', icon: '🆘' },
    { label: 'Roads', value: 'ROAD_BLOCKED', icon: '🚧' },
    { label: 'Hospitals', value: 'HOSPITAL_CAPACITY', icon: '🏥' },
    { label: 'Water', value: 'WATER_SHORTAGE', icon: '💧' },
    { label: 'Power', value: 'POWER_OUTAGE', icon: '⚡' },
  ];

  const filteredReports = activeCategoryFilter === 'ALL'
    ? reports
    : reports.filter(r => r.category === activeCategoryFilter);

  const getCategoryBadge = (cat: ReportCategory) => {
    switch (cat) {
      case 'RESCUE_NEEDED':
        return <span className="bg-red-950/80 text-red-300 border border-red-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">🆘 RESCUE</span>;
      case 'ROAD_BLOCKED':
        return <span className="bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">🚧 ROAD BLOCKED</span>;
      case 'HOSPITAL_CAPACITY':
        return <span className="bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">🏥 MEDICAL OVERLOAD</span>;
      case 'WATER_SHORTAGE':
        return <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">💧 WATER SHORTAGE</span>;
      case 'POWER_OUTAGE':
        return <span className="bg-yellow-950/80 text-yellow-300 border border-yellow-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">⚡ POWER OUTAGE</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded">⚠️ ALERT</span>;
    }
  };

  return (
    <div className="w-full md:w-96 bg-[#0c1222]/95 border-r border-slate-800 flex flex-col h-full overflow-hidden text-slate-200 select-none">
      {/* Feed Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h2 className="font-bold text-sm text-white tracking-wide font-['Plus_Jakarta_Sans']">
              LIVE CRISIS INTEL STREAM
            </h2>
          </div>
          <span className="text-[11px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
            {reports.length} INCOMING
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategoryFilter(cat.value)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                activeCategoryFilter === cat.value
                  ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No incidents reported under this category.
          </div>
        ) : (
          filteredReports.map((report) => {
            const isHighSeverity = report.severity >= 8;

            return (
              <div
                key={report.id}
                className={`p-3 rounded-xl border transition-all duration-200 bg-slate-900/80 hover:bg-slate-850 ${
                  isHighSeverity
                    ? 'border-red-900/50 hover:border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.1)]'
                    : 'border-slate-800 hover:border-cyan-700/60'
                }`}
              >
                {/* Top Meta Line */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getCategoryBadge(report.category)}
                    {report.languageDetected && (
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                        🌐 {report.languageDetected}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <span className={`font-bold ${isHighSeverity ? 'text-red-400' : 'text-amber-400'}`}>
                      Sev {report.severity}/10
                    </span>
                  </div>
                </div>

                {/* Raw Text Extract */}
                <p className="text-xs text-slate-200 font-medium leading-relaxed mb-2 line-clamp-3">
                  "{report.rawText}"
                </p>

                {/* AI Extracted Entity Pills */}
                <div className="space-y-1 text-[11px] mb-2.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate font-medium text-slate-300">{report.locationName}</span>
                  </div>

                  {report.headcount > 0 && (
                    <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                      <Users className="w-3 h-3 text-red-400 shrink-0" />
                      <span>{report.headcount} People Trapped / In Need</span>
                    </div>
                  )}

                  {report.needs && report.needs.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-slate-800/60">
                      <span className="text-[10px] text-slate-400">Needs:</span>
                      {report.needs.map((need, idx) => (
                        <span
                          key={idx}
                          className="bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 text-[10px] px-1.5 py-0.2 rounded"
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => setHighlightedCoords(report.coords)}
                    className="flex-1 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>Locate</span>
                  </button>

                  <button
                    onClick={() => {
                      calculateSafeRoute(report.coords);
                      onOpenSafeRoute(report.coords);
                    }}
                    className="flex-1 py-1 px-2 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3 h-3 text-emerald-400" />
                    <span>Safe Route</span>
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
