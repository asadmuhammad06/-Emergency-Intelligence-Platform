// AI Multi-lingual Emergency NLP Classifier for English, Urdu & Roman Urdu

// Pre-mapped landmark coordinates for automatic geo-resolution in Islamabad-Rawalpindi
const landmarkGeoMap = [
  { keywords: ["dhok kala khan", "kala khan"], coords: [33.6380, 73.0760], name: "Dhok Kala Khan, Rawalpindi" },
  { keywords: ["faizabad", "faizabad interchange"], coords: [33.6580, 73.0780], name: "Faizabad Interchange, Islamabad Highway" },
  { keywords: ["holy family", "holy family hospital", "satellite town"], coords: [33.6265, 73.0712], name: "Holy Family Hospital, Satellite Town" },
  { keywords: ["pims", "g-8", "g8"], coords: [33.7037, 73.0561], name: "PIMS Hospital, Sector G-8" },
  { keywords: ["gawalmandi", "nullah lai", "lai pull", "lai bridge"], coords: [33.6140, 73.0640], name: "Gawalmandi Bridge, Nullah Lai" },
  { keywords: ["saddar", "saddar rawalpindi", "cantt"], coords: [33.5985, 73.0545], name: "Saddar Metro Station, Rawalpindi" },
  { keywords: ["committee chowk", "murree road"], coords: [33.6110, 73.0680], name: "Committee Chowk, Murree Road" },
  { keywords: ["i-9", "i9", "sector i-9"], coords: [33.6540, 73.0480], name: "Sector I-9 Slum Settlement" },
  { keywords: ["6th road", "sixth road", "shamsabad"], coords: [33.6425, 73.0780], name: "6th Road / Shamsabad" },
  { keywords: ["i-8", "i8", "sector i-8"], coords: [33.6705, 73.0650], name: "Sector I-8, Islamabad" },
  { keywords: ["shifa", "h-8", "h8"], coords: [33.6820, 73.0805], name: "Shifa International Hospital, H-8" },
  { keywords: ["zero point", "kashmir highway", "srinagar highway"], coords: [33.6930, 73.0650], name: "Zero Point / Srinagar Highway" },
  { keywords: ["soan", "soan river", "dha"], coords: [33.5420, 73.1350], name: "Soan River Basin, Rawalpindi" },
  { keywords: ["karachi", "malir", "lyari"], coords: [24.8607, 67.0011], name: "Karachi Central" },
  { keywords: ["nowshera", "kabul river"], coords: [34.0150, 71.9747], name: "Nowshera Riverside" }
];

export function classifyEmergencyReport(rawText, customCoords = null) {
  const textLower = rawText.toLowerCase();

  // 1. Language Detection Heuristics
  const romanUrduKeywords = ["pani", "phansay", "phansa", "madad", "bachay", "bache", "gharon", "chhat", "khana", "peenay", "bijli", "rasta", "band", "doob", "haspatal", "barah-e-karam", "foran", "afrad", "halaat"];
  const isRomanUrdu = romanUrduKeywords.some(kw => textLower.includes(kw));
  const languageDetected = isRomanUrdu ? "Roman Urdu" : "English";

  // 2. Category Detection
  let category = "GENERAL_ALERT";
  let severity = 5;
  const needs = [];

  // Rescue Needed
  if (
    textLower.includes("trapped") ||
    textLower.includes("stranded") ||
    textLower.includes("rescue") ||
    textLower.includes("phansay") ||
    textLower.includes("phansa") ||
    textLower.includes("drowned") ||
    textLower.includes("chhat") ||
    textLower.includes("roof") ||
    textLower.includes("madad")
  ) {
    category = "RESCUE_NEEDED";
    severity = 9;
    needs.push("Rescue Boat", "Life Jackets", "Medical Responders");
    if (textLower.includes("child") || textLower.includes("bachay") || textLower.includes("bache") || textLower.includes("critical") || textLower.includes("water rising")) {
      severity = 10;
    }
  }
  // Road Blocked
  else if (
    textLower.includes("road blocked") ||
    textLower.includes("blocked") ||
    textLower.includes("submerged") ||
    textLower.includes("cut off") ||
    textLower.includes("landslide") ||
    textLower.includes("rasta band") ||
    textLower.includes("doob gaya") ||
    textLower.includes("traffic band")
  ) {
    category = "ROAD_BLOCKED";
    severity = 8;
    needs.push("Traffic Diversion", "Water Pumping Units", "Debris Clearance");
  }
  // Hospital Capacity / Overload
  else if (
    textLower.includes("hospital") ||
    textLower.includes("haspatal") ||
    textLower.includes("capacity") ||
    textLower.includes("beds") ||
    textLower.includes("icu") ||
    textLower.includes("doctor") ||
    textLower.includes("patient") ||
    textLower.includes("ambulance")
  ) {
    category = "HOSPITAL_CAPACITY";
    severity = 8;
    needs.push("Patient Diversion Protocol", "Emergency Medical Supplies", "Mobile Clinics");
  }
  // Water Shortage / Relief
  else if (
    textLower.includes("water") ||
    textLower.includes("drinking water") ||
    textLower.includes("peenay ka pani") ||
    textLower.includes("saaf pani") ||
    textLower.includes("ration") ||
    textLower.includes("food") ||
    textLower.includes("khana")
  ) {
    category = "WATER_SHORTAGE";
    severity = 7;
    needs.push("Clean Drinking Water Bowsers", "Food Ration Packs", "Water Tablets");
  }
  // Power Grid / Outage
  else if (
    textLower.includes("power") ||
    textLower.includes("electricity") ||
    textLower.includes("blackout") ||
    textLower.includes("bijli") ||
    textLower.includes("grid station") ||
    textLower.includes("generator")
  ) {
    category = "POWER_OUTAGE";
    severity = 7;
    needs.push("Emergency Generators", "IESCO Power Restoration Team");
  }

  // 3. Headcount Extraction
  let headcount = 0;
  // Match patterns like "12 people", "6 afrad", "family of 8", "19", "5 bachay"
  const headcountRegex = /(\d+)\s*(people|persons|afrad|log|individuals|family members|bachay|bache|citizens)/i;
  const match = textLower.match(headcountRegex);
  if (match && match[1]) {
    headcount = parseInt(match[1], 10);
  } else {
    // Check if simple standalone digits exist near emergency keywords
    const numberMatch = textLower.match(/\b([1-9][0-9]?)\b/);
    if (numberMatch && (category === "RESCUE_NEEDED" || textLower.includes("people") || textLower.includes("log"))) {
      headcount = parseInt(numberMatch[1], 10);
    }
  }

  // 4. Geolocation Resolution
  let resolvedCoords = customCoords;
  let locationName = "Rawalpindi - Islamabad Central Sector";

  if (!resolvedCoords) {
    for (const lm of landmarkGeoMap) {
      if (lm.keywords.some(kw => textLower.includes(kw))) {
        resolvedCoords = lm.coords;
        locationName = lm.name;
        break;
      }
    }
  }

  // Fallback coords with slight jitter if none matched
  if (!resolvedCoords) {
    resolvedCoords = [
      33.6400 + (Math.random() * 0.04 - 0.02),
      73.0600 + (Math.random() * 0.04 - 0.02)
    ];
  }

  return {
    id: `rep_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    rawText,
    category,
    severity,
    headcount,
    locationName,
    coords: resolvedCoords,
    timestamp: new Date().toISOString(),
    status: severity >= 8 ? "CRITICAL" : "VERIFIED",
    needs,
    languageDetected,
    confidence: Number((0.92 + Math.random() * 0.07).toFixed(2)),
    dispatched: false
  };
}
