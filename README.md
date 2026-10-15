# Vibrance 2026 — Enterprise Festival Ticketing & DBMS Concurrency Engine

> **A Complete, Dual-Tier Enterprise Ticketing System & Interactive Relational Database Management System (DBMS) Concurrency Simulation Lab.**  
> Built for Academic Demonstration, Rigorous Viva Defense, and Production-Grade ACID Transaction Verification.

---

## 🏛️ System Architecture

Vibrance 2026 is engineered as a full-stack, database-driven enterprise web application:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   VIBRANCE 2026 FRONTEND (PORT 3000)                   │
│         React 19 • TypeScript 5.8 • Tailwind CSS v4 • Vite 6           │
│  Interactive Seat Matrix • Holographic Passes • Live Concurrency Lab   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Reverse Proxy (/api -> :8080)
┌───────────────────────────────────▼────────────────────────────────────┐
│                SPRING BOOT 3.3.5 BACKEND ENGINE (PORT 8080)            │
│       Java 17 LTS • Maven • Spring Data JPA • Spring Security (JWT)    │
│    Strict 2PL Pessimistic Locking • OCC Versioning • Swagger OpenAPI   │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
┌──────────────────▼────────────────┐   ┌────────────▼───────────────────┐
│     POSTGRESQL 18 (PORT 5432)     │   │      AUTOMATED MIGRATIONS      │
│  Strict 3NF/BCNF Relational Model │   │ Flyway V1 (DDL), V2 (Seeds),   │
│ 8 Relations, 4 Views, Functions   │   │ V3 (Analytical Reports & Views)│
└───────────────────────────────────┘   └────────────────────────────────┘
```

---

## ⚡ Tech Stack Specifications

### Backend Platform
- **Language / Runtime**: Java 17 LTS (Microsoft OpenJDK 17.0.19)
- **Framework**: Spring Boot 3.3.5
- **Persistence**: Spring Data JPA, Hibernate ORM 6.5
- **Database Engine**: PostgreSQL 18
- **Schema Versioning**: Flyway Core & Flyway PostgreSQL
- **Security & Tokens**: Spring Security 6, JJWT 0.12.6 (HMAC-SHA256/384)
- **API Documentation**: SpringDoc OpenAPI 3.0 / Swagger UI (`/swagger-ui.html`)
- **Unit & Integration Testing**: JUnit 5, Mockito, Spring Boot Test, H2 In-Memory (Test Profile)
- **Build System**: Apache Maven 3.9+

### Frontend Platform
- **UI Framework**: React 19 (Hooks, Context API, Suspense)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS v4, Glassmorphism UI tokens
- **Animations & Interaction**: Framer Motion, Canvas Confetti, Lucide React
- **Build & Dev Tool**: Vite 6.2 (with automated `/api` backend proxy)

---

## 🚀 Quick Start Guide

### Prerequisites
1. **Java 17 LTS**: Verify with `java -version`
2. **Node.js 18+ & npm**: Verify with `node -v`
3. **PostgreSQL 18** (or 14+): Running on `localhost:5432` with user `postgres` / password `1234`
4. **IntelliJ IDEA** (Ultimate or Community) or VS Code

### Step 1: Database Setup
Launch `psql` or pgAdmin and create the main database:
```sql
CREATE DATABASE vibrance_db;
```
*(Flyway will automatically create all tables, indexes, views, and seed data on the first backend boot).*

### Step 2: Launch the Spring Boot Backend
```powershell
# Set Java 17 Home
$env:JAVA_HOME="C:\Users\rites\.jdks\ms-17.0.19"

# Navigate and boot backend (runs on http://localhost:8080)
cd backend
mvn spring-boot:run
```
*Verify API Documentation at:* **`http://localhost:8080/swagger-ui/index.html`**

### Step 3: Launch the React Frontend
Open a second terminal window:
```powershell
# From project root
npm install
npm run dev
```
*Access the Web Application at:* **`http://localhost:3000`**

---

## 🧪 Automated Test Suite Execution

All unit, integration, and security tests can be executed via Maven:
```powershell
$env:JAVA_HOME="C:\Users\rites\.jdks\ms-17.0.19"
mvn clean test -f backend/pom.xml
```

