import { Hospital, HazardZone, RoadBlock, ReliefHub, EmergencyReport, Region, PriorityZone } from '../types';

export const defaultRegions: Region[] = [
  { id: "isb_rwp", name: "Islamabad / Rawalpindi (Live Crisis)", center: [33.6500, 73.0600], zoom: 12, status: "CRITICAL_ALERT", riverBasin: "Nullah Lai Basin", sensorName: "Kattarian Sensor", dangerLimitFeet: 20.0 },
  { id: "karachi", name: "Karachi Metropolitan / Coastal", center: [24.8607, 67.0011], zoom: 11, status: "WARNING", riverBasin: "Lyari / Malir Basin", sensorName: "Lyari Nadi Gauge", dangerLimitFeet: 16.0 },
  { id: "lahore", name: "Lahore Division / Ravi", center: [31.5497, 74.3436], zoom: 11, status: "WATCH", riverBasin: "Ravi River Basin", sensorName: "Shahdara Gauging Post", dangerLimitFeet: 19.0 },
  { id: "nowshera", name: "Nowshera / KP Basin", center: [34.0150, 71.9747], zoom: 11, status: "WATCH", riverBasin: "Kabul River Basin", sensorName: "Nowshera Bridge Sensor", dangerLimitFeet: 24.0 },
  { id: "swat", name: "Swat Valley / Kalam", center: [35.2227, 72.4258], zoom: 10, status: "ADVISORY", riverBasin: "Swat River Basin", sensorName: "Chakdara Hydrology Post", dangerLimitFeet: 18.0 },
  { id: "sukkur", name: "Sukkur / Indus River", center: [27.7052, 68.8574], zoom: 11, status: "WATCH", riverBasin: "Indus River Basin", sensorName: "Sukkur Barrage Gauge", dangerLimitFeet: 28.0 },
  { id: "dgkhan", name: "D.G. Khan / Taunsa", center: [30.0561, 70.6403], zoom: 11, status: "NORMAL", riverBasin: "Taunsa Hill Torrents", sensorName: "Taunsa Barrage Sensor", dangerLimitFeet: 22.0 },
  { id: "quetta", name: "Quetta Valley / Chaman", center: [30.1798, 66.9750], zoom: 11, status: "NORMAL", riverBasin: "Hanna Urak Basin", sensorName: "Spin Karez Sensor", dangerLimitFeet: 15.0 },
];

export const initialHospitals: Hospital[] = [
  {
    id: "hosp_1",
    name: "Holy Family Hospital",
    location: "Satellite Town, Rawalpindi",
    coords: [33.6265, 73.0712],
    totalBeds: 850,
    occupiedBeds: 780,
    capacity: 92,
    icuAvailable: 2,
    bloodBankUnits: 45,
    powerBackup: "Operational (Generator)",
    status: "OVERLOADED",
    acceptingEmergencies: false,
    phone: "+92-51-9290321"
  },
  {
    id: "hosp_2",
    name: "PIMS (Pakistan Institute of Medical Sciences)",
    location: "G-8/3, Islamabad",
    coords: [33.7037, 73.0561],
    totalBeds: 1200,
    occupiedBeds: 720,
    capacity: 60,
    icuAvailable: 28,
    bloodBankUnits: 210,
    powerBackup: "Grid + Solar Hybrid",
    status: "NORMAL",
    acceptingEmergencies: true,
    phone: "+92-51-9261170"
  },
  {
    id: "hosp_3",
    name: "Benazir Bhutto Hospital (BBH)",
    location: "Murree Road, Rawalpindi",
    coords: [33.6065, 73.0725],
    totalBeds: 600,
    occupiedBeds: 535,
    capacity: 89,
    icuAvailable: 4,
    bloodBankUnits: 30,
    powerBackup: "Operational",
    status: "WARNING",
    acceptingEmergencies: true,
    phone: "+92-51-9290301"
  },
  {
    id: "hosp_4",
    name: "Shifa International Hospital",
    location: "H-8/4, Islamabad",
    coords: [33.6820, 73.0805],
    totalBeds: 550,
    occupiedBeds: 340,
    capacity: 62,
    icuAvailable: 15,
    bloodBankUnits: 140,
    powerBackup: "Triple Redundancy Grid",
    status: "NORMAL",
    acceptingEmergencies: true,
    phone: "+92-51-8463000"
  },
  {
    id: "hosp_5",
    name: "Rawalpindi Institute of Cardiology (RIC)",
    location: "Rawal Road, Rawalpindi",
    coords: [33.6015, 73.0890],
    totalBeds: 300,
    occupiedBeds: 220,
    capacity: 73,
    icuAvailable: 9,
    bloodBankUnits: 80,
    powerBackup: "Operational",
    status: "NORMAL",
    acceptingEmergencies: true,
    phone: "+92-51-9281111"
  }
];

