import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { getCurrentWeather } from './services/weatherService.js';
import {
  pakistanCenter,
  regions,
  initialHospitals,
  initialHazardZones,
  initialRoadBlocks,
  initialReliefHubs,
  initialReports
} from './data/pakistanGeoData.js';
import { simulationSteps, getSimulationSteps } from './data/simulationEvents.js';
import { getCityCatalogEntry, CITY_CATALOG } from './data/cityDataCatalog.js';
import { classifyEmergencyReport } from './services/aiClassifier.js';
import { calculateSafestRoute } from './services/routingEngine.js';
import { calculatePriorityZones } from './services/dispatchSolver.js';
import { fetchExternalDistress } from './services/externalFeed.js';
import { fetchCityIntel } from './services/liveIntel.js';
import { getReports, submitReport, subscribeToReports } from './services/reportStore.js';
import { emergencyDb } from './services/persistence.js';
import { analyzeDisasterImage, getPresetDisasterImages, getVisionStatus } from './services/qwenVlVision.js';

const app = express();
const server = http.createServer(app);

// Allow the Vite dev client at localhost:5173 (and production builds)
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',  // vite preview
  'http://127.0.0.1:5173',
];

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

async function getRadarData() {
  const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
  if (!response.ok) throw new Error(`Radar API error: ${response.status}`);
  const radar = await response.json();
  const frame = radar.radar?.nowcast?.[0] || radar.radar?.past?.[radar.radar.past.length - 1];
  if (!frame) throw new Error('Radar API returned no frames');
  return {
    tileUrl: `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/2/1_1.png`,
    frameTimestamp: frame.time,
    fetchedAt: new Date().toISOString()
  };
}

app.get('/api/weather', async (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 33.6844;
    const lng = req.query.lng ? parseFloat(req.query.lng) : 73.0479;
    const weather = await getCurrentWeather(lat, lng);

    res.json(weather);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({
      error: 'Failed to fetch weather data'
    });
  }
});

// Persistent Disaster Operations State (Survives Server Restarts)
const defaultState = {
  activeRegion: regions[0],
  hospitals: JSON.parse(JSON.stringify(initialHospitals)),
  hazardZones: JSON.parse(JSON.stringify(initialHazardZones)),
  roadBlocks: JSON.parse(JSON.stringify(initialRoadBlocks)),
  reliefHubs: JSON.parse(JSON.stringify(initialReliefHubs)),
  reports: JSON.parse(JSON.stringify(initialReports)),
  priorityZones: [],
  disasterAlert: {
    active: true,
    title: "🚨 MONSOON EMERGENCY ADVISORY — TWIN CITIES",
    severity: "HIGH",
    summary: "Nullah Lai flash flood alert active. 37 trapped individuals reported across Rawalpindi lowlands.",
    timestamp: new Date().toISOString()
  },
  dispatchedUnits: [
    {
      id: "disp_1",
      targetZone: "Priority Zone #2",
      unitName: "Rescue 1122 Quick Response Alpha",
      type: "4x4 High-Clearance Troop Carrier",
      status: "EN_ROUTE",
      dispatchedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      etaMin: 8
    }
  ],
  simulationRunning: false,
  simulationStepIndex: 0
};

let currentState = emergencyDb.init(defaultState);

// Compute initial priority zones dynamically with multi-criteria solver
currentState.priorityZones = calculatePriorityZones(
  currentState.reports,
  currentState.hospitals,
  currentState.hazardZones,
  currentState.roadBlocks
);
emergencyDb.save(currentState);

// REST API Endpoints
app.get('/api/regions', (req, res) => {
  res.json({
    success: true,
    data: regions,
    metadata: { serverTime: new Date().toISOString() }
  });
});

app.get('/api/radar', async (req, res) => {
  try {
    res.json({ success: true, data: await getRadarData() });
  } catch (error) {
    console.error('Radar API error:', error);
    res.status(502).json({ success: false, error: 'Failed to fetch radar telemetry' });
  }
});

