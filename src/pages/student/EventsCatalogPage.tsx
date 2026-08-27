import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { FestEvent } from '../../types';
import { motion } from 'framer-motion';
import {
  Radio,
  Zap,
  Calendar,
  Clock,
  Sparkles,
  Ticket,
  Flame,
} from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { GlitchText } from '../../components/common/GlitchText';
import { EventCard } from '../../components/EventCard';
import { DiscoControlBar } from '../../components/common/DiscoControlBar';
import { getEventTiming, sortEventsByTiming } from '../../utils/timeUtils';

export const EventsCatalogPage: React.FC = () => {
  const { events, setSelectedEvent } = useFest();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'LIVE_SOON' | 'UPCOMING' | 'EXPIRED'>('ALL');
  const [sortBy, setSortBy] = useState<string>('TIMING_CHRONOLOGICAL');
  const [viewMode, setViewMode] = useState<'GRID' | 'GROUPED'>('GRID');

  // Filter events
  const filteredEvents = events.filter((e) => {
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

  const sortedEvents = sortEventsByTiming(filteredEvents, sortBy);

  const handleSelectSeats = (event: FestEvent) => {
    setSelectedEvent(event);
    navigate(`/events/${event.id}/seats`);
  };

  // Groupings for Grouped View
  const liveGroup = sortedEvents.filter((e) => getEventTiming(e).isLive);
  const startingSoonGroup = sortedEvents.filter((e) => getEventTiming(e).status === 'STARTING_SOON');
  const upcomingGroup = sortedEvents.filter((e) => getEventTiming(e).status === 'UPCOMING');
  const expiredGroup = sortedEvents.filter((e) => getEventTiming(e).isExpired);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF3E41]/25 text-[#FF7099] border border-[#FF3E41]/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              OFFICIAL STAGES CATALOG
            </span>
            <span className="text-xs text-white/50 font-mono hidden sm:inline">
              Real-Time Chronological Schedule &bull; Strict 2PL
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight mt-1">
            FESTIVAL STAGES &amp; PASSES
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-white/60">Showing:</span>
          <span className="px-2.5 py-1 rounded-xl bg-[#4C3549] text-white font-bold border border-white/10">
            {sortedEvents.length} of {events.length} Shows
          </span>
        </div>
      </div>

      {/* 2. DISCO LIGHTS CONTROL BAR (Top Bar with Disco Lights, Search, Popdowns) */}
      <DiscoControlBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={sortedEvents.length}
      />

      {/* 3. Event Catalog Content */}
      {sortedEvents.length === 0 ? (
        <EmptyState
          title="No Matching Festival Events"
          description="No events match your current real-time filter or search query."
          actionText="Reset All Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('ALL');
            setTimeFilter('ALL');
          }}
        />
      ) : viewMode === 'GRID' ? (
        /* Unified Modern Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} onSelectSeats={handleSelectSeats} />
          ))}
        </div>
      ) : (
        /* Categorized Swimlanes Grouped View */
        <div className="space-y-8 font-mono">
          {/* Live Now Section */}
          {liveGroup.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-red-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h2 className="text-sm font-black text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-4 h-4" />
                  🔴 LIVE ON STAGE RIGHT NOW ({liveGroup.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveGroup.map((event) => (
                  <EventCard key={event.id} event={event} onSelectSeats={handleSelectSeats} />
                ))}
              </div>
            </div>
          )}

          {/* Starting Soon Section */}
          {startingSoonGroup.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#FF3E41]/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3E41]" />
                <h2 className="text-sm font-black text-[#FF7099] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-[#FF7099]" />
                  ⚡ COMING UP NEXT (IN &lt; 2 HOURS) ({startingSoonGroup.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {startingSoonGroup.map((event) => (
                  <EventCard key={event.id} event={event} onSelectSeats={handleSelectSeats} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Lineup Section */}
          {upcomingGroup.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Calendar className="w-4 h-4 text-white/50" />
                <h2 className="text-sm font-black text-white/80 uppercase tracking-wider">
                  📅 UPCOMING FESTIVAL SCHEDULE ({upcomingGroup.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingGroup.map((event) => (
                  <EventCard key={event.id} event={event} onSelectSeats={handleSelectSeats} />
                ))}
              </div>
            </div>
          )}

          {/* Concluded Shows Section */}
          {expiredGroup.length > 0 && (
            <div className="space-y-4 pt-4 opacity-75">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Clock className="w-4 h-4 text-white/30" />
                <h2 className="text-sm font-black text-white/40 uppercase tracking-wider">
                  ⏱️ CONCLUDED / PAST SHOWS ({expiredGroup.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expiredGroup.map((event) => (
                  <EventCard key={event.id} event={event} onSelectSeats={handleSelectSeats} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
