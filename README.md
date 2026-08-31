# 🚨 CrisisMap — Pakistan Emergency Intelligence Platform

> *"During a disaster, information is everywhere but decisions are slow. CrisisMap converts fragmented reports into real-time decisions."*

---

## 🌟 What is CrisisMap?

**CrisisMap** is a real-time emergency intelligence and decision-orchestration platform designed for disaster management in Pakistan (flash floods, urban inundation, landslides, and infrastructure breakdown).

Instead of functioning as a passive information board, CrisisMap acts as an **autonomous Emergency Operations Center (EOC)** that ingests citizen reports in English, Urdu, and Roman Urdu, classifies severity via AI NLP, dynamically calculates obstacle-avoiding evacuation routes to available hospitals, and solves multi-criteria resource allocation matrices to direct rescue fleets to high-urgency zones.

---

## 🚀 Key Features & Hackathon Demo Capabilities

### 1. 🗺️ Tactical Geospatial Map (Pakistan Metro & Disaster Basins)
- Dark Carto & OpenStreetMap dynamic Leaflet layers.
- Pre-seeded high-fidelity coordinates for **Rawalpindi & Islamabad Twin Cities**, with coverage across **Nowshera, Swat, Sukkur, Karachi, and D.G. Khan**.
- Live interactive layers:
  - 🌊 **Flood Inundation Polygons**: Nullah Lai & Islamabad Expressway flood zones with active water depth metrics.
  - 🏥 **Hospital Nodes & Bed Capacity**: Real-time capacity loads, ICU availability, and triage divert warnings.
  - 🚧 **Road Obstacles & Hazard Blocks**: Submerged underpasses with detour advisories.
  - 💧 **Relief Hubs & Water Depots**: Potable water bowsers, ration packs, and rescue boat inventory.
  - 🆘 **Pulsing SOS Distress Pins**: Casualty headcounts and critical needs.

### 2. 🌊 1-Click "Disaster Simulation" (Judge Showstopper)
- Built-in scripted disaster progression engine simulating a flash flood emergency in the Rawalpindi/Islamabad basin:
  - **Step 1**: NDMA cloudburst warning & river gauge threshold trigger ($22.4\text{ ft}$).
  - **Step 2**: Rapid citizen distress calls streaming via WebSockets.
  - **Step 3**: Major arterial submerged at Faizabad Interchange ($4.5\text{ ft}$ flood).
  - **Step 4**: Hospital capacity surge (Holy Family Hospital hits $96\%$ ICU load).
  - **Step 5**: Clean water shortage in urban informal settlements.
  - **Step 6**: Power grid substation tripped.
  - **Step 7**: Autonomous AI priority ranking recalculation.

### 3. 🚑 "Find Safest Route" (Obstacle-Avoidance Evacuation Pathfinder)
- Resolves shortest path vs. verified safe detour:
  - ❌ **Direct Highway Path**: $7.4\text{ km}$ — Intersects submerged Faizabad underpass ($100\%$ blocked, drowning hazard).
  - ✅ **Calculated Safe Detour**: $10.1\text{ km}$ ($21\text{ mins}$) — Routes via elevated 9th Avenue Flyover & Srinagar Highway to PIMS Hospital ($28$ available ICU beds), reducing risk by $94\%$.
- Includes turn-by-turn guidance and one-click broadcast to Rescue 1122 ambulance drivers.

### 4. 🎯 "Where Should We Send Resources?" (AI Priority Dispatch Matrix)
- Multi-criteria decision intelligence ranking algorithm:
  $$\text{Urgency Score} = (\text{Trapped Headcount} \times 2.5) + (\text{Overloaded Nearby Hospitals} \times 1.8) + (\text{Resource Scarcity} \times 1.5) - (\text{Road Access Score})$$
- Generates actionable dispatch recommendation cards:
  - **Priority Zone #1 (Rawalpindi Nullah Lai Basin)**: $37$ trapped citizens, $2$ hospitals overloaded, $0\%$ water access, Road accessibility: LOW.
  - **Recommended Dispatch**: $3$ Jet-Boats, $1$ Helicopter, $10,000\text{L}$ Clean Water, $2$ Medical Teams.
- One-click "Approve & Dispatch" with live deployment tracking.

### 5. 🤖 Multi-lingual AI NLP Ingestion Engine
- Parses citizen reports in **English**, **Urdu**, and **Roman Urdu** (e.g. *"Nullah Lai ke qareeb 6 afrad phansay hain, pani bohot tezi se charh raha hai"*).
- Extracts category, severity ($1-10$), headcount, landmark coordinates, and required relief assets in real time.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Leaflet, React-Leaflet, Lucide Icons, Socket.io-client.
- **Backend**: Node.js, Express, Socket.IO, REST API.
- **Decision Engine**: Custom Obstacle-Aware Routing Solver & Multi-Attribute Priority Dispatch Matrix.
- **AI NLP**: Multi-lingual Roman Urdu / Urdu / English heuristic classifier + structured JSON entity extractor.

---

## ⚡ Quick Start Guide

### Option 1: One-Click Startup (Windows)
Double-click `start.bat` or run:
```bash
.\start.bat
```

### Option 2: Manual Terminal Startup

1. **Start the Backend Server**:
   ```bash
   cd server
   npm install
   node index.js
   ```
   *Server runs at: `http://localhost:3001`*

2. **Start the Frontend Dashboard**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *Dashboard runs at: `http://localhost:5173`*

---

## 🧭 Live Demo Script for Hackathon Presentations

1. **The Hook**: Open `http://localhost:5173`. Show the tactical dark map of Pakistan.
2. **The Problem**: *"During a disaster, information is everywhere but decisions are slow. Citizen reports flood in from social media and calls, but responders don't know what to prioritize."*
3. **The Simulation**: Click **"🌊 Run Flood Simulation"** on the top bar. Watch live reports, flood polygons, hospital overload warnings, and grid failures stream in real-time.
4. **The Safe Route**: Click **"Find Safest Route"**. Show how the platform actively avoids the flooded Faizabad interchange and calculates an elevated, dry bypass route to PIMS Hospital.
5. **The Resource Allocation**: Click **"Send Resources (AI Matrix)"**. Show how the algorithm ranks **Priority Zone #1 (37 trapped, 2 overloaded hospitals, no water, low accessibility)** and dispatches jet-boats and medical teams with a single click.
