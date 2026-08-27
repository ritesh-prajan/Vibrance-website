import { useState, useMemo } from 'react';
import { FestEvent } from '../types';
import { TimeFilterStatus } from '../components/disco';
import { getEventTiming, sortEventsByTiming } from '../utils/timeUtils';

export function useEventFilters(events: FestEvent[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState<TimeFilterStatus>('ALL');
  const [sortBy, setSortBy] = useState('TIMING_CHRONOLOGICAL');
  const [viewMode, setViewMode] = useState<'GRID' | 'GROUPED'>('GRID');

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (selectedCategory !== 'ALL' && e.category !== selectedCategory) return false;
      const timing = getEventTiming(e);

      if (timeFilter === 'LIVE_SOON') {
        if (!timing.isLive && timing.status !== 'STARTING_SOON') return false;
      } else if (timeFilter === 'UPCOMING') {
        if (timing.isExpired) return false;
      } else if (timeFilter === 'EXPIRED') {
        if (!timing.isExpired) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.artistOrHost.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, selectedCategory, timeFilter, searchQuery]);

  const sortedEvents = useMemo(() => {
    return sortEventsByTiming(filteredEvents, sortBy);
  }, [filteredEvents, sortBy]);

  const groups = useMemo(() => {
    return {
      live: sortedEvents.filter((e) => getEventTiming(e).isLive),
      startingSoon: sortedEvents.filter((e) => getEventTiming(e).status === 'STARTING_SOON'),
      upcoming: sortedEvents.filter((e) => getEventTiming(e).status === 'UPCOMING'),
      expired: sortedEvents.filter((e) => getEventTiming(e).isExpired),
    };
  }, [sortedEvents]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setTimeFilter('ALL');
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    timeFilter,
    setTimeFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    sortedEvents,
    groups,
    resetFilters,
    totalCount: events.length,
    filteredCount: sortedEvents.length,
  };
}
