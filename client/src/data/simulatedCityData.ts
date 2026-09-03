import { EmergencyReport, HazardZone, Hospital, ReliefHub, RoadBlock, Region, WeatherData } from '../types';

export interface SimulatedMetrics {
  trappedCitizens: number;
  icuSaturation: number;
  activeSos: number;
  nullahGaugeFeet: number;
  floodInundation: number;
}

const hash = (value: string) => [...value].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 2166136261);
const numberFor = (seed: number, min: number, max: number) => min + (seed % (max - min + 1));
const point = (region: Region, seed: number, spread = 0.035): [number, number] => [
  region.center[0] + (((seed % 1000) / 999) - 0.5) * spread,
  region.center[1] + ((((seed >>> 10) % 1000) / 999) - 0.5) * spread
];

export interface SimulatedCityData {
  reports: EmergencyReport[];
  hospitals: Hospital[];
  hazardZones: HazardZone[];
  roadBlocks: RoadBlock[];
  reliefHubs: ReliefHub[];
  weather: WeatherData;
  priorityZones: never[];
  dispatchedUnits: never[];
  metrics: SimulatedMetrics;
}

export function createSimulatedCityData(region: Region): SimulatedCityData {
  const seed = hash(region.id + region.name);
  const trapped = numberFor(seed, 4, 28);
  const hospitalCount = numberFor(seed >>> 2, 2, 5);
  const roadCount = numberFor(seed >>> 4, 2, 4);
  const depotCount = numberFor(seed >>> 6, 2, 3);
  const precipitation = numberFor(seed >>> 10, 0, 12);
  const weatherCode = numberFor(seed >>> 12, 0, 99);
  const weather: WeatherData = {
    temperature: numberFor(seed >>> 14, 18, 38),
    humidity: numberFor(seed >>> 16, 45, 88),
    precipitation,
    weatherCode,
    condition: weatherCode >= 80 ? 'Rain showers' : weatherCode >= 50 ? 'Cloudy' : 'Clear Sky',
    windSpeed: numberFor(seed >>> 18, 4, 24),
    windGusts: numberFor(seed >>> 20, 10, 42),
    time: 'SIMULATED',
    isHeavyRain: precipitation >= 10,
    isHighWind: numberFor(seed >>> 22, 0, 1) === 1,
    flightFeasibility: 'CLEAR',
    floodRiskLevel: precipitation >= 10 ? 'HIGH' : precipitation >= 3 ? 'MODERATE' : 'LOW'
  };
  const reports: EmergencyReport[] = Array.from({ length: numberFor(seed >>> 8, 3, 5) }, (_, index) => {
    const coords = point(region, seed + index * 997);
    return {
      id: `sim-${region.id}-sos-${index}`,
      rawText: `Simulated ground intelligence for ${region.name}: precipitation ${precipitation} mm, weather code ${weatherCode}.`,
      category: index % 2 ? 'ROAD_BLOCKED' : 'RESCUE_NEEDED',
      severity: numberFor(seed + index, 4, 9),
      headcount: index === 0 ? trapped : 0,
      locationName: region.name,
      coords,
      timestamp: 'SIMULATED',
      status: 'SIMULATED',
      source: 'SIMULATED',
      needs: []
    };
  });
  const hospitals: Hospital[] = Array.from({ length: hospitalCount }, (_, index) => ({
    id: `sim-${region.id}-hospital-${index}`,
    name: `Simulated Medical Facility ${index + 1}`,
    location: region.name,
    coords: point(region, seed + index * 431),
    totalBeds: 0,
    occupiedBeds: 0,
    capacity: 0,
    icuAvailable: 0,
    powerBackup: 'Unknown',
    status: 'NORMAL',
    acceptingEmergencies: true,
    phone: 'Not available',
    source: 'SIMULATED'
  }));
  const roadBlocks: RoadBlock[] = Array.from({ length: roadCount }, (_, index) => ({
    id: `sim-${region.id}-road-${index}`,
    roadName: `Simulated road blockade ${index + 1}`,
    coords: point(region, seed + index * 173),
    status: 'SIMULATED',
    reason: 'Simulated operational scenario',
    detourRecommended: 'Manual verification required',
    source: 'SIMULATED'
  }));
  const reliefHubs: ReliefHub[] = Array.from({ length: depotCount }, (_, index) => ({
    id: `sim-${region.id}-depot-${index}`,
    name: `Simulated relief depot ${index + 1}`,
    coords: point(region, seed + index * 619),
    type: 'SIMULATED',
    status: 'SIMULATED',
    managedBy: 'Scenario generator',
    waterAvailable: true,
    drinkingWaterLiters: numberFor(seed + index * 37, 500, 5000),
    foodPackets: numberFor(seed + index * 41, 50, 500),
    rescueBoats: numberFor(seed + index * 43, 0, 3),
    source: 'SIMULATED'
  }));
  const hazardZones: HazardZone[] = [{
    id: `sim-${region.id}-flood`,
    type: 'FLOOD_ZONE',
    name: `Simulated flood inundation — ${region.name}`,
    severity: numberFor(seed, 0, 1) ? 'HIGH' : 'MEDIUM',
    waterDepthMeters: numberFor(seed >>> 3, 1, 3),
    status: 'SIMULATED',
    polygon: [point(region, seed, 0.08), point(region, seed + 1, 0.08), point(region, seed + 2, 0.08)],
    description: 'Simulated scenario value; verify with field teams.',
    source: 'SIMULATED'
  }];
  return {
    reports, hospitals, hazardZones, roadBlocks, reliefHubs, weather, priorityZones: [], dispatchedUnits: [],
    metrics: {
      trappedCitizens: trapped,
      icuSaturation: numberFor(seed >>> 5, 35, 92),
      activeSos: numberFor(seed >>> 7, 1, 9),
      nullahGaugeFeet: numberFor(seed >>> 9, 8, 24),
      floodInundation: numberFor(seed >>> 11, 1, 7)
    }
  };
}
