import { useState, useMemo } from 'react';
import { Booking } from '../types';
import { getEventTiming } from '../utils/timeUtils';

export type BookingStatusFilter = 'ALL' | 'ACTIVE_INTACT' | 'LIVE' | 'CHECKED_IN' | 'EXPIRED';

export function useBookingFilters(bookings: Booking[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>('ALL');
  const [sortBy, setSortBy] = useState('SCHEDULE_EARLIEST');
  const [viewMode, setViewMode] = useState<'GRID' | 'GROUPED'>('GRID');

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (selectedCategory !== 'ALL' && b.eventCategory !== selectedCategory) return false;
      const timing = getEventTiming(b);

      if (statusFilter === 'ACTIVE_INTACT') {
        if (b.status !== 'confirmed' || timing.isExpired) return false;
      } else if (statusFilter === 'LIVE') {
        if (!timing.isLive) return false;
      } else if (statusFilter === 'CHECKED_IN') {
        if (b.status !== 'checked_in') return false;
      } else if (statusFilter === 'EXPIRED') {
        if (!timing.isExpired && b.status !== 'checked_in') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.bookingRef.toLowerCase().includes(q) ||
          b.eventTitle.toLowerCase().includes(q) ||
          b.artistOrHost.toLowerCase().includes(q) ||
          b.eventVenue.toLowerCase().includes(q) ||
          b.seatLabel.toLowerCase().includes(q) ||
          b.studentName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bookings, selectedCategory, statusFilter, searchQuery]);

  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      const tA = getEventTiming(a);
      const tB = getEventTiming(b);

      if (sortBy === 'SCHEDULE_EARLIEST') {
        if (tA.isLive && !tB.isLive) return -1;
        if (!tA.isLive && tB.isLive) return 1;
        if (tA.isUpcoming && tB.isUpcoming) return tA.startTimestamp - tB.startTimestamp;
        if (tA.isUpcoming && tB.isExpired) return -1;
        if (tA.isExpired && tB.isUpcoming) return 1;
        return tB.endTimestamp - tA.endTimestamp;
      }

      if (sortBy === 'BOOKED_LATEST') {
        return b.bookedAt - a.bookedAt;
      }

      if (sortBy === 'PRICE_DESC') {
        return b.amount - a.amount;
      }

      if (sortBy === 'PRICE_ASC') {
        return a.amount - b.amount;
      }

      return 0;
    });
  }, [filteredBookings, sortBy]);

  const groups = useMemo(() => {
    return {
      live: sortedBookings.filter((b) => getEventTiming(b).isLive),
      intact: sortedBookings.filter((b) => b.status === 'confirmed' && !getEventTiming(b).isExpired),
      torn: sortedBookings.filter((b) => b.status === 'checked_in' || getEventTiming(b).isExpired || b.status === 'cancelled'),
    };
  }, [sortedBookings]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setStatusFilter('ALL');
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    sortedBookings,
    groups,
    resetFilters,
    totalCount: bookings.length,
    filteredCount: sortedBookings.length,
  };
}
