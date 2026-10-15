import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  FestEvent,
  Seat,
  UserProfile,
  UserRole,
  EventCategory,
  Booking,
  ScanRecord,
  AuditLog,
  ConcurrencyRunResult,
  SideBySideRunResult,
  ConcurrencyStrategy,
} from '../types';
import {
  authApi,
  eventsApi,
  seatsApi,
  bookingsApi,
  scansApi,
  auditApi,
  concurrencyApi,
  getToken,
  setToken,
  clearToken,
  type EventDTO,
  type SeatDTO,
  type BookingDTO,
  type ScanResultDTO,
  type AuditLogDTO,
  type ConcurrencyRunResultDTO,
  type UserDTO,
} from '../services/api';

// ─── DTO → UI Domain Model Mappers ───────────────────────────────────────────

export function mapUserDTOtoUserProfile(u: UserDTO): UserProfile {
  return {
    id: u.id,
    name: u.name,
    regNumber: u.regNumber,
    email: u.email,
    role: (u.role.toLowerCase() as UserRole) || 'student',
    department: u.department || 'General',
    year: u.yearOfStudy || '3rd Year (B.Tech)',
    avatarSeed: u.avatarSeed || u.name.toLowerCase().split(' ')[0],
  };
}

export function mapSeatDTOtoSeat(s: SeatDTO): Seat {
  return {
    id: s.id,
    row: s.row,
    number: s.number,
    category: s.category as 'VIP_FRONT' | 'GOLD' | 'REGULAR',
    price: s.price,
    status: s.status as 'available' | 'selected' | 'locked' | 'booked',
    lockedBy: s.lockedBy ? {
      userId: s.lockedBy.userId,
      userName: s.lockedBy.userName,
      regNumber: s.lockedBy.regNumber,
    } : undefined,
    lockExpiresAt: s.lockExpiresAt ? new Date(s.lockExpiresAt).getTime() : undefined,
    bookedBy: s.bookedBy ? {
      userId: s.bookedBy.userId,
      userName: s.bookedBy.userName,
      regNumber: s.bookedBy.regNumber,
      bookingRef: s.bookedBy.bookingRef,
    } : undefined,
  };
}

export function mapEventDTOtoFestEvent(e: EventDTO): FestEvent {
  const seats = (e.seats || []).map(mapSeatDTOtoSeat);
  return {
    id: e.id,
    title: e.title,
    category: e.category as EventCategory,
    artistOrHost: e.artistOrHost,
    date: e.date,
    time: e.time,
    venue: e.venue,
    basePrice: e.basePrice,
    totalSeats: e.totalSeats,
    availableSeats: e.availableSeats,
    lockedSeatsCount: e.lockedSeatsCount,
    bookedSeatsCount: e.bookedSeatsCount,
    accentColor: e.accentColor,
    tag: e.tag || 'FESTIVAL SHOWCASE',
    shortDesc: e.shortDesc || '',
    ticketBgImage: e.ticketBgImage,
    seats,
    startTimestamp: e.startTimestamp ? new Date(e.startTimestamp).getTime() : undefined,
    endTimestamp: e.endTimestamp ? new Date(e.endTimestamp).getTime() : undefined,
  };
}

export function mapBookingDTOtoBooking(b: BookingDTO): Booking {
  return {
    id: b.id,
    bookingRef: b.bookingRef,
    eventId: b.eventId,
    eventTitle: b.eventTitle,
    eventCategory: b.eventCategory as EventCategory,
    artistOrHost: b.artistOrHost,
    eventDate: b.eventDate,
    eventTime: b.eventTime,
    eventVenue: b.eventVenue,
    seatId: b.seatId,
    seatLabel: b.seatLabel,
    seatCategory: b.seatCategory,
    studentName: b.studentName,
    regNumber: b.regNumber,
    department: b.department,
    amount: b.amount,
    paymentMethod: (b.paymentMethod as 'UPI' | 'CAMPUS_CARD' | 'NET_BANKING') || 'UPI',
    bookedAt: b.bookedAt ? new Date(b.bookedAt).getTime() : Date.now(),
    qrPayload: b.qrPayload,
    ticketBgImage: b.ticketBgImage,
    status: b.status,
    checkedInAt: b.checkedInAt ? new Date(b.checkedInAt).getTime() : undefined,
    checkedInBy: b.checkedInBy,
    startTimestamp: b.startTimestamp ? new Date(b.startTimestamp).getTime() : undefined,
    endTimestamp: b.endTimestamp ? new Date(b.endTimestamp).getTime() : undefined,
  };
}

