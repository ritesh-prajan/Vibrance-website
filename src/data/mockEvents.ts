import { FestEvent, Seat, UserProfile, Booking, ScanRecord, AuditLog } from '../types';

export const MOCK_STUDENT_PROFILES: UserProfile[] = [
  {
    id: 'usr-std-01',
    name: 'Rahul Sharma',
    regNumber: 'RA2111003010142',
    email: 'rahul.s@vibrance.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    year: '3rd Year (B.Tech)',
    avatarSeed: 'rahul',
  },
  {
    id: 'usr-std-02',
    name: 'Ananya Iyer',
    regNumber: 'RA2111004020088',
    email: 'ananya.i@vibrance.edu',
    role: 'student',
    department: 'Information Technology',
    year: '4th Year (B.Tech)',
    avatarSeed: 'ananya',
  },
  {
    id: 'usr-std-03',
    name: 'Kabir Verma',
    regNumber: 'RA2111005010214',
    email: 'kabir.v@vibrance.edu',
    role: 'student',
    department: 'Electronics & Communication',
    year: '2nd Year (B.Tech)',
    avatarSeed: 'kabir',
  },
];

export const MOCK_STAFF_PROFILES: UserProfile[] = [
  {
    id: 'usr-stf-01',
    name: 'Officer Rajesh Menon',
    regNumber: 'STF-GATE-04',
    email: 'rajesh.menon@vibrance.edu',
    role: 'gate_staff',
    department: 'Main Gate Access & Security Post A',
    year: 'Staff Lead',
    avatarSeed: 'rajesh',
  },
  {
    id: 'usr-stf-02',
    name: 'Inspector Priya Deshmukh',
    regNumber: 'STF-GATE-09',
    email: 'priya.d@vibrance.edu',
    role: 'gate_staff',
    department: 'Arena Dome Entrance Security',
    year: 'Staff Inspector',
    avatarSeed: 'priya',
  },
];

export const MOCK_ADMIN_PROFILES: UserProfile[] = [
  {
    id: 'usr-adm-01',
    name: 'Dr. Ramesh Sundaram',
    regNumber: 'FAC-DBMS-702',
    email: 'ramesh.dbms@vibrance.edu',
    role: 'admin',
    department: 'DBMS Lab Coordinator & Event Controller',
    year: 'Professor & Coordinator',
    avatarSeed: 'ramesh',
  },
  {
    id: 'usr-adm-02',
    name: 'Prof. Meera Kulkarni',
    regNumber: 'FAC-IT-109',
    email: 'meera.k@vibrance.edu',
    role: 'admin',
    department: 'Distributed Systems & Database Audit',
    year: 'Associate Professor',
    avatarSeed: 'meera',
  },
];

export function generateSeatsForEvent(
  eventId: string,
  basePrice: number,
  exactAvailableCount?: number
): Seat[] {
  const seats: Seat[] = [];
  const rows = [
    { row: 'A', count: 6, category: 'VIP_FRONT' as const, multiplier: 1.5 },
    { row: 'B', count: 6, category: 'VIP_FRONT' as const, multiplier: 1.5 },
    { row: 'C', count: 8, category: 'GOLD' as const, multiplier: 1.25 },
    { row: 'D', count: 8, category: 'GOLD' as const, multiplier: 1.25 },
    { row: 'E', count: 10, category: 'REGULAR' as const, multiplier: 1.0 },
    { row: 'F', count: 10, category: 'REGULAR' as const, multiplier: 1.0 },
  ];

  let totalGenerated = 0;
  const now = Date.now();

  rows.forEach((r) => {
    for (let num = 1; num <= r.count; num++) {
      totalGenerated++;
      const seatId = `${eventId}-${r.row}${num}`;
      const seatPrice = Math.round(basePrice * r.multiplier);

      let status: Seat['status'] = 'available';
      let lockedBy: Seat['lockedBy'] = undefined;
      let lockExpiresAt: number | undefined = undefined;
      let bookedBy: Seat['bookedBy'] = undefined;

      if (exactAvailableCount !== undefined) {
        if (totalGenerated > exactAvailableCount) {
          status = 'booked';
          bookedBy = {
            userId: `usr-seeded-${num}`,
            userName: `Student #${1000 + num}`,
            regNumber: `RA211100${1000 + num}`,
            bookingRef: `VIB26-${eventId.toUpperCase()}-${r.row}${num}`,
          };
        }
      } else {
        const hash = (seatId.charCodeAt(0) * 19 + seatId.charCodeAt(seatId.length - 1) * 31 + num * 11) % 100;
        if (hash < 68) {
          status = 'booked';
          bookedBy = {
            userId: `usr-${num}`,
            userName: `Student #${1000 + num}`,
            regNumber: `RA211100${1000 + num}`,
            bookingRef: `VIB26-${eventId.toUpperCase()}-${r.row}${num}`,
          };
        } else if (hash < 76) {
          status = 'locked';
          const remainingSec = 40 + (num * 17) % 120;
          lockExpiresAt = now + remainingSec * 1000;
          lockedBy = {
            userId: `usr-lock-${num}`,
            userName: `Simulated User ${num}`,
            regNumber: `RA211000${200 + num}`,
          };
        }
      }

      seats.push({
        id: seatId,
        row: r.row,
        number: num,
        category: r.category,
        price: seatPrice,
        status,
        lockedBy,
        lockExpiresAt,
        bookedBy,
      });
    }
  });

  return seats;
}

