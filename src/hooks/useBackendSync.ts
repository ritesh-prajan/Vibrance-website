/**
 * useBackendSync — Vibrance 2026
 * 
 * A lightweight hook that syncs data FROM the Spring Boot backend INTO the
 * existing FestContext localStorage state. The UI continues to work in
 * offline mode (using mock data) if the backend is unreachable.
 * 
 * Strategy:
 *  - On mount, call GET /api/v1/events → seed the events into context
 *  - On login (regNumber), call POST /api/v1/auth/login → get real JWT + user data
 *  - On booking, call POST /api/v1/bookings → create real booking in PostgreSQL
 *  - On seat lock (checkout), call POST /api/v1/seats/lock → acquire 2PL lease
 *  - All calls are fire-and-forget with console.warn on failure (graceful fallback)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  checkBackendHealth,
  eventsApi,
  authApi,
  bookingsApi,
  seatsApi,
  setToken,
  clearToken,
  getToken,
  type EventDTO,
  type BookingDTO,
  type AuthResponse,
  type UserDTO,
} from '../services/api';

// ── Type bridge ────────────────────────────────────────────────────────────────
// Map backend EventDTO → frontend FestEvent shape used by mockEvents / FestContext
export function mapEventDTOtoFestEvent(e: EventDTO): Record<string, unknown> {
  return {
    id: e.id,
    eventCode: e.eventCode,
    title: e.title,
    category: e.category,
    artistOrHost: e.artistOrHost,
    date: e.date,
    time: e.time,
    venue: e.venue,
    basePrice: e.basePrice,
    totalSeats: e.totalSeats,
    availableSeats: e.availableSeats,
    bookedSeatsCount: e.bookedSeatsCount,
    lockedSeatsCount: e.lockedSeatsCount,
    accentColor: e.accentColor,
    tag: e.tag,
    shortDesc: e.shortDesc,
    ticketBgImage: e.ticketBgImage,
    startTimestamp: e.startTimestamp,
    endTimestamp: e.endTimestamp,
    seats: e.seats?.map(s => ({
      id: s.id,
      row: s.row,
      number: s.number,
      category: s.category,
      price: s.price,
      status: s.status,
      lockedBy: s.lockedBy?.userId ?? null,
      lockExpiresAt: s.lockExpiresAt ?? null,
    })) ?? [],
  };
}

export function mapBookingDTOtoBooking(b: BookingDTO): Record<string, unknown> {
  return {
    id: b.id,
    bookingRef: b.bookingRef,
    eventId: b.eventId,
    eventTitle: b.eventTitle,
    eventCategory: b.eventCategory,
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
    paymentMethod: b.paymentMethod,
    bookedAt: b.bookedAt,
    qrPayload: b.qrPayload,
    ticketBgImage: b.ticketBgImage,
    status: b.status,
    checkedInAt: b.checkedInAt,
    startTimestamp: b.startTimestamp,
    endTimestamp: b.endTimestamp,
  };
}

// ── Main hook ─────────────────────────────────────────────────────────────────
interface BackendSyncState {
  backendOnline: boolean;
  loading: boolean;
  /** Live events from the database — null until fetched */
  liveEvents: EventDTO[] | null;
  /** Auth response after login — null if not logged in via backend */
  authData: AuthResponse | null;
  /** Current user profile from backend */
  backendUser: UserDTO | null;
}

export function useBackendSync() {
  const [state, setState] = useState<BackendSyncState>({
    backendOnline: false,
    loading: true,
    liveEvents: null,
    authData: null,
    backendUser: null,
  });

  // Check backend health and load events on mount
  useEffect(() => {
    let cancelled = false;
    async function init() {
      const online = await checkBackendHealth();
      if (cancelled) return;

      if (!online) {
        setState(s => ({ ...s, backendOnline: false, loading: false }));
        return;
      }

      try {
        const resp = await eventsApi.getAll();
        if (!cancelled && resp.success) {
          setState(s => ({ ...s, backendOnline: true, loading: false, liveEvents: resp.data }));
        } else {
          setState(s => ({ ...s, backendOnline: true, loading: false }));
        }
      } catch (err) {
        console.warn('[BackendSync] Could not load events from backend:', err);
        setState(s => ({ ...s, backendOnline: online, loading: false }));
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  // ── Login via backend ────────────────────────────────────────────────────────
  const loginWithBackend = useCallback(async (
    regNumber: string,
    password?: string
  ): Promise<AuthResponse | null> => {
    if (!state.backendOnline) return null;
    try {
      const resp = await authApi.login(regNumber, password);
      if (resp.success && resp.data.token) {
        setToken(resp.data.token);
        setState(s => ({ ...s, authData: resp.data, backendUser: resp.data.user }));
        return resp.data;
      }
    } catch (err) {
      console.warn('[BackendSync] Login failed:', err);
    }
    return null;
  }, [state.backendOnline]);

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logoutFromBackend = useCallback(() => {
    clearToken();
    setState(s => ({ ...s, authData: null, backendUser: null }));
  }, []);

  // ── Create booking via backend ───────────────────────────────────────────────
  const createBookingWithBackend = useCallback(async (payload: {
    eventId: string;
    seatId: string;
    name: string;
    regNumber: string;
    department?: string;
    paymentMethod: string;
  }): Promise<BookingDTO | null> => {
    if (!state.backendOnline || !getToken()) return null;
    try {
      const resp = await bookingsApi.create(payload);
      if (resp.success) return resp.data;
    } catch (err) {
      console.warn('[BackendSync] Booking creation failed:', err);
    }
    return null;
  }, [state.backendOnline]);

  // ── Lock seat via backend (2PL — only at checkout) ──────────────────────────
  const lockSeatWithBackend = useCallback(async (
    seatId: string,
    leaseSecs = 120
  ): Promise<boolean> => {
    if (!state.backendOnline || !getToken()) return true; // proceed optimistically if offline
    try {
      const resp = await seatsApi.lockSeat(seatId, leaseSecs);
      return resp.success && resp.data.success;
    } catch (err) {
      console.warn('[BackendSync] Seat lock failed:', err);
      return false;
    }
  }, [state.backendOnline]);

  // ── Release seat lock ────────────────────────────────────────────────────────
  const releaseSeatWithBackend = useCallback(async (seatId: string): Promise<void> => {
    if (!state.backendOnline || !getToken()) return;
    try {
      await seatsApi.releaseSeat(seatId);
    } catch (err) {
      console.warn('[BackendSync] Seat release failed:', err);
    }
  }, [state.backendOnline]);

  return {
    ...state,
    loginWithBackend,
    logoutFromBackend,
    createBookingWithBackend,
    lockSeatWithBackend,
    releaseSeatWithBackend,
  };
}
