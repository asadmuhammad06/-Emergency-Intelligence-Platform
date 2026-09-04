// Dynamic Multi-Criteria Decision Intelligence Solver for Resource Allocation & Priority Zones

const REGIONAL_CLUSTERS = {
  isb_rwp: [
    {
      id: "zone_rwp_nullah_lai",
      zoneName: "Priority Zone #1 — Rawalpindi Nullah Lai & Dhok Kala Khan Basin",
      subDistricts: ["Dhok Kala Khan", "Gawalmandi", "Committee Chowk", "Nullah Lai Riverbed"],
      centerCoords: [33.6280, 73.0680],
      baseHeadcount: 20,
      roadAccessibility: "LOW",
      accessibilityScore: 2.2,
      waterShortageReported: true,
      powerOutageReported: true,
      actionPlan: [
        "Deploy Rescue 1122 Jet-Boats via Stadium Road entry point",
        "Divert all medical casualties north to PIMS Hospital via 9th Avenue bypass",
        "Air-drop clean drinking water purification sachets to stranded rooftop clusters",
        "Position Army mobile de-watering pumps at Committee Chowk underpass"
      ]
    },
    {
      id: "zone_faizabad_commercial",
      zoneName: "Priority Zone #2 — Faizabad Interchange & Sector I-8 Corridor",
      subDistricts: ["Faizabad Underpass", "Sector I-8/4", "Shamsabad Metro", "Commercial Market"],
      centerCoords: [33.6590, 73.0780],
      baseHeadcount: 14,
      roadAccessibility: "CRITICAL_BLOCKED",
      accessibilityScore: 1.5,
      waterShortageReported: false,
      powerOutageReported: true,
      actionPlan: [
        "Mobilize IESCO emergency substation repair unit",
        "Activate high-clearance 4x4 troop carriers for passenger extraction",
        "Enforce traffic blockage diversion towards Kashmir Highway"
      ]
    },
    {
      id: "zone_sector_i9_katchi",
      zoneName: "Priority Zone #3 — Sector I-9 Industrial & Settlement Pocket",
      subDistricts: ["Sector I-9/1", "Sector I-9/4", "Potohar Road", "Sadiqabad"],
      centerCoords: [33.6540, 73.0480],
      baseHeadcount: 10,
      roadAccessibility: "MODERATE",
      accessibilityScore: 6.5,
      waterShortageReported: true,
      powerOutageReported: false,
      actionPlan: [
        "Dispatch CDA Water Bowsers from Sector I-8 depot",
        "Set up mobile medical hydration camp at Sector I-9 community school"
      ]
    }
  ],
  karachi: [
    {
      id: "zone_khi_lyari",
      zoneName: "Priority Zone #1 — Lyari River Basin & Chakiwara Cluster",
      subDistricts: ["Lyari", "Chakiwara", "Golimar", "Lyari Nadi"],
      centerCoords: [24.8720, 66.9950],
      baseHeadcount: 27,
      roadAccessibility: "CRITICAL_BLOCKED",
      accessibilityScore: 1.8,
      waterShortageReported: true,
      powerOutageReported: true,
      actionPlan: [
        "Deploy Rescue 1122 Jet-Boats via Mauripur Road access",
        "Establish field casualty triage camp redirecting to Civil Hospital Karachi",
        "Deploy mobile high-discharge dewatering bowsers to Chakiwara underpass"
      ]
    },
    {
      id: "zone_khi_malir",
      zoneName: "Priority Zone #2 — Malir River & Korangi Causeway Crossing",
      subDistricts: ["Korangi", "Malir", "Korangi Creek", "Causeway"],
      centerCoords: [24.8350, 67.0980],
      baseHeadcount: 18,
      roadAccessibility: "LOW",
      accessibilityScore: 2.5,
      waterShortageReported: true,
      powerOutageReported: false,
      actionPlan: [
        "Deploy Army Aviation / Navy evacuation hovercrafts",
        "Reroute industrial freight via Jam Sadiq Bridge",
        "Stage mobile drinking water filtration bowsers at Korangi Crossing"
      ]
    },
    {
      id: "zone_khi_faisal",
      zoneName: "Priority Zone #3 — Shahrah-e-Faisal & Clifton Drainage Belt",
      subDistricts: ["Shahrah-e-Faisal", "Karsaz", "Clifton", "Orangi"],
      centerCoords: [24.8780, 67.0860],
      baseHeadcount: 12,
      roadAccessibility: "MODERATE",
      accessibilityScore: 5.0,
      waterShortageReported: false,
      powerOutageReported: true,
      actionPlan: [
        "Mobilize K-Electric emergency substation restoration squad",
        "Deploy heavy drainage tractors to clear Karsaz underpass"
      ]
    }
  ],
  lahore: [
    {
      id: "zone_lhr_ravi",
      zoneName: "Priority Zone #1 — River Ravi Spillway & Shahdara Belt",
      subDistricts: ["Shahdara", "Ravi", "Badami Bagh"],
      centerCoords: [31.6210, 74.2880],
      baseHeadcount: 23,
      roadAccessibility: "LOW",
      accessibilityScore: 2.4,
      waterShortageReported: true,
      powerOutageReported: true,
      actionPlan: [
        "Deploy Rescue 1122 flood rescue flotilla via Ring Road ingress",
        "Direct trauma casualties to Mayo and Services hospitals",
        "Air-drop dry rations and lifejackets along Shahdara riverbed"
      ]
    },
    {
      id: "zone_lhr_lakshmi",
      zoneName: "Priority Zone #2 — Lakshmi Chowk & Central Depression Basin",
      subDistricts: ["Lakshmi Chowk", "Anarkali", "Mozang", "Qartaba"],
      centerCoords: [31.5680, 74.3210],
      baseHeadcount: 19,
      roadAccessibility: "CRITICAL_BLOCKED",
      accessibilityScore: 2.0,
      waterShortageReported: true,
      powerOutageReported: true,
      actionPlan: [
        "WASA Lahore heavy dewatering pump deployment",
        "Evacuate shopkeeper rooftop clusters via shallow draft boats"
      ]
    }
  ],
  nowshera: [
    {
      id: "zone_nws_kabul",
      zoneName: "Priority Zone #1 — Kabul River Inundation & Hakimabad Basin",
      subDistricts: ["Hakimabad", "Nowshera Cantt", "Kabul River", "Nowshera Kalan"],
      centerCoords: [34.0180, 71.9620],
      baseHeadcount: 33,
      roadAccessibility: "CRITICAL_BLOCKED",
      accessibilityScore: 1.6,
      waterShortageReported: true,
      powerOutageReported: true,
      actionPlan: [
        "Deploy Army Aviation winch helicopters for stranded rooftop families",
        "Operate 8 jet-boats from Nowshera Sports Complex depot",
        "Reroute highway traffic to M-1 motorway"
      ]
    }
  ],
  swat: [
    {
      id: "zone_swt_mingora",
      zoneName: "Priority Zone #1 — Swat River Torrent & Fizagat Riverside",
      subDistricts: ["Fizagat", "Madyan", "Mingora", "Bahrain"],
      centerCoords: [34.7950, 72.3780],
      baseHeadcount: 23,
      roadAccessibility: "CRITICAL_BLOCKED",
      accessibilityScore: 1.5,
      waterShortageReported: true,
      powerOutageReported: true,
      actionPlan: [
        "Aviation helicopter rescue for stranded tourists at Fizagat",
        "Rescue 1122 alpine rope teams deployment to Madyan road"
      ]
    }
  ],
  sukkur: [
    {
      id: "zone_skr_barrage",
      zoneName: "Priority Zone #1 — Indus River Bund & Rohri Seepage Zone",
      subDistricts: ["Rohri", "Bund", "Bandar Road", "Sukkur Barrage"],
      centerCoords: [27.6920, 68.8950],
      baseHeadcount: 18,
      roadAccessibility: "LOW",
      accessibilityScore: 3.0,
      waterShortageReported: true,
      powerOutageReported: false,
      actionPlan: [
        "Deploy Sindh Irrigation emergency sandbagging unit",
        "Rescue motorboats deployment from Ayub Gate depot"
      ]
    }
  ],
  dgkhan: [
    {
      id: "zone_dgk_vidor",
      zoneName: "Priority Zone #1 — Vidor Hill Torrent & Indus Highway Breach",
      subDistricts: ["Vidor", "Indus Highway", "Taunsa", "KM-45"],
      centerCoords: [30.0620, 70.5850],
      baseHeadcount: 20,
      roadAccessibility: "CRITICAL_BLOCKED",
      accessibilityScore: 1.7,
      waterShortageReported: true,
      powerOutageReported: false,
      actionPlan: [
        "Deploy 4x4 high-clearance rescue troop carriers",
        "Emergency road earthwork and diversion via Multan highway"
      ]
    }
  ],
  quetta: [
    {
      id: "zone_qta_hanna",
      zoneName: "Priority Zone #1 — Hanna Urak & Sariab Road Flash Runoff",
      subDistricts: ["Hanna", "Sariab", "Western Bypass", "Brewery"],
      centerCoords: [30.2520, 67.0980],
      baseHeadcount: 22,
      roadAccessibility: "LOW",
      accessibilityScore: 2.8,
      waterShortageReported: false,
      powerOutageReported: true,
      actionPlan: [
        "Deploy Frontier Corps (FC) mountain rescue units",
        "Evacuate adobe houses along Sariab road"
      ]
    }
  ]
};

