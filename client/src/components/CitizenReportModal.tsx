import React, { useState, useEffect } from 'react';
import {
  X,
  AlertCircle,
  Sparkles,
  MapPin,
  Send,
  Camera,
  Phone,
  CheckCircle2,
  Users,
  Radio
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose
}) => {
  const { submitCitizenReport, setHighlightedCoords } = useCrisis();

  const [reportText, setReportText] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+92 300 1234567');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);

  // Quick prompt templates
  const presets = [
    {
      title: "🆘 Trapped Victims (Urdu/English)",
      text: "12 people trapped on roof near Dhok Kala Khan Rawalpindi, water rising rapidly over ground floor!"
    },
    {
      title: "🚧 Road Blocked (Faizabad)",
      text: "Islamabad Expressway near Faizabad submerged under 4.5ft water. Light vehicles drowned, road is completely blocked!"
    },
    {
      title: "💧 Water Shortage (Sector I-9)",
      text: "Peenay ka saaf paani khatam ho gaya hai Sector I-9 katchi abadi me. 300+ logon ko dehydration ka khatra."
    },
    {
      title: "🏥 Hospital Surge (Holy Family)",
      text: "Holy Family Hospital emergency ward flooded, capacity reached 92%, acute shortage of clean water."
    }
  ];

  // Dynamic client-side NLP preview
  const [previewCategory, setPreviewCategory] = useState('RESCUE_NEEDED');
  const [previewSeverity, setPreviewSeverity] = useState(9);
  const [previewHeadcount, setPreviewHeadcount] = useState(0);

  useEffect(() => {
    const textLower = reportText.toLowerCase();
    if (textLower.includes('road') || textLower.includes('rasta') || textLower.includes('blocked') || textLower.includes('submerged')) {
      setPreviewCategory('ROAD_BLOCKED');
      setPreviewSeverity(8);
    } else if (textLower.includes('water') || textLower.includes('paani') || textLower.includes('saaf')) {
      setPreviewCategory('WATER_SHORTAGE');
      setPreviewSeverity(7);
    } else if (textLower.includes('power') || textLower.includes('bijli') || textLower.includes('grid')) {
      setPreviewCategory('POWER_OUTAGE');
      setPreviewSeverity(7);
    } else if (textLower.includes('hospital') || textLower.includes('haspatal')) {
      setPreviewCategory('HOSPITAL_CAPACITY');
      setPreviewSeverity(8);
    } else {
      setPreviewCategory('RESCUE_NEEDED');
      setPreviewSeverity(reportText ? 9 : 5);
    }

    const match = textLower.match(/(\d+)\s*(people|persons|afrad|log|individuals|bachay|bache)/i);
    if (match && match[1]) {
      setPreviewHeadcount(parseInt(match[1], 10));
    } else {
      setPreviewHeadcount(0);
    }
  }, [reportText]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setIsSubmitting(true);
    const createdReport = await submitCitizenReport(reportText, undefined, phoneNumber);
    setIsSubmitting(false);
    setSubmittedReport(createdReport);

    setTimeout(() => {
      if (createdReport && createdReport.coords) {
        setHighlightedCoords(createdReport.coords);
      }
      setSubmittedReport(null);
      setReportText('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in select-none">
      <div className="bg-[#0e1628] border border-red-500/40 rounded-2xl w-full max-w-xl flex flex-col shadow-[0_0_50px_rgba(239,68,68,0.25)] overflow-hidden font-['Plus_Jakarta_Sans'] text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-950 border border-red-500/50 text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <span>Citizen Emergency SOS Portal</span>
                <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-bold">
                  LIVE INGESTION
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Submit emergency incident reports in English, Urdu, or Roman Urdu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {submittedReport ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-950 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-extrabold text-lg text-white">Report Ingested & AI Tagged!</h4>
            <p className="text-xs text-slate-300 font-mono">
              Auto-categorized as: <strong className="text-red-400">{submittedReport.category}</strong> (Severity: {submittedReport.severity}/10)
            </p>
            <p className="text-xs text-slate-400">
              Broadcasting to rescue teams and recalculating priority dispatch matrix...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Presets */}
            <div>
              <label className="block text-[11px] font-bold font-mono text-slate-400 uppercase mb-1.5">
                ⚡ Quick Demo Presets (Click to Fill):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReportText(preset.text)}
                    className="p-2 text-left bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-600 rounded-lg text-[11px] text-slate-300 transition-colors"
                  >
                    <span className="font-bold text-cyan-300 block">{preset.title}</span>
                    <span className="truncate block text-slate-400 text-[10px]">{preset.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Text Area */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                EMERGENCY REPORT DESCRIPTION (English / Roman Urdu):
              </label>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="e.g., Rawalpindi Commercial Market me 8 log phansay hain, pani 4ft charh gaya hai..."
                rows={3}
                required
                className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Live AI Classification Preview */}
            {reportText.trim().length > 5 && (
              <div className="bg-slate-950/80 border border-cyan-900/60 p-3 rounded-xl space-y-1.5 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>REAL-TIME AI CLASSIFIER PREVIEW:</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px]">CATEGORY:</span>
                    <span className="font-bold text-red-400">{previewCategory}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">SEVERITY:</span>
                    <span className="font-bold text-amber-400">{previewSeverity} / 10</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">HEADCOUNT:</span>
                    <span className="font-bold text-white">{previewHeadcount > 0 ? `${previewHeadcount} People` : 'Auto-resolving'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Extra Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Citizen Phone (for verification):</span>
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Damage Photo:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPhotoAttached(!photoAttached)}
                  className={`w-full p-2 rounded-lg border text-left flex items-center justify-between text-xs ${
                    photoAttached
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span>{photoAttached ? '✓ photo_flood_evidence.jpg' : '+ Attach Incident Photo'}</span>
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting || !reportText.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'AI Classifying & Ingesting...' : 'Broadcast SOS Report to CrisisMap'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
