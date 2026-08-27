import React, { useState, useEffect } from 'react';
import { useFest } from '../context/FestContext';
import { FestEvent, Seat } from '../types';
import { X, Clock, AlertTriangle, Check, ShieldAlert, Zap, ArrowRight } from 'lucide-react';

interface SeatPickerModalProps {
  event: FestEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const SeatPickerModal: React.FC<SeatPickerModalProps> = ({
  event,
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const { selectSeatForBooking, releaseActiveSeat, activeSeat, seatLockTimeRemaining } = useFest();
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const handleSeatClick = (seat: Seat) => {
    setErrorMessage(null);

    if (seat.status === 'booked') {
      setErrorMessage(`Seat ${seat.row}-${seat.number} is already booked and committed to database.`);
      return;
    }

    if (seat.status === 'locked') {
      setErrorMessage(
        `EXCLUSIVE HOLD ACTIVE: Seat ${seat.row}-${seat.number} is temporarily held by another active user session.`
      );
      return;
    }

    if (seat.status === 'selected' && activeSeat?.id === seat.id) {
      // Toggle off / release
      releaseActiveSeat();
      return;
    }

    // Attempt to acquire exclusive hold
    const success = selectSeatForBooking(event, seat);
    if (!success) {
      setErrorMessage('Failed to acquire lock. Seat status changed concurrently.');
    }
  };

  // Group seats by row
  const rowsMap: { [row: string]: Seat[] } = {};
  event.seats.forEach((seat) => {
    if (!rowsMap[seat.row]) {
      rowsMap[seat.row] = [];
    }
    rowsMap[seat.row].push(seat);
  });

  const rowKeys = Object.keys(rowsMap).sort();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e121a] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#121620] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
                {event.category}
              </span>
              <span className="text-xs text-white/50 font-mono">SEAT ALLOCATION MATRIX</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-1">{event.title}</h2>
            <p className="text-xs text-white/60">{event.venue} • {event.date}</p>
          </div>

          <button
            onClick={() => {
              releaseActiveSeat();
              onClose();
            }}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Hold Countdown Banner */}
        {activeSeat && seatLockTimeRemaining > 0 && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-5 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Clock className="w-4 h-4 animate-spin text-amber-400" />
              <span>
                Exclusive hold on Seat [{activeSeat.row}-{activeSeat.number}] (₹{activeSeat.price})
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-white/60 text-[11px]">Hold Expires in:</span>
              <span className="bg-amber-400 text-black px-2 py-0.5 rounded font-bold">
                {Math.floor(seatLockTimeRemaining / 60)}:
                {(seatLockTimeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        {/* Error / Conflict Alert */}
        {errorMessage && (
          <div className="bg-red-500/15 border-b border-red-500/30 px-5 py-2 flex items-center gap-2 text-xs text-red-300 font-mono">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Interactive Seating Canvas */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
          {/* Stage Graphic */}
          <div className="w-full max-w-md mb-8 text-center">
            <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#ccff00] to-transparent rounded-full shadow-[0_0_15px_rgba(204,255,0,0.6)]" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-white/50 mt-2">
              ▼ MAIN FESTIVAL STAGE / AUDIO RIG ▼
            </p>
          </div>

          {/* Seat Grid */}
          <div className="space-y-3 w-full max-w-lg">
            {rowKeys.map((rowName) => {
              const rowSeats = rowsMap[rowName];
              const isVIP = rowName === 'A' || rowName === 'B';
              const isGold = rowName === 'C' || rowName === 'D';

              return (
                <div key={rowName} className="flex items-center justify-center gap-2">
                  <span className="w-6 text-xs font-mono font-bold text-white/40 text-right">{rowName}</span>

                  <div className="flex items-center gap-2">
                    {rowSeats.map((seat) => {
                      const isSelected = activeSeat?.id === seat.id;
                      const isLockedByOther = seat.status === 'locked' && !isSelected;
                      const isBooked = seat.status === 'booked';
                      const isAvailable = seat.status === 'available' || (seat.status === 'selected' && !isSelected);

                      let seatClass = '';
                      if (isSelected) {
                        seatClass =
                          'bg-[#ccff00] text-black font-bold border-2 border-white shadow-[0_0_15px_rgba(204,255,0,0.8)] scale-110 z-10';
                      } else if (isLockedByOther) {
                        seatClass =
                          'bg-amber-500/20 text-amber-300 border border-amber-500/50 cursor-not-allowed animate-pulse';
                      } else if (isBooked) {
                        seatClass = 'bg-[#181d27] text-white/20 border border-white/5 cursor-not-allowed';
                      } else {
                        // Available
                        seatClass = isVIP
                          ? 'bg-[#141a24] text-white border border-[#ccff00]/40 hover:border-[#ccff00] hover:bg-[#ccff00]/10 hover:scale-105'
                          : isGold
                          ? 'bg-[#141a24] text-white border border-[#00e5ff]/40 hover:border-[#00e5ff] hover:bg-[#00e5ff]/10 hover:scale-105'
                          : 'bg-[#141a24] text-white/80 border border-white/20 hover:border-white/60 hover:scale-105';
                      }

                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          onMouseEnter={() => setHoveredSeat(seat)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`w-8 h-8 rounded-lg text-xs font-mono flex items-center justify-center transition-all relative ${seatClass}`}
                          title={`Seat ${seat.row}${seat.number} - ₹${seat.price} (${seat.status})`}
                        >
                          {isSelected ? <Check className="w-4 h-4 text-black stroke-[3]" /> : seat.number}
                        </button>
                      );
                    })}
                  </div>

                  <span className="w-6 text-xs font-mono font-bold text-white/40 text-left">{rowName}</span>
                </div>
              );
            })}
          </div>

          {/* Hovered Seat Telemetry Tooltip */}
          <div className="h-10 mt-6 flex items-center justify-center text-xs font-mono">
            {hoveredSeat ? (
              <div className="bg-[#121620] px-4 py-1.5 rounded-xl border border-white/10 flex items-center gap-3">
                <span className="font-bold text-white">
                  Seat [{hoveredSeat.row}-{hoveredSeat.number}]
                </span>
                <span className="text-white/60">Category: {hoveredSeat.category}</span>
                <span className="text-[#ccff00] font-bold">₹{hoveredSeat.price}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    hoveredSeat.status === 'available'
                      ? 'bg-[#ccff00]/20 text-[#ccff00]'
                      : hoveredSeat.status === 'locked'
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  STATUS: {hoveredSeat.status.toUpperCase()}
                  {hoveredSeat.status === 'locked' && ' (Held by Concurrent Student)'}
                </span>
              </div>
            ) : (
              <span className="text-white/40">Hover over any seat to inspect state and locks</span>
            )}
          </div>

          {/* Seat Status Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#090b10] p-3.5 rounded-2xl border border-white/10 w-full mt-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#141a24] border border-[#ccff00]/40" />
              <div>
                <p className="text-xs font-semibold text-white">Available</p>
                <p className="text-[9px] text-white/40 font-mono">Selectable</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#ccff00] text-black flex items-center justify-center font-bold text-[10px]">
                ✓
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Selected (You)</p>
                <p className="text-[9px] text-[#ccff00] font-mono">3-min Hold Lock</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500/30 border border-amber-500/60 animate-pulse" />
              <div>
                <p className="text-xs font-semibold text-white">Locked</p>
                <p className="text-[9px] text-amber-300 font-mono">Held by other user</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#181d27] border border-white/5" />
              <div>
                <p className="text-xs font-semibold text-white">Booked</p>
                <p className="text-[9px] text-white/40 font-mono">Committed to DB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-[#121620] flex items-center justify-between">
          <div>
            {activeSeat ? (
              <div>
                <p className="text-[10px] text-white/50 font-mono uppercase">Held Seat</p>
                <p className="text-sm font-bold text-white font-mono">
                  [{activeSeat.row}-{activeSeat.number}] • ₹{activeSeat.price} ({activeSeat.category})
                </p>
              </div>
            ) : (
              <p className="text-xs text-white/50">Please select an available seat to proceed.</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                releaseActiveSeat();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={onProceedToCheckout}
              disabled={!activeSeat}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
                activeSeat
                  ? 'bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-102'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Proceed to Booking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
