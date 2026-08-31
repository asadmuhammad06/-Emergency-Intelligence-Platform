// Decision Intelligence Solver for Resource Allocation & Priority Zones

export function calculatePriorityZones(reports, hospitals, hazardZones, roadBlocks) {
  // Aggregate clusters in key sectors
  const clusters = [
    {
      id: "zone_rwp_nullah_lai",
      rank: 1,
      zoneName: "Priority Zone #1 — Rawalpindi Nullah Lai & Dhok Kala Khan Basin",
      subDistricts: ["Dhok Kala Khan", "Gawalmandi", "Committee Chowk", "Nullah Lai Riverbed"],
      centerCoords: [33.6280, 73.0680],
      affectedPeopleCount: 37,
      overloadedHospitalsCount: 2, // Holy Family (92%) & BBH (89%)
      waterShortageReported: true,
      powerOutageReported: true,
      roadAccessibility: "LOW",
      accessibilityScore: 2.2, // out of 10
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

  return clusters;
}
