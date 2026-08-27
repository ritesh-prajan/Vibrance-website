# Vibrance 2026 — College Fest Ticket Booking & Concurrency Lab
## Complete Project Documentation & Technical Architecture Manual

---

## 1. Executive Summary

**Vibrance 2026** is a full-stack, enterprise-grade college festival ticketing platform integrated with an interactive **Database Management System (DBMS) Concurrency Control & Transaction Simulation Engine**.

Built with **React 19, TypeScript, Tailwind CSS v4, and Vite**, the application serves two distinct user journeys:
1. **Student Experience**: A frictionless event catalog with live seat matrices, tiered pricing (VIP, Gold, Regular), real-time 3-minute pessimistic lease locking, instant checkout with ACID commit simulation, digital holographic QR e-tickets, and ticket cancellation via compensating transactions.
2. **Admin & Faculty Experience (DBMS Lab)**: A live transactional sandbox where students, professors, and engineers can benchmark concurrent transaction loads (10 to 50+ simultaneous threads) against a single remaining seat under three isolation protocols: **No Locking (Race Condition & Overbooking Anomaly)**, **Strict Two-Phase Locking (2PL / Serializable)**, and **Optimistic Concurrency Control (OCC / Row Versioning)**. It features side-by-side comparison cards, thread inspectors, SQL execution traces, and real-time inventory telemetry audit logs.

---

## 2. System Architecture & Tech Stack

```
+----------------------------------------------------------------------------------+
|                                Vibrance 2026 UI                                 |
+----------------------------------------------------------------------------------+
|  [Student Portal]                     |  [Admin & Faculty Portal]                |
|  - Events Catalog & Category Filters   |  - Concurrency Benchmark Lab (2PL / OCC) |
|  - Real-Time Seat Picker (3-min TTL)  |  - Side-by-Side Isolation Comparison     |
|  - Checkout & Confetti Celebration    |  - Real-Time Inventory Telemetry Hub     |
|  - Holographic QR E-Ticket & Passes   |  - Transaction & Lock Audit Stream       |
+---------------------------------------+------------------------------------------+
                                    |
                                    v
+----------------------------------------------------------------------------------+
|                   FestContext.tsx (Global DBMS State Engine)                     |
+----------------------------------------------------------------------------------+
|  - LocalStorage State Synchronization (Events, Bookings, Audit Logs, Benchmarks) |
|  - Global 1-second Lease Lock Ticker & Auto-Reclaim Engine                       |
|  - Concurrency Simulation Engine (Thread Pool, Mutex Locks, Version Tracking)    |
|  - Deterministic Latency & SQL Statement Trace Generator                         |
+----------------------------------------------------------------------------------+
                                    |
                                    v
+----------------------------------------------------------------------------------+
|                             TypeScript Data Layer                                |
|  - types.ts (User, Seat, FestEvent, Booking, SimulatedTx, ConcurrencyRunResult)  |
|  - mockEvents.ts (6 Headline Events, 288 Seats, Student & Faculty Profiles)     |
+----------------------------------------------------------------------------------+
```

### Technology Matrix

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`react`, `react-dom`) | Modern reactive component architecture with hooks |
| **Language** | TypeScript 5.8+ | End-to-end static type safety and contract enforcement |
| **Styling & Design System** | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first cyberpunk aesthetic with custom dark neutrals |
| **Build & Bundler** | Vite 6.2+ | Blazing fast ESM compilation and asset bundling |
| **Icons** | Lucide React (`lucide-react`) | Consistent iconography across student and admin views |
| **Animations & FX** | Canvas Confetti (`canvas-confetti`) | Festive particle celebration upon ticket confirmation |
| **Fonts** | Google Fonts | `Bebas Neue` (Display), `Space Grotesk` (Headings), `Plus Jakarta Sans` (Body), `JetBrains Mono` (Telemetry & SQL) |

---

## 3. Directory & File Structure

