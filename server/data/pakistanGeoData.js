// Realistic Geospatial Dataset for Pakistan Emergency Intelligence
export const pakistanCenter = {
  lat: 33.6844,
  lng: 73.0479,
  zoom: 12,
  city: "Islamabad - Rawalpindi Twin Cities Metro",
};

export const regions = [
  { id: "isb_rwp", name: "Islamabad / Rawalpindi (Live Crisis)", center: [33.6500, 73.0600], zoom: 12, status: "CRITICAL_ALERT", riverBasin: "Nullah Lai Basin", sensorName: "Kattarian Sensor", dangerLimitFeet: 20.0 },
  { id: "karachi", name: "Karachi Metropolitan / Coastal", center: [24.8607, 67.0011], zoom: 11, status: "WARNING", riverBasin: "Lyari / Malir Basin", sensorName: "Lyari Nadi Gauge", dangerLimitFeet: 16.0 },
  { id: "lahore", name: "Lahore Division / Ravi", center: [31.5497, 74.3436], zoom: 11, status: "WATCH", riverBasin: "Ravi River Basin", sensorName: "Shahdara Gauging Post", dangerLimitFeet: 19.0 },
  { id: "nowshera", name: "Nowshera / KP Basin", center: [34.0150, 71.9747], zoom: 11, status: "WATCH", riverBasin: "Kabul River Basin", sensorName: "Nowshera Bridge Sensor", dangerLimitFeet: 24.0 },
  { id: "swat", name: "Swat Valley / Kalam", center: [35.2227, 72.4258], zoom: 10, status: "ADVISORY", riverBasin: "Swat River Basin", sensorName: "Chakdara Hydrology Post", dangerLimitFeet: 18.0 },
  { id: "sukkur", name: "Sukkur / Indus River", center: [27.7052, 68.8574], zoom: 11, status: "WATCH", riverBasin: "Indus River Basin", sensorName: "Sukkur Barrage Gauge", dangerLimitFeet: 28.0 },
  { id: "dgkhan", name: "D.G. Khan / Taunsa", center: [30.0561, 70.6403], zoom: 11, status: "NORMAL", riverBasin: "Taunsa Hill Torrents", sensorName: "Taunsa Barrage Sensor", dangerLimitFeet: 22.0 },
  { id: "quetta", name: "Quetta Valley / Chaman", center: [30.1798, 66.9750], zoom: 11, status: "NORMAL", riverBasin: "Hanna Urak Basin", sensorName: "Spin Karez Sensor", dangerLimitFeet: 15.0 },
];

export const initialHospitals = [
  {
    id: "hosp_1",
    name: "Holy Family Hospital",
    location: "Satellite Town, Rawalpindi",
    coords: [33.6265, 73.0712],
    totalBeds: 850,
    occupiedBeds: 780,
    capacity: 92, // overloaded
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
    capacity: 60, // good capacity
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
    capacity: 89, // high load
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

export const initialHazardZones = [
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

export const initialRoadBlocks = [
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

export const initialReliefHubs = [
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

export const initialReports = [];

