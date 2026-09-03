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
import { simulationSteps } from './data/simulationEvents.js';
import { classifyEmergencyReport } from './services/aiClassifier.js';
import { calculateSafestRoute } from './services/routingEngine.js';
import { calculatePriorityZones } from './services/dispatchSolver.js';
import { fetchExternalDistress } from './services/externalFeed.js';
import { fetchCityIntel } from './services/liveIntel.js';
import { getReports, submitReport, subscribeToReports } from './services/reportStore.js';

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
app.use(express.json());

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

// In-Memory Disaster Operations State
let currentState = {
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

// Compute initial priority zones
currentState.priorityZones = calculatePriorityZones(
  currentState.reports,
  currentState.hospitals,
  currentState.hazardZones,
  currentState.roadBlocks
);

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

// Consolidated live snapshot for clients that cannot maintain a WebSocket.
app.get('/api/live-data', async (req, res) => {
  const requestedRegion = req.query.regionId
    ? regions.find(region => region.id === req.query.regionId)
    : regions[0];
  if (!requestedRegion) {
    return res.status(404).json({ success: false, error: 'Region not found' });
  }

  const lat = req.query.lat ? parseFloat(req.query.lat) : requestedRegion.center[0];
  const lng = req.query.lng ? parseFloat(req.query.lng) : requestedRegion.center[1];

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ success: false, error: 'Valid lat and lng coordinates are required' });
  }

  try {
    const city = { name: requestedRegion.name, lat, lon: lng };
    const [intel, radar] = await Promise.all([
      fetchCityIntel(city),
      getRadarData()
    ]);
    const communityReports = getReports(city);
    const reports = [...intel.incidents, ...communityReports];
    const hospitals = intel.hospitals.map(report => ({
      id: report.id,
      name: report.title,
      location: report.location,
      coords: report.coords,
      totalBeds: 0,
      occupiedBeds: 0,
      capacity: 0,
      icuAvailable: 0,
      powerBackup: 'Unknown',
      status: 'NORMAL',
      acceptingEmergencies: true,
      phone: '',
      source: report.source
    }));
    const reliefHubs = intel.waterPoints.map(report => ({
      id: report.id,
      name: report.title,
      coords: report.coords,
      type: 'DRINKING_WATER',
      status: 'MAPPED',
      managedBy: report.source,
      source: report.source
    }));
    const hazardZones = reports.filter(report => report.category === 'flood').map(report => ({
      id: report.id,
      type: report.type,
      name: report.title,
      severity: report.severity >= 8 ? 'HIGH' : report.severity >= 5 ? 'MEDIUM' : 'LOW',
      status: 'LIVE',
      polygon: [report.coords],
      description: report.description,
      source: report.source
    }));
    const roadBlocks = reports.filter(report => report.category === 'road_block').map(report => ({
      id: report.id,
      roadName: report.title,
      coords: report.coords,
      status: 'COMMUNITY_REPORTED',
      reason: report.description,
      source: report.source
    }));

    res.json({
      success: true,
      data: {
        activeRegion: requestedRegion,
        hospitals,
        hazardZones,
        roadBlocks,
        reliefHubs,
        reports,
        priorityZones: [],
        dispatchedUnits: [],
        disasterAlert: null,
        weather: intel.weather ? {
          temperature: intel.weather.current?.temperature_2m,
          precipitation: intel.weather.current?.precipitation || 0,
          weatherCode: intel.weather.current?.weathercode ?? intel.weather.current?.weather_code,
          time: intel.weather.current?.time,
          humidity: 0,
          windSpeed: 0,
          windGusts: 0,
          floodRiskLevel: (intel.weather.current?.precipitation || 0) >= 10 ? 'HIGH' : (intel.weather.current?.precipitation || 0) >= 2 ? 'MODERATE' : 'LOW'
        } : null,
        radar,
        intelSources: intel.sources,
        fetchedAt: intel.fetchedAt
      },
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

// Citizen Report Ingestion
app.post('/api/reports', (req, res) => {
  const { rawText, coords, callerPhone } = req.body;
  if (!rawText || !rawText.trim() || !Array.isArray(coords) || coords.length !== 2) {
    return res.status(400).json({ success: false, error: 'Report text and coordinates are required' });
  }
  const text = rawText.toLowerCase();
  const category = text.includes('road') || text.includes('rasta') || text.includes('blocked')
    ? 'road_block'
    : text.includes('power') || text.includes('bijli') || text.includes('grid')
      ? 'power_outage'
      : text.includes('water') || text.includes('paani')
        ? 'water_shortage'
        : 'sos';
  const classifiedReport = submitReport({
    category,
    severity: text.includes('urgent') || text.includes('trapped') ? 9 : 5,
    title: `${category.replace('_', ' ')} community report`,
    description: rawText.trim(),
    language: 'English',
    needs: [],
    lat: coords[0],
    lon: coords[1],
    callerPhone
  });

  // Prepend to active reports
  currentState.reports.unshift(classifiedReport);

  // Recalculate Priority Zones
  currentState.priorityZones = calculatePriorityZones(
    currentState.reports,
    currentState.hospitals,
    currentState.hazardZones,
    currentState.roadBlocks
  );

  // Broadcast to all connected clients via Socket.IO
  io.emit('new_report', classifiedReport);
  io.emit('priority_update', currentState.priorityZones);

  res.status(201).json({
    success: true,
    report: classifiedReport,
    updatedPriorityZones: currentState.priorityZones
  });
});

// Safe Route Calculation
app.post('/api/route/calculate', (req, res) => {
  const { startCoords, hospitalId } = req.body;
  const targetHospital = hospitalId
    ? currentState.hospitals.find(h => h.id === hospitalId)
    : currentState.hospitals.find(h => h.status !== 'OVERLOADED') || currentState.hospitals[1];
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

  currentState.hospitals = JSON.parse(JSON.stringify(initialHospitals));
  currentState.hazardZones = JSON.parse(JSON.stringify(initialHazardZones));
  currentState.roadBlocks = JSON.parse(JSON.stringify(initialRoadBlocks));
  currentState.reports = JSON.parse(JSON.stringify(initialReports));
  currentState.simulationRunning = false;
  currentState.simulationStepIndex = 0;
  currentState.priorityZones = calculatePriorityZones(
    currentState.reports,
    currentState.hospitals,
    currentState.hazardZones,
    currentState.roadBlocks
  );

  io.emit('state_reset', currentState);
  res.json({ success: true, message: "Disaster state reset to baseline", state: currentState });
});

// Start Real-Time Simulation Script
app.post('/api/simulation/start', (req, res) => {
  if (currentState.simulationRunning) {
    return res.json({ success: true, message: "Simulation is already running" });
  }

  currentState.simulationRunning = true;
  currentState.simulationStepIndex = 0;
  io.emit('simulation_started', { totalSteps: simulationSteps.length });

  let stepIdx = 0;

  function runNextStep() {
    if (!currentState.simulationRunning || stepIdx >= simulationSteps.length) {
      currentState.simulationRunning = false;
      io.emit('simulation_completed', { message: "Disaster scenario fully simulated." });
      return;
    }

    const currentEvent = simulationSteps[stepIdx];
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
      const targetHosp = currentState.hospitals.find(h => h.id === currentEvent.hospitalId);
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
      currentState.roadBlocks
    );
    io.emit('priority_update', currentState.priorityZones);
    io.emit('simulation_step', { step: stepIdx + 1, event: currentEvent });

    stepIdx++;
    activeSimulationTimer = setTimeout(runNextStep, currentEvent.delayMs);
  }

  activeSimulationTimer = setTimeout(runNextStep, 1500);

  res.json({
    success: true,
    message: "Simulation launched across real-time WebSocket mesh."
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
server.listen(PORT, () => {
  console.log(`🚨 [CrisisMap Pakistan] Emergency Intelligence Server listening on http://localhost:${PORT}`);
});
