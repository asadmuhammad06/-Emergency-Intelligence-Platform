// Comprehensive City Intelligence Catalog for all Pakistan Regions
export const CITY_CATALOG = {
  isb_rwp: {
    riverBasin: 'Nullah Lai Basin',
    sensorName: 'Kattarian Sensor',
    baseGaugeFeet: 15.2,
    dangerLimitFeet: 20.0,
    hospitals: [
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
    ],
    reports: [
      {
        id: 'isb-rep-1',
        rawText: 'Dhok Kala Khan: 12 afrad chat par phansay hain, pani 4.5ft charh chuka hai. Need emergency rescue boat urgently.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 12,
        locationName: 'Dhok Kala Khan, Rawalpindi',
        coords: [33.6380, 73.0760],
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        status: 'CRITICAL',
        source: 'CITIZEN_SOS',
        needs: ['Rescue Jet-Boat', 'Life Jackets', 'Paramedic Unit']
      },
      {
        id: 'isb-rep-2',
        rawText: 'Commercial Market katchi abadi: 8 civilians stranded on boundary wall due to rapid flood runoff.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 8,
        locationName: 'Commercial Market, Satellite Town',
        coords: [33.6310, 73.0690],
        timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        status: 'VERIFIED',
        source: 'CITIZEN_SOS',
        needs: ['Evacuation Support', 'Emergency Ropes']
      },
      {
        id: 'isb-rep-3',
        rawText: 'Faizabad Interchange corridor completely submerged under 4.2ft water. All ambulance passage blocked.',
        category: 'ROAD_BLOCKED',
        severity: 8,
        headcount: 0,
        locationName: 'Faizabad Interchange, Islamabad Highway',
        coords: [33.6580, 73.0780],
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        status: 'VERIFIED',
        source: 'TRAFFIC_EOC',
        needs: ['Traffic Diversion', 'Heavy Water Pump Bowsers']
      },
      {
        id: 'isb-rep-4',
        rawText: 'IJP Road low underpass flooded up to 3.5ft. Three civilian vehicles trapped in stagnant runoff.',
        category: 'ROAD_BLOCKED',
        severity: 7,
        headcount: 4,
        locationName: 'IJP Road Double Road Section',
        coords: [33.6445, 73.0620],
        timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        status: 'REPORTED',
        source: 'RESCUE_1122',
        needs: ['Tow Trucks', 'Drainage Pumps']
      },
      {
        id: 'isb-rep-5',
        rawText: 'Holy Family Hospital ICU reached 92% capacity. 0 ventilator beds available. Ambulances must redirect to PIMS.',
        category: 'HOSPITAL_CAPACITY',
        severity: 9,
        headcount: 0,
        locationName: 'Holy Family Hospital, Satellite Town',
        coords: [33.6265, 73.0712],
        timestamp: new Date(Date.now() - 1000 * 60 * 26).toISOString(),
        status: 'VERIFIED',
        source: 'HOSPITAL_EOC',
        needs: ['Patient Diversion to PIMS', 'Oxygen Cylinder Reserves']
      },
      {
        id: 'isb-rep-6',
        rawText: 'Main drinking water pipeline ruptured near Sadiqabad; 25 families stranded without potable drinking water.',
        category: 'WATER_SHORTAGE',
        severity: 7,
        headcount: 25,
        locationName: 'Sadiqabad Basin, Rawalpindi',
        coords: [33.6220, 73.0810],
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: 'VERIFIED',
        source: 'WASA_SURVEILLANCE',
        needs: ['Water Bowser Fleet', 'Water Purification Tablets']
      },
      {
        id: 'isb-rep-7',
        rawText: 'Sector I-9/4 Industrial Substation flooded; 132kV feeder tripped to prevent electrocution.',
        category: 'POWER_OUTAGE',
        severity: 8,
        headcount: 0,
        locationName: 'Sector I-9/4 Grid Station, Islamabad',
        coords: [33.6540, 73.0480],
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        status: 'VERIFIED',
        source: 'IESCO_DISPATCH',
        needs: ['Industrial De-watering Pumps', 'Diesel Fuel Supply']
      }
    ],
    hazardZones: [
      {
        id: 'isb_hazard_lai',
        type: 'FLOOD_ZONE',
        name: 'Nullah Lai Flash Flood Catchment Zone',
        severity: 'CRITICAL',
        waterDepthMeters: 2.2,
        status: 'EXPANDING',
        polygon: [
          [33.6420, 73.0520],
          [33.6350, 73.0640],
          [33.6210, 73.0720],
          [33.6080, 73.0780],
          [33.6020, 73.0680],
          [33.6150, 73.0550],
          [33.6300, 73.0450]
        ],
        description: 'Water level crossed danger mark at Kattarian and Gawalmandi bridges.',
        source: 'WASA_HYDROLOGY'
      }
    ],
    roadBlocks: [
      {
        id: 'isb_block_1',
        roadName: 'Islamabad Expressway (Faizabad Underpass)',
        coords: [33.6580, 73.0780],
        status: 'CLOSED',
        reason: '4.5ft flood water accumulation + stalled buses',
        detourRecommended: 'Via 9th Avenue & Srinagar Highway',
        source: 'TRAFFIC_POLICE'
      },
      {
        id: 'isb_block_2',
        roadName: 'Murree Road (Committee Chowk Underpass)',
        coords: [33.6120, 73.0670],
        status: 'CLOSED',
        reason: 'Nullah Lai overflow & debris blockage',
        detourRecommended: 'Via Rawal Road or Airport Corridor',
        source: 'RESCUE_1122'
      }
    ],
    reliefHubs: [
      {
        id: 'isb_hub_1',
        name: 'Liaquat Bagh Provincial Relief Base',
        coords: [33.6030, 73.0650],
        type: 'DISASTER_LOGISTICS_HUB',
        status: 'OPERATIONAL',
        managedBy: 'NDMA & Rescue 1122',
        waterAvailable: true,
        drinkingWaterLiters: 9500,
        foodPackets: 850,
        rescueBoats: 6,
        source: 'EOC_REGISTERED'
      },
      {
        id: 'isb_hub_2',
        name: 'Fatima Jinnah EOC Staging Depot',
        coords: [33.6930, 73.0180],
        type: 'MEDICAL_STAGING_CAMP',
        status: 'OPERATIONAL',
        managedBy: 'Pakistan Red Crescent Society (PRCS)',
        waterAvailable: true,
        drinkingWaterLiters: 15000,
        foodPackets: 1200,
        rescueBoats: 4,
        source: 'EOC_REGISTERED'
      }
    ]
  },

  karachi: {
    riverBasin: 'Lyari / Malir Basin',
    sensorName: 'Lyari Nadi Gauge',
    baseGaugeFeet: 12.8,
    dangerLimitFeet: 16.0,
    hospitals: [
      {
        id: 'karachi_jpmc',
        name: 'Jinnah Postgraduate Medical Centre (JPMC)',
        location: 'Rafiqui Shaheed Road, Karachi',
        coords: [24.8516, 67.0494],
        totalBeds: 1650,
        occupiedBeds: 1520,
        capacity: 92,
        icuAvailable: 3,
        powerBackup: 'Generator Backup Active',
        status: 'OVERLOADED',
        acceptingEmergencies: false,
        phone: '+92-21-99201300',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'karachi_civil',
        name: 'Dr. Ruth K.M. Pfau Civil Hospital',
        location: 'Baba-e-Urdu Road, Saddar, Karachi',
        coords: [24.8596, 67.0101],
        totalBeds: 1900,
        occupiedBeds: 1425,
        capacity: 75,
        icuAvailable: 22,
        powerBackup: 'Grid + Dual Generators',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-21-99215740',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'karachi_aku',
        name: 'Aga Khan University Hospital (AKUH)',
        location: 'Stadium Road, Karachi',
        coords: [24.8918, 67.0743],
        totalBeds: 700,
        occupiedBeds: 420,
        capacity: 60,
        icuAvailable: 26,
        powerBackup: 'Triple Grid Redundancy',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-21-34930051',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'karachi_indus',
        name: 'The Indus Hospital Korangi',
        location: 'Korangi Crossing, Karachi',
        coords: [24.8258, 67.1124],
        totalBeds: 400,
        occupiedBeds: 280,
        capacity: 70,
        icuAvailable: 14,
        powerBackup: 'Solar Hybrid + Generator',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-21-35112709',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'karachi_abbasi',
        name: 'Abbasi Shaheed Hospital',
        location: 'Block M, Nazimabad, Karachi',
        coords: [24.9180, 67.0335],
        totalBeds: 850,
        occupiedBeds: 680,
        capacity: 80,
        icuAvailable: 8,
        powerBackup: 'Operational',
        status: 'WARNING',
        acceptingEmergencies: true,
        phone: '+92-21-99260400',
        source: 'EOC_REGISTERED'
      }
    ],
    reports: [
      {
        id: 'khi-rep-1',
        rawText: 'Lyari Chakiwara: 16 afrad makaan ki chat par phansay hain, Lyari Nadi ka overflow barh raha hai. Boat rescue urgently required.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 16,
        locationName: 'Lyari Chakiwara #2, Karachi',
        coords: [24.8720, 66.9950],
        timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
        status: 'CRITICAL',
        source: 'CITIZEN_SOS',
        needs: ['Rescue Jet-Boats', 'Life Jackets', 'Emergency Ropes']
      },
      {
        id: 'khi-rep-2',
        rawText: 'Korangi Creek Katchi Abadi: 11 civilians trapped due to Malir River spillway runoff. Rapid water current.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 11,
        locationName: 'Korangi Creek Sector 8-B, Karachi',
        coords: [24.8200, 67.1190],
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        status: 'VERIFIED',
        source: 'CITIZEN_SOS',
        needs: ['Evacuation Convoy', 'First Aid Kits']
      },
      {
        id: 'khi-rep-3',
        rawText: 'Shahrah-e-Faisal Karsaz Underpass submerged under 4.0ft water. Traffic halted in both directions.',
        category: 'ROAD_BLOCKED',
        severity: 8,
        headcount: 0,
        locationName: 'Shahrah-e-Faisal (Karsaz Underpass), Karachi',
        coords: [24.8780, 67.0860],
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        status: 'VERIFIED',
        source: 'TRAFFIC_POLICE',
        needs: ['Heavy Dewatering Bowsers', 'Traffic Diverters']
      },
      {
        id: 'khi-rep-4',
        rawText: 'Korangi Causeway impassable due to raging Malir River torrent. Three delivery vans submerged.',
        category: 'ROAD_BLOCKED',
        severity: 8,
        headcount: 3,
        locationName: 'Korangi Causeway Crossing, Karachi',
        coords: [24.8350, 67.0980],
        timestamp: new Date(Date.now() - 1000 * 60 * 19).toISOString(),
        status: 'CRITICAL',
        source: 'RESCUE_1122',
        needs: ['Heavy Tow Cranes', 'Police Cordon']
      },
      {
        id: 'khi-rep-5',
        rawText: 'JPMC Trauma Emergency saturated at 92%. Diverting incoming flood casualties to Civil Hospital & AKUH.',
        category: 'HOSPITAL_CAPACITY',
        severity: 9,
        headcount: 0,
        locationName: 'JPMC Emergency Ward, Karachi',
        coords: [24.8516, 67.0494],
        timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
        status: 'VERIFIED',
        source: 'HOSPITAL_EOC',
        needs: ['Casualty Redirection', 'IV Saline Reserves']
      },
      {
        id: 'khi-rep-6',
        rawText: 'Main water pipeline ruptured near Orangi Town Sector 11; 45 families completely without potable water.',
        category: 'WATER_SHORTAGE',
        severity: 7,
        headcount: 45,
        locationName: 'Orangi Town Sector 11, Karachi',
        coords: [24.9450, 66.9850],
        timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
        status: 'VERIFIED',
        source: 'KW&SB_ALERT',
        needs: ['Emergency Water Bowsers', 'Water Purification Tablets']
      },
      {
        id: 'khi-rep-7',
        rawText: 'K-Electric 132kV Substation flooded in Clifton Block 2. Power severed to prevent electrocution.',
        category: 'POWER_OUTAGE',
        severity: 8,
        headcount: 0,
        locationName: 'Clifton Block 2 Grid Station, Karachi',
        coords: [24.8150, 67.0310],
        timestamp: new Date(Date.now() - 1000 * 60 * 33).toISOString(),
        status: 'VERIFIED',
        source: 'K_ELECTRIC',
        needs: ['Industrial Substation Pumps', 'Mobile Power Backup']
      }
    ],
    hazardZones: [
      {
        id: 'khi_hazard_lyari',
        type: 'FLOOD_ZONE',
        name: 'Lyari River & Low-Lying Coastal Inundation Belt',
        severity: 'CRITICAL',
        waterDepthMeters: 1.9,
        status: 'EXPANDING',
        polygon: [
          [24.8850, 66.9800],
          [24.8720, 67.0100],
          [24.8550, 67.0300],
          [24.8400, 67.0200],
          [24.8500, 66.9850],
          [24.8700, 66.9700]
        ],
        description: 'Lyari Nadi cresting past danger mark. Severe urban runoff flooding Chakiwara, Golimar, and surrounding slums.',
        source: 'PDMA_SINDH'
      }
    ],
    roadBlocks: [
      {
        id: 'khi_block_1',
        roadName: 'Shahrah-e-Faisal (Karsaz Underpass Section)',
        coords: [24.8780, 67.0860],
        status: 'CLOSED',
        reason: '4.0ft stormwater accumulation across both lanes',
        detourRecommended: 'Divert via Rashid Minhas Road or University Road',
        source: 'KARACHI_TRAFFIC_POLICE'
      },
      {
        id: 'khi_block_2',
        roadName: 'Korangi Causeway (Malir River Ingress)',
        coords: [24.8350, 67.0980],
        status: 'CLOSED',
        reason: 'Malir River discharge overtopping causeway bridge',
        detourRecommended: 'Use Korangi Industrial Area Jam Sadiq Bridge',
        source: 'RESCUE_1122'
      }
    ],
    reliefHubs: [
      {
        id: 'khi_hub_1',
        name: 'Karachi Expo Centre Provincial Staging Camp',
        coords: [24.8980, 67.0860],
        type: 'DISASTER_LOGISTICS_HUB',
        status: 'OPERATIONAL',
        managedBy: 'PDMA Sindh & Pakistan Navy',
        waterAvailable: true,
        drinkingWaterLiters: 18000,
        foodPackets: 1600,
        rescueBoats: 9,
        source: 'EOC_REGISTERED'
      },
      {
        id: 'khi_hub_2',
        name: 'Polo Ground (Baradari) Emergency Relief Depot',
        coords: [24.8520, 67.0270],
        type: 'MEDICAL_STAGING_CAMP',
        status: 'OPERATIONAL',
        managedBy: 'Pakistan Red Crescent & Edhi Foundation',
        waterAvailable: true,
        drinkingWaterLiters: 11000,
        foodPackets: 950,
        rescueBoats: 5,
        source: 'EOC_REGISTERED'
      }
    ]
  },

  lahore: {
    riverBasin: 'Ravi River Basin',
    sensorName: 'Shahdara Gauging Post',
    baseGaugeFeet: 14.1,
    dangerLimitFeet: 19.0,
    hospitals: [
      {
        id: 'lhr_mayo',
        name: 'Mayo Hospital Lahore',
        location: 'Anarkali / Hospital Road, Lahore',
        coords: [31.5725, 74.3140],
        totalBeds: 2400,
        occupiedBeds: 2210,
        capacity: 92,
        icuAvailable: 4,
        powerBackup: 'Triple Backup Generator',
        status: 'OVERLOADED',
        acceptingEmergencies: false,
        phone: '+92-42-99211100',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'lhr_services',
        name: 'Services Hospital Lahore',
        location: 'Jail Road, Shadman, Lahore',
        coords: [31.5390, 74.3410],
        totalBeds: 1200,
        occupiedBeds: 890,
        capacity: 74,
        icuAvailable: 21,
        powerBackup: 'Grid + Solar Hybrid',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-42-99203402',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'lhr_jinnah',
        name: 'Jinnah Hospital Lahore',
        location: 'Faisal Town / Allama Iqbal Town, Lahore',
        coords: [31.4845, 74.2980],
        totalBeds: 1450,
        occupiedBeds: 1050,
        capacity: 72,
        icuAvailable: 24,
        powerBackup: 'Operational',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-42-99231400',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'lhr_gangaram',
        name: 'Sir Ganga Ram Hospital',
        location: 'Queens Road, Jubilee Town, Lahore',
        coords: [31.5540, 74.3180],
        totalBeds: 900,
        occupiedBeds: 710,
        capacity: 78,
        icuAvailable: 12,
        powerBackup: 'Operational',
        status: 'WARNING',
        acceptingEmergencies: true,
        phone: '+92-42-99200572',
        source: 'EOC_REGISTERED'
      }
    ],
    reports: [
      {
        id: 'lhr-rep-1',
        rawText: 'Lakshmi Chowk low-lying settlement: 14 people stranded on shop rooftops, 4.5ft rainwater accumulation.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 14,
        locationName: 'Lakshmi Chowk, Lahore',
        coords: [31.5680, 74.3210],
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        status: 'CRITICAL',
        source: 'CITIZEN_SOS',
        needs: ['Rescue Boats', 'Life Jackets', 'Paramedic Team']
      },
      {
        id: 'lhr-rep-2',
        rawText: 'Shahdara Old Ravi Bridge vicinity: 9 villagers cut off by sudden river spillway discharge.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 9,
        locationName: 'Shahdara Town (Ravi Embankment), Lahore',
        coords: [31.6210, 74.2880],
        timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        status: 'VERIFIED',
        source: 'CITIZEN_SOS',
        needs: ['High-Clearance Troop Carriers', 'Ropes']
      },
      {
        id: 'lhr-rep-3',
        rawText: 'Canal Bank Road (Mall Road Underpass) completely drowned under 4.8ft water. Both carriage lanes closed.',
        category: 'ROAD_BLOCKED',
        severity: 8,
        headcount: 0,
        locationName: 'Canal Bank Road (Mall Underpass), Lahore',
        coords: [31.5450, 74.3480],
        timestamp: new Date(Date.now() - 1000 * 60 * 17).toISOString(),
        status: 'VERIFIED',
        source: 'TRAFFIC_POLICE',
        needs: ['Heavy Dewatering Engines', 'Police Detour']
      },
      {
        id: 'lhr-rep-4',
        rawText: 'Badami Bagh Circular Road blocked by waterlogging and three stalled commercial logistics carriers.',
        category: 'ROAD_BLOCKED',
        severity: 7,
        headcount: 3,
        locationName: 'Badami Bagh Circular Road, Lahore',
        coords: [31.5900, 74.3150],
        timestamp: new Date(Date.now() - 1000 * 60 * 21).toISOString(),
        status: 'REPORTED',
        source: 'RESCUE_1122',
        needs: ['Tow Trucks', 'Drainage Pumps']
      },
      {
        id: 'lhr-rep-5',
        rawText: 'Mayo Hospital emergency ward near full capacity. 0 ICU beds open. Casualties being sent to Services Hospital.',
        category: 'HOSPITAL_CAPACITY',
        severity: 9,
        headcount: 0,
        locationName: 'Mayo Hospital Emergency, Lahore',
        coords: [31.5725, 74.3140],
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        status: 'VERIFIED',
        source: 'HOSPITAL_EOC',
        needs: ['Patient Diversion', 'Oxygen Supplies']
      },
      {
        id: 'lhr-rep-6',
        rawText: 'Drinking water bore contaminated near Misri Shah; urgent clean drinking water required for 55 families.',
        category: 'WATER_SHORTAGE',
        severity: 8,
        headcount: 55,
        locationName: 'Misri Shah Basin, Lahore',
        coords: [31.5880, 74.3390],
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: 'VERIFIED',
        source: 'WASA_LAHORE',
        needs: ['WASA Water Bowsers', 'Filtration Units']
      },
      {
        id: 'lhr-rep-7',
        rawText: 'LESCO 132kV Qartaba Grid Substation flooded; electricity cut in Mozang and Chauburji for public safety.',
        category: 'POWER_OUTAGE',
        severity: 8,
        headcount: 0,
        locationName: 'Qartaba Grid Station, Mozang, Lahore',
        coords: [31.5500, 74.3100],
        timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
        status: 'VERIFIED',
        source: 'LESCO_ALERT',
        needs: ['Substation Drainage', 'Mobile Generators']
      }
    ],
    hazardZones: [
      {
        id: 'lhr_hazard_ravi',
        type: 'FLOOD_ZONE',
        name: 'River Ravi Spillway & Shahdara Inundation Fan',
        severity: 'CRITICAL',
        waterDepthMeters: 2.1,
        status: 'EXPANDING',
        polygon: [
          [31.6350, 74.2700],
          [31.6200, 74.3100],
          [31.5950, 74.3050],
          [31.5800, 74.2800],
          [31.6000, 74.2550]
        ],
        description: 'Ravi river discharge rising past 65,000 cusecs. Shahdara and low-lying riverbed settlements at imminent breach risk.',
        source: 'PDMA_PUNJAB'
      }
    ],
    roadBlocks: [
      {
        id: 'lhr_block_1',
        roadName: 'Canal Bank Road (Mall Road Underpass)',
        coords: [31.5450, 74.3480],
        status: 'CLOSED',
        reason: '4.8ft urban stormwater inundation',
        detourRecommended: 'Via Upper Mall & Main Boulevard Gulberg',
        source: 'LAHORE_TRAFFIC_POLICE'
      },
      {
        id: 'lhr_block_2',
        roadName: 'Shahdara Ravi Old Bridge Approach',
        coords: [31.6210, 74.2880],
        status: 'HEAVY_CONGESTION',
        reason: 'Precautionary traffic restrictions due to high river gauge',
        detourRecommended: 'Use Lahore Ring Road New Ravi Bridge',
        source: 'RESCUE_1122'
      }
    ],
    reliefHubs: [
      {
        id: 'lhr_hub_1',
        name: 'Gaddafi Stadium Provincial Logistics Base',
        coords: [31.5130, 74.3330],
        type: 'DISASTER_LOGISTICS_HUB',
        status: 'OPERATIONAL',
        managedBy: 'PDMA Punjab & Rescue 1122',
        waterAvailable: true,
        drinkingWaterLiters: 16000,
        foodPackets: 1500,
        rescueBoats: 7,
        source: 'EOC_REGISTERED'
      },
      {
        id: 'lhr_hub_2',
        name: 'Minar-e-Pakistan Relief Staging Depot',
        coords: [31.5925, 74.3095],
        type: 'MEDICAL_STAGING_CAMP',
        status: 'OPERATIONAL',
        managedBy: 'Civil Defence & Alkhidmat Foundation',
        waterAvailable: true,
        drinkingWaterLiters: 10500,
        foodPackets: 950,
        rescueBoats: 4,
        source: 'EOC_REGISTERED'
      }
    ]
  },

  nowshera: {
    riverBasin: 'Kabul River Basin',
    sensorName: 'Nowshera Bridge Sensor',
    baseGaugeFeet: 18.4,
    dangerLimitFeet: 24.0,
    hospitals: [
      {
        id: 'nowshera_qazi',
        name: 'Qazi Hussain Ahmed Medical Complex',
        location: 'GT Road, Nowshera',
        coords: [34.0045, 71.9860],
        totalBeds: 650,
        occupiedBeds: 590,
        capacity: 90,
        icuAvailable: 3,
        powerBackup: 'Operational (Generator)',
        status: 'OVERLOADED',
        acceptingEmergencies: false,
        phone: '+92-923-9220100',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'nowshera_dhq',
        name: 'District Headquarters Hospital Nowshera',
        location: 'Nowshera Cantonment',
        coords: [34.0160, 71.9750],
        totalBeds: 450,
        occupiedBeds: 310,
        capacity: 68,
        icuAvailable: 15,
        powerBackup: 'Grid + Generator',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-923-9220050',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'nowshera_cmh',
        name: 'Combined Military Hospital (CMH) Nowshera',
        location: 'Nowshera Cantt',
        coords: [34.0190, 71.9680],
        totalBeds: 500,
        occupiedBeds: 290,
        capacity: 58,
        icuAvailable: 20,
        powerBackup: 'Triple Grid Redundancy',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-923-9220011',
        source: 'EOC_REGISTERED'
      }
    ],
    reports: [
      {
        id: 'nws-rep-1',
        rawText: 'Hakimabad village submerged by Kabul River breach. 22 villagers stranded on mosque rooftop with rising current.',
        category: 'RESCUE_NEEDED',
        severity: 10,
        headcount: 22,
        locationName: 'Hakimabad Riverside, Nowshera',
        coords: [34.0180, 71.9620],
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        status: 'CRITICAL',
        source: 'CITIZEN_SOS',
        needs: ['High-Power Jet-Boats', 'Life Jackets', 'Army Aviation Winch']
      },
      {
        id: 'nws-rep-2',
        rawText: 'Nowshera Kalan river bank: 11 civilians trapped with livestock on retaining levee.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 11,
        locationName: 'Nowshera Kalan, Nowshera',
        coords: [34.0110, 71.9890],
        timestamp: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
        status: 'VERIFIED',
        source: 'CITIZEN_SOS',
        needs: ['Evacuation Boats', 'First Aid']
      },
      {
        id: 'nws-rep-3',
        rawText: 'GT Road Nowshera Cantt bypass cut off by 5ft flood torrent spilling from Kabul River.',
        category: 'ROAD_BLOCKED',
        severity: 8,
        headcount: 0,
        locationName: 'GT Road (Kabul River Bypass), Nowshera',
        coords: [34.0220, 71.9720],
        timestamp: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
        status: 'VERIFIED',
        source: 'HIGHWAY_POLICE',
        needs: ['Traffic Diversion to M-1', 'Warning Cones']
      },
      {
        id: 'nws-rep-4',
        rawText: 'Kabul River Old Bridge submerged and completely closed to all civilian and rescue vehicular transit.',
        category: 'ROAD_BLOCKED',
        severity: 8,
        headcount: 0,
        locationName: 'Kabul River Old Bridge, Nowshera',
        coords: [34.0150, 71.9770],
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        status: 'VERIFIED',
        source: 'RESCUE_1122',
        needs: ['Traffic Cordon', 'Structural Inspection']
      },
      {
        id: 'nws-rep-5',
        rawText: 'Qazi Medical Complex emergency flooded with waterborne trauma cases. Redirecting to DHQ Nowshera.',
        category: 'HOSPITAL_CAPACITY',
        severity: 9,
        headcount: 0,
        locationName: 'Qazi Hussain Ahmed Complex, Nowshera',
        coords: [34.0045, 71.9860],
        timestamp: new Date(Date.now() - 1000 * 60 * 23).toISOString(),
        status: 'VERIFIED',
        source: 'HOSPITAL_EOC',
        needs: ['Trauma Squads', 'Blood Units']
      },
      {
        id: 'nws-rep-6',
        rawText: 'Drinking water filtration plant drowned in flood water. Emergency clean water bowsers urgently needed for 70 families.',
        category: 'WATER_SHORTAGE',
        severity: 8,
        headcount: 70,
        locationName: 'Nowshera Cantt Water Station',
        coords: [34.0200, 71.9810],
        timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
        status: 'VERIFIED',
        source: 'TMA_NOWSHERA',
        needs: ['Potable Water Bowsers', 'Chlorine Tablets']
      }
    ],
    hazardZones: [
      {
        id: 'nws_hazard_kabul',
        type: 'FLOOD_ZONE',
        name: 'Kabul River Flash Inundation Basin',
        severity: 'CRITICAL',
        waterDepthMeters: 2.8,
        status: 'EXPANDING',
        polygon: [
          [34.0300, 71.9500],
          [34.0250, 71.9950],
          [34.0050, 71.9900],
          [34.0000, 71.9550]
        ],
        description: 'Kabul River discharge crossing high flood danger stage of 135,000 cusecs at Nowshera.',
        source: 'KP_PDMA'
      }
    ],
    roadBlocks: [
      {
        id: 'nws_block_1',
        roadName: 'Grand Trunk (GT) Road Kabul River Crossing',
        coords: [34.0220, 71.9720],
        status: 'CLOSED',
        reason: '5.2ft river torrent breach across carriageway',
        detourRecommended: 'Divert traffic via Islamabad-Peshawar Motorway (M-1)',
        source: 'NH&MP'
      }
    ],
    reliefHubs: [
      {
        id: 'nws_hub_1',
        name: 'Nowshera Sports Complex Relief Logistics Depot',
        coords: [34.0130, 71.9820],
        type: 'DISASTER_LOGISTICS_HUB',
        status: 'OPERATIONAL',
        managedBy: 'KP PDMA & Pakistan Army 11 Corps',
        waterAvailable: true,
        drinkingWaterLiters: 14000,
        foodPackets: 1200,
        rescueBoats: 8,
        source: 'EOC_REGISTERED'
      }
    ]
  },

  swat: {
    riverBasin: 'Swat River Basin',
    sensorName: 'Chakdara Hydrology Post',
    baseGaugeFeet: 11.5,
    dangerLimitFeet: 18.0,
    hospitals: [
      {
        id: 'swat_saidu',
        name: 'Saidu Teaching Hospital',
        location: 'Saidu Sharif, Swat',
        coords: [34.7520, 72.3580],
        totalBeds: 750,
        occupiedBeds: 675,
        capacity: 90,
        icuAvailable: 3,
        powerBackup: 'Generator Backup',
        status: 'OVERLOADED',
        acceptingEmergencies: false,
        phone: '+92-946-9240100',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'swat_smc',
        name: 'Swat Medical Complex',
        location: 'Mingora Bypass Road, Swat',
        coords: [34.7750, 72.3620],
        totalBeds: 400,
        occupiedBeds: 250,
        capacity: 62,
        icuAvailable: 16,
        powerBackup: 'Solar + Generator',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-946-9240200',
        source: 'EOC_REGISTERED'
      }
    ],
    reports: [
      {
        id: 'swt-rep-1',
        rawText: 'Fizagat riverfront hotel cluster: 16 tourists and staff cut off by rapid Swat River torrent swell.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 16,
        locationName: 'Fizagat Riverside, Swat',
        coords: [34.7950, 72.3780],
        timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
        status: 'CRITICAL',
        source: 'CITIZEN_SOS',
        needs: ['Helicopter Evacuation', 'Emergency Ropes']
      },
      {
        id: 'swt-rep-2',
        rawText: 'Madyan Road bridge approach washed away; 7 villagers stranded on high rock outcrop.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 7,
        locationName: 'Madyan Road Access, Swat',
        coords: [34.8200, 72.3900],
        timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        status: 'VERIFIED',
        source: 'CITIZEN_SOS',
        needs: ['Rescue 1122 Mountain Squad', 'First Aid']
      },
      {
        id: 'swt-rep-3',
        rawText: 'Mingora Bypass completely eroded by flash torrent. Both carriageways impassable.',
        category: 'ROAD_BLOCKED',
        severity: 8,
        headcount: 0,
        locationName: 'Mingora Bypass Arterial, Swat',
        coords: [34.7820, 72.3550],
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        status: 'VERIFIED',
        source: 'HIGHWAY_POLICE',
        needs: ['Heavy Bulldozers', 'Traffic Diversion']
      }
    ],
    hazardZones: [
      {
        id: 'swt_hazard_river',
        type: 'FLOOD_ZONE',
        name: 'Swat River High-Velocity Torrent Corridor',
        severity: 'CRITICAL',
        waterDepthMeters: 2.4,
        status: 'EXPANDING',
        polygon: [
          [34.8300, 72.3800],
          [34.8000, 72.3900],
          [34.7600, 72.3600],
          [34.7700, 72.3400]
        ],
        description: 'Swat River in extreme flash flood condition caused by upper catchment glacial cloudburst.',
        source: 'SWAT_EOC'
      }
    ],
    roadBlocks: [
      {
        id: 'swt_block_1',
        roadName: 'Mingora-Bahrain Main Arterial Highway',
        coords: [34.7820, 72.3550],
        status: 'CLOSED',
        reason: 'Complete roadway embankment collapse from torrential erosion',
        detourRecommended: 'Use mountain link road via Islampur',
        source: 'RESCUE_1122'
      }
    ],
    reliefHubs: [
      {
        id: 'swt_hub_1',
        name: 'Grassy Ground Mingora Provincial Staging Depot',
        coords: [34.7710, 72.3590],
        type: 'DISASTER_LOGISTICS_HUB',
        status: 'OPERATIONAL',
        managedBy: 'Rescue 1122 & Pakistan Army',
        waterAvailable: true,
        drinkingWaterLiters: 11000,
        foodPackets: 950,
        rescueBoats: 5,
        source: 'EOC_REGISTERED'
      }
    ]
  },

  sukkur: {
    riverBasin: 'Indus River Basin',
    sensorName: 'Sukkur Barrage Gauge',
    baseGaugeFeet: 21.2,
    dangerLimitFeet: 28.0,
    hospitals: [
      {
        id: 'skr_civil',
        name: 'Civil Hospital Sukkur',
        location: 'Minaret Road, Sukkur',
        coords: [27.7020, 68.8610],
        totalBeds: 800,
        occupiedBeds: 720,
        capacity: 90,
        icuAvailable: 3,
        powerBackup: 'Operational (Generator)',
        status: 'OVERLOADED',
        acceptingEmergencies: false,
        phone: '+92-71-9310100',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'skr_gmm',
        name: 'Ghulam Muhammad Mahar Medical College Hospital',
        location: 'Military Road, Sukkur',
        coords: [27.7180, 68.8450],
        totalBeds: 600,
        occupiedBeds: 380,
        capacity: 63,
        icuAvailable: 19,
        powerBackup: 'Triple Grid Redundancy',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-71-9310250',
        source: 'EOC_REGISTERED'
      }
    ],
    reports: [
      {
        id: 'skr-rep-1',
        rawText: 'Rohri Railway katchi abadi: 18 people stranded near Indus protective bund seepage breach.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 18,
        locationName: 'Rohri Railway Bund Settlement, Sukkur',
        coords: [27.6920, 68.8950],
        timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
        status: 'CRITICAL',
        source: 'CITIZEN_SOS',
        needs: ['Rescue Motorboats', 'Life Jackets', 'Sandbagging Squads']
      },
      {
        id: 'skr-rep-2',
        rawText: 'Bandar Road Underpass submerged under 4.2ft water from river seepage.',
        category: 'ROAD_BLOCKED',
        severity: 8,
        headcount: 0,
        locationName: 'Bandar Road Underpass, Sukkur',
        coords: [27.7050, 68.8580],
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        status: 'VERIFIED',
        source: 'TRAFFIC_EOC',
        needs: ['High-Discharge Dewatering Pumps', 'Traffic Diversion']
      }
    ],
    hazardZones: [
      {
        id: 'skr_hazard_indus',
        type: 'FLOOD_ZONE',
        name: 'Indus River High Flood Surging Basin (Sukkur Barrage)',
        severity: 'CRITICAL',
        waterDepthMeters: 2.6,
        status: 'EXPANDING',
        polygon: [
          [27.7250, 68.8300],
          [27.7150, 68.8800],
          [27.6850, 68.9100],
          [27.6800, 68.8600]
        ],
        description: 'Indus River discharge upstream of Sukkur Barrage exceeding 580,000 cusecs.',
        source: 'SINDH_IRRIGATION'
      }
    ],
    roadBlocks: [
      {
        id: 'skr_block_1',
        roadName: 'Sukkur-Rohri Link Bridge',
        coords: [27.6980, 68.8800],
        status: 'HEAVY_CONGESTION',
        reason: 'Strict emergency convoy restrictions due to rising Indus gauge',
        detourRecommended: 'Use Sukkur Bypass Indus Highway',
        source: 'TRAFFIC_POLICE'
      }
    ],
    reliefHubs: [
      {
        id: 'skr_hub_1',
        name: 'Ayub Gate Municipal Relief Depot',
        coords: [27.7080, 68.8620],
        type: 'DISASTER_LOGISTICS_HUB',
        status: 'OPERATIONAL',
        managedBy: 'PDMA Sindh & District Administration',
        waterAvailable: true,
        drinkingWaterLiters: 15000,
        foodPackets: 1300,
        rescueBoats: 8,
        source: 'EOC_REGISTERED'
      }
    ]
  },

  dgkhan: {
    riverBasin: 'Taunsa Hill Torrents',
    sensorName: 'Taunsa Barrage Sensor',
    baseGaugeFeet: 16.3,
    dangerLimitFeet: 22.0,
    hospitals: [
      {
        id: 'dgk_dhq',
        name: 'DHQ Teaching Hospital D.G. Khan',
        location: 'Jampur Road, D.G. Khan',
        coords: [30.0480, 70.6380],
        totalBeds: 700,
        occupiedBeds: 620,
        capacity: 88,
        icuAvailable: 5,
        powerBackup: 'Generator Backup',
        status: 'WARNING',
        acceptingEmergencies: true,
        phone: '+92-64-9260100',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'dgk_taunsa',
        name: 'THQ Hospital Taunsa Sharif',
        location: 'Taunsa City',
        coords: [30.7040, 70.6520],
        totalBeds: 300,
        occupiedBeds: 270,
        capacity: 90,
        icuAvailable: 2,
        powerBackup: 'Generator Backup',
        status: 'OVERLOADED',
        acceptingEmergencies: false,
        phone: '+92-64-9260200',
        source: 'EOC_REGISTERED'
      }
    ],
    reports: [
      {
        id: 'dgk-rep-1',
        rawText: 'Vidor hill torrent flash flood entered settlement: 20 civilians stranded on rooftops.',
        category: 'RESCUE_NEEDED',
        severity: 10,
        headcount: 20,
        locationName: 'Vidor Torrent Basin, D.G. Khan',
        coords: [30.0620, 70.5850],
        timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
        status: 'CRITICAL',
        source: 'CITIZEN_SOS',
        needs: ['4x4 Rescue Vehicles', 'Boats', 'Rations']
      },
      {
        id: 'dgk-rep-2',
        rawText: 'Indus Highway KM-45 washed out by mountain torrent runoff; all commercial transit paralyzed.',
        category: 'ROAD_BLOCKED',
        severity: 8,
        headcount: 0,
        locationName: 'Indus Highway (KM-45 Sector), D.G. Khan',
        coords: [30.0750, 70.6200],
        timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        status: 'VERIFIED',
        source: 'HIGHWAY_POLICE',
        needs: ['Emergency Road Earthwork', 'Diversion']
      }
    ],
    hazardZones: [
      {
        id: 'dgk_hazard_vidor',
        type: 'FLOOD_ZONE',
        name: 'Koh-e-Suleman Hill Torrent Inundation Fan',
        severity: 'CRITICAL',
        waterDepthMeters: 2.3,
        status: 'EXPANDING',
        polygon: [
          [30.0800, 70.5600],
          [30.0850, 70.6200],
          [30.0300, 70.6500],
          [30.0200, 70.5800]
        ],
        description: 'Vidor and Mithawan hill torrents overflowing after torrential cloudburst over Suleman range.',
        source: 'PUNJAB_PDMA'
      }
    ],
    roadBlocks: [
      {
        id: 'dgk_block_1',
        roadName: 'Indus Highway (Taunsa-DG Khan Segment)',
        coords: [30.0750, 70.6200],
        status: 'CLOSED',
        reason: 'Hill torrent culvert washaway',
        detourRecommended: 'Via Multan-Muzaffargarh Highway route',
        source: 'HIGHWAY_POLICE'
      }
    ],
    reliefHubs: [
      {
        id: 'dgk_hub_1',
        name: 'D.G. Khan Sports Stadium Logistics Hub',
        coords: [30.0520, 70.6410],
        type: 'DISASTER_LOGISTICS_HUB',
        status: 'OPERATIONAL',
        managedBy: 'Rescue 1122 & District Management',
        waterAvailable: true,
        drinkingWaterLiters: 11000,
        foodPackets: 950,
        rescueBoats: 6,
        source: 'EOC_REGISTERED'
      }
    ]
  },

  quetta: {
    riverBasin: 'Hanna Urak Basin',
    sensorName: 'Spin Karez Sensor',
    baseGaugeFeet: 10.5,
    dangerLimitFeet: 15.0,
    hospitals: [
      {
        id: 'qta_sandeman',
        name: 'Sandeman Provincial Hospital (Civil Hospital)',
        location: 'Jinnah Road, Quetta',
        coords: [30.1980, 66.9990],
        totalBeds: 1100,
        occupiedBeds: 990,
        capacity: 90,
        icuAvailable: 4,
        powerBackup: 'Generator Backup',
        status: 'OVERLOADED',
        acceptingEmergencies: false,
        phone: '+92-81-9202001',
        source: 'EOC_REGISTERED'
      },
      {
        id: 'qta_bmc',
        name: 'Bolan Medical Complex Hospital (BMCH)',
        location: 'Brewery Road, Quetta',
        coords: [30.1680, 66.9720],
        totalBeds: 900,
        occupiedBeds: 640,
        capacity: 71,
        icuAvailable: 21,
        powerBackup: 'Operational',
        status: 'NORMAL',
        acceptingEmergencies: true,
        phone: '+92-81-9213001',
        source: 'EOC_REGISTERED'
      }
    ],
    reports: [
      {
        id: 'qta-rep-1',
        rawText: 'Hanna Lake spillway overflow: 14 people stranded in mountain valley orchards by fast flood runoff.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 14,
        locationName: 'Hanna Urak Valley, Quetta',
        coords: [30.2520, 67.0980],
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        status: 'CRITICAL',
        source: 'CITIZEN_SOS',
        needs: ['Mountain Rescue Teams', '4x4 Off-roaders']
      },
      {
        id: 'qta-rep-2',
        rawText: 'Sariab Road low-lying slums inundated with 3.8ft flash water; 8 families stranded on adobe houses.',
        category: 'RESCUE_NEEDED',
        severity: 9,
        headcount: 8,
        locationName: 'Sariab Road, Quetta',
        coords: [30.1520, 66.9810],
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        status: 'VERIFIED',
        source: 'CITIZEN_SOS',
        needs: ['Evacuation Convoy', 'Dry Food Sachets']
      },
      {
        id: 'qta-rep-3',
        rawText: 'Western Bypass submerged near Brewery Road intersection; commercial truck movement halted.',
        category: 'ROAD_BLOCKED',
        severity: 8,
        headcount: 0,
        locationName: 'Western Bypass (Brewery Intersection), Quetta',
        coords: [30.1750, 66.9550],
        timestamp: new Date(Date.now() - 1000 * 60 * 19).toISOString(),
        status: 'VERIFIED',
        source: 'TRAFFIC_POLICE',
        needs: ['Traffic Diversion to Zarghoon Road']
      }
    ],
    hazardZones: [
      {
        id: 'qta_hazard_hanna',
        type: 'FLOOD_ZONE',
        name: 'Hanna Urak Flash Runoff Depression',
        severity: 'HIGH',
        waterDepthMeters: 1.7,
        status: 'EXPANDING',
        polygon: [
          [30.2700, 67.0800],
          [30.2600, 67.1200],
          [30.2200, 71.1000],
          [30.2300, 67.0600]
        ],
        description: 'Rapid catchment water release from Hanna Dam following heavy mountain precipitation.',
        source: 'BALOCHISTAN_PDMA'
      }
    ],
    roadBlocks: [
      {
        id: 'qta_block_1',
        roadName: 'Western Bypass (Brewery Road Cross)',
        coords: [30.1750, 66.9550],
        status: 'CLOSED',
        reason: 'Flash runoff waterlogging 3.5ft',
        detourRecommended: 'Divert through City Center via Zarghoon Road',
        source: 'QUETTA_TRAFFIC_POLICE'
      }
    ],
    reliefHubs: [
      {
        id: 'qta_hub_1',
        name: 'Ayub National Stadium Logistics Depot',
        coords: [30.2080, 67.0180],
        type: 'DISASTER_LOGISTICS_HUB',
        status: 'OPERATIONAL',
        managedBy: 'Balochistan PDMA & FC Balochistan',
        waterAvailable: true,
        drinkingWaterLiters: 12000,
        foodPackets: 1100,
        rescueBoats: 4,
        source: 'EOC_REGISTERED'
      }
    ]
  }
};

export function getCityCatalogEntry(regionId) {
  return CITY_CATALOG[regionId] || null;
}

