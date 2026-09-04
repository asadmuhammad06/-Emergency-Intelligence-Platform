// Dynamic Multi-Criteria Decision Intelligence Solver for Resource Allocation & Priority Zones

export function calculatePriorityZones(reports = [], hospitals = [], hazardZones = [], roadBlocks = []) {
  // Overloaded hospitals count in the network
  const overloadedHospitals = hospitals.filter(h => (h.capacity || 0) >= 85);
  const overloadedCount = overloadedHospitals.length;

  // Base clusters representing established municipal disaster basins
  const baseClusters = [
    {
      id: "zone_rwp_nullah_lai",
      zoneName: "Priority Zone #1 — Rawalpindi Nullah Lai & Dhok Kala Khan Basin",
      subDistricts: ["Dhok Kala Khan", "Gawalmandi", "Committee Chowk", "Nullah Lai Riverbed"],
      centerCoords: [33.6280, 73.0680],
      baseHeadcount: 23,
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
  ];

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
