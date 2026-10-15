-- ============================================================================
-- Vibrance 2026 Database Migration: V3__views_and_functions.sql
-- Purpose: Analytical Views, Stored Functions, Procedures, and Automated Triggers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ANALYTICAL VIEWS FOR REPORTING & EXECUTIVE DASHBOARDS
-- ----------------------------------------------------------------------------

-- View 1: Event Occupancy & Inventory Metrics
CREATE OR REPLACE VIEW vw_event_occupancy_summary AS
SELECT 
    e.id AS event_id,
    e.event_code,
    e.title,
    e.category,
    e.base_price,
    e.venue,
    e.total_seats,
    COUNT(CASE WHEN s.status = 'booked' THEN 1 END) AS booked_count,
    COUNT(CASE WHEN s.status = 'locked' AND s.lock_expires_at > CURRENT_TIMESTAMP THEN 1 END) AS locked_count,
    COUNT(CASE WHEN s.status = 'available' OR (s.status = 'locked' AND s.lock_expires_at <= CURRENT_TIMESTAMP) THEN 1 END) AS available_count,
    ROUND(
        (COUNT(CASE WHEN s.status = 'booked' THEN 1 END)::numeric / NULLIF(e.total_seats, 0)) * 100, 
        1
    ) AS occupancy_percentage,
    COALESCE(SUM(CASE WHEN b.status IN ('confirmed', 'checked_in') THEN b.amount ELSE 0 END), 0) AS gross_revenue
FROM events e
LEFT JOIN seats s ON s.event_id = e.id
LEFT JOIN bookings b ON b.seat_id = s.id AND b.status IN ('confirmed', 'checked_in')
GROUP BY e.id, e.event_code, e.title, e.category, e.base_price, e.venue, e.total_seats;

-- View 2: Category Ticketing Volume & Financial Breakdown
CREATE OR REPLACE VIEW vw_category_sales_breakdown AS
SELECT 
    e.category,
    COUNT(DISTINCT e.id) AS total_events,
    COUNT(b.id) AS total_tickets_sold,
    COALESCE(SUM(b.amount), 0) AS total_revenue,
    ROUND(AVG(b.amount), 2) AS average_ticket_price,
    MAX(b.amount) AS peak_ticket_price
FROM events e
LEFT JOIN bookings b ON b.event_id = e.id AND b.status IN ('confirmed', 'checked_in')
GROUP BY e.category;

-- View 3: Gate Staff Verification Throughput & Interception Telemetry
CREATE OR REPLACE VIEW vw_gate_checkin_telemetry AS
SELECT 
    u.id AS staff_id,
    u.name AS staff_name,
    u.reg_number AS staff_badge,
    u.department AS gate_post,
    COUNT(sr.id) AS total_scans_conducted,
    COUNT(CASE WHEN sr.result = 'VALID' THEN 1 END) AS valid_admissions,
    COUNT(CASE WHEN sr.result = 'ALREADY_USED' THEN 1 END) AS duplicate_intercepts,
    COUNT(CASE WHEN sr.result = 'INVALID' THEN 1 END) AS invalid_rejections,
    COUNT(CASE WHEN sr.result = 'EXPIRED' THEN 1 END) AS expired_rejections,
    MAX(sr.scanned_at) AS last_scan_timestamp
FROM users u
LEFT JOIN scan_records sr ON sr.staff_user_id = u.id
WHERE u.role = 'gate_staff'
GROUP BY u.id, u.name, u.reg_number, u.department;

-- View 4: Live Active Seat Hold Leases
CREATE OR REPLACE VIEW vw_active_seat_leases AS
SELECT 
    s.id AS seat_id,
    s.event_id,
    e.title AS event_title,
    s.row_label,
    s.seat_number,
    s.category AS seat_category,
    s.price,
    u.id AS user_id,
    u.name AS user_name,
    u.reg_number AS user_reg_number,
    s.lock_expires_at,
    ROUND(EXTRACT(EPOCH FROM (s.lock_expires_at - CURRENT_TIMESTAMP))) AS seconds_remaining
FROM seats s
JOIN events e ON e.id = s.event_id
LEFT JOIN users u ON u.id = s.locked_by_user_id
WHERE s.status = 'locked' AND s.lock_expires_at > CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- 2. STORED FUNCTIONS & PROCEDURES
-- ----------------------------------------------------------------------------

