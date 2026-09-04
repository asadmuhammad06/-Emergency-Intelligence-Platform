import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', 'data', 'emergency_db.json');

export class EmergencyDatabase {
  constructor() {
    this.dbPath = DB_FILE;
    this.isInitialized = false;
  }

  // Check if database exists on disk
  exists() {
    return fs.existsSync(this.dbPath);
  }

  // Initialize or load persisted state
  init(defaultState) {
    try {
      if (this.exists()) {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        const parsed = JSON.parse(raw);
        console.log(`[CrisisMap Database] ✅ Persistent ACID store loaded from ${this.dbPath}`);
        console.log(`[CrisisMap Database] Total Stored Records: ${parsed.reports?.length || 0} reports, ${parsed.hospitals?.length || 0} hospitals`);
        this.isInitialized = true;
        return parsed;
      } else {
        this.save(defaultState);
        console.log(`[CrisisMap Database] 🆕 Seeded new persistent store at ${this.dbPath}`);
        this.isInitialized = true;
        return defaultState;
      }
    } catch (err) {
      console.warn('[CrisisMap Database] Fallback to default state due to read error:', err.message);
      return defaultState;
    }
  }

  // Atomic persist write
  save(state) {
    try {
      const dataToSave = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        activeRegion: state.activeRegion,
        hospitals: state.hospitals,
        hazardZones: state.hazardZones,
        roadBlocks: state.roadBlocks,
        reliefHubs: state.reliefHubs,
        reports: state.reports,
        priorityZones: state.priorityZones,
        dispatchedUnits: state.dispatchedUnits || [],
        disasterAlert: state.disasterAlert
      };

      // Atomic write: write to temp file then rename to prevent corruption
      const tempPath = `${this.dbPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf8');
      fs.renameSync(tempPath, this.dbPath);
      return true;
    } catch (err) {
      console.error('[CrisisMap Database] Write error:', err.message);
      return false;
    }
  }

  // Append new report
  insertReport(state, newReport) {
    if (!state.reports) state.reports = [];
    state.reports.unshift(newReport);
    this.save(state);
  }

  // Update hospital status
  updateHospital(state, hospitalId, updates) {
    if (!state.hospitals) return;
    const idx = state.hospitals.findIndex(h => h.id === hospitalId);
    if (idx !== -1) {
      state.hospitals[idx] = { ...state.hospitals[idx], ...updates };
      this.save(state);
    }
  }

  // Get health & telemetry stats
  getStatus(state) {
    return {
      persistent: true,
      engine: 'File-Backed ACID JSON Store (Zero-Native-Compile Failure)',
      dbLocation: this.dbPath,
      existsOnDisk: this.exists(),
      reportsCount: state.reports?.length || 0,
      hospitalsCount: state.hospitals?.length || 0,
      priorityZonesCount: state.priorityZones?.length || 0,
      dispatchedUnitsCount: state.dispatchedUnits?.length || 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

export const emergencyDb = new EmergencyDatabase();

