import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Booking } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';
import { ETicketCard } from '../../components/ETicketCard';
import { DiscoBookingControlBar } from '../../components/disco/DiscoBookingControlBar';
import { useBookingFilters } from '../../hooks/useBookingFilters';
import {
  Ticket,
  AlertTriangle,
  Radio,
  Sparkles,
  Scissors,
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { myBookings, cancelBooking } = useFest();
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const {
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
    totalCount,
    filteredCount,
  } = useBookingFilters(myBookings);

  const handleConfirmCancel = () => {
    if (cancellingBooking) {
      cancelBooking(cancellingBooking.id);
      setCancellingBooking(null);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF3E41]/25 text-[#FF7099] border border-[#FF3E41]/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              STUDENT PASS WALLET
            </span>
            <span className="text-xs text-white/50 font-mono hidden sm:inline">
              Physical Pass Lifecycle &bull; Real-Time Verification
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            MY FESTIVAL PASSES &amp; BOOKINGS
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/60 hidden sm:inline">
            {filteredCount} of {totalCount} Passes
          </span>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md shrink-0"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Browse More Shows</span>
          </Link>
        </div>
      </header>

      {/* DISCO LIGHTS CONTROL BAR (Top Bar with Disco Lights, Search, Popdowns) */}
      <DiscoBookingControlBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredCount}
      />

      {/* Ticket Cards Listing */}
      {sortedBookings.length === 0 ? (
        <EmptyState
          title="No Matching Festival Passes"
          description="You don't have any festival passes matching your current search or category filter."
          actionText="Reset All Filters"
          onAction={resetFilters}
        />
      ) : viewMode === 'GRID' ? (
        /* Unified List (Intact vs Torn) */
        <div className="space-y-6">
          {sortedBookings.map((booking) => (
            <ETicketCard
              key={booking.id}
              booking={booking}
              onCancel={(b) => setCancellingBooking(b)}
            />
          ))}
        </div>
      ) : (
        /* Categorized Swimlanes View */
        <div className="space-y-8">
          {/* Live Now Section */}
          {groups.live.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-red-500/30">
                <Radio className="w-4 h-4 text-red-400 animate-ping" />
                <h2 className="text-sm font-black text-red-400 uppercase tracking-wider">
                  🔴 LIVE RIGHT NOW ON STAGE ({groups.live.length})
                </h2>
              </div>
              <div className="space-y-6">
                {groups.live.map((booking) => (
                  <ETicketCard
                    key={booking.id}
                    booking={booking}
                    onCancel={(b) => setCancellingBooking(b)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active / Intact Passes Section */}
          {groups.intact.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#10B981]/30">
                <Ticket className="w-4 h-4 text-[#10B981]" />
                <h2 className="text-sm font-black text-[#10B981] uppercase tracking-wider">
                  🎟️ ACTIVE / UPCOMING PASSES (INTACT) ({groups.intact.length})
                </h2>
              </div>
              <div className="space-y-6">
                {groups.intact.map((booking) => (
                  <ETicketCard
                    key={booking.id}
                    booking={booking}
                    onCancel={(b) => setCancellingBooking(b)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Used & Expired Passes (Torn) Section */}
          {groups.torn.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Scissors className="w-4 h-4 text-white/40" />
                <h2 className="text-sm font-black text-white/50 uppercase tracking-wider">
                  ✂️ USED &amp; CONCLUDED PASSES (TORN) ({groups.torn.length})
                </h2>
              </div>
              <div className="space-y-6">
                {groups.torn.map((booking) => (
                  <ETicketCard
                    key={booking.id}
                    booking={booking}
                    onCancel={(b) => setCancellingBooking(b)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#4C3549] border border-white/20 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white font-display">Cancel Festival Pass?</h3>
            </div>
            <p className="text-xs text-white/70 font-sans-body leading-relaxed">
              Are you sure you want to cancel pass <strong>{cancellingBooking.bookingRef}</strong> for {cancellingBooking.eventTitle}? Seat {cancellingBooking.seatLabel} will be released back to festival inventory.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 font-mono text-xs">
              <button
                onClick={() => setCancellingBooking(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                Keep Pass
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
