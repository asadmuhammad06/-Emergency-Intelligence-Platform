export type ReportCategory =
  | 'RESCUE_NEEDED'
  | 'ROAD_BLOCKED'
  | 'HOSPITAL_CAPACITY'
  | 'WATER_SHORTAGE'
  | 'POWER_OUTAGE'
  | 'GENERAL_ALERT';

export interface EmergencyReport {
  id: string;
  rawText: string;
  category: ReportCategory;
  severity: number;
  headcount: number;
  locationName: string;
  coords: [number, number];
  timestamp: string;
  status: 'CRITICAL' | 'VERIFIED' | 'RESOLVED';
  needs: string[];
  languageDetected?: 'English' | 'Roman Urdu' | 'Urdu';
  confidence?: number;
  dispatched?: boolean;
  callerPhone?: string;
  imageAttached?: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  coords: [number, number];
  totalBeds: number;
  occupiedBeds: number;
  capacity: number; // percentage
  icuAvailable: number;
  bloodBankUnits: number;
  powerBackup: string;
  status: 'NORMAL' | 'WARNING' | 'OVERLOADED';
  acceptingEmergencies: boolean;
  phone: string;
}

export interface HazardZone {
  id: string;
  type: 'FLOOD_ZONE' | 'ROAD_SUBMERGED' | 'LANDSLIDE';
  name: string;
  severity: 'HIGH' | 'CRITICAL';
  waterDepthMeters: number;
  status: string;
  polygon: [number, number][];
  description: string;
}

export interface RoadBlock {
  id: string;
  roadName: string;
  coords: [number, number];
  status: 'CLOSED' | 'HEAVY_CONGESTION' | 'PASSABLE_EMERGENCY_ONLY';
  reason: string;
  clearingEta: string;
  detourRecommended: string;
}

export interface ReliefHub {
  id: string;
  name: string;
  coords: [number, number];
  type: 'WATER_AND_FOOD' | 'MEDICAL_AND_SHELTER' | 'EVACUATION_SHELTER';
  drinkingWaterLiters: number;
  foodPackets: number;
  rescueBoats: number;
  status: string;
  managedBy: string;
}

export interface PriorityZone {
  id: string;
  rank: number;
  zoneName: string;
  subDistricts: string[];
  centerCoords: [number, number];
  affectedPeopleCount: number;
  overloadedHospitalsCount: number;
  waterShortageReported: boolean;
  powerOutageReported: boolean;
  roadAccessibility: 'LOW' | 'CRITICAL_BLOCKED' | 'MODERATE' | 'OPEN';
  accessibilityScore: number;
  urgencyScore: number;
  riskLevel: string;
  recommendedDispatch: {
    boats: number;
    helicopters: number;
    waterBowsersLiters: number;
    medicalTeams: number;
    emergencyRations: number;
  };
  status: 'DISPATCH_PENDING' | 'UNITS_EN_ROUTE' | 'STANDBY' | 'DISPATCH_CONFIRMED';
  keySummary: string;
  actionPlan: string[];
}

export interface RouteStep {
  instruction: string;
  distanceKm: string;
  status: string;
  safetyStatus: string;
}

export interface DetectedHazard {
  type: string;
  name: string;
  coords: [number, number];
  hazardLevel: string;
  risk: string;
}

export interface SafestRoute {
  origin: {
    name: string;
    coords: [number, number];
  };
  destination: {
    name: string;
    coords: [number, number];
    capacity: number;
    status: string;
    icuAvailable: number;
  };
  directPath: [number, number][];
  safePath: [number, number][];
  directDistanceKm: number;
  safeDistanceKm: number;
  estimatedTimeMin: number;
  riskReductionPercent: number;
  detectedHazards: DetectedHazard[];
  steps: RouteStep[];
  routeClearedTimestamp: string;
}

export interface DispatchedUnit {
  id: string;
  targetZone: string;
  unitName: string;
  type: string;
  status: string;
  dispatchedAt: string;
  etaMin: number;
}

export interface SystemAlert {
  active: boolean;
  title: string;
  severity: 'HIGH' | 'CRITICAL' | 'WARNING';
  summary: string;
  timestamp: string;
}

export interface Region {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  status: string;
}