export const INITIAL_EVENTS: FestEvent[] = [
  {
    id: 'evt-armaan',
    title: 'PRO-SHOW: ARMAAN MALIK LIVE',
    category: 'PRO_SHOW',
    artistOrHost: 'Armaan Malik & 8-Piece Band',
    date: 'MARCH 14, 2026',
    time: '07:30 PM IST',
    venue: 'Open Air Amphitheatre (Main Arena)',
    basePrice: 699,
    totalSeats: 48,
    availableSeats: 2,
    lockedSeatsCount: 1,
    bookedSeatsCount: 45,
    tag: 'HIGH CONTENTION • 2 SEATS LEFT',
    shortDesc: 'Headline concert of Vibrance 2026. Critical seat contention testing target for DBMS concurrency benchmarks.',
    seats: generateSeatsForEvent('evt-armaan', 699, 2),
  },
  {
    id: 'evt-edm',
    title: 'EDM NIGHT: LOST STORIES & ZAEDEN',
    category: 'EDM',
    artistOrHost: 'Lost Stories & Zaeden',
    date: 'MARCH 15, 2026',
    time: '08:30 PM IST',
    venue: 'Campus Arena Ground (Dome Stage)',
    basePrice: 499,
    totalSeats: 48,
    availableSeats: 12,
    lockedSeatsCount: 2,
    bookedSeatsCount: 34,
    tag: 'FAST FILLING',
    shortDesc: 'Electrifying progressive house, visual pyrotechnics, and Indian electronic fusion soundscape.',
    seats: generateSeatsForEvent('evt-edm', 499),
  },
  {
    id: 'evt-band',
    title: 'BATTLE OF THE BANDS: DECIBEL WAR',
    category: 'BATTLE_OF_BANDS',
    artistOrHost: '12 Inter-Collegiate Rock Bands',
    date: 'MARCH 13, 2026',
    time: '04:00 PM IST',
    venue: 'Auditorium Hall 1 (Acoustic Center)',
    basePrice: 249,
    totalSeats: 48,
    availableSeats: 18,
    lockedSeatsCount: 1,
    bookedSeatsCount: 29,
    tag: 'LIMITED PASSES',
    shortDesc: 'Distortion, heavy riffs, and drum solos. The grand inter-college musical clash.',
    seats: generateSeatsForEvent('evt-band', 249),
  },
  {
    id: 'evt-dance',
    title: 'CHOREONITE: CREW CLASH',
    category: 'DANCE',
    artistOrHost: 'National Dance League Finalists',
    date: 'MARCH 14, 2026',
    time: '05:00 PM IST',
    venue: 'Indoor Sports Complex Auditorium',
    basePrice: 299,
    totalSeats: 48,
    availableSeats: 15,
    lockedSeatsCount: 2,
    bookedSeatsCount: 31,
    tag: 'SEATS SELLING FAST',
    shortDesc: 'Synchronized urban hip-hop, lyrical contemporary, and high-energy stunt choreography.',
    seats: generateSeatsForEvent('evt-dance', 299),
  },
  {
    id: 'evt-hack',
    title: 'HACKVIBRANCE: 36-HOUR BUILDATHON',
    category: 'HACKATHON',
    artistOrHost: 'Dept. of CSE & Tech Club',
    date: 'MARCH 13-14, 2026',
    time: '09:00 AM IST',
    venue: 'Tech Park Incubator Lab 4',
    basePrice: 199,
    totalSeats: 48,
    availableSeats: 8,
    lockedSeatsCount: 3,
    bookedSeatsCount: 37,
    tag: 'FEW TEAM SLOTS LEFT',
    shortDesc: '36 hours of non-stop code, AI prototyping, DBMS optimization, and ₹2,00,000 in cash bounties.',
    seats: generateSeatsForEvent('evt-hack', 199),
  },
  {
    id: 'evt-comedy',
    title: 'STAND-UP NIGHT: BISWA KALYAN RATH',
    category: 'COMEDY',
    artistOrHost: 'Biswa Kalyan Rath',
    date: 'MARCH 15, 2026',
    time: '06:00 PM IST',
    venue: 'Main Auditorium (Central Wing)',
    basePrice: 399,
    totalSeats: 48,
    availableSeats: 14,
    lockedSeatsCount: 2,
    bookedSeatsCount: 32,
    tag: 'FILLING UP',
    shortDesc: 'An hour of analytical and observational comedy dissecting engineering college life and algorithms.',
    seats: generateSeatsForEvent('evt-comedy', 399),
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-valid-01',
    bookingRef: 'VIB26-EDM-C3',
    eventId: 'evt-edm',
    eventTitle: 'EDM NIGHT: LOST STORIES & ZAEDEN',
    eventCategory: 'EDM',
    artistOrHost: 'Lost Stories & Zaeden',
    eventDate: 'MARCH 15, 2026',
    eventTime: '08:30 PM IST',
    eventVenue: 'Campus Arena Ground (Dome Stage)',
    seatId: 'evt-edm-C3',
    seatLabel: 'C-3',
    seatCategory: 'GOLD',
    studentName: 'Rahul Sharma',
    regNumber: 'RA2111003010142',
    department: 'Computer Science & Engineering',
    amount: 624,
    paymentMethod: 'UPI',
    bookedAt: Date.now() - 3600000 * 5,
    qrPayload: 'VIB26-EDM-C3-RA2111003010142',
    status: 'confirmed',
  },
  {
    id: 'bk-used-01',
    bookingRef: 'VIB26-ARMAAN-A1',
    eventId: 'evt-armaan',
    eventTitle: 'PRO-SHOW: ARMAAN MALIK LIVE',
    eventCategory: 'PRO_SHOW',
    artistOrHost: 'Armaan Malik & 8-Piece Band',
    eventDate: 'MARCH 14, 2026',
    eventTime: '07:30 PM IST',
    eventVenue: 'Open Air Amphitheatre (Main Arena)',
    seatId: 'evt-armaan-A1',
    seatLabel: 'A-1',
    seatCategory: 'VIP_FRONT',
    studentName: 'Ananya Iyer',
    regNumber: 'RA2111004020088',
    department: 'Information Technology',
    amount: 1049,
    paymentMethod: 'CAMPUS_CARD',
    bookedAt: Date.now() - 3600000 * 12,
    qrPayload: 'VIB26-ARMAAN-A1-RA2111004020088',
    status: 'checked_in',
    checkedInAt: Date.now() - 3600000 * 2.5,
    checkedInBy: {
      name: 'Officer Rajesh Menon',
      staffId: 'STF-GATE-04',
    },
  },
  {
    id: 'bk-valid-02',
    bookingRef: 'VIB26-HACK-E5',
    eventId: 'evt-hack',
    eventTitle: 'HACKVIBRANCE: 36-HOUR BUILDATHON',
    eventCategory: 'HACKATHON',
    artistOrHost: 'Dept. of CSE & Tech Club',
    eventDate: 'MARCH 13-14, 2026',
    eventTime: '09:00 AM IST',
    eventVenue: 'Tech Park Incubator Lab 4',
    seatId: 'evt-hack-E5',
    seatLabel: 'E-5',
    seatCategory: 'REGULAR',
    studentName: 'Rahul Sharma',
    regNumber: 'RA2111003010142',
    department: 'Computer Science & Engineering',
    amount: 199,
    paymentMethod: 'UPI',
    bookedAt: Date.now() - 3600000 * 8,
    qrPayload: 'VIB26-HACK-E5-RA2111003010142',
    status: 'confirmed',
  },
  {
    id: 'bk-cancelled-01',
    bookingRef: 'VIB26-BAND-D2',
    eventId: 'evt-band',
    eventTitle: 'BATTLE OF THE BANDS: DECIBEL WAR',
    eventCategory: 'BATTLE_OF_BANDS',
    artistOrHost: '12 Inter-Collegiate Rock Bands',
    eventDate: 'MARCH 13, 2026',
    eventTime: '04:00 PM IST',
    eventVenue: 'Auditorium Hall 1 (Acoustic Center)',
    seatId: 'evt-band-D2',
    seatLabel: 'D-2',
    seatCategory: 'GOLD',
    studentName: 'Kabir Verma',
    regNumber: 'RA2111005010214',
    department: 'Electronics & Communication',
    amount: 311,
    paymentMethod: 'NET_BANKING',
    bookedAt: Date.now() - 3600000 * 20,
    qrPayload: 'VIB26-BAND-D2-RA2111005010214',
    status: 'cancelled',
  },
];

