-- ============================================================================
-- Vibrance 2026 Database Migration: V1__init_schema.sql
-- Purpose: Complete 3NF relational schema with strict constraints and indexes
-- ============================================================================

-- 1. Users & Personnel Profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reg_number VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'gate_staff', 'admin')),
    department VARCHAR(128) NOT NULL,
    year_of_study VARCHAR(64),
    avatar_seed VARCHAR(64) DEFAULT 'vibrance',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Festival Stage Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_code VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(128) NOT NULL,
    category VARCHAR(32) NOT NULL CHECK (category IN ('PRO_SHOW', 'EDM', 'BATTLE_OF_BANDS', 'DANCE', 'HACKATHON', 'COMEDY')),
    artist_or_host VARCHAR(128) NOT NULL,
    date_str VARCHAR(64) NOT NULL,
    time_str VARCHAR(32) NOT NULL,
    venue VARCHAR(128) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    total_seats INT NOT NULL CHECK (total_seats > 0),
    accent_color VARCHAR(32),
    tag VARCHAR(128),
    short_desc TEXT,
    ticket_bg_image TEXT,
    start_timestamp TIMESTAMPTZ NOT NULL,
    end_timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_event_time_window CHECK (end_timestamp >= start_timestamp)
);

-- 3. Seats with 2PL Lock Leases & OCC Versioning
CREATE TABLE seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    row_label VARCHAR(4) NOT NULL,
    seat_number INT NOT NULL CHECK (seat_number > 0),
    category VARCHAR(20) NOT NULL CHECK (category IN ('VIP_FRONT', 'GOLD', 'REGULAR')),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'selected', 'locked', 'booked')),
    locked_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    lock_expires_at TIMESTAMPTZ,
    version BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_event_row_seat UNIQUE (event_id, row_label, seat_number)
);

-- 4. Serialized Bookings & Passes
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref VARCHAR(64) UNIQUE NOT NULL,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
    seat_id UUID NOT NULL REFERENCES seats(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    student_name VARCHAR(128) NOT NULL,
    reg_number VARCHAR(32) NOT NULL,
    department VARCHAR(128) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('UPI', 'CAMPUS_CARD', 'NET_BANKING')),
    qr_payload TEXT NOT NULL,
    ticket_bg_image TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'checked_in')),
    booked_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checked_in_at TIMESTAMPTZ,
    checked_in_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Gate Check-in Telemetry Logs
CREATE TABLE scan_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_payload TEXT NOT NULL,
    result VARCHAR(20) NOT NULL CHECK (result IN ('VALID', 'ALREADY_USED', 'INVALID', 'EXPIRED')),
    staff_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    booking_ref VARCHAR(64),
    event_title VARCHAR(128),
    attendee_name VARCHAR(128),
    seat_label VARCHAR(32),
    message TEXT,
    original_checked_in_at TIMESTAMPTZ,
    original_checked_in_by VARCHAR(128),
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Central Immutable ACID Audit Trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(64) NOT NULL,
    event_id VARCHAR(64),
    event_title VARCHAR(128),
    seat_label VARCHAR(32),
    user_name VARCHAR(128),
    reg_number VARCHAR(32),
    status VARCHAR(32) NOT NULL,
    protocol VARCHAR(64),
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Concurrency Benchmark Simulation Runs
CREATE TABLE concurrency_sim_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id VARCHAR(64) UNIQUE NOT NULL,
    strategy VARCHAR(32) NOT NULL,
    target_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    target_event_title VARCHAR(128) NOT NULL,
    concurrency_level INT NOT NULL,
    successful_count INT NOT NULL DEFAULT 0,
    rejected_count INT NOT NULL DEFAULT 0,
    deadlock_count INT NOT NULL DEFAULT 0,
    initial_stock INT NOT NULL DEFAULT 0,
    final_stock INT NOT NULL DEFAULT 0,
    duration_ms BIGINT NOT NULL DEFAULT 0,
    overbooking_detected BOOLEAN NOT NULL DEFAULT FALSE,
    overbooked_seats INT NOT NULL DEFAULT 0,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Concurrency Simulated Transaction Thread Steps
CREATE TABLE concurrency_sim_txs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES concurrency_sim_runs(id) ON DELETE CASCADE,
    tx_id VARCHAR(32) NOT NULL,
    client_id VARCHAR(64),
    client_name VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL,
    current_step VARCHAR(128),
    latency_ms BIGINT NOT NULL DEFAULT 0,
    seat_claimed VARCHAR(64),
    message TEXT,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_users_reg_number ON users(reg_number);
CREATE INDEX idx_events_code ON events(event_code);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_start ON events(start_timestamp);
CREATE INDEX idx_seats_event_status ON seats(event_id, status);
CREATE INDEX idx_seats_lock_expires ON seats(status, lock_expires_at) WHERE status = 'locked';
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_seat_id ON bookings(seat_id);
CREATE INDEX idx_bookings_ref ON bookings(booking_ref);
CREATE INDEX idx_scan_records_staff ON scan_records(staff_user_id);
CREATE INDEX idx_scan_records_scanned_at ON scan_records(scanned_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_concurrency_sim_txs_run_id ON concurrency_sim_txs(run_id);