```
/
├── .env.example                       # Environment variable templates
├── index.html                         # HTML5 entry point with Google Web Fonts
├── metadata.json                      # Applet capabilities & metadata
├── package.json                       # Project dependencies & build scripts
├── tsconfig.json                      # TypeScript compiler configuration
├── vite.config.ts                     # Vite build configuration with Tailwind v4
├── PROJECT_DOCUMENTATION.md           # Exhaustive project & architecture reference
└── src/
    ├── main.tsx                       # React DOM entry point
    ├── App.tsx                        # Main application orchestrator & tab router
    ├── index.css                      # Global styles, custom ticket notches & holo foil
    ├── types.ts                       # Complete TypeScript domain interfaces & types
    ├── context/
    │   └── FestContext.tsx            # Global state manager & concurrency simulation engine
    ├── data/
    │   └── mockEvents.ts              # Initial seed data for 6 events & user profiles
    └── components/
        ├── Navbar.tsx                 # Responsive header with lock countdown & role switcher
        ├── LoginPage.tsx              # Full-screen dual portal sign-in (Student vs Admin)
        ├── LoginModal.tsx             # Quick-switch modal for in-app session swapping
        ├── EventCard.tsx              # Festival event card with live capacity meter
        ├── SeatPickerModal.tsx        # Interactive stage visualizer & 3-minute seat hold
        ├── CheckoutModal.tsx          # Multi-step ACID transaction confirmation flow
        ├── ETicketCard.tsx            # Holographic pass with scannable QR & barcode
        ├── MyBookingsView.tsx         # Student passes wallet & compensating rollback cancel
        ├── ConcurrencySimulator.tsx   # Concurrency benchmark lab & thread visualizer
        └── AdminAuditDashboard.tsx    # Live telemetry, venue allocations & audit logs
```

---

## 4. DBMS Concurrency & Transaction Theory

The core academic innovation of this project is its interactive implementation of classic Database Management System (DBMS) transaction and concurrency control mechanisms.

### 4.1 The Race Condition & Lost Update Anomaly (Flash-Sale Problem)
In a high-traffic festival ticketing platform, hundreds of students concurrently attempt to book the last available ticket. Without proper concurrency control, a classic **Lost Update / Dirty Read** anomaly occurs:

```
Thread A (Student 1)           Thread B (Student 2)           Database State (Seat A-1)
--------------------           --------------------           -------------------------
1. SELECT stock (Reads 1)                                     stock = 1
2.                             1. SELECT stock (Reads 1)      stock = 1
3. UPDATE stock = stock - 1                                   stock = 0 (Committed)
4.                             2. UPDATE stock = stock - 1    stock = -1 (OVERBOOKED!)
```

### 4.2 Implemented Concurrency Protocols

#### 1. `NO_LOCKING` (Read Uncommitted / Interleaved Race Condition)
- **Mechanism**: Every concurrent worker thread performs a non-locking `SELECT seats_available`, determines that stock is greater than 0, and writes an `UPDATE` statement.
- **Outcome**: The database inventory drops into **negative numbers** (e.g., -1, -2). Multiple duplicate tickets are issued for the exact same physical seat, demonstrating a severe **Overbooking Bug**.

#### 2. `TWO_PHASE_LOCKING` (Strict 2PL / Serializable Isolation)
- **Mechanism**:
  - **Growing Phase**: The first transaction issues a `SELECT ... FOR UPDATE` query, requesting an **Exclusive Lock (X-Lock)** on the target seat record.
  - **Conflict Resolution**: All subsequent concurrent transactions attempting to acquire an X-Lock on the same row are denied due to lock contention and immediately receive an `HTTP 409 Conflict` (Rollback).
  - **Shrinking Phase**: The X-Lock is held until the transaction finishes writing the `bookings` table and executing `COMMIT`.
- **Outcome**: Exactly **1 transaction succeeds** and reaches `COMMITTED` status. All other requests are safely rejected. **Zero overbooking** is guaranteed, preserving serializability.

#### 3. `OPTIMISTIC_OCC` (Optimistic Concurrency Control / Row Versioning)
- **Mechanism**:
  - **Read Phase**: Transactions read the current stock and note the record's `version` timestamp/counter (e.g., `v1`).
  - **Validation & Write Phase**: At commit time, transactions execute an atomic conditional write:
    ```sql
    UPDATE fest_inventory 
    SET seats_available = 0, version = version + 1 
    WHERE seat_id = 'target' AND version = 1;
    ```
  - The first transaction increments the version to `v2`. All subsequent transactions find 0 matching rows (`version != 1`) and trigger a safe **Optimistic Collision Abort / Rollback**.
- **Outcome**: Serializability preserved without holding long-lived row mutexes.

