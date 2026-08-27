export type UserRole = 'student' | 'admin' | 'gate_staff';

export interface UserProfile {
  id: string;
  name: string;
  regNumber: string; // e.g. student reg number or staff ID
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
export type ScanResultStatus = 'VALID' | 'ALREADY_USED' | 'INVALID';


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
  lockExpiresAt?: number; // timestamp ms
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
  seats: Seat[];
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
  status: 'confirmed' | 'cancelled' | 'checked_in';
  checkedInAt?: number;
  checkedInBy?: {
    name: string;
    staffId: string;
  };
}

export interface ScanRecord {
  id: string;
  timestamp: number;
  query: string;
  result: 'VALID' | 'ALREADY_USED' | 'INVALID';
  staffMember: {
    name: string;
    staffId: string;
  };
  bookingId?: string;
  bookingRef?: string;
  eventTitle?: string;
  attendeeName?: string;
  seatLabel?: string;
  originalCheckedInAt?: number;
  originalCheckedInBy?: string;
  message: string;
}

export type ConcurrencyStrategy = 'NO_LOCKING' | 'TWO_PHASE_LOCKING' | 'OPTIMISTIC_OCC';

export type TxStep = 'INIT' | 'READ_DATA' | 'ACQUIRE_LOCK' | 'VALIDATE' | 'WRITE_DATA' | 'COMMIT' | 'ABORT';

export interface SimulatedTx {
  txId: string;
  clientIndex: number;
  clientName: string;
  regNumber: string;
  status: 'PENDING' | 'RUNNING' | 'LOCKED' | 'COMMITTED' | 'REJECTED' | 'ROLLEDBACK';
  currentStep: TxStep;
  startTs: number;
  finishTs?: number;
  latencyMs: number;
  seatAllocated?: string;
  message: string;
  sqlStatements: string[];
  lockAcquired?: boolean;
  versionRead?: number;
}

export interface ConcurrencyRunResult {
  runId: string;
  timestamp: number;
  strategy: ConcurrencyStrategy;
  concurrencyLevel: number;
  targetEventTitle: string;
  targetSeatLabel: string;
  initialStock: number;
  finalStock: number;
  successfulCount: number;
  rejectedCount: number;
  overbookingDetected: boolean;
  overbookedSeats: number;
  durationMs: number;
  transactions: SimulatedTx[];
  dbLogs: string[];
}

export interface AuditLog {
  id: string;
  timestamp: number;
  action:
    | 'BOOKING_ATTEMPT'
    | 'LOCK_ACQUIRED'
    | 'LOCK_EXPIRED'
    | 'BOOKING_COMMITTED'
    | 'LOCK_REJECTED'
    | 'RACE_OVERBOOK'
    | 'TICKET_CANCELLED'
    | 'TICKET_VERIFIED'
    | 'TICKET_VERIFY_DUPLICATE'
    | 'TICKET_VERIFY_INVALID';
  eventId: string;
  eventTitle: string;
  seatLabel: string;
  userName: string;
  regNumber: string;
  status: 'SUCCESS' | 'CONFLICT' | 'ANOMALY_OVERBOOK' | 'RELEASED' | 'VERIFIED' | 'DUPLICATE_FLAGGED' | 'INVALID';
  details: string;
  protocol?: string;
}

