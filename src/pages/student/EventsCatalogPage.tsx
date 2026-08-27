import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { FestEvent } from '../../types';
import { Sparkles, Radio, Zap, Calendar, Clock } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { EventCard } from '../../components/EventCard';
import { DiscoControlBar } from '../../components/common/DiscoControlBar';
import { EventTimelineSwimlane } from '../../components/events/EventTimelineSwimlane';
import { useEventFilters } from '../../hooks/useEventFilters';

export const EventsCatalogPage: React.FC = () => {
  const { events, setSelectedEvent } = useFest();
  const navigate = useNavigate();

  const {
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
    totalCount,
    filteredCount,
  } = useEventFilters(events);

  const handleSelectSeats = (event: FestEvent) => {
    setSelectedEvent(event);
    navigate(`/events/${event.id}/seats`);
  };

  return (
    <div className="space-y-6">
      {/* Catalog Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
            {filteredCount} of {totalCount} Shows
          </span>
        </div>
      </header>

      {/* Top Disco Lights Control Bar */}
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
        totalResults={filteredCount}
      />

      {/* Listings Section */}
      {sortedEvents.length === 0 ? (
        <EmptyState
          title="No Matching Festival Events"
          description="No events match your current real-time filter or search query."
          actionText="Reset All Filters"
          onAction={resetFilters}
        />
      ) : viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} onSelectSeats={handleSelectSeats} />
          ))}
        </div>
      ) : (
        <div className="space-y-8 font-mono">
          <EventTimelineSwimlane
            title="🔴 LIVE ON STAGE RIGHT NOW"
            count={groups.live.length}
            icon={<Radio className="w-4 h-4 text-red-400 animate-ping" />}
            events={groups.live}
            onSelectSeats={handleSelectSeats}
            accentBorderClass="border-red-500/30"
          />

          <EventTimelineSwimlane
            title="⚡ COMING UP NEXT (IN < 2 HOURS)"
            count={groups.startingSoon.length}
            icon={<Zap className="w-4 h-4 fill-[#FF7099] text-[#FF7099]" />}
            events={groups.startingSoon}
            onSelectSeats={handleSelectSeats}
            accentBorderClass="border-[#FF3E41]/30"
          />

          <EventTimelineSwimlane
            title="📅 UPCOMING FESTIVAL SCHEDULE"
            count={groups.upcoming.length}
            icon={<Calendar className="w-4 h-4 text-white/50" />}
            events={groups.upcoming}
            onSelectSeats={handleSelectSeats}
            accentBorderClass="border-white/10"
          />

          <EventTimelineSwimlane
            title="⏱️ CONCLUDED / PAST SHOWS"
            count={groups.expired.length}
            icon={<Clock className="w-4 h-4 text-white/30" />}
            events={groups.expired}
            onSelectSeats={handleSelectSeats}
            accentBorderClass="border-white/10"
            opacityClass="opacity-75"
          />
        </div>
      )}
    </div>
  );
};