export const initialHazardZones: HazardZone[] = [
  {
    id: "hazard_flood_nullah_lai",
    type: "FLOOD_ZONE",
    name: "Nullah Lai Flash Flood Inundation Zone",
    severity: "HIGH",
    waterDepthMeters: 2.1,
    status: "EXPANDING",
    polygon: [
      [33.6420, 73.0520],
      [33.6350, 73.0640],
      [33.6210, 73.0720],
      [33.6080, 73.0780],
      [33.6020, 73.0680],
      [33.6150, 73.0550],
      [33.6300, 73.0450]
    ],
    description: "Water level rose past 21ft danger mark at Gawalmandi & Kattarian bridges."
  },
  {
    id: "hazard_faizabad_expressway",
    type: "ROAD_SUBMERGED",
    name: "Faizabad Interchange & Islamabad Expressway Submersion",
    severity: "CRITICAL",
    waterDepthMeters: 1.6,
    status: "IMPASSABLE",
    polygon: [
      [33.6660, 73.0740],
      [33.6610, 73.0900],
      [33.6480, 73.0850],
      [33.6520, 73.0690]
    ],
    description: "Islamabad Expressway completely cut off between Faizabad and Zero Point."
  }
];

export const initialRoadBlocks: RoadBlock[] = [
  {
    id: "block_1",
    roadName: "Islamabad Expressway (Faizabad Underpass)",
    coords: [33.6595, 73.0795],
    status: "CLOSED",
    reason: "4.5ft flood water accumulation + stalled buses",
    clearingEta: "6 Hours",
    detourRecommended: "Via 9th Avenue & Srinagar Highway"
  },
  {
    id: "block_2",
    roadName: "Murree Road (near Committee Chowk)",
    coords: [33.6120, 73.0670],
    status: "CLOSED",
    reason: "Nullah Lai overflow & debris blockage",
    clearingEta: "4 Hours",
    detourRecommended: "Via Rawal Road or Airport Road"
  },
  {
    id: "block_3",
    roadName: "IJP Road (Double Road Bridge Section)",
    coords: [33.6445, 73.0620],
    status: "HEAVY_CONGESTION",
    reason: "Partial lane flooding, slow moving rescue convoy",
    clearingEta: "Open for emergency vehicles only",
    detourRecommended: "Follow Traffic Warden priority lane"
  }
];

export const initialReliefHubs: ReliefHub[] = [
  {
    id: "hub_1",
    name: "Sector I-8 Sports Complex Relief Depot",
    coords: [33.6705, 73.0650],
    type: "WATER_AND_FOOD",
    drinkingWaterLiters: 15000,
    foodPackets: 3200,
    rescueBoats: 4,
    status: "ACTIVE",
    managedBy: "Pakistan Army & NDMA"
  },
  {
    id: "hub_2",
    name: "Rawal Town Community Relief Station",
    coords: [33.6290, 73.0950],
    type: "MEDICAL_AND_SHELTER",
    drinkingWaterLiters: 4000,
    foodPackets: 850,
    rescueBoats: 1,
    status: "ACTIVE",
    managedBy: "Rescue 1122 & Alkhidmat"
  },
  {
    id: "hub_3",
    name: "Sector G-9 Flood Transit Camp",
    coords: [33.6920, 73.0310],
    type: "EVACUATION_SHELTER",
    drinkingWaterLiters: 25000,
    foodPackets: 6000,
    rescueBoats: 6,
    status: "ACTIVE",
    managedBy: "Islamabad Administration"
  }
];

export const initialReports: EmergencyReport[] = [
  {
    id: "rep_101",
    rawText: "Emergency! 12 people trapped on roof near Dhok Kala Khan Rawalpindi, water rising rapidly over ground floor.",
    category: "RESCUE_NEEDED",
    severity: 9,
    headcount: 12,
    locationName: "Dhok Kala Khan, Rawalpindi",
    coords: [33.6380, 73.0760],
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: "VERIFIED",
    needs: ["Rescue Boat", "Life Jackets", "First Aid"],
    languageDetected: "English",
    confidence: 0.98,
    dispatched: false
  },
  {
    id: "rep_102",
    rawText: "Islamabad Expressway near Faizabad submerged under 4.5ft water. Light vehicles drowned, road is completely blocked!",
    category: "ROAD_BLOCKED",
    severity: 8,
    headcount: 0,
    locationName: "Faizabad Interchange, Islamabad Highway",
    coords: [33.6580, 73.0780],
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: "VERIFIED",
    needs: ["Debris Removal", "Traffic Diversion"],
    languageDetected: "English",
    confidence: 0.95,
    dispatched: true
  },
  {
    id: "rep_103",
    rawText: "Holy Family Hospital emergency ward flooded, capacity reached 92%, acute shortage of clean water and IV fluids.",
    category: "HOSPITAL_CAPACITY",
    severity: 9,
    headcount: 0,
    locationName: "Holy Family Hospital, Satellite Town",
    coords: [33.6265, 73.0712],
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    status: "CRITICAL",
    needs: ["Water Bowsers", "Emergency Patient Diversion"],
    languageDetected: "English",
    confidence: 0.96,
    dispatched: false
  },
  {
    id: "rep_104",
    rawText: "Faizabad Grid Station tripped. Complete blackout in Sector I-8 and Shamsabad area.",
    category: "POWER_OUTAGE",
    severity: 7,
    headcount: 0,
    locationName: "Faizabad / Sector I-8",
    coords: [33.6650, 73.0710],
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: "VERIFIED",
    needs: ["IESCO Emergency Team", "Mobile Generators"],
    languageDetected: "English",
    confidence: 0.93,
    dispatched: true
  },
  {
    id: "rep_105",
    rawText: "Rawalpindi Gawalmandi pull ke qareeb 6 afrad pani me phansay hain, 2 bachay bhi sath hain. Barah-e-karam Rescue 1122 ko bhejen.",
    category: "RESCUE_NEEDED",
    severity: 10,
    headcount: 6,
    locationName: "Gawalmandi Bridge, Rawalpindi",
    coords: [33.6140, 73.0640],
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    status: "VERIFIED",
    needs: ["Inflatable Boat", "Child Evacuation Gear"],
    languageDetected: "Roman Urdu",
    confidence: 0.97,
    dispatched: false
  }
];