### 4.3 Pessimistic Lease Locking with TTL (Seat Hold Flow)
- When a student selects a seat in the UI, an exclusive temporary lease lock is created with a **Time-To-Live (TTL) of 180 seconds (3 minutes)**.
- `FestContext` runs a continuous 1-second interval timer. If the student does not complete payment before the countdown reaches 0:
  1. The lease lock automatically expires.
  2. A `LOCK_EXPIRED` audit log entry is recorded.
  3. The seat status reverts to `available` in the global pool for other students to claim.

### 4.4 Compensating Transactions (Rollback on Cancellation)
- When a student cancels an existing confirmed ticket:
  1. The booking status updates to `CANCELLED`.
  2. The system executes a compensating transaction that reverts the booked seat status back to `available`.
  3. A `TICKET_CANCELLED` audit entry is appended with protocol classification `Transaction Compensating Rollback`.

---

## 5. Component Breakdown & Functional Specifications

### 5.1 `src/App.tsx`
- **Role**: Root application controller and layout orchestrator.
- **Key Features**:
  - Checks `currentUser` session: if unauthenticated, renders `LoginPage`; otherwise renders main view with `Navbar`.
  - Tab routing among 4 views:
    - `'events'`: Student festival catalog with search, category filtering, and festival hero banner.
    - `'my-bookings'`: Student pass wallet.
    - `'concurrency-lab'`: Admin concurrency benchmark lab (default for Admin role).
    - `'audit-hub'`: Admin real-time telemetry and audit stream.
  - Controls modal state for `SeatPickerModal`, `CheckoutModal`, and `ETicketCard`.

### 5.2 `src/context/FestContext.tsx`
- **Role**: Global state container and transaction simulation runtime.
- **Exported State & Methods**:
  - `currentUser`: Current active `UserProfile` or `null`.
  - `loginAsStudent(name, reg, dept)` & `loginAsAdmin(name, staffId, dept)`: Role login handlers.
  - `logout()` & `switchRole(role)`: Session transition utilities.
  - `events`: Array of `FestEvent` objects with live seat states.
  - `activeSeat` & `seatLockTimeRemaining`: Active seat hold state and countdown in seconds.
  - `selectSeatForBooking(event, seat)`: Acquires 3-minute exclusive student lock.
  - `releaseActiveSeat()`: Manually relinquishes active hold.
  - `confirmBooking(details)`: Executes simulated multi-step transaction and returns confirmed `Booking`.
  - `myBookings`: User's collection of festival passes.
  - `cancelBooking(bookingId)`: Performs compensating transaction.
  - `auditLogs`, `addAuditLog`, `clearAuditLogs`: Telemetry log store (capped at 150 entries).
  - `isSimulating`, `simulationProgress`, `lastSimResult`, `simHistory`: Benchmark engine state.
  - `runConcurrencySimulation({ strategy, concurrencyLevel, targetEventId, targetSeatId, speedMs })`: Core multi-threaded simulation pipeline.
  - `resetDatabaseState()`: Re-initializes all venues and inventories to benchmark baseline.

### 5.3 `src/components/ConcurrencySimulator.tsx`
- **Role**: Admin DBMS Concurrency Testing Lab.
- **Key Features**:
  - **Protocol Selector**: Choose between No Locking, Strict 2PL, or Optimistic OCC.
  - **Concurrency Level**: 10, 25, or 50 simultaneous client threads.
  - **Pace Slider**: From 5ms (High Speed stress test) to 100ms (Lecture granular trace).
  - **Side-by-Side Comparison Mode**: Executes No-Locking and Strict 2PL consecutively and renders direct metric comparison cards highlighting overbooking anomalies vs guaranteed serializability.
  - **Interactive Thread Matrix**: Visual grid of worker thread pills (T-1 to T-50) colored by status (Committed, Overbooked, Conflict 409).
  - **SQL Trace Inspector**: Clicking any thread opens a drawer showing line-by-line SQL statements (`BEGIN TRANSACTION`, `SELECT ... FOR UPDATE`, `UPDATE`, `COMMIT/ROLLBACK`).
  - **Audit Table with Filter Tabs**: Filter logs by All, Committed, or Rejected.

