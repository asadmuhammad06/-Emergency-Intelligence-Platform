// Data: live city intelligence overlays from external APIs plus community report coordinates.
import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  useMap,
  Tooltip
} from 'react-leaflet';
import L from 'leaflet';
import { useCrisis } from '../context/CrisisContext';
import {
  AlertTriangle,
  Navigation,
  Send,
  Layers,
  Globe,
  CloudRain,
  Sun,
  CloudSun,
  CloudLightning,
  Wind,
  Droplets,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
  Shield,
  LifeBuoy,
  Radio
} from 'lucide-react';

// Custom High-Precision Tactical DivIcons
const createSosIcon = (headcount: number, severity: number) => {
  const isExtreme = severity >= 9;
  return L.divIcon({
    className: 'custom-sos-marker',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10 select-none cursor-pointer group">
        <span class="absolute w-9 h-9 rounded-full ${isExtreme ? 'bg-rose-500/40' : 'bg-amber-500/30'} animate-radar pointer-events-none"></span>
        <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-950 border-2 ${isExtreme ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.9)]' : 'border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]'} transition-transform group-hover:scale-110">
          <svg class="w-3.5 h-3.5 ${isExtreme ? 'text-rose-400' : 'text-amber-400'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
            <circle cx="12" cy="12" r="2"/>
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
            <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
          </svg>
        </div>
        ${headcount > 0 ? `
          <span class="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-mono font-black px-1 py-0.2 rounded-full border border-slate-900 shadow">
            ${headcount}
          </span>
        ` : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const createHospitalIcon = (capacity: number, status: string) => {
  const isOverloaded = capacity >= 85 || status === 'OVERLOADED';
  const strokeColor = isOverloaded ? '#f43f5e' : '#10b981';
  const shadowGlow = isOverloaded ? 'rgba(244,63,94,0.7)' : 'rgba(16,185,129,0.7)';

  return L.divIcon({
    className: 'custom-hospital-marker',
    html: `
      <div class="relative flex flex-col items-center select-none cursor-pointer group">
        <div class="w-8 h-8 rounded-lg bg-slate-950 border-2 flex items-center justify-center transition-transform group-hover:scale-110" style="border-color: ${strokeColor}; box-shadow: 0 0 12px ${shadowGlow};">
          <svg class="w-4 h-4" style="color: ${strokeColor};" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
          </svg>
          ${isOverloaded ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-900 animate-ping"></span>' : ''}
        </div>
        <div class="mt-0.5 px-1.5 py-0.2 bg-slate-950/95 border text-[9px] font-mono font-bold rounded shadow tracking-tight" style="border-color: ${strokeColor}80; color: ${strokeColor};">
          ${capacity}%
        </div>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 21],
    popupAnchor: [0, -21]
  });
};

const createRoadBlockIcon = () => {
  return L.divIcon({
    className: 'custom-roadblock-marker',
    html: `
      <div class="relative flex items-center justify-center w-7 h-7 select-none cursor-pointer group">
        <div class="w-6 h-6 rounded-md bg-slate-950 border-2 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] flex items-center justify-center text-amber-400 transition-transform group-hover:scale-110">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="2" rx="1"/>
            <path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/>
            <path d="M7 13v6"/>
            <path d="M17 13v6"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const createReliefHubIcon = () => {
  return L.divIcon({
    className: 'custom-hub-marker',
    html: `
      <div class="relative flex items-center justify-center w-7 h-7 select-none cursor-pointer group">
        <div class="w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] flex items-center justify-center text-cyan-400 transition-transform group-hover:scale-110">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const createRouteWaypointIcon = (label: string, isDest: boolean) => {
  return L.divIcon({
    className: 'custom-waypoint-marker',
    html: `
      <div class="flex items-center justify-center px-1.5 py-0.5 rounded-full ${isDest ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-cyan-500 text-slate-950 font-bold'} font-mono text-[9px] shadow-[0_0_12px_rgba(6,182,212,0.9)] border border-white">
        ${label}
      </div>
    `,
    iconSize: [36, 20],
    iconAnchor: [18, 10],
    popupAnchor: [0, -10]
  });
};

// Map Viewport Synchronizer
function MapController({ center, zoom, highlightedCoords }: { center: [number, number]; zoom: number; highlightedCoords: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (highlightedCoords) {
      map.flyTo(highlightedCoords, 14, { duration: 1.5 });
    } else if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }

  }, [center, zoom, highlightedCoords, map]);

  return null;
}

function MapSizeSynchronizer() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => map.invalidateSize({ pan: false, debounceMoveend: true });
    const frame = window.requestAnimationFrame(invalidate);
    window.addEventListener('resize', invalidate);
    map.on('zoomend moveend', invalidate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', invalidate);
      map.off('zoomend moveend', invalidate);
    };
  }, [map]);

  return null;
}

interface MapViewProps {
  onSelectRouteFromCoords?: (coords: [number, number]) => void;
  onDispatchToSector?: (coords: [number, number]) => void;
}

type MapThemeOption = 'tactical_dark' | 'carto_dark' | 'carto_voyager' | 'osm';

export const MapView: React.FC<MapViewProps> = ({ onDispatchToSector }) => {
  const {
    activeRegion,
    reports,
    hospitals,
    hazardZones,
    roadBlocks,
    reliefHubs,
    activeSafeRoute,
    highlightedCoords,
    activeCategoryFilter,
    layers,
    toggleLayer,
    calculateSafeRoute,
    weather,
    radar,
    weatherLoading,
    refreshWeather,
    simulatedMetrics
  } = useCrisis();

  // Default to Tactical Dark
  const [mapTheme, setMapTheme] = useState<MapThemeOption>('tactical_dark');
  const [isWeatherExpanded, setIsWeatherExpanded] = useState<boolean>(true);

    const currentTileConfig = useMemo(() => {
    // All free — no API key required
    if (mapTheme === 'tactical_dark') {
      return {
        key: 'tactical_dark',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        subdomains: '',
        minZoom: 1,
        maxZoom: 19,
      };
    }

    if (mapTheme === 'carto_voyager') {
      return {
        key: 'carto_voyager',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri',
        subdomains: '',
        minZoom: 1,
        maxZoom: 19,
      };
    }

    // OpenStreetMap (default)
    return {
      key: 'osm',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abc',
      minZoom: 1,
      maxZoom: 19,
    };
  }, [mapTheme]);

  const safeZoom = Math.min(19, Math.max(1, activeRegion.zoom));

  useEffect(() => {
    console.log('[MapView] active region center/zoom:', {
      city: activeRegion.name,
      lat: activeRegion.center[0],
      lon: activeRegion.center[1],
      zoom: safeZoom
    });
  }, [activeRegion, safeZoom]);

  // Filter reports according to activeCategoryFilter
  const filteredReports = useMemo(() => {
    if (activeCategoryFilter === 'ALL') return reports;
    return reports.filter(r => r.category === activeCategoryFilter);
  }, [reports, activeCategoryFilter]);

  return (
    <div className="relative isolate w-full h-full min-h-0 bg-[#080d1a] overflow-hidden">
      {/* Base Map Style Switcher - High-Tech CAD/GIS Segmented Pill */}


      <div className="map-toolbar absolute top-3 left-3 right-3 sm:right-auto z-[1000] bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-xl p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center gap-1 font-mono text-xs select-none overflow-x-auto">

        <div className="flex shrink-0 items-center gap-1.5 px-2 py-1 text-slate-400 border-r border-slate-800">

          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300">TILES</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMapTheme('tactical_dark')}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all flex items-center gap-1.5 ${
              mapTheme === 'tactical_dark'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]"></span>
            Tactical Dark
          </button>
          <button
            onClick={() => setMapTheme('osm')}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all flex items-center gap-1.5 ${
              mapTheme === 'osm'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Standard OSM
          </button>
          <button
            onClick={() => setMapTheme('carto_voyager')}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all flex items-center gap-1.5 ${
              mapTheme === 'carto_voyager'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Topographic
          </button>
        </div>
      </div>

      {/* Floating Layer Controls - High Density Tactical Toggle Matrix */}





      <div className="absolute top-[4.5rem] sm:top-4 right-3 sm:right-4 z-[1000] bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-xl p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-xs space-y-1 font-mono w-[min(200px,calc(100%-1.5rem))] select-none">
      
        <div className="flex items-center justify-between text-slate-400 font-bold px-1.5 pb-1.5 border-b border-slate-800 text-[10px] tracking-wider uppercase">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            TACTICAL OVERLAYS
          </span>
          <span className="text-[9px] text-cyan-400">SIMULATED</span>
        </div>

        <button
          onClick={() => toggleLayer('floods')}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-all ${
            layers.floods
              ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60'
              : 'text-slate-400 hover:bg-slate-900 border border-transparent opacity-60'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${layers.floods ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]' : 'bg-slate-600'}`}></span>
            Flood Inundation
          </span>
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/40">
            {hazardZones.length} <span className="text-[8px]">SIMULATED</span>
          </span>
        </button>

        <button
          onClick={() => toggleLayer('hospitals')}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-all ${
            layers.hospitals
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
              : 'text-slate-400 hover:bg-slate-900 border border-transparent opacity-60'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${layers.hospitals ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]' : 'bg-slate-600'}`}></span>
            Medical Facilities
          </span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/40">
            {hospitals.length} <span className="text-[8px]">SIMULATED</span>
          </span>
        </button>

        <button
          onClick={() => toggleLayer('roadBlocks')}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-all ${
            layers.roadBlocks
              ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
              : 'text-slate-400 hover:bg-slate-900 border border-transparent opacity-60'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${layers.roadBlocks ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]' : 'bg-slate-600'}`}></span>
            Road Blockades
          </span>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/40">
            {roadBlocks.length} <span className="text-[8px]">SIMULATED</span>
          </span>
        </button>

        <button
          onClick={() => toggleLayer('reliefHubs')}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-all ${
            layers.reliefHubs
              ? 'bg-sky-950/60 text-sky-300 border border-sky-800/60'
              : 'text-slate-400 hover:bg-slate-900 border border-transparent opacity-60'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${layers.reliefHubs ? 'bg-sky-400 shadow-[0_0_6px_rgba(14,165,233,0.8)]' : 'bg-slate-600'}`}></span>
            Relief & Water Depots
          </span>
          <span className="text-[10px] font-bold text-sky-400 bg-sky-950/80 px-1.5 py-0.2 rounded border border-sky-800/40">
            {reliefHubs.length} <span className="text-[8px]">SIMULATED</span>
          </span>
        </button>

        <button
          onClick={() => toggleLayer('sosPins')}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-all ${
            layers.sosPins
              ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
              : 'text-slate-400 hover:bg-slate-900 border border-transparent opacity-60'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${layers.sosPins ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]' : 'bg-slate-600'}`}></span>
            Citizen SOS Signals
          </span>
          <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-1.5 py-0.2 rounded border border-rose-800/40">
            {simulatedMetrics.activeSos} <span className="text-[8px]">SIMULATED</span>
          </span>
        </button>
      </div>

      {/* Floating Tactical Hydro-Meteo Intelligence Panel — positioned bottom-LEFT to avoid overlap with right-side layer toggles */}
      <div className="absolute bottom-5 left-4 z-30 font-mono select-none max-h-[calc(100%-4rem)] overflow-y-auto">
        {!isWeatherExpanded ? (
          <button
            onClick={() => setIsWeatherExpanded(true)}
            className="bg-slate-900/95 hover:bg-slate-800 backdrop-blur-md border border-cyan-800/80 text-cyan-300 px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95"
            title="Open Live Hydro-Meteo Radar Telemetry"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            {weather ? (
              <>
                <span>{weather.precipitation > 0 ? '🌧️' : '🌤️'}</span>
                <span className="text-white">{weather.temperature}°C</span>
                <span className="text-slate-400 text-[11px]">| 💨 {weather.windSpeed} km/h</span>
              </>
            ) : (
              <span>🛰️ Meteo Radar</span>
            )}
            <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>
        ) : (
          <div className="w-80 bg-slate-950/95 backdrop-blur-md border border-cyan-900/70 rounded-2xl p-3.5 shadow-[0_0_30px_rgba(0,0,0,0.8)] text-xs text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-bold text-cyan-300 tracking-wider uppercase text-[11px]">
                  HYDRO-METEO RADAR
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => refreshWeather()}
                  title="Refresh Telemetry"
                  disabled={weatherLoading}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
                <button
                  onClick={() => setIsWeatherExpanded(false)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
                  title="Minimize Panel"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Region & Time */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 px-0.5">
              <span className="truncate font-semibold text-slate-300">📍 {activeRegion.name}</span>
              <span>{weather?.time ? `Sync: ${weather.time.slice(-5)}` : 'Live Telemetry'}</span>
            </div>

            {weatherLoading && !weather ? (
              <div className="py-6 text-center text-slate-500 text-xs animate-pulse">
                Establishing Satellite Weather Link...
              </div>
            ) : weather ? (
              <div className="space-y-2.5">
                {/* Primary Temp & Condition Banner */}
                <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-700/40 text-cyan-400">
                      {weather.weatherCode >= 95 ? (
                        <CloudLightning className="w-6 h-6 text-yellow-400 animate-bounce" />
                      ) : weather.precipitation > 0 || weather.weatherCode >= 51 ? (
                        <CloudRain className="w-6 h-6 text-sky-400" />
                      ) : weather.weatherCode >= 1 && weather.weatherCode <= 3 ? (
                        <CloudSun className="w-6 h-6 text-sky-200" />
                      ) : (
                        <Sun className="w-6 h-6 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xl font-black text-white tracking-tight flex items-baseline gap-1">
                        {weather.temperature}
                        <span className="text-sm font-bold text-cyan-400">°C</span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-semibold truncate max-w-[130px]">
                        {weather.condition || 'Clear Sky'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Precipitation</div>
                    <div className={`font-bold text-sm ${weather.precipitation > 0 ? 'text-sky-300' : 'text-slate-300'}`}>
                      {weather.precipitation} <span className="text-[10px] font-normal text-slate-400">mm/h</span>
                    </div>
                  </div>
                </div>

                {/* Atmospheric Sensor Grid */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-slate-900/60 border border-slate-800/70 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Humidity</span>
                    <span className="font-bold text-slate-200 text-xs">{weather.humidity}%</span>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800/70 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Wind</span>
                    <span className="font-bold text-slate-200 text-xs">{weather.windSpeed} <span className="text-[9px] font-normal text-slate-400">km/h</span></span>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800/70 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Gusts</span>
                    <span className={`font-bold text-xs ${weather.windGusts >= 35 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {weather.windGusts} <span className="text-[9px] font-normal text-slate-400">km/h</span>
                    </span>
                  </div>
                </div>

                {/* Tactical EOC Advisories */}
                <div className="space-y-1.5 pt-1 border-t border-slate-900">
                  <div className="flex items-center justify-between text-[10px] bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1">
                      🚁 Air Rescue Feasibility:
                    </span>
                    <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                      weather.flightFeasibility === 'RESTRICTED'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : weather.flightFeasibility === 'CAUTION'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {weather.flightFeasibility || 'CLEAR'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1">
                      🌊 Flood Runoff Risk:
                    </span>
                    <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                      weather.floodRiskLevel === 'HIGH' || weather.isHeavyRain
                        ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                        : weather.floodRiskLevel === 'MODERATE'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {weather.isHeavyRain ? 'CRITICAL INUNDATION' : (weather.floodRiskLevel || 'LOW')}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-slate-500 text-xs">
                Weather data unavailable
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Tactical Map */}
      <MapContainer
        center={activeRegion.center}
        zoom={safeZoom}
        minZoom={1}
        maxZoom={19}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ background: '#090d16' }}
      >
        <MapSizeSynchronizer />
        <MapController
          center={activeRegion.center}
          zoom={safeZoom}
          highlightedCoords={highlightedCoords}
        />

        {/* Dynamic Watermark-free Tile Layer — subdomains always defined */}
        <TileLayer
          key={currentTileConfig.key}
          attribution={currentTileConfig.attribution}
          url={currentTileConfig.url}
          subdomains={currentTileConfig.subdomains}
          minZoom={currentTileConfig.minZoom}
          maxZoom={currentTileConfig.maxZoom}
          zIndex={1}
        />
        {radar && (
          <TileLayer
            key={`radar-${radar.frameTimestamp}`}
            url={radar.tileUrl}
            opacity={0.35}
            zIndex={2}
            minZoom={1}
            maxZoom={10}
            attribution="Radar &copy; RainViewer"
          />
        )}

        {/* 1. Flood Inundation Polygons */}
        {layers.floods && hazardZones.map(zone => (
          <Polygon
            key={zone.id}
            positions={zone.polygon}
            pathOptions={{
              color: zone.severity === 'CRITICAL' ? '#ef4444' : '#06b6d4',
              fillColor: zone.severity === 'CRITICAL' ? '#dc2626' : '#0284c7',
              fillOpacity: 0.35,
              weight: 2.5,
              dashArray: '6, 6'
            }}
          >
            <Tooltip direction="center" permanent={false} opacity={0.9} className="custom-leaflet-tooltip">
              <div className="font-mono text-xs p-1 bg-slate-900 text-white rounded">
                <p className="font-bold text-cyan-300">{zone.name}</p>
                <p className="text-[11px] text-slate-300">Water Depth: ~{zone.waterDepthMeters}m ({zone.status})</p>
              </div>
            </Tooltip>
          </Polygon>
        ))}

        {/* 2. Hospital Markers */}
        {layers.hospitals && hospitals.map(hosp => (
          <Marker
            key={hosp.id}
            position={hosp.coords}
            icon={createHospitalIcon(hosp.capacity, hosp.status)}
          >
            <Popup className="custom-popup">
              <div className="p-3 bg-slate-950/95 text-slate-100 max-w-xs font-['Plus_Jakarta_Sans']">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-white tracking-tight">{hosp.name}</h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                      <MapPin className="w-2.5 h-2.5 text-cyan-400" /> {hosp.location}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    hosp.capacity >= 85
                      ? 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                  }`}>
                    {hosp.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs mb-3 font-mono">
                  <div className="bg-slate-900/90 border border-slate-800/80 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Bed Load</span>
                    <span className="font-bold text-white text-xs">{hosp.occupiedBeds} / {hosp.totalBeds} ({hosp.capacity}%)</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800/80 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">ICU Free</span>
                    <span className="font-bold text-emerald-400 text-xs">{hosp.icuAvailable} Beds</span>
                  </div>
                  <div className="col-span-2 bg-slate-900/60 border border-slate-800/60 px-2 py-1.5 rounded-lg flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Power Backup:</span>
                    <span className="text-[10px] font-semibold text-cyan-300">{hosp.powerBackup}</span>
                  </div>
                </div>

                <button
                  onClick={() => calculateSafeRoute(undefined, hosp.id)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono tracking-wide flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  ROUTE AMBULANCES HERE
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 3. Road Blockade Markers */}
        {layers.roadBlocks && roadBlocks.map(block => (
          <Marker
            key={block.id}
            position={block.coords}
            icon={createRoadBlockIcon()}
          >
            <Popup className="custom-popup">
              <div className="p-3 bg-slate-950/95 text-slate-100 max-w-xs font-['Plus_Jakarta_Sans']">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-bold border-b border-slate-800 pb-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>CORRIDOR BLOCKED</span>
                </div>
                <h4 className="font-bold text-sm text-white">{block.roadName}</h4>
                <p className="text-xs text-rose-300 font-mono mt-1 bg-rose-950/40 p-1.5 rounded border border-rose-900/40">
                  {block.reason}
                </p>
                <div className="mt-2 text-xs bg-amber-950/30 border border-amber-900/50 p-2 rounded-lg font-mono">
                  <span className="text-amber-400 text-[10px] block font-bold">RECOMMENDED DETOUR:</span>
                  <span className="text-slate-200 text-[11px]">{block.detourRecommended}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 4. Relief & Water Hubs */}
        {layers.reliefHubs && reliefHubs.map(hub => (
          <Marker
            key={hub.id}
            position={hub.coords}
            icon={createReliefHubIcon()}
          >
            <Popup className="custom-popup">
              <div className="p-3 bg-slate-950/95 text-slate-100 max-w-xs font-['Plus_Jakarta_Sans']">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                  <h4 className="font-bold text-sm text-cyan-300">{hub.name}</h4>
                  <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded">
                    {hub.managedBy}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1"><Droplets className="w-3 h-3 text-cyan-400" /> Potable Water</span>
                    <strong className="text-cyan-300">{(hub.drinkingWaterLiters ?? 0).toLocaleString()} L</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> Food Packs</span>
                    <strong className="text-emerald-300">{(hub.foodPackets ?? 0).toLocaleString()} Packs</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1"><LifeBuoy className="w-3 h-3 text-amber-400" /> Jet Boats</span>
                    <strong className="text-amber-300">{hub.rescueBoats ?? 0} Units</strong>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 5. Citizen SOS Distress Pins */}
        {layers.sosPins && filteredReports.map(rep => (
          <Marker
            key={rep.id}
            position={rep.coords}
            icon={createSosIcon(rep.headcount, rep.severity)}
          >
            <Popup className="custom-popup">
              <div className="p-3 bg-slate-950/95 text-slate-100 max-w-xs font-['Plus_Jakarta_Sans']">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                  <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    {rep.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-rose-950/80 text-rose-300 border border-rose-800/80">
                    SEV {rep.severity}/10
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-medium my-2 bg-slate-900/90 p-2 rounded-lg border border-slate-800/80 leading-relaxed italic">
                  "{rep.rawText}"
                </p>

                <div className="text-xs font-mono space-y-1 mb-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{rep.locationName}</span>
                  </div>
                  {rep.headcount > 0 && (
                    <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                      <Users className="w-3 h-3 text-rose-400 shrink-0" />
                      <span>{rep.headcount} Trapped Civilians</span>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                    Lng: {rep.coords[1].toFixed(4)} | Lat: {rep.coords[0].toFixed(4)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => calculateSafeRoute(rep.coords)}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <Navigation className="w-3 h-3" />
                    Safe Route
                  </button>
                  <button
                    onClick={() => {
                      if (onDispatchToSector) onDispatchToSector(rep.coords);
                    }}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-all"
                  >
                    <Send className="w-3 h-3" />
                    Dispatch
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 6. Active Safe Evacuation & Detour Polyline */}
        {layers.safeRouteOverlay && activeSafeRoute && (
          <>
            {/* Direct Blocked Path (Red Dashed Line) */}
            {activeSafeRoute.directPath && activeSafeRoute.directPath.length > 0 && (
              <Polyline
                positions={activeSafeRoute.directPath}
                pathOptions={{
                  color: '#ef4444',
                  weight: 3.5,
                  dashArray: '8, 8',
                  opacity: 0.8
                }}
              >
                <Tooltip sticky>
                  <span className="font-mono text-xs text-red-600 font-bold">
                    ❌ DIRECT PATH (BLOCKED BY 4.5FT FLOOD AT FAIZABAD)
                  </span>
                </Tooltip>
              </Polyline>
            )}

            {/* Calculated Verified Safe Detour (Glowing Emerald Polyline) */}
            {activeSafeRoute.safePath && activeSafeRoute.safePath.length > 0 && (
              <Polyline
                positions={activeSafeRoute.safePath}
                pathOptions={{
                  color: '#10b981',
                  weight: 6,
                  opacity: 0.95
                }}
              >
                <Tooltip sticky>
                  <span className="font-mono text-xs text-emerald-600 font-bold">
                    ✅ VERIFIED SAFE DETOUR ROUTE (Via 9th Ave Flyover &bull; {activeSafeRoute.safeDistanceKm} km)
                  </span>
                </Tooltip>
              </Polyline>
            )}

            {/* Origin & Destination Waypoints */}
            {activeSafeRoute.origin?.coords && (
              <Marker
                position={activeSafeRoute.origin.coords}
                icon={createRouteWaypointIcon("START", false)}
              />
            )}
            {activeSafeRoute.destination?.coords && (
              <Marker
                position={activeSafeRoute.destination.coords}
                icon={createRouteWaypointIcon("END", true)}
              />
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
};
