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

const ISB_RWP_HOSPITALS: Hospital[] = [
  {
    id: 'hosp_1',
    name: 'Holy Family Hospital',
    location: 'Satellite Town, Rawalpindi',
    coords: [33.6265, 73.0712],
    totalBeds: 850,
    occupiedBeds: 780,
    capacity: 92,
    icuAvailable: 2,
    powerBackup: 'Operational (Generator)',
    status: 'OVERLOADED',
    acceptingEmergencies: false,
    phone: '+92-51-9290321',
    source: 'EOC_REGISTERED'
  },
  {
    id: 'hosp_2',
    name: 'PIMS (Pakistan Institute of Medical Sciences)',
    location: 'Sector G-8/3, Islamabad',
    coords: [33.7037, 73.0561],
    totalBeds: 1200,
    occupiedBeds: 720,
    capacity: 60,
    icuAvailable: 28,
    powerBackup: 'Grid + Solar Hybrid',
    status: 'NORMAL',
    acceptingEmergencies: true,
    phone: '+92-51-9261170',
    source: 'EOC_REGISTERED'
  },
  {
    id: 'hosp_3',
    name: 'Benazir Bhutto Hospital (BBH)',
    location: 'Murree Road, Rawalpindi',
    coords: [33.6065, 73.0725],
    totalBeds: 600,
    occupiedBeds: 535,
    capacity: 89,
    icuAvailable: 4,
    powerBackup: 'Operational',
    status: 'WARNING',
    acceptingEmergencies: true,
    phone: '+92-51-9290301',
    source: 'EOC_REGISTERED'
  },
  {
    id: 'hosp_4',
    name: 'Shifa International Hospital',
    location: 'Sector H-8/4, Islamabad',
    coords: [33.6820, 73.0805],
    totalBeds: 550,
    occupiedBeds: 340,
    capacity: 62,
    icuAvailable: 15,
    powerBackup: 'Triple Redundancy Grid',
    status: 'NORMAL',
    acceptingEmergencies: true,
    phone: '+92-51-8463000',
    source: 'EOC_REGISTERED'
  },
  {
    id: 'hosp_5',
    name: 'Rawalpindi Institute of Cardiology (RIC)',
    location: 'Rawal Road, Rawalpindi',
    coords: [33.6015, 73.0890],
    totalBeds: 300,
    occupiedBeds: 220,
    capacity: 73,
    icuAvailable: 9,
    powerBackup: 'Operational',
    status: 'NORMAL',
    acceptingEmergencies: true,
    phone: '+92-51-9281111',
    source: 'EOC_REGISTERED'
  }
];

