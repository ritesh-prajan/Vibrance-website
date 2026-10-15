# Vibrance 2026 — API Specification & Security Audit Contract

**Base URL**: `http://localhost:8080/api/v1`  
**OpenAPI / Swagger UI**: `http://localhost:8080/swagger-ui.html`  
**OpenAPI JSON Spec**: `http://localhost:8080/v3/api-docs`  
**Standard Response Envelope**: All endpoints return `ApiResponse<T>` with structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-10-15T23:20:00.000Z"
}
```

---

## 1. Authentication & Persona Registry (`/api/v1/auth`)

| Method | Path | Auth / RBAC | Description | Request DTO | Response DTO | Status Codes |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Public | Authenticates user via email/regNo and password. | `AuthDTO.LoginRequest` | `AuthDTO.AuthResponse` | `200 OK`, `400 Bad Request`, `401 Unauthorized` |
| `POST` | `/api/v1/auth/register` | Public | Registers a new attendee account (strictly `student` role). Rejects escalation attempts. | `AuthDTO.RegisterRequest` | `AuthDTO.AuthResponse` | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `GET` | `/api/v1/auth/me` | `ROLE_STUDENT`, `ROLE_GATE_STAFF`, `ROLE_ADMIN` | Retrieves active user profile extracted from JWT claims. | None | `UserDTO` | `200 OK`, `401 Unauthorized` |
| `GET` | `/api/v1/auth/persona/{regNumber}` | Public | Retrieves seeded persona credentials and metadata for demo quick-switching. | Path variable `regNumber` | `UserDTO` | `200 OK`, `404 Not Found` |
| `GET` | `/api/v1/auth/users` | `ROLE_ADMIN` | Retrieves all registered festival users across all roles. | None | `List<UserDTO>` | `200 OK`, `401 Unauthorized`, `403 Forbidden` |
| `DELETE` | `/api/v1/auth/users/{id}` | `ROLE_ADMIN` | Deletes a user account from database. | Path variable `id` (UUID) | `ApiResponse<Void>` | `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found` |

### Auth Request Schemas:
- **`LoginRequest`**:
  ```json
  {
    "identifier": "22BCE1001 or rahul.sharma@vitstudent.ac.in",
    "password": "password123"
  }
  ```
- **`RegisterRequest`**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@vitstudent.ac.in",
    "password": "securepassword",
    "regNumber": "22BCE9999",
    "department": "Computer Science",
    "role": "student"
  }
  ```
- **`AuthResponse`**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "user": {
      "id": "c1a2b3c4-...",
      "name": "Jane Doe",
      "email": "jane.doe@vitstudent.ac.in",
      "regNumber": "22BCE9999",
      "department": "Computer Science",
      "role": "student"
    }
  }
  ```

---

## 2. Event Catalog (`/api/v1/events`)

| Method | Path | Auth / RBAC | Description | Request DTO | Response DTO | Status Codes |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/events` | Public | Returns catalog of all active events with occupancy counts. | None | `List<EventResponseDTO>` | `200 OK` |
| `GET` | `/api/v1/events/{id}` | Public | Returns detailed event metadata and optional seat grid. | Query: `includeSeats=true\|false` | `EventResponseDTO` | `200 OK`, `404 Not Found` |
| `GET` | `/api/v1/events/code/{code}` | Public | Retrieves event by human-readable short code (e.g. `CYBER-2026`). | Query: `includeSeats=true\|false` | `EventResponseDTO` | `200 OK`, `404 Not Found` |
| `POST` | `/api/v1/events` | `ROLE_ADMIN` | Creates new festival event and initializes seat matrix. | `CreateEventRequest` | `EventResponseDTO` | `201 Created`, `400 Bad Request`, `403 Forbidden` |
| `PUT` | `/api/v1/events/{id}` | `ROLE_ADMIN` | Updates event details, venue, time, or pricing. | `UpdateEventRequest` | `EventResponseDTO` | `200 OK`, `400 Bad Request`, `403 Forbidden`, `404 Not Found` |
| `DELETE` | `/api/v1/events/{id}` | `ROLE_ADMIN` | Deletes an event and associated seat records. | Path variable `id` (UUID) | `ApiResponse<Void>` | `200 OK`, `403 Forbidden`, `404 Not Found` |

---

## 3. Seat Inventory & 2PL Reservation Leases (`/api/v1/seats`)

