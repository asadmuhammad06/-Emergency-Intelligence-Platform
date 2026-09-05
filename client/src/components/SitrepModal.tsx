import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  X,
  ShieldAlert,
  AlertTriangle,
  Hospital,
  Droplets,
  Truck,
  Users,
  Compass,
  Building2,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';

interface SitrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SitrepModal: React.FC<SitrepModalProps> = ({ isOpen, onClose }) => {
  const {
    activeRegion,
    reports,
    hospitals,
    roadBlocks,
    reliefHubs,
    weather,
    simulatedMetrics
  } = useCrisis();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Derived metrics for the SITREP
  const totalTrapped = reports
    .filter(r => r.category === 'RESCUE_NEEDED')
    .reduce((sum, r) => sum + (r.headcount || 1), 0) || simulatedMetrics.trappedCitizens;

  const totalCasualties = reports
    .filter(r => r.category === 'HOSPITAL_CAPACITY' || (r.category === 'RESCUE_NEEDED' && r.severity >= 8))
    .reduce((sum, r) => sum + (r.headcount || 1), 0);

  const availableIcu = hospitals.reduce((sum, h) => sum + (h.icuAvailable || 0), 0);
  const totalBeds = hospitals.reduce((sum, h) => sum + (h.totalBeds || 0), 0);
  const occupiedBeds = hospitals.reduce((sum, h) => sum + (h.occupiedBeds || 0), 0);
  const avgHospitalOccupancy = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : simulatedMetrics.icuSaturation;
  const divertingHospitals = hospitals.filter(h => h.capacity >= 85);