export function createSimulatedCityData(region: Region): SimulatedCityData {
  const seed = hash(region.id + region.name);
  const trapped = numberFor(seed, 8, 28);
  const precipitation = numberFor(seed >>> 10, 0, 12);
  const weatherCode = numberFor(seed >>> 12, 0, 99);

  const weather: WeatherData = {
    temperature: numberFor(seed >>> 14, 21, 34),
    humidity: numberFor(seed >>> 16, 55, 88),
    precipitation,
    weatherCode,
    condition: weatherCode >= 80 ? 'Rain showers' : weatherCode >= 50 ? 'Cloudy' : 'Clear Sky',
    windSpeed: numberFor(seed >>> 18, 6, 22),
    windGusts: numberFor(seed >>> 20, 12, 38),
    time: 'LIVE_SENSOR',
    isHeavyRain: precipitation >= 10,
    isHighWind: numberFor(seed >>> 22, 0, 1) === 1,
    flightFeasibility: precipitation >= 10 ? 'RESTRICTED' : 'CLEAR',
    floodRiskLevel: precipitation >= 10 ? 'HIGH' : precipitation >= 3 ? 'MODERATE' : 'LOW'
  };

  // Realistic Emergency Reports spanning all 5 categories
  const reports: EmergencyReport[] = [
    {
      id: `${region.id}-rep-1`,
      rawText: `Dhok Kala Khan: 6 afrad chat par phansay hain, pani 4.5ft charh chuka hai. Need emergency rescue boat urgently.`,
      category: 'RESCUE_NEEDED',
      severity: 9,
      headcount: 6,
      locationName: `${region.name} - Sector I-8 / Dhok Kala Khan`,
      coords: point(region, seed + 101),
      timestamp: '00:15 PKT',
      status: 'CRITICAL',
      source: 'CITIZEN_SOS',
      needs: ['Rescue Jet-Boat', 'Life Jackets', 'Paramedic Unit']
    },
    {
      id: `${region.id}-rep-2`,
      rawText: `Commercial Market katchi abadi: 12 civilians stranded on boundary wall due to rapid flood runoff.`,
      category: 'RESCUE_NEEDED',
      severity: 9,
      headcount: 12,
      locationName: `${region.name} - Commercial Market`,
      coords: point(region, seed + 203),
      timestamp: '00:22 PKT',
      status: 'VERIFIED',
      source: 'CITIZEN_SOS',
      needs: ['Evacuation Support', 'Emergency Ropes']
    },
    {
      id: `${region.id}-rep-3`,
      rawText: `Faizabad Interchange corridor completely submerged under 4.2ft water. All ambulance passage blocked. Use 9th Ave Flyover detour.`,
      category: 'ROAD_BLOCKED',
      severity: 8,
      headcount: 0,
      locationName: `${region.name} - Faizabad Corridor`,
      coords: point(region, seed + 305),
      timestamp: '00:08 PKT',
      status: 'VERIFIED',
      source: 'TRAFFIC_EOC',
      needs: ['Traffic Diversion', 'Heavy Water Pump Bowsers']
    },
    {
      id: `${region.id}-rep-4`,
      rawText: `IJP Road low underpass flooded up to 3.5ft. Three civilian vehicles trapped in stagnant runoff.`,
      category: 'ROAD_BLOCKED',
      severity: 7,
      headcount: 4,
      locationName: `${region.name} - IJP Road`,
      coords: point(region, seed + 407),
      timestamp: '00:27 PKT',
      status: 'REPORTED',
      source: 'RESCUE_1122',
      needs: ['Tow Trucks', 'Drainage Pumps']
    },
    {
      id: `${region.id}-rep-5`,
      rawText: `Holy Family Hospital ICU reached 92% capacity. 0 ventilator beds available. Ambulances must redirect to PIMS Trauma Wing.`,
      category: 'HOSPITAL_CAPACITY',
      severity: 9,
      headcount: 0,
      locationName: `${region.name} - Holy Family Hospital`,
      coords: point(region, seed + 509),
      timestamp: '00:12 PKT',
      status: 'VERIFIED',
      source: 'HOSPITAL_EOC',
      needs: ['Patient Diversion to PIMS', 'Oxygen Cylinder Reserves']
    },
    {
      id: `${region.id}-rep-6`,
      rawText: `Emergency Ward Surge: 35 flood-related trauma cases admitted in last 90 minutes. Stretcher shortage.`,
      category: 'HOSPITAL_CAPACITY',
      severity: 8,
      headcount: 35,
      locationName: `${region.name} - Benazir Bhutto Hospital`,
      coords: point(region, seed + 611),
      timestamp: '00:30 PKT',
      status: 'WARNING',
      source: 'HOSPITAL_EOC',
      needs: ['Additional Medical Squads', 'Blood Units']
    },
    {
      id: `${region.id}-rep-7`,
      rawText: `Main drinking water supply pipeline ruptured near Sadiqabad; 25 families stranded without potable drinking water.`,
      category: 'WATER_SHORTAGE',
      severity: 7,
      headcount: 25,
      locationName: `${region.name} - Sadiqabad Basin`,
      coords: point(region, seed + 713),
      timestamp: '00:18 PKT',
      status: 'VERIFIED',
      source: 'WASA_SURVEILLANCE',
      needs: ['Water Bowser Fleet', 'Water Purification Tablets']
    },
    {
      id: `${region.id}-rep-8`,
      rawText: `Contaminated sewage overflow mixed with drinking wells near Gawalmandi. High risk of waterborne disease.`,
      category: 'WATER_SHORTAGE',
      severity: 8,
      headcount: 50,
      locationName: `${region.name} - Gawalmandi`,
      coords: point(region, seed + 815),
      timestamp: '00:35 PKT',
      status: 'VERIFIED',
      source: 'HEALTH_SURVEILLANCE',
      needs: ['Water Filtration Units', 'Oral Rehydration Salts']
    },
    {
      id: `${region.id}-rep-9`,
      rawText: `Sector I-9/4 Industrial Substation flooded; 132kV feeder tripped to prevent electrocution. Area running on generators.`,
      category: 'POWER_OUTAGE',
      severity: 8,
      headcount: 0,
      locationName: `${region.name} - I-9 Grid Station`,
      coords: point(region, seed + 917),
      timestamp: '00:05 PKT',
      status: 'VERIFIED',
      source: 'IESCO_DISPATCH',
      needs: ['Industrial De-watering Pumps', 'Diesel Fuel Supply']
    },
    {
      id: `${region.id}-rep-10`,
      rawText: `Transformer submerged near Dhok Ratta; high tension live cables fallen into water. Power cut enforced.`,
      category: 'POWER_OUTAGE',
      severity: 8,
      headcount: 0,
      locationName: `${region.name} - Dhok Ratta`,
      coords: point(region, seed + 981),
      timestamp: '00:25 PKT',
      status: 'VERIFIED',
      source: 'WAPDA_ALERT',
      needs: ['Line Repair Crews', 'Area Cordon']
    }
  ];

  // Realistic Hospitals with proper bed capacities and phone numbers
  let hospitals: Hospital[];
  if (region.id === 'isb_rwp') {
    hospitals = ISB_RWP_HOSPITALS;
  } else {
    hospitals = [
      {
        id: `${region.id}-dhq`,
        name: `District Headquarters (DHQ) Hospital ${region.name.split('/')[0]}`,
        location: `${region.name} Civil Lines`,
        coords: point(region, seed + 111),
        totalBeds: 750,
        occupiedBeds: 620,
        capacity: 83,
        icuAvailable: 6,
        powerBackup: 'Generator Backup',
        status: 'WARNING',
        acceptingEmergencies: true,
        phone: '+92-51-9270001',
        source: 'HEALTH_DEPT'
      },
      {
        id: `${region.id}-cmh`,
        name: `Combined Military Hospital (CMH) ${region.name.split('/')[0]}`,
        location: `${region.name} Cantonment`,
        coords: point(region, seed + 222),
        totalBeds: 900,
        occupiedBeds: 540,
        capacity: 60,
        icuAvailable: 22,
        powerBackup: 'Triple Grid Redundancy',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-51-9270002',
        source: 'ARMED_FORCES_MED'
      },
      {
        id: `${region.id}-trauma`,
        name: `Divisional Trauma & Emergency Complex`,
        location: `${region.name} Central`,
        coords: point(region, seed + 333),
        totalBeds: 450,
        occupiedBeds: 390,
        capacity: 87,
        icuAvailable: 4,
        powerBackup: 'Solar Hybrid',
        status: 'WARNING',
        acceptingEmergencies: true,
        phone: '+92-51-9270003',
        source: 'RESCUE_1122'
      },
      {
        id: `${region.id}-civil`,
        name: `Civil Hospital & Infectious Diseases Wing`,
        location: `${region.name} Old City`,
        coords: point(region, seed + 444),
        totalBeds: 500,
        occupiedBeds: 320,
        capacity: 64,
        icuAvailable: 14,
        powerBackup: 'Operational',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-51-9270004',
        source: 'HEALTH_DEPT'
      }
    ];
  }

  const roadBlocks: RoadBlock[] = [
    {
      id: `${region.id}-road-1`,
      roadName: 'Faizabad Corridor & Murree Road Ingress',
      coords: point(region, seed + 173),
      status: 'ACTIVE_BLOCKADE',
      reason: 'Flash flood depth 4.2ft across all 6 lanes',
      detourRecommended: 'Divert via elevated 9th Avenue Flyover to Kashmir Highway',
      source: 'TRAFFIC_POLICE_EOC'
    },
    {
      id: `${region.id}-road-2`,
      roadName: 'IJP Road Low-Lying Underpass',
      coords: point(region, seed + 284),
      status: 'ACTIVE_BLOCKADE',
      reason: 'Waterlogged with 3.5ft stormwater runoff',
      detourRecommended: 'Use Islamabad Highway (Murree Expressway Corridor)',
      source: 'RESCUE_1122'
    }
  ];

  const reliefHubs: ReliefHub[] = [
    {
      id: `${region.id}-hub-1`,
      name: 'Liaquat Bagh Provincial Relief Base',
      coords: point(region, seed + 619),
      type: 'DISASTER_LOGISTICS_HUB',
      status: 'OPERATIONAL',
      managedBy: 'NDMA & Rescue 1122',
      waterAvailable: true,
      drinkingWaterLiters: 6500,
      foodPackets: 450,
      rescueBoats: 4,
      source: 'EOC_REGISTERED'
    },
    {
      id: `${region.id}-hub-2`,
      name: 'Fatima Jinnah EOC Staging Depot',
      coords: point(region, seed + 721),
      type: 'MEDICAL_STAGING_CAMP',
      status: 'OPERATIONAL',
      managedBy: 'Pakistan Red Crescent Society (PRCS)',
      waterAvailable: true,
      drinkingWaterLiters: 9000,
      foodPackets: 800,
      rescueBoats: 5,
      source: 'EOC_REGISTERED'
    }
  ];

  const hazardZones: HazardZone[] = [{
    id: `${region.id}-flood-lai`,
    type: 'FLOOD_ZONE',
    name: `Nullah Lai Flash Flood Inundation Zone — ${region.name}`,
    severity: 'CRITICAL',
    waterDepthMeters: 1.8,
    status: 'ACTIVE_CRESTING',
    polygon: [point(region, seed, 0.05), point(region, seed + 1, 0.05), point(region, seed + 2, 0.05)],
    description: 'Critical catchment basin overflow. Immediate evacuation ordered for low-lying sectors.',
    source: 'WASA_HYDROLOGY'
  }];

  const totalOccupied = hospitals.reduce((sum, h) => sum + h.occupiedBeds, 0);
  const totalBeds = hospitals.reduce((sum, h) => sum + h.totalBeds, 0);
  const avgCapacity = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 74;

  return {
    reports,
    hospitals,
    hazardZones,
    roadBlocks,
    reliefHubs,
    weather,
    priorityZones: [],
    dispatchedUnits: [],
    metrics: {
      trappedCitizens: trapped,
      icuSaturation: avgCapacity,
      activeSos: reports.length,
      nullahGaugeFeet: 15.0,
      floodInundation: 2
    }
  };
}
