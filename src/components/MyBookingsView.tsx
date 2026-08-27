import React, { useState } from 'react';
import { useFest } from '../context/FestContext';
import { Booking } from '../types';
import { ETicketCard } from './ETicketCard';
import { Ticket, Calendar, MapPin, QrCode, AlertCircle, Trash2, ArrowRight, Sparkles } from 'lucide-react';

interface MyBookingsViewProps {
  onBrowseEvents: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({ onBrowseEvents }) => {
  const { myBookings, cancelBooking, currentUser } = useFest();
  const [selectedPass, setSelectedPass] = useState<Booking | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);

  const confirmedBookings = myBookings.filter((b) => b.status === 'CONFIRMED');
  const cancelledBookings = myBookings.filter((b) => b.status === 'CANCELLED');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
              STUDENT WALLET
            </span>
            <span className="text-xs text-white/50 font-mono">REG: {currentUser?.regNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">My Festival Passes</h1>
          <p className="text-xs text-white/60">
            Cryptographically confirmed ticket allocations stored in ACID persistent session state.
          </p>
        </div>

        <button
          onClick={onBrowseEvents}
          className="px-4 py-2.5 rounded-xl bg-[#121620] hover:bg-[#1a202c] border border-white/15 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Ticket className="w-4 h-4 text-[#ccff00]" />
          <span>Browse More Events</span>
          <ArrowRight className="w-3.5 h-3.5 text-white/40" />
        </button>
      </div>

      {/* Confirmed Passes Grid */}
      {confirmedBookings.length === 0 ? (
        <div className="bg-[#0e121a] border border-dashed border-white/15 rounded-3xl p-12 text-center max-w-lg mx-auto">
          <Ticket className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No active festival passes yet</h3>
          <p className="text-xs text-white/50 mt-1 mb-6">
            Reserve a seat in the event catalog to trigger the 2-Phase Locking booking flow.
          </p>
          <button
            onClick={onBrowseEvents}
            className="px-5 py-2.5 rounded-xl bg-[#ccff00] text-black font-bold text-xs shadow-lg hover:bg-[#b8e600]"
          >
            Explore Fest Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {confirmedBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-[#0e121a] hover:bg-[#121722] border border-white/15 hover:border-white/25 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">
                    {booking.eventCategory}
                  </span>
                  <span className="text-[10px] font-mono text-[#ccff00] font-bold bg-[#ccff00]/10 px-2 py-0.5 rounded border border-[#ccff00]/30">
                    CONFIRMED PASS
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#ccff00] transition-colors leading-snug">
                  {booking.eventTitle}
                </h3>
                <p className="text-xs text-white/60 mt-0.5">{booking.artistOrHost}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 bg-[#080a0f] p-3 rounded-xl border border-white/10 text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-white/40 block">SEAT ASSIGNMENT</span>
                    <span className="text-sm font-bold text-[#ccff00]">{booking.seatLabel}</span>
                    <span className="text-[10px] text-white/50 block">({booking.seatCategory})</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 block">BOOKING REF</span>
                    <span className="text-xs font-bold text-white truncate block">{booking.bookingRef}</span>
                    <span className="text-[10px] text-white/50 block">₹{booking.amount} Paid</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-white/60 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-white/40" />
                    <span>{booking.eventDate} • {booking.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-white/40" />
                    <span className="truncate">{booking.eventVenue}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-white/10">
                <button
                  onClick={() => setCancelModalBooking(booking)}
                  className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1 hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Cancel Pass
                </button>

                <button
                  onClick={() => setSelectedPass(booking)}
                  className="px-4 py-2 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                >
                  <QrCode className="w-3.5 h-3.5" /> View E-Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancelled History */}
      {cancelledBookings.length > 0 && (
        <div className="mt-12">
          <h3 className="text-sm font-bold text-white/60 font-mono uppercase tracking-wider mb-3">
            Cancelled / Released Passes ({cancelledBookings.length})
          </h3>
          <div className="space-y-2">
            {cancelledBookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#0e121a]/50 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs text-white/40 font-mono"
              >
                <div>
                  <span className="text-white/60 font-bold">{b.eventTitle}</span> — Seat [{b.seatLabel}] (Ref: {b.bookingRef})
                </div>
                <span className="text-red-400/80 bg-red-400/10 px-2 py-0.5 rounded text-[10px]">
                  ROLLED BACK & RELEASED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pass Modal */}
      {selectedPass && (
        <ETicketCard booking={selectedPass} isModal={true} onClose={() => setSelectedPass(null)} />
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121620] border border-white/20 rounded-2xl max-w-md w-full p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Cancel & Release Pass?</h3>
            <p className="text-xs text-white/70 mt-2 mb-6">
              This will execute a <strong>Compensating Rollback Transaction</strong> in the DBMS, unlocking Seat [
              {cancelModalBooking.seatLabel}] and returning it back to the active festival inventory pool.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10"
              >
                Keep Ticket
              </button>
              <button
                onClick={() => {
                  cancelBooking(cancelModalBooking.id);
                  setCancelModalBooking(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg"
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
