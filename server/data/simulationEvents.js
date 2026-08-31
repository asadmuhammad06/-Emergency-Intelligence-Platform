// Scripted Disaster Timeline for Live Hackathon Demo
export const simulationSteps = [
  {
    step: 1,
    delayMs: 2000,
    type: "SYSTEM_ALERT",
    title: "🌊 NDMA FLASH FLOOD WARNING TRIGGERED",
    message: "Monsoon cloudburst over Margalla Hills catchment. Nullah Lai gauge crossed 22.4 ft danger threshold at Kattarian.",
    data: {
      alertLevel: "RED",
      affectedArea: "Islamabad-Rawalpindi Twin Cities",
      rainfallMmPerHour: 112
    }
  },
  {
    step: 2,
    delayMs: 4000,
    type: "NEW_REPORT",
    report: {
      rawText: "🚨 19 people stranded on commercial building rooftop at Saddar Rawalpindi. Water current very strong!",
      category: "RESCUE_NEEDED",
      severity: 10,
      headcount: 19,
      locationName: "Saddar Metro Station, Rawalpindi",
      coords: [33.5985, 73.0545],
      needs: ["Helicopter Winch / Jet Boat", "Medical Responders"],
      languageDetected: "English",
      confidence: 0.99
    }
  },
  {
    step: 3,
    delayMs: 4000,
    type: "NEW_REPORT",
    report: {
      rawText: "Murree Road near Committee Chowk underpass doob gaya hai, gaariyan phans gayi hain, traffic band!",
      category: "ROAD_BLOCKED",
      severity: 8,
      headcount: 0,
      locationName: "Committee Chowk Underpass, Murree Road",
      coords: [33.6110, 73.0680],
      needs: ["Traffic Wardens", "Heavy Pumping Machinery"],
      languageDetected: "Roman Urdu",
      confidence: 0.96
    }
  },
  {
    step: 4,
    delayMs: 4000,
    type: "HOSPITAL_TELEMETRY_UPDATE",
    hospitalId: "hosp_1", // Holy Family
    update: {
      capacity: 96,
      status: "OVERLOADED",
      occupiedBeds: 816,
      icuAvailable: 0,
      acceptingEmergencies: false,
      alert: "Critical ICU saturation. Diverting all incoming casualties to PIMS Islamabad."
    }
  },
  {
    step: 5,
    delayMs: 4000,
    type: "NEW_REPORT",
    report: {
      rawText: "Peenay ka saaf paani khatam ho gaya hai Sector I-9 katchi abadi me. 300+ logon ko dehydration ka khatra.",
      category: "WATER_SHORTAGE",
      severity: 8,
      headcount: 0,
      locationName: "Sector I-9/1 Slum Settlement",
      coords: [33.6540, 73.0480],
      needs: ["Clean Drinking Water Tankers", "Water Purification Tablets"],
      languageDetected: "Roman Urdu",
      confidence: 0.94
    }
  },
  {
    step: 6,
    delayMs: 4000,
    type: "NEW_REPORT",
    report: {
      rawText: "Faizabad grid station failure spreading. Shamsabad, Double Road and 6th Road completely without power. Network signals dropping.",
      category: "POWER_OUTAGE",
      severity: 8,
      headcount: 0,
      locationName: "6th Road / Shamsabad Commercial Corridor",
      coords: [33.6425, 73.0780],
      needs: ["Mobile Telecom Towers", "Backup Generators"],
      languageDetected: "English",
      confidence: 0.95
    }
  },
  {
    step: 7,
    delayMs: 3500,
    type: "DECISION_INTELLIGENCE_RECALCULATION",
    title: "🎯 PRIORITY DISPATCH RECALCULATED",
    message: "New Priority Zone #1 identified: Rawalpindi Nullah Lai Basin (37 total trapped victims, 2 overloaded hospitals, road accessibility: LOW). Immediate rescue fleet dispatch recommended."
  }
];
