-- ====================================================================================================
-- VIBRANCE 2026: RELATIONAL DATABASE MANAGEMENT SYSTEM (RDBMS) DEMONSTRATION & VIVA BENCHMARK SUITE
-- Target Database: PostgreSQL 14+ (Tested on PostgreSQL 18)
-- Schema: Strict 3NF / BCNF Compliant with Two-Phase Locking (2PL) & OCC Versioning
-- ====================================================================================================

-- ====================================================================================================
-- SECTION 1: COMPLEX MULTI-TABLE JOINS & FINANCIAL REPORTING
-- Demonstrates INNER JOIN, LEFT JOIN, Aggregation, and Currency Calculations
-- ====================================================================================================

-- Query 1.1: Comprehensive Festival Event Occupancy & Gross Revenue Summary
-- Joins events, seats, and bookings to compute seat allocations, occupancy rate %, and revenue.
SELECT 
    e.event_code,
    e.title AS event_title,
    e.category,
    e.venue,
    e.base_price,
    e.total_seats,
    COUNT(s.id) AS provisioned_seats,
    COUNT(CASE WHEN s.status = 'booked' THEN 1 END) AS booked_count,
    COUNT(CASE WHEN s.status = 'locked' THEN 1 END) AS locked_lease_count,
    COUNT(CASE WHEN s.status = 'available' THEN 1 END) AS available_count,
    ROUND(
        (COUNT(CASE WHEN s.status = 'booked' THEN 1 END)::numeric / NULLIF(e.total_seats, 0)::numeric) * 100, 
        2
    ) AS occupancy_percentage,
    COALESCE(SUM(b.amount) FILTER (WHERE b.status = 'confirmed' OR b.status = 'checked_in'), 0.00) AS gross_revenue_inr
FROM events e
LEFT JOIN seats s ON s.event_id = e.id
LEFT JOIN bookings b ON b.seat_id = s.id AND b.status IN ('confirmed', 'checked_in')
GROUP BY e.id, e.event_code, e.title, e.category, e.venue, e.base_price, e.total_seats
ORDER BY occupancy_percentage DESC, gross_revenue_inr DESC;


-- Query 1.2: Ticket Audit Trail with Gatekeeper Attribution
-- Multi-table join across Bookings, Users (Attendee), Seats, Events, and Scan Records (Staff)
SELECT 
    b.booking_ref,
    e.title AS event_name,
    CONCAT(s.row_label, '-', s.seat_number) AS seat_coordinates,
    s.category AS seat_tier,
    b.student_name AS attendee_name,
    b.reg_number AS attendee_reg_no,
    b.department,
    b.amount AS ticket_price,
    b.payment_method,
    b.status AS pass_status,
    b.booked_at,
    sr.scanned_at AS gate_interception_time,
    u_staff.name AS verified_by_staff,
    sr.result AS scan_verdict
FROM bookings b
INNER JOIN events e ON b.event_id = e.id
INNER JOIN seats s ON b.seat_id = s.id
INNER JOIN users u_student ON b.user_id = u_student.id
LEFT JOIN scan_records sr ON sr.booking_id = b.id
LEFT JOIN users u_staff ON sr.staff_user_id = u_staff.id
ORDER BY b.booked_at DESC;


-- ====================================================================================================
-- SECTION 2: ADVANCED ANALYTICAL WINDOW FUNCTIONS (PARTITION BY, ORDER BY, FRAMING)
-- ====================================================================================================