### 5.4 `src/components/AdminAuditDashboard.tsx`
- **Role**: Global festival telemetry and DBMS inventory hub.
- **Key Features**:
  - Aggregate metrics: Total Pass Inventory (288 seats), Confirmed Commits, Active 2PL Lease Locks, and Available Seat Pool.
  - Venue Capacity Breakdown: Visual progress bars showing Booked (Red), Held (Amber), and Available (Lime) percentages across all 6 fest stages.
  - Real-Time Audit Log Table: Searchable by student name, roll number, event, or seat label, with status filters (Success, Conflict, Anomaly Overbook).
  - 1-Click Database Reset button to re-seed initial data.

### 5.5 `src/components/SeatPickerModal.tsx`
- **Role**: Stage seating matrix and lease lock acquisition UI.
- **Key Features**:
  - Curved gradient festival audio stage banner.
  - Tiered seat grid (Rows A-B: VIP Front, Rows C-D: Gold, Rows E-F: Regular).
  - Distinct interactive seat states:
    - **Available**: Selectable with tier accent borders.
    - **Selected (You)**: Electric lime pill with checkmark and active 3-minute timer.
    - **Locked (Other)**: Amber pulsing pill indicating active hold by another session.
    - **Booked**: Dimmed slate pill indicating committed database record.
  - Hover telemetry card displaying seat coordinates, category, price, and lock status.

### 5.6 `src/components/CheckoutModal.tsx`
- **Role**: Ticket checkout and ACID transaction commit visualizer.
- **Key Features**:
  - Displays active seat hold countdown timer.
  - Pre-fills student credentials from active session.
  - Payment channel selector: Campus UPI (GPay/PhonePe), RFID Student Smart Card, or NetBanking.
  - Simulated 3-stage transactional progress indicator:
    1. `Validating Exclusive Lease Lock (X-Lock)...`
    2. `Executing Transaction & Write-Ahead Log (WAL)...`
    3. `Committing ACID Transaction & Generating Pass...`
  - On successful commit, fires celebratory `canvas-confetti` fireworks.

### 5.7 `src/components/ETicketCard.tsx`
- **Role**: Premium holographic digital festival pass.
- **Key Features**:
  - Holographic foil banner header (`.holo-foil`) with official Vibrance 2026 branding.
  - Perforated ticket cutout notches (`.ticket-notch-left`, `.ticket-notch-right`) and dashed boundary lines.
  - Student identity block with Name, Registration Number, and Academic Department.
  - Cryptographically styled deterministic QR Code canvas and visual barcode strip.
  - Save / Print action (`window.print()`).

### 5.8 `src/components/MyBookingsView.tsx`
- **Role**: Student pass wallet.
- **Key Features**:
  - Grid of all confirmed passes.
  - 1-click modal viewing of full digital e-ticket.
  - Ticket cancellation modal that triggers a DBMS compensating rollback transaction.
  - History list of released and cancelled passes.

### 5.9 `src/components/LoginPage.tsx` & `src/components/LoginModal.tsx`
- **Role**: Dual-portal authentication interface.
- **Key Features**:
  - Dedicated Student Portal and Faculty/Admin Portal.
  - 1-click quick preset buttons for sample student profiles (Rahul Sharma, Ananya Iyer, Kabir Verma) and faculty profiles (Dr. Ramesh Sundaram, Prof. Meera Kulkarni).
  - Custom input fields for custom names, roll numbers, departments, and admin authorization keys.

### 5.10 `src/components/EventCard.tsx`
- **Role**: Festival event catalog card.
- **Key Features**:
  - Custom category badge with dynamic theme accent colors.
  - Real-time seat capacity meter displaying exact counts of booked, locked, and available seats.
  - "High Demand" pulse badge when available seats drop to 6 or fewer.

### 5.11 `src/components/Navbar.tsx`
- **Role**: Sticky top navigation bar.
- **Key Features**:
  - Live global seat hold timer banner if user currently holds an uncommitted seat.
  - Role-aware navigation tabs (`Events`, `My Passes`, `⚡ System Lab`, `Audit & Telemetry`).
  - Active user session dropdown with quick role navigation, database reset trigger, and sign-out.

---

## 6. TypeScript Data Models (`src/types.ts`)

