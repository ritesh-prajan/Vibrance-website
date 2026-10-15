-- ============================================================================
-- Vibrance 2026 Database Migration: V2__seed_festival_data.sql
-- Purpose: Initial production seed data for festival events, seats, and users
-- ============================================================================

-- Standard BCrypt hash for default initial password "password123":
-- $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG

-- 1. Insert Initial Festival Users & Personas
INSERT INTO users (id, reg_number, name, email, password_hash, role, department, year_of_study, avatar_seed) VALUES
('a0000000-0000-0000-0000-000000000001', 'RA2111003010142', 'Rahul Sharma', 'rahul.sharma@vibrance.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'student', 'Computer Science & Engineering (SCOPE)', '3rd Year (B.Tech)', 'rahul'),
('a0000000-0000-0000-0000-000000000002', 'RA2111004020088', 'Ananya Iyer', 'ananya.iyer@vibrance.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'student', 'Electronics & Communication (SENSE)', '2nd Year (B.Tech)', 'ananya'),
('a0000000-0000-0000-0000-000000000003', 'RA2111008010312', 'Rohan Verma', 'rohan.verma@vibrance.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'student', 'Mechanical Engineering (SMEC)', '4th Year (B.Tech)', 'rohan'),
('b0000000-0000-0000-0000-000000000001', 'STF-GATE-04', 'Officer Rajesh Menon', 'rajesh.menon@vibrance.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'gate_staff', 'Main Gate Security Post', 'Chief Gate Inspector', 'rajesh'),
('b0000000-0000-0000-0000-000000000002', 'STF-GATE-12', 'Priya Sundaram', 'priya.sundaram@vibrance.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'gate_staff', 'Amphitheatre North Gate Post', 'Security Coordinator', 'priya'),
('c0000000-0000-0000-0000-000000000001', 'ADMIN-FACULTY-01', 'Dr. Vikramaditya Rao', 'vikram.rao@vibrance.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'admin', 'School of Computing (SCOPE)', 'Professor & Fest Convener', 'vikram');

-- 2. Insert Events
INSERT INTO events (id, event_code, title, category, artist_or_host, date_str, time_str, venue, base_price, total_seats, accent_color, tag, short_desc, ticket_bg_image, start_timestamp, end_timestamp) VALUES
('e0000000-0000-0000-0000-000000000001', 'evt-armaan', 'PRO-SHOW: ARMAAN MALIK LIVE', 'PRO_SHOW', 'Armaan Malik & 8-Piece Band', 'TONIGHT • 07:30 PM', '07:30 PM IST', 'Main Campus Amphitheatre', 699.00, 48, '#FF3E41', 'HEADLINE SHOW • TONIGHT', 'Experience Armaan Malik performing chart-topping multilingual hits with an 8-piece symphonic band live at the VIT Chennai Amphitheatre.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP + INTERVAL '2 hours', CURRENT_TIMESTAMP + INTERVAL '6 hours'),
('e0000000-0000-0000-0000-000000000002', 'evt-edm', 'SUNBURN CAMPUS: LOST STORIES', 'EDM', 'Lost Stories & Zaeden', 'Thu, Sep 3, 2026', '08:00 PM IST', 'Sunken Garden Stage', 499.00, 48, '#DF367C', 'ELECTRONIC ARENA • THU', 'High-energy progressive house, thunderous bass, and synchronised stadium lasers featuring India''s top international dance artists.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '3 days 4 hours'),
('e0000000-0000-0000-0000-000000000003', 'evt-comedy', 'STANDUP COMEDY SPECIAL', 'COMEDY', 'Biswa Kalyan Rath', 'Tue, Sep 1, 2026', '06:00 PM IST', 'Auditorium Hall 1 (Acoustic Center)', 349.00, 48, '#883955', 'COMEDY SPECIAL • TUE', 'An unfiltered hour of observational humour, philosophical dilemmas, and engineering roasts from Biswa Kalyan Rath.', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1000&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '1 day 3 hours'),
('e0000000-0000-0000-0000-000000000004', 'evt-dance', 'CHOREONITE: NATIONAL DANCE CLASH', 'DANCE', '16 Championship Teams', 'LIVE NOW • 05:00 PM', '05:00 PM IST', 'Indoor Sports Complex Arena', 199.00, 48, '#FF7099', 'CHAMPIONSHIP • LIVE NOW', 'Elite university dance troupes battle across hip-hop, contemporary, and fusion choreographies for the Vibrance Trophy.', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1000&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP + INTERVAL '3 hours'),
('e0000000-0000-0000-0000-000000000005', 'evt-cyberquest', 'CYBERQUEST: DEFEND & DECODE', 'HACKATHON', 'Helen Vijitha P', 'Sat, Sep 5, 2026', '11:18 AM IST', 'Nethaji 7TH Floor', 100.00, 48, '#06B6D4', '_Capture. Decode. Defend_ • 85% FILLED', 'Capture. Decode. Defend. School of Computer Science and Engineering (SCOPE) & Cybercom Hackathon.', '/cyberquest-ticket.png', CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '6 days'),
('e0000000-0000-0000-0000-000000000006', 'evt-band', 'BATTLE OF THE BANDS: DECIBEL WAR', 'BATTLE_OF_BANDS', '12 Inter-Collegiate Rock Bands', 'Sun, Aug 30, 2026 • CONCLUDED', '04:00 PM IST', 'Auditorium Hall 1 (Acoustic Center)', 249.00, 48, '#9333EA', 'EVENT CONCLUDED / EXPIRED', 'Heavy riffs and drum solos. The musical clash has concluded.', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1000&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day 20 hours'),
('e0000000-0000-0000-0000-000000000007', 'evt-hack', 'HACKVIBRANCE: 36-HOUR BUILDATHON', 'HACKATHON', 'Dept. of CSE & Tech Club', 'Sat, Aug 29, 2026 • CONCLUDED', '09:00 AM IST', 'Tech Park Incubator Lab 4', 199.00, 48, '#10B981', 'EVENT CONCLUDED / EXPIRED', '36 hours of non-stop code, AI prototyping, and DBMS optimization. Judged and concluded.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '2 days');

-- 3. Stored Generation of Standard 48 Seats for Each Event
-- Row A: 12 VIP_FRONT seats (base_price * 1.5)
-- Row B: 12 GOLD seats (base_price * 1.25)
-- Rows C & D: 24 REGULAR seats (base_price)
DO $$
DECLARE
    evt RECORD;
    r VARCHAR(4);
    s_num INT;
    cat VARCHAR(20);
    p NUMERIC(10, 2);
    s_status VARCHAR(20);
    seat_counter INT;
BEGIN
    FOR evt IN SELECT id, event_code, base_price FROM events LOOP
        seat_counter := 0;
        FOR r IN SELECT unnest(ARRAY['A', 'B', 'C', 'D']) LOOP
            IF r = 'A' THEN
                cat := 'VIP_FRONT';
                p := ROUND(evt.base_price * 1.5, 2);
            ELSIF r = 'B' THEN
                cat := 'GOLD';
                p := ROUND(evt.base_price * 1.25, 2);
            ELSE
                cat := 'REGULAR';
                p := evt.base_price;
            END IF;

            FOR s_num IN 1..12 LOOP
                seat_counter := seat_counter + 1;
                
                -- Determine seat status based on event type
                IF evt.event_code IN ('evt-band', 'evt-hack') THEN
                    -- Concluded events have all seats booked
                    s_status := 'booked';
                ELSIF evt.event_code = 'evt-cyberquest' THEN
                    -- 85.4% filled: 41 seats booked, 7 available
                    IF seat_counter <= 41 THEN
                        s_status := 'booked';
                    ELSE
                        s_status := 'available';
                    END IF;
                ELSIF evt.event_code = 'evt-armaan' AND r = 'A' AND s_num = 1 THEN
                    -- Pre-seeded booked demo seat
                    s_status := 'booked';
                ELSIF evt.event_code = 'evt-dance' AND r = 'B' AND s_num = 4 THEN
                    -- Pre-seeded booked demo seat
                    s_status := 'booked';
                ELSE
                    s_status := 'available';
                END IF;

                INSERT INTO seats (event_id, row_label, seat_number, category, price, status, version)
                VALUES (evt.id, r, s_num, cat, p, s_status, 1);
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- 4. Insert Initial Realistic Demo Bookings
INSERT INTO bookings (id, booking_ref, event_id, seat_id, user_id, student_name, reg_number, department, amount, payment_method, qr_payload, ticket_bg_image, status, booked_at, checked_in_at, checked_in_by_user_id)
SELECT 
    'd0000000-0000-0000-0000-000000000001'::uuid,
    'VIB26-ARMAAN-A1',
    e.id,
    s.id,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Rahul Sharma',
    'RA2111003010142',
    'Computer Science & Engineering (SCOPE)',
    1049.00,
    'UPI',
    'VIBRANCE26-TICKET-VIB26-ARMAAN-A1-RA2111003010142',
    e.ticket_bg_image,
    'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '2 hours',
    NULL,
    NULL
FROM events e
JOIN seats s ON s.event_id = e.id AND s.row_label = 'A' AND s.seat_number = 1
WHERE e.event_code = 'evt-armaan';

INSERT INTO bookings (id, booking_ref, event_id, seat_id, user_id, student_name, reg_number, department, amount, payment_method, qr_payload, ticket_bg_image, status, booked_at, checked_in_at, checked_in_by_user_id)
SELECT 
    'd0000000-0000-0000-0000-000000000002'::uuid,
    'VIB26-DANCE-B4',
    e.id,
    s.id,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Rahul Sharma',
    'RA2111003010142',
    'Computer Science & Engineering (SCOPE)',
    249.00,
    'UPI',
    'VIBRANCE26-TICKET-VIB26-DANCE-B4-RA2111003010142',
    e.ticket_bg_image,
    'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '1 hour',
    NULL,
    NULL
FROM events e
JOIN seats s ON s.event_id = e.id AND s.row_label = 'B' AND s.seat_number = 4
WHERE e.event_code = 'evt-dance';

INSERT INTO bookings (id, booking_ref, event_id, seat_id, user_id, student_name, reg_number, department, amount, payment_method, qr_payload, ticket_bg_image, status, booked_at, checked_in_at, checked_in_by_user_id)
SELECT 
    'd0000000-0000-0000-0000-000000000003'::uuid,
    'VIB26-HAC-DEMO99',
    e.id,
    s.id,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Rahul Sharma',
    'RA2111003010142',
    'Computer Science & Engineering (SCOPE)',
    150.00,
    'UPI',
    'VIBRANCE26-TICKET-VIB26-HAC-DEMO99-RA2111003010142',
    '/cyberquest-ticket.png',
    'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '5 hours',
    NULL,
    NULL
FROM events e
JOIN seats s ON s.event_id = e.id AND s.row_label = 'A' AND s.seat_number = 1
WHERE e.event_code = 'evt-cyberquest';

-- 5. Insert Initial Audit Logs
INSERT INTO audit_logs (action, event_id, event_title, seat_label, user_name, reg_number, status, protocol, details) VALUES
('DATABASE_RESET', 'SYS', 'All Stages', NULL, 'Dr. Vikramaditya Rao', 'ADMIN-SYS', 'SUCCESS', 'SYSTEM', 'System baseline established with official events and 3NF relational schema.'),
('BOOKING_CONFIRMED', 'evt-armaan', 'PRO-SHOW: ARMAAN MALIK LIVE', 'A-1', 'Rahul Sharma', 'RA2111003010142', 'SUCCESS', 'STRICT_2PL', 'Booking confirmed for Seat A-1. Amount: ₹1049.00 via UPI. QR generated.'),
('BOOKING_CONFIRMED', 'evt-cyberquest', 'CYBERQUEST: DEFEND & DECODE', 'A-1', 'Rahul Sharma', 'RA2111003010142', 'SUCCESS', 'STRICT_2PL', 'Booking confirmed for Seat A-1. Amount: ₹150.00 via UPI. Artwork attached.');