export function mapScanDTOtoScanRecord(s: ScanResultDTO): ScanRecord {
  return {
    id: s.id,
    timestamp: s.timestamp ? new Date(s.timestamp).getTime() : Date.now(),
    query: s.query,
    result: s.result,
    staffMember: s.staffMember || { name: 'Gate Officer', staffId: 'GATE-01' },
    bookingId: s.bookingId,
    bookingRef: s.bookingRef,
    eventTitle: s.eventTitle,
    attendeeName: s.attendeeName,
    seatLabel: s.seatLabel,
    message: s.message,
    originalCheckedInAt: s.originalCheckedInAt ? new Date(s.originalCheckedInAt).getTime() : undefined,
    originalCheckedInBy: s.originalCheckedInBy,
  };
}

export function mapAuditLogDTOtoAuditLog(a: AuditLogDTO): AuditLog {
  const userName = a.userName || 'Anonymous';
  const resourceId = a.seatLabel ? `${a.eventTitle || 'Event'} (${a.seatLabel})` : (a.eventTitle || a.eventId || 'System');
  return {
    id: a.id,
    timestamp: a.timestamp ? new Date(a.timestamp).getTime() : Date.now(),
    action: a.action as any,
    eventId: a.eventId || 'SYSTEM',
    eventTitle: a.eventTitle || 'Vibrance Central Registry',
    seatLabel: a.seatLabel,
    userName,
    regNumber: a.regNumber || 'ANON',
    status: (a.status as any) || 'SUCCESS',
    details: a.details || '',
    protocol: a.protocol,
    user: userName,
    resourceId,
  };
}

export function mapConcurrencyDTOtoRunResult(c: ConcurrencyRunResultDTO): ConcurrencyRunResult {
  return {
    runId: c.runId,
    strategy: c.strategy as ConcurrencyStrategy,
    targetEventId: c.targetEventId,
    targetEventTitle: c.targetEventTitle,
    concurrencyLevel: c.concurrencyLevel,
    successfulCount: c.successfulCount,
    rejectedCount: c.rejectedCount,
    deadlockCount: c.deadlockCount,
    initialStock: c.initialStock,
    finalStock: c.finalStock,
    durationMs: c.durationMs,
    overbookingDetected: c.overbookingDetected,
    overbookedSeats: c.overbookedSeats,
    transactions: (c.transactions || []).map((t) => ({
      txId: t.txId,
      clientId: t.clientId,
      clientName: t.clientName,
      status: t.status as any,
      currentStep: t.currentStep,
      timestamp: t.timestamp ? new Date(t.timestamp).getTime() : Date.now(),
      latencyMs: t.latencyMs,
      seatClaimed: t.seatClaimed,
      message: t.message,
    })),
    dbLogs: c.dbLogs || [],
  };
}

// ─── Context Interface ────────────────────────────────────────────────────────

interface FestContextType {
  currentUser: UserProfile | null;
  loginAsStudent: (name?: string, regNumber?: string, dept?: string, year?: string) => Promise<void>;
  loginAsGateStaff: (name?: string, regNumber?: string, dept?: string) => Promise<void>;
  loginAsAdmin: (name?: string, regNumber?: string, dept?: string) => Promise<void>;
  login: (regNumber: string, password?: string) => Promise<UserProfile | null>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;

  users: UserProfile[];
  addUser: (userData: {
    name: string;
    regNumber: string;
    email?: string;
    role: UserRole;
    department: string;
    year?: string;
  }) => Promise<UserProfile | null>;
  deleteUser: (userId: string) => Promise<void>;