```typescript
export type UserRole = 'STUDENT' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  regNumber: string;
  email: string;
  role: UserRole;
  department: string;
  avatarSeed: string;
}

export type EventCategory = 
  | 'PRO_SHOW' 
  | 'EDM' 
  | 'BATTLE_OF_BANDS' 
  | 'DANCE' 
  | 'HACKATHON' 
  | 'COMEDY';

export interface Seat {
  id: string;
  row: string;
  number: number;
  category: 'VIP_FRONT' | 'GOLD' | 'REGULAR';
  price: number;
  status: 'available' | 'selected' | 'locked' | 'booked';
  lockedBy?: {
    userId: string;
    userName: string;
    regNumber: string;
  };
  lockExpiresAt?: number; // Timestamp (ms)
  bookedBy?: {
    userId: string;
    userName: string;
    regNumber: string;
    bookingRef: string;
  };
}

export interface FestEvent {
  id: string;
  title: string;
  category: EventCategory;
  artistOrHost: string;
  date: string;
  time: string;
  venue: string;
  basePrice: number;
  totalSeats: number;
  availableSeats: number;
  lockedSeatsCount: number;
  bookedSeatsCount: number;
  accentColor: string;
  tag: string;
  shortDesc: string;
  seats: Seat[];
}

export interface Booking {
  id: string;
  bookingRef: string;
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
  artistOrHost: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  seatId: string;
  seatLabel: string;
  seatCategory: string;
  studentName: string;
  regNumber: string;
  department: string;
  amount: number;
  paymentMethod: 'UPI' | 'CAMPUS_CARD' | 'NET_BANKING';
  bookedAt: number;
  qrPayload: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export type ConcurrencyStrategy = 
  | 'NO_LOCKING' 
  | 'TWO_PHASE_LOCKING' 
  | 'OPTIMISTIC_OCC';

export type TxStep = 
  | 'INIT' 
  | 'READ_DATA' 
  | 'ACQUIRE_LOCK' 
  | 'VALIDATE' 
  | 'WRITE_DATA' 
  | 'COMMIT' 
  | 'ABORT';

export interface SimulatedTx {
  txId: string;
  clientIndex: number;
  clientName: string;
  regNumber: string;
  status: 'PENDING' | 'RUNNING' | 'LOCKED' | 'COMMITTED' | 'REJECTED' | 'ROLLEDBACK';
  currentStep: TxStep;
  startTs: number;
  finishTs?: number;
  latencyMs: number;
  seatAllocated?: string;
  message: string;
  sqlStatements: string[];
  lockAcquired?: boolean;
  versionRead?: number;
}

export interface ConcurrencyRunResult {
  runId: string;
  timestamp: number;
  strategy: ConcurrencyStrategy;
  concurrencyLevel: number;
  targetEventTitle: string;
  targetSeatLabel: string;
  initialStock: number;
  finalStock: number;
  successfulCount: number;
  rejectedCount: number;
  overbookingDetected: boolean;
  overbookedSeats: number;
  durationMs: number;
  transactions: SimulatedTx[];
  dbLogs: string[];
}

export interface AuditLog {
  id: string;
  timestamp: number;
  action: 
    | 'BOOKING_ATTEMPT' 
    | 'LOCK_ACQUIRED' 
    | 'LOCK_EXPIRED' 
    | 'BOOKING_COMMITTED' 
    | 'LOCK_REJECTED' 
    | 'RACE_OVERBOOK' 
    | 'TICKET_CANCELLED';
  eventId: string;
  eventTitle: string;
  seatLabel: string;
  userName: string;
  regNumber: string;
  status: 'SUCCESS' | 'CONFLICT' | 'ANOMALY_OVERBOOK' | 'RELEASED';
  details: string;
  protocol?: string;
}
```

---

## 7. Initial Seed Data (`src/data/mockEvents.ts`)

The project seeds **6 distinct headline events** across various campus venues with 48 seats each (total 288 seats):

1. **PRO-SHOW: ARMAAN MALIK LIVE**
   - Category: `PRO_SHOW` | Venue: Open Air Amphitheatre (Main Stage)
   - Accent Color: `#CCFF00` (Electric Lime) | Base Price: ₹699
   - High contention baseline (4 available seats remaining out of 48).
2. **EDM NIGHT: LOST STORIES**
   - Category: `EDM` | Venue: Campus Arena Ground (Dome Stage)
   - Accent Color: `#00E5FF` (Cyber Cyan) | Base Price: ₹499