export const initialPriorityZones: PriorityZone[] = [
  {
    id: "zone_rwp_nullah_lai",
    rank: 1,
    zoneName: "Priority Zone #1 — Rawalpindi Nullah Lai & Dhok Kala Khan Basin",
    subDistricts: ["Dhok Kala Khan", "Gawalmandi", "Committee Chowk", "Nullah Lai Riverbed"],
    centerCoords: [33.6280, 73.0680],
    affectedPeopleCount: 37,
    overloadedHospitalsCount: 2,
    waterShortageReported: true,
    powerOutageReported: true,
    roadAccessibility: "LOW",
    accessibilityScore: 2.2,
    urgencyScore: 94.5,
    riskLevel: "CRITICAL_LIFE_THREATENING",
    recommendedDispatch: {
      boats: 3,
      helicopters: 1,
      waterBowsersLiters: 10000,
      medicalTeams: 2,
      emergencyRations: 1200
    },
    status: "DISPATCH_PENDING",
    keySummary: "37 people stranded on rooftops with rapidly rising flood currents. 2 local hospitals overloaded. Road access impassable by conventional transport.",
    actionPlan: [
      "Deploy Rescue 1122 Jet-Boats via Stadium Road entry point",
      "Divert all medical casualties north to PIMS Hospital via 9th Avenue bypass",
      "Air-drop clean drinking water purification sachets to stranded rooftop clusters",
      "Position Army mobile de-watering pumps at Committee Chowk underpass"
    ]
  },
  {
    id: "zone_faizabad_commercial",
    rank: 2,
    zoneName: "Priority Zone #2 — Faizabad Interchange & Sector I-8 Corridor",
    subDistricts: ["Faizabad Underpass", "Sector I-8/4", "Shamsabad Metro"],
    centerCoords: [33.6590, 73.0780],
    affectedPeopleCount: 18,
    overloadedHospitalsCount: 1,
    waterShortageReported: false,
    powerOutageReported: true,
    roadAccessibility: "CRITICAL_BLOCKED",
    accessibilityScore: 1.5,
    urgencyScore: 81.0,
    riskLevel: "HIGH_INFRASTRUCTURE_FAILURE",
    recommendedDispatch: {
      boats: 1,
      helicopters: 0,
      waterBowsersLiters: 4000,
      medicalTeams: 1,
      emergencyRations: 500
    },
    status: "UNITS_EN_ROUTE",
    keySummary: "Major arterial cut off. Grid station failure causing blackout in 4 residential sectors. 18 stranded bus passengers.",
    actionPlan: [
      "Mobilize IESCO emergency substation repair unit",
      "Activate high-clearance 4x4 troop carriers for passenger extraction",
      "Enforce traffic blockage diversion towards Kashmir Highway"
    ]
  },
  {
    id: "zone_sector_i9_katchi",
    rank: 3,
    zoneName: "Priority Zone #3 — Sector I-9 Industrial & Settlement Pocket",
    subDistricts: ["Sector I-9/1", "Sector I-9/4", "Potohar Road"],
    centerCoords: [33.6540, 73.0480],
    affectedPeopleCount: 14,
    overloadedHospitalsCount: 0,
    waterShortageReported: true,
    powerOutageReported: false,
    roadAccessibility: "MODERATE",
    accessibilityScore: 6.5,
    urgencyScore: 68.2,
    riskLevel: "MODERATE_RELIEF_PRIORITY",
    recommendedDispatch: {
      boats: 0,
      helicopters: 0,
      waterBowsersLiters: 15000,
      medicalTeams: 1,
      emergencyRations: 800
    },
    status: "STANDBY",
    keySummary: "Drinking water pipeline severed. Risk of waterborne disease outbreak if potable water is not delivered within 8 hours.",
    actionPlan: [
      "Dispatch CDA Water Bowsers from Sector I-8 depot",
      "Set up mobile medical hydration camp at Sector I-9 community school"
    ]
  }
];