  events: FestEvent[];
  selectedEvent: FestEvent | null;
  setSelectedEvent: (event: FestEvent | null) => void;
  addEvent: (eventData: {
    title: string;
    category: EventCategory;
    artistOrHost: string;
    date: string;
    time: string;
    venue: string;
    basePrice: number;
    tag?: string;
    shortDesc?: string;
    ticketBgImage?: string;
    totalSeats?: number;
    startOffsetHours?: number;
  }) => Promise<FestEvent | null>;
  updateEvent: (updatedEvent: FestEvent) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;

  activeSeat: Seat | null;
  activeSeatEventId: string | null;
  seatLockTimeRemaining: number;
  selectSeatForBooking: (event: FestEvent, seat: Seat) => Promise<boolean>;
  releaseActiveSeat: () => Promise<void>;

  allBookings: Booking[];
  myBookings: Booking[];
  confirmBooking: (details: {
    name: string;
    regNumber: string;
    department: string;
    paymentMethod: 'UPI' | 'CAMPUS_CARD' | 'NET_BANKING';
  }) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => Promise<boolean>;

  scanHistory: ScanRecord[];
  clearScanHistory: () => void;
  verifyTicket: (query: string, staff: { name: string; staffId: string }) => Promise<ScanRecord>;

  auditLogs: AuditLog[];
  clearAuditLogs: () => Promise<void>;

  isSimulating: boolean;
  simulationProgress: number;
  lastSimResult: ConcurrencyRunResult | null;
  lastSideBySideResult: SideBySideRunResult | null;
  simHistory: ConcurrencyRunResult[];
  runConcurrencySimulation: (params: {
    strategy: ConcurrencyStrategy;
    concurrencyLevel: number;
    targetEventId: string;
    speedMs?: number;
  }) => Promise<ConcurrencyRunResult>;
  runSideBySideSimulation: (params: {
    concurrencyLevel: number;
    targetEventId: string;
  }) => Promise<SideBySideRunResult>;
  resetDatabaseState: () => Promise<void>;
}

const FestContext = createContext<FestContextType | undefined>(undefined);

// ─── Provider Implementation ──────────────────────────────────────────────────