3. **BATTLE OF THE BANDS: DECIBEL WAR**
   - Category: `BATTLE_OF_BANDS` | Venue: Auditorium Hall 1 (Acoustic Center)
   - Accent Color: `#FF3366` (Neon Coral) | Base Price: ₹249
4. **CHOREONITE: CREW CLASH**
   - Category: `DANCE` | Venue: Indoor Sports Complex Auditorium
   - Accent Color: `#B026FF` (Electric Purple) | Base Price: ₹299
5. **HACKVIBRANCE: 36-HOUR BUILDATHON**
   - Category: `HACKATHON` | Venue: Tech Park Incubator Lab 4
   - Accent Color: `#FFD700` (Gold) | Base Price: ₹199
6. **STAND-UP NIGHT: BISWA KALYAN RATH**
   - Category: `COMEDY` | Venue: Main Auditorium (Central Wing)
   - Accent Color: `#00FFA3` (Mint Green) | Base Price: ₹399

---

## 8. Styling, Aesthetics & Custom CSS Classes (`src/index.css`)

The application embraces a high-contrast dark aesthetic tailored for campus festivals and technical telemetry:

- **Background Neutral**: `#080A0F` (Obsidian Charcoal)
- **Container Surfaces**: `#0E121A` and `#121620` (Subtle blue-gray tint)
- **Accent Primaries**:
  - `#CCFF00` (Electric Lime — Action & Student highlights)
  - `#00E5FF` (Cyber Cyan — Admin & Telemetry highlights)
  - `#FF3366` (Neon Coral — Band & Conflict highlights)
  - `#FFB800` (Amber Gold — Lock & Timer alerts)

### Custom CSS Classes

```css
/* Perforated Ticket Notches */
.ticket-notch-left::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -12px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-color: #080a0f;
  border-radius: 9999px;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
  z-index: 10;
}

.ticket-notch-right::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-color: #080a0f;
  border-radius: 9999px;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  z-index: 10;
}

/* Holographic foil shine */
.holo-foil {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(204, 255, 0, 0.12) 25%,
    rgba(0, 229, 255, 0.12) 50%,
    rgba(255, 51, 102, 0.12) 75%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 200%;
}
```

---

## 9. Step-by-Step User Workflows

### 9.1 Student Reservation Flow
1. **Login**: Navigate to Student Portal and pick a profile preset (e.g., Rahul Sharma).
2. **Catalog**: Browse events and filter by category (e.g., Pro-Shows).
3. **Seat Selection**: Click **Select Seat** on "Armaan Malik Live".
4. **Acquire Hold**: Click any available VIP seat (e.g., `A-1`). The 3-minute lease lock timer activates immediately.
5. **Checkout**: Click **Proceed to Booking**, choose Campus UPI payment, and click **Confirm & Commit Booking**.
6. **Pass Generation**: Receive confetti celebration and view your digital E-Ticket with QR pass.
7. **Management**: View or cancel passes from the **My Passes** tab at any time.

### 9.2 Admin Concurrency Demonstration Flow
1. **Login**: Switch to Admin Portal (e.g., Dr. Ramesh Sundaram).
2. **Open System Lab**: Click **⚡ System Lab** in the navigation bar.
3. **Configure Benchmark**:
   - Strategy: `No Locking` vs `Strict Two-Phase Locking`
   - Concurrency Level: `25 Requests`
   - Target Seat: `Armaan Malik Live [A-1]` (1 remaining seat).
4. **Side-by-Side Comparison**: Click **Compare Side-by-Side**.
5. **Analyze Results**:
   - Observe the No-Locking card show an **Overbooking Bug** (multiple committed passes for 1 seat).
   - Observe the 2PL card show **Serializability Preserved** (1 commit, 24 conflicts).
6. **Thread Inspection**: Click thread `TX_101` and `TX_102` to inspect exact SQL lock statements and timestamps.
7. **Telemetry & Audit**: Navigate to **Audit & Telemetry** to review real-time venue capacity graphs and transactional logs.

---

## 10. Developer Guide & Execution Commands

### Prerequisites
- Node.js 18+ or Bun
- npm or yarn

### Local Setup
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run TypeScript typecheck & production build
npm run build
```

---

*Documentation compiled for Vibrance 2026 — Database Management Systems (DBMS) & Concurrency Control Laboratory.*
