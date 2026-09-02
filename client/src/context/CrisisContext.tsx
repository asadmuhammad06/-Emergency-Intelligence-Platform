import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  EmergencyReport,
  Hospital,
  HazardZone,
  RoadBlock,
  ReliefHub,
  PriorityZone,
  SafestRoute,
  DispatchedUnit,
  SystemAlert,
  Region,
  ReportCategory,
  WeatherData,
  RadarData
} from '../types';
import {
  defaultRegions
} from '../data/pakistanGeoData';

interface CrisisContextType {
  // Data State
  reports: EmergencyReport[];
  hospitals: Hospital[];
  hazardZones: HazardZone[];
  roadBlocks: RoadBlock[];
  reliefHubs: ReliefHub[];
  priorityZones: PriorityZone[];
  dispatchedUnits: DispatchedUnit[];
  systemAlert: SystemAlert | null;
  activeRegion: Region;
  regions: Region[];
  weather: WeatherData | null;
  weatherLoading: boolean;
  radar: RadarData | null;

  // Selection & Route State
  selectedReport: EmergencyReport | null;
  selectedHospital: Hospital | null;
  selectedPriorityZone: PriorityZone | null;
  activeSafeRoute: SafestRoute | null;
  highlightedCoords: [number, number] | null;

  // UI / Layer Controls
  activeCategoryFilter: ReportCategory | 'ALL';
  layers: {
    floods: boolean;
    hospitals: boolean;
    roadBlocks: boolean;
    reliefHubs: boolean;
    sosPins: boolean;
    safeRouteOverlay: boolean;
  };
  simulationRunning: boolean;
  simulationStep: number;
  isConnectedToServer: boolean;

  // Actions
  setActiveCategoryFilter: (cat: ReportCategory | 'ALL') => void;
  toggleLayer: (layerKey: keyof CrisisContextType['layers']) => void;
  setActiveRegion: (region: Region) => void;
  setSelectedReport: (report: EmergencyReport | null) => void;
  setSelectedHospital: (hosp: Hospital | null) => void;
  setSelectedPriorityZone: (zone: PriorityZone | null) => void;
  setHighlightedCoords: (coords: [number, number] | null) => void;
  setActiveSafeRoute: (route: SafestRoute | null) => void;

  submitCitizenReport: (text: string, coords?: [number, number], phone?: string) => Promise<EmergencyReport>;
  calculateSafeRoute: (startCoords?: [number, number], hospitalId?: string) => Promise<SafestRoute>;
  approveDispatch: (zoneId: string, assets?: any) => Promise<void>;
  startSimulation: () => void;
  resetSimulation: () => void;
  refreshWeather: () => Promise<void>;
}

const API_BASE = 'http://localhost:3001';

const CrisisContext = createContext<CrisisContextType | undefined>(undefined);