app.get('/api/distress', async (req, res) => {
  try {
    const requestedRegion = req.query.regionId
      ? regions.find(region => region.id === req.query.regionId)
      : undefined;
    if (req.query.regionId && !requestedRegion) {
      return res.status(404).json({ success: false, error: 'Region not found' });
    }
    const reports = await fetchExternalDistress(regions, requestedRegion);
    res.json({ success: true, data: reports, metadata: { source: 'ReliefWeb', fetchedAt: new Date().toISOString() } });
  } catch (error) {
    console.error('External distress feed error:', error);
    res.status(502).json({ success: false, error: 'Failed to fetch external distress feed' });
  }
});

app.get('/api/reports/stream', (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  const category = req.query.category ? String(req.query.category) : undefined;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res.status(400).json({ success: false, error: 'Valid lat and lon are required' });
  }
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  const city = { lat, lon };
  getReports(city).forEach(report => res.write(`data: ${JSON.stringify(report)}\n\n`));
  const unsubscribe = subscribeToReports(category, city, report => {
    res.write(`data: ${JSON.stringify(report)}\n\n`);
  });
  req.on('close', unsubscribe);
});

app.get('/api/state', (req, res) => {
  res.json({
    success: true,
    data: currentState,
    metadata: {
      serverTime: new Date().toISOString(),
      totalCasualtiesEstimated: 37,
      totalReportsCount: currentState.reports.length
    }
  });
});

const liveRegionCache = new Map();
let liveRefreshPromise = null;

const buildLiveSnapshot = (region, intel, radar) => {
  const catalog = getCityCatalogEntry(region.id);
  const communityReports = getReports({ lat: region.center[0], lon: region.center[1] });
  
  // Hospitals: authentic city catalog or initialHospitals + live health telemetry
  let hospitals = catalog ? catalog.hospitals : initialHospitals;
  if (intel.hospitals && intel.hospitals.length > 0) {
    const liveHosp = intel.hospitals.map((report, idx) => ({
      id: report.id || `hosp_live_${idx}`,
      name: report.title || `Medical Center ${idx + 1}`,
      location: report.location || region.name,
      coords: report.coords || region.center,
      totalBeds: 600 + (idx * 150),
      occupiedBeds: 450 + (idx * 120),
      capacity: Math.min(95, Math.round(((450 + (idx * 120)) / (600 + (idx * 150))) * 100)),
      icuAvailable: Math.max(3, 25 - idx * 6),
      powerBackup: 'Operational',
      status: idx === 0 ? 'OVERLOADED' : 'NORMAL',
      acceptingEmergencies: idx !== 0,
      phone: '+92-51-9290300',
      source: report.source || 'VERIFIED_HEALTH'
    }));
    hospitals = [...hospitals, ...liveHosp];
  }

  let reliefHubs = catalog ? catalog.reliefHubs : initialReliefHubs;
  if (intel.waterPoints && intel.waterPoints.length > 0) {
    const liveHubs = intel.waterPoints.map((report, idx) => ({
      id: report.id || `depot_live_${idx}`,
      name: report.title || `Relief Depot ${idx + 1}`,
      coords: report.coords || region.center,
      type: 'DISASTER_RELIEF_STATION',
      status: 'OPERATIONAL',
      managedBy: 'NDMA & Rescue 1122',
      waterAvailable: true,
      drinkingWaterLiters: 5000 + (idx * 1500),
      foodPackets: 400 + (idx * 100),
      rescueBoats: 3 + idx,
      source: report.source || 'EOC_REGISTERED'
    }));
    reliefHubs = [...reliefHubs, ...liveHubs];
  }

  const hazardZones = catalog ? catalog.hazardZones : initialHazardZones;
  const roadBlocks = catalog ? catalog.roadBlocks : initialRoadBlocks;

  // City-specific reports
  const baseReports = catalog ? catalog.reports : (region.id === 'isb_rwp' ? currentState.reports : []);
  // Include user-submitted reports that belong to this region
  const userReportsForRegion = currentState.reports.filter(r => {
    if (!r.coords) return false;
    const dLat = Math.abs(r.coords[0] - region.center[0]);
    const dLon = Math.abs(r.coords[1] - region.center[1]);
    return dLat < 0.6 && dLon < 0.6;
  });

  const reportsMap = new Map();
  [...baseReports, ...userReportsForRegion, ...communityReports, ...(intel.incidents || [])].forEach(r => {
    if (r && r.id && !reportsMap.has(r.id)) {
      reportsMap.set(r.id, r);
    }
  });
  const reports = Array.from(reportsMap.values());

  const priorityZones = calculatePriorityZones(reports, hospitals, hazardZones, roadBlocks, region.id);

  return {
    activeRegion: {
      ...region,
      riverBasin: catalog?.riverBasin || region.riverBasin,
      sensorName: catalog?.sensorName || region.sensorName,
      dangerLimitFeet: catalog?.dangerLimitFeet || region.dangerLimitFeet
    },
    hospitals,
    hazardZones,
    roadBlocks,
    reliefHubs,
    reports,
    priorityZones,
    dispatchedUnits: [],
    disasterAlert: null,
    weather: intel.weather ? {
      temperature: intel.weather.current?.temperature_2m,
      precipitation: intel.weather.current?.precipitation || 0,
      weatherCode: intel.weather.current?.weathercode ?? intel.weather.current?.weather_code,
      time: intel.weather.current?.time,
      humidity: intel.weather.current?.relative_humidity_2m || 0,
      windSpeed: intel.weather.current?.wind_speed_10m || 0,
      windGusts: intel.weather.current?.wind_gusts_10m || 0,
      floodRiskLevel: (intel.weather.current?.precipitation || 0) >= 10 ? 'HIGH' : (intel.weather.current?.precipitation || 0) >= 2 ? 'MODERATE' : 'LOW'
    } : null,
    radar,
    intelSources: intel.sources,
    fetchedAt: intel.fetchedAt
  };
};