export function calculatePriorityZones(reports = [], hospitals = [], hazardZones = [], roadBlocks = [], regionId = null) {
  // Overloaded hospitals count in the network
  const overloadedHospitals = hospitals.filter(h => (h.capacity || 0) >= 85);
  const overloadedCount = overloadedHospitals.length;

  // Detect city/region if not passed
  let matchedRegionId = regionId;
  if (!matchedRegionId && reports.length > 0) {
    const rep = reports[0];
    const coords = rep.coords || [0, 0];
    if (coords[0] < 26) matchedRegionId = 'karachi';
    else if (coords[0] > 27 && coords[0] < 28.5) matchedRegionId = 'sukkur';
    else if (coords[0] >= 29.5 && coords[0] <= 31 && coords[1] < 68) matchedRegionId = 'quetta';
    else if (coords[0] >= 29.5 && coords[0] <= 31 && coords[1] >= 70) matchedRegionId = 'dgkhan';
    else if (coords[0] > 31 && coords[0] < 32.5) matchedRegionId = 'lahore';
    else if (coords[0] > 34.5) matchedRegionId = 'swat';
    else if (coords[0] > 33.9 && coords[0] < 34.5) matchedRegionId = 'nowshera';
    else matchedRegionId = 'isb_rwp';
  }

  // Pick base clusters for detected region
  const baseClusters = REGIONAL_CLUSTERS[matchedRegionId] || REGIONAL_CLUSTERS.isb_rwp;

  // Dynamically aggregate arbitrary reports into clusters
  const dynamicClusters = baseClusters.map(cluster => {
    // Find reports matching this cluster's subDistricts
    const matchingReports = reports.filter(r => {
      const text = `${r.rawText || ''} ${r.locationName || ''} ${r.title || ''}`.toLowerCase();
      return cluster.subDistricts.some(sd => text.includes(sd.toLowerCase()));
    });

    const additionalHeadcount = matchingReports.reduce((sum, r) => sum + (r.headcount || 0), 0);
    const affectedPeopleCount = cluster.baseHeadcount + additionalHeadcount;

    const hasWaterShortage = cluster.waterShortageReported || matchingReports.some(r => r.category === 'WATER_SHORTAGE' || r.category === 'water_shortage');
    const hasPowerOutage = cluster.powerOutageReported || matchingReports.some(r => r.category === 'POWER_OUTAGE' || r.category === 'power_outage');

    // Multi-Criteria Decision Intelligence Formula:
    // Urgency = (Headcount * 2.5) + (Overloaded Hospitals * 18) + Scarcity - Accessibility
    const rawScore = (affectedPeopleCount * 2.2) + (overloadedCount * 14) + (hasWaterShortage ? 12 : 0) + (hasPowerOutage ? 8 : 0) + (10 - cluster.accessibilityScore) * 1.6;
    const urgencyScore = Math.min(99.4, Math.max(45.0, Math.round(rawScore * 10) / 10));

    const riskLevel = urgencyScore >= 85 
      ? "CRITICAL_LIFE_THREATENING"
      : urgencyScore >= 70
        ? "HIGH_INFRASTRUCTURE_FAILURE"
        : "MODERATE_RELIEF_PRIORITY";

    return {
      id: cluster.id,
      zoneName: cluster.zoneName,
      subDistricts: cluster.subDistricts,
      centerCoords: cluster.centerCoords,
      affectedPeopleCount,
      overloadedHospitalsCount: overloadedCount,
      waterShortageReported: hasWaterShortage,
      powerOutageReported: hasPowerOutage,
      roadAccessibility: cluster.roadAccessibility,
      accessibilityScore: cluster.accessibilityScore,
      urgencyScore,
      riskLevel,
      recommendedDispatch: {
        boats: Math.max(1, Math.ceil(affectedPeopleCount / 12)),
        helicopters: affectedPeopleCount >= 30 ? 1 : 0,
        waterBowsersLiters: hasWaterShortage ? 10000 : 4000,
        medicalTeams: Math.max(1, Math.ceil(affectedPeopleCount / 18)),
        emergencyRations: Math.max(400, affectedPeopleCount * 30)
      },
      status: "DISPATCH_PENDING",
      keySummary: `${affectedPeopleCount} people identified in critical catchment. ${overloadedCount} nearby hospitals at surge. Road accessibility: ${cluster.roadAccessibility}.`,
      actionPlan: cluster.actionPlan
    };
  });

  // Check if there are arbitrary reports outside the base 3 clusters
  const arbitraryReports = reports.filter(r => {
    const text = `${r.rawText || ''} ${r.locationName || ''}`.toLowerCase();
    const matchesBase = baseClusters.some(bc => bc.subDistricts.some(sd => text.includes(sd.toLowerCase())));
    return !matchesBase && (r.headcount > 0 || r.severity >= 7);
  });

  if (arbitraryReports.length > 0) {
    // Generate an ad-hoc emergency cluster for arbitrary input
    const primaryArbitrary = arbitraryReports[0];
    const arbitraryHeadcount = arbitraryReports.reduce((sum, r) => sum + (r.headcount || 4), 0);
    const rawScore = (arbitraryHeadcount * 2.5) + (overloadedCount * 12) + 15;
    const urgencyScore = Math.min(98.5, Math.round(rawScore * 10) / 10);

    dynamicClusters.push({
      id: `zone_arbitrary_${Date.now()}`,
      zoneName: `Priority Zone #4 — ${primaryArbitrary.locationName || 'Ad-Hoc Community Sector'}`,
      subDistricts: [primaryArbitrary.locationName || 'Field Incident Point'],
      centerCoords: primaryArbitrary.coords || [33.6844, 73.0479],
      affectedPeopleCount: arbitraryHeadcount,
      overloadedHospitalsCount: overloadedCount,
      waterShortageReported: true,
      powerOutageReported: false,
      roadAccessibility: "UNKNOWN_ASSESSING",
      accessibilityScore: 3.5,
      urgencyScore,
      riskLevel: "CRITICAL_LIFE_THREATENING",
      recommendedDispatch: {
        boats: Math.max(1, Math.ceil(arbitraryHeadcount / 10)),
        helicopters: arbitraryHeadcount >= 20 ? 1 : 0,
        waterBowsersLiters: 6000,
        medicalTeams: 1,
        emergencyRations: arbitraryHeadcount * 25
      },
      status: "DISPATCH_PENDING",
      keySummary: `Field SOS: ${arbitraryHeadcount} citizens reported in urgent distress at ${primaryArbitrary.locationName || 'unassigned coordinates'}. Immediate response required.`,
      actionPlan: [
        "Dispatch nearest Quick Response Unit (Rescue 1122)",
        "Establish visual reconnaissance perimeter",
        "Coordinate casualty transfer to available tertiary hospital"
      ]
    });
  }

  // Sort dynamically by urgencyScore descending & assign rank
  dynamicClusters.sort((a, b) => b.urgencyScore - a.urgencyScore);
  dynamicClusters.forEach((cluster, idx) => {
    cluster.rank = idx + 1;
    cluster.zoneName = cluster.zoneName.replace(/Priority Zone #\d+/, `Priority Zone #${idx + 1}`);
  });

  return dynamicClusters;
}