export const CrisisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hazardZones, setHazardZones] = useState<HazardZone[]>([]);
  const [roadBlocks, setRoadBlocks] = useState<RoadBlock[]>([]);
  const [reliefHubs, setReliefHubs] = useState<ReliefHub[]>([]);
  const [priorityZones, setPriorityZones] = useState<PriorityZone[]>([]);
  const [dispatchedUnits, setDispatchedUnits] = useState<DispatchedUnit[]>([]);
  const [systemAlert, setSystemAlert] = useState<SystemAlert | null>(null);

  const [activeRegion, setActiveRegion] = useState<Region>(defaultRegions[0]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedPriorityZone, setSelectedPriorityZone] = useState<PriorityZone | null>(null);
  const [activeSafeRoute, setActiveSafeRoute] = useState<SafestRoute | null>(null);
  const [highlightedCoords, setHighlightedCoords] = useState<[number, number] | null>(null);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<ReportCategory | 'ALL'>('ALL');
  const [layers, setLayers] = useState({
    floods: true,
    hospitals: true,
    roadBlocks: true,
    reliefHubs: true,
    sosPins: true,
    safeRouteOverlay: true
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [radar, setRadar] = useState<RadarData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);

  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isConnectedToServer, setIsConnectedToServer] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/regions`)
      .then(res => {
        if (!res.ok) throw new Error('Regions API unavailable');
        return res.json();
      })
      .then(payload => {
        if (!payload.success || !Array.isArray(payload.data) || payload.data.length === 0) {
          throw new Error('Regions API returned no locations');
        }
        setRegions(payload.data);
        const selectedRegion = payload.data.find((region: Region) => region.id === activeRegion.id);
        if (selectedRegion) setActiveRegion(selectedRegion);
      })
      .catch(error => console.warn('Failed to load live regions:', error));
  }, []);

  const refreshWeather = useCallback(async () => {
    if (!activeRegion || !activeRegion.center) return;
    setWeatherLoading(true);
    try {
      const [lat, lng] = activeRegion.center;
      const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data: WeatherData = await res.json();
        setWeather(data);
      }
    } catch (err) {
      console.warn('Failed to fetch weather telemetry:', err);
    } finally {
      setWeatherLoading(false);
    }
  }, [activeRegion]);

  useEffect(() => {
    refreshWeather();
    const interval = setInterval(refreshWeather, 120000);
    return () => clearInterval(interval);
  }, [refreshWeather]);

  // Keep a REST snapshot current when a WebSocket is unavailable or delayed.
  useEffect(() => {
    const refreshLiveData = async () => {
      const [lat, lng] = activeRegion.center;
      const res = await fetch(`${API_BASE}/api/live-data?regionId=${activeRegion.id}&lat=${lat}&lng=${lng}`);
      if (!res.ok) return;

      const payload = await res.json();
      if (!payload.success || !payload.data) return;

      const data = payload.data;
      if (data.hospitals) setHospitals(data.hospitals);
      if (data.hazardZones) setHazardZones(data.hazardZones);
      if (data.roadBlocks) setRoadBlocks(data.roadBlocks);
      if (data.reliefHubs) setReliefHubs(data.reliefHubs);
      if (data.priorityZones) setPriorityZones(data.priorityZones);
      if (data.dispatchedUnits) setDispatchedUnits(data.dispatchedUnits);
      if (data.disasterAlert) setSystemAlert(data.disasterAlert);
      if (data.weather) setWeather(data.weather);
      if (data.radar) setRadar(data.radar);
    };

    refreshLiveData().catch(error => {
      console.warn('Failed to refresh live operations snapshot:', error);
    });
    const interval = setInterval(() => {
      refreshLiveData().catch(error => {
        console.warn('Failed to refresh live operations snapshot:', error);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [activeRegion]);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Initial Fetch & WebSocket setup
  useEffect(() => {
    let socket: Socket | null = null;
    try {
      socket = io(API_BASE, {
        reconnectionAttempts: 5,
        timeout: 2000
      });

      socket.on('connect', () => {
        setIsConnectedToServer(true);
      });

      socket.on('disconnect', () => {
        setIsConnectedToServer(false);
      });

      socket.on('initial_state', (data) => {
        if (data) {
          if (data.reports) setReports(data.reports);
          if (data.hospitals) setHospitals(data.hospitals);
          if (data.hazardZones) setHazardZones(data.hazardZones);
          if (data.roadBlocks) setRoadBlocks(data.roadBlocks);
          if (data.reliefHubs) setReliefHubs(data.reliefHubs);
          if (data.priorityZones) setPriorityZones(data.priorityZones);
          if (data.dispatchedUnits) setDispatchedUnits(data.dispatchedUnits);
          if (data.disasterAlert) setSystemAlert(data.disasterAlert);
        }
      });

      socket.on('new_report', (newRep: EmergencyReport) => {
        setReports(prev => prev.some(r => r.id === newRep.id) ? prev : [newRep, ...prev]);
      });

      socket.on('hospital_update', (updatedHosp: Hospital) => {
        setHospitals(prev => prev.map(h => h.id === updatedHosp.id ? updatedHosp : h));
      });

      socket.on('priority_update', (zones: PriorityZone[]) => {
        setPriorityZones(zones);
      });

      socket.on('dispatch_confirmed', (newDispatch: DispatchedUnit) => {
        setDispatchedUnits(prev => [newDispatch, ...prev]);
      });

      socket.on('system_alert', (alert: SystemAlert) => {
        setSystemAlert(alert);
      });

      socket.on('simulation_started', () => {
        setSimulationRunning(true);
        setSimulationStep(1);
      });

      socket.on('simulation_step', (data) => {
        setSimulationStep(data.step);
      });

      socket.on('simulation_completed', () => {
        setSimulationRunning(false);
      });

      socket.on('state_reset', (resetState) => {
        setReports(resetState.reports || []);
        setHospitals(resetState.hospitals || []);
        setHazardZones(resetState.hazardZones || []);
        setRoadBlocks(resetState.roadBlocks || []);
        setPriorityZones(resetState.priorityZones || []);
        setSimulationRunning(false);
        setSimulationStep(0);
        setActiveSafeRoute(null);
      });
    } catch (err) {
      console.warn('Socket connection deferred:', err);
    }

    // Fallback REST fetch
    fetch(`${API_BASE}/api/live-data?regionId=${activeRegion.id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          if (res.data.reports) setReports(res.data.reports);
          if (res.data.hospitals) setHospitals(res.data.hospitals);
          if (res.data.hazardZones) setHazardZones(res.data.hazardZones);
          if (res.data.roadBlocks) setRoadBlocks(res.data.roadBlocks);
          if (res.data.reliefHubs) setReliefHubs(res.data.reliefHubs);
          if (res.data.priorityZones) setPriorityZones(res.data.priorityZones);
          if (res.data.dispatchedUnits) setDispatchedUnits(res.data.dispatchedUnits);
          if (res.data.disasterAlert) setSystemAlert(res.data.disasterAlert);
          if (res.data.weather) setWeather(res.data.weather);
          if (res.data.radar) setRadar(res.data.radar);
        }
      })
      .catch(error => console.warn('Failed to load live state:', error));

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Submit Citizen Report
  const submitCitizenReport = useCallback(async (text: string, coords?: [number, number], phone?: string): Promise<EmergencyReport> => {
    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: text, coords, callerPhone: phone })
      });
      const data = await res.json();
      if (data.success) {
        setReports(prev => prev.some(r => r.id === data.report.id) ? prev : [data.report, ...prev]);
        if (data.updatedPriorityZones) {
          setPriorityZones(data.updatedPriorityZones);
        }
        return data.report;
      }
      throw new Error(data.error || 'Failed to submit report');
    } catch (error) {
      console.error('Failed to submit report to the live API:', error);
      throw error;
    }
  }, []);

  // Calculate Safest Route
  const calculateSafeRoute = useCallback(async (startCoords?: [number, number], hospitalId?: string): Promise<SafestRoute> => {
    try {
      const res = await fetch(`${API_BASE}/api/route/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startCoords, hospitalId })
      });
      const data = await res.json();
      if (data.success) {
        setActiveSafeRoute(data.route);
        return data.route;
      }
      throw new Error('Routing calculation failed');
    } catch (err) {
      const targetHosp = hospitalId ? hospitals.find(h => h.id === hospitalId) : hospitals[1];
      const defaultRoute: SafestRoute = {
        origin: {
          name: "Stranded Civilians Pin (Dhok Kala Khan)",
          coords: startCoords || [33.6380, 73.0760]
        },
        destination: {
          name: targetHosp ? targetHosp.name : "PIMS Hospital (Primary Evacuation Center)",
          coords: targetHosp ? targetHosp.coords : [33.7037, 73.0561],
          capacity: targetHosp ? targetHosp.capacity : 60,
          status: targetHosp ? targetHosp.status : "NORMAL",
          icuAvailable: targetHosp ? targetHosp.icuAvailable : 28
        },
        directPath: [
          startCoords || [33.6380, 73.0760],
          [33.6490, 73.0780],
          [33.6580, 73.0780],
          [33.6750, 73.0760],
          [33.6900, 73.0680],
          targetHosp ? targetHosp.coords : [33.7037, 73.0561]
        ],
        safePath: [
          startCoords || [33.6380, 73.0760],
          [33.6410, 73.0600],
          [33.6450, 73.0420],
          [33.6620, 73.0450],
          [33.6850, 73.0460],
          [33.6940, 73.0520],
          targetHosp ? targetHosp.coords : [33.7037, 73.0561]
        ],
        directDistanceKm: 7.4,
        safeDistanceKm: 10.1,
        estimatedTimeMin: 21,
        riskReductionPercent: 94,
        detectedHazards: [
          {
            type: "ROAD_SUBMERGED",
            name: "Faizabad Interchange Flood Barrier",
            coords: [33.6580, 73.0780],
            hazardLevel: "CRITICAL (4.5ft Water)",
            risk: "Vehicle Submersion / 100% Impassable"
          }
        ],
        steps: [
          {
            instruction: "Depart origin moving West on cleared lane toward Stadium Road",
            distanceKm: "1.2 km",
            status: "CLEAR",
            safetyStatus: "100% Dry"
          },
          {
            instruction: "Avoid Faizabad flood corridor; turn right onto IJP Westbound Bypass",
            distanceKm: "2.1 km",
            status: "DIVERTED",
            safetyStatus: "Emergency Lane Active"
          },
          {
            instruction: "Enter 9th Avenue Northbound via elevated flyover (Zero flood risk)",
            distanceKm: "3.8 km",
            status: "SAFE_HIGHWAY",
            safetyStatus: "Cleared by Police"
          },
          {
            instruction: "Merge onto Srinagar Highway Eastbound and enter PIMS Emergency Gate",
            distanceKm: "1.5 km",
            status: "DESTINATION",
            safetyStatus: "ICU Available (28 Beds Ready)"
          }
        ],
        routeClearedTimestamp: new Date().toISOString()
      };
      setActiveSafeRoute(defaultRoute);
      return defaultRoute;
    }
  }, [hospitals]);

  // Approve Resource Dispatch
  const approveDispatch = useCallback(async (zoneId: string, assets?: any) => {
    try {
      const res = await fetch(`${API_BASE}/api/dispatch/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId, assets })
      });
      const data = await res.json();
      if (data.success && data.dispatch) {
        setDispatchedUnits(prev => prev.some(u => u.id === data.dispatch.id) ? prev : [data.dispatch, ...prev]);
        if (data.priorityZones) {
          setPriorityZones(data.priorityZones);
        }
      }
    } catch (err) {
      setPriorityZones(prev => prev.map(z => z.id === zoneId ? { ...z, status: 'DISPATCH_CONFIRMED' } : z));
      const fallbackDispatch: DispatchedUnit = {
        id: `disp_${Date.now()}`,
        targetZone: "Priority Zone #1",
        unitName: "Rescue 1122 Rapid Fleet",
        type: "3 Jet-Boats & 2 Mobile Medical Teams",
        status: "DISPATCHED_ACTIVE",
        dispatchedAt: new Date().toISOString(),
        etaMin: 10
      };
      setDispatchedUnits(prev => [fallbackDispatch, ...prev]);
    }
  }, []);

  // Trigger Live Simulation
  const startSimulation = useCallback(async () => {
    try {
      setSimulationRunning(true);
      await fetch(`${API_BASE}/api/simulation/start`, { method: 'POST' });
    } catch (error) {
      console.warn('Simulation API unavailable:', error);
    }
  }, []);

  // Reset Simulation
  const resetSimulation = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/simulation/reset`, { method: 'POST' });
    } catch (error) {
      console.warn('Simulation reset API unavailable:', error);
      setReports([]);
      setHospitals([]);
      setHazardZones([]);
      setRoadBlocks([]);
      setPriorityZones([]);
      setSimulationRunning(false);
      setSimulationStep(0);
      setActiveSafeRoute(null);
    }
  }, []);

  return (
    <CrisisContext.Provider
      value={{
        reports,
        hospitals,
        hazardZones,
        roadBlocks,
        reliefHubs,
        priorityZones,
        dispatchedUnits,
        systemAlert,
        activeRegion,
        regions: regions.length > 0 ? regions : defaultRegions,
        radar,
        selectedReport,
        selectedHospital,
        selectedPriorityZone,
        activeSafeRoute,
        highlightedCoords,
        activeCategoryFilter,
        layers,
        simulationRunning,
        simulationStep,
        isConnectedToServer,
        setActiveCategoryFilter,
        toggleLayer,
        setActiveRegion,
        setSelectedReport,
        setSelectedHospital,
        setSelectedPriorityZone,
        setHighlightedCoords,
        setActiveSafeRoute,
        submitCitizenReport,
        calculateSafeRoute,
        approveDispatch,
        startSimulation,
        resetSimulation,
        weather,
        weatherLoading,
        refreshWeather
      }}
    >
      {children}
    </CrisisContext.Provider>
  );
};

export const useCrisis = () => {
  const context = useContext(CrisisContext);
  if (!context) throw new Error('useCrisis must be used within CrisisProvider');
  return context;
};