**Test Coverage Summary**:
- `SeatServiceTest`: Tests Strict 2PL lease holds, active contention rejection, TTL expiry takeovers, and manual lease releases.
- `BookingServiceTest`: Tests ACID atomic seat bookings, double-booking contention prevention, and concurrent transaction aborts.
- `ScanServiceTest`: Tests gatehouse QR verification, duplicate check-in interception, and invalid pass detection.
- `VibranceApplicationTests`: Verifies complete Spring ApplicationContext bootstrap with JPA repositories and H2 in-memory test database.

---

## 🎓 College DBMS Viva & Demonstration Artifacts

Exhaustive documentation has been prepared specifically for evaluation:

| Deliverable | Location | Description |
|---|---|---|
| **ER Diagram & Normalization** | [`docs/ER_DIAGRAM.md`](./docs/ER_DIAGRAM.md) | Full Mermaid diagram, 8 entities, cardinalities, constraints, and 1NF, 2NF, 3NF, BCNF proofs. |
| **Complex SQL Queries** | [`docs/DBMS_DEMONSTRATION_QUERIES.sql`](./docs/DBMS_DEMONSTRATION_QUERIES.sql) | Multi-table JOINs, window functions (`ROW_NUMBER`, `DENSE_RANK`), multi-stage CTEs, 2PL row locks, and OCC version checks. |
| **Postman API Collection** | [`docs/VIBRANCE_API_POSTMAN_COLLECTION.json`](./docs/VIBRANCE_API_POSTMAN_COLLECTION.json) | Complete Postman v2.1.0 suite covering Auth, Events, Seats, Bookings, Scans, Reports, and Concurrency Lab. |
| **Database Migrations** | [`backend/src/main/resources/db/migration/`](./backend/src/main/resources/db/migration/) | Flyway `V1__init_schema.sql`, `V2__seed_data.sql`, and `V3__views_and_functions.sql`. |

---

## 🔬 Core DBMS Features Demonstrated

### 1. Strict Two-Phase Locking (Strict 2PL)
- **Growing Phase**: During `/api/v1/seats/lock` and `/api/v1/bookings`, the engine issues a pessimistic row-level exclusive lock using Hibernate:
  ```sql
  SELECT * FROM seats WHERE id = ? FOR UPDATE;
  ```
- **Shrinking Phase**: All locks held by the transaction are exclusively retained until the transaction concludes with an atomic `COMMIT` or `ROLLBACK`.

### 2. Time-To-Live (TTL) Lease Locking
- In high-contention flash sales, users who abandon their cart must not block inventory indefinitely.
- Seats selected for checkout acquire a strict 120–300 second lease (`lock_expires_at`).
- An automated `@Scheduled` sweeper running every 10 seconds asynchronously garbage-collects expired leases back to the pool.

### 3. Concurrency Simulation Benchmark Lab
- Located at `/admin/concurrency` in the frontend or `/api/v1/concurrency/simulate`.
- Spawns multi-threaded worker pools (25 to 100 concurrent virtual clients) competing for the exact same physical seat:
  - **No Locking**: Demonstrates lost updates and the overbooking hazard.
  - **Strict 2PL**: Serializes execution with zero duplicate sales.
  - **Optimistic OCC**: Validates version stamps (`@Version`), cleanly rejecting stale writers.

### 4. Gate Interception & Telemetry
- Simulates real physical gate turnstiles (`/staff` view).
- Scans QR payloads cryptographically hashed with attendee metadata.
- Intercepts and logs duplicate admission attempts in `audit_logs` and `scan_records`.

---

## 👤 Pre-Seeded Demonstration Personas

| Role | Name | Registration No | Description |
|---|---|---|---|
| **Student Attendee** | Rahul Sharma | `RA2111003010142` | CS 3rd Year. Books tickets, views passes. |
| **Gatekeeper Staff** | Officer Rajesh Menon | `STF-GATE-04` | Main Gate Security. Scans tickets, intercepts duplicates. |
| **Faculty Admin** | Dr. Vikramaditya Rao | `ADMIN-FACULTY-01` | Examines analytics, triggers concurrency simulations. |

---

## 📄 License
Academic and Educational Demonstration Project — VIT Chennai / Vibrance Festival.
