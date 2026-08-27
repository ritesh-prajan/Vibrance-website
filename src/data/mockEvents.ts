import { FestEvent, Seat, UserProfile, Booking, ScanRecord, AuditLog } from '../types';
import { EVENT_SCHEDULE_OFFSETS } from '../utils/timeUtils';

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

const NOW = Date.now();
const HOUR = 3600000;

export const INITIAL_EVENTS: FestEvent[] = [
  {
    id: 'evt-armaan',
    title: 'PRO-SHOW: ARMAAN MALIK LIVE',
    category: 'PRO_SHOW',
    artistOrHost: 'Armaan Malik & 8-Piece Band',
    date: 'TONIGHT • 07:30 PM',
    time: '07:30 PM IST',
    venue: 'Open Air Amphitheatre (Main Arena)',
    basePrice: 699,
    totalSeats: 48,
    availableSeats: 2,
    lockedSeatsCount: 1,
    bookedSeatsCount: 45,
    tag: 'COMING UP NEXT • 2 SEATS LEFT',
    shortDesc: 'Headline concert of Vibrance 2026. Critical seat contention testing target for DBMS concurrency benchmarks.',
    seats: generateSeatsForEvent('evt-armaan', 699, 2),
    startTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-armaan'].startOffset,
    endTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-armaan'].startOffset + 3.5 * HOUR,
  },
  {
    id: 'evt-dance',
    title: 'CHOREONITE: CREW CLASH',
    category: 'DANCE',
    artistOrHost: 'National Dance League Finalists',
    date: 'TODAY • LIVE STAGE',
    time: '05:00 PM IST',
    venue: 'Indoor Sports Complex Auditorium',
    basePrice: 299,
    totalSeats: 48,
    availableSeats: 15,
    lockedSeatsCount: 2,
    bookedSeatsCount: 31,
    tag: 'LIVE NOW ON STAGE',
    shortDesc: 'Synchronized urban hip-hop, lyrical contemporary, and high-energy stunt choreography happening right now.',
    seats: generateSeatsForEvent('evt-dance', 299),
    startTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-dance'].startOffset,
    endTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-dance'].startOffset + 3 * HOUR,
  },
  {
    id: 'evt-comedy',
    title: 'STAND-UP NIGHT: BISWA KALYAN RATH',
    category: 'COMEDY',
    artistOrHost: 'Biswa Kalyan Rath',
    date: 'TOMORROW • 06:00 PM',
    time: '06:00 PM IST',
    venue: 'Main Auditorium (Central Wing)',
    basePrice: 399,
    totalSeats: 48,
    availableSeats: 14,
    lockedSeatsCount: 2,
    bookedSeatsCount: 32,
    tag: 'TOMORROW EVENING',
    shortDesc: 'An hour of analytical and observational comedy dissecting engineering college life and algorithms.',
    seats: generateSeatsForEvent('evt-comedy', 399),
    startTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-comedy'].startOffset,
    endTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-comedy'].startOffset + 2 * HOUR,
  },
  {
    id: 'evt-edm',
    title: 'EDM NIGHT: LOST STORIES & ZAEDEN',
    category: 'EDM',
    artistOrHost: 'Lost Stories & Zaeden',
    date: 'IN 2 DAYS • 08:30 PM',
    time: '08:30 PM IST',
    venue: 'Campus Arena Ground (Dome Stage)',
    basePrice: 499,
    totalSeats: 48,
    availableSeats: 12,
    lockedSeatsCount: 2,
    bookedSeatsCount: 34,
    tag: 'UPCOMING SUNDAY GRAND FINALE',
    shortDesc: 'Electrifying progressive house, visual pyrotechnics, and Indian electronic fusion soundscape.',
    seats: generateSeatsForEvent('evt-edm', 499),
    startTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-edm'].startOffset,
    endTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-edm'].startOffset + 4 * HOUR,
  },
  {
    id: 'evt-band',
    title: 'BATTLE OF THE BANDS: DECIBEL WAR',
    category: 'BATTLE_OF_BANDS',
    artistOrHost: '12 Inter-Collegiate Rock Bands',
    date: 'YESTERDAY • CONCLUDED',
    time: '04:00 PM IST',
    venue: 'Auditorium Hall 1 (Acoustic Center)',
    basePrice: 249,
    totalSeats: 48,
    availableSeats: 0,
    lockedSeatsCount: 0,
    bookedSeatsCount: 48,
    tag: 'EVENT CONCLUDED / EXPIRED',
    shortDesc: 'Heavy riffs and drum solos. The musical clash has concluded.',
    seats: generateSeatsForEvent('evt-band', 249, 0),
    startTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-band'].startOffset,
    endTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-band'].startOffset + 4 * HOUR,
  },
  {
    id: 'evt-hack',
    title: 'HACKVIBRANCE: 36-HOUR BUILDATHON',
    category: 'HACKATHON',
    artistOrHost: 'Dept. of CSE & Tech Club',
    date: 'DAY 1 • CONCLUDED',
    time: '09:00 AM IST',
    venue: 'Tech Park Incubator Lab 4',
    basePrice: 199,
    totalSeats: 48,
    availableSeats: 0,
    lockedSeatsCount: 0,
    bookedSeatsCount: 48,
    tag: 'EVENT CONCLUDED / EXPIRED',
    shortDesc: '36 hours of non-stop code, AI prototyping, and DBMS optimization. Judged and concluded.',
    seats: generateSeatsForEvent('evt-hack', 199, 0),
    startTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-hack'].startOffset,
    endTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-hack'].startOffset + 24 * HOUR,
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-next-01',
    bookingRef: 'VIB26-ARMAAN-A1',
    eventId: 'evt-armaan',
    eventTitle: 'PRO-SHOW: ARMAAN MALIK LIVE',
    eventCategory: 'PRO_SHOW',
    artistOrHost: 'Armaan Malik & 8-Piece Band',
    eventDate: 'TONIGHT • 07:30 PM',
    eventTime: '07:30 PM IST',
    eventVenue: 'Open Air Amphitheatre (Main Arena)',
    seatId: 'evt-armaan-A1',
    seatLabel: 'A-1',
    seatCategory: 'VIP_FRONT',
    studentName: 'Rahul Sharma',
    regNumber: 'RA2111003010142',
    department: 'Computer Science & Engineering',
    amount: 1049,
    paymentMethod: 'UPI',
    bookedAt: NOW - 3600000 * 2,
    qrPayload: 'VIBRANCE26-TICKET-VIB26-ARMAAN-A1-RA2111003010142',
    status: 'confirmed',
    startTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-armaan'].startOffset,
    endTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-armaan'].startOffset + 3.5 * HOUR,
  },
  {
    id: 'bk-live-01',
    bookingRef: 'VIB26-DANCE-B4',
    eventId: 'evt-dance',
    eventTitle: 'CHOREONITE: CREW CLASH',
    eventCategory: 'DANCE',
    artistOrHost: 'National Dance League Finalists',
    eventDate: 'TODAY • LIVE STAGE',
    eventTime: '05:00 PM IST',
    eventVenue: 'Indoor Sports Complex Auditorium',
    seatId: 'evt-dance-B4',
    seatLabel: 'B-4',
    seatCategory: 'VIP_FRONT',
    studentName: 'Rahul Sharma',
    regNumber: 'RA2111003010142',
    department: 'Computer Science & Engineering',
    amount: 449,
    paymentMethod: 'CAMPUS_CARD',
    bookedAt: NOW - 3600000 * 6,
    qrPayload: 'VIBRANCE26-TICKET-VIB26-DANCE-B4-RA2111003010142',
    status: 'confirmed',
    startTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-dance'].startOffset,
    endTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-dance'].startOffset + 3 * HOUR,
  },
  {
    id: 'bk-future-01',
    bookingRef: 'VIB26-EDM-C3',
    eventId: 'evt-edm',
    eventTitle: 'EDM NIGHT: LOST STORIES & ZAEDEN',
    eventCategory: 'EDM',
    artistOrHost: 'Lost Stories & Zaeden',
    eventDate: 'IN 2 DAYS • 08:30 PM',
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
    bookedAt: NOW - 3600000 * 12,
    qrPayload: 'VIBRANCE26-TICKET-VIB26-EDM-C3-RA2111003010142',
    status: 'confirmed',
    startTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-edm'].startOffset,
    endTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-edm'].startOffset + 4 * HOUR,
  },
  {
    id: 'bk-expired-01',
    bookingRef: 'VIB26-HACK-EXPIRED',
    eventId: 'evt-hack',
    eventTitle: 'HACKVIBRANCE: 36-HOUR BUILDATHON',
    eventCategory: 'HACKATHON',
    artistOrHost: 'Dept. of CSE & Tech Club',
    eventDate: 'DAY 1 • CONCLUDED',
    eventTime: '09:00 AM IST',
    eventVenue: 'Tech Park Incubator Lab 4',
    seatId: 'evt-hack-E2',
    seatLabel: 'E-2',
    seatCategory: 'REGULAR',
    studentName: 'Rahul Sharma',
    regNumber: 'RA2111003010142',
    department: 'Computer Science & Engineering',
    amount: 199,
    paymentMethod: 'CAMPUS_CARD',
    bookedAt: NOW - 3600000 * 36,
    qrPayload: 'VIBRANCE26-TICKET-VIB26-HACK-EXPIRED-RA2111003010142',
    status: 'confirmed',
    startTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-hack'].startOffset,
    endTimestamp: NOW + EVENT_SCHEDULE_OFFSETS['evt-hack'].startOffset + 24 * HOUR,
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-seed-01',
    timestamp: NOW - 3600000 * 2,
    action: 'BOOKING_CONFIRMED',
    eventId: 'evt-armaan',
    eventTitle: 'PRO-SHOW: ARMAAN MALIK LIVE',
    seatLabel: 'A-1',
    userName: 'Rahul Sharma',
    regNumber: 'RA2111003010142',
    status: 'SUCCESS',
    details: 'Transaction committed with Strict 2PL. Seat [A-1] assigned. Ref: VIB26-ARMAAN-A1.',
    protocol: 'Strict 2-Phase Locking (2PL)',
  },
];

export const INITIAL_SCAN_HISTORY: ScanRecord[] = [
  {
    id: 'scan-seed-01',
    timestamp: NOW - 3600000 * 1,
    query: 'VIB26-ARMAAN-A1',
    result: 'ALREADY_USED',
    staffMember: {
      name: 'Officer Rajesh Menon',
      staffId: 'STF-GATE-04',
    },
    bookingId: 'bk-next-01',
    bookingRef: 'VIB26-ARMAAN-A1',
    eventTitle: 'PRO-SHOW: ARMAAN MALIK LIVE',
    attendeeName: 'Rahul Sharma',
    seatLabel: 'A-1',
    message: 'Duplicate barcode scanned at Gate Alpha. Original holder checked in earlier.',
    originalCheckedInAt: NOW - 3600000 * 1.5,
    originalCheckedInBy: 'Officer Rajesh Menon (STF-GATE-04)',
  },
];
