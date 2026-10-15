-- ============================================================================
-- Vibrance 2026 Database Migration: V5__seed_consistent_demo_passwords.sql
-- Purpose:
--   Seed standard BCrypt password hashes for festival demo personas (vibrance2026).
--   Eliminates any runtime password synchronization workarounds in application code.
-- ============================================================================

-- Standard BCrypt cost-10 hash for 'vibrance2026':
-- $2a$10$G3VmQwhdFyw85KyzG2KBZO8tnunh.ajvOxOVoAZ7g.bacgugaiSAu

UPDATE users
SET password_hash = '$2a$10$G3VmQwhdFyw85KyzG2KBZO8tnunh.ajvOxOVoAZ7g.bacgugaiSAu'
WHERE reg_number IN (
    'RA2111003010142',  -- Rahul Sharma (Student)
    'RA2111004020088',  -- Ananya Iyer (Student)
    'RA2111008010312',  -- Rohan Verma (Student)
    'STF-GATE-04',      -- Officer Rajesh Menon (Gate Staff)
    'STF-GATE-12',      -- Priya Sundaram (Gate Staff)
    'ADMIN-FACULTY-01'  -- Dr. Vikramaditya Rao (Admin)
);