| Method | Path | Auth / RBAC | Description | Request DTO | Response DTO | Status Codes |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/seats/event/{eventId}` | Public | Retrieves real-time seat grid with statuses (`available`, `locked`, `booked`). | Path variable `eventId` (UUID) | `List<SeatResponseDTO>` | `200 OK`, `404 Not Found` |
| `POST` | `/api/v1/seats/lock` | `ROLE_STUDENT`, `ROLE_ADMIN` | Acquires strict pessimistic lock (2PL lease) on target seat for checkout window. | `SeatLockRequest` | `SeatLockResponse` | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `409 Conflict` |
| `POST` | `/api/v1/seats/{seatId}/release` | `ROLE_STUDENT`, `ROLE_ADMIN` | Explicitly releases active lock held by the caller. | Path variable `seatId` (UUID) | `ApiResponse<Void>` | `200 OK`, `401 Unauthorized` |

### Seat Lock Request Schema:
```json
{
  "seatId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "leaseDurationSeconds": 120
}
```

---

## 4. Booking & Ticketing Engine (`/api/v1/bookings`)

| Method | Path | Auth / RBAC | Description | Request DTO | Response DTO | Status Codes |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/bookings` | `ROLE_STUDENT`, `ROLE_ADMIN` | Atomically commits seat reservation with high-entropy anti-tamper QR token. Protected by DB partial unique index `uq_active_seat_booking`. | `CreateBookingRequest` | `BookingResponseDTO` | `201 Created`, `400 Bad Request`, `401 Unauthorized`, `409 Conflict` |
| `GET` | `/api/v1/bookings/my` | `ROLE_STUDENT`, `ROLE_ADMIN` | Returns authenticated user's wallet passes. | None | `List<BookingResponseDTO>` | `200 OK`, `401 Unauthorized` |
| `GET` | `/api/v1/bookings/all` | `ROLE_ADMIN` | Returns complete festival booking ledger across all users. | None | `List<BookingResponseDTO>` | `200 OK`, `401 Unauthorized`, `403 Forbidden` |
| `GET` | `/api/v1/bookings/{bookingRef}` | `ROLE_STUDENT`, `ROLE_GATE_STAFF`, `ROLE_ADMIN` | Looks up booking details by booking reference code. | Path variable `bookingRef` | `BookingResponseDTO` | `200 OK`, `404 Not Found` |
| `POST` | `/api/v1/bookings/{bookingId}/cancel` | `ROLE_STUDENT`, `ROLE_ADMIN` | Atomically cancels pass and releases seat back to `available`. Owner or admin strictly verified. | Path variable `bookingId` (UUID) | `ApiResponse<Void>` | `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict` |

### Booking Request Schema:
```json
{
  "eventId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "seatId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "studentName": "Rahul Sharma",
  "regNumber": "22BCE1001",
  "department": "Computer Science",
  "amount": 250.00,
  "paymentMethod": "UPI"
}
```

---

## 5. Gate Verification & Interception Telemetry (`/api/v1/scans`)

| Method | Path | Auth / RBAC | Description | Request DTO | Response DTO | Status Codes |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/scans/verify` | `ROLE_GATE_STAFF`, `ROLE_ADMIN` | Atomically verifies and checks in ticket using single-statement conditional update (`UPDATE bookings SET status = 'checked_in' ... WHERE status = 'confirmed'`). Replays and counterfeit tokens are blocked. | `VerifyTicketRequest` | `ScanResponseDTO` | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden` |
| `GET` | `/api/v1/scans/recent` | `ROLE_GATE_STAFF`, `ROLE_ADMIN` | Returns live audit feed of all gate scans. | None | `List<ScanResponseDTO>` | `200 OK`, `403 Forbidden` |
| `GET` | `/api/v1/scans/my` | `ROLE_GATE_STAFF`, `ROLE_ADMIN` | Returns scan log history for the authenticated gatekeeper. | None | `List<ScanResponseDTO>` | `200 OK`, `403 Forbidden` |

### Scan Verification Responses:
- **`VALID`**: Ticket verified, entry permitted, state transitioned to `checked_in`.
- **`ALREADY_USED`**: Pass was previously checked in; replay attack intercepted.
- **`CANCELLED`**: Ticket was cancelled prior to gate arrival.
- **`INVALID`**: Unrecognized token, forged QR code, or corrupted payload.

---

## 6. DBMS Concurrency & Isolation Lab (`/api/v1/concurrency`)

