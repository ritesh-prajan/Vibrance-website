import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  FestEvent,
  Seat,
  UserProfile,
  Booking,
  ScanRecord,
  AuditLog,
  ConcurrencyStrategy,
  ConcurrencyRunResult,
  SimulatedTx,
  UserRole,
} from '../types';
import {
  INITIAL_EVENTS,
  MOCK_STUDENT_PROFILES,
  MOCK_STAFF_PROFILES,
  MOCK_ADMIN_PROFILES,
  INITIAL_BOOKINGS,
  INITIAL_SCAN_RECORDS,
  INITIAL_AUDIT_LOGS,
  generateSeatsForEvent,
} from '../data/mockEvents';

interface SideBySideRunResult {
  noLockResult: ConcurrencyRunResult;
  twoPlResult: ConcurrencyRunResult;
}

interface FestContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  loginAsStudent: (customName?: string, customReg?: string, customDept?: string, customYear?: string) => void;
  loginAsGateStaff: (customName?: string, customStaffId?: string, customDept?: string) => void;
  loginAsAdmin: (customName?: string, customStaffId?: string, customDept?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;

  events: FestEvent[];
  selectedEvent: FestEvent | null;
  setSelectedEvent: (event: FestEvent | null) => void;
  addEvent: (eventData: Omit<FestEvent, 'id' | 'seats' | 'availableSeats' | 'lockedSeatsCount' | 'bookedSeatsCount'>) => void;
  updateEvent: (event: FestEvent) => void;
  deleteEvent: (eventId: string) => void;

  // Active seat booking flow
  activeSeat: Seat | null;
  activeSeatEventId: string | null;
  seatLockTimeRemaining: number; // in seconds (e.g. 180s)
  selectSeatForBooking: (event: FestEvent, seat: Seat) => boolean;
  releaseActiveSeat: () => void;
  confirmBooking: (details: {
    name: string;
    regNumber: string;
    department: string;
    paymentMethod: 'UPI' | 'CAMPUS_CARD' | 'NET_BANKING';
  }) => Promise<Booking | null>;

  // Bookings
  allBookings: Booking[];
  myBookings: Booking[];
  cancelBooking: (bookingId: string) => boolean;

  // Gate Staff Verification
  scanHistory: ScanRecord[];
  verifyTicket: (query: string, staff: { name: string; staffId: string }) => ScanRecord;
  clearScanHistory: () => void;

  // Audit Logs
  auditLogs: AuditLog[];
  clearAuditLogs: () => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;

  // Concurrency Simulation Engine
  isSimulating: boolean;
  simulationProgress: number;
  lastSimResult: ConcurrencyRunResult | null;
  lastSideBySideResult: SideBySideRunResult | null;
  simHistory: ConcurrencyRunResult[];
  runConcurrencySimulation: (params: {
    strategy: ConcurrencyStrategy;
    concurrencyLevel: number;
    targetEventId: string;
    targetSeatId?: string;
    speedMs?: number;
  }) => Promise<ConcurrencyRunResult>;
  runSideBySideSimulation: (params: {
    concurrencyLevel: number;
    targetEventId: string;
    targetSeatId?: string;
    speedMs?: number;
  }) => Promise<SideBySideRunResult>;
  resetDatabaseState: () => void;
}

