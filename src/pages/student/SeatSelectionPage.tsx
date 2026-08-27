import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Seat } from '../../types';
import { Clock, Ticket, ArrowRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const SeatSelectionPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { events, activeSeat, seatLockTimeRemaining, selectSeatForBooking, releaseActiveSeat } = useFest();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();

  const [conflictMsg, setConflictMsg] = useState<string | null>(null);

  const event = events.find((e) => e.id === eventId) || events[0];

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeatClick = (seat: Seat) => {
    setConflictMsg(null);

    if (seat.status === 'booked') {
      setConflictMsg(`Seat [${seat.row}-${seat.number}] is already booked and unavailable.`);
      return;
    }

    if (seat.status === 'locked') {
      setConflictMsg(`Locked — held by another user in real time.`);
      return;
    }

    if (activeSeat?.id === seat.id) {
      releaseActiveSeat();
      return;
    }

    const ok = selectSeatForBooking(event, seat);
    if (!ok) {
      setConflictMsg(`Seat just taken — pick another seat.`);
    }
  };

  const handleProceedToCheckout = () => {
    if (!activeSeat) return;
    navigate(`/checkout/${event.id}`);
  };

  // Group seats by row
  const rowsMap: { [row: string]: Seat[] } = {};
  event.seats.forEach((s) => {
    if (!rowsMap[s.row]) rowsMap[s.row] = [];
    rowsMap[s.row].push(s);
  });

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

      {/* Sticky Top Notification Bar if Seat is Held */}
      <AnimatePresence>
        {activeSeat && seatLockTimeRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-[#4C3549] border-2 border-[#FF3E41] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF3E41] text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <span>SEAT [{activeSeat.row}-{activeSeat.number}] EXCLUSIVELY HELD</span>
                  <motion.span
                    animate={{
                      backgroundColor:
                        seatLockTimeRemaining <= 10
                          ? ['#FF3E41', '#FF0000', '#FF3E41']
                          : seatLockTimeRemaining <= 30
                          ? ['#FF3E41', '#f59e0b', '#FF3E41']
                          : ['#FF3E41'],
                    }}
                    transition={{
                      duration: seatLockTimeRemaining <= 10 ? 0.6 : 1.5,
                      repeat: Infinity,
                    }}
                    className="px-2 py-0.5 rounded text-white text-[11px] font-bold"
                  >
                    {formatTimer(seatLockTimeRemaining)} Remaining
                  </motion.span>
                </div>
                <p className="text-[11px] text-white/70 font-sans-body">
                  3-minute pessimistic lease lock active. Complete checkout before timer expires.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={releaseActiveSeat}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors cursor-pointer"
              >
                Release Seat
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleProceedToCheckout}
                className="px-5 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conflict Alert Banner */}
      <AnimatePresence>
        {conflictMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 text-red-300 text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{conflictMsg}</span>
            </div>
            <button
              onClick={() => setConflictMsg(null)}
              className="text-white/60 hover:text-white font-bold cursor-pointer"
            >
              &times;
            </button>
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
              <span className="text-white font-bold">Your Selected Seat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#F59E0B]/30 border border-[#F59E0B]" />
              <span className="text-amber-300">Locked (Other User)</span>
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
                      const isSelectedByMe = activeSeat?.id === seat.id;
                      const isLocked = seat.status === 'locked';
                      const isBooked = seat.status === 'booked';

                      const isAisleBreak = idx === Math.floor(rowSeats.length / 2);

                      let seatClass =
                        'w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer border';

                      if (isSelectedByMe) {
                        seatClass += ' bg-[#FF3E41] text-white border-white shadow-lg';
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
                            whileTap={!isBooked && !isLocked ? { scale: 1.18 } : undefined}
                            animate={
                              isLocked
                                ? { opacity: [0.6, 1, 0.6] }
                                : isSelectedByMe
                                ? { scale: [1, 1.05, 1] }
                                : { opacity: 1 }
                            }
                            transition={
                              isLocked
                                ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                                : isSelectedByMe
                                ? { duration: 0.3 }
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
                <div className="text-white/60">{event.date} • {event.time}</div>
                <div className="text-white/40 truncate">{event.venue}</div>
              </div>

              <AnimatePresence mode="wait">
                {activeSeat ? (
                  <motion.div
                    key={activeSeat.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-3.5 rounded-xl bg-[#883955]/40 border border-[#FF7099]/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/60 uppercase">Selected Seat</span>
                      <span className="px-2 py-0.5 rounded bg-[#FF3E41] text-white font-bold text-[10px]">
                        HELD
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-white">
                        Seat {activeSeat.row}-{activeSeat.number}
                      </span>
                      <span className="text-base font-black text-[#FF7099]">
                        ₹{activeSeat.price}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/70">
                      Tier: {activeSeat.category.replace('_', ' ')}
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-5 rounded-xl bg-[#2A1D26] border border-dashed border-white/20 text-center text-white/50 text-xs">
                    <Ticket className="w-6 h-6 mx-auto mb-2 text-white/30" />
                    <span>Click an available seat on the venue map to hold it for 3 minutes.</span>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {activeSeat && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
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
