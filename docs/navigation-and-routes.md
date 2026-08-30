# Web Portal Navigation & Route Specifications

This document outlines the desktop sidebar navigation architecture and route definitions for the **SHELLOC Web Portal**.

---

## 1. Unified 4-View Navigation Hierarchy

The Web Portal organizes all operational features into a **4-view sidebar navigation layout**:

```text
/ (Root AppLayout)
├── /                     # [View 1] Home (Command Center HUD & Tank Gauges)
├── /diagnostics          # [View 2] Diagnostics (GIS Zone Map, Radar & Delta Table)
├── /chat                 # [View 3] AI Chat (Google Gemini Assistant)
└── /activity             # [View 4] Feedback Display / Activity Log (Timeline & Table)
```

---

## 2. View Specifications

### View 1: Home (`/`)
- **Route:** `/`
- **Sidebar Label:** `Home` (Icon: `LayoutDashboard`)
- **Key Modules:**
  - **Live Sensor Telemetry HUD:** Real-time stat cards displaying Turbidity (NTU), pH level, TDS (ppm), and Temperature (°C).
  - **Reagent Consumables Gauge:** Progress bars for Moringa-Chitosan tank (%), Citric Acid tank (%), and Biochar filter health status.
  - **Operational State & Points Today:** Mission progress ring and active 9-state lifecycle status badge.
  - **15-Minute Incubation Timer Widget:** Animated circular countdown during the `incubating_15m` aggregation phase.
  - **Buoyancy Failsafe Alert Banner:** Warning alert rendered when GPS signal drops and the vessel activates its ballast evacuation pump.

### View 2: Diagnostics (`/diagnostics`)
- **Route:** `/diagnostics`
- **Sidebar Label:** `Diagnostics` (Icon: `Activity`)
- **Key Modules:**
  - **Interactive GIS Zone Map:** Full-featured Leaflet dark radar map showing live vessel position, heading, and 6 target waypoints with 2-meter geofences.
  - **Waypoint Selection Chips:** Quick-switch selectors (`P1` through `P6`) displaying treatment state (`REMEDIATED` vs `UNTREATED`).
  - **Comparative Telemetry Gauges:** Before-vs-after delta stat cards for Turbidity (NTU), pH scale, and Dissolved Solids (ppm).
  - **Diagnostics Data Table:** Comprehensive tabular readout of raw sensor parameters, GPS accuracy, and SONAR obstacle detection.
  - **Mission Dispatch Controls:** Primary action button to dispatch the vessel to the active selected waypoint.

### View 3: AI Chat (`/chat`)
- **Route:** `/chat`
- **Sidebar Label:** `AI Chat` (Icon: `Bot`)
- **Key Modules:**
  - **Telemetry-Grounded Conversation:** Integrates directly with Google Gemini (`gemini-3.7-flash`).
  - **Actionable Remediation Guidance:** Highlights dosage adjustments, pH stabilization requirements, and water quality verdicts.
  - **Multi-Turn Chat History:** Preserves recent session turns with automatic scroll to latest response.

### View 4: Feedback Display / Activity Log (`/activity` or `/treatments`)
- **Route:** `/activity` (aliased to `/treatments`)
- **Sidebar Label:** `Feedback Display` (Icon: `History` / `Droplet`)
- **Key Modules:**
  - **Chronological Activity Timeline:** Real-time event feed logging waypoint arrivals, primary dosing, 15m timer expirations, biochar sweeps, and Citric Acid deployments.
  - **Treatment Summary Table:** Data table recording started timestamp, primary flocculant dosage (mL), Citric Acid dosage (mL), biochar filtration status, aggregation duration, and final outcome.
