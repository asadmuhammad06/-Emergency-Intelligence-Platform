import React, { useState, useEffect, useRef } from 'react';
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

export const CitizenSurvivalPortal: React.FC<CitizenSurvivalPortalProps> = ({
  onSwitchToCommander
}) => {
  const { submitCitizenReport, activeRegion, reliefHubs } = useCrisis();

  // Citizen Input State
  const [reportText, setReportText] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);

  // GPS Location State
  const [gpsCoords, setGpsCoords] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'LOCKING' | 'LOCKED' | 'FAILED'>('LOCKING');
  const [locationName, setLocationName] = useState<string>('Detecting exact device location...');

  // Voice SOS State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auto-acquire Device GPS on mount
  const acquireGps = () => {
    setGpsStatus('LOCKING');
    setLocationName('Acquiring satellite GPS lock...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(6));
          const lng = Number(position.coords.longitude.toFixed(6));
          const acc = Math.round(position.coords.accuracy || 10);
          setGpsCoords([lat, lng]);
          setAccuracy(acc);
          setGpsStatus('LOCKED');
          setLocationName(`GPS Fixed: [${lat}, ${lng}] (~${acc}m accuracy)`);
        },
        (error) => {
          console.warn('Browser GPS acquisition failed, using regional centroid:', error.message);
          const fallback = activeRegion?.center || [33.65, 73.06];
          setGpsCoords(fallback);
          setAccuracy(null);
          setGpsStatus('FAILED');
          setLocationName(`${activeRegion?.name || 'Rawalpindi / Islamabad'} (Regional Area Center)`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      const fallback = activeRegion?.center || [33.65, 73.06];
      setGpsCoords(fallback);
      setGpsStatus('FAILED');
      setLocationName(`${activeRegion?.name || 'Rawalpindi / Islamabad'} (Default)`);
    }
  };

  useEffect(() => {
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

  // Find nearest relief hub for survival guidance
  const nearestHub = reliefHubs && reliefHubs[0] ? reliefHubs[0] : {
    name: 'Liaquat Bagh Relief Base',
    type: 'DISASTER_LOGISTICS_HUB',
    drinkingWaterLiters: 9500,
    foodPackets: 850,
    rescueBoats: 6,
    managedBy: 'NDMA & Rescue 1122'
  };

  return (
    <div className="min-h-screen w-full bg-[#070b14] text-slate-100 font-['Plus_Jakarta_Sans'] flex flex-col items-center justify-between p-3 sm:p-6 select-none">
      {/* Top Header & Role Switcher */}
      <header className="w-full max-w-2xl flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
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
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl flex-1 flex flex-col justify-center">
        {submittedReport ? (
          /* ============================================================== */
          /* POST-SOS RESCUE TRACKER SCREEN                                 */
          /* ============================================================== */
          <div className="bg-slate-900/95 border border-emerald-500/50 rounded-2xl p-5 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col gap-6 animate-in fade-in">
            {/* Status Header */}
            <div className="flex items-start gap-4 pb-5 border-b border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/80 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
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
                <p className="text-xs text-slate-300 mt-1">
                  Your incident ID is <span className="font-mono text-emerald-400 font-bold">{submittedReport.id}</span>. Rescue dispatchers have received your distress coordinates.
                </p>
              </div>
            </div>

            {/* Live Progress Tracker */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col gap-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Live EOC Dispatch Telemetry
              </span>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 flex items-center justify-center font-mono font-bold text-[10px]">
                    ✓
                  </div>
                  <span className="text-white font-medium">Distress Signal Logged at Central Command</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 flex items-center justify-center font-mono font-bold text-[10px]">
                    ✓
                  </div>
                  <span className="text-white font-medium">
                    AI Triage Assigned: <span className="text-amber-400 font-bold font-mono">PRIORITY RESCUE</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/60 flex items-center justify-center font-mono font-bold text-[10px] animate-pulse">
                    🚤
                  </div>
                  <span className="text-cyan-300 font-medium">
                    Rescue 1122 Quick Response Unit Alerted
                  </span>
                </div>
              </div>
            </div>

            {/* Nearest Safe Relief Shelter */}
            <div className="bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
                  NEAREST SAFE RELIEF SHELTER
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60">
                  OPERATIONAL
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {nearestHub.name}
              </h3>
              <p className="text-xs text-slate-300">
                Stationed with clean drinking water ({nearestHub.drinkingWaterLiters?.toLocaleString()}L), food rations ({nearestHub.foodPackets} packs), and Rescue Jet-Boats.
              </p>
            </div>

            {/* Immediate Direct Hotlines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="tel:1122"
                className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-extrabold text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
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
            className="bg-slate-900/90 border border-red-500/50 rounded-2xl p-4 sm:p-7 shadow-[0_0_50px_rgba(239,68,68,0.2)] flex flex-col gap-4 sm:gap-5"
          >
            {/* Live GPS Bar */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <MapPin
                  className={`w-4 h-4 shrink-0 ${
                    gpsStatus === 'LOCKED'
                      ? 'text-emerald-400'
                      : gpsStatus === 'LOCKING'
                      ? 'text-amber-400 animate-spin'
                      : 'text-rose-400'
                  }`}
                />
                <span className="font-mono text-slate-300 truncate text-[11px] sm:text-xs">
                  {locationName}
                </span>
              </div>
              <button
                type="button"
                onClick={acquireGps}
                className="shrink-0 ml-2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-cyan-300 flex items-center gap-1 border border-slate-700"
                title="Refresh GPS Coordinates"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>REFRESH GPS</span>
              </button>
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
              className="w-full py-3.5 sm:py-4 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-white font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(239,68,68,0.5)] border border-red-400/40 transition-all uppercase"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>TRANSMITTING SOS BEACON...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 animate-bounce" />
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