  const totalWaterLiters = reliefHubs.reduce((sum, h) => sum + (h.drinkingWaterLiters || 0), 0);
  const totalFoodPacks = reliefHubs.reduce((sum, h) => sum + (h.foodPackets || 0), 0);
  const totalBoats = reliefHubs.reduce((sum, h) => sum + (h.rescueBoats || 0), 0);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' PKT';
  const sitrepId = `NDMA-SITREP-${activeRegion.id.toUpperCase()}-${now.toISOString().slice(0, 10).replace(/-/g, '')}-01`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
================================================================================
GOVERNMENT OF PAKISTAN - NATIONAL DISASTER MANAGEMENT AUTHORITY (NDMA)
NATIONAL EMERGENCY OPERATIONS CENTER (NEOC) - ISLAMABAD
EXECUTIVE SITUATION REPORT (SITREP) - ${sitrepId}
DATE: ${dateStr} | TIME: ${timeStr}
JURISDICTION: ${activeRegion.name.toUpperCase()}
CLASSIFICATION: OPERATIONAL / IMMEDIATE
================================================================================

1. HYDROLOGICAL & METEOROLOGICAL TELEMETRY
- Drainage Basin: ${activeRegion.riverBasin || 'Nullah Lai'} @ ${activeRegion.sensorName || 'Primary Gauge'}
- Current Flood Level: ${simulatedMetrics.nullahGaugeFeet} ft (Danger Threshold: ${(activeRegion.dangerLimitFeet || 20).toFixed(1)} ft)
- Ambient Temperature: ${weather?.temperature ?? 26}°C
- Real-Time Precipitation: ${weather?.precipitation ?? 0} mm/h (Risk: ${weather?.floodRiskLevel ?? 'MODERATE'})
- Wind Velocity: ${weather?.windSpeed ?? 18} km/h (Gusts: ${weather?.windGusts ?? 24} km/h)

2. POPULATION TRIAGE & CASUALTY METRICS
- Active SOS Distress Calls: ${reports.length}
- Civilians Trapped / Awaiting Boat Evacuation: ${totalTrapped} individuals
- Acute Medical Triage Requests: ${totalCasualties} cases
- Rescue 1122 Tactical Field Response: Dispatched & Operating

3. HEALTHCARE SYSTEM SATURATION
- Total Monitored Facilities: ${hospitals.length}
- Bed Saturation Level: ${avgHospitalOccupancy}%
- Critical Care (ICU) Beds Available: ${availableIcu}
- Facilities Diverting / Near Surge: ${divertingHospitals.length > 0 ? divertingHospitals.map(h => h.name).join(', ') : 'None - all facilities admitting'}

4. CRITICAL ARTERIALS & ROADBLOCKS
${roadBlocks.length > 0 ? roadBlocks.map(rb => `- [${rb.severity.toUpperCase()}] ${rb.name}: ${rb.status} (Alternate corridor required)`).join('\n') : '- No major arterial cuts recorded.'}

5. LOGISTICS & RELIEF RESERVES
- Clean Drinking Water: ${totalWaterLiters.toLocaleString()} Liters
- Ration / Food Packs: ${totalFoodPacks.toLocaleString()} Kits
- Tactical Rescue Inflatable Boats: ${totalBoats} Units

6. AI COMMAND DIRECTIVES & IMMEDIATE ORDERS
- PRIORITY 1: Concentrate high-clearance 1122 rescue boats to clusters with stranded citizens.
- PRIORITY 2: Re-route incoming trauma ambulances away from saturated hospitals to regional relief hubs.
- PRIORITY 3: Coordinate with NHA & Traffic Police to establish secondary evacuation lanes around submerged bottlenecks.

================================================================================
AUTHORIZED BY: NEOC DUTY INCIDENT COMMANDER | VERIFICATION: VALIDATED BY CRISIS-MAP AI
================================================================================
`.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-200">

        {/* Top Control Bar (Hidden when printing) */}
        <div className="print:hidden bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <span>NDMA SITREP BRIEFING EXPORT</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded uppercase font-bold">
                  VALIDATED
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Standard National Emergency Briefing Format (UN OCHA / NDMA Standard)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors border border-slate-700"
              title="Copy Briefing Text to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all shadow-md hover:shadow-lg"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Formal Document Container (Target for Print) */}
        <div id="sitrep-document" className="p-6 sm:p-8 space-y-6 bg-[#080d19] text-slate-100 font-sans print:p-0 print:bg-white print:text-black">

          {/* Official Document Header */}
          <div className="border-b-2 border-emerald-600 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shrink-0 print:border-black print:text-black">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase block print:text-black">
                  GOVERNMENT OF PAKISTAN • PRIME MINISTER'S OFFICE
                </span>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight print:text-black">
                  NATIONAL DISASTER MANAGEMENT AUTHORITY (NDMA)
                </h1>
                <p className="text-xs text-slate-400 font-mono print:text-black">
                  National Emergency Operations Center (NEOC) • Daily Situation Report
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs space-y-0.5 shrink-0 bg-slate-900/60 print:bg-transparent p-2.5 rounded-lg border border-white/10 print:border-black">
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-slate-400 text-[10px] uppercase">Classification:</span>
                <span className="text-rose-400 font-bold tracking-wider uppercase text-[11px] print:text-red-700">
                  OPERATIONAL / IMMEDIATE
                </span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-slate-400 text-[10px] uppercase">SITREP No:</span>
                <span className="text-white font-bold text-[11px] print:text-black">{sitrepId}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-slate-400 text-[10px] uppercase">Issued:</span>
                <span className="text-slate-300 text-[11px] print:text-black">{dateStr} {timeStr}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary & Active Jurisdiction */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-slate-900/70 print:bg-slate-100 p-3 rounded-xl border border-white/10 print:border-black">
              <span className="text-slate-400 text-[10px] uppercase block">Jurisdiction</span>
              <span className="text-white font-black text-sm print:text-black">{activeRegion.name}</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5 print:text-black">EOC Sector Alpha</span>
            </div>

            <div className="bg-slate-900/70 print:bg-slate-100 p-3 rounded-xl border border-white/10 print:border-black">
              <span className="text-slate-400 text-[10px] uppercase block">Active Flood Basin</span>
              <span className="text-white font-bold text-xs print:text-black truncate block">{activeRegion.riverBasin || 'Nullah Lai'}</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5 print:text-black">{activeRegion.sensorName || 'Primary Station'}</span>
            </div>

            <div className="bg-slate-900/70 print:bg-slate-100 p-3 rounded-xl border border-white/10 print:border-black">
              <span className="text-slate-400 text-[10px] uppercase block">Gauge Telemetry</span>
              <span className="text-rose-400 font-bold text-sm print:text-red-700">{simulatedMetrics.nullahGaugeFeet} ft</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 print:text-black">Limit: {(activeRegion.dangerLimitFeet || 20).toFixed(1)} ft</span>
            </div>

            <div className="bg-slate-900/70 print:bg-slate-100 p-3 rounded-xl border border-white/10 print:border-black">
              <span className="text-slate-400 text-[10px] uppercase block">Atmospheric Weather</span>
              <span className="text-amber-300 font-bold text-xs print:text-black">{weather?.temperature ?? 26}°C • {weather?.precipitation ?? 0} mm/h</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 print:text-black">Risk: {weather?.floodRiskLevel ?? 'MODERATE'}</span>
            </div>
          </div>

          {/* Section 2: Population Triage & Human Impact */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 print:text-black">
              <Users className="w-3.5 h-3.5" />
              <span>1.0 Human Impact & Search and Rescue Triage</span>
            </h2>

            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-rose-950/40 print:bg-slate-50 border border-rose-500/30 print:border-black p-3 rounded-xl">
                <span className="text-rose-300 text-[10px] uppercase block print:text-black">Trapped Civilians</span>
                <span className="text-2xl font-black text-white print:text-black">{totalTrapped}</span>
                <p className="text-[10px] text-slate-400 mt-1 print:text-black">Confirmed awaiting boat rescue</p>
              </div>

              <div className="bg-amber-950/40 print:bg-slate-50 border border-amber-500/30 print:border-black p-3 rounded-xl">
                <span className="text-amber-300 text-[10px] uppercase block print:text-black">Active Distress Signals</span>
                <span className="text-2xl font-black text-white print:text-black">{reports.length}</span>
                <p className="text-[10px] text-slate-400 mt-1 print:text-black">Ingested via 1122 & Mobile App</p>
              </div>

              <div className="bg-blue-950/40 print:bg-slate-50 border border-blue-500/30 print:border-black p-3 rounded-xl">
                <span className="text-blue-300 text-[10px] uppercase block print:text-black">Medical Evacuations</span>
                <span className="text-2xl font-black text-white print:text-black">{totalCasualties}</span>
                <p className="text-[10px] text-slate-400 mt-1 print:text-black">Urgent triage required</p>
              </div>
            </div>
          </div>

          {/* Section 3: Healthcare Infrastructure Saturation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 print:text-black">
                <Hospital className="w-3.5 h-3.5" />
                <span>2.0 Regional Healthcare Infrastructure & ICU Saturation</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400 print:text-black">
                {availableIcu} ICU Beds Available across monitored trauma centers
              </span>
            </div>

            <div className="bg-slate-900/50 print:bg-white border border-white/10 print:border-black rounded-xl overflow-hidden font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 print:bg-slate-200 border-b border-white/10 print:border-black text-[10px] text-slate-400 print:text-black uppercase">
                    <th className="p-2.5">Facility Name</th>
                    <th className="p-2.5 text-center">Bed Saturation</th>
                    <th className="p-2.5 text-center">Available ICU</th>
                    <th className="p-2.5 text-right">Diversion Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-slate-300">
                  {hospitals.map(h => (
                    <tr key={h.id} className="hover:bg-white/[0.02]">
                      <td className="p-2.5 font-semibold text-white print:text-black">{h.name}</td>
                      <td className="p-2.5 text-center">
                        <span className={`font-bold ${h.capacity >= 85 ? 'text-rose-400 print:text-red-700' : h.capacity >= 70 ? 'text-amber-400 print:text-black' : 'text-emerald-400 print:text-black'}`}>
                          {h.capacity}% ({h.occupiedBeds}/{h.totalBeds})
                        </span>
                      </td>
                      <td className="p-2.5 text-center text-cyan-300 print:text-black font-bold">
                        {h.icuAvailable} Beds
                      </td>
                      <td className="p-2.5 text-right">
                        {h.capacity >= 85 ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800 print:text-red-700">
                            DIVERT AMBULANCES
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 print:text-black">
                            ADMITTING NORMAL
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Critical Arterials & Road Inundations */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 print:text-black">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>3.0 Inundated Arterials & Critical Roadblocks</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
              {roadBlocks.map(rb => (
                <div key={rb.id} className="bg-slate-900/60 print:bg-slate-50 p-2.5 rounded-lg border border-white/10 print:border-black flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white print:text-black block text-[11px]">{rb.name}</span>
                    <span className="text-[10px] text-slate-400 print:text-black">GPS: {rb.coords[0].toFixed(4)}, {rb.coords[1].toFixed(4)}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800 print:text-red-700 shrink-0">
                    {rb.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Relief Logistics & AI Command Orders */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 print:text-black">
              <Truck className="w-3.5 h-3.5" />
              <span>4.0 Logistics Staging & AI Strategic Directives</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-slate-900/60 print:bg-slate-50 p-3 rounded-xl border border-white/10 print:border-black">
                <span className="text-slate-400 text-[10px] uppercase block">Clean Drinking Water</span>
                <span className="text-lg font-bold text-cyan-400 print:text-black">{totalWaterLiters.toLocaleString()} Liters</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Pre-staged at relief hubs</p>
              </div>
              <div className="bg-slate-900/60 print:bg-slate-50 p-3 rounded-xl border border-white/10 print:border-black">
                <span className="text-slate-400 text-[10px] uppercase block">Ration Kits & Food</span>
                <span className="text-lg font-bold text-emerald-400 print:text-black">{totalFoodPacks.toLocaleString()} Packs</span>
                <p className="text-[10px] text-slate-400 mt-0.5">72-hour survival rations</p>
              </div>
              <div className="bg-slate-900/60 print:bg-slate-50 p-3 rounded-xl border border-white/10 print:border-black">
                <span className="text-slate-400 text-[10px] uppercase block">Tactical Rescue Boats</span>
                <span className="text-lg font-bold text-amber-400 print:text-black">{totalBoats} Inflatables</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Assigned to Rescue 1122</p>
              </div>
            </div>

            <div className="bg-emerald-950/30 print:bg-slate-100 p-3.5 rounded-xl border border-emerald-500/30 print:border-black text-xs font-mono space-y-1.5">
              <span className="font-bold text-emerald-300 print:text-black text-[11px] uppercase block">
                Command Priority Directives (Autonomous Crisis Solver):
              </span>
              <ul className="list-disc list-inside text-slate-300 print:text-black space-y-1 text-[11px]">
                <li>Direct high-clearance amphibious assets to high-density trapped zones.</li>
                <li>Activate patient diversion protocols from overloaded hospitals toward facilities with open ICU capacity.</li>
                <li>Establish traffic diversions on inundated choke points using national highway emergency corridors.</li>
              </ul>
            </div>
          </div>

          {/* Authentication & Clearance Footer */}
          <div className="border-t border-white/10 print:border-black pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[10px] text-slate-400 print:text-black">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 print:text-black font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AUTHENTICATED BY NEOC DUTY COMMANDER</span>
              </div>
              <p className="mt-0.5">Emergency Operations Center, Prime Minister's Secretariat, Islamabad</p>
            </div>

            <div className="text-right">
              <span className="text-slate-500 print:text-black block">SYSTEM SIGNATURE</span>
              <span className="text-slate-300 print:text-black font-bold">SHA256: 8F2B-91E0-44CD-EOC-VERIFIED</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
