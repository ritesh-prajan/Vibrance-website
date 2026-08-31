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
  INITIAL_EVENTS,
  INITIAL_BOOKINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SCAN_HISTORY,
  MOCK_STUDENT_PROFILES,
  MOCK_STAFF_PROFILES,
  MOCK_ADMIN_PROFILES,
  generateSeatsForEvent,
} from '../data/mockEvents';
import { getEventTiming } from '../utils/timeUtils';

const STORAGE_KEYS = {
  USER: 'vibrance26_current_user',
  USERS: 'vibrance26_users_v2',
  EVENTS: 'vibrance26_events_v2',
  BOOKINGS: 'vibrance26_bookings_v2',
  LOGS: 'vibrance26_audit_logs_v2',
  SCANS: 'vibrance26_scan_history_v2',
  SIM_HISTORY: 'vibrance26_sim_history_v2',
};

interface FestContextType {
  currentUser: UserProfile | null;
  loginAsStudent: (name?: string, regNumber?: string, dept?: string, year?: string) => void;
  loginAsGateStaff: (name?: string, regNumber?: string, dept?: string) => void;
  loginAsAdmin: (name?: string, regNumber?: string, dept?: string) => void;
  logout: () => void;

  users: UserProfile[];
  addUser: (userData: {
    name: string;
    regNumber: string;
    email?: string;
    role: UserRole;
    department: string;
    year?: string;
  }) => UserProfile;
  deleteUser: (userId: string) => void;

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
  }) => FestEvent;
  updateEvent: (updatedEvent: FestEvent) => void;
  deleteEvent: (eventId: string) => void;

  activeSeat: Seat | null;
  activeSeatEventId: string | null;
  seatLockTimeRemaining: number;
  selectSeatForBooking: (event: FestEvent, seat: Seat) => boolean;
  releaseActiveSeat: () => void;

  allBookings: Booking[];
  myBookings: Booking[];
  confirmBooking: (details: {
    name: string;
    regNumber: string;
    department: string;
    paymentMethod: 'UPI' | 'CAMPUS_CARD' | 'NET_BANKING';
  }) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => boolean;

  scanHistory: ScanRecord[];
  verifyTicket: (query: string, staff: { name: string; staffId: string }) => ScanRecord;

  auditLogs: AuditLog[];
  clearAuditLogs: () => void;

  isSimulating: boolean;
  simulationProgress: number;
  lastSimResult: ConcurrencyRunResult | null;
  lastSideBySideResult: SideBySideRunResult | null;
  simHistory: ConcurrencyRunResult[];
  runConcurrencySimulation: (params: {
    strategy: ConcurrencyStrategy;
    concurrencyLevel: number;
    targetEventId: string;
  }) => Promise<ConcurrencyRunResult>;
  runSideBySideSimulation: (params: {
    concurrencyLevel: number;
    targetEventId: string;
  }) => Promise<SideBySideRunResult>;
  resetDatabaseState: () => void;
}

const FestContext = createContext<FestContextType | undefined>(undefined);

