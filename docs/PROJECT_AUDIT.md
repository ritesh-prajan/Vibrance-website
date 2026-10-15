# Vibrance 2026 — Comprehensive Project Audit & Baseline Report

**Date**: October 15, 2026  
**Auditor**: Senior Software Engineer, PostgreSQL Architect, Security & QA Specialist  
**Repository**: `https://github.com/ritesh-prajan/Vibrance-website.git`  
**Branch**: `main` (baseline commit: `694fd37`)  

---

## 1. Executive Summary & Existing Architecture

Vibrance 2026 is an enterprise festival management, seat reservation, and database concurrency simulation system designed for high-concurrency event ticketing. The application is built using a decoupled client-server architecture:

- **Frontend**: Single Page Application built with React 19.0.1, TypeScript 5.8.2, Tailwind CSS 4.1.14, Vite 6.2.3, and Motion (Framer Motion). It communicates with the backend via REST APIs under `/api/v1/*`.
- **Backend**: Spring Boot 3.3.5 RESTful micro-service running on Java 17 LTS (OpenJDK 17.0.19), with Spring Data JPA, Hibernate ORM 6.5.3, Spring Security 6.3, and JJWT 0.12.6.
- **Database**: PostgreSQL 18 relational database engine with strict 3NF schema, Flyway version-controlled migrations (`V1__init_schema.sql`, `V2__seed_festival_data.sql`, `V3__views_and_functions.sql`), row-level Two-Phase Locking (2PL), and Optimistic Concurrency Control (OCC).
- **Development Tooling**: Windows 11 with IntelliJ IDEA, Maven 3.9.6, Node.js v24.14.0, and npm 11.9.0.

---

## 2. Baseline Build and Test Status (Verified Run)

All checks were executed directly in the project environment prior to any source modifications:

| Check | Tool / Command | Result | Notes |
| :--- | :--- | :--- | :--- |
| **Java Environment** | `java -version` | **PASS** | OpenJDK 17.0.19 LTS (Microsoft-13877129) |
| **Node.js Environment** | `node -v && npm -v` | **PASS** | Node.js v24.14.0, npm 11.9.0 |
| **PostgreSQL Service** | `postgresql-x64-18` on port 5432 | **PASS** | Running, TCP port 5432 listening |
| **Frontend TypeScript** | `npx tsc --noEmit` | **PASS** | 0 compile errors |
| **Frontend Production Build** | `npm run build` | **PASS** | Vite bundle successfully created in `dist/` |
| **Backend Compilation** | `mvn compile` | **PASS** | 55 Java source files compiled with 0 errors |
| **Backend Test Suite** | `mvn test` | **PASS** | 13/13 tests passed (Booking, Seat, Scan, App context) |

---

## 3. Architecture & Feature Mapping Matrix

Every application feature is mapped across the technical stack:

| Feature | Frontend UI / Route | API Endpoint | Controller | Service | Primary Entity / DB Table |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User Authentication** | `/login` (`LoginPage.tsx`) | `POST /api/v1/auth/login` | `AuthController` | `AuthService` | `User` / `users` |
| **Attendee Registration** | `/login` (Register modal) | `POST /api/v1/auth/register` | `AuthController` | `AuthService` | `User` / `users` |
| **Event Catalog** | `/events` (`EventsCatalogPage.tsx`) | `GET /api/v1/events` | `EventController` | `EventService` | `Event` / `events` |
| **Event Seat Layout** | `/events/:id/seats` (`SeatSelectionPage.tsx`) | `GET /api/v1/seats/event/{id}` | `SeatController` | `SeatService` | `Seat` / `seats` |
| **2PL Seat Hold Lease** | Seat click (`SeatPickerModal.tsx`) | `POST /api/v1/seats/{id}/lock` | `SeatController` | `SeatService` | `Seat` / `seats` (`status='locked'`) |
| **Seat Hold Release** | Navigation / Unselect | `POST /api/v1/seats/{id}/release` | `SeatController` | `SeatService` | `Seat` / `seats` (`status='available'`) |
| **Ticket Booking** | Modal Checkout (`SeatSelectionPage.tsx`) | `POST /api/v1/bookings` | `BookingController` | `BookingService` | `Booking` / `bookings` |
| **Attendee Wallet** | `/my-bookings` (`MyBookingsView.tsx`) | `GET /api/v1/bookings/my` | `BookingController` | `BookingService` | `Booking` / `bookings` |
| **Pass Cancellation** | `/my-bookings` (Cancel modal) | `DELETE /api/v1/bookings/{id}/cancel` | `BookingController` | `BookingService` | `Booking` / `bookings` (`cancelled`) |
| **Gatekeeper Scan** | `/verify` (`VerifyConsolePage.tsx`) | `POST /api/v1/scans/verify` | `ScanController` | `ScanService` | `ScanRecord` / `scan_records` |
| **Scan History** | `/verify/history` (`VerifyHistoryPage.tsx`) | `GET /api/v1/scans/recent` | `ScanController` | `ScanService` | `ScanRecord` / `scan_records` |
| **Admin Concurrency Lab** | `/admin/concurrency` (`AdminConcurrencyLabPage.tsx`) | `POST /api/v1/concurrency/simulate` | `ConcurrencyController` | `ConcurrencyService` | `ConcurrencySimRun`, `ConcurrencySimTx` |
| **Admin Audit Hub** | `/admin/audit` (`AdminAuditLogsPage.tsx`) | `GET /api/v1/audit/logs` | `AuditController` | `AuditService` | `AuditLog` / `audit_logs` |
| **Admin Event CRUD** | `/admin/events` (`AdminEventsPage.tsx`) | `POST,PUT,DELETE /api/v1/events` | `EventController` | `EventService` | `Event` / `events` |
| **Admin User Registry** | `/admin/users` (`AdminUsersPage.tsx`) | `GET,DELETE /api/v1/auth/users` | `AuthController` | `AuthService` | `User` / `users` |

