export type UserRole = 'student' | 'admin' | 'gate_staff';

export interface UserProfile {
  id: string;
  name: string;
  regNumber: string;
  email: string;
  role: UserRole;
  department: string;
  year?: string;
  avatarSeed: string;
}

export type StudentProfile = UserProfile;
export type GateStaffProfile = UserProfile;
export type AdminProfile = UserProfile;

export type BookingStatus = 'confirmed' | 'cancelled' | 'checked_in';
export type LockStatus = 'available' | 'selected' | 'locked' | 'booked';
export type ScanResultStatus = 'VALID' | 'ALREADY_USED' | 'INVALID' | 'EXPIRED';

export type EventCategory = 'PRO_SHOW' | 'EDM' | 'BATTLE_OF_BANDS' | 'DANCE' | 'HACKATHON' | 'COMEDY';

export interface Seat {
  id: string;
  row: string;
  number: number;
  category: 'VIP_FRONT' | 'GOLD' | 'REGULAR';
  price: number;
  status: 'available' | 'selected' | 'locked' | 'booked';
  lockedBy?: {
    userId: string;
    userName: string;
    regNumber: string;
  };
  lockExpiresAt?: number;
  bookedBy?: {
    userId: string;
    userName: string;
    regNumber: string;
    bookingRef: string;
  };
}

export interface FestEvent {
  id: string;
  title: string;
  category: EventCategory;
  artistOrHost: string;
  date: string;
  time: string;
  venue: string;
  basePrice: number;
  totalSeats: number;
  availableSeats: number;
  lockedSeatsCount: number;
  bookedSeatsCount: number;
  accentColor?: string;
  tag: string;
  shortDesc: string;
  ticketBgImage?: string;
  seats: Seat[];
  startTimestamp?: number;
  endTimestamp?: number;
}

export interface Booking {
  id: string;
  bookingRef: string;
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
  artistOrHost: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  seatId: string;
  seatLabel: string;
  seatCategory: string;
  studentName: string;
  regNumber: string;
  department: string;
  amount: number;
  paymentMethod: 'UPI' | 'CAMPUS_CARD' | 'NET_BANKING';
  bookedAt: number;
  qrPayload: string;
  ticketBgImage?: string;
  status: 'confirmed' | 'cancelled' | 'checked_in';
  checkedInAt?: number;
  checkedInBy?: {
    name: string;
    staffId: string;
  };
  startTimestamp?: number;
  endTimestamp?: number;
}

export interface ScanRecord {
  id: string;
  timestamp: number;
  query: string;
  result: ScanResultStatus;
  staffMember: {
    name: string;
    staffId: string;
  };
  bookingId?: string;
  bookingRef?: string;
  eventTitle?: string;
  attendeeName?: string;
  seatLabel?: string;
  message?: string;
  originalCheckedInAt?: number;
  originalCheckedInBy?: string;
}

export type ConcurrencyStrategy = 'NO_LOCKING' | 'TWO_PHASE_LOCKING' | 'OPTIMISTIC_OCC';

export interface SimulatedTx {
  txId: string;
  clientId: string;
  clientName: string;
  status: 'PENDING' | 'ACQUIRING_LOCK' | 'COMMITTED' | 'REJECTED' | 'DEADLOCK';
  currentStep: string;
  timestamp: number;
  latencyMs: number;
  seatClaimed?: string;
  message?: string;
}

export interface ConcurrencyRunResult {
  runId: string;
  strategy: ConcurrencyStrategy;
  targetEventId: string;
  targetEventTitle: string;
  concurrencyLevel: number;
  successfulCount: number;
  rejectedCount: number;
  deadlockCount: number;
  initialStock: number;
  finalStock: number;
  durationMs: number;
  overbookingDetected: boolean;
  overbookedSeats: number;
  transactions: SimulatedTx[];
  dbLogs: string[];
}

export interface SideBySideRunResult {
  noLockResult: ConcurrencyRunResult;
  twoPlResult: ConcurrencyRunResult;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  action:
    | 'LOCK_GRANTED'
    | 'LOCK_RELEASED'
    | 'LOCK_REJECTED'
    | 'LOCK_EXPIRED'
    | 'BOOKING_CONFIRMED'
    | 'TICKET_CANCELLED'
    | 'TICKET_VERIFY_VALID'
    | 'TICKET_VERIFY_DUPLICATE'
    | 'TICKET_VERIFY_EXPIRED'
    | 'TICKET_VERIFY_INVALID'
    | 'RACE_OVERBOOK'
    | 'SIMULATION_RUN'
    | 'BENCHMARK_SIDE_BY_SIDE'
    | 'DATABASE_RESET';
  eventId: string;
  eventTitle: string;
  seatLabel?: string;
  userName: string;
  regNumber: string;
  status: 'SUCCESS' | 'CONFLICT' | 'REJECTED' | 'INVALID' | 'RELEASED' | 'DUPLICATE' | 'EXPIRED';
  details: string;
  protocol?: string;
}
