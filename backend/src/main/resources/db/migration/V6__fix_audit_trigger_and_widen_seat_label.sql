-- ============================================================================
-- Vibrance 2026 Database Migration: V6__fix_audit_trigger_and_widen_seat_label.sql
-- Purpose:
--   1. Widen audit_logs.seat_label column to VARCHAR(64) to prevent character overflow.
--   2. Fix trg_fn_audit_booking_insert trigger to look up real human-readable seat label
--      (e.g., 'A-1') and event title, preventing UUID string truncation errors.
-- ============================================================================

ALTER TABLE audit_logs ALTER COLUMN seat_label TYPE VARCHAR(64);

CREATE OR REPLACE FUNCTION trg_fn_audit_booking_insert()
RETURNS TRIGGER AS $$
DECLARE
    s_label VARCHAR(32);
    e_title VARCHAR(128);
BEGIN
    SELECT CONCAT(row_label, '-', seat_number) INTO s_label FROM seats WHERE id = NEW.seat_id;
    SELECT title INTO e_title FROM events WHERE id = NEW.event_id;

    INSERT INTO audit_logs (action, event_id, event_title, seat_label, user_name, reg_number, status, protocol, details)
    VALUES (
        'BOOKING_CONFIRMED',
        NEW.event_id::text,
        COALESCE(e_title, 'Festival Event'),
        COALESCE(s_label, SUBSTRING(NEW.seat_id::text FROM 1 FOR 32)),
        NEW.student_name,
        NEW.reg_number,
        'SUCCESS',
        'STRICT_2PL',
        format('Pass issued. BookingRef: %s, Amount: ₹%s via %s', NEW.booking_ref, NEW.amount, NEW.payment_method)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
