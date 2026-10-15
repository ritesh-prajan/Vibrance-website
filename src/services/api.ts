/**
 * Vibrance 2026 – Backend API Client
 * Thin fetch wrapper forwarded through Vite proxy to Spring Boot on :8080
 */

const BASE = '/api/v1';

// ─── Token Storage ────────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('vibrance_jwt');
export const setToken = (t: string) => localStorage.setItem('vibrance_jwt', t);
export const clearToken = () => localStorage.removeItem('vibrance_jwt');

function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({ success: false, message: 'No response body' }));

  if (!res.ok) {
    throw new Error(json?.message ?? `HTTP ${res.status}`);
  }

  return json;
}

const get = <T>(path: string) => request<T>('GET', path);
const post = <T>(path: string, body: unknown) => request<T>('POST', path, body);
const put = <T>(path: string, body: unknown) => request<T>('PUT', path, body);
const del = <T>(path: string) => request<T>('DELETE', path);

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserDTO {
  id: string;
  regNumber: string;
  name: string;
  email: string;
  role: 'student' | 'gate_staff' | 'admin';
  department: string;
  yearOfStudy: string;
  avatarSeed?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: UserDTO;
}

export interface EventDTO {
  id: string;
  eventCode: string;
  title: string;
  category: string;
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
  tag?: string;
  shortDesc?: string;
  ticketBgImage?: string;
  startTimestamp: number;
  endTimestamp: number;
  seats?: SeatDTO[];
}

export interface SeatDTO {
  id: string;
  eventId: string;
  row: string;
  number: number;
  category: 'VIP_FRONT' | 'GOLD' | 'REGULAR';
  price: number;
  status: 'available' | 'locked' | 'booked';
  lockedBy?: { userId: string; userName: string; regNumber: string };
  lockExpiresAt?: number;
  version: number;
}

export interface BookingDTO {
  id: string;
  bookingRef: string;
  eventId: string;
  eventTitle: string;
  eventCategory: string;
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
  paymentMethod: string;
  bookedAt: number;
  qrPayload: string;
  ticketBgImage?: string;
  status: 'confirmed' | 'cancelled' | 'checked_in';
  checkedInAt?: number;
  checkedInBy?: { name: string; staffId: string };
  startTimestamp: number;
  endTimestamp: number;
}

export interface ScanResultDTO {
  id: string;
  timestamp: number;
  result: 'VALID' | 'ALREADY_USED' | 'INVALID' | 'EXPIRED';
  message: string;
  query: string;
  bookingId?: string;
  bookingRef?: string;
  eventTitle?: string;
  attendeeName?: string;
  seatLabel?: string;
  staffMember?: { name: string; staffId: string };
  originalCheckedInAt?: number;
  originalCheckedInBy?: string;
}

export interface AuditLogDTO {
  id: string;
  timestamp: number;
  action: string;
  eventId?: string;
  eventTitle?: string;
  seatLabel?: string;
  userName?: string;
  regNumber?: string;
  status: string;
  protocol: string;
  details?: string;
}

export interface AdminSummaryDTO {
  totalEvents: number;
  passesIssued: number;
  totalRevenue: number;
  contentionConflicts: number;
  checkInRate: number;
  checkedInCount: number;
}

export interface ConcurrencySimRequest {
  strategy: 'NO_LOCKING' | 'TWO_PHASE_LOCKING' | 'OPTIMISTIC_OCC';
  concurrencyLevel: number;
  targetEventId?: string;
}

export interface SimulatedTxDTO {
  txId: string;
  clientId: string;
  clientName: string;
  status: string;
  currentStep: string;
  timestamp: number;
  latencyMs: number;
  seatClaimed?: string;
  message?: string;
}

export interface ConcurrencyRunResultDTO {
  runId: string;
  strategy: string;
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
  transactions: SimulatedTxDTO[];
  dbLogs: string[];
}

// ─── Auth Endpoints ───────────────────────────────────────────────────────────
export const authApi = {
  login: (regNumber: string, password?: string) =>
    post<ApiResponse<AuthResponse>>('/auth/login', { regNumber, password }),

  register: (data: {
    regNumber: string; name: string; email: string;
    password?: string; role?: string; department: string; yearOfStudy?: string;
  }) => post<ApiResponse<AuthResponse>>('/auth/register', data),

  me: () => get<ApiResponse<UserDTO>>('/auth/me'),

  persona: (regNumber: string) =>
    get<ApiResponse<UserDTO>>(`/auth/persona/${encodeURIComponent(regNumber)}`),
};

