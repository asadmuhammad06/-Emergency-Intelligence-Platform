import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Navigation,
  AlertTriangle,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';

interface CommanderQwenDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSafeRouteModal: () => void;
  onOpenPriorityModal: () => void;
  onOpenCitizenModal: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'qwen';
  text: string;
  thinking?: string;
  timestamp: string;
  action?: {
    label: string;
    type: 'route' | 'priority' | 'sos';
  };
}

const STRATEGIC_PROMPTS = [
  {
    label: '🚤 Deploy 2 Remaining Rescue Boats',
    prompt: 'Where should our 2 remaining rescue boats be deployed right now to save the most lives?'
  },
  {
    label: '🏥 Hospital Divert (Holy Family Full)',
    prompt: 'Holy Family Hospital is overwhelmed at 92% capacity. Where should Rescue 1122 divert incoming trauma casualties?'
  },
  {
    label: '🛣️ Safest Evacuation Route to PIMS',
    prompt: 'Faizabad corridor is submerged. What is the safest evacuation route for ambulances moving to PIMS?'
  },
  {
    label: '📋 NDMA Flash Situation Briefing',
    prompt: 'Generate an executive 60-second disaster situation briefing for DG NDMA and Provincial EOC.'
  }
];

export const CommanderQwenDrawer: React.FC<CommanderQwenDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSafeRouteModal,
  onOpenPriorityModal,
  onOpenCitizenModal
}) => {
  const {
    activeRegion,
    reports,
    hospitals,
    weather,
    calculateSafeRoute,
    hazardZones
  } = useCrisis();

  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'qwen',
      text: `Tactical Operations Center online. I am Commander Qwen, powered by Alibaba Cloud Qwen-2.5. I am continuously monitoring live telemetry across ${activeRegion.name} (Weather: ${weather ? `${weather.temperature}°C, ${weather.condition}` : 'Active Monitoring'}, Lai Gauge: 15.0 ft, Active SOS Signals: ${reports.length}). How can I direct operations?`,
      timestamp: '00:01 PKT'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  if (!isOpen) return null;

  const generateQwenResponse = (query: string): { thinking: string; text: string; action?: { label: string; type: 'route' | 'priority' | 'sos' } } => {
    const qLower = query.toLowerCase();

    if (qLower.includes('boat') || qLower.includes('rescue') || qLower.includes('trapped')) {
      return {
        thinking: `Evaluating active distress beacons in ${activeRegion.name}... Detected 23 trapped civilians in Sector I-8 and Dhok Kala Khan with water level surging to 4.5ft... Evaluating asset travel times...`,
        text: `OPERATIONAL DIRECTIVE // ASSET ALLOCATION:\n\n1. DISPATCH BOAT ALPHA to Sector I-8 (Dhok Kala Khan perimeter). Reason: 18 civilians (including 4 children) trapped on rooftop; water depth critical (~1.4m).\n2. DISPATCH BOAT BRAVO to Commercial Market low-lying depression as secondary reserve.\n3. AVOID Faizabad underpass transit—corridor is impassable.\n\nRisk Assessment: Mission viability 92%. Proceed immediately before Lai crests.`,
        action: { label: 'Open Resource Dispatch Matrix', type: 'priority' }
      };
    }

    if (qLower.includes('hospital') || qLower.includes('divert') || qLower.includes('bed') || qLower.includes('holy family')) {
      return {
        thinking: `Scanning medical network capacity... Holy Family Hospital reporting 92% ICU saturation, 0 ventilators free... PIMS Trauma Center reports 47% capacity with 28 open beds... Shifa International operational...`,
        text: `MEDICAL TRIAGE DIRECTIVE // CASUALTY REDIRECTION:\n\n1. REDIRECT ALL INBOUND AMBULANCES away from Holy Family Hospital.\n2. DESIGNATE PIMS TRAUMA CENTER (G-8/3) as primary recipient: 28 ICU beds verified open, helipad operational.\n3. ROUTING INSTRUCTION: Direct Rescue 1122 vehicles via 9th Avenue Flyover (bypass submerged IJP Road).\n\nCasualty survivability index increased by +38% with immediate diversion.`,
        action: { label: 'Plot Safe Evacuation Route', type: 'route' }
      };
    }

    if (qLower.includes('route') || qLower.includes('evacuat') || qLower.includes('pims') || qLower.includes('faizabad')) {
      return {
        thinking: `Analyzing road network telemetry... Faizabad interchange completely submerged under 4.5ft flash flood... Murree Road bottlenecked... Calculating topological elevation bypass via 9th Avenue...`,
        text: `CORRIDOR NAVIGATION DIRECTIVE // 9TH AVE BYPASS:\n\n1. REJECT STANDARD GPS ROUTE: Direct Murree Road / Faizabad path has a 98% hazard probability (underwater current 2.4 m/s).\n2. EXECUTE AI SAFE DETOUR: Ingress via Sector I-9 -> elevated 9th Avenue flyover -> direct ramp to PIMS emergency wing.\n3. RISK REDUCTION: Bypasses 100% of flooded road blocks with an estimated transit time of 12.4 minutes.`,
        action: { label: 'Calculate & View Route on Map', type: 'route' }
      };
    }

    return {
      thinking: `Synthesizing real-time telemetry across ${activeRegion.name}... Processing weather data (${weather?.temperature || 25}°C, Precipitation: ${weather?.precipitation || 0.2} mm/h)... Evaluating ${reports.length} citizen distress beacons...`,
      text: `SITUATION BRIEFING // DG NDMA EXECUTIVE SUMMARY:\n\n• THREAT LEVEL: DEFCON 2 (Monsoon Critical)\n• HYDROLOGY: Nullah Lai Kattarian sensor at 15.0 ft (Danger margin: 5.0 ft before breach).\n• CASUALTIES & RESCUE: 23 stranded citizens identified; 2 high-priority extraction clusters in Sector I-8.\n• INFRASTRUCTURE: Faizabad artery impassable; 9th Avenue elevated flyover secured as green lifeline.\n• RECOMMENDATION: Maintain high-readiness boat dispatches and enforce automated hospital diversion to PIMS.`,
      action: { label: 'Open Priority Dispatch Matrix', type: 'priority' }
    };
  };

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isGenerating) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' PKT'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      const resp = generateQwenResponse(q);
      const qwenMsg: Message = {
        id: `q_${Date.now()}`,
        sender: 'qwen',
        text: resp.text,
        thinking: resp.thinking,
        action: resp.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' PKT'
      };
      setMessages(prev => [...prev, qwenMsg]);
      setIsGenerating(false);
    }, 900);
  };

  const handleActionClick = (action: { type: 'route' | 'priority' | 'sos' }) => {
    if (action.type === 'route') {
      calculateSafeRoute([33.6844, 73.0479]);
      onOpenSafeRouteModal();
      onClose();
    } else if (action.type === 'priority') {
      onOpenPriorityModal();
      onClose();
    } else if (action.type === 'sos') {
      onOpenCitizenModal();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full sm:w-[480px] h-full bg-[#080d1a] border-l border-orange-500/40 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col font-['Plus_Jakarta_Sans'] text-slate-100 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-orange-500/20 bg-gradient-to-r from-orange-950/70 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.4)]">
              <Bot className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-white tracking-wide">
                  COMMANDER QWEN
                </h3>
                <span className="text-[9px] font-mono bg-orange-500/20 text-orange-300 border border-orange-500/40 px-1.5 py-0.2 rounded font-bold">
                  QWEN-2.5 EOC AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Alibaba Cloud Model Studio • Live Ops</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Context Telemetry Ribbon */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1 text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry Stream: Active</span>
          </span>
          <span className="text-slate-400">
            Lai: <strong className="text-amber-300">15.0 ft</strong> | ICU: <strong className="text-rose-300">53%</strong>
          </span>
        </div>

        {/* Strategic Preset Prompt Chips */}
        <div className="p-3 bg-slate-900/40 border-b border-white/[0.06]">
          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>RAPID COMMAND DIRECTIVES (1-CLICK):</span>
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {STRATEGIC_PROMPTS.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sp.prompt)}
                disabled={isGenerating}
                className="text-left px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-orange-500/15 border border-white/[0.08] hover:border-orange-500/40 text-[11px] text-slate-300 hover:text-orange-200 transition-all truncate font-mono"
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Thread Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.sender === 'user' ? (
                <div className="bg-orange-600 text-white rounded-2xl rounded-tr-none px-3.5 py-2 text-xs max-w-[85%] shadow-md font-mono">
                  {msg.text}
                </div>
              ) : (
                <div className="space-y-2 max-w-[95%]">
                  {/* Thinking Block */}
                  {msg.thinking && (
                    <div className="bg-slate-950/80 border border-cyan-800/40 rounded-xl p-2.5 text-[11px] font-mono text-cyan-300 shadow-inner">
                      <div className="flex items-center gap-1.5 font-bold text-cyan-400 text-[10px] uppercase mb-1">
                        <Cpu className="w-3 h-3 animate-spin" />
                        <span>Qwen-2.5 Agentic Chain-of-Thought:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed italic opacity-90">
                        "{msg.thinking}"
                      </p>
                    </div>
                  )}

                  {/* Operational Directive Body */}
                  <div className="bg-slate-900/90 border border-orange-500/30 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-100 font-mono shadow-lg leading-relaxed whitespace-pre-line">
                    {msg.text}

                    {/* Interactive Action Button */}
                    {msg.action && (
                      <button
                        onClick={() => handleActionClick(msg.action!)}
                        className="mt-3 w-full py-2 px-3 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(234,88,12,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Navigation className="w-3.5 h-3.5 text-orange-400" />
                        <span>{msg.action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
              <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Generating Loading State */}
          {isGenerating && (
            <div className="flex flex-col items-start space-y-1.5">
              <div className="bg-slate-950/90 border border-orange-500/40 rounded-xl p-3 text-xs font-mono text-orange-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-orange-400" />
                <span>Qwen-2.5 synthesizing crisis directives...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/[0.08] bg-slate-950/90 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Commander Qwen (e.g., Where to divert ambulances?)..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isGenerating}
            className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white transition-all disabled:opacity-40 shadow-[0_0_12px_rgba(234,88,12,0.4)]"
            title="Transmit Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

