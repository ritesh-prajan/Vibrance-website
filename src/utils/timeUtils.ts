// Real-Time Festival Schedule & Expiration Utilities
import { FestEvent, Booking } from '../types';

export type EventTimeStatus = 'EXPIRED' | 'LIVE_NOW' | 'STARTING_SOON' | 'UPCOMING';

export interface EventTimingInfo {
  startTimestamp: number;
  endTimestamp: number;
  status: EventTimeStatus;
  statusLabel: string;
  badgeClass: string;
  countdownText: string;
  formattedDate: string;
  formattedTime: string;
  isExpired: boolean;
  isLive: boolean;
  isUpcoming: boolean;
}

const HOUR = 3600000;
const DAY = 86400000;

export const EVENT_SCHEDULE_OFFSETS: Record<string, { startOffset: number; durationHours: number }> = {
  'evt-hack': { startOffset: -52 * HOUR, durationHours: 24 }, // Sat Aug 29 (Concluded)
  'evt-band': { startOffset: -28 * HOUR, durationHours: 4 }, // Sun Aug 30 (Concluded)
  'evt-dance': { startOffset: -45 * 60000, durationHours: 3 }, // Mon Aug 31 (Live Stage)
  'evt-armaan': { startOffset: 105 * 60000, durationHours: 3.5 }, // Mon Aug 31 (Tonight Pro-Show)
  'evt-comedy': { startOffset: 24 * HOUR, durationHours: 2 }, // Tue Sep 1 (Upcoming Tomorrow)
  'evt-edm': { startOffset: 72 * HOUR, durationHours: 4 }, // Thu Sep 3 (Upcoming)
  'evt-cyberquest': { startOffset: 116 * HOUR, durationHours: 24 }, // Sat Sep 5 (Upcoming Grand Finale)
};

export function getEventTiming(event: FestEvent | Booking | { id?: string; eventId?: string; date?: string; time?: string; startTimestamp?: number; endTimestamp?: number }): EventTimingInfo {
  const now = Date.now();
  const id = (event as any).eventId || (event as any).id || '';
  const offset = EVENT_SCHEDULE_OFFSETS[id];

  let startTimestamp = (event as any).startTimestamp;
  let endTimestamp = (event as any).endTimestamp;

  if (!startTimestamp || !endTimestamp) {
    if (offset) {
      startTimestamp = now + offset.startOffset;
      endTimestamp = startTimestamp + offset.durationHours * HOUR;
    } else {
      startTimestamp = now + 24 * HOUR;
      endTimestamp = startTimestamp + 3 * HOUR;
    }
  }

  let status: EventTimeStatus = 'UPCOMING';
  let isExpired = false;
  let isLive = false;
  let isUpcoming = false;

  if (now > endTimestamp) {
    status = 'EXPIRED';
    isExpired = true;
  } else if (now >= startTimestamp && now <= endTimestamp) {
    status = 'LIVE_NOW';
    isLive = true;
  } else if (startTimestamp - now <= 2 * HOUR) {
    status = 'STARTING_SOON';
    isUpcoming = true;
  } else {
    status = 'UPCOMING';
    isUpcoming = true;
  }

  const countdownText = getCountdownString(now, startTimestamp, endTimestamp, status);

  let statusLabel = 'UPCOMING';
  let badgeClass = 'bg-[#4C3549] text-white/80 border-white/20';

  if (status === 'EXPIRED') {
    statusLabel = 'EVENT CONCLUDED / EXPIRED';
    badgeClass = 'bg-white/10 text-white/50 border-white/15';
  } else if (status === 'LIVE_NOW') {
    statusLabel = 'LIVE NOW ON STAGE';
    badgeClass = 'bg-red-500/25 text-red-400 border-red-500/50 animate-pulse';
  } else if (status === 'STARTING_SOON') {
    statusLabel = 'COMING UP NEXT';
    badgeClass = 'bg-[#FF3E41]/25 text-[#FF7099] border-[#FF3E41]/50';
  } else {
    statusLabel = 'UPCOMING SCHEDULE';
    badgeClass = 'bg-[#883955]/30 text-white/80 border-[#883955]/50';
  }

  const startDate = new Date(startTimestamp);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return {
    startTimestamp,
    endTimestamp,
    status,
    statusLabel,
    badgeClass,
    countdownText,
    formattedDate,
    formattedTime,
    isExpired,
    isLive,
    isUpcoming,
  };
}

function getCountdownString(now: number, start: number, end: number, status: EventTimeStatus): string {
  if (status === 'EXPIRED') {
    const diff = now - end;
    const hrs = Math.floor(diff / HOUR);
    if (hrs <= 1) return 'Concluded just now';
    if (hrs < 24) return 'Concluded ' + hrs + 'h ago';
    const days = Math.floor(hrs / 24);
    return 'Concluded ' + days + 'd ago';
  }

  if (status === 'LIVE_NOW') {
    const remaining = end - now;
    const hrs = Math.floor(remaining / HOUR);
    const mins = Math.floor((remaining % HOUR) / 60000);
    return 'Live Now (Ends in ' + (hrs > 0 ? hrs + 'h ' : '') + mins + 'm)';
  }

  const diff = start - now;
  const days = Math.floor(diff / DAY);
  const hrs = Math.floor((diff % DAY) / HOUR);
  const mins = Math.floor((diff % HOUR) / 60000);

  if (days > 0) return 'Starts in ' + days + 'd ' + hrs + 'h';
  if (hrs > 0) return 'Starts in ' + hrs + 'h ' + mins + 'm';
  return 'Starts in ' + mins + ' mins';
}

export function sortEventsByTiming(events: FestEvent[], criteria: string): FestEvent[] {
  const list = [...events];
  if (criteria === 'TIMING_CHRONOLOGICAL' || criteria === 'STARTING_SOONEST') {
    return list.sort((a, b) => {
      const tA = getEventTiming(a);
      const tB = getEventTiming(b);
      if (tA.isLive && !tB.isLive) return -1;
      if (!tA.isLive && tB.isLive) return 1;
      if (tA.isUpcoming && tB.isUpcoming) return tA.startTimestamp - tB.startTimestamp;
      if (tA.isUpcoming && tB.isExpired) return -1;
      if (tA.isExpired && tB.isUpcoming) return 1;
      return tB.endTimestamp - tA.endTimestamp;
    });
  }
  if (criteria === 'PRICE_ASC') return list.sort((a, b) => a.basePrice - b.basePrice);
  if (criteria === 'PRICE_DESC') return list.sort((a, b) => b.basePrice - a.basePrice);
  if (criteria === 'POPULARITY') return list.sort((a, b) => a.availableSeats - b.availableSeats);
  return list;
}

export function sortBookingsByTiming(bookings: Booking[]): { upcoming: Booking[]; expired: Booking[]; live: Booking[] } {
  const live: Booking[] = [];
  const upcoming: Booking[] = [];
  const expired: Booking[] = [];

  bookings.forEach((b) => {
    const timing = getEventTiming(b);
    if (timing.isExpired) expired.push(b);
    else if (timing.isLive) live.push(b);
    else upcoming.push(b);
  });

  upcoming.sort((a, b) => getEventTiming(a).startTimestamp - getEventTiming(b).startTimestamp);
  live.sort((a, b) => getEventTiming(a).endTimestamp - getEventTiming(b).endTimestamp);
  expired.sort((a, b) => getEventTiming(b).endTimestamp - getEventTiming(a).endTimestamp);

  return { upcoming, expired, live };
}
