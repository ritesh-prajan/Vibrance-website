# Vibrance 2026 — Final Project Verification & System Hardening Report

**Project**: Vibrance 2026 — College Festival Event Ticketing & DBMS Concurrency Lab  
**Repository**: [ritesh-prajan/Vibrance-website](https://github.com/ritesh-prajan/Vibrance-website.git)  
**Verification Date**: 2026-10-15  
**Environment**: Windows 11, IntelliJ IDEA, OpenJDK 17.0.19 LTS, Node.js v24.14.0, PostgreSQL 18.4, Spring Boot 3.3.5, Vite 6.4.3  

---

## 1. Executive Summary

This project underwent a comprehensive, non-destructive audit, database hardening, concurrency simulation isolation, and security repair. All identified vulnerabilities (SEC-01 through SEC-06, DATA-01 through DATA-03) have been eliminated at their root causes.

The application is fully functional, end-to-end integrated between the React frontend and Spring Boot / PostgreSQL backend, and verified by live automated test suites with **45 backend automated tests passing (100% pass rate)** including real PostgreSQL 18 integration tests, as well as a clean production build of the frontend with zero TypeScript errors.

---

## 2. Phase-by-Phase Completion Status

| Phase | Description | Status | Key Deliverables & Evidence |
|---|---|---|---|
| **Phase 1** | Baseline Audit & Project Safety | **COMPLETED** | Created [`docs/PROJECT_AUDIT.md`](docs/PROJECT_AUDIT.md). Verified OpenJDK 17, Maven 3.9, PostgreSQL 18, Node.js. |
| **Phase 2** | Authentication & Security Hardening | **COMPLETED** | Eliminated auto-provisioning backdoor, eliminated passwordless login, removed shared-password synchronization workaround, restricted registration strictly to `student` role, validated 256-bit HMAC JWT keys. Unit and slice tests passing. |
| **Phase 3** | Data Modeling & Flyway Migrations V4–V6 | **COMPLETED** | Added partial unique index `uq_active_seat_booking`, `ticket_token`, and `sim_seats` in [`V4`](backend/src/main/resources/db/migration/V4__booking_integrity_and_simulation_isolation.sql). Standardized demo credentials in [`V5`](backend/src/main/resources/db/migration/V5__seed_consistent_demo_passwords.sql). Fixed audit trigger and widened seat label column in [`V6`](backend/src/main/resources/db/migration/V6__fix_audit_trigger_and_widen_seat_label.sql). Migrated live PostgreSQL `vibrance_db` cleanly. |
| **Phase 4** | Booking & Concurrency Simulation Decoupling | **COMPLETED** | Concurrency benchmark refactored to use dedicated `sim_seats` table. Genuine seat inventory (`seats` table) is completely isolated and pristine. Pessimistic locking on cancellation with ownership enforcement. |
| **Phase 5** | Atomic Gate Check-in Engine | **COMPLETED** | Gate check-in upgraded to single-query atomic conditional update (`UPDATE bookings SET status = 'checked_in' ... WHERE status = 'confirmed'`). Replay attacks and counterfeit tokens mathematically intercepted. |
| **Phase 6** | Global Error Handling & Resilience | **COMPLETED** | Enhanced [`GlobalExceptionHandler.java`](backend/src/main/java/com/vibrance/exception/GlobalExceptionHandler.java) with specialized handlers for `DataIntegrityViolationException`, `HttpMessageNotReadableException`, `MethodArgumentTypeMismatchException`, and validation errors. |
| **Phase 7** | API Specification & Contract Audit | **COMPLETED** | Authored [`docs/API_AUDIT.md`](docs/API_AUDIT.md) detailing all 24 REST endpoints, request/response DTOs, HTTP statuses, and Swagger documentation. Restricted persona endpoint to `ROLE_ADMIN`. |
| **Phase 8** | Frontend Integration & UI Hardening | **COMPLETED** | Hardened [`CheckoutModal.tsx`](src/components/CheckoutModal.tsx) with error alerts and transactional exception guards. Verified 0 TypeScript errors and production build via `npm run build`. |
| **Phase 9** | Concurrency & PostgreSQL Integration Testing | **COMPLETED** | Added [`ConcurrencyServiceIntegrationTest.java`](backend/src/test/java/com/vibrance/service/ConcurrencyServiceIntegrationTest.java) and [`PostgreSqlLiveIntegrationTest.java`](backend/src/test/java/com/vibrance/integration/PostgreSqlLiveIntegrationTest.java) validating 2PL, OCC, partial unique indexes, and atomic check-ins against live PostgreSQL 18. |
| **Phase 10** | Comprehensive Test Suite Execution | **COMPLETED** | Executed `mvn test`. 45 tests executed, 0 failures, 0 errors, 0 skipped across all test classes. |
| **Phase 11** | DBMS Demonstration & Viva Script | **COMPLETED** | Updated [`docs/DBMS_DEMONSTRATION_QUERIES.sql`](docs/DBMS_DEMONSTRATION_QUERIES.sql) with 7 comprehensive query sections, window functions, and transaction rollbacks. Tested against PostgreSQL 18. |
| **Phase 12** | Relational Schema & ER Specification | **COMPLETED** | Updated [`docs/ER_DIAGRAM.md`](docs/ER_DIAGRAM.md) documenting `sim_seats`, `ticket_token`, candidate keys, and 3NF/BCNF normalization analysis. |
| **Phase 13** | Verification Report & Git Push | **COMPLETED** | Completed code review remediation, updated documentation, and committed to remote repository. |

---

## 3. Vulnerability Remediation Ledger

| Vulnerability ID | Severity | Problem Statement | Root Cause | Fix Applied | Verification Evidence |
|---|---|---|---|---|---|
| **SEC-01** | **CRITICAL** | Unknown registration number auto-provisioned student account on login without registration. | `AuthService.login()` fallback creating user if not found. | Removed auto-provisioning fallback; strictly throws `UnauthorizedException("Invalid credentials")`. | `AuthServiceTest.testLogin_FailsForUnknownAccount` (PASSED) |
| **SEC-02** | **CRITICAL** | Password check was completely bypassed if request password was null/blank. | `AuthService.login()` only checked password if non-null. | Mandatory `passwordEncoder.matches()` enforced on all logins. | `AuthServiceTest.testLogin_PasswordCheckEnforced` (PASSED) |
| **SEC-03** | **HIGH** | Public registration allowed arbitrary privilege escalation to `admin` or `gate_staff`. | Registration request `role` field was unvalidated. | Registration strictly hardcoded to `student`; any attempt to pass `admin`/`gate_staff` returns `BadRequestException`. | `AuthServiceTest.testRegister_PreventsPrivilegeEscalation` (PASSED) |
| **SEC-04** | **CRITICAL** | Shared-password login workaround allowed password overwrite for any user providing demo passwords. | `AuthService.login()` checked if password was `vibrance2026`/`password123` and rewrote user password in DB on failure. | Completely removed password-synchronization fallback. Seeded uniform BCrypt hashes via migration `V5`. | `AuthServiceTest.testLoginWithIncorrectPassword` confirms user record is never saved (PASSED) |
| **SEC-05** | **HIGH** | Hardcoded fallback secrets and predictable database defaults in configuration. | `application.yml` had fallback JWT secret and default passwords. | Created `application-prod.yml` requiring explicit environment variables (`DB_URL`, `DB_PASSWORD`, `JWT_SECRET`); `JwtTokenProvider` validates secret length and rejects default secrets in production profile. | `JwtTokenProvider` startup validation test (PASSED) |
| **SEC-06** | **HIGH** | Public persona endpoint `/api/v1/auth/persona/{regNumber}` allowed unauthenticated enumeration of user metadata. | Endpoint was permitted to anonymous users in `SecurityConfig.java`. | Protected endpoint with `.hasRole("ADMIN")`. Anonymous users receive 401; non-admin users receive 403. | `SecurityAccessTest.testAnonymousAccessToPersonaReturns401` & `testStudentAccessToPersonaReturns403` (PASSED) |
| **DATA-01** | **CRITICAL** | Concurrency simulation mutated real seat inventory, corrupting live event seats during benchmarks. | `ConcurrencyService` called `seatRepository.executeUnsafeNoLockBooking` directly on the `seats` table. | Introduced dedicated `sim_seats` table and entity. Simulations contend exclusively on ephemeral test records. | `ConcurrencyServiceIntegrationTest.testDataIsolation_NeverTouchesGenuineSeats` (PASSED) |
| **DATA-02** | **CRITICAL** | Risk of double-booking under race conditions if two threads committed simultaneously. | Double-booking prevention relied solely on application-level locks without DB-level constraint. | Added partial unique index `uq_active_seat_booking ON bookings (seat_id) WHERE status IN ('confirmed', 'checked_in')`. | Verified active on PostgreSQL 18. `GlobalExceptionHandler` converts constraint collision to clean 409 Conflict. |
| **DATA-03** | **MEDIUM** | Booking audit trigger failed in PostgreSQL due to column length truncation (36-char UUID into `VARCHAR(32)`). | Database trigger inserted raw `seat_id` instead of human-readable coordinates, overflowing `audit_logs.seat_label`. | Migration `V6` widened `seat_label` to `VARCHAR(64)` and updated trigger `trg_fn_audit_booking_insert()` to join `seats` and format coordinate `row_label-seat_number`. | `PostgreSqlLiveIntegrationTest` all 5 tests passed against real PostgreSQL 18 (PASSED) |

---

## 4. Test Execution & Build Verification

### 4.1 Backend Test Results (`mvn test`)
- **Total Tests Run**: 45
- **Passed**: 45 (100%)
- **Failed**: 0
- **Errors**: 0
- **Skipped**: 0
- **Total Execution Time**: 23.447s
- **Breakdown by Suite**:
  - `SecurityAccessTest`: **10 / 10 passed** (Public endpoints, anonymous 401s, student 403s on admin endpoints and persona endpoint, bearer token parsing)
  - `AuthServiceTest`: **9 / 9 passed** (Login credential validation, password enforcement, email/regNumber format, duplicate prevention, privilege escalation protection, no password synchronization mutation)
  - `BookingServiceTest`: **7 / 7 passed** (ACID booking creation, guest booking rejection, cancellation authorization, checked-in ticket protection, seat release)
  - `ConcurrencyServiceIntegrationTest`: **4 / 4 passed** (Strict 2PL single-winner isolation, OCC version conflict aborts, side-by-side benchmark, simulation data isolation)
  - `ScanServiceTest`: **4 / 4 passed** (Valid check-in, replay duplicate intercept, cancelled ticket rejection, atomic concurrent check-in collision protection)
  - `SeatServiceTest`: **5 / 5 passed** (Strict 2PL pessimistic lock acquisition, booking conflict rejection, expired lease release)
  - `VibranceApplicationTests`: **1 / 1 passed** (Spring Boot context bootstrap)
  - `PostgreSqlLiveIntegrationTest`: **5 / 5 passed** (PostgreSQL 18 live integration testing for Flyway migrations V1–V6, partial unique index `uq_active_seat_booking` collision enforcement, cancelled seat re-booking allowance, atomic check-in single-statement update, and pessimistic row locking)

### 4.2 Frontend Verification (`npm run build`)
- **TypeScript Typecheck & Vite Production Build**: Built cleanly in 7.89s with 0 errors:
  - `dist/index.html`: 1.19 kB
  - `dist/assets/index-B4B9VMl0.css`: 93.77 kB
  - `dist/assets/index-BKobrKBq.js`: 1,022.63 kB

---

## 5. Architectural Highlights for DBMS Project Evaluation

1. **Strict Relational Normalization (3NF & BCNF)**:
   - Primary keys use cryptographic UUIDs (`gen_random_uuid()`).
   - Composite alternate candidate keys eliminate physical seat duplication (`seats(event_id, row_label, seat_number)`).
   - Point-in-time financial audit integrity preserved in `bookings` and `scan_records`.
2. **Two-Phase Locking (2PL)**:
   - Growing phase acquires `SELECT ... FOR UPDATE` row locks via `findByIdWithPessimisticLock`.
   - Shrinking phase atomically releases locks upon transaction commit or rollback.
3. **Optimistic Concurrency Control (OCC)**:
   - Enforces JPA `@Version` column checking to implement Compare-And-Swap (CAS).
   - Thread collisions cleanly trigger `OptimisticLockingFailureException` and HTTP 409 Conflict.
4. **Partial Unique Indexing**:
   - `CREATE UNIQUE INDEX uq_active_seat_booking ON bookings (seat_id) WHERE status IN ('confirmed', 'checked_in');`
   - Mathematically prohibits double bookings at the database engine level, while allowing clean re-booking of cancelled seats.
5. **Atomic Conditional Gate Check-in**:
   - Uses single SQL statement: `UPDATE bookings SET status = 'checked_in', checked_in_at = :now WHERE id = :id AND status = 'confirmed'`
   - Eliminates read-then-write race conditions when multiple scanners read identical passes simultaneously.
6. **Isolated Concurrency Benchmark Sandbox**:
   - Concurrency lab tests execute exclusively on `sim_seats` and log to `concurrency_sim_runs` and `concurrency_sim_txs`. Genuine inventory in `seats` remains completely untouched.
7. **Flyway Database Migration Versioning**:
   - Schema and initial state version-controlled through 6 discrete migration scripts (`V1` to `V6`).
   - Automated migration execution verified on PostgreSQL 18.

---

## 6. How to Run the Demonstration

### 6.1 Database (PostgreSQL 18)
The database is pre-configured and fully migrated up to Flyway version 6:
- Database: `vibrance_db`
- Host: `localhost:5432`
- User: `postgres`
- Password: `1234` (or configured via `${DB_PASSWORD}`)

### 6.2 Spring Boot Backend
```powershell
$env:JAVA_HOME = "C:\Users\rites\.jdks\ms-17.0.19"
& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.3\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run -f backend/pom.xml
```
- Server URL: `http://localhost:8080`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON Spec: `http://localhost:8080/v3/api-docs`

### 6.3 Vite / React Frontend
```powershell
npm run dev
```
- Web Application URL: `http://localhost:5173`

### 6.4 Pre-configured Demo Personas
All demo accounts have been uniformly seeded in Flyway migration V5 with standard BCrypt password `vibrance2026`:
- **Student Attendee**: `RA2111003010142` / `vibrance2026` (Rahul Sharma — CSE)
- **Gatekeeper Staff**: `STF-GATE-04` / `vibrance2026` (Officer Rajesh Menon — Main Gate)
- **Festival Administrator**: `ADMIN-FACULTY-01` / `vibrance2026` (Dr. Vikramaditya Rao — Lead Convener)
