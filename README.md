# Vibrance 2026 — Ticket Booking & Concurrency Lab

> **College Fest Ticket Booking System & Live DBMS Concurrency Control Simulation Lab**

---

## ⚡ Overview

**Vibrance 2026** is a modern, full-featured web application designed for collegiate festival ticket reservations combined with an interactive **Database Management System (DBMS) Concurrency Control & Transaction Simulation Engine**.

It models real-world flash-sale ticket contention under different isolation protocols and demonstrates theoretical database concepts like **Lost Updates**, **Race Conditions**, **Strict Two-Phase Locking (2PL)**, and **Optimistic Concurrency Control (OCC)**.

---

## 🚀 Key Highlights

- **Dual-Portal Experience**:
  - **Student Experience**: Browse 6 headline festival events, pick tiered seats on an interactive stage map, hold seats with a 3-minute lease lock, execute ACID checkout, and access digital holographic QR passes.
  - **Faculty & Admin Lab**: Benchmark 10 to 50+ concurrent transaction threads against 1 remaining seat. Inspect SQL traces, test No-Locking vs 2PL side-by-side, and monitor the global telemetry audit log.
- **DBMS Concurrency Protocols**:
  - **No Locking (Read Uncommitted)**: Demonstrates the race condition and duplicate ticket issuance bug.
  - **Strict Two-Phase Locking (2PL)**: Serializes requests via row-level Exclusive Locks (`SELECT ... FOR UPDATE`), guaranteeing zero overbooking.
  - **Optimistic Concurrency Control (OCC)**: Validates row version counters at commit time.
- **Pessimistic Lease Locking (3-min TTL)**: Global 1-second interval ticker that automatically expires held seats and returns them to inventory.
- **Compensating Transactions**: Full ticket cancellation flow executing compensating rollback transactions.

---

## 📚 Complete Project Documentation

For exhaustive architecture details, component specifications, TypeScript data models, and DBMS theoretical walkthroughs, see:
👉 **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS v4, Vite 6.2
- **Icons & FX**: Lucide React, Canvas Confetti
- **Styling**: Cyberpunk dark theme with custom holographic foil and perforated ticket notch styling

---

## 💻 Running the Project

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Build for production
npm run build
```