export const INITIAL_SCAN_RECORDS: ScanRecord[] = [
  {
    id: 'scan-01',
    timestamp: Date.now() - 3600000 * 2.5,
    query: 'VIB26-ARMAAN-A1',
    result: 'VALID',
    staffMember: {
      name: 'Officer Rajesh Menon',
      staffId: 'STF-GATE-04',
    },
    bookingId: 'bk-used-01',
    bookingRef: 'VIB26-ARMAAN-A1',
    eventTitle: 'PRO-SHOW: ARMAAN MALIK LIVE',
    attendeeName: 'Ananya Iyer',
    seatLabel: 'A-1',
    message: 'Pass verified. Attendee admitted to Main Arena VIP Section.',
  },
  {
    id: 'scan-02',
    timestamp: Date.now() - 3600000 * 1.2,
    query: 'VIB26-INVALID-TEST99',
    result: 'INVALID',
    staffMember: {
      name: 'Officer Rajesh Menon',
      staffId: 'STF-GATE-04',
    },
    message: 'Ticket not found in central registry. Access denied.',
  },
  {
    id: 'scan-03',
    timestamp: Date.now() - 1800000,
    query: 'VIB26-ARMAAN-A1',
    result: 'ALREADY_USED',
    staffMember: {
      name: 'Inspector Priya Deshmukh',
      staffId: 'STF-GATE-09',
    },
    bookingId: 'bk-used-01',
    bookingRef: 'VIB26-ARMAAN-A1',
    eventTitle: 'PRO-SHOW: ARMAAN MALIK LIVE',
    attendeeName: 'Ananya Iyer',
    seatLabel: 'A-1',
    originalCheckedInAt: Date.now() - 3600000 * 2.5,
    originalCheckedInBy: 'Officer Rajesh Menon (STF-GATE-04)',
    message: 'Duplicate pass entry attempt detected. Original check-in 2.5h prior.',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: Date.now() - 3600000 * 5,
    action: 'BOOKING_COMMITTED',
    eventId: 'evt-edm',
    eventTitle: 'EDM NIGHT: LOST STORIES & ZAEDEN',
    seatLabel: 'C-3',
    userName: 'Rahul Sharma',
    regNumber: 'RA2111003010142',
    status: 'SUCCESS',
    details: '2PL Lock promoted to X-Lock and transaction committed with ACID durability. Ref: VIB26-EDM-C3.',
    protocol: 'Strict 2-Phase Locking (2PL)',
  },
  {
    id: 'log-02',
    timestamp: Date.now() - 3600000 * 3,
    action: 'LOCK_REJECTED',
    eventId: 'evt-armaan',
    eventTitle: 'PRO-SHOW: ARMAAN MALIK LIVE',
    seatLabel: 'A-2',
    userName: 'Simulated User 4',
    regNumber: 'RA211000204',
    status: 'CONFLICT',
    details: 'Exclusive write lock already held by concurrent Tx-882. Request aborted (409 Conflict).',
    protocol: 'Strict 2-Phase Locking (2PL)',
  },
  {
    id: 'log-03',
    timestamp: Date.now() - 3600000 * 2.5,
    action: 'TICKET_VERIFIED',
    eventId: 'evt-armaan',
    eventTitle: 'PRO-SHOW: ARMAAN MALIK LIVE',
    seatLabel: 'A-1',
    userName: 'Ananya Iyer',
    regNumber: 'RA2111004020088',
    status: 'VERIFIED',
    details: 'Gate check-in recorded by Officer Rajesh Menon (STF-GATE-04). Status updated to checked_in.',
    protocol: 'Gate Entry Verification Protocol',
  },
  {
    id: 'log-04',
    timestamp: Date.now() - 1800000,
    action: 'TICKET_VERIFY_DUPLICATE',
    eventId: 'evt-armaan',
    eventTitle: 'PRO-SHOW: ARMAAN MALIK LIVE',
    seatLabel: 'A-1',
    userName: 'Ananya Iyer',
    regNumber: 'RA2111004020088',
    status: 'DUPLICATE_FLAGGED',
    details: 'Duplicate scan intercepted at Gate Post B. Original check-in at Post A by Staff R. Menon.',
    protocol: 'Gate Entry Verification Protocol',
  },
];