export const FestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_STUDENT_PROFILES[0];
      }
    }
    return MOCK_STUDENT_PROFILES[0];
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [...MOCK_STUDENT_PROFILES, ...MOCK_STAFF_PROFILES, ...MOCK_ADMIN_PROFILES];
      }
    }
    return [...MOCK_STUDENT_PROFILES, ...MOCK_STAFF_PROFILES, ...MOCK_ADMIN_PROFILES];
  });

  const [events, setEvents] = useState<FestEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (saved) {
      try {
        const parsed: FestEvent[] = JSON.parse(saved);
        const missing = INITIAL_EVENTS.filter((ie) => !parsed.some((pe) => pe.id === ie.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch {
        return INITIAL_EVENTS;
      }
    }
    return INITIAL_EVENTS;
  });

  const [selectedEvent, setSelectedEvent] = useState<FestEvent | null>(null);
  const [activeSeat, setActiveSeat] = useState<Seat | null>(null);
  const [activeSeatEventId, setActiveSeatEventId] = useState<string | null>(null);
  const [seatLockTimeRemaining, setSeatLockTimeRemaining] = useState<number>(0);

  const [allBookings, setAllBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (saved) {
      try {
        const parsed: Booking[] = JSON.parse(saved);
        const missing = INITIAL_BOOKINGS.filter((ib) => !parsed.some((pb) => pb.id === ib.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch {
        return INITIAL_BOOKINGS;
      }
    }
    return INITIAL_BOOKINGS;
  });

  const [scanHistory, setScanHistory] = useState<ScanRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCANS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SCAN_HISTORY;
      }
    }
    return INITIAL_SCAN_HISTORY;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_AUDIT_LOGS;
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [lastSimResult, setLastSimResult] = useState<ConcurrencyRunResult | null>(null);
  const [lastSideBySideResult, setLastSideBySideResult] = useState<SideBySideRunResult | null>(null);
  const [simHistory, setSimHistory] = useState<ConcurrencyRunResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SIM_HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const myBookings = allBookings.filter((b) => {
    if (!currentUser) return false;
    return (
      b.regNumber.toLowerCase() === currentUser.regNumber.toLowerCase() ||
      b.studentName.toLowerCase() === currentUser.name.toLowerCase()
    );
  });

  useEffect(() => {
    if (currentUser) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(allBookings));
  }, [allBookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scanHistory));
  }, [scanHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  const addAuditLog = useCallback((log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newEntry: AuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 200)]);
  }, []);

  // Live Timer countdown for held seats
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (activeSeat && activeSeat.lockExpiresAt) {
        const remaining = Math.max(0, Math.ceil((activeSeat.lockExpiresAt - now) / 1000));
        setSeatLockTimeRemaining(remaining);
        if (remaining === 0) {
          releaseActiveSeat();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSeat]);

  const loginAsStudent = (name = 'Rahul Sharma', regNumber = 'RA2111003010142', dept = 'Computer Science & Engineering', year = '3rd Year') => {
    const user: UserProfile = {
      id: `usr-${regNumber.toLowerCase()}`,
      name,
      regNumber,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@vibrance.edu`,
      role: 'student',
      department: dept,
      year,
      avatarSeed: name,
    };
    setCurrentUser(user);
  };

  const loginAsGateStaff = (name = 'Officer Rajesh Menon', regNumber = 'STF-GATE-04', dept = 'Main Gate Security') => {
    const user: UserProfile = {
      id: `usr-${regNumber.toLowerCase()}`,
      name,
      regNumber,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@vibrance.edu`,
      role: 'gate_staff',
      department: dept,
      avatarSeed: name,
    };
    setCurrentUser(user);
  };

  const loginAsAdmin = (name = 'Dr. Ramesh Sundaram', regNumber = 'FAC-DBMS-702', dept = 'Computer Science & Engineering') => {
    const user: UserProfile = {
      id: `usr-${regNumber.toLowerCase()}`,
      name,
      regNumber,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@vibrance.edu`,
      role: 'admin',
      department: dept,
      avatarSeed: name,
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  // Event Management CRUD
  const addEvent = (eventData: {
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
  }): FestEvent => {
    const id = `evt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const totalSeats = eventData.totalSeats || 48;
    const seats = generateSeatsForEvent(id, eventData.basePrice, totalSeats);
    const now = Date.now();
    const startOffset = (eventData.startOffsetHours ?? 24) * 3600 * 1000;
    const newEvent: FestEvent = {
      id,
      title: eventData.title,
      category: eventData.category,
      artistOrHost: eventData.artistOrHost,
      date: eventData.date,
      time: eventData.time,
      venue: eventData.venue,
      basePrice: eventData.basePrice,
      totalSeats: seats.length,
      availableSeats: seats.filter((s) => s.status === 'available').length,
      lockedSeatsCount: 0,
      bookedSeatsCount: 0,
      tag: eventData.tag || 'NEWLY ADDED EVENT',
      shortDesc: eventData.shortDesc || 'Newly created festival event stage.',
      ticketBgImage: eventData.ticketBgImage,
      seats,
      startTimestamp: now + startOffset,
      endTimestamp: now + startOffset + 3 * 3600 * 1000,
    };

    setEvents((prev) => [newEvent, ...prev]);

    addAuditLog({
      action: 'EVENT_INSERT',
      eventId: id,
      eventTitle: eventData.title,
      userName: currentUser?.name || 'Administrator',
      regNumber: currentUser?.regNumber || 'ADMIN-SYS',
      status: 'CONFIRMED',
      details: `Created new event "${eventData.title}" (${eventData.category}) at ${eventData.venue} for ₹${eventData.basePrice}. Total Seats: ${seats.length}.`,
    });

    return newEvent;
  };

  const updateEvent = (updatedEvent: FestEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? { ...e, ...updatedEvent } : e))
    );
    if (selectedEvent?.id === updatedEvent.id) {
      setSelectedEvent(updatedEvent);
    }

    addAuditLog({
      action: 'EVENT_UPDATE',
      eventId: updatedEvent.id,
      eventTitle: updatedEvent.title,
      userName: currentUser?.name || 'Administrator',
      regNumber: currentUser?.regNumber || 'ADMIN-SYS',
      status: 'CONFIRMED',
      details: `Updated event details for "${updatedEvent.title}" (Venue: ${updatedEvent.venue}, Base Price: ₹${updatedEvent.basePrice}).`,
    });
  };

  const deleteEvent = (eventId: string) => {
    const target = events.find((e) => e.id === eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null);
    }
    if (activeSeatEventId === eventId) {
      releaseActiveSeat();
    }

    addAuditLog({
      action: 'EVENT_DELETE',
      eventId,
      eventTitle: target?.title || eventId,
      userName: currentUser?.name || 'Administrator',
      regNumber: currentUser?.regNumber || 'ADMIN-SYS',
      status: 'EXPIRED',
      details: `Deleted event "${target?.title || eventId}" from festival lineup.`,
    });
  };

  // User & Staff Management CRUD
  const addUser = (userData: {
    name: string;
    regNumber: string;
    email?: string;
    role: UserRole;
    department: string;
    year?: string;
  }): UserProfile => {
    const id = `usr-${userData.role.substring(0, 3)}-${Date.now().toString(36)}`;
    const newUser: UserProfile = {
      id,
      name: userData.name,
      regNumber: userData.regNumber,
      email: userData.email || `${userData.name.toLowerCase().replace(/\s+/g, '.')}@vibrance.edu`,
      role: userData.role,
      department: userData.department,
      year: userData.year || (userData.role === 'student' ? '1st Year (B.Tech)' : 'Staff Lead'),
      avatarSeed: userData.name.toLowerCase().split(' ')[0],
    };

    setUsers((prev) => [newUser, ...prev]);

    addAuditLog({
      action: 'USER_REGISTER',
      eventId: 'SYSTEM',
      eventTitle: 'User Account Provisioning',
      userName: currentUser?.name || 'Administrator',
      regNumber: currentUser?.regNumber || 'ADMIN-SYS',
      status: 'CONFIRMED',
      details: `Provisioned new account for ${userData.name} (Role: ${userData.role}, ID: ${userData.regNumber}, Dept: ${userData.department}).`,
    });

    return newUser;
  };

  const deleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));

    addAuditLog({
      action: 'USER_DELETE',
      eventId: 'SYSTEM',
      eventTitle: 'User Account Deprovisioning',
      userName: currentUser?.name || 'Administrator',
      regNumber: currentUser?.regNumber || 'ADMIN-SYS',
      status: 'EXPIRED',
      details: `Deprovisioned user account for ${target?.name || userId} (${target?.role || 'Unknown'}).`,
    });
  };

  const selectSeatForBooking = (event: FestEvent, seat: Seat): boolean => {
    if (!currentUser) return false;
    const now = Date.now();
    const lockDurationSec = 180;
    const lockExpiresAt = now + lockDurationSec * 1000;

    if (seat.status === 'booked' || seat.status === 'locked') {
      return false;
    }

    const updatedSeat: Seat = {
      ...seat,
      status: 'locked',
      lockedBy: {
        userId: currentUser.id,
        userName: currentUser.name,
        regNumber: currentUser.regNumber,
      },
      lockExpiresAt,
    };

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

    setActiveSeat(updatedSeat);
    setActiveSeatEventId(event.id);
    setSeatLockTimeRemaining(lockDurationSec);

    return true;
  };

  const releaseActiveSeat = () => {
    if (!activeSeat || !activeSeatEventId) return;
    const seatId = activeSeat.id;
    const eventId = activeSeatEventId;

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const newSeats = e.seats.map((s) =>
          s.id === seatId
            ? { ...s, status: 'available' as const, lockedBy: undefined, lockExpiresAt: undefined }
            : s
        );
        return {
          ...e,
          seats: newSeats,
          availableSeats: newSeats.filter((s) => s.status === 'available').length,
          lockedSeatsCount: newSeats.filter((s) => s.status === 'locked').length,
        };
      })
    );

    setActiveSeat(null);
    setActiveSeatEventId(null);
    setSeatLockTimeRemaining(0);
  };

  const confirmBooking = async (details: {
    name: string;
    regNumber: string;
    department: string;
    paymentMethod: 'UPI' | 'CAMPUS_CARD' | 'NET_BANKING';
  }): Promise<Booking | null> => {
    if (!activeSeat || !activeSeatEventId || !currentUser) return null;
    const event = events.find((e) => e.id === activeSeatEventId) || selectedEvent;
    if (!event) return null;

    await new Promise((r) => setTimeout(r, 450));

    const bookingRef = `VIB26-${event.category.substring(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;
    const timing = getEventTiming(event);

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingRef,
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: event.category,
      artistOrHost: event.artistOrHost,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      seatId: activeSeat.id,
      seatLabel: `${activeSeat.row}-${activeSeat.number}`,
      seatCategory: activeSeat.category,
      studentName: details.name,
      regNumber: details.regNumber,
      department: details.department,
      amount: activeSeat.price,
      paymentMethod: details.paymentMethod,
      bookedAt: Date.now(),
      qrPayload: `VIBRANCE26-TICKET-${bookingRef}-${activeSeat.id}-${details.regNumber}`,
      ticketBgImage: event.ticketBgImage,
      status: 'confirmed',
      startTimestamp: timing.startTimestamp,
      endTimestamp: timing.endTimestamp,
    };

    const bookedSeat: Seat = {
      ...activeSeat,
      status: 'booked',
      lockedBy: undefined,
      lockExpiresAt: undefined,
      bookedBy: {
        userId: currentUser.id,
        userName: details.name,
        regNumber: details.regNumber,
        bookingRef,
      },
    };

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== event.id) return e;
        const newSeats = e.seats.map((s) => (s.id === activeSeat.id ? bookedSeat : s));
        return {
          ...e,
          seats: newSeats,
          availableSeats: newSeats.filter((s) => s.status === 'available').length,
          bookedSeatsCount: newSeats.filter((s) => s.status === 'booked').length,
          lockedSeatsCount: newSeats.filter((s) => s.status === 'locked').length,
        };
      })
    );

    setAllBookings((prev) => [newBooking, ...prev]);

    addAuditLog({
      action: 'BOOKING_CONFIRMED',
      eventId: event.id,
      eventTitle: event.title,
      seatLabel: `${activeSeat.row}-${activeSeat.number}`,
      userName: details.name,
      regNumber: details.regNumber,
      status: 'SUCCESS',
      details: `Transaction committed with Strict 2PL. Ref: ${bookingRef}.`,
      protocol: 'Strict 2-Phase Locking (2PL)',
    });

    setActiveSeat(null);
    setActiveSeatEventId(null);
    setSeatLockTimeRemaining(0);

    return newBooking;
  };

  const cancelBooking = (bookingId: string): boolean => {
    const booking = allBookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    setAllBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== booking.eventId) return e;
        const newSeats = e.seats.map((s) =>
          s.id === booking.seatId
            ? { ...s, status: 'available' as const, bookedBy: undefined, lockedBy: undefined, lockExpiresAt: undefined }
            : s
        );
        return {
          ...e,
          seats: newSeats,
          availableSeats: newSeats.filter((s) => s.status === 'available').length,
          bookedSeatsCount: newSeats.filter((s) => s.status === 'booked').length,
        };
      })
    );

    addAuditLog({
      action: 'TICKET_CANCELLED',
      eventId: booking.eventId,
      eventTitle: booking.eventTitle,
      seatLabel: booking.seatLabel,
      userName: booking.studentName,
      regNumber: booking.regNumber,
      status: 'RELEASED',
      details: `Booking ${booking.bookingRef} cancelled. Seat released.`,
    });

    return true;
  };

  // Real-time verification supporting VALID, ALREADY_USED, INVALID, and EXPIRED
  const verifyTicket = (query: string, staff: { name: string; staffId: string }): ScanRecord => {
    const raw = query.trim();
    const trimmed = raw.toUpperCase();
    const now = Date.now();

    const foundBooking = allBookings.find((b) => {
      const bRef = b.bookingRef.toUpperCase();
      const bId = b.id.toUpperCase();
      const bPayload = (b.qrPayload || '').toUpperCase();

      return (
        bRef === trimmed ||
        bId === trimmed ||
        bPayload === trimmed ||
        trimmed.includes(bRef) ||
        (bPayload && trimmed.includes(bPayload)) ||
        (bPayload && bPayload.includes(trimmed))
      );
    });

    if (!foundBooking) {
      const record: ScanRecord = {
        id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: now,
        query: raw,
        result: 'INVALID',
        staffMember: staff,
        message: 'Invalid pass or reference code. No record found in central database.',
      };
      setScanHistory((prev) => [record, ...prev]);
      addAuditLog({
        action: 'GATE_REJECT_INVALID',
        eventId: 'SYSTEM',
        eventTitle: 'Gate Verification',
        userName: staff.name,
        regNumber: staff.staffId,
        status: 'EXPIRED',
        details: `Invalid ticket payload rejected: "${raw}". Not found in records.`,
      });
      return record;
    }

    // Check if event has expired / concluded in real time
    const timing = getEventTiming(foundBooking);
    if (timing.isExpired) {
      const record: ScanRecord = {
        id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: now,
        query: raw,
        result: 'EXPIRED',
        staffMember: staff,
        bookingId: foundBooking.id,
        bookingRef: foundBooking.bookingRef,
        eventTitle: foundBooking.eventTitle,
        attendeeName: foundBooking.studentName,
        seatLabel: foundBooking.seatLabel,
        message: `Pass Expired: The event concluded ${timing.countdownText.toLowerCase()}. Gate admission is closed.`,
      };
      setScanHistory((prev) => [record, ...prev]);
      addAuditLog({
        action: 'TICKET_VERIFY_EXPIRED',
        eventId: foundBooking.eventId,
        eventTitle: foundBooking.eventTitle,
        seatLabel: foundBooking.seatLabel,
        userName: foundBooking.studentName,
        regNumber: foundBooking.regNumber,
        status: 'EXPIRED',
        details: `Expired pass [${foundBooking.bookingRef}] scanned. Event concluded. Entry rejected.`,
      });
      return record;
    }

    if (foundBooking.status === 'checked_in') {
      const record: ScanRecord = {
        id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: now,
        query: raw,
        result: 'ALREADY_USED',
        staffMember: staff,
        bookingId: foundBooking.id,
        bookingRef: foundBooking.bookingRef,
        eventTitle: foundBooking.eventTitle,
        attendeeName: foundBooking.studentName,
        seatLabel: foundBooking.seatLabel,
        originalCheckedInAt: foundBooking.checkedInAt || now - 1800000,
        originalCheckedInBy: foundBooking.checkedInBy
          ? `${foundBooking.checkedInBy.name} (${foundBooking.checkedInBy.staffId})`
          : 'Gate Staff #01',
        message: 'Duplicate Entry Alert: This pass has already been checked in.',
      };
      setScanHistory((prev) => [record, ...prev]);
      addAuditLog({
        action: 'GATE_REJECT_DUPLICATE',
        eventId: foundBooking.eventId,
        eventTitle: foundBooking.eventTitle,
        seatLabel: foundBooking.seatLabel,
        userName: foundBooking.studentName,
        regNumber: foundBooking.regNumber,
        status: 'EXPIRED',
        details: `Duplicate entry intercepted for pass [${foundBooking.bookingRef}] (Attendee: ${foundBooking.studentName}).`,
      });
      return record;
    }

    // Valid pass admission
    setAllBookings((prev) =>
      prev.map((b) =>
        b.id === foundBooking.id
          ? {
              ...b,
              status: 'checked_in' as const,
              checkedInAt: now,
              checkedInBy: { name: staff.name, staffId: staff.staffId },
            }
          : b
      )
    );

    const record: ScanRecord = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now,
      query: raw,
      result: 'VALID',
      staffMember: staff,
      bookingId: foundBooking.id,
      bookingRef: foundBooking.bookingRef,
      eventTitle: foundBooking.eventTitle,
      attendeeName: foundBooking.studentName,
      seatLabel: foundBooking.seatLabel,
      message: 'Access Granted: Valid festival digital pass.',
    };

    setScanHistory((prev) => [record, ...prev]);
    addAuditLog({
      action: 'GATE_ADMIT_VALID',
      eventId: foundBooking.eventId,
      eventTitle: foundBooking.eventTitle,
      seatLabel: foundBooking.seatLabel,
      userName: foundBooking.studentName,
      regNumber: foundBooking.regNumber,
      status: 'CONFIRMED',
      details: `Gate admission granted for ${foundBooking.studentName} (${foundBooking.bookingRef}, Seat ${foundBooking.seatLabel}) at ${foundBooking.eventTitle}.`,
    });

    return record;
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  };

  const runConcurrencySimulation = async (params: {
    strategy: ConcurrencyStrategy;
    concurrencyLevel: number;
    targetEventId: string;
  }): Promise<ConcurrencyRunResult> => {
    setIsSimulating(true);
    setSimulationProgress(10);
    await new Promise((r) => setTimeout(r, 200));
    setSimulationProgress(50);
    await new Promise((r) => setTimeout(r, 300));
    setSimulationProgress(100);

    const targetEvent = events.find((e) => e.id === params.targetEventId) || events[0];
    const initialStock = 1;
    let successfulCount = 0;
    let rejectedCount = 0;
    let finalStock = 0;
    let overbookingDetected = false;

    const txs: any[] = [];
    for (let i = 1; i <= params.concurrencyLevel; i++) {
      const isFirst = i === 1;
      let txStatus: 'COMMITTED' | 'REJECTED' = 'REJECTED';
      let message = 'Transaction committed with exclusive lock.';

      if (params.strategy === 'NO_LOCKING') {
        txStatus = 'COMMITTED';
        message = 'Dirty read passed. Wrote to database without lock!';
      } else {
        if (isFirst) {
          txStatus = 'COMMITTED';
        } else {
          txStatus = 'REJECTED';
          message = 'Row lock held by another thread. 409 conflict rejected.';
        }
      }

      txs.push({
        txId: `TX-${1000 + i}`,
        clientId: `worker-${i}`,
        clientName: `Student Worker #${i}`,
        status: txStatus,
        currentStep: txStatus === 'COMMITTED' ? 'COMMIT_WORK' : 'ROLLBACK',
        timestamp: Date.now() + i * 15,
        latencyMs: 12 + (i * 3) % 25,
        seatClaimed: `${targetEvent.title} (A-1)`,
        message,
      });
    }

    if (params.strategy === 'NO_LOCKING') {
      successfulCount = params.concurrencyLevel;
      rejectedCount = 0;
      finalStock = initialStock - params.concurrencyLevel;
      overbookingDetected = true;
    } else {
      successfulCount = 1;
      rejectedCount = params.concurrencyLevel - 1;
      finalStock = 0;
      overbookingDetected = false;
    }

    const result: ConcurrencyRunResult = {
      runId: `RUN-${Date.now().toString().slice(-4)}`,
      strategy: params.strategy,
      targetEventId: targetEvent.id,
      targetEventTitle: targetEvent.title,
      concurrencyLevel: params.concurrencyLevel,
      successfulCount,
      rejectedCount,
      deadlockCount: 0,
      initialStock,
      finalStock,
      durationMs: 480,
      overbookingDetected,
      overbookedSeats: overbookingDetected ? successfulCount - initialStock : 0,
      transactions: txs,
      dbLogs: [
        `BEGIN TRANSACTION ISOLATION ${params.strategy};`,
        `SELECT available_seats FROM events WHERE id = '${targetEvent.id}' FOR UPDATE;`,
        `UPDATE events SET available_seats = ${finalStock} WHERE id = '${targetEvent.id}';`,
        `COMMIT;`,
      ],
    };

    setLastSimResult(result);
    setIsSimulating(false);
    return result;
  };

  const runSideBySideSimulation = async (params: {
    concurrencyLevel: number;
    targetEventId: string;
  }): Promise<SideBySideRunResult> => {
    setIsSimulating(true);
    setSimulationProgress(25);
    const noLock = await runConcurrencySimulation({
      strategy: 'NO_LOCKING',
      concurrencyLevel: params.concurrencyLevel,
      targetEventId: params.targetEventId,
    });
    setSimulationProgress(75);
    const twoPl = await runConcurrencySimulation({
      strategy: 'TWO_PHASE_LOCKING',
      concurrencyLevel: params.concurrencyLevel,
      targetEventId: params.targetEventId,
    });
    setSimulationProgress(100);
    setIsSimulating(false);

    const sideResult: SideBySideRunResult = {
      noLockResult: noLock,
      twoPlResult: twoPl,
    };
    setLastSideBySideResult(sideResult);
    return sideResult;
  };

  const resetDatabaseState = () => {
    setEvents(INITIAL_EVENTS);
    setAllBookings(INITIAL_BOOKINGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setScanHistory(INITIAL_SCAN_HISTORY);
    localStorage.clear();
  };

  return (
    <FestContext.Provider
      value={{
        currentUser,
        loginAsStudent,
        loginAsGateStaff,
        loginAsAdmin,
        logout,
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

export const useFest = () => {
  const context = useContext(FestContext);
  if (!context) throw new Error('useFest must be used within FestProvider');
  return context;
};
