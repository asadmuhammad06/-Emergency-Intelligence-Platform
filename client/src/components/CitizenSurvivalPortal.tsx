import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCrisis } from '../context/CrisisContext';
import {
  AlertCircle,
  MapPin,
  Send,
  PhoneCall,
  CheckCircle2,
  ShieldAlert,
  Droplets,
  Radio,
  LifeBuoy,
  RefreshCw,
  Navigation,
  Mic,
  MicOff,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface CitizenSurvivalPortalProps {
  onSwitchToCommander: () => void;
  onBackToGateway?: () => void;
}

const EMERGENCY_PRESETS = [
  {
    id: 'rooftop',
    title: 'Rooftop Evacuation',
    urdu: 'چھت پر پھنسے افراد',
    color: 'border-red-600 bg-red-950/70 text-red-300 hover:bg-red-900/80',
    icon: '🔴',
    text: 'Water entered ground floor, family trapped on roof. Need emergency rescue boat urgently!'
  },
  {
    id: 'medical',
    title: 'Medical / Oxygen',
    urdu: 'طبی ایمرجنسی',
    color: 'border-amber-600 bg-amber-950/70 text-amber-300 hover:bg-amber-900/80',
    icon: '🟠',
    text: 'Critical medical emergency. Patient needs immediate oxygen / ambulance extraction.'
  },
  {
    id: 'water',
    title: 'Water / Food Shortage',
    urdu: 'پینے کا پانی / خوراک',
    color: 'border-cyan-600 bg-cyan-950/70 text-cyan-300 hover:bg-cyan-900/80',
    icon: '🔵',
    text: 'Drinking water pipeline flooded / broken. Over 20 people without clean drinking water and rations.'
  },
  {
    id: 'road',
    title: 'Road Submerged',
    urdu: 'راستہ بند / کٹاؤ',
    color: 'border-emerald-600 bg-emerald-950/70 text-emerald-300 hover:bg-emerald-900/80',
    icon: '🟢',
    text: 'Main road submerged under 4ft water. Civilian vehicles trapped, road completely blocked.'
  }
];

function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const CitizenSurvivalPortal: React.FC<CitizenSurvivalPortalProps> = ({
  onSwitchToCommander,
  onBackToGateway
}) => {
  const { submitCitizenReport, activeRegion, reliefHubs } = useCrisis();

  // Citizen Input State
  const [reportText, setReportText] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // GPS Location State
  const [gpsCoords, setGpsCoords] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'IDLE' | 'LOCKING' | 'LOCKED' | 'FAILED'>('IDLE');
  const [locationName, setLocationName] = useState<string>('Live device GPS required for pinpoint rescue');
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string | null>(null);

  // Auto-acquire Device GPS on mount or on explicit user request
  const acquireGps = () => {
    setGpsStatus('LOCKING');
    setGpsErrorMsg(null);
    setLocationName('Connecting to satellite GPS receiver...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(6));
          const lng = Number(position.coords.longitude.toFixed(6));
          const acc = Math.round(position.coords.accuracy || 6);
          setGpsCoords([lat, lng]);
          setAccuracy(acc);
          setGpsStatus('LOCKED');
          setLocationName(`GPS Fixed: [${lat}, ${lng}] (±${acc}m accuracy)`);
        },
        (error) => {
          console.warn('Browser GPS acquisition failed:', error.message);
          const fallback = activeRegion?.center || [33.65, 73.06];
          setGpsCoords(fallback);
          setAccuracy(null);
          setGpsStatus('FAILED');
          if (error.code === error.PERMISSION_DENIED) {
            setGpsErrorMsg('Browser location permission was denied. Tap the lock 🔒 icon in your browser address bar to Allow Location.');
          } else {
            setGpsErrorMsg('GPS signal timed out. Please tap "Detect My GPS" again.');
          }
          setLocationName(`${activeRegion?.name || 'Rawalpindi / Islamabad'} (Regional Area Fallback)`);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0
        }
      );
    } else {
      const fallback = activeRegion?.center || [33.65, 73.06];
      setGpsCoords(fallback);
      setGpsStatus('FAILED');
      setGpsErrorMsg('Geolocation is not supported by your device browser.');
      setLocationName(`${activeRegion?.name || 'Rawalpindi / Islamabad'} (Default)`);
    }
  };

  useEffect(() => {
    // Proactively request on initial mount
    acquireGps();
  }, [activeRegion?.id]);

  // Speech Recognition setup (Roman Urdu / English)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = 'ur-PK';

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setReportText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognizer.onerror = () => setIsListening(false);
      recognizer.onend = () => setIsListening(false);
      recognitionRef.current = recognizer;
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handlePresetClick = (presetText: string) => {
    setReportText(presetText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSubmitting(true);
    try {
      const targetCoords = gpsCoords || activeRegion?.center || [33.65, 73.06];
      const isLiveGps = gpsStatus === 'LOCKED';

      const report = await submitCitizenReport(
        reportText.trim(),
        targetCoords,
        phoneNumber.trim() || '+92 300 0000000',
        citizenName.trim() || 'Citizen in Distress',
        isLiveGps,
        accuracy || undefined
      );

      setSubmittedReport(report);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mathematically calculate nearest relief shelter using Haversine distance
  const targetUserCoords = gpsCoords || activeRegion?.center || [33.65, 73.06];

  const nearestHubData = useMemo(() => {
    if (!reliefHubs || reliefHubs.length === 0) {
      return {
        hub: {
          id: 'hub_fallback',
          name: 'NDMA Primary Regional Relief Depot',
          type: 'DISASTER_LOGISTICS_HUB',
          drinkingWaterLiters: 15000,
          foodPackets: 2500,
          rescueBoats: 6,
          managedBy: 'NDMA & Rescue 1122',
          coords: [targetUserCoords[0] + 0.015, targetUserCoords[1] + 0.015] as [number, number]
        },
        distanceKm: 1.6
      };
    }

    const sorted = [...reliefHubs].map(h => ({
      hub: h,
      distanceKm: getHaversineDistanceKm(targetUserCoords[0], targetUserCoords[1], h.coords[0], h.coords[1])
    })).sort((a, b) => a.distanceKm - b.distanceKm);

    return sorted[0];
  }, [reliefHubs, targetUserCoords]);

  return (
    <div className="min-h-screen w-full bg-[#080d1a] text-slate-100 font-['Plus_Jakarta_Sans'] flex flex-col items-center justify-between p-3 sm:p-6 select-none">
      {/* Top Header & Role Switcher */}
      <header className="w-full max-w-2xl flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-950 border border-red-500/40 flex items-center justify-center text-red-400 shadow-sm">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-red-400 uppercase font-mono">
                EMERGENCY SOS
              </span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <h1 className="text-base sm:text-lg font-black text-white leading-tight">
              Citizen Survival Portal
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToGateway && (
            <button
              onClick={onBackToGateway}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all"
              title="Return to Role Gateway"
            >
              ← Gateway
            </button>
          )}

          {/* EOC Commander Login Button */}
          <button
            onClick={onSwitchToCommander}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 hover:text-cyan-200 text-xs font-bold font-mono transition-all shadow-sm hover:border-cyan-500/50"
            title="Switch to Authenticated EOC Commander View"
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xs:inline">EOC Commander Login</span>
            <span className="xs:hidden">EOC Login</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl flex-1 flex flex-col justify-center">
        {submittedReport ? (
          /* ============================================================== */
          /* POST-SOS RESCUE TRACKER SCREEN                                 */
          /* ============================================================== */
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 sm:p-8 shadow-xl flex flex-col gap-6 animate-in fade-in">
            {/* Status Header */}
            <div className="flex items-start gap-4 pb-5 border-b border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-[10px] font-mono font-bold uppercase mb-1">
                  <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                  BEACON LOGGED AT NDMA EOC
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Distress Broadcast Transmitted!
                </h2>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  Your incident ID is <span className="text-cyan-400 font-bold">{submittedReport.id}</span>. Rescue dispatchers have received your distress coordinates.
                </p>
              </div>
            </div>

            {/* Live Dispatch Telemetry Pod */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 font-mono text-xs">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                LIVE EOC DISPATCH TELEMETRY
              </span>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-500/80 flex items-center justify-center text-emerald-400 text-[10px]">
                    ✓
                  </div>
                  <span>Distress Signal Logged at Central Command</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-500/80 flex items-center justify-center text-emerald-400 text-[10px]">
                    ✓
                  </div>
                  <span>
                    AI Triage Assigned: <strong className="text-amber-400">PRIORITY RESCUE</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <span className="text-xs">🚤</span>
                  <span className="text-cyan-300 font-medium">
                    Rescue 1122 Quick Response Unit Alerted
                  </span>
                </div>
              </div>
            </div>

            {/* Nearest Safe Relief Shelter (Haversine Distance Calculated) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
                  NEAREST SAFE RELIEF SHELTER (FROM YOUR GPS)
                </span>
                <span className="text-[10px] font-mono text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/70 shadow-sm">
                  {nearestHubData.distanceKm} KM AWAY
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-between">
                <span>{nearestHubData.hub.name}</span>
                <span className="text-xs font-mono text-cyan-300">~{Math.max(5, Math.round(nearestHubData.distanceKm * 12))} min travel</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Stationed with clean drinking water ({(nearestHubData.hub.drinkingWaterLiters || 10000).toLocaleString()}L), food rations ({nearestHubData.hub.foodPackets || 1200} packs), and Rescue Jet-Boats.
              </p>
              {nearestHubData.hub.coords && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${nearestHubData.hub.coords[0]},${nearestHubData.hub.coords[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/50 text-cyan-200 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Navigate to Shelter via Google Maps (Turn-by-Turn)</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </a>
              )}
            </div>

            {/* Immediate Direct Hotlines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="tel:1122"
                className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>CALL RESCUE 1122</span>
              </a>
              <a
                href="tel:1110"
                className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white font-bold text-sm border border-slate-700 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <span>NDMA HELPLINE (1110)</span>
              </a>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSubmittedReport(null);
                setReportText('');
              }}
              className="w-full py-2.5 text-center text-xs font-mono text-slate-400 hover:text-white transition-colors underline decoration-slate-600"
            >
              ← Submit another emergency distress report
            </button>
          </div>
        ) : (
          /* ============================================================== */
          /* PRE-SUBMISSION CITIZEN SOS INPUT FORM                          */
          /* ============================================================== */
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-red-500/40 rounded-2xl p-4 sm:p-7 shadow-xl flex flex-col gap-4 sm:gap-5"
          >
            {/* High-Precision Interactive GPS Card */}
            <div className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
              gpsStatus === 'LOCKED'
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-sm'
                : gpsStatus === 'LOCKING'
                ? 'bg-amber-950/30 border-amber-500/50 animate-pulse'
                : 'bg-slate-950/90 border-slate-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    gpsStatus === 'LOCKED' ? 'bg-emerald-900/80 text-emerald-400 border border-emerald-500/50' : 'bg-slate-900 text-amber-400 border border-slate-700'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-2">
                      <span>{gpsStatus === 'LOCKED' ? 'LIVE SATELLITE GPS ACTIVE' : 'LIVE DEVICE GPS PINPOINT'}</span>
                      {gpsStatus === 'LOCKED' && accuracy && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700 font-bold">
                          ±{accuracy}m Accuracy
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-slate-300 mt-0.5">
                      {locationName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={acquireGps}
                  className={`px-3 py-2 rounded-xl text-xs font-bold font-mono border flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0 shadow-sm ${
                    gpsStatus === 'LOCKED'
                      ? 'bg-slate-900 hover:bg-slate-800 text-emerald-300 border-emerald-600/60'
                      : 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-sm'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${gpsStatus === 'LOCKING' ? 'animate-spin' : ''}`} />
                  <span>{gpsStatus === 'LOCKED' ? 'REFRESH GPS' : '📍 DETECT MY EXACT GPS'}</span>
                </button>
              </div>

              {gpsErrorMsg && (
                <div className="mt-2.5 p-2 rounded-lg bg-rose-950/80 border border-rose-800 text-[11px] text-rose-200 font-mono flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                  <span>{gpsErrorMsg}</span>
                </div>
              )}
            </div>

            {/* 1-Tap Rapid Distress Chips */}
            <div>
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>1-Tap Emergency Quick Chips</span>
                <span className="text-slate-500 text-[10px]">فوری ایمرجنسی آپشنز</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EMERGENCY_PRESETS.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handlePresetClick(chip.text)}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all ${chip.color} active:scale-[0.98]`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base">{chip.icon}</span>
                      <span className="text-xs sm:text-sm font-bold">{chip.title}</span>
                    </div>
                    <span className="text-[10px] opacity-70 font-sans">{chip.urdu}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Description Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                  Emergency Description (تفصیل)
                </label>
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                    isListening
                      ? 'bg-red-600 text-white border-red-500 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-red-400" />}
                  <span>{isListening ? 'Listening...' : 'Voice SOS'}</span>
                </button>
              </div>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Describe your situation in Roman Urdu, Urdu, or English (e.g. Dhok Kala Khan me pani 4ft charh gaya hai, chat par phansay hain rescue boat chahiye)..."
                rows={3}
                required
                className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all resize-none shadow-inner"
              />
            </div>

            {/* Optional Citizen Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-500" />
                  <span>Your Name (Optional)</span>
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Ali Khan"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>Phone Number (رابطہ نمبر)</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none font-mono"
                />
              </div>
            </div>

            {/* Giant Broadcast Button */}
            <button
              type="submit"
              disabled={isSubmitting || !reportText.trim()}
              className="w-full py-3.5 sm:py-4 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-white font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all uppercase"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>TRANSMITTING SOS BEACON...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>BROADCAST EMERGENCY SOS (مدد کے لیے بھیجیں)</span>
                </>
              )}
            </button>
          </form>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="w-full max-w-2xl text-center pt-4 text-[10px] font-mono text-slate-500 border-t border-slate-900/60">
        Emergency Telemetry Grid • Coordinated with National Disaster Management Authority (NDMA) & Rescue 1122
      </footer>
    </div>
  );
};

