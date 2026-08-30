# Web Component Specifications

This document defines the component specifications, design tokens, and UI domain widgets for the **SHELLOC Web Portal**.

---

## 1. Design System & Theme Tokens

The design follows a high-precision, technical **Autonomous Robotics Dark Mode** theme:

| Token | Hex / Value | Semantic Role | Tailwind Utility |
|---|---|---|---|
| `background` | `#0B111E` | Deep navy base background | `bg-background` |
| `surface` | `#151F32` | Elevated card & sidebar container | `bg-surface` |
| `surface-elevated` | `#1E293B` | Interactive items, table rows, inputs | `bg-surface-elevated` |
| `surface-border` | `#23334E` | Subtle divider and container borders | `border-surface-border` |
| `ink` | `#F8FAFC` | High-contrast white text | `text-ink` |
| `ink-muted` | `#94A3B8` | Secondary slate text & units | `text-ink-muted` |
| `ink-subtle` | `#64748B` | Disabled / timestamp text | `text-ink-subtle` |
| `brand` | `#00F2FE` | Vibrant Cyan brand accent & active states | `text-brand`, `bg-brand` |
| `leaf` | `#10B981` | Neon Green for optimal / remediated state | `text-leaf`, `bg-leaf` |
| `danger` | `#EF4444` | Coral Red for critical alerts & failsafes | `text-danger`, `bg-danger` |
| `amber` | `#F59E0B` | Amber for warnings & incubating state | `text-amber`, `bg-amber` |

---

## 2. Core UI Components (`src/components/core/`)

### 1. `Card`
- Elevated dark slate container (`bg-surface`) with border stroke (`border border-surface-border`), rounded corners (`rounded-2xl` or `rounded-3xl`), and subtle drop shadow.

### 2. `Badge`
- Pill-shaped status badge with glowing beacon dot.
- Variants: `brand` (Cyan), `leaf` (Green), `amber` (Amber), `danger` (Red), `neutral` (Slate).

### 3. `Button`
- Tactile interactive button with spring hover/active states.
- Variants: `primary` (Cyan), `secondary` (Slate), `danger` (Red), `outline`.

### 4. `StatusHeader`
- Persistent top bar displaying robot ID (`SHELLOC-01`), connection status beacon, active mission state, operation mode (Autonomous / Manual), and battery percentage.

---

## 3. Domain Component Specifications (`src/components/domain/`)

### 1. `CountdownTimer` (15-Minute Incubation Widget)
- **Visuals:** Circular SVG ring surrounding a digital countdown clock (`MM:SS`).
- **Behavior:** Binds to `timer_remaining_sec` from the live WebSocket telemetry stream when `mission_state === "incubating_15m"`. Features a pulsing cyan glow ring during incubation.

### 2. `ReagentGauge` (Consumables Reservoir Card)
- **Visuals:** Multi-tank progress cards displaying:
  - **Moringa-Chitosan Tank:** `0–100%` (Cyan gauge) with low-level alert `< 20%`.
  - **Citric Acid Tank:** `0–100%` (Amber gauge) with low-level alert `< 15%`.
  - **Biochar Cartridge Status:** Health indicator (`OPTIMAL`, `DEGRADED`, `REPLACE`).

### 3. `BuoyancyAlert` (Failsafe Banner)
- **Visuals:** High-visibility coral/amber warning banner with an animated pulsing alert icon.
- **Trigger:** Displays when `overall_status === "buoyancy_failsafe"` or `buoyancy_failsafe_active === True`.
- **Text:** *"GPS Signal Lost: Buoyancy Ballast Pump Active (120 mL/min). Elevating antenna mast to restore satellite lock."*

### 4. `StatCard` (Comparative & Live Telemetry)
- **Comparative Mode:** Renders before-vs-after delta metrics with percentage improvement pill for Turbidity (NTU), pH, TDS (ppm), and Temperature (°C).
- **Live Metric Mode:** Displays single real-time metric with category icon and sparkline trend.

### 5. `AdaptiveRemediationBadge`
- **Visuals:** Contextual callout tag rendered in Diagnostics and Activity tables when secondary remediation occurs:
  - `Citric Acid: +15 mL (pH Neutralization)`
  - `Secondary Moringa: +20 mL (Turbidity Clearing)`
