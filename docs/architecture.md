# Web Portal Architecture

This document defines the high-level architecture, state synchronization, and component hierarchy for the **SHELLOC Web Portal**.

---

## 1. Tech Stack

- **Framework:** React 19 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3.4 (Dark Mode Robotics Aesthetic)
- **Mapping:** React-Leaflet / Leaflet with CartoDB Dark Matter tiles
- **Iconography:** `lucide-react`
- **State Management & Caching:** TanStack React Query (`@tanstack/react-query`) with WebSocket stream integration
- **AI Integration:** Google Gemini (`gemini-3.7-flash` via Backend AI Gateway)

---

## 2. Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PAGE LAYER (`src/pages`)                 │
│  4 Views: Home (`/`), Diagnostics, AI Chat, Feedback Log    │
├─────────────────────────────────────────────────────────────┤
│               LAYOUT LAYER (`src/components/layout`)        │
│  AppLayout (Desktop Sidebar Nav + Top StatusHeader)         │
├─────────────────────────────────────────────────────────────┤
│               COMPONENT LAYER (`src/components`)            │
│  Core Design System & Domain Widgets (Countdown, Gauges)    │
├─────────────────────────────────────────────────────────────┤
│                 LOGIC LAYER (`src/hooks`)                   │
│  `useTelemetry`, `useWaypoints`, `useChat`, `useDispatch`   │
├─────────────────────────────────────────────────────────────┤
│         STATE & TRANSPORT LAYER (`src/services`, `store`)   │
│  React Query Cache, WebSocket Subscriber, REST API Client   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```text
src/
├── components/
│   ├── core/             # Typography, Card, Badge, Button, StatusHeader
│   ├── domain/           # StatCard, CountdownTimer, ReagentGauge, ProgressRing, BuoyancyAlert
│   └── layout/           # AppLayout (Sidebar, Top StatusHeader, Content Area)
├── hooks/                # Custom React hooks (useTelemetry, useWaypoints, useChat)
├── lib/                  # Utility functions (cn, formatting)
├── pages/                # 4 Primary Page Views
│   ├── Dashboard.tsx     # [View 1] Home (Telemetry HUD & Reagent Levels)
│   ├── Diagnostics.tsx   # [View 2] Diagnostics (GIS Zone Map, Radar, Delta Cards, Table)
│   ├── Chat.tsx          # [View 3] AI Chat (Google Gemini Assistant)
│   └── Treatments.tsx    # [View 4] Feedback Display / Activity Log
├── services/             # API client and WebSocket connection manager
├── types/                # TypeScript interfaces mirroring backend schemas
└── App.tsx               # React Router configuration
```

---

## 4. Closed-Loop Real-Time Telemetry Flow

1. **WebSocket Telemetry Stream:** Connects to `ws://localhost:8000/ws/robot/{robot_id}`. Real-time updates update the 15-minute countdown (`timer_remaining_sec`), buoyancy alerts, and GPS position on the Leaflet radar map.
2. **TanStack React Query Cache:** Invalids and refreshes waypoint lists and sensor historical readings upon status updates.
3. **Google Gemini AI:** Grounded multi-turn chat directly interprets real-time sensor deltas and closed-loop treatment efficacy.
