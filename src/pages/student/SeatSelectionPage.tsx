import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Seat, FestEvent } from '../../types';
import { Ticket, ArrowRight, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

function findNearbyAvailableSeats(event: FestEvent, targetSeat: Seat, count = 3): Seat[] {
  const available = event.seats.filter(
    (s) => s.status === 'available' && s.id !== targetSeat.id
  );

  const rowOrder = ['A', 'B', 'C', 'D', 'E', 'F'];
  const targetRowIdx = rowOrder.indexOf(targetSeat.row);

  return available
    .map((s) => {
      const sRowIdx = rowOrder.indexOf(s.row);
      const rowDiff = Math.abs((sRowIdx === -1 ? 0 : sRowIdx) - (targetRowIdx === -1 ? 0 : targetRowIdx));
      const colDiff = Math.abs(s.number - targetSeat.number);
      const sameCategoryBonus = s.category === targetSeat.category ? 0 : 5;
      const distanceScore = rowDiff * 10 + colDiff + sameCategoryBonus;
      return { seat: s, score: distanceScore };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map((item) => item.seat);
}

export const SeatSelectionPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { events, activeSeat, selectSeatForBooking, releaseActiveSeat } = useFest();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();

  const event = events.find((e) => e.id === eventId) || events[0];

  // Local selection before checkout lock
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(() => {
    if (activeSeat && event && activeSeat.id.startsWith(event.id)) {
      return activeSeat;
    }
    return null;
  });

  const [conflictData, setConflictData] = useState<{
    seat: Seat;
    nearbySeats: Seat[];
    reason?: string;
  } | null>(null);

  const handleSeatClick = (seat: Seat) => {
    // If seat is already booked or locked by someone else
    if (seat.status === 'booked' || seat.status === 'locked') {
      const nearby = findNearbyAvailableSeats(event, seat, 3);
      setConflictData({
        seat,
        nearbySeats: nearby,
        reason:
          seat.status === 'booked'
            ? `Seat [${seat.row}-${seat.number}] is already booked by another student.`
            : `Seat [${seat.row}-${seat.number}] is currently held in another checkout session.`,
      });
      return;
    }

    setConflictData(null);

    // Toggle local selection
    if (selectedSeat?.id === seat.id) {
      setSelectedSeat(null);
      if (activeSeat?.id === seat.id) {
        releaseActiveSeat();
      }
    } else {
      setSelectedSeat(seat);
      if (activeSeat && activeSeat.id !== seat.id) {
        releaseActiveSeat();
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (!selectedSeat) return;

    // Check latest real-time status in database/context
    const latestSeat = event.seats.find((s) => s.id === selectedSeat.id);

    if (!latestSeat || latestSeat.status !== 'available') {
      // Seat was booked or locked while viewing
      const nearby = findNearbyAvailableSeats(event, selectedSeat, 3);
      setConflictData({
        seat: selectedSeat,
        nearbySeats: nearby,
        reason: `Seat [${selectedSeat.row}-${selectedSeat.number}] was booked by another attendee while you were viewing!`,
      });
      setSelectedSeat(null);
      return;
    }

    // Acquire lock at checkout transition
    const ok = selectSeatForBooking(event, latestSeat);
    if (!ok) {
      const nearby = findNearbyAvailableSeats(event, latestSeat, 3);
      setConflictData({
        seat: latestSeat,
        nearbySeats: nearby,
        reason: `Lock conflict: Seat [${latestSeat.row}-${latestSeat.number}] was just secured by another checkout.`,
      });
      setSelectedSeat(null);
      return;
    }

    navigate(`/checkout/${event.id}`);
  };

  const handleSelectRecommendedSeat = (seat: Seat) => {
    setSelectedSeat(seat);
    setConflictData(null);
  };

  // Group seats by row
  const rowsMap: { [row: string]: Seat[] } = {};
  event.seats.forEach((s) => {
    if (!rowsMap[s.row]) rowsMap[s.row] = [];
    rowsMap[s.row].push(s);
  });

  const displaySeat = selectedSeat || (activeSeat && activeSeat.id.startsWith(event.id) ? activeSeat : null);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Events Catalog', path: '/events' },
          { label: event.title, path: `/events/${event.id}` },
          { label: 'Seat Map Selection' },
        ]}
        backLink={{ label: 'Back to Event Details', path: `/events/${event.id}` }}
      />

      {/* Conflict & Recommended Seats Banner */}
      <AnimatePresence>
        {conflictData && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="bg-red-500/15 border-2 border-red-500/40 rounded-3xl p-5 shadow-2xl space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/25 border border-red-500/40 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-red-200 font-display tracking-wide">
                    SEAT CONFLICT DETECTED
                  </h4>
                  <p className="text-xs text-red-300 font-mono">
                    {conflictData.reason ||
                      `Seat [${conflictData.seat.row}-${conflictData.seat.number}] was booked while you were viewing.`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConflictData(null)}
                className="text-white/50 hover:text-white font-mono text-base px-2 py-0.5 rounded cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Recommended Nearby Seats */}
            {conflictData.nearbySeats.length > 0 && (
              <div className="pt-2 border-t border-red-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/80 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7099]" />
                  <span>Recommended nearby available seats:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {conflictData.nearbySeats.map((recSeat) => (
                    <button
                      key={recSeat.id}
                      type="button"
                      onClick={() => handleSelectRecommendedSeat(recSeat)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#883955]/50 hover:bg-[#883955] border border-white/20 hover:border-[#FF7099] text-white text-xs font-mono font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer group"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] group-hover:scale-110 transition-transform" />
                      <span>
                        Seat {recSeat.row}-{recSeat.number} ({recSeat.category.replace('_', ' ')})
                      </span>
                      <span className="text-[#FF7099]">₹{recSeat.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Venue Seat Map + Summary Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2A1D26] via-[#883955] to-[#2A1D26] border border-white/20 text-center font-mono font-black text-xs tracking-widest text-white shadow-inner uppercase">
            STAGE &bull; SCREEN PROJECTION AREA
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 py-2 border-y border-white/10 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#883955]/40 border border-[#FF7099]/60" />
              <span className="text-white/80">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#FF3E41] border border-white" />
              <span className="text-white font-bold">Selected Seat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#F59E0B]/30 border border-[#F59E0B]" />
              <span className="text-amber-300">Locked (In Checkout)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#2A1D26] border border-white/10 opacity-40" />
              <span className="text-white/40">Booked</span>
            </div>
          </div>

          <div className="space-y-4 py-4 max-w-2xl mx-auto overflow-x-auto">
            {Object.keys(rowsMap).map((rowKey, rIdx) => {
              const rowSeats = rowsMap[rowKey];
              const tierLabel =
                rowKey === 'A' || rowKey === 'B'
                  ? 'VIP FRONT (₹' + Math.round(event.basePrice * 1.5) + ')'
                  : rowKey === 'C' || rowKey === 'D'
                  ? 'GOLD (₹' + Math.round(event.basePrice * 1.25) + ')'
                  : 'REGULAR (₹' + event.basePrice + ')';

              return (
                <motion.div
                  key={rowKey}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rIdx * 0.04, duration: 0.2 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50 px-2">
                    <span className="font-bold text-white/70">ROW {rowKey}</span>
                    <span>{tierLabel}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    {rowSeats.map((seat, idx) => {
                      const isSelected = displaySeat?.id === seat.id;
                      const isLocked = seat.status === 'locked';
                      const isBooked = seat.status === 'booked';

                      const isAisleBreak = idx === Math.floor(rowSeats.length / 2);

                      let seatClass =
                        'w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer border';

                      if (isSelected) {
                        seatClass += ' bg-[#FF3E41] text-white border-white shadow-lg ring-2 ring-[#FF7099]';
                      } else if (isLocked) {
                        seatClass +=
                          ' bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40 hover:border-[#F59E0B]';
                      } else if (isBooked) {
                        seatClass +=
                          ' bg-[#2A1D26] text-white/20 border-white/5 cursor-not-allowed opacity-50';
                      } else {
                        seatClass +=
                          ' bg-[#883955]/30 text-white border-[#883955]/60 hover:bg-[#883955] hover:border-white/40';
                      }

                      return (
                        <React.Fragment key={seat.id}>
                          {isAisleBreak && <div className="w-4 sm:w-6" />}
                          <motion.button
                            type="button"
                            whileTap={!isBooked && !isLocked ? { scale: 1.15 } : undefined}
                            animate={
                              isLocked
                                ? { opacity: [0.6, 1, 0.6] }
                                : isSelected
                                ? { scale: [1, 1.06, 1] }
                                : { opacity: 1 }
                            }
                            transition={
                              isLocked
                                ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                                : isSelected
                                ? { duration: 0.25 }
                                : undefined
                            }
                            onClick={() => handleSeatClick(seat)}
                            disabled={isBooked}
                            className={seatClass}
                            title={`Seat ${seat.row}-${seat.number} (${seat.category}): ₹${seat.price}`}
                          >
                            {seat.number}
                          </motion.button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Persistent Booking Summary Panel */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              RESERVATION SUMMARY
            </h2>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Selected Event</div>
                <div className="font-bold text-white text-sm">{event.title}</div>
                <div className="text-white/60">{event.date} &bull; {event.time}</div>
                <div className="text-white/40 truncate">{event.venue}</div>
              </div>

              <AnimatePresence mode="wait">
                {displaySeat ? (
                  <motion.div
                    key={displaySeat.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-3.5 rounded-xl bg-[#883955]/40 border border-[#FF7099]/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/60 uppercase">Selected Seat</span>
                      <span className="px-2 py-0.5 rounded bg-[#FF3E41] text-white font-bold text-[10px]">
                        SELECTED
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-white">
                        Seat {displaySeat.row}-{displaySeat.number}
                      </span>
                      <span className="text-base font-black text-[#FF7099]">
                        ₹{displaySeat.price}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/70">
                      Tier: {displaySeat.category.replace('_', ' ')}
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-5 rounded-xl bg-[#2A1D26] border border-dashed border-white/20 text-center text-white/50 text-xs">
                    <Ticket className="w-6 h-6 mx-auto mb-2 text-white/30" />
                    <span>Click any available seat to select it before checkout.</span>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {displaySeat && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF3E41] to-[#DF367C] hover:opacity-95 text-white text-xs font-bold font-mono transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