-- Function: Release Expired Seat Locks (TTL lease protocol)
CREATE OR REPLACE FUNCTION fn_cleanup_expired_seat_locks()
RETURNS INTEGER AS $$
DECLARE
    released_count INTEGER;
BEGIN
    UPDATE seats
    SET status = 'available',
        locked_by_user_id = NULL,
        lock_expires_at = NULL,
        updated_at = CURRENT_TIMESTAMP
    WHERE status = 'locked'
      AND lock_expires_at < CURRENT_TIMESTAMP;
      
    GET DIAGNOSTICS released_count = ROW_COUNT;
    
    IF released_count > 0 THEN
        INSERT INTO audit_logs (action, status, protocol, details)
        VALUES ('LOCK_EXPIRED', 'RELEASED', 'TTL_MONITOR', 
                format('Auto-released %s expired seat lease(s).', released_count));
    END IF;
    
    RETURN released_count;
END;
$$ LANGUAGE plpgsql;

-- Function: Atomic Gate Check-in & Duplicate Interception
CREATE OR REPLACE FUNCTION fn_verify_and_checkin_ticket(
    p_query_payload TEXT,
    p_staff_user_id UUID
)
RETURNS TABLE (
    scan_id UUID,
    result VARCHAR(20),
    booking_ref VARCHAR(64),
    event_title VARCHAR(128),
    attendee_name VARCHAR(128),
    seat_label VARCHAR(32),
    message TEXT,
    scanned_at TIMESTAMPTZ
) AS $$
DECLARE
    v_booking RECORD;
    v_staff_name VARCHAR(128);
    v_result VARCHAR(20);
    v_message TEXT;
    v_scan_id UUID;
    v_now TIMESTAMPTZ := CURRENT_TIMESTAMP;
