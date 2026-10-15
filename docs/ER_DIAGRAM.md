# Vibrance 2026 – Entity-Relationship (ER) Diagram & Relational Schema Specification

## 1. Overview
The Vibrance 2026 Festival Ticketing and Concurrency Simulation Engine is backed by an enterprise-grade PostgreSQL relational database schema designed to demonstrate rigorous database management principles, strict ACID transaction guarantees, Two-Phase Locking (2PL), Optimistic Concurrency Control (OCC), and relational integrity under high concurrency.

---

## 2. Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "places"
    USERS ||--o{ SEATS : "locks (temporary lease)"
    USERS ||--o{ SCAN_RECORDS : "scans (gate staff)"
    EVENTS ||--|{ SEATS : "provisions"
    EVENTS ||--o{ BOOKINGS : "hosts"
    EVENTS ||--o{ CONCURRENCY_SIM_RUNS : "benchmarks"
    SEATS ||--o{ BOOKINGS : "reserved_by"
    BOOKINGS ||--o{ SCAN_RECORDS : "validates"
    CONCURRENCY_SIM_RUNS ||--|{ CONCURRENCY_SIM_TXS : "executes"

    USERS {
        uuid id PK "UUID Primary Key"
        varchar reg_number UK "Registration / Staff ID (Indexed)"
        varchar name "Full Name"
        varchar email UK "Institutional Email"
        varchar password_hash "BCrypt Hash"
        varchar role "student | gate_staff | admin"
        varchar department "Academic School / Directorate"
        varchar year_of_study "Academic Year"
        varchar avatar_seed "Avatar Deterministic Seed"
        timestamptz created_at "Creation Timestamp"
        timestamptz updated_at "Update Timestamp"
    }

    EVENTS {
        uuid id PK "UUID Primary Key"
        varchar event_code UK "Unique slug / shortcode (Indexed)"
        varchar title "Official Event Title"
        varchar category "PRO_SHOW | EDM | COMEDY | DANCE | HACKATHON | BATTLE_OF_BANDS"
        varchar artist_or_host "Headline Artist / Host Club"
        varchar date_str "Human readable date label"
        varchar time_str "Human readable time label"
        varchar venue "Auditorium / Amphitheatre / Stage"
        numeric base_price "Ticket Base Price (INR)"
        int total_seats "Provisioned Seat Capacity (Default: 48)"
        varchar accent_color "Hex color code for UI"
        varchar tag "Event highlight / subtitle"
        text short_desc "Brief summary of the event"
        varchar ticket_bg_image "URL or asset path for pass background"
        timestamptz start_timestamp "Scheduled Start Time"
        timestamptz end_timestamp "Scheduled Concluding Time"
        timestamptz created_at "Record Creation Timestamp"
        timestamptz updated_at "Record Update Timestamp"
    }

    SEATS {
        uuid id PK "UUID Primary Key"
        uuid event_id FK "References events(id) ON DELETE CASCADE"
        varchar row_label "Row Identifier (A, B, C, D, E, F)"
        int seat_number "Sequential Seat Number (1..8)"
        varchar category "VIP_FRONT | GOLD | REGULAR"
        numeric price "Dynamic / Tiered Seat Price (INR)"
        varchar status "available | locked | booked"
        uuid locked_by FK "References users(id) ON DELETE SET NULL"
        timestamptz lock_expires_at "Lease Expiry Timestamp (TTL 120-300s)"
        int version "Optimistic Concurrency Control (OCC) Version"
        timestamptz created_at "Record Creation Timestamp"
        timestamptz updated_at "Record Update Timestamp"
    }

    BOOKINGS {
        uuid id PK "UUID Primary Key"
        varchar booking_ref UK "Human-friendly Reference (e.g. VIB26-EDM-104928)"
        uuid event_id FK "References events(id) ON DELETE RESTRICT"
        uuid seat_id FK "References seats(id) ON DELETE RESTRICT"
        uuid user_id FK "References users(id) ON DELETE RESTRICT"
        varchar student_name "Attendee Full Name"
        varchar reg_number "Student Registration Number"
        varchar department "Student Department"
        numeric amount "Total Amount Paid (INR)"
        varchar payment_method "UPI | CAMPUS_CARD | NET_BANKING"
        text qr_payload "Cryptographically signed QR payload"
        varchar status "confirmed | cancelled | checked_in"
        timestamptz booked_at "Timestamp of Successful Commit"
        timestamptz checked_in_at "Gate Admission Timestamp (nullable)"
        uuid checked_in_by FK "References users(id) ON DELETE SET NULL"
        timestamptz created_at "Record Creation Timestamp"
    }

    SCAN_RECORDS {
        uuid id PK "UUID Primary Key"
        text query_payload "Scanned raw QR string or reference"
        varchar result "VALID | ALREADY_USED | INVALID | EXPIRED"
        uuid staff_user_id FK "References users(id) ON DELETE SET NULL"
        uuid booking_id FK "References bookings(id) ON DELETE SET NULL"
        varchar booking_ref "De-normalized Booking Reference"
        varchar event_title "De-normalized Event Title"
        varchar attendee_name "Attendee Name"
        varchar seat_label "Seat Coordinates"
        text message "Diagnostic gate validation message"
        timestamptz scanned_at "Interception Timestamp"
        timestamptz original_checked_in_at "Timestamp of prior entry if duplicate"
        varchar original_checked_in_by "Staff who admitted prior entry"
    }

    AUDIT_LOGS {
        uuid id PK "UUID Primary Key"
        varchar action "BOOKING_CONFIRMED | SEAT_LOCKED | TICKET_CHECKIN | etc."
        varchar event_id "Associated Event UUID or String"
        varchar event_title "Associated Event Name"
        varchar seat_label "Seat Identifier"
        varchar user_name "User / Client Name"
        varchar reg_number "Registration Number"
        varchar status "SUCCESS | CONFLICT | EXPIRED | REJECTED"
        varchar protocol "2PL_STRICT | OCC_OPTIMISTIC | UNSAFE_NO_LOCK"
        text details "Detailed execution metadata"
        timestamptz created_at "Logged At (Requires New Transaction)"
    }

    CONCURRENCY_SIM_RUNS {
        uuid id PK "UUID Primary Key"
        varchar run_id UK "Human Readable Run Code (e.g. RUN-1729000-A)"
        varchar strategy "NO_LOCKING | TWO_PHASE_LOCKING | OPTIMISTIC_OCC"
        uuid target_event_id FK "References events(id) ON DELETE SET NULL"
        varchar target_event_title "Snapshot of Event Title"
        int concurrency_level "Total Concurrent Threads (e.g. 25, 50, 100)"
        int successful_count "Commits Successful"
        int rejected_count "Rollbacks / Contention Collisions"
        int deadlock_count "Pessimistic Deadlocks / Timeouts"
        int initial_stock "Seats Available at Start"
        int final_stock "Seats Remaining at Finish"
        int duration_ms "Wall-clock Benchmark Duration"
        boolean overbooking_detected "True if final_stock < 0 or duplicate seats"
        int overbooked_seats "Quantity of Overbooked Passes"
        timestamptz started_at "Simulation Start Timestamp"
        timestamptz completed_at "Simulation Completion Timestamp"
    }

    CONCURRENCY_SIM_TXS {
        uuid id PK "UUID Primary Key"
        uuid run_id FK "References concurrency_sim_runs(id) ON DELETE CASCADE"
        varchar tx_id "Transaction Thread ID"
        varchar client_id "Simulated Virtual Client ID"
        varchar client_name "Simulated Student Name"
        varchar status "COMMITTED | ROLLED_BACK | DEADLOCK | REJECTED"
        varchar current_step "Terminal State Description"
        int latency_ms "Transaction Execution Latency"
        varchar seat_claimed "Seat Coordinates Claimed"
        text message "Diagnostic Reason / SQL State"
        timestamptz timestamp "Execution Timestamp"
    }
```

---

## 3. Relational Schema Normalization Analysis

### First Normal Form (1NF)
- **Atomic Values**: Every table attribute contains indivisible, scalar values. Seat coordinates are decomposed into `row_label` (VARCHAR) and `seat_number` (INT).
- **No Repeating Groups**: Relational lists (such as seats per event or bookings per user) are represented through foreign keys in separate tables rather than comma-separated arrays or embedded collections.
- **Primary Keys**: Every relation enforces an unambiguous Surrogate Primary Key (`UUID DEFAULT gen_random_uuid()`).

### Second Normal Form (2NF)
- Meets all 1NF requirements.
- **No Partial Dependencies**: In composite candidate keys (e.g., `(event_id, row_label, seat_number)` on `seats`), all non-key attributes (`price`, `category`, `status`, `version`) are fully functionally dependent on the primary key `id`, which uniquely identifies the tuple.

### Third Normal Form (3NF)
- Meets all 2NF requirements.
- **No Transitive Dependencies**: Non-key attributes depend directly and only on the primary key:
  - In `bookings`, `seat_id` references `seats(id)`, and `event_id` references `events(id)`. While `student_name` and `department` are captured at booking time, this intentional point-in-time preservation represents a historical immutable financial audit record rather than a transitive dependency violation.
  - In `scan_records`, event and attendee information are de-normalized specifically to preserve immutable gate audit history even if the underlying booking is subsequently cancelled or mutated.

### Boyce-Codd Normal Form (BCNF)
- Meets all 3NF requirements.
- For every functional dependency $X \rightarrow Y$, $X$ is a superkey:
  - `users`: `id` $\rightarrow$ `{reg_number, name, email, role, department}`
  - `events`: `id` $\rightarrow$ `{event_code, title, category, venue, base_price}`
  - `seats`: `id` $\rightarrow$ `{event_id, row_label, seat_number, status, version}`
  - `bookings`: `id` $\rightarrow$ `{booking_ref, event_id, seat_id, user_id, amount, status}`

---

## 4. Integrity Constraints & Referential Actions

1. **Alternate Candidate Keys (UNIQUE)**:
   - `users.reg_number` (UNIQUE NOT NULL)
   - `users.email` (UNIQUE NOT NULL)
   - `events.event_code` (UNIQUE NOT NULL)
   - `seats(event_id, row_label, seat_number)` (Composite UNIQUE constraint — eliminates physical seat duplication within an auditorium)
   - `bookings.booking_ref` (UNIQUE NOT NULL)

2. **Check Constraints (CHECK)**:
   - `users.role IN ('student', 'gate_staff', 'admin')`
   - `seats.status IN ('available', 'locked', 'booked')`
   - `seats.category IN ('VIP_FRONT', 'GOLD', 'REGULAR')`
   - `seats.seat_number BETWEEN 1 AND 8`
   - `seats.price >= 0`
   - `bookings.status IN ('confirmed', 'cancelled', 'checked_in')`
   - `bookings.payment_method IN ('UPI', 'CAMPUS_CARD', 'NET_BANKING')`
   - `scan_records.result IN ('VALID', 'ALREADY_USED', 'INVALID', 'EXPIRED')`
   - `concurrency_sim_runs.strategy IN ('NO_LOCKING', 'TWO_PHASE_LOCKING', 'OPTIMISTIC_OCC')`

3. **Referential Integrity & Delete Cascades**:
   - `seats` $\rightarrow$ `events`: `ON DELETE CASCADE` (Deleting an event cleans up provisioned inventory)
   - `bookings` $\rightarrow$ `seats`: `ON DELETE RESTRICT` (A reserved seat cannot be dropped while an active financial booking exists)
   - `bookings` $\rightarrow$ `events`: `ON DELETE RESTRICT` (Events with booked passes cannot be accidentally purged)
   - `concurrency_sim_txs` $\rightarrow$ `concurrency_sim_runs`: `ON DELETE CASCADE` (Simulation telemetry is bound to its benchmark run)
