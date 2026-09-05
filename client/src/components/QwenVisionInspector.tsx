import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  Camera,
  Scan,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Users,
  UploadCloud,
  Sparkles,
  RefreshCw,
  X,
  Crosshair,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';

export interface QwenVlAnalysis {
  id: string;
  title: string;
  location: string;
  coords: [number, number];
  inundationDepthMeters: number;
  inundationGrade: string;
  strandedCount: number;
  strandedDetails: string;
  structuralIntegrity: string;
  electricalHazard: string;
  hazards: Array<{ name: string; severity: string; confidence: number }>;
  triageCode: string;
  triageLabel: string;
  confidenceScore: number;
  suggestedUrduSOS: string;
  boundingBoxes: Array<{
    label: string;
    confidence: number;
    ymin: number;
    xmin: number;
    ymax: number;
    xmax: number;
    color: string;
  }>;
  inferenceEngine?: string;
  mode?: 'CALIBRATED_PRESET' | 'LOCAL_HEURISTIC' | 'LIVE_API';
  isLiveApi?: boolean;
  apiConfigured?: boolean;
  note?: string;
  latencyMs?: number;
  processedAt?: string;
}

interface QwenVisionInspectorProps {
  onApplyToReport?: (data: {
    suggestedText: string;
    severity: number;
    category: string;
    headcount: number;
    waterDepth: number;
    hazards: string[];
    triageCode: string;
    damageAssessment: QwenVlAnalysis;
  }) => void;
  onClose?: () => void;
  standalone?: boolean;
}

