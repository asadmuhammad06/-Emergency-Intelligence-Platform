// Scripted Disaster Timeline with Multi-Region Intelligence Support

export const simulationStepsByRegion = {
  isb_rwp: [
    {
      step: 1,
      delayMs: 2000,
      type: "SYSTEM_ALERT",
      title: "🌊 NDMA FLASH FLOOD WARNING TRIGGERED",
      message: "Monsoon cloudburst over Margalla Hills catchment. Nullah Lai gauge crossed 22.4 ft danger threshold at Kattarian.",
      data: { alertLevel: "RED", affectedArea: "Islamabad-Rawalpindi Twin Cities", rainfallMmPerHour: 112 }
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
      hospitalId: "hosp_1",
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
        rawText: "Faizabad grid station failure spreading. Shamsabad, Double Road and 6th Road completely without power.",
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
  ],

  karachi: [
    {
      step: 1,
      delayMs: 2000,
      type: "SYSTEM_ALERT",
      title: "🌊 SINDH PDMA FLASH FLOOD WARNING TRIGGERED",
      message: "Extreme monsoon cloudburst over Malir & Gadap catchment. Lyari Nadi gauge crossed 16.5 ft critical danger threshold.",
      data: { alertLevel: "RED", affectedArea: "Karachi Metropolitan Coast", rainfallMmPerHour: 98 }
    },
    {
      step: 2,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "🚨 21 people stranded on residential rooftop at Lyari Chakiwara. Water level rising fast!",
        category: "RESCUE_NEEDED",
        severity: 10,
        headcount: 21,
        locationName: "Lyari Chakiwara #2, Karachi",
        coords: [24.8720, 66.9950],
        needs: ["Rescue Jet-Boats", "Emergency Evacuation Teams"],
        languageDetected: "English",
        confidence: 0.98
      }
    },
    {
      step: 3,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "Shahrah-e-Faisal Karsaz underpass submerged under 4.5ft stormwater. Traffic completely halted in both tracks!",
        category: "ROAD_BLOCKED",
        severity: 8,
        headcount: 0,
        locationName: "Shahrah-e-Faisal (Karsaz Underpass), Karachi",
        coords: [24.8780, 67.0860],
        needs: ["Traffic Wardens", "Heavy Dewatering Engines"],
        languageDetected: "English",
        confidence: 0.97
      }
    },
    {
      step: 4,
      delayMs: 4000,
      type: "HOSPITAL_TELEMETRY_UPDATE",
      hospitalId: "karachi_jpmc",
      update: {
        capacity: 96,
        status: "OVERLOADED",
        occupiedBeds: 1584,
        icuAvailable: 0,
        acceptingEmergencies: false,
        alert: "Critical ICU saturation at JPMC. Diverting incoming trauma to Civil Hospital Karachi & AKUH."
      }
    },
    {
      step: 5,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "Saaf peenay ka paani khatam ho gaya hai Orangi Town Sector 11 me. 400+ logon ko paani ki shadeed zaroorat hai.",
        category: "WATER_SHORTAGE",
        severity: 8,
        headcount: 0,
        locationName: "Orangi Town Sector 11, Karachi",
        coords: [24.9450, 66.9850],
        needs: ["KW&SB Water Bowsers", "Purification Tablets"],
        languageDetected: "Roman Urdu",
        confidence: 0.95
      }
    },
    {
      step: 6,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "K-Electric Clifton 132kV Substation waterlogged. Power cutoff enforced across Clifton Block 2 and surrounding sectors.",
        category: "POWER_OUTAGE",
        severity: 8,
        headcount: 0,
        locationName: "Clifton Block 2 Grid Station, Karachi",
        coords: [24.8150, 67.0310],
        needs: ["Industrial De-watering Pumps", "Emergency Power Squads"],
        languageDetected: "English",
        confidence: 0.94
      }
    },
    {
      step: 7,
      delayMs: 3500,
      type: "DECISION_INTELLIGENCE_RECALCULATION",
      title: "🎯 PRIORITY DISPATCH RECALCULATED",
      message: "New Priority Zone #1 identified: Lyari River Basin & Chakiwara Cluster (48 total trapped victims, 2 overloaded hospitals, road accessibility: CRITICAL_BLOCKED). Immediate Navy/Rescue flotilla dispatch recommended."
    }
  ],

  lahore: [
    {
      step: 1,
      delayMs: 2000,
      type: "SYSTEM_ALERT",
      title: "🌊 PUNJAB PDMA FLASH FLOOD WARNING TRIGGERED",
      message: "River Ravi discharge surging past 65,000 cusecs. Shahdara gauging station recorded 19.8 ft danger threshold.",
      data: { alertLevel: "RED", affectedArea: "Lahore Division / Ravi Basin", rainfallMmPerHour: 104 }
    },
    {
      step: 2,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "🚨 18 people stranded on shop rooftops at Lakshmi Chowk. 4.5ft water accumulation rising rapidly!",
        category: "RESCUE_NEEDED",
        severity: 10,
        headcount: 18,
        locationName: "Lakshmi Chowk, Lahore",
        coords: [31.5680, 74.3210],
        needs: ["Rescue Inflatable Boats", "Paramedic Teams"],
        languageDetected: "English",
        confidence: 0.98
      }
    },
    {
      step: 3,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "Canal Bank Road Mall Underpass submerged under 4.8ft water. Both carriage tracks completely closed!",
        category: "ROAD_BLOCKED",
        severity: 8,
        headcount: 0,
        locationName: "Canal Bank Road (Mall Underpass), Lahore",
        coords: [31.5450, 74.3480],
        needs: ["WASA Dewatering Engines", "Traffic Diversion to Upper Mall"],
        languageDetected: "English",
        confidence: 0.96
      }
    },
    {
      step: 4,
      delayMs: 4000,
      type: "HOSPITAL_TELEMETRY_UPDATE",
      hospitalId: "lhr_mayo",
      update: {
        capacity: 96,
        status: "OVERLOADED",
        occupiedBeds: 2304,
        icuAvailable: 0,
        acceptingEmergencies: false,
        alert: "Mayo Hospital ICU saturated. Redirecting all incoming trauma casualties to Services Hospital."
      }
    },
    {
      step: 5,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "Misri Shah katchi abadi drinking water bore contaminated with flood runoff. 250+ residents without potable water.",
        category: "WATER_SHORTAGE",
        severity: 8,
        headcount: 0,
        locationName: "Misri Shah Basin, Lahore",
        coords: [31.5880, 74.3390],
        needs: ["WASA Water Bowsers", "Emergency Rehydration Salts"],
        languageDetected: "English",
        confidence: 0.95
      }
    },
    {
      step: 6,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "LESCO Qartaba grid substation flooded. Precautionary power cut active in Mozang and Chauburji sectors.",
        category: "POWER_OUTAGE",
        severity: 8,
        headcount: 0,
        locationName: "Qartaba Grid Station, Mozang, Lahore",
        coords: [31.5500, 74.3100],
        needs: ["LESCO Emergency Restoration", "Mobile De-watering Pumps"],
        languageDetected: "English",
        confidence: 0.93
      }
    },
    {
      step: 7,
      delayMs: 3500,
      type: "DECISION_INTELLIGENCE_RECALCULATION",
      title: "🎯 PRIORITY DISPATCH RECALCULATED",
      message: "New Priority Zone #1 identified: River Ravi Spillway & Shahdara Belt (41 total trapped victims, 2 overloaded hospitals). Immediate Rescue 1122 flotilla deployment ordered."
    }
  ],

  nowshera: [
    {
      step: 1,
      delayMs: 2000,
      type: "SYSTEM_ALERT",
      title: "🌊 KP PDMA HIGH FLOOD RED ALERT",
      message: "Kabul River discharge surging past 135,000 cusecs at Nowshera. Nowshera Bridge gauge crossed 24.8 ft danger mark.",
      data: { alertLevel: "RED", affectedArea: "Nowshera / KP Basin", rainfallMmPerHour: 118 }
    },
    {
      step: 2,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "🚨 22 villagers stranded on mosque rooftop at Hakimabad. Kabul River levee breached!",
        category: "RESCUE_NEEDED",
        severity: 10,
        headcount: 22,
        locationName: "Hakimabad Riverside, Nowshera",
        coords: [34.0180, 71.9620],
        needs: ["Army Aviation Winch Helicopters", "Rescue Jet-Boats"],
        languageDetected: "English",
        confidence: 0.99
      }
    },
    {
      step: 3,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "GT Road Nowshera Cantt bypass cut off by 5.2ft river torrent breach. Traffic halted!",
        category: "ROAD_BLOCKED",
        severity: 8,
        headcount: 0,
        locationName: "GT Road (Kabul River Bypass), Nowshera",
        coords: [34.0220, 71.9720],
        needs: ["Traffic Diversion to M-1", "Highway Warning Cones"],
        languageDetected: "English",
        confidence: 0.96
      }
    },
    {
      step: 4,
      delayMs: 4000,
      type: "HOSPITAL_TELEMETRY_UPDATE",
      hospitalId: "nowshera_qazi",
      update: {
        capacity: 95,
        status: "OVERLOADED",
        occupiedBeds: 618,
        icuAvailable: 0,
        acceptingEmergencies: false,
        alert: "Qazi Medical Complex emergency overloaded with flood trauma cases. Redirecting to DHQ Nowshera & CMH."
      }
    },
    {
      step: 5,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "Nowshera Cantt municipal water filtration plant inundated. 350+ families without clean drinking water.",
        category: "WATER_SHORTAGE",
        severity: 8,
        headcount: 0,
        locationName: "Nowshera Cantt Water Station",
        coords: [34.0200, 71.9810],
        needs: ["Potable Water Tankers", "Chlorine Sachets"],
        languageDetected: "English",
        confidence: 0.94
      }
    },
    {
      step: 6,
      delayMs: 4000,
      type: "NEW_REPORT",
      report: {
        rawText: "PESCO 132kV Nowshera City Grid tripped due to rising water. Complete city blackout.",
        category: "POWER_OUTAGE",
        severity: 8,
        headcount: 0,
        locationName: "Nowshera Grid Station",
        coords: [34.0090, 71.9690],
        needs: ["Mobile Generators", "Emergency Restoration"],
        languageDetected: "English",
        confidence: 0.93
      }
    },
    {
      step: 7,
      delayMs: 3500,
      type: "DECISION_INTELLIGENCE_RECALCULATION",
      title: "🎯 PRIORITY DISPATCH RECALCULATED",
      message: "New Priority Zone #1 identified: Kabul River Inundation & Hakimabad Basin (55 total trapped victims, road accessibility: CRITICAL_BLOCKED). 8 Jet-boats and air evacuation mobilized."
    }
  ]
};

// Default export for backward compatibility
export const simulationSteps = simulationStepsByRegion.isb_rwp;

export function getSimulationSteps(regionId) {
  if (regionId && simulationStepsByRegion[regionId]) {
    return simulationStepsByRegion[regionId];
  }
  return simulationStepsByRegion.isb_rwp;
}