export const FestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [events, setEvents] = useState<FestEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<FestEvent | null>(null);

  const [activeSeat, setActiveSeat] = useState<Seat | null>(null);
  const [activeSeatEventId, setActiveSeatEventId] = useState<string | null>(null);
  const [seatLockTimeRemaining, setSeatLockTimeRemaining] = useState<number>(0);

  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [lastSimResult, setLastSimResult] = useState<ConcurrencyRunResult | null>(null);
  const [lastSideBySideResult, setLastSideBySideResult] = useState<SideBySideRunResult | null>(null);
  const [simHistory, setSimHistory] = useState<ConcurrencyRunResult[]>([]);

  // ── 1. Fetch Events from Backend ───────────────────────────────────────────
  const refreshEvents = useCallback(async () => {
    try {
      const res = await eventsApi.getAll();
      if (res.success && res.data) {
        setEvents(res.data.map(mapEventDTOtoFestEvent));
      }
    } catch (err) {
      console.warn('[FestContext] Failed fetching events from database:', err);
    }
  }, []);

  // ── 2. Role-specific Data Fetchers ─────────────────────────────────────────
  const refreshBookings = useCallback(async (role?: UserRole) => {
    try {
      const activeRole = role || currentUser?.role;
      if (activeRole === 'student') {
        const res = await bookingsApi.getMyBookings();
        if (res.success && res.data) {
          setMyBookings(res.data.map(mapBookingDTOtoBooking));
        }
      } else if (activeRole === 'admin') {
        const [myRes, allRes] = await Promise.allSettled([
          bookingsApi.getMyBookings(),
          bookingsApi.getAllBookings(),
        ]);
        if (myRes.status === 'fulfilled' && myRes.value.success && myRes.value.data) {
          setMyBookings(myRes.value.data.map(mapBookingDTOtoBooking));
        }
        if (allRes.status === 'fulfilled' && allRes.value.success && allRes.value.data) {
          setAllBookings(allRes.value.data.map(mapBookingDTOtoBooking));
        }
      }
    } catch (err) {
      console.warn('[FestContext] Failed fetching bookings from database:', err);
    }
  }, [currentUser?.role]);

  const refreshScanHistory = useCallback(async () => {
    try {
      const res = await scansApi.getRecent();
      if (res.success && res.data) {
        setScanHistory(res.data.map(mapScanDTOtoScanRecord));
      }
    } catch (err) {
      console.warn('[FestContext] Failed fetching scan telemetry:', err);
    }
  }, []);

  const refreshAuditLogs = useCallback(async () => {
    try {
      const res = await auditApi.getLogs();
      if (res.success && res.data) {
        setAuditLogs(res.data.map(mapAuditLogDTOtoAuditLog));
      }
    } catch (err) {
      console.warn('[FestContext] Failed fetching audit logs:', err);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    try {
      const res = await authApi.getAllUsers();
      if (res.success && res.data) {
        setUsers(res.data.map(mapUserDTOtoUserProfile));
      }
    } catch (err) {
      console.warn('[FestContext] Failed fetching user registry:', err);
    }
  }, []);

  const loadUserData = useCallback(async (profile: UserProfile) => {
    if (profile.role === 'student') {
      await refreshBookings('student');
    } else if (profile.role === 'gate_staff') {
      await refreshScanHistory();
    } else if (profile.role === 'admin') {
      await Promise.allSettled([
        refreshBookings('admin'),
        refreshScanHistory(),
        refreshAuditLogs(),
        refreshUsers(),
      ]);
    }
  }, [refreshBookings, refreshScanHistory, refreshAuditLogs, refreshUsers]);

  // ── 3. App Mount: Validate Token & Load Database ───────────────────────────
  useEffect(() => {
    let mounted = true;

    async function init() {
      // Load events catalog from PostgreSQL
      try {
        const res = await eventsApi.getAll();
        if (mounted && res.success && res.data) {
          setEvents(res.data.map(mapEventDTOtoFestEvent));
        }
      } catch (err) {
        console.warn('[FestContext] Initial event fetch failed:', err);
      }

      // Validate session if JWT token exists
      const token = getToken();
      if (token) {
        try {
          const meRes = await authApi.me();
          if (mounted && meRes.success && meRes.data) {
            const profile = mapUserDTOtoUserProfile(meRes.data);
            setCurrentUser(profile);
            loadUserData(profile);
          } else {
            clearToken();
            if (mounted) setCurrentUser(null);
          }
        } catch {
          clearToken();
          if (mounted) setCurrentUser(null);
        }
      }
    }

    init();
    return () => { mounted = false; };
  }, [loadUserData]);

  // ── 4. Periodic Background Refresh (Polling every 10s) ──────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      refreshEvents();
      if (currentUser?.role === 'admin') {
        refreshAuditLogs();
      } else if (currentUser?.role === 'gate_staff') {
        refreshScanHistory();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [currentUser?.role, refreshEvents, refreshAuditLogs, refreshScanHistory]);

  // ── 5. Live Seat Hold Countdown Timer ──────────────────────────────────────
  useEffect(() => {
    if (!activeSeat || !activeSeat.lockExpiresAt) {
      setSeatLockTimeRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((activeSeat.lockExpiresAt! - now) / 1000));
      setSeatLockTimeRemaining(remaining);
      if (remaining === 0) {
        releaseActiveSeat();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSeat]);

  // ── 6. Auth Handlers (Real Backend API Authentications) ───────────────────
  const loginAsStudent = async (
    name = 'Rahul Sharma',
    regNumber = 'RA2111003010142',
    dept = 'Computer Science & Engineering',
    year = '3rd Year (B.Tech)'
  ) => {
    try {
      const res = await authApi.login(regNumber, 'vibrance2026', 'student', name, dept);
      if (res.success && res.data) {
        setToken(res.data.token);
        const profile = mapUserDTOtoUserProfile(res.data.user);
        setCurrentUser(profile);
        await loadUserData(profile);
      }
    } catch (err) {
      console.error('[FestContext] Student authentication failed:', err);
      throw err;
    }
  };

  const loginAsGateStaff = async (
    name = 'Officer Rajesh Menon',
    regNumber = 'STF-GATE-04',
    dept = 'Main Gate Security Post A'
  ) => {
    try {
      const res = await authApi.login(regNumber, 'vibrance2026', 'gate_staff', name, dept);
      if (res.success && res.data) {
        setToken(res.data.token);
        const profile = mapUserDTOtoUserProfile(res.data.user);
        setCurrentUser(profile);
        await loadUserData(profile);
      }
    } catch (err) {
      console.error('[FestContext] Gate staff authentication failed:', err);
      throw err;
    }
  };

  const loginAsAdmin = async (
    name = 'Dr. Vikramaditya Rao',
    regNumber = 'ADMIN-FACULTY-01',
    dept = 'DBMS Lab Coordinator & Event Controller'
  ) => {
    try {
      const res = await authApi.login(regNumber, 'vibrance2026', 'admin', name, dept);
      if (res.success && res.data) {
        setToken(res.data.token);
        const profile = mapUserDTOtoUserProfile(res.data.user);
        setCurrentUser(profile);
        await loadUserData(profile);
      }
    } catch (err) {
      console.error('[FestContext] Admin authentication failed:', err);
      throw err;
    }
  };

  const login = async (regNumber: string, password?: string): Promise<UserProfile | null> => {
    try {
      const res = await authApi.login(regNumber, password);
      if (res.success && res.data) {
        setToken(res.data.token);
        const profile = mapUserDTOtoUserProfile(res.data.user);
        setCurrentUser(profile);
        await loadUserData(profile);
        return profile;
      }
    } catch (err) {
      console.error('[FestContext] Login failed:', err);
      throw err;
    }
    return null;
  };

  const logout = () => {
    clearToken();
    setCurrentUser(null);
    setMyBookings([]);
    setAllBookings([]);
    setAuditLogs([]);
    setScanHistory([]);
    setActiveSeat(null);
    setActiveSeatEventId(null);
    setSeatLockTimeRemaining(0);
  };

  const switchRole = async (targetRole: UserRole) => {
    const roleLower = targetRole.toLowerCase();
    if (roleLower.includes('admin')) {
      await loginAsAdmin();
    } else if (roleLower.includes('gate') || roleLower.includes('staff')) {
      await loginAsGateStaff();
    } else {
      await loginAsStudent();
    }
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...profile } : null));
  };

  // ── 7. Strict 2PL Seat Reservation (Acquired at Checkout) ──────────────────
  const selectSeatForBooking = async (event: FestEvent, seat: Seat): Promise<boolean> => {
    if (!currentUser) return false;

    try {
      const res = await seatsApi.lockSeat(seat.id, 180);
      if (res.success && res.data && res.data.success) {
        const expiresAt = res.data.lockExpiresAt
          ? (typeof res.data.lockExpiresAt === 'number'
              ? res.data.lockExpiresAt
              : new Date(res.data.lockExpiresAt).getTime())
          : Date.now() + 180000;

        const updatedSeat: Seat = {
          ...seat,
          status: 'locked',
          lockedBy: {
            userId: currentUser.id,
            userName: currentUser.name,
            regNumber: currentUser.regNumber,
          },
          lockExpiresAt: expiresAt,
        };

        setActiveSeat(updatedSeat);
        setActiveSeatEventId(event.id);
        setSeatLockTimeRemaining(180);

        // Update local event seat matrix immediately
        setEvents((prev) =>
          prev.map((e) => {
            if (e.id !== event.id) return e;
            const newSeats = e.seats.map((s) => (s.id === seat.id ? updatedSeat : s));
            return {
              ...e,
              seats: newSeats,
              availableSeats: newSeats.filter((s) => s.status === 'available').length,
              lockedSeatsCount: newSeats.filter((s) => s.status === 'locked').length,
            };
          })
        );
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[FestContext] Strict 2PL seat lock rejected by database:', err);
      await refreshEvents();
      return false;
    }
  };

  const releaseActiveSeat = async (): Promise<void> => {
    if (!activeSeat || !activeSeatEventId) return;
    const seatId = activeSeat.id;
    const eventId = activeSeatEventId;

    setActiveSeat(null);
    setActiveSeatEventId(null);
    setSeatLockTimeRemaining(0);

    try {
      await seatsApi.releaseSeat(seatId);
      await refreshEvents();
    } catch (err) {
      console.warn('[FestContext] Release seat lock error:', err);
    }
  };

  // ── 8. ACID Booking Creation & Cancellation ────────────────────────────────
  const confirmBooking = async (details: {
    name: string;
    regNumber: string;
    department: string;
    paymentMethod: 'UPI' | 'CAMPUS_CARD' | 'NET_BANKING';
  }): Promise<Booking | null> => {
    if (!activeSeat || !activeSeatEventId || !currentUser) return null;
    const event = events.find((e) => e.id === activeSeatEventId) || selectedEvent;
    if (!event) return null;

    try {
      const res = await bookingsApi.create({
        eventId: event.id,
        seatId: activeSeat.id,
        name: details.name,
        regNumber: details.regNumber,
        department: details.department,
        paymentMethod: details.paymentMethod,
      });

      if (res.success && res.data) {
        const newBooking = mapBookingDTOtoBooking(res.data);
        setActiveSeat(null);
        setActiveSeatEventId(null);
        setSeatLockTimeRemaining(0);

        setMyBookings((prev) => [newBooking, ...prev]);
        setAllBookings((prev) => [newBooking, ...prev]);
        await refreshEvents();

        if (currentUser.role === 'admin') {
          await refreshAuditLogs();
        }
        return newBooking;
      }
    } catch (err: any) {
      console.error('[FestContext] ACID booking failed:', err);
      await refreshEvents();
      throw err;
    }
    return null;
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      await bookingsApi.cancel(bookingId);
      setMyBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)));
      setAllBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)));
      await refreshEvents();
      return true;
    } catch (err) {
      console.error('[FestContext] Cancel booking error:', err);
      return false;
    }
  };

  // ── 9. Gatekeeper QR Scan & Admission ──────────────────────────────────────
  const verifyTicket = async (query: string, staff: { name: string; staffId: string }): Promise<ScanRecord> => {
    try {
      const res = await scansApi.verify(query);
      if (res.success && res.data) {
        const record = mapScanDTOtoScanRecord(res.data);
        record.staffMember = staff;
        setScanHistory((prev) => [record, ...prev]);
        await refreshBookings();
        return record;
      }
    } catch (err) {
      console.error('[FestContext] QR Verification error:', err);
    }

    const fallbackRecord: ScanRecord = {
      id: `scan-${Date.now()}`,
      timestamp: Date.now(),
      query,
      result: 'INVALID',
      staffMember: staff,
      message: 'Pass not recognized in festival registry.',
    };
    setScanHistory((prev) => [fallbackRecord, ...prev]);
    return fallbackRecord;
  };

  const clearScanHistory = () => {
    setScanHistory([]);
  };

  // ── 10. Admin Audit Logs ───────────────────────────────────────────────────
  const clearAuditLogs = async (): Promise<void> => {
    try {
      await auditApi.clearLogs();
      setAuditLogs([]);
    } catch (err) {
      console.error('[FestContext] Clear audit logs error:', err);
    }
  };

  // ── 11. Real Server-Side Multi-Threaded Concurrency Simulator ─────────────
  const runConcurrencySimulation = async (params: {
    strategy: ConcurrencyStrategy;
    concurrencyLevel: number;
    targetEventId: string;
    speedMs?: number;
  }): Promise<ConcurrencyRunResult> => {
    setIsSimulating(true);
    setSimulationProgress(25);
    try {
      setSimulationProgress(50);
      const res = await concurrencyApi.simulate({
        strategy: params.strategy,
        concurrencyLevel: params.concurrencyLevel,
        targetEventId: params.targetEventId,
      });
      setSimulationProgress(100);
      if (res.success && res.data) {
        const mapped = mapConcurrencyDTOtoRunResult(res.data);
        setLastSimResult(mapped);
        setSimHistory((prev) => [mapped, ...prev.slice(0, 19)]);
        setIsSimulating(false);
        await refreshEvents();
        return mapped;
      }
    } catch (err) {
      console.error('[FestContext] Concurrency simulation error:', err);
    }
    setIsSimulating(false);
    throw new Error('Concurrency simulation failed on backend server.');
  };

  const runSideBySideSimulation = async (params: {
    concurrencyLevel: number;
    targetEventId: string;
  }): Promise<SideBySideRunResult> => {
    setIsSimulating(true);
    setSimulationProgress(25);
    try {
      const res = await concurrencyApi.sideBySide(params.concurrencyLevel, params.targetEventId);
      setSimulationProgress(100);
      if (res.success && res.data) {
        const result: SideBySideRunResult = {
          noLockResult: mapConcurrencyDTOtoRunResult(res.data.noLockResult),
          twoPlResult: mapConcurrencyDTOtoRunResult(res.data.twoPlResult),
        };
        setLastSideBySideResult(result);
        setIsSimulating(false);
        await refreshEvents();
        return result;
      }
    } catch (err) {
      console.error('[FestContext] Side-by-side benchmark error:', err);
    }
    setIsSimulating(false);
    throw new Error('Side-by-side benchmark failed on backend server.');
  };

  // ── 12. User Management CRUD ───────────────────────────────────────────────
  const addUser = async (userData: {
    name: string;
    regNumber: string;
    email?: string;
    role: UserRole;
    department: string;
    year?: string;
  }): Promise<UserProfile | null> => {
    try {
      const res = await authApi.register({
        regNumber: userData.regNumber,
        name: userData.name,
        email: userData.email || `${userData.regNumber.toLowerCase()}@vibrance.edu`,
        role: userData.role,
        department: userData.department,
        yearOfStudy: userData.year || '3rd Year (B.Tech)',
      });
      if (res.success && res.data) {
        const profile = mapUserDTOtoUserProfile(res.data.user);
        setUsers((prev) => [profile, ...prev]);
        return profile;
      }
    } catch (err) {
      console.error('[FestContext] Create user error:', err);
    }
    return null;
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      await authApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error('[FestContext] Delete user error:', err);
    }
  };

  // ── 13. Event Management CRUD ──────────────────────────────────────────────
  const addEvent = async (eventData: any): Promise<FestEvent | null> => {
    try {
      const res = await eventsApi.create(eventData);
      if (res.success && res.data) {
        const newEvent = mapEventDTOtoFestEvent(res.data);
        setEvents((prev) => [newEvent, ...prev]);
        return newEvent;
      }
    } catch (err) {
      console.error('[FestContext] Create event error:', err);
    }
    return null;
  };

  const updateEvent = async (updatedEvent: FestEvent): Promise<void> => {
    try {
      await eventsApi.update(updatedEvent.id, updatedEvent as any);
      setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
      if (selectedEvent?.id === updatedEvent.id) {
        setSelectedEvent(updatedEvent);
      }
    } catch (err) {
      console.error('[FestContext] Update event error:', err);
    }
  };

  const deleteEvent = async (eventId: string): Promise<void> => {
    try {
      await eventsApi.delete(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
    } catch (err) {
      console.error('[FestContext] Delete event error:', err);
    }
  };

  const resetDatabaseState = async (): Promise<void> => {
    await refreshEvents();
    if (currentUser?.role === 'admin') {
      await loadUserData(currentUser);
    }
  };

  return (
    <FestContext.Provider
      value={{
        currentUser,
        loginAsStudent,
        loginAsGateStaff,
        loginAsAdmin,
        login,
        logout,
        switchRole,
        updateProfile,

        users,
        addUser,
        deleteUser,

        events,
        selectedEvent,
        setSelectedEvent,
        addEvent,
        updateEvent,
        deleteEvent,

        activeSeat,
        activeSeatEventId,
        seatLockTimeRemaining,
        selectSeatForBooking,
        releaseActiveSeat,

        allBookings,
        myBookings,
        confirmBooking,
        cancelBooking,

        scanHistory,
        clearScanHistory,
        verifyTicket,

        auditLogs,
        clearAuditLogs,

        isSimulating,
        simulationProgress,
        lastSimResult,
        lastSideBySideResult,
        simHistory,
        runConcurrencySimulation,
        runSideBySideSimulation,
        resetDatabaseState,
      }}
    >
      {children}
    </FestContext.Provider>
  );
};

export const useFest = (): FestContextType => {
  const context = useContext(FestContext);
  if (!context) {
    throw new Error('useFest must be used within a FestProvider');
  }
  return context;
};