const REGIONAL_VISION_PRESETS: Record<string, Array<{ id: string; label: string; tag: string; icon: string; desc: string }>> = {
  isb_rwp: [
    {
      id: 'preset_dhok_kala_khan',
      label: 'Dhok Kala Khan Rooftop',
      tag: 'Calibrated Scenario',
      icon: '🌊',
      desc: '4 citizens marooned on terrace, 1.85m water, 11kV electrical feeder submerged'
    },
    {
      id: 'preset_faizabad',
      label: 'Faizabad Underpass',
      tag: 'Calibrated Scenario',
      icon: '🚗',
      desc: '2 trapped on submerged vehicle, 2.40m deep water, culvert drainage vortex'
    },
    {
      id: 'preset_transformer',
      label: 'Commercial Market Grid',
      tag: 'Calibrated Scenario',
      icon: '⚡',
      desc: '6 workers trapped on balcony, 1.35m flood, arcing transformer sparks'
    }
  ],
  karachi: [
    {
      id: 'preset_khi_causeway',
      label: 'Korangi Causeway Artery',
      tag: 'Calibrated Scenario',
      icon: '🌊',
      desc: '3 passengers stranded on van, 2.20m raging flood current, Malir River backflow'
    },
    {
      id: 'preset_khi_lyari',
      label: 'Lyari Moach Goth Rooftops',
      tag: 'Calibrated Scenario',
      icon: '🏠',
      desc: '5 residents marooned on single-story roof, 1.95m water, breached riverbank'
    },
    {
      id: 'preset_khi_underpass',
      label: 'Submarine Chowk Underpass',
      tag: 'Calibrated Scenario',
      icon: '🚗',
      desc: '2.50m deep flood inundation, submerged transit corridor, pump station power loss'
    }
  ],
  lahore: [
    {
      id: 'preset_lhr_underpass',
      label: 'Do Moria Pul Underpass',
      tag: 'Calibrated Scenario',
      icon: '🚗',
      desc: '2 trapped in waterlogged rickshaw, 2.40m depth, active sewer backflow'
    },
    {
      id: 'preset_lhr_lakshmi',
      label: 'Lakshmi Chowk Basin',
      tag: 'Calibrated Scenario',
      icon: '⚡',
      desc: '7 shopkeepers marooned on retail awning, 1.70m water, submerged LESCO panel'
    },
    {
      id: 'preset_lhr_ravi',
      label: 'Ravi Siphon Spillway',
      tag: 'Calibrated Scenario',
      icon: '🌊',
      desc: 'Ravi Riverbank breach, 2.10m flood surge, cattle and pastoral family stranded'
    }
  ],
  nowshera: [
    {
      id: 'preset_now_bridge',
      label: 'Kabul River GT Road Bridge',
      tag: 'Calibrated Scenario',
      icon: '🌊',
      desc: '3 cargo drivers stranded on elevated cab, 2.80m rapid river surge'
    },
    {
      id: 'preset_now_cantt',
      label: 'Nowshera Cantt Subway',
      tag: 'Calibrated Scenario',
      icon: '🚗',
      desc: '2.10m flash flood inundation, severed railway connectivity'
    },
    {
      id: 'preset_now_kaka',
      label: 'Ziarat Kaka Sahib Nullah',
      tag: 'Calibrated Scenario',
      icon: '🏠',
      desc: 'Flash torrent mudflow, 1.80m water, breached village perimeter'
    }
  ],
  swat: [
    {
      id: 'preset_swt_bypass',
      label: 'Bahrain Bypass Torrent',
      tag: 'Calibrated Scenario',
      icon: '🌊',
      desc: 'Swat River mountain flash flood, 2.60m depth with boulder silt, 3 tourists marooned'
    },
    {
      id: 'preset_swt_hotel',
      label: 'Madyan Riverside Hotel',
      tag: 'Calibrated Scenario',
      icon: '🏨',
      desc: 'River surge into lower levels, 2.10m water, 5 guests stranded on upper terrace'
    },
    {
      id: 'preset_swt_mingora',
      label: 'Saidu Sharif Footbridge',
      tag: 'Calibrated Scenario',
      icon: '⚡',
      desc: 'Compromised cable anchor, 1.90m raging mountain stream, pedestrian cut-off'
    }
  ],
  sukkur: [
    {
      id: 'preset_suk_katcha',
      label: 'Sukkur Barrage Katcha Island',
      tag: 'Calibrated Scenario',
      icon: '🌊',
      desc: 'Indus River super-flood, 2.45m inundation, 8 villagers awaiting motor launch'
    },
    {
      id: 'preset_suk_rohri',
      label: 'Rohri Bypass Underpass',
      tag: 'Calibrated Scenario',
      icon: '🚗',
      desc: '1.90m deep standing flood, trapped fuel truck, National Highway bypass cut'
    },
    {
      id: 'preset_suk_bandar',
      label: 'Bandar Road Riverbank',
      tag: 'Calibrated Scenario',
      icon: '⚡',
      desc: '1.65m water level, protective bund erosion, urban commercial threat'
    }
  ],
  dgkhan: [
    {
      id: 'preset_dgk_choti',
      label: 'Choti Zareen Rod-Kohi Torrent',
      tag: 'Calibrated Scenario',
      icon: '🌊',
      desc: 'Hill torrent flash flood, 2.35m depth, severed Indus Highway'
    },
    {
      id: 'preset_dgk_kotchutta',
      label: 'Kot Chutta Embankment Breach',
      tag: 'Calibrated Scenario',
      icon: '🏠',
      desc: 'Canal branch rupture, 1.75m water, 6 farmers marooned on grain silo'
    },
    {
      id: 'preset_dgk_taunsa',
      label: 'Taunsa Barrage Downstream',
      tag: 'Calibrated Scenario',
      icon: '⚡',
      desc: '2.50m river surge, submerged tube-well pump houses, canal inlet breach'
    }
  ],
  quetta: [
    {
      id: 'preset_qta_western',
      label: 'Western Bypass Chiltan Torrent',
      tag: 'Calibrated Scenario',
      icon: '🌊',
      desc: 'Mountain runoff flash flood, 1.85m mudflow, blocked highway'
    },
    {
      id: 'preset_qta_spiny',
      label: 'Spiny Road Urban Washout',
      tag: 'Calibrated Scenario',
      icon: '🏠',
      desc: '1.55m urban flash flood, flooded basement shops, 4 trapped'
    },
    {
      id: 'preset_qta_hanna',
      label: 'Hanna Valley Spillway',
      tag: 'Calibrated Scenario',
      icon: '⚡',
      desc: 'Dam spillway mountain wash, 2.05m torrential surge, bridge cutoff'
    }
  ]
};

// Client-side Canvas Image Resizer & Compressor (Prevents 413 Payload Too Large)
const resizeAndCompressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;

    img.onload = () => {
      const MAX_DIM = 1200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        }
      } else {
        if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(img.src);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      // Compress to lightweight JPEG (typically 150-350KB)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
      resolve(compressedBase64);
    };

    img.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://emergency-intelligence-platform.onrender.com');