const refreshRegion = async region => {
  const city = { name: region.name, lat: region.center[0], lon: region.center[1] };
  const [intel, radar] = await Promise.all([fetchCityIntel(city), getRadarData()]);
  const snapshot = buildLiveSnapshot(region, intel, radar);
  liveRegionCache.set(region.id, snapshot);
  return snapshot;
};

const refreshAllRegions = async () => {
  if (liveRefreshPromise) return liveRefreshPromise;
  liveRefreshPromise = Promise.allSettled(regions.map(refreshRegion))
    .then(results => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Live refresh failed for ${regions[index].name}:`, result.reason);
        }
      });
    })
    .finally(() => {
      liveRefreshPromise = null;
    });
  return liveRefreshPromise;
};

void refreshAllRegions();
setInterval(refreshAllRegions, 60000);

// Consolidated live snapshot for clients that cannot maintain a WebSocket.
app.get('/api/live-data', async (req, res) => {
  const requestedRegion = req.query.regionId
    ? regions.find(region => region.id === req.query.regionId)
    : regions[0];
  if (!requestedRegion) {
    return res.status(404).json({ success: false, error: 'Region not found' });
  }

  try {
    if (!liveRegionCache.has(requestedRegion.id)) await refreshRegion(requestedRegion);
    const snapshot = liveRegionCache.get(requestedRegion.id);

    res.json({
      success: true,
      data: snapshot,
      metadata: {
        serverTime: new Date().toISOString(),
        source: 'External live feeds and community reports',
        regionId: requestedRegion.id,
        regionCount: regions.length
      }
    });
  } catch (error) {
    console.error('Live data API error:', error);
    res.status(502).json({ success: false, error: 'Failed to fetch live telemetry' });
  }
});

// Database Telemetry & Persistence Health Endpoint
app.get('/api/database/status', (req, res) => {
  res.json({
    success: true,
    data: emergencyDb.getStatus(currentState)
  });
});

// Citizen Report Ingestion
app.post('/api/reports', (req, res) => {
  const { rawText, coords, callerPhone } = req.body;
  if (!rawText || !rawText.trim() || !Array.isArray(coords) || coords.length !== 2) {
    return res.status(400).json({ success: false, error: 'Report text and coordinates are required' });
  }
  const text = rawText.toLowerCase();

  // Dynamic Headcount Extraction (e.g. "12 people", "6 afrad", "4 civilians")
  const headcountMatch = rawText.match(/(\d+)\s*(people|persons|afrad|log|individuals|civilians|bachay|bache)/i);
  const headcount = headcountMatch 
    ? parseInt(headcountMatch[1], 10) 
    : (text.includes('trapped') || text.includes('phans') ? 5 : 0);

  const category = text.includes('road') || text.includes('rasta') || text.includes('blocked')
    ? 'ROAD_BLOCKED'
    : text.includes('power') || text.includes('bijli') || text.includes('grid')
      ? 'POWER_OUTAGE'
      : text.includes('water') || text.includes('paani')
        ? 'WATER_SHORTAGE'
        : text.includes('hospital') || text.includes('bed') || text.includes('icu')
          ? 'HOSPITAL_CAPACITY'
          : 'RESCUE_NEEDED';

  const isUrgent = text.includes('urgent') || text.includes('trapped') || text.includes('phans') || headcount > 0;

  const classifiedReport = {
    id: `rep_live_${Date.now()}`,
    category,
    severity: isUrgent ? 9 : 6,
    headcount,
    locationName: `Field Report (${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})`,
    rawText: rawText.trim(),
    title: `${category.replace('_', ' ')}: ${rawText.trim().substring(0, 48)}...`,
    description: rawText.trim(),
    coords,
    timestamp: new Date().toISOString(),
    status: 'VERIFIED',
    source: 'CITIZEN_SOS',
    needs: headcount > 0 ? ['Rescue Boat', 'Paramedic Team'] : ['Field Assessment Team'],
    callerPhone: callerPhone || '+92 300 1234567'
  };

  // Prepend to active reports and commit to persistent database
  emergencyDb.insertReport(currentState, classifiedReport);

  // Recalculate Priority Zones dynamically with multi-criteria solver
  currentState.priorityZones = calculatePriorityZones(
    currentState.reports,
    currentState.hospitals,
    currentState.hazardZones,
    currentState.roadBlocks
  );
  emergencyDb.save(currentState);

  // Broadcast to all connected clients via Socket.IO
  io.emit('new_report', classifiedReport);
  io.emit('priority_update', currentState.priorityZones);

  res.status(201).json({
    success: true,
    report: classifiedReport,
    updatedPriorityZones: currentState.priorityZones
  });
});

// Qwen-VL Vision Multimodal Damage Assessment Endpoints
app.get('/api/vision/status', (req, res) => {
  res.json({
    success: true,
    data: getVisionStatus()
  });
});

app.get('/api/vision/presets', (req, res) => {
  const regionId = req.query.regionId || 'isb_rwp';
  res.json({
    success: true,
    presets: getPresetDisasterImages(regionId)
  });
});

app.post('/api/vision/analyze-damage', async (req, res) => {
  try {
    const { imageBase64, imageUrl, presetId, prompt, regionId } = req.body;
    const analysis = await analyzeDisasterImage({ imageBase64, imageUrl, presetId, prompt, regionId });
    res.json({
      success: true,
      analysis
    });
  } catch (err) {
    console.error('Qwen-VL vision analysis error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze disaster image with Qwen-VL'
    });
  }
});

// Safe Route Calculation
app.post('/api/route/calculate', (req, res) => {
  const { startCoords, hospitalId, hospitals } = req.body;
  
  let pool = Array.isArray(hospitals) && hospitals.length > 0
    ? hospitals
    : currentState.hospitals;

  let targetHospital = hospitalId
    ? pool.find(h => h.id === hospitalId)
    : null;

  if (!targetHospital && hospitalId) {
    for (const cat of Object.values(CITY_CATALOG)) {
      const found = cat.hospitals.find(h => h.id === hospitalId);
      if (found) {
        targetHospital = found;
        break;
      }
    }
  }

  if (!targetHospital) {
    targetHospital = pool.find(h => h.status !== 'OVERLOADED') || pool[0];
  }

  if (!targetHospital) {
    return res.status(409).json({ success: false, error: 'No live medical facility is available for routing' });
  }

  const calculatedRoute = calculateSafestRoute(
    startCoords,
    targetHospital,
    currentState.hazardZones,
    currentState.roadBlocks
  );

  res.json({
    success: true,
    route: calculatedRoute
  });
});

// Resource Dispatch Approval
app.post('/api/dispatch/approve', (req, res) => {
  const { zoneId, assets } = req.body;
  const zone = currentState.priorityZones.find(z => z.id === zoneId);

  if (zone) {
    zone.status = "DISPATCH_CONFIRMED";
  }

  const newDispatch = {
    id: `disp_${Date.now()}`,
    targetZone: zone ? zone.zoneName : "Priority Emergency Sector",
    unitName: assets?.unitName || "Rescue 1122 Tactical Taskforce Delta",
    type: assets?.type || "Inflatable Jet-Boat & Medical Evacuation Team",
    assetsAssigned: assets || zone?.recommendedDispatch,
    status: "DISPATCHED_ACTIVE",
    dispatchedAt: new Date().toISOString(),
    etaMin: 12
  };

  currentState.dispatchedUnits.unshift(newDispatch);

  io.emit('priority_update', currentState.priorityZones);
  io.emit('dispatch_confirmed', newDispatch);

  res.json({
    success: true,
    dispatch: newDispatch,
    priorityZones: currentState.priorityZones
  });
});

// Active Simulation Timer
let activeSimulationTimer = null;

// Reset Simulation & State
app.post('/api/simulation/reset', (req, res) => {
  if (activeSimulationTimer) {
    clearTimeout(activeSimulationTimer);
    activeSimulationTimer = null;
  }

  const { regionId } = req.body || {};
  const targetRegionId = regionId || currentState.simulationRegionId || 'isb_rwp';
  const cat = getCityCatalogEntry(targetRegionId);

  currentState.hospitals = cat ? JSON.parse(JSON.stringify(cat.hospitals)) : JSON.parse(JSON.stringify(initialHospitals));
  currentState.hazardZones = cat ? JSON.parse(JSON.stringify(cat.hazardZones)) : JSON.parse(JSON.stringify(initialHazardZones));
  currentState.roadBlocks = cat ? JSON.parse(JSON.stringify(cat.roadBlocks)) : JSON.parse(JSON.stringify(initialRoadBlocks));
  currentState.reports = cat ? JSON.parse(JSON.stringify(cat.reports)) : JSON.parse(JSON.stringify(initialReports));
  currentState.simulationRunning = false;
  currentState.simulationStepIndex = 0;
  currentState.disasterAlert = null;
  currentState.priorityZones = calculatePriorityZones(
    currentState.reports,
    currentState.hospitals,
    currentState.hazardZones,
    currentState.roadBlocks,
    targetRegionId
  );

  io.emit('state_reset', currentState);
  res.json({ success: true, message: "Disaster state reset to baseline", state: currentState });
});

// Start Real-Time Simulation Script
app.post('/api/simulation/start', (req, res) => {
  if (currentState.simulationRunning) {
    return res.json({ success: true, message: "Simulation is already running" });
  }

  const { regionId } = req.body || {};
  const targetRegionId = regionId || currentState.simulationRegionId || 'isb_rwp';
  const activeSteps = getSimulationSteps(targetRegionId);

  currentState.simulationRunning = true;
  currentState.simulationStepIndex = 0;
  currentState.simulationRegionId = targetRegionId;
  io.emit('simulation_started', { totalSteps: activeSteps.length, regionId: targetRegionId });

  let stepIdx = 0;

  function runNextStep() {
    if (!currentState.simulationRunning || stepIdx >= activeSteps.length) {
      currentState.simulationRunning = false;
      io.emit('simulation_completed', { message: "Disaster scenario fully simulated." });
      return;
    }

    const currentEvent = activeSteps[stepIdx];
    currentState.simulationStepIndex = stepIdx + 1;

    // Apply simulation event to in-memory state
    if (currentEvent.type === "NEW_REPORT") {
      const rep = currentEvent.report;
      const newRep = {
        id: `sim_rep_${Date.now()}`,
        rawText: rep.rawText,
        category: rep.category,
        severity: rep.severity,
        headcount: rep.headcount,
        locationName: rep.locationName,
        coords: rep.coords,
        timestamp: new Date().toISOString(),
        status: "CRITICAL",
        needs: rep.needs,
        languageDetected: rep.languageDetected,
        confidence: rep.confidence,
        dispatched: false
      };
      currentState.reports.unshift(newRep);
      io.emit('new_report', newRep);
    } else if (currentEvent.type === "HOSPITAL_TELEMETRY_UPDATE") {
      let targetHosp = currentState.hospitals.find(h => h.id === currentEvent.hospitalId);
      if (!targetHosp) {
        const cat = getCityCatalogEntry(targetRegionId);
        if (cat) {
          targetHosp = cat.hospitals.find(h => h.id === currentEvent.hospitalId);
        }
      }
      if (targetHosp) {
        Object.assign(targetHosp, currentEvent.update);
        io.emit('hospital_update', targetHosp);
      }
    } else if (currentEvent.type === "SYSTEM_ALERT") {
      currentState.disasterAlert = {
        active: true,
        title: currentEvent.title,
        severity: "CRITICAL",
        summary: currentEvent.message,
        timestamp: new Date().toISOString()
      };
      io.emit('system_alert', currentState.disasterAlert);
    }

    // Recalculate and broadcast priority zones
    currentState.priorityZones = calculatePriorityZones(
      currentState.reports,
      currentState.hospitals,
      currentState.hazardZones,
      currentState.roadBlocks,
      targetRegionId
    );
    io.emit('priority_update', currentState.priorityZones);
    io.emit('simulation_step', { step: stepIdx + 1, total: activeSteps.length, event: currentEvent });

    stepIdx++;
    activeSimulationTimer = setTimeout(runNextStep, currentEvent.delayMs || 3500);
  }

  activeSimulationTimer = setTimeout(runNextStep, 1500);

  res.json({
    success: true,
    message: "Simulation launched across real-time WebSocket mesh.",
    totalSteps: activeSteps.length
  });
});

// Socket.io Connection Handlers
io.on('connection', (socket) => {
  console.log(`[CrisisMap] Client connected: ${socket.id}`);
  socket.emit('initial_state', currentState);

  socket.on('disconnect', () => {
    console.log(`[CrisisMap] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [CrisisMap Server Error] Port ${PORT} is already in use by another process.`);
    console.error(`   Another instance of the backend or another service is already running on port ${PORT}.`);
    console.error(`   To free port ${PORT} on Windows PowerShell, run:`);
    console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
  } else {
    console.error('[CrisisMap Server Error]:', err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`🚨 [CrisisMap Pakistan] Emergency Intelligence Server listening on http://localhost:${PORT}`);
});
