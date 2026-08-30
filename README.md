# SHELLOC Web Portal

> **S**mart **H**ydro-**E**nvironmental **L**ocator and C**l**eaner — Desktop Command Center & Web Dashboard

React (Vite + TypeScript) web application for the **SHELLOC** autonomous water-remediation robotic vessel. Provides desktop-optimized real-time telemetry HUDs, interactive GIS radar maps, dual-reagent monitoring, and conversational environmental insights powered by **Google Gemini**.

---

## 🖥️ Unified 4-View Navigation

The Web Portal organizes all operational capabilities into a **4-view sidebar navigation layout**:

1. **Home (`/`):** Command Center HUD displaying real-time Turbidity (NTU), pH, TDS (ppm), and Temperature (°C) metrics, Moringa-Chitosan and Citric Acid reservoir levels, 15-minute incubation countdown timer, and buoyancy failsafe alerts.
2. **Diagnostics (`/diagnostics`):** Consolidated GPS Zone Map with interactive Leaflet radar, waypoint selection chips (`P1`–`P6`), comparative before-vs-after delta stat cards, and comprehensive diagnostics data tables.
3. **AI Chat (`/chat`):** Grounded conversational remediation assistant powered by Google Gemini (`gemini-3.7-flash`).
4. **Feedback Display / Activity Log (`/activity` or `/treatments`):** Chronological mission timeline, dual-reagent dispensing audit trails, and treatment event summary tables.

---

## 📖 Architecture & Documentation

Detailed technical blueprints are available in the `docs/` folder:

1. **[Architecture Overview](docs/architecture.md)** – Tech stack, layer separation, WebSocket streaming, and state management.
2. **[Navigation & Routing](docs/navigation-and-routes.md)** – 4-view sidebar hierarchy, desktop layout, and route guards.
3. **[Component Specifications](docs/component-specs.md)** – Design tokens, 15-minute countdown widget, reagent gauges, and buoyancy alert banner.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build
```