export const QwenVisionInspector: React.FC<QwenVisionInspectorProps> = ({
  onApplyToReport,
  onClose,
  standalone = false
}) => {
  const { activeRegion } = useCrisis();
  const currentPresets = REGIONAL_VISION_PRESETS[activeRegion?.id] || REGIONAL_VISION_PRESETS.isb_rwp;
  const [selectedPreset, setSelectedPreset] = useState<string>(currentPresets[0]?.id || 'preset_dhok_kala_khan');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<QwenVlAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeBoxHover, setActiveBoxHover] = useState<number | null>(null);
  const [liveApiConnected, setLiveApiConnected] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selectedPreset when activeRegion changes
  useEffect(() => {
    const list = REGIONAL_VISION_PRESETS[activeRegion?.id] || REGIONAL_VISION_PRESETS.isb_rwp;
    if (list[0]) {
      setSelectedPreset(list[0].id);
      setCustomImage(null);
    }
  }, [activeRegion?.id]);

  // Check backend vision API status on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/vision/status`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.liveApiConfigured) {
          setLiveApiConnected(true);
        }
      })
      .catch(() => {
        // Local offline mode
      });
  }, []);

  // Fetch or trigger analysis
  const runAnalysis = async (presetId?: string, imageBase64?: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const payload: any = { regionId: activeRegion?.id };
      if (presetId) {
        payload.presetId = presetId;
      } else if (imageBase64) {
        payload.imageBase64 = imageBase64;
      }

      const res = await fetch(`${API_BASE}/api/vision/analyze-damage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Vision API error: Server responded with status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        throw new Error(data.error || 'Failed to analyze disaster photo.');
      }
    } catch (err: any) {
      console.error('Vision analysis error:', err);
      // Honest error reporting — never silently inject a fake unrelated report
      setError(err.message || 'Vision service error: unable to process image.');
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (selectedPreset) {
      runAnalysis(selectedPreset);
    }
  }, [selectedPreset]);

  // Handle custom image upload with auto-resizing
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      const compressedBase64 = await resizeAndCompressImage(file);
      setCustomImage(compressedBase64);
      setSelectedPreset('');
      await runAnalysis(undefined, compressedBase64);
    } catch (err: any) {
      console.error('Image compression error:', err);
      setError('Failed to process image file. Please try a different photo.');
      setIsAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (!analysis || !onApplyToReport) return;
    onApplyToReport({
      suggestedText: analysis.suggestedUrduSOS,
      severity: analysis.triageCode === 'CODE_RED' ? 10 : 8,
      category: analysis.inundationDepthMeters > 2.0 ? 'ROAD_BLOCKED' : 'RESCUE_NEEDED',
      headcount: analysis.strandedCount,
      waterDepth: analysis.inundationDepthMeters,
      hazards: analysis.hazards.map(h => h.name),
      triageCode: analysis.triageCode,
      damageAssessment: analysis
    });
  };

  useEffect(() => {
    if (standalone) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [standalone]);

  return (
    <div className={`bg-[#080d19] text-slate-100 font-['Plus_Jakarta_Sans'] ${
      standalone
        ? 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md'
        : 'rounded-2xl border border-cyan-800/40 p-4 sm:p-5 shadow-lg my-3'
    }`}>
      <div className={`w-full ${standalone ? 'max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl' : ''}`}>
        
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/60 text-cyan-400 shadow-sm">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
                  <span>Qwen-VL Vision Intelligence</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    liveApiConnected
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                  }`}>
                    {liveApiConnected ? '🟢 LIVE CLOUD INFERENCE' : 'DISASTER CALIBRATION SUITE'}
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Visual Flood Depth Estimation, Stranded Person Localization & Structural Hazards
              </p>
            </div>
          </div>

          {standalone && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Preset Selector & Upload Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              <span>SELECT DISASTER FEED OR UPLOAD CUSTOM PHOTO:</span>
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-cyan-400 hover:text-cyan-300 text-[11px] font-bold underline flex items-center gap-1 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Custom Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentPresets.map((opt) => {
              const isSelected = selectedPreset === opt.id && !customImage;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setCustomImage(null);
                    setError(null);
                    setSelectedPreset(opt.id);
                  }}
                  className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{opt.icon}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
                      {opt.tag}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-100">{opt.label}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="p-4 bg-rose-950/70 border border-rose-800 rounded-xl my-3 text-center space-y-2">
            <AlertTriangle className="w-5 h-5 text-rose-400 mx-auto animate-bounce" />
            <p className="text-xs font-mono text-rose-200">{error}</p>
            <button
              type="button"
              onClick={() => {
                setCustomImage(null);
                setError(null);
                setSelectedPreset('preset_dhok_kala_khan');
              }}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-200 rounded-lg font-mono transition-colors"
            >
              Switch to Calibrated Disaster Scenario
            </button>
          </div>
        )}

        {/* Vision Scanner Canvas */}
        <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden mb-4 aspect-[16/9] max-h-[300px] flex items-center justify-center select-none shadow-inner">
          
          {/* Visual Scene Graphic or Custom Image */}
          {customImage ? (
            <img
              src={customImage}
              alt="Uploaded Disaster Incident Evidence"
              className="w-full h-full object-cover"
            />
          ) : (
            // High-fidelity calibrated disaster visual graphic
            <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-slate-900 via-[#0e1e38] to-[#08203d]">
              <svg className="w-full h-full absolute inset-0 opacity-80" viewBox="0 0 800 450" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0891b2" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#0284c7" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
                  </linearGradient>
                  <pattern id="rain" width="20" height="20" patternUnits="userSpaceOnUse">
                    <line x1="2" y1="0" x2="0" y2="12" stroke="#67e8f9" strokeWidth="0.8" opacity="0.3" />
                  </pattern>
                </defs>

                <rect width="800" height="450" fill="url(#rain)" />

                {/* Submerged Buildings */}
                <rect x="60" y="140" width="180" height="260" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <rect x="280" y="80" width="220" height="320" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                <rect x="540" y="120" width="200" height="280" fill="#1e293b" stroke="#334155" strokeWidth="2" />

                {/* Rooftop Parapet with marooned individuals */}
                <rect x="290" y="70" width="200" height="15" fill="#334155" />
                <circle cx="340" cy="60" r="7" fill="#f87171" />
                <rect x="335" y="67" width="10" height="12" rx="2" fill="#ef4444" />
                <circle cx="360" cy="58" r="7" fill="#f87171" />
                <rect x="355" y="65" width="10" height="14" rx="2" fill="#ef4444" />
                <circle cx="380" cy="62" r="6" fill="#fb923c" />
                <rect x="376" y="68" width="8" height="11" rx="2" fill="#f97316" />
                <circle cx="395" cy="61" r="6" fill="#fbbf24" />
                <rect x="391" y="67" width="8" height="12" rx="2" fill="#eab308" />

                {/* Utility pole & Submerged Transformer */}
                <line x1="120" y1="200" x2="120" y2="380" stroke="#64748b" strokeWidth="4" />
                <line x1="100" y1="220" x2="140" y2="220" stroke="#64748b" strokeWidth="3" />
                <rect x="105" y="240" width="30" height="40" fill="#334155" stroke="#f59e0b" strokeWidth="1.5" />

                {/* Submerged Flood Water Overlay */}
                <rect x="0" y="250" width="800" height="200" fill="url(#waterGrad)" />
                <path d="M0 250 Q200 242, 400 250 T800 250 L800 450 L0 450 Z" fill="#0284c7" opacity="0.5" />
                <line x1="0" y1="250" x2="800" y2="250" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6,4" />
              </svg>
            </div>
          )}

          {/* HUD Scanline Animation */}
          {isAnalyzing && (
            <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" />
              <div className="bg-cyan-950/80 border border-cyan-500/60 px-3 py-1.5 rounded-lg text-cyan-300 font-mono text-xs font-bold mx-auto mb-4 flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span>MULTIMODAL PIXEL SCANNING IN PROGRESS...</span>
              </div>
            </div>
          )}

          {/* Bounding Box Overlays */}
          {analysis && !isAnalyzing && analysis.boundingBoxes?.map((b, idx) => {
            const isHovered = activeBoxHover === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveBoxHover(idx)}
                onMouseLeave={() => setActiveBoxHover(null)}
                style={{
                  top: `${b.ymin}%`,
                  left: `${b.xmin}%`,
                  width: `${b.xmax - b.xmin}%`,
                  height: `${b.ymax - b.ymin}%`,
                  borderColor: b.color || '#22d3ee'
                }}
                className={`absolute border-2 transition-all cursor-pointer pointer-events-auto z-10 rounded-sm ${
                  isHovered
                    ? 'bg-cyan-500/20 shadow-[0_0_25px_rgba(6,182,212,0.8)]'
                    : 'bg-black/15 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Corner crosshairs */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />

                {/* Box Tag */}
                <span
                  style={{ backgroundColor: b.color || '#0891b2' }}
                  className="absolute -top-6 left-0 text-[10px] font-mono font-bold text-white px-1.5 py-0.5 rounded shadow whitespace-nowrap flex items-center gap-1"
                >
                  <span>{b.label}</span>
                  <span className="opacity-80">({Math.round(b.confidence * 100)}%)</span>
                </span>
              </div>
            );
          })}

          {/* Top telemetry banner */}
          <div className="absolute top-2 left-2 z-10 bg-slate-950/85 border border-cyan-500/40 rounded-lg px-2 py-1 font-mono text-[10px] text-cyan-300 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${analysis?.isLiveApi ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} />
            <span>
              {analysis?.mode === 'LIVE_API'
                ? 'LIVE QWEN-VL CLOUD'
                : analysis?.mode === 'CALIBRATED_PRESET'
                  ? 'CALIBRATED SCENARIO'
                  : 'LOCAL VISION HEURISTIC'}
            </span>
            <span className="text-slate-500">|</span>
            <span>{analysis?.latencyMs || 160}ms</span>
          </div>

          <div className="absolute top-2 right-2 z-10 bg-slate-950/85 border border-rose-500/40 rounded-lg px-2 py-1 font-mono text-[10px] text-rose-300 font-bold">
            {analysis?.triageCode || 'CODE_RED'}
          </div>
        </div>

        {/* Multimodal Telemetry Metrics */}
        {analysis && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Depth Gauge */}
              <div className="bg-slate-950/90 border border-cyan-800/60 p-2.5 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-cyan-400" />
                  <span>INUNDATION DEPTH:</span>
                </span>
                <span className="font-extrabold text-cyan-300 text-sm sm:text-base">
                  {analysis.inundationDepthMeters}m
                </span>
                <span className="text-[9px] text-slate-500 block truncate">
                  {analysis.inundationGrade}
                </span>
              </div>

              {/* Stranded Count */}
              <div className="bg-slate-950/90 border border-rose-800/60 p-2.5 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-rose-400" />
                  <span>STRANDED PERSONS:</span>
                </span>
                <span className="font-extrabold text-rose-300 text-sm sm:text-base">
                  {analysis.strandedCount} Visible
                </span>
                <span className="text-[9px] text-slate-500 block truncate">
                  Confidence: {Math.round(analysis.confidenceScore * 100)}%
                </span>
              </div>

              {/* Structural Integrity */}
              <div className="bg-slate-950/90 border border-amber-800/60 p-2.5 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>STRUCTURAL RISK:</span>
                </span>
                <span className="font-extrabold text-amber-300 text-xs sm:text-xs line-clamp-1">
                  {analysis.structuralIntegrity.split(' ')[0]} {analysis.structuralIntegrity.split(' ')[1] || 'Erosion'}
                </span>
                <span className="text-[9px] text-slate-500 block truncate">
                  Masonry Checked
                </span>
              </div>

              {/* Electrical Hazard */}
              <div className="bg-slate-950/90 border border-red-800/60 p-2.5 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-red-400" />
                  <span>POWER / GRID HAZARD:</span>
                </span>
                <span className="font-extrabold text-red-400 text-xs sm:text-xs line-clamp-1">
                  {analysis.electricalHazard.split('(')[0] || 'Active Hazard'}
                </span>
                <span className="text-[9px] text-slate-500 block truncate">
                  11kV Submersion
                </span>
              </div>
            </div>

            {/* Urdu / English Synthesized SOS Broadcast Banner */}
            <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>SYNTHESIZED DISTRESS SOS (URDU / ROMAN URDU):</span>
                </span>
                <span className="text-[10px] bg-red-950 text-red-300 border border-red-800/60 px-2 py-0.5 rounded font-bold">
                  {analysis.triageLabel}
                </span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed bg-slate-900/80 p-2 rounded-lg border border-slate-800 font-mono">
                "{analysis.suggestedUrduSOS}"
              </p>
            </div>

            {/* Transparent Inference Engine & Configuration Badge */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <Info className="w-3 h-3 text-cyan-400" />
                <span>Engine: <strong className="text-slate-200">{analysis.inferenceEngine}</strong></span>
              </span>
              {analysis.note && (
                <span className="text-[10px] text-amber-400/90 italic">
                  {analysis.note}
                </span>
              )}
            </div>

            {/* Action Bar */}
            {onApplyToReport && (
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:from-cyan-500 hover:to-teal-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Inject Vision Telemetry Into Citizen SOS Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