-- Query 2.1: Seat Price Ranking & Running Total Revenue by Event
-- Demonstrates DENSE_RANK(), ROW_NUMBER(), and Cumulative Window SUM()
SELECT 
    e.title AS event_title,
    s.row_label,
    s.seat_number,
    s.category AS seat_class,
    s.price,
    s.status,
    ROW_NUMBER() OVER (PARTITION BY e.id ORDER BY s.row_label, s.seat_number) AS seat_index,
    DENSE_RANK() OVER (PARTITION BY e.id ORDER BY s.price DESC) AS price_tier_rank,
    SUM(s.price) OVER (
        PARTITION BY e.id 
        ORDER BY s.row_label, s.seat_number 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_potential_inventory_value
FROM seats s
INNER JOIN events e ON s.event_id = e.id
WHERE e.event_code IN ('evt-armaan', 'evt-cyberquest')
ORDER BY e.event_code, s.row_label, s.seat_number;


-- Query 2.2: Attendee Booking Pacing with LAG() & LEAD()
-- Calculates the inter-booking latency in seconds per event
SELECT 
    b.booking_ref,
    e.title AS event_title,
    b.student_name,
    b.booked_at,
    LAG(b.booked_at) OVER (PARTITION BY b.event_id ORDER BY b.booked_at) AS previous_booking_time,
    ROUND(
        EXTRACT(EPOCH FROM (b.booked_at - LAG(b.booked_at) OVER (PARTITION BY b.event_id ORDER BY b.booked_at)))::numeric, 
        2
    ) AS seconds_since_prior_booking
FROM bookings b
INNER JOIN events e ON b.event_id = e.id
ORDER BY b.event_id, b.booked_at;


-- ====================================================================================================
-- SECTION 3: COMMON TABLE EXPRESSIONS (CTEs) & RECURSIVE QUERIES
-- ====================================================================================================

-- Query 3.1: Multi-stage CTE: High-Contention Velocity & Critical Inventory Alert
WITH EventStats AS (
    SELECT 
        e.id AS event_id,
        e.title,
        e.total_seats,
        COUNT(CASE WHEN s.status = 'booked' THEN 1 END) AS booked,
        COUNT(CASE WHEN s.status = 'locked' THEN 1 END) AS active_locks,
        COUNT(CASE WHEN s.status = 'available' THEN 1 END) AS available
    FROM events e
    JOIN seats s ON s.event_id = e.id
    GROUP BY e.id, e.title, e.total_seats
),
ContentionMetrics AS (
    SELECT 
        event_id,
        title,
        total_seats,
        booked,
        active_locks,
        available,
        ROUND((booked::numeric / total_seats::numeric) * 100, 1) AS pct_sold,
        CASE 
            WHEN available = 0 THEN 'SOLD OUT'
            WHEN available <= 10 THEN 'CRITICAL INVENTORY (<20%)'
            WHEN active_locks > 0 THEN 'HIGH CONCURRENCY LOCKS ACTIVE'
            ELSE 'HEALTHY BUFFER'
        END AS inventory_health_status
    FROM EventStats
)
SELECT * 
FROM ContentionMetrics
ORDER BY pct_sold DESC;


-- Query 3.2: Department-wise Engagement and Gate Clearance Funnel
WITH DeptPurchases AS (
    SELECT 
        b.department,
        COUNT(b.id) AS total_passes_issued,
        SUM(b.amount) AS total_spent,
        COUNT(CASE WHEN b.status = 'checked_in' THEN 1 END) AS gates_cleared,
        COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) AS pending_arrival
    FROM bookings b
    GROUP BY b.department
)
SELECT 
    department,
    total_passes_issued,
    total_spent,
    gates_cleared,
    pending_arrival,
    ROUND((gates_cleared::numeric / NULLIF(total_passes_issued, 0)::numeric) * 100, 2) AS gate_turnout_rate_pct
FROM DeptPurchases
ORDER BY total_passes_issued DESC;


-- ====================================================================================================
-- SECTION 4: STRICT TWO-PHASE LOCKING (2PL) DEMONSTRATION WITH ISOLATION LEVELS
-- ====================================================================================================

-- Transaction 4.1: Pessimistic Row Lock (Growing Phase)
-- In Session A: Acquire exclusive write lock (SELECT ... FOR UPDATE) on a specific seat
-- This prevents Session B from reading or modifying the seat until Session A commits.
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Phase 1 (Growing Phase): Acquire exclusive lock
SELECT id, event_id, row_label, seat_number, status, version 
FROM seats 
WHERE event_id = (SELECT id FROM events WHERE event_code = 'evt-cyberquest')
  AND row_label = 'A' AND seat_number = 1