const FestContext = createContext<FestContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'vibrance26_user',
  BOOKINGS: 'vibrance26_bookings',
  EVENTS: 'vibrance26_events',
  LOGS: 'vibrance26_audit_logs',
  SCANS: 'vibrance26_scans',
  SIM_HISTORY: 'vibrance26_sim_history',
};

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

  const [events, setEvents] = useState<FestEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
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
        return JSON.parse(saved);
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
        return INITIAL_SCAN_RECORDS;
      }
    }
    return INITIAL_SCAN_RECORDS;
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

  // Filter student bookings for current user
  const myBookings = allBookings.filter((b) => {
    if (!currentUser) return false;
    return b.regNumber.toLowerCase() === currentUser.regNumber.toLowerCase() || b.studentName.toLowerCase() === currentUser.name.toLowerCase();
  });

  // Sync to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    }
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
    localStorage.setItem(STORAGE_KEYS.SIM_HISTORY, JSON.stringify(simHistory));
  }, [simHistory]);

  const addAuditLog = useCallback((log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newEntry: AuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 200)]);
  }, []);

  // Live Timer countdown for all locked seats in the entire system
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      // 1. Tick student's own selected seat hold timer
      if (activeSeat && activeSeat.lockExpiresAt) {
        const remaining = Math.max(0, Math.ceil((activeSeat.lockExpiresAt - now) / 1000));
        setSeatLockTimeRemaining(remaining);
        if (remaining === 0) {
          // Lock expired! Auto release
          const eventObj = events.find((e) => e.id === activeSeatEventId);
          addAuditLog({
            action: 'LOCK_EXPIRED',
            eventId: activeSeatEventId || 'SYSTEM',
            eventTitle: eventObj?.title || 'Unknown Event',
            seatLabel: `${activeSeat.row}-${activeSeat.number}`,
            userName: currentUser?.name || 'Anonymous Student',
            regNumber: currentUser?.regNumber || 'N/A',
            status: 'RELEASED',
            details: 'Student hold timer expired (3 minutes limit reached). Seat returned to available pool.',
            protocol: 'Pessimistic Lease Timeout (TTL = 180s)',
          });
          releaseActiveSeat();
        }
      }

      // 2. Check all other locked seats across all events
      setEvents((prevEvents) =>
        prevEvents.map((evt) => {
          let updated = false;
          const updatedSeats = evt.seats.map((st) => {
            if (st.status === 'locked' && st.lockExpiresAt && st.lockExpiresAt <= now) {
              // If this is not current user's active seat, release it
              if (!activeSeat || activeSeat.id !== st.id) {
                updated = true;
                return {
                  ...st,
                  status: 'available' as const,
                  lockedBy: undefined,
                  lockExpiresAt: undefined,
                };
              }
            }
            return st;
          });

          if (!updated) return evt;

          const availableCount = updatedSeats.filter((s) => s.status === 'available').length;
          const lockedCount = updatedSeats.filter((s) => s.status === 'locked').length;
          const bookedCount = updatedSeats.filter((s) => s.status === 'booked').length;

          return {
            ...evt,
            seats: updatedSeats,
            availableSeats: availableCount,
            lockedSeatsCount: lockedCount,
            bookedSeatsCount: bookedCount,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSeat, activeSeatEventId, events, currentUser, addAuditLog]);

  // Auth Handlers
  const loginAsStudent = (customName?: string, customReg?: string, customDept?: string, customYear?: string) => {
    const profile: UserProfile = {
      id: `usr-std-${Date.now()}`,
      name: customName?.trim() || MOCK_STUDENT_PROFILES[0].name,
      regNumber: customReg?.trim() || MOCK_STUDENT_PROFILES[0].regNumber,
      email: `${(customName || 'rahul').toLowerCase().replace(/\s+/g, '.')}@vibrance.edu`,
      role: 'student',
      department: customDept?.trim() || 'Computer Science & Engineering',
      year: customYear?.trim() || '3rd Year (B.Tech)',
      avatarSeed: (customName || 'rahul').toLowerCase(),
    };
    setCurrentUser(profile);
  };

  const loginAsGateStaff = (customName?: string, customStaffId?: string, customDept?: string) => {
    const profile: UserProfile = {
      id: `usr-stf-${Date.now()}`,
      name: customName?.trim() || MOCK_STAFF_PROFILES[0].name,
      regNumber: customStaffId?.trim() || MOCK_STAFF_PROFILES[0].regNumber,
      email: `${(customName || 'rajesh').toLowerCase().replace(/\s+/g, '.')}@vibrance.edu`,
      role: 'gate_staff',
      department: customDept?.trim() || 'Main Gate Access & Security Post A',
      year: 'Staff Lead',
      avatarSeed: (customName || 'rajesh').toLowerCase(),
    };
    setCurrentUser(profile);
  };

  const loginAsAdmin = (customName?: string, customStaffId?: string, customDept?: string) => {
    const profile: UserProfile = {
      id: `usr-adm-${Date.now()}`,
      name: customName?.trim() || MOCK_ADMIN_PROFILES[0].name,
      regNumber: customStaffId?.trim() || MOCK_ADMIN_PROFILES[0].regNumber,
      email: 'admin.dbms@vibrance.edu',
      role: 'admin',
      department: customDept?.trim() || 'DBMS Lab Coordinator & Event Controller',
      year: 'Professor & Coordinator',
      avatarSeed: 'ramesh',
    };
    setCurrentUser(profile);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    releaseActiveSeat();
  };

  const switchRole = (role: UserRole) => {
    if (role === 'student') {
      setCurrentUser(MOCK_STUDENT_PROFILES[0]);
    } else if (role === 'gate_staff') {
      setCurrentUser(MOCK_STAFF_PROFILES[0]);
    } else {
      setCurrentUser(MOCK_ADMIN_PROFILES[0]);
    }
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  // Seat Selection & Hold Flow (3 minutes TTL)
  const selectSeatForBooking = (event: FestEvent, seat: Seat): boolean => {
    if (!currentUser) return false;
    if (seat.status !== 'available') return false;

    // Release any previous active seat
    if (activeSeat && activeSeat.id !== seat.id) {
      releaseActiveSeat();
    }

    const HOLD_DURATION_SEC = 180; // 3 minutes
    const lockExpiresAt = Date.now() + HOLD_DURATION_SEC * 1000;

    const updatedSeat: Seat = {
      ...seat,
      status: 'selected',
      lockedBy: {
        userId: currentUser.id,
        userName: currentUser.name,
        regNumber: currentUser.regNumber,
      },
      lockExpiresAt,
    };

    setActiveSeat(updatedSeat);
    setActiveSeatEventId(event.id);
    setSelectedEvent(event);
    setSeatLockTimeRemaining(HOLD_DURATION_SEC);

    // Update event seats in global state
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== event.id) return e;
        const newSeats = e.seats.map((s) => (s.id === seat.id ? updatedSeat : s));
        return {
          ...e,
          seats: newSeats,
          availableSeats: newSeats.filter((s) => s.status === 'available').length,
          lockedSeatsCount: newSeats.filter((s) => s.status === 'locked' || s.status === 'selected').length,
        };
      })
    );

    addAuditLog({
      action: 'LOCK_ACQUIRED',
      eventId: event.id,
      eventTitle: event.title,
      seatLabel: `${seat.row}-${seat.number}`,
      userName: currentUser.name,
      regNumber: currentUser.regNumber,
      status: 'SUCCESS',
      details: `Acquired 3-minute exclusive student lock (X-Lock) on seat table row [${seat.row}-${seat.number}].`,
      protocol: 'Pessimistic Lease Lock (TTL = 180s)',
    });

    return true;
  };

  const releaseActiveSeat = () => {
    if (!activeSeat || !activeSeatEventId) {
      setActiveSeat(null);
      setActiveSeatEventId(null);
      setSeatLockTimeRemaining(0);
      return;
    }

    const seatId = activeSeat.id;
    const eventId = activeSeatEventId;

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const newSeats = e.seats.map((s) =>
          s.id === seatId
            ? {
                ...s,
                status: 'available' as const,
                lockedBy: undefined,
                lockExpiresAt: undefined,
              }
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

    // Simulate 500ms database transaction commit & payment gateway verification
    await new Promise((resolve) => setTimeout(resolve, 500));

    const bookingRef = `VIB26-${event.category.substring(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;
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
      status: 'confirmed',
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

    // Update event seats
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

    // Save to all bookings
    setAllBookings((prev) => [newBooking, ...prev]);

    // Audit log
    addAuditLog({
      action: 'BOOKING_COMMITTED',
      eventId: event.id,
      eventTitle: event.title,
      seatLabel: `${activeSeat.row}-${activeSeat.number}`,
      userName: details.name,
      regNumber: details.regNumber,
      status: 'SUCCESS',
      details: `Transaction committed with ACID Serializability. Ref: ${bookingRef}, Paid via ${details.paymentMethod}.`,
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

    setAllBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)));

    // Return seat to available in event
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== booking.eventId) return e;
        const newSeats = e.seats.map((s) =>
          s.id === booking.seatId
            ? {
                ...s,
                status: 'available' as const,
                bookedBy: undefined,
                lockedBy: undefined,
                lockExpiresAt: undefined,
              }
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
      details: `Booking ${booking.bookingRef} cancelled. Seat released back to pool.`,
      protocol: 'Transaction Compensating Rollback',
    });

    return true;
  };

  // Gate Staff Verification Logic
  const verifyTicket = (query: string, staff: { name: string; staffId: string }): ScanRecord => {
    const trimmed = query.trim().toUpperCase();

    // Look up by bookingRef, id, or qrPayload
    const foundBooking = allBookings.find(
      (b) =>
        b.bookingRef.toUpperCase() === trimmed ||
        b.id.toUpperCase() === trimmed ||
        b.qrPayload.toUpperCase().includes(trimmed)
    );

    const now = Date.now();

    if (!foundBooking) {
      // Invalid / Not found
      const record: ScanRecord = {
        id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: now,
        query: trimmed,
        result: 'INVALID',
        staffMember: staff,
        message: 'Invalid pass or reference code. No record found in central database.',
      };

      setScanHistory((prev) => [record, ...prev]);

      addAuditLog({
        action: 'TICKET_VERIFY_INVALID',
        eventId: 'GATE_ENTRY',
        eventTitle: 'GATE SCANNER',
        seatLabel: 'N/A',
        userName: 'Unknown Visitor',
        regNumber: 'N/A',
        status: 'INVALID',
        details: `Invalid ticket reference scanned [${trimmed}] by Staff ${staff.name} (${staff.staffId}). Access denied.`,
        protocol: 'Gate Entry Verification Protocol',
      });

      return record;
    }

    if (foundBooking.status === 'checked_in') {
      // Already used / duplicate
      const record: ScanRecord = {
        id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: now,
        query: trimmed,
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
        message: `Duplicate entry alert: Pass ${foundBooking.bookingRef} was already checked in.`,
      };

      setScanHistory((prev) => [record, ...prev]);

      addAuditLog({
        action: 'TICKET_VERIFY_DUPLICATE',
        eventId: foundBooking.eventId,
        eventTitle: foundBooking.eventTitle,
        seatLabel: foundBooking.seatLabel,
        userName: foundBooking.studentName,
        regNumber: foundBooking.regNumber,
        status: 'DUPLICATE_FLAGGED',
        details: `Duplicate admission attempt on ${foundBooking.bookingRef}. Originally admitted by ${record.originalCheckedInBy}.`,
        protocol: 'Gate Entry Verification Protocol',
      });

      return record;
    }

    if (foundBooking.status === 'cancelled') {
      // Cancelled ticket
      const record: ScanRecord = {
        id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: now,
        query: trimmed,
        result: 'INVALID',
        staffMember: staff,
        bookingId: foundBooking.id,
        bookingRef: foundBooking.bookingRef,
        eventTitle: foundBooking.eventTitle,
        attendeeName: foundBooking.studentName,
        seatLabel: foundBooking.seatLabel,
        message: `Pass ${foundBooking.bookingRef} was cancelled prior to the event. Access denied.`,
      };

      setScanHistory((prev) => [record, ...prev]);

      addAuditLog({
        action: 'TICKET_VERIFY_INVALID',
        eventId: foundBooking.eventId,
        eventTitle: foundBooking.eventTitle,
        seatLabel: foundBooking.seatLabel,
        userName: foundBooking.studentName,
        regNumber: foundBooking.regNumber,
        status: 'INVALID',
        details: `Cancelled ticket scanned [${foundBooking.bookingRef}]. Access denied.`,
        protocol: 'Gate Entry Verification Protocol',
      });

      return record;
    }

    // VALID PASS -> Update state to checked_in
    const updatedBooking: Booking = {
      ...foundBooking,
      status: 'checked_in',
      checkedInAt: now,
      checkedInBy: staff,
    };

    setAllBookings((prev) => prev.map((b) => (b.id === foundBooking.id ? updatedBooking : b)));

    const record: ScanRecord = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now,
      query: trimmed,
      result: 'VALID',
      staffMember: staff,
      bookingId: foundBooking.id,
      bookingRef: foundBooking.bookingRef,
      eventTitle: foundBooking.eventTitle,
      attendeeName: foundBooking.studentName,
      seatLabel: foundBooking.seatLabel,
      message: `Verified successfully. Admitted: ${foundBooking.studentName} (${foundBooking.seatLabel}).`,
    };

    setScanHistory((prev) => [record, ...prev]);

    addAuditLog({
      action: 'TICKET_VERIFIED',
      eventId: foundBooking.eventId,
      eventTitle: foundBooking.eventTitle,
      seatLabel: foundBooking.seatLabel,
      userName: foundBooking.studentName,
      regNumber: foundBooking.regNumber,
      status: 'VERIFIED',
      details: `Admitted attendee ${foundBooking.studentName} for seat ${foundBooking.seatLabel}. Checked in by ${staff.name}.`,
      protocol: 'Gate Entry Verification Protocol',
    });

    return record;
  };

  const clearScanHistory = () => {
    setScanHistory([]);
    localStorage.removeItem(STORAGE_KEYS.SCANS);
  };

  // Event CRUD
  const addEvent = (eventData: Omit<FestEvent, 'id' | 'seats' | 'availableSeats' | 'lockedSeatsCount' | 'bookedSeatsCount'>) => {
    const id = `evt-${Date.now().toString(36)}`;
    const seats = generateSeatsForEvent(id, eventData.basePrice);
    const newEvent: FestEvent = {
      ...eventData,
      id,
      seats,
      availableSeats: seats.filter((s) => s.status === 'available').length,
      lockedSeatsCount: 0,
      bookedSeatsCount: seats.filter((s) => s.status === 'booked').length,
    };

    setEvents((prev) => [newEvent, ...prev]);

    addAuditLog({
      action: 'BOOKING_ATTEMPT',
      eventId: id,
      eventTitle: eventData.title,
      seatLabel: 'ALL',
      userName: currentUser?.name || 'Admin',
      regNumber: currentUser?.regNumber || 'FACULTY',
      status: 'SUCCESS',
      details: `New fest event created with ${seats.length} total inventory capacity.`,
      protocol: 'Catalog Mutation Protocol',
    });
  };

  const updateEvent = (updated: FestEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  };

  const resetDatabaseState = () => {
    setEvents(INITIAL_EVENTS);
    setAllBookings(INITIAL_BOOKINGS);
    setScanHistory(INITIAL_SCAN_RECORDS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveSeat(null);
    setActiveSeatEventId(null);
    setSeatLockTimeRemaining(0);
    setLastSimResult(null);
    setLastSideBySideResult(null);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.SCANS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.SIM_HISTORY);

    addAuditLog({
      action: 'BOOKING_ATTEMPT',
      eventId: 'SYSTEM',
      eventTitle: 'ALL_TABLES',
      seatLabel: 'ALL',
      userName: currentUser?.name || 'Admin',
      regNumber: currentUser?.regNumber || 'STAFF',
      status: 'RELEASED',
      details: 'DBMS Table State Reset & Re-seeded to clean benchmark baseline.',
      protocol: 'Database Re-initialization',
    });
  };

  // Internal worker for concurrency simulator
  const executeSimulation = async ({
    strategy,
    concurrencyLevel,
    targetEventId,
    targetSeatId,
    speedMs = 10,
    onProgress,
  }: {
    strategy: ConcurrencyStrategy;
    concurrencyLevel: number;
    targetEventId: string;
    targetSeatId?: string;
    speedMs?: number;
    onProgress?: (pct: number) => void;
  }): Promise<ConcurrencyRunResult> => {
    const targetEvent = events.find((e) => e.id === targetEventId) || events[0];
    const targetSeat =
      targetEvent.seats.find((s) => (targetSeatId ? s.id === targetSeatId : s.status === 'available')) ||
      targetEvent.seats[0];

    const initialStock = 1; // 1 unit remaining
    let currentStock = initialStock;
    let successfulCount = 0;
    let rejectedCount = 0;
    let activeExclusiveLock: string | null = null;
    let tableVersion = 1;

    const simulatedTxs: SimulatedTx[] = [];
    const dbLogs: string[] = [];
    const startTime = Date.now();

    dbLogs.push(`[${new Date().toISOString()}] [DBMS ENGINE] Benchmark initialized.`);
    dbLogs.push(
      `[${new Date().toISOString()}] [ISOLATION: ${
        strategy === 'TWO_PHASE_LOCKING'
          ? 'SERIALIZABLE (Strict 2PL)'
          : strategy === 'OPTIMISTIC_OCC'
          ? 'SNAPSHOT / OCC'
          : 'READ UNCOMMITTED (No Locks)'
      }] Target Resource: ${targetEvent.title} | Seat: [${targetSeat.row}-${targetSeat.number}] | Stock: ${initialStock}`
    );

    // Initialize transactions
    for (let i = 0; i < concurrencyLevel; i++) {
      const txNum = 101 + i;
      simulatedTxs.push({
        txId: `TX_${txNum}`,
        clientIndex: i + 1,
        clientName: `Simulated Student #${i + 1}`,
        regNumber: `RA211100${3000 + i}`,
        status: 'PENDING',
        currentStep: 'INIT',
        startTs: startTime + i * 2,
        latencyMs: 0,
        message: 'Transaction initialized in thread pool.',
        sqlStatements: [],
      });
    }

    // Step 1: All threads issue concurrent READ
    for (let i = 0; i < simulatedTxs.length; i++) {
      const tx = simulatedTxs[i];
      tx.status = 'RUNNING';
      tx.currentStep = 'READ_DATA';
      tx.versionRead = tableVersion;
      tx.sqlStatements.push(`BEGIN TRANSACTION [${tx.txId}];`);
      tx.sqlStatements.push(`SELECT seats_available FROM fest_inventory WHERE seat_id = '${targetSeat.id}';`);

      if (strategy === 'NO_LOCKING') {
        tx.message = `Read seats_available = ${currentStock}. No locks acquired.`;
      } else if (strategy === 'TWO_PHASE_LOCKING') {
        tx.sqlStatements[1] = `SELECT seats_available FROM fest_inventory WHERE seat_id = '${targetSeat.id}' FOR UPDATE;`;
        tx.message = `Issued SELECT ... FOR UPDATE (Acquiring X-Lock).`;
      } else if (strategy === 'OPTIMISTIC_OCC') {
        tx.message = `Read seats_available = ${currentStock} with row_version = ${tableVersion}.`;
      }

      if (onProgress) onProgress(Math.round(((i + 1) / concurrencyLevel) * 25));
      await new Promise((r) => setTimeout(r, Math.max(1, speedMs / 3)));
    }

    // Step 2: Lock Acquisition & Conflict Resolution Phase
    for (let i = 0; i < simulatedTxs.length; i++) {
      const tx = simulatedTxs[i];

      if (strategy === 'NO_LOCKING') {
        // Classic lost update / dirty overbook anomaly
        tx.currentStep = 'VALIDATE';
        await new Promise((r) => setTimeout(r, Math.max(1, speedMs / 2)));

        const willOverbook = i < Math.min(3, concurrencyLevel);

        if (willOverbook) {
          tx.currentStep = 'WRITE_DATA';
          currentStock = currentStock - 1; // 1 -> 0 -> -1 -> -2
          tx.sqlStatements.push(
            `UPDATE fest_inventory SET seats_available = seats_available - 1 WHERE seat_id = '${targetSeat.id}';`
          );
          tx.sqlStatements.push(`INSERT INTO bookings (tx_id, student_id) VALUES ('${tx.txId}', '${tx.regNumber}');`);
          tx.sqlStatements.push(`COMMIT; -- [WARNING: RACE CONDITION COMMITTED]`);
          tx.status = 'COMMITTED';
          tx.seatAllocated = `${targetSeat.row}-${targetSeat.number}`;
          tx.message = `Booking SUCCESS! (Overbooking anomaly: Stock dropped to ${currentStock})`;
          successfulCount++;

          dbLogs.push(
            `[LOST UPDATE BUG] ${tx.txId} committed without lock! Remaining seat capacity is now: ${currentStock}`
          );
        } else {
          tx.currentStep = 'ABORT';
          tx.status = 'REJECTED';
          tx.sqlStatements.push(`ROLLBACK; -- Seat sold out`);
          tx.message = `Booking Rejected: seats_available = ${currentStock} (Exhausted).`;
          rejectedCount++;
        }
      } else if (strategy === 'TWO_PHASE_LOCKING') {
        tx.currentStep = 'ACQUIRE_LOCK';

        if (activeExclusiveLock === null && currentStock > 0) {
          activeExclusiveLock = tx.txId;
          tx.lockAcquired = true;
          tx.sqlStatements.push(`ACQUIRE EXCLUSIVE LOCK (X-LOCK) on row [${targetSeat.id}] -> GRANTED`);
          tx.currentStep = 'WRITE_DATA';
          currentStock -= 1;
          tx.sqlStatements.push(
            `UPDATE fest_inventory SET seats_available = 0 WHERE seat_id = '${targetSeat.id}';`
          );
          tx.sqlStatements.push(`INSERT INTO bookings (tx_id, student_id) VALUES ('${tx.txId}', '${tx.regNumber}');`);
          tx.sqlStatements.push(`COMMIT; RELEASE X-LOCK on row [${targetSeat.id}];`);
          tx.status = 'COMMITTED';
          tx.seatAllocated = `${targetSeat.row}-${targetSeat.number}`;
          tx.message = `Exclusive Lock acquired. ACID transaction committed successfully.`;
          successfulCount++;
          activeExclusiveLock = null;

          dbLogs.push(`[2PL SERIALIZABLE] ${tx.txId} acquired X-Lock and safely committed. 1 seat allocated.`);
        } else {
          tx.currentStep = 'ABORT';
          tx.status = 'REJECTED';
          tx.sqlStatements.push(
            `ACQUIRE EXCLUSIVE LOCK on row [${targetSeat.id}] -> DENIED (Lock Contention / Stock 0)`
          );
          tx.sqlStatements.push(`ROLLBACK; -- 409 Conflict`);
          tx.message = `Seat just taken by concurrent transaction. Lock contention rejected safely.`;
          rejectedCount++;
        }
      } else if (strategy === 'OPTIMISTIC_OCC') {
        tx.currentStep = 'VALIDATE';

        if (tx.versionRead === tableVersion && currentStock > 0) {
          tx.currentStep = 'WRITE_DATA';
          currentStock -= 1;
          tableVersion += 1;
          tx.sqlStatements.push(
            `UPDATE fest_inventory SET seats_available = 0, version = ${tableVersion} WHERE seat_id = '${targetSeat.id}' AND version = ${tx.versionRead}; -- (1 row affected)`
          );
          tx.sqlStatements.push(`COMMIT;`);
          tx.status = 'COMMITTED';
          tx.seatAllocated = `${targetSeat.row}-${targetSeat.number}`;
          tx.message = `OCC Validation PASSED (Version matched ${tx.versionRead}). Committed.`;
          successfulCount++;
          dbLogs.push(`[OCC COMMIT] ${tx.txId} matched version ${tx.versionRead}. Committed with new version ${tableVersion}.`);
        } else {
          tx.currentStep = 'ABORT';
          tx.status = 'ROLLEDBACK';
          tx.sqlStatements.push(
            `UPDATE fest_inventory ... WHERE version = ${tx.versionRead}; -- (0 rows affected: Stale Version Collision)`
          );
          tx.sqlStatements.push(`ROLLBACK; -- Optimistic Locking Failure`);
          tx.message = `OCC Validation FAILED: Stale row version (Expected v${tableVersion}, read v${tx.versionRead}). Aborted.`;
          rejectedCount++;
        }
      }

      tx.finishTs = Date.now();
      tx.latencyMs = tx.finishTs - tx.startTs;

      if (onProgress) onProgress(25 + Math.round(((i + 1) / concurrencyLevel) * 75));
      await new Promise((r) => setTimeout(r, speedMs));
    }

    const durationMs = Date.now() - startTime;
    const overbookingDetected = strategy === 'NO_LOCKING' && successfulCount > initialStock;
    const overbookedSeats = Math.max(0, successfulCount - initialStock);

    return {
      runId: `run-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      strategy,
      concurrencyLevel,
      targetEventTitle: targetEvent.title,
      targetSeatLabel: `${targetSeat.row}-${targetSeat.number}`,
      initialStock,
      finalStock: currentStock,
      successfulCount,
      rejectedCount,
      overbookingDetected,
      overbookedSeats,
      durationMs,
      transactions: simulatedTxs,
      dbLogs,
    };
  };

  const runConcurrencySimulation = async (params: {
    strategy: ConcurrencyStrategy;
    concurrencyLevel: number;
    targetEventId: string;
    targetSeatId?: string;
    speedMs?: number;
  }): Promise<ConcurrencyRunResult> => {
    setIsSimulating(true);
    setSimulationProgress(0);

    const result = await executeSimulation({
      ...params,
      onProgress: (p) => setSimulationProgress(p),
    });

    setLastSimResult(result);
    setSimHistory((prev) => [result, ...prev.slice(0, 20)]);
    setIsSimulating(false);
    setSimulationProgress(100);

    addAuditLog({
      action: result.overbookingDetected ? 'RACE_OVERBOOK' : 'BOOKING_ATTEMPT',
      eventId: params.targetEventId,
      eventTitle: result.targetEventTitle,
      seatLabel: result.targetSeatLabel,
      userName: `DBMS Lab Sim (${params.concurrencyLevel} Threads)`,
      regNumber: `PROTOCOL: ${params.strategy}`,
      status: result.overbookingDetected ? 'ANOMALY_OVERBOOK' : 'SUCCESS',
      details: result.overbookingDetected
        ? `CRITICAL ANOMALY: ${result.successfulCount} transactions committed against ${result.initialStock} seat! (Overbooking Bug: ${result.overbookedSeats} duplicate tickets generated).`
        : `SERIALIZABILITY PRESERVED: Exactly ${result.successfulCount} transaction committed, ${result.rejectedCount} conflicts safely handled.`,
      protocol: params.strategy,
    });

    return result;
  };

  const runSideBySideSimulation = async (params: {
    concurrencyLevel: number;
    targetEventId: string;
    targetSeatId?: string;
    speedMs?: number;
  }): Promise<SideBySideRunResult> => {
    setIsSimulating(true);
    setSimulationProgress(0);

    // Run No Locking
    const noLockResult = await executeSimulation({
      strategy: 'NO_LOCKING',
      concurrencyLevel: params.concurrencyLevel,
      targetEventId: params.targetEventId,
      targetSeatId: params.targetSeatId,
      speedMs: params.speedMs,
      onProgress: (p) => setSimulationProgress(Math.round(p / 2)),
    });

    // Run Strict 2PL
    const twoPlResult = await executeSimulation({
      strategy: 'TWO_PHASE_LOCKING',
      concurrencyLevel: params.concurrencyLevel,
      targetEventId: params.targetEventId,
      targetSeatId: params.targetSeatId,
      speedMs: params.speedMs,
      onProgress: (p) => setSimulationProgress(50 + Math.round(p / 2)),
    });

    const combined: SideBySideRunResult = {
      noLockResult,
      twoPlResult,
    };

    setLastSideBySideResult(combined);
    setSimHistory((prev) => [twoPlResult, noLockResult, ...prev.slice(0, 20)]);
    setIsSimulating(false);
    setSimulationProgress(100);

    addAuditLog({
      action: 'RACE_OVERBOOK',
      eventId: params.targetEventId,
      eventTitle: noLockResult.targetEventTitle,
      seatLabel: noLockResult.targetSeatLabel,
      userName: `DBMS Lab Dual Benchmark (${params.concurrencyLevel} Threads)`,
      regNumber: 'SIDE-BY-SIDE COMPARE',
      status: 'ANOMALY_OVERBOOK',
      details: `Comparative Isolation Benchmark Completed: No-Lock produced ${noLockResult.overbookedSeats} overbooked passes (stock ${noLockResult.finalStock}) vs Strict-2PL 0 overbooks (stock ${twoPlResult.finalStock}).`,
      protocol: 'No-Lock vs Strict 2PL Benchmark',
    });

    return combined;
  };

  return (
    <FestContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginAsStudent,
        loginAsGateStaff,
        loginAsAdmin,
        logout,
        switchRole,
        updateProfile,
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
        confirmBooking,
        allBookings,
        myBookings,
        cancelBooking,
        scanHistory,
        verifyTicket,
        clearScanHistory,
        auditLogs,
        clearAuditLogs,
        addAuditLog,
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
  if (!context) {
    throw new Error('useFest must be used within a FestProvider');
  }
  return context;
};

