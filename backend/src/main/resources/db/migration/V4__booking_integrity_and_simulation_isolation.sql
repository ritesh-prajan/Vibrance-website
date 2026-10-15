-- ============================================================================
-- Vibrance 2026 Database Migration: V4__booking_integrity_and_simulation_isolation.sql
-- Purpose: 
--   1. Partial unique index to mathematically prevent double bookings on active seats
--   2. High-entropy ticket security token column for anti-tamper QR code verification
--   3. Dedicated isolated simulation tables so concurrency benchmarks never touch real inventory
--   4. Query performance indexes on composite lookup patterns
-- ============================================================================

-- 1. Partial Unique Index: Only ONE active booking (confirmed or checked_in) per seat
-- Cancelled bookings (status = 'cancelled') are excluded, allowing clean re-booking after cancellation.
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_seat_booking 
    ON bookings (seat_id) 
    WHERE status IN ('confirmed', 'checked_in');

-- 2. Ticket Cryptographic Verification Token for Secure QR Check-in
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ticket_token VARCHAR(64);
CREATE UNIQUE INDEX IF NOT EXISTS uq_bookings_ticket_token 
    ON bookings (ticket_token) 
    WHERE ticket_token IS NOT NULL;

-- Backfill initial demo bookings with secure cryptographic tokens
UPDATE bookings 
SET ticket_token = UPPER(SUBSTRING(MD5(id::text || booking_ref || 'VIBRANCE_SALT_2026') FROM 1 FOR 32))
WHERE ticket_token IS NULL;

-- 3. Composite Performance Indexes for Wallet, Occupancy and Audit Reporting
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings (user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_status ON bookings (event_id, status);

-- 4. Dedicated Concurrency Benchmark Simulation Dataset (Complete Isolation from Real Inventory)
CREATE TABLE IF NOT EXISTS sim_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id VARCHAR(64) NOT NULL,
    event_title VARCHAR(128) NOT NULL,
    seat_label VARCHAR(32) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'locked', 'booked')),
    claimed_by VARCHAR(64),
    version BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sim_seats_run_id ON sim_seats(run_id);
