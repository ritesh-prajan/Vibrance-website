import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Ticket,
  Calendar,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { myBookings, cancelBooking } = useFest();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED'>('ALL');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const filtered = myBookings.filter((b) => {
    if (filterStatus === 'CONFIRMED') return b.status === 'confirmed';
    if (filterStatus === 'CHECKED_IN') return b.status === 'checked_in';
    if (filterStatus === 'CANCELLED') return b.status === 'cancelled';
    return true;
  });

  const handleConfirmCancel = () => {
    if (cancellingBooking) {
      cancelBooking(cancellingBooking.id);
      setCancellingBooking(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide">
            MY FESTIVAL PASSES & BOOKINGS
          </h1>
          <p className="text-xs text-white/60 font-mono mt-0.5">
            Manage your reserved seats, view e-tickets, or cancel upcoming bookings.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md shrink-0"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Browse More Events</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 text-xs font-mono">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
            filterStatus === 'ALL'
              ? 'bg-[#883955] text-white font-bold'
              : 'text-white/60 hover:text-white hover:bg-[#4C3549]'
          }`}
        >
          All Passes ({myBookings.length})
        </button>
        <button
          onClick={() => setFilterStatus('CONFIRMED')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
            filterStatus === 'CONFIRMED'
              ? 'bg-[#883955] text-white font-bold'
              : 'text-white/60 hover:text-white hover:bg-[#4C3549]'
          }`}
        >
          Upcoming / Confirmed ({myBookings.filter((b) => b.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setFilterStatus('CHECKED_IN')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
            filterStatus === 'CHECKED_IN'
              ? 'bg-[#883955] text-white font-bold'
              : 'text-white/60 hover:text-white hover:bg-[#4C3549]'
          }`}
        >
          Used / Checked In ({myBookings.filter((b) => b.status === 'checked_in').length})
        </button>
        <button
          onClick={() => setFilterStatus('CANCELLED')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
            filterStatus === 'CANCELLED'
              ? 'bg-[#883955] text-white font-bold'
              : 'text-white/60 hover:text-white hover:bg-[#4C3549]'
          }`}
        >
          Cancelled ({myBookings.filter((b) => b.status === 'cancelled').length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Ticket className="w-7 h-7" />}
          title="No Festival Passes Found"
          description="You don't have any bookings in this category yet. Explore the event catalog to reserve passes."
          actionText="Browse Festival Events"
          actionPath="/events"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-white/25 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#883955] text-white">
                    {b.eventCategory.replace('_', ' ')}
                  </span>
                  <StatusBadge status={b.status} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-display tracking-wide">
                    {b.eventTitle}
                  </h3>
                  <p className="text-xs text-white/60 font-mono mt-0.5">{b.artistOrHost}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="w-3.5 h-3.5 text-[#FF7099]" />
                    <span>{b.eventDate} • {b.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin className="w-3.5 h-3.5 text-[#FF7099]" />
                    <span className="truncate">{b.eventVenue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <div>
                    <span className="text-white/40">Seat: </span>
                    <strong className="text-white">Seat {b.seatLabel} ({b.seatCategory})</strong>
                  </div>
                  <div>
                    <span className="text-white/40">Ref: </span>
                    <span className="text-[#FF7099] font-bold">{b.bookingRef}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 font-mono text-xs">
                <Link
                  to={`/ticket/${b.id}`}
                  className="px-4 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>View Pass</span>
                </Link>

                {b.status === 'confirmed' && (
                  <button
                    onClick={() => setCancellingBooking(b)}
                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                  >
                    Cancel Pass
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#4C3549] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white font-display">
                CANCEL FESTIVAL PASS?
              </h3>
              <p className="text-xs text-white/70 font-sans-body leading-relaxed">
                Are you sure you want to cancel your pass for <strong>{cancellingBooking.eventTitle}</strong> (Seat {cancellingBooking.seatLabel})?
              </p>
              <p className="text-[11px] text-white/50 font-mono">
                This transaction will be rolled back and the seat returned to the festival inventory.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => setCancellingBooking(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
              >
                Keep Pass
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