BEGIN
    SELECT name INTO v_staff_name FROM users WHERE id = p_staff_user_id;

    -- Look up booking by matching qr_payload or booking_ref
    SELECT 
        b.id, b.booking_ref, b.event_id, b.seat_id, b.student_name, b.reg_number,
        b.status, b.checked_in_at, b.checked_in_by_user_id,
        e.title AS event_title, e.end_timestamp,
        concat(s.row_label, '-', s.seat_number) AS seat_label,
        cu.name AS checked_in_by_name
    INTO v_booking
    FROM bookings b
    JOIN events e ON e.id = b.event_id
    JOIN seats s ON s.id = b.seat_id
    LEFT JOIN users cu ON cu.id = b.checked_in_by_user_id
    WHERE b.qr_payload = p_query_payload 
       OR b.booking_ref = p_query_payload
    LIMIT 1;

    IF NOT FOUND THEN
        v_result := 'INVALID';
        v_message := 'Pass barcode unrecognized. Counterfeit or invalid ticket payload.';
        
        INSERT INTO scan_records (query_payload, result, staff_user_id, message, scanned_at)
        VALUES (p_query_payload, v_result, p_staff_user_id, v_message, v_now)
        RETURNING id INTO v_scan_id;

        INSERT INTO audit_logs (action, status, protocol, details)
        VALUES ('TICKET_VERIFY_INVALID', 'INVALID', 'GATE_SECURITY', 
                format('Counterfeit ticket query intercepted by staff %s: %s', v_staff_name, p_query_payload));

        RETURN QUERY SELECT v_scan_id, v_result, NULL::VARCHAR, NULL::VARCHAR, NULL::VARCHAR, NULL::VARCHAR, v_message, v_now;
        RETURN;
    END IF;

    -- Check if event already concluded
    IF v_booking.end_timestamp < v_now THEN
        v_result := 'EXPIRED';
        v_message := format('Pass expired. Event concluded at %s.', v_booking.end_timestamp);

        INSERT INTO scan_records (query_payload, result, staff_user_id, booking_id, booking_ref, event_title, attendee_name, seat_label, message, scanned_at)
        VALUES (p_query_payload, v_result, p_staff_user_id, v_booking.id, v_booking.booking_ref, v_booking.event_title, v_booking.student_name, v_booking.seat_label, v_message, v_now)
        RETURNING id INTO v_scan_id;

        INSERT INTO audit_logs (action, event_title, seat_label, user_name, reg_number, status, protocol, details)
        VALUES ('TICKET_VERIFY_EXPIRED', v_booking.event_title, v_booking.seat_label, v_booking.student_name, v_booking.reg_number, 'EXPIRED', 'GATE_SECURITY', v_message);

        RETURN QUERY SELECT v_scan_id, v_result, v_booking.booking_ref, v_booking.event_title, v_booking.student_name, v_booking.seat_label, v_message, v_now;
        RETURN;
    END IF;

    -- Check if already used
    IF v_booking.status = 'checked_in' THEN
        v_result := 'ALREADY_USED';
        v_message := format('DUPLICATE ENTRY ALERT! Pass already admitted at %s by %s.', 
                            to_char(v_booking.checked_in_at, 'HH12:MI AM'), COALESCE(v_booking.checked_in_by_name, 'Gate Officer'));

        INSERT INTO scan_records (query_payload, result, staff_user_id, booking_id, booking_ref, event_title, attendee_name, seat_label, message, original_checked_in_at, original_checked_in_by, scanned_at)
        VALUES (p_query_payload, v_result, p_staff_user_id, v_booking.id, v_booking.booking_ref, v_booking.event_title, v_booking.student_name, v_booking.seat_label, v_message, v_booking.checked_in_at, v_booking.checked_in_by_name, v_now)
        RETURNING id INTO v_scan_id;

        INSERT INTO audit_logs (action, event_title, seat_label, user_name, reg_number, status, protocol, details)
        VALUES ('TICKET_VERIFY_DUPLICATE', v_booking.event_title, v_booking.seat_label, v_booking.student_name, v_booking.reg_number, 'DUPLICATE', 'GATE_SECURITY', v_message);

        RETURN QUERY SELECT v_scan_id, v_result, v_booking.booking_ref, v_booking.event_title, v_booking.student_name, v_booking.seat_label, v_message, v_now;
        RETURN;
    END IF;

    -- Valid check-in: Update booking status atomically
    UPDATE bookings
    SET status = 'checked_in',
        checked_in_at = v_now,
        checked_in_by_user_id = p_staff_user_id
    WHERE id = v_booking.id;

    v_result := 'VALID';
    v_message := format('Access Granted! Welcome to Vibrance 2026, %s (%s).', v_booking.student_name, v_booking.seat_label);

    INSERT INTO scan_records (query_payload, result, staff_user_id, booking_id, booking_ref, event_title, attendee_name, seat_label, message, scanned_at)
    VALUES (p_query_payload, v_result, p_staff_user_id, v_booking.id, v_booking.booking_ref, v_booking.event_title, v_booking.student_name, v_booking.seat_label, v_message, v_now)
    RETURNING id INTO v_scan_id;

    INSERT INTO audit_logs (action, event_title, seat_label, user_name, reg_number, status, protocol, details)
    VALUES ('TICKET_VERIFY_VALID', v_booking.event_title, v_booking.seat_label, v_booking.student_name, v_booking.reg_number, 'SUCCESS', 'GATE_SECURITY', v_message);

    RETURN QUERY SELECT v_scan_id, v_result, v_booking.booking_ref, v_booking.event_title, v_booking.student_name, v_booking.seat_label, v_message, v_now;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 3. TRIGGERS
-- ----------------------------------------------------------------------------

-- Trigger: Automatically audit every confirmed booking creation
CREATE OR REPLACE FUNCTION trg_fn_audit_booking_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (action, event_id, seat_label, user_name, reg_number, status, protocol, details)
    VALUES (
        'BOOKING_CONFIRMED',
        NEW.event_id::text,
        NEW.seat_id::text,
        NEW.student_name,
        NEW.reg_number,
        'SUCCESS',
        'STRICT_2PL',
        format('Pass issued. BookingRef: %s, Amount: ₹%s via %s', NEW.booking_ref, NEW.amount, NEW.payment_method)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_booking_insert ON bookings;
CREATE TRIGGER trg_audit_booking_insert
AFTER INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION trg_fn_audit_booking_insert();

-- Trigger: Automatically update updated_at timestamp on record modification
CREATE OR REPLACE FUNCTION trg_fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_timestamp ON users;
CREATE TRIGGER trg_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trg_fn_update_timestamp();

DROP TRIGGER IF EXISTS trg_events_timestamp ON events;
CREATE TRIGGER trg_events_timestamp
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION trg_fn_update_timestamp();

DROP TRIGGER IF EXISTS trg_seats_timestamp ON seats;
CREATE TRIGGER trg_seats_timestamp
BEFORE UPDATE ON seats
FOR EACH ROW
EXECUTE FUNCTION trg_fn_update_timestamp();