| Method | Path | Auth / RBAC | Description | Request DTO | Response DTO | Status Codes |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/concurrency/simulate` | `ROLE_ADMIN` | Runs isolated multi-threaded booking benchmark against dedicated `sim_seats` table. Demonstrates `NONE` (Race condition / Overbooking), `OCC` (Optimistic Concurrency Control), or `PESSIMISTIC_2PL` (Strict Two-Phase Locking). Never mutates live inventory. | `ConcurrencySimRequest` | `ConcurrencyRunResultDTO` | `200 OK`, `400 Bad Request`, `403 Forbidden` |
| `POST` | `/api/v1/concurrency/side-by-side` | `ROLE_ADMIN` | Executes side-by-side comparative simulation across all three isolation mechanisms under identical concurrency load. | `SideBySideSimRequest` | `SideBySideResultDTO` | `200 OK`, `400 Bad Request`, `403 Forbidden` |
| `GET` | `/api/v1/concurrency/runs` | `ROLE_ADMIN` | Retrieves persistent benchmark logs and latency metrics from `concurrency_sim_runs`. | None | `List<ConcurrencySimRun>` | `200 OK`, `403 Forbidden` |

---

## 7. Analytical Reports & DBMS Views (`/api/v1/reports`)

| Method | Path | Auth / RBAC | Description | Response DTO | Status Codes |
|---|---|---|---|---|---|
| `GET` | `/api/v1/reports/summary` | `ROLE_ADMIN` | Returns high-level festival KPI metrics (revenue, total bookings, occupancy, scans). | `AdminSummaryDTO` | `200 OK`, `403 Forbidden` |
| `GET` | `/api/v1/reports/occupancy` | `ROLE_ADMIN` | Queries SQL view `vw_event_occupancy_summary` for per-event seat fills and revenue. | `List<OccupancyReportDTO>` | `200 OK`, `403 Forbidden` |
| `GET` | `/api/v1/reports/category-sales` | `ROLE_ADMIN` | Queries SQL view `vw_category_sales_breakdown` for revenue aggregation by genre. | `List<CategorySalesDTO>` | `200 OK`, `403 Forbidden` |
| `GET` | `/api/v1/reports/gate-telemetry` | `ROLE_ADMIN` | Queries SQL view `vw_gate_checkin_telemetry` for staff gate check-in throughput. | `List<GateTelemetryDTO>` | `200 OK`, `403 Forbidden` |

---

## 8. Relational Audit Trail (`/api/v1/audit`)

| Method | Path | Auth / RBAC | Description | Response DTO | Status Codes |
|---|---|---|---|---|---|
| `GET` | `/api/v1/audit/logs` | `ROLE_ADMIN` | Returns database audit log entries emitted by triggers and services. | `List<AuditLogResponseDTO>` | `200 OK`, `403 Forbidden` |
| `GET` | `/api/v1/audit/export/csv` | `ROLE_ADMIN` | Exports complete audit trail as a downloadable RFC 4180 CSV document. | Raw binary `text/csv` | `200 OK`, `403 Forbidden` |
| `DELETE` | `/api/v1/audit/logs` | `ROLE_ADMIN` | Purges audit logs (admin maintenance operation). | `ApiResponse<Void>` | `200 OK`, `403 Forbidden` |

---

## 9. Global Error Codes and Structured Payloads

When an error occurs, the API returns standard RFC-compliant HTTP status codes with an `ApiResponse` envelope:

```json
{
  "success": false,
  "message": "Optimistic Concurrency Control (OCC) conflict: resource was updated concurrently by another transaction. Please retry.",
  "data": null,
  "timestamp": "2026-10-15T23:20:00.000Z"
}
```

For validation failures (`400 Bad Request`), `data` contains field-specific violations:
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Invalid VIT student email format. Must end with @vitstudent.ac.in",
    "regNumber": "Invalid registration number format. Expected format: 22BCE1001"
  },
  "timestamp": "2026-10-15T23:20:00.000Z"
}
```

### Handled Status Codes:
- `400 Bad Request`: Validation failure (`MethodArgumentNotValidException`), bad parameter (`MethodArgumentTypeMismatchException`), or malformed JSON payload (`HttpMessageNotReadableException`).
- `401 Unauthorized`: Missing, expired, or invalid JWT token (`AuthenticationEntryPoint`, `AuthenticationException`).
- `403 Forbidden`: Authenticated user lacks required role (`AccessDeniedHandler`, `AccessDeniedException`).
- `404 Not Found`: Entity not found (`ResourceNotFoundException`).
- `409 Conflict`: Business conflict, lock collision (`CannotAcquireLockException`), optimistic concurrency mismatch (`OptimisticLockingFailureException`), or database constraint violation (`DataIntegrityViolationException`).
- `500 Internal Server Error`: Unhandled server exception.