---

## 4. Confirmed Defects & Security Vulnerabilities

Findings are prioritized using standard engineering severity tiers:
- **P0**: Critical security vulnerability or data corruption risk.
- **P1**: Important functional defect, authorization issue, or transaction correctness problem.
- **P2**: Reliability, maintainability, performance, or incomplete feature.
- **P3**: Documentation, cosmetic, or optional enhancement.

### P0 — Critical Vulnerabilities & Data Corruption

| ID | Category | Location | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Security / Auth | `AuthService.java` (lines 53-81) | **Auto-Provisioning Unknown Users on Login**: If an unregistered identifier is passed to `/login`, the service creates an account automatically and assigns roles based on the string (e.g. any string containing "ADMIN" or "FAC" becomes an `admin`!). | Reject unknown accounts on `/login` with 401/404; registration must be strictly separated. |
| **SEC-02** | Security / Auth | `AuthService.java` (lines 84-100) | **Passwordless Login Bypass**: If `password` is omitted or empty, the service unconditionally generates a valid signed JWT for the requested user, bypassing BCrypt hash comparison. | All normal logins must require valid password credentials verified with `passwordEncoder.matches()`. Demo personas must use verified credentials (`vibrance2026`). |
| **SEC-03** | Security / Auth | `AuthService.java` (lines 111-114) | **Privilege Escalation on Public Registration**: Public registration endpoint (`/api/v1/auth/register`) accepts a `role` parameter from the client, allowing callers to grant themselves `admin` or `gate_staff`. | The server must enforce `role = 'student'` for all public registrations; privileged roles must only be provisioned by admin. |
| **DATA-01** | Data Integrity | `ConcurrencyService.java` (lines 69-82, 245, 307) | **Simulation Corrupts Real Event Inventory**: The concurrency benchmark operates directly on production event seats in `seats`, executing destructive raw SQL updates (`executeUnsafeNoLockBooking`) and resetting genuine seat inventory. | Concurrency simulations must run on isolated simulation records (`sim_seats` or dedicated isolated records) and never modify production event seats or genuine bookings. |
| **DATA-02** | Concurrency / Gate | `ScanService.java` (lines 92, 140-144) | **Race Condition on Ticket Check-In**: Ticket verification executes a non-atomic read followed by update. Concurrent scans of the same QR code by two scanners can both read `status='confirmed'` before either commits, permitting duplicate physical admission. | Check-in must use an atomic conditional SQL update (`UPDATE bookings SET status='checked_in' WHERE id=? AND status='confirmed'`) or pessimistic row lock (`SELECT FOR UPDATE`). |

### P1 — Important Functional & Transaction Issues