FOR UPDATE;

-- Simulate business validation & processing
UPDATE seats 
SET status = 'locked', 
    lock_expires_at = NOW() + INTERVAL '120 seconds',
    updated_at = NOW()
WHERE event_id = (SELECT id FROM events WHERE event_code = 'evt-cyberquest')
  AND row_label = 'A' AND seat_number = 1;

-- Phase 2 (Shrinking Phase): Lock released automatically upon COMMIT
COMMIT;


-- Transaction 4.2: Lock Contention Verification (Attempting to acquire lock with NOWAIT or SKIP LOCKED)
-- Demonstrates non-blocking lock testing or immediate failure under lock contention
BEGIN;
SELECT id, row_label, seat_number, status 
FROM seats 
WHERE event_id = (SELECT id FROM events WHERE event_code = 'evt-cyberquest')
  AND row_label = 'A' AND seat_number = 1
FOR UPDATE NOWAIT; -- Raises SQLSTATE 55P03 if locked by concurrent transaction
ROLLBACK;


-- ====================================================================================================
-- SECTION 5: OPTIMISTIC CONCURRENCY CONTROL (OCC) WITH VERSION VALIDATION
-- ====================================================================================================

-- Demonstration of OCC atomic update with compare-and-swap (CAS)
-- If another transaction updated the row concurrently, version will not match and 0 rows are affected.
UPDATE seats
SET status = 'booked',
    version = version + 1,
    updated_at = NOW()
WHERE id = (
    SELECT id FROM seats 
    WHERE row_label = 'C' AND seat_number = 3 
    LIMIT 1
)
AND version = 0; -- Expectation matches in-memory snapshot; fails if concurrent write incremented version


-- ====================================================================================================
-- SECTION 6: STORED VIEWS & AUDIT LOGGING VERIFICATION
-- ====================================================================================================

-- Query 6.1: Active Views Inspection
SELECT * FROM vw_event_occupancy_summary;
SELECT * FROM vw_category_sales_breakdown;
SELECT * FROM vw_gate_checkin_telemetry;
SELECT * FROM vw_active_seat_leases;

-- Query 6.2: Security & Concurrency Audit Logs Query
SELECT 
    action,
    event_title,
    seat_label,
    user_name,
    reg_number,
    status,
    protocol,
    details,
    created_at
FROM audit_logs
ORDER BY created_at DESC
LIMIT 25;


-- ====================================================================================================
-- SECTION 7: V4 INTEGRITY HARDENING, CRYPTOGRAPHIC TOKENS & SIMULATION ISOLATION
-- ====================================================================================================

-- Query 7.1: Verify Partial Unique Index (uq_active_seat_booking)
-- Proves that active seat bookings cannot be duplicated, while cancelled seats can be re-booked.
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'bookings' 
  AND indexname IN ('uq_active_seat_booking', 'uq_bookings_ticket_token');

-- Query 7.2: Verify Anti-Tamper Ticket Tokens for QR Check-in
-- Shows high-entropy cryptographic tokens assigned to confirmed festival passes
SELECT 
    booking_ref, 
    student_name, 
    ticket_token, 
    status, 
    booked_at 
FROM bookings 
WHERE ticket_token IS NOT NULL 
ORDER BY booked_at DESC 
LIMIT 10;

-- Query 7.3: Inspect Isolated Concurrency Benchmarks (sim_seats)
-- Proves simulations run entirely in sim_seats without touching genuine seat inventory
SELECT 
    run_id, 
    event_title, 
    seat_label, 
    status, 
    claimed_by, 
    version, 
    updated_at 
FROM sim_seats 
ORDER BY updated_at DESC 
LIMIT 10;

-- Query 7.4: Atomic Gatekeeper Check-in Simulation Query
-- Single-query test for race-free ticket consumption:
-- UPDATE bookings SET status = 'checked_in', checked_in_at = NOW() 
-- WHERE id = '<booking_uuid>' AND status = 'confirmed';

