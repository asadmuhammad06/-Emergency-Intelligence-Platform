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
  ChevronUp
} from 'lucide-react';

// Custom DivIcons for Leaflet
const createSosIcon = (headcount: number, severity: number) => {
  return L.divIcon({
    className: 'custom-sos-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-2 bg-red-500/30 rounded-full animate-ping"></div>
        <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-[0_0_12px_rgba(239,68,68,0.8)] flex items-center justify-center text-white font-bold text-xs">
          ${headcount > 0 ? headcount : '🆘'}
        </div>
        ${severity >= 9 ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-black"></span>' : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const createHospitalIcon = (capacity: number, status: string) => {
  const isOverloaded = capacity >= 85 || status === 'OVERLOADED';
  const bgColor = isOverloaded ? 'bg-rose-600' : 'bg-emerald-600';
  const borderColor = isOverloaded ? 'border-rose-300' : 'border-emerald-300';
  const shadowClass = isOverloaded ? 'shadow-[0_0_10px_rgba(244,63,94,0.7)]' : 'shadow-[0_0_10px_rgba(16,185,129,0.7)]';

  return L.divIcon({
    className: 'custom-hospital-marker',
    html: `
      <div class="relative flex flex-col items-center">
        <div class="w-8 h-8 rounded-lg ${bgColor} border-2 ${borderColor} ${shadowClass} flex items-center justify-center text-white font-black text-xs">
          🏥
        </div>
        <div class="bg-slate-900/90 text-[10px] font-mono font-bold px-1 rounded border border-slate-700 text-white mt-0.5 whitespace-nowrap">
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
      <div class="w-7 h-7 rounded-md bg-amber-500 border-2 border-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.8)] flex items-center justify-center text-black font-extrabold text-xs">
        🚧
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
      <div class="w-7 h-7 rounded-full bg-cyan-600 border-2 border-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.8)] flex items-center justify-center text-white font-bold text-xs">
        💧
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
      <div class="w-6 h-6 rounded-full ${isDest ? 'bg-emerald-500' : 'bg-cyan-500'} border-2 border-white shadow-[0_0_10px_rgba(6,182,212,0.9)] flex items-center justify-center text-white font-black text-[10px]">
        ${label}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
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
    weatherLoading,
    refreshWeather
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
        maxZoom: 16,
      };
    }

    if (mapTheme === 'carto_voyager') {
      return {
        key: 'carto_voyager',
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by HOT',
        subdomains: 'abc',
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
      maxZoom: 19,
    };
  }, [mapTheme]);

  // Filter reports according to activeCategoryFilter
  const filteredReports = useMemo(() => {
    if (activeCategoryFilter === 'ALL') return reports;
    return reports.filter(r => r.category === activeCategoryFilter);
  }, [reports, activeCategoryFilter]);

  return (
    <div className="relative w-full h-full bg-[#080d1a] overflow-hidden">
      {/* Base Map Style Switcher */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 shadow-xl text-xs space-y-1.5 font-mono">
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1 px-1">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-200">BASE MAP STYLE</span>
        </div>

        {/* Theme buttons */}
        <div className="flex items-center gap-1 pt-0.5">
          <button
            onClick={() => setMapTheme('tactical_dark')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              mapTheme === 'tactical_dark'
                ? 'bg-cyan-600 text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🌙 Tactical Dark
          </button>
          <button
            onClick={() => setMapTheme('osm')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              mapTheme === 'osm'
                ? 'bg-cyan-600 text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🗺️ OpenStreetMap
          </button>
          <button
            onClick={() => setMapTheme('carto_voyager')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              mapTheme === 'carto_voyager'
                ? 'bg-cyan-600 text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🧭 CARTO Voyager
          </button>
        </div>
      </div>

      {/* Floating Layer Controls */}
      <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 shadow-xl text-xs space-y-1.5 font-mono">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold px-1 mb-1 border-b border-slate-700 pb-1">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>MAP LAYERS</span>
        </div>

        <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer px-1 py-0.5 rounded hover:bg-slate-800">
          <input
            type="checkbox"
            checked={layers.floods}
            onChange={() => toggleLayer('floods')}
            className="rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-0"
          />
          <span className="flex items-center gap-1.5">🌊 Flood Polygons</span>
        </label>

        <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer px-1 py-0.5 rounded hover:bg-slate-800">
          <input
            type="checkbox"
            checked={layers.hospitals}
            onChange={() => toggleLayer('hospitals')}
            className="rounded bg-slate-800 border-slate-600 text-emerald-500 focus:ring-0"
          />
          <span className="flex items-center gap-1.5">🏥 Hospitals & Beds</span>
        </label>

        <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer px-1 py-0.5 rounded hover:bg-slate-800">
          <input
            type="checkbox"
            checked={layers.roadBlocks}
            onChange={() => toggleLayer('roadBlocks')}
            className="rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-0"
          />
          <span className="flex items-center gap-1.5">🚧 Road Obstacles</span>
        </label>

        <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer px-1 py-0.5 rounded hover:bg-slate-800">
          <input
            type="checkbox"
            checked={layers.reliefHubs}
            onChange={() => toggleLayer('reliefHubs')}
            className="rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-0"
          />
          <span className="flex items-center gap-1.5">💧 Relief & Water Hubs</span>
        </label>

        <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer px-1 py-0.5 rounded hover:bg-slate-800">
          <input
            type="checkbox"
            checked={layers.sosPins}
            onChange={() => toggleLayer('sosPins')}
            className="rounded bg-slate-800 border-slate-600 text-red-500 focus:ring-0"
          />
          <span className="flex items-center gap-1.5">🆘 SOS Distress Pins</span>
        </label>
      </div>

      {/* Floating Tactical Hydro-Meteo Intelligence Panel */}
      <div className="absolute bottom-6 right-6 z-[400] font-mono select-none">
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
        zoom={activeRegion.zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ background: '#090d16' }}
      >
        <MapController
          center={activeRegion.center}
          zoom={activeRegion.zoom}
          highlightedCoords={highlightedCoords}
        />

        {/* Dynamic Watermark-free Tile Layer — subdomains always defined */}
        <TileLayer
          key={currentTileConfig.key}
          attribution={currentTileConfig.attribution}
          url={currentTileConfig.url}
          subdomains={currentTileConfig.subdomains}
          maxZoom={currentTileConfig.maxZoom}
        />

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
              <div className="p-2 font-['Plus_Jakarta_Sans'] text-slate-900 max-w-xs">
                <div className="flex items-center justify-between gap-2 border-b pb-1 mb-1">
                  <h4 className="font-bold text-sm text-slate-900">{hosp.name}</h4>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hosp.capacity >= 85 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {hosp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2">{hosp.location}</p>

                <div className="grid grid-cols-2 gap-1.5 text-xs bg-slate-100 p-2 rounded mb-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Bed Capacity</span>
                    <span className="font-bold">{hosp.occupiedBeds} / {hosp.totalBeds} ({hosp.capacity}%)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ICU Beds Free</span>
                    <span className="font-bold text-emerald-700">{hosp.icuAvailable} Beds</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[10px]">Power Backup</span>
                    <span className="font-medium text-slate-800">{hosp.powerBackup}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => calculateSafeRoute(undefined, hosp.id)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    Route Ambulances Here
                  </button>
                </div>
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
              <div className="p-2 font-['Plus_Jakarta_Sans'] text-slate-900 max-w-xs">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ROAD CLOSURE / HAZARD</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{block.roadName}</h4>
                <p className="text-xs text-red-600 font-medium mt-1">{block.reason}</p>
                <div className="mt-2 text-xs bg-amber-50 border border-amber-200 p-1.5 rounded">
                  <span className="text-slate-700 font-bold block text-[10px]">RECOMMENDED DETOUR:</span>
                  <span className="text-slate-800">{block.detourRecommended}</span>
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
              <div className="p-2 text-slate-900 max-w-xs">
                <h4 className="font-bold text-sm text-cyan-800">{hub.name}</h4>
                <p className="text-[11px] text-slate-500 mb-2">Managed by: {hub.managedBy}</p>
                <div className="space-y-1 text-xs bg-cyan-50 p-2 rounded border border-cyan-100">
                  <p>💧 Clean Water: <strong>{(hub.drinkingWaterLiters ?? 0).toLocaleString()} Liters</strong></p>
                  <p>🍱 Food Packets: <strong>{(hub.foodPackets ?? 0).toLocaleString()} Packs</strong></p>
                  <p>🚤 Rescue Jet-Boats: <strong>{hub.rescueBoats ?? 0} Boats</strong></p>
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
              <div className="p-2 text-slate-900 max-w-xs">
                <div className="flex items-center justify-between border-b pb-1 mb-1">
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {rep.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-200 px-1 py-0.5 rounded font-bold">
                    Severity {rep.severity}/10
                  </span>
                </div>

                <p className="text-xs text-slate-800 italic font-medium my-1.5 bg-slate-100 p-1.5 rounded">
                  "{rep.rawText}"
                </p>

                <div className="text-xs space-y-1 mb-2">
                  <p className="text-slate-600">📍 Location: <strong>{rep.locationName}</strong></p>
                  {rep.headcount > 0 && (
                    <p className="text-red-700 font-bold">👥 Trapped Citizens: {rep.headcount}</p>
                  )}
                  <p className="text-slate-500 text-[11px]">🌐 Detected: {rep.languageDetected || 'Urdu/English'}</p>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => calculateSafeRoute(rep.coords)}
                    className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    Safe Route
                  </button>
                  <button
                    onClick={() => {
                      if (onDispatchToSector) onDispatchToSector(rep.coords);
                    }}
                    className="flex-1 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1"
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
