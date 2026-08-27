import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { events, setSelectedEvent } = useFest();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div>
        <Breadcrumbs
          items={[{ label: 'Events Catalog', path: '/events' }, { label: 'Event Not Found' }]}
          backLink={{ label: 'Back to Events', path: '/events' }}
        />
        <EmptyState
          title="Event Not Found"
          description="The requested event does not exist in the festival schedule."
          actionText="Browse Available Events"
          actionPath="/events"
        />
      </div>
    );
  }

  const handleSelectSeats = () => {
    setSelectedEvent(event);
    navigate(`/events/${event.id}/seats`);
  };

  const isLowStock = event.availableSeats <= 4;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Events Catalog', path: '/events' },
          { label: event.title },
        ]}
        backLink={{ label: 'Back to Events', path: '/events' }}
      />

      {/* Main Event Card Header */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-[#883955] text-white">
              {event.category.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-white/10 text-white/80">
              {event.tag}
            </span>
          </div>

          {isLowStock ? (
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold text-[#FF3E41] bg-[#FF3E41]/20 border border-[#FF3E41]/40 flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>CRITICAL CONTENTION • ONLY {event.availableSeats} SEATS LEFT</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold text-[#FF7099] bg-[#883955]/30 border border-[#883955]/50">
              {event.availableSeats} SEATS AVAILABLE
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide">
            {event.title}
          </h1>
          <p className="text-sm sm:text-base text-[#FF7099] font-mono font-semibold">
            Starring: {event.artistOrHost}
          </p>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
          <div className="bg-[#2A1D26] p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#FF7099] shrink-0" />
            <div>
              <div className="text-[10px] text-white/40 uppercase">Date</div>
              <div className="font-bold text-white text-sm">{event.date}</div>
            </div>
          </div>

          <div className="bg-[#2A1D26] p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#FF7099] shrink-0" />
            <div>
              <div className="text-[10px] text-white/40 uppercase">Show Timing</div>
              <div className="font-bold text-white text-sm">{event.time}</div>
            </div>
          </div>

          <div className="bg-[#2A1D26] p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#FF7099] shrink-0" />
            <div>
              <div className="text-[10px] text-white/40 uppercase">Venue Location</div>
              <div className="font-bold text-white text-sm truncate">{event.venue}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Seat Tiers Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-white font-display tracking-wide">
              ABOUT THIS SHOW & VENUE
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans-body">
              {event.shortDesc}
            </p>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans-body">
              Entry opens 45 minutes prior to show time. Present the QR code on your verified digital
              ticket at the Gate Staff check-in counters.
            </p>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-xs font-mono font-bold text-[#FF7099] uppercase tracking-wider mb-3">
                DBMS ACID Reservation Guarantee:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strict 2PL Isolation:</strong>
                    <p className="text-[11px] text-white/60">Zero double-booking risk during high contention spikes.</p>
                  </div>
                </div>

                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">3-Minute Exclusive Lock:</strong>
                    <p className="text-[11px] text-white/60">Pessimistic lease locks your seat while you checkout.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 space-y-5 shadow-xl">
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              TIER PRICING BREAKDOWN
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#2A1D26] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">VIP FRONT ROW</div>
                  <div className="text-[10px] text-white/50">Rows A–B • Stage Front</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#FF7099] text-sm">₹{Math.round(event.basePrice * 1.5)}</div>
                  <div className="text-[10px] text-white/40">1.5x Multiplier</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#2A1D26] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">GOLD CENTER</div>
                  <div className="text-[10px] text-white/50">Rows C–D • Prime Acoustic</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#FF7099] text-sm">₹{Math.round(event.basePrice * 1.25)}</div>
                  <div className="text-[10px] text-white/40">1.25x Multiplier</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#2A1D26] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">REGULAR SEATING</div>
                  <div className="text-[10px] text-white/50">Rows E–F • Standard View</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white text-sm">₹{event.basePrice}</div>
                  <div className="text-[10px] text-white/40">Base Pass</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSelectSeats}
              className="w-full py-3.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Select Seats on Venue Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