// ─── Events Endpoints ──────────────────────────────────────────────────────────
export const eventsApi = {
  getAll: () => get<ApiResponse<EventDTO[]>>('/events'),
  getById: (id: string, includeSeats = true) =>
    get<ApiResponse<EventDTO>>(`/events/${id}?includeSeats=${includeSeats}`),
  getByCode: (code: string, includeSeats = true) =>
    get<ApiResponse<EventDTO>>(`/events/code/${code}?includeSeats=${includeSeats}`),
  create: (data: Partial<EventDTO>) =>
    post<ApiResponse<EventDTO>>('/events', data),
  update: (id: string, data: Partial<EventDTO>) =>
    put<ApiResponse<EventDTO>>(`/events/${id}`, data),
  delete: (id: string) =>
    del<ApiResponse<void>>(`/events/${id}`),
};

// ─── Seats Endpoints ────────────────────────────────────────────────────────────
export const seatsApi = {
  getForEvent: (eventId: string) =>
    get<ApiResponse<SeatDTO[]>>(`/seats/event/${eventId}`),

  lockSeat: (seatId: string, leaseDurationSeconds = 300) =>
    post<ApiResponse<{ success: boolean; message: string; seat: SeatDTO; lockExpiresAt: number; remainingSeconds: number }>>(
      '/seats/lock',
      { seatId, leaseDurationSeconds }
    ),

  releaseSeat: (seatId: string) =>
    post<ApiResponse<void>>(`/seats/${seatId}/release`, {}),
};

// ─── Bookings Endpoints ────────────────────────────────────────────────────────
export const bookingsApi = {
  create: (data: {
    eventId: string; seatId: string; name: string;
    regNumber: string; department?: string; paymentMethod: string;
  }) => post<ApiResponse<BookingDTO>>('/bookings', data),

  getMyBookings: () =>
    get<ApiResponse<BookingDTO[]>>('/bookings/my'),

  getAllBookings: () =>
    get<ApiResponse<BookingDTO[]>>('/bookings/all'),

  getByRef: (ref: string) =>
    get<ApiResponse<BookingDTO>>(`/bookings/${encodeURIComponent(ref)}`),

  cancel: (bookingId: string) =>
    post<ApiResponse<void>>(`/bookings/${bookingId}/cancel`, {}),
};

// ─── Scan Endpoints ────────────────────────────────────────────────────────────
export const scansApi = {
  verify: (query: string) =>
    post<ApiResponse<ScanResultDTO>>('/scans/verify', { query }),

  getRecent: () =>
    get<ApiResponse<ScanResultDTO[]>>('/scans/recent'),

  getMy: () =>
    get<ApiResponse<ScanResultDTO[]>>('/scans/my'),
};

// ─── Audit Endpoints ────────────────────────────────────────────────────────────
export const auditApi = {
  getLogs: () => get<ApiResponse<AuditLogDTO[]>>('/audit/logs'),
  clearLogs: () => del<ApiResponse<void>>('/audit/logs'),
  exportCsvUrl: () => `${BASE}/audit/export/csv`,
};

// ─── Reports Endpoints ──────────────────────────────────────────────────────────
export const reportsApi = {
  getSummary: () => get<ApiResponse<AdminSummaryDTO>>('/reports/summary'),
  getOccupancy: () => get<ApiResponse<unknown[]>>('/reports/occupancy'),
  getCategorySales: () => get<ApiResponse<unknown[]>>('/reports/category-sales'),
  getGateTelemetry: () => get<ApiResponse<unknown[]>>('/reports/gate-telemetry'),
};

// ─── Concurrency Lab Endpoints ─────────────────────────────────────────────────
export const concurrencyApi = {
  simulate: (req: ConcurrencySimRequest) =>
    post<ApiResponse<ConcurrencyRunResultDTO>>('/concurrency/simulate', req),

  sideBySide: (concurrencyLevel = 25, targetEventId?: string) =>
    post<ApiResponse<{ noLockResult: ConcurrencyRunResultDTO; twoPlResult: ConcurrencyRunResultDTO }>>(
      '/concurrency/side-by-side',
      { concurrencyLevel, targetEventId }
    ),

  getRuns: () =>
    get<ApiResponse<unknown[]>>('/concurrency/runs'),
};

// ─── Backend Health Check ──────────────────────────────────────────────────────
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/events`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