| ID | Category | Location | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **AUTH-04** | Security / Secret | `application.yml`, `JwtTokenProvider.java` | **Insecure Static JWT Fallback Secret**: Default signing key is hardcoded in `application.yml`. If `JWT_SECRET` is not set, production could boot with a publicly known secret. | Require minimum 256-bit secret; warn/fail if production profile is active without custom `JWT_SECRET`. |
| **DATA-03** | Database Integrity | `V1__init_schema.sql` / `bookings` table | **Missing Partial Unique Constraint on Active Bookings**: While `uq_event_row_seat` exists on `seats`, `bookings` lacks a partial unique index preventing duplicate active bookings on the same `seat_id`. | Add migration creating `CREATE UNIQUE INDEX uq_active_seat_booking ON bookings (seat_id) WHERE status IN ('confirmed', 'checked_in')`. |
| **DATA-04** | Transaction Correctness | `BookingService.java` (lines 184-194) | **Non-Atomic Seat Release on Cancellation**: Cancellation updates booking status but does not acquire a pessimistic lock on the associated `Seat` row before resetting it to `available`. | Wrap cancellation in row-level lock on both `Booking` and `Seat` within the same transaction. |
| **QR-01** | Security / QR | `BookingService.java` (lines 116-117) | **Predictable Unsigned QR Payload**: QR codes contain plaintext JSON with predictable booking references, allowing ticket forging. | Use cryptographic HMAC-SHA256 signature or high-entropy ticket verification token stored in `bookings`. |
| **API-01** | API Contract | `BookingController`, `ScanController`, `AuditController` | **Unbounded Queries**: Listing endpoints return all rows without pagination, risking database exhaustion on large datasets. | Implement pagination / limit query parameters with safe defaults (e.g. 50/100 items). |

### P2 — Reliability, Performance & Maintainability

| ID | Category | Location | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **PERF-01** | Resource Management | `ConcurrencyService.java` (line 100) | **Unbounded Thread Pool Creation**: Benchmark allocates `Executors.newFixedThreadPool(concurrencyLevel)` directly from user input without upper bounds. | Restrict `concurrencyLevel` to maximum 50 concurrent threads to prevent JVM thread starvation. |
| **PERF-02** | Database Performance | Database Indexes | Missing composite index on `bookings(event_id, status)` and `bookings(user_id, status)`. | Add composite index for frequent student wallet and occupancy queries. |
| **ERR-01** | API Robustness | `GlobalExceptionHandler.java` | Incomplete handling of Spring Validation errors (`MethodArgumentNotValidException`) and constraint violations. | Return structured JSON with field-level error messages. |

### P3 — Documentation & Schema Alignment

| ID | Category | Location | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **DOC-01** | Documentation | `docs/` | Discrepancy between `ER_DIAGRAM.md` documentation and physical DDL migrations. | Align documentation, DDL, and JPA entity definitions. |
| **DOC-02** | Documentation | `docs/API_AUDIT.md` | API documentation needs full endpoint inventory with request/response schemas. | Provide complete API specification audit. |
| **DOC-03** | Documentation | `docs/FINAL_VERIFICATION_REPORT.md` | Final verification report required with test execution proof. | Produce honest, comprehensive final report. |

---

## 5. Prioritized Repair Plan

1. **Phase 2 (P0/P1)**: Fix Authentication & Authorization:
   - Disallow auto-provisioning on login; reject invalid credentials.
   - Enforce BCrypt password verification for all users, including demo personas (`vibrance2026`).
   - Restrict registration to `student` role on the server.
   - Secure JWT key handling and add comprehensive authentication/authorization unit tests.
2. **Phase 3 (P0/P1)**: Booking & Seat Inventory Integrity:
   - Add database migration `V4__booking_integrity_and_simulation_isolation.sql` with partial unique index `uq_active_seat_booking`.
   - Ensure atomic transactional seat reservation and row-level locking on cancellation.
   - Validate booking ownership before cancellation.
3. **Phase 4 (P0)**: Isolate Concurrency Simulation:
   - Create dedicated simulation table `sim_seats` or isolated sandbox event dataset so simulations never touch genuine seat inventory.
   - Bound thread pool size (max 50).
4. **Phase 5 (P0/P1)**: Atomic Ticket Check-in & QR Security:
   - Use atomic conditional database update (`UPDATE bookings SET status='checked_in' ... WHERE status='confirmed'`).
   - Secure QR payload with high-entropy cryptographic token verification.
5. **Phase 6 & 7 (P1/P2)**: Database Hardening & API Contracts:
   - Add missing indexes.
   - Create `docs/API_AUDIT.md`.
   - Update `GlobalExceptionHandler`.
6. **Phase 8 & 9 (P1/P2)**: Frontend Integration & Automated Tests:
   - Align frontend login and registration flows with strict backend auth.
   - Write comprehensive test suites (Auth, Booking, Scan, Concurrency).
7. **Phase 10 - 13**: Final Environment Verification, DBMS Documentation, and Final Report.
