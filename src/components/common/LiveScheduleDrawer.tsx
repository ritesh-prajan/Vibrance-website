import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFest } from '../../context/FestContext';
import { getEventTiming } from '../../utils/timeUtils';
import { Link, useNavigate } from 'react-router-dom';
import {
  Radio,
  Zap,
  ChevronRight,
  ChevronLeft,
  X,
  Ticket,
  Clock,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const LiveScheduleDrawer: React.FC = () => {
  const { events, setSelectedEvent } = useFest();
  const [isOpen, setIsOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const navigate = useNavigate();

  // Find live & next events
  const liveEvent = events.find((e) => getEventTiming(e).isLive);
  const liveTiming = liveEvent ? getEventTiming(liveEvent) : null;

  const nextEvent = events.find((e) => getEventTiming(e).status === 'STARTING_SOON') ||
    events.find((e) => getEventTiming(e).isUpcoming) || events[0];
  const nextTiming = nextEvent ? getEventTiming(nextEvent) : null;

  const handleSelectSeats = (event: any) => {
    setSelectedEvent(event);
    setIsOpen(false);
    navigate(`/events/${event.id}/seats`);
  };

  return (
    <>
      {/* ─── 1. Left Vertical Sticky Tab (Trigger Button) ─── */}
      {!isOpen && (
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden sm:flex"
        >
          <motion.button
            whileHover={{ x: 4, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen(true)}
            className="group bg-gradient-to-b from-[#FF3E41] via-[#DF367C] to-[#883955] text-white p-2.5 pl-3 rounded-r-2xl shadow-[0_0_25px_rgba(255,62,65,0.4)] border-r-2 border-y-2 border-white/25 flex items-center gap-2 cursor-pointer backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-1.5 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                className="font-mono font-black text-[11px] tracking-widest uppercase rotate-180 py-1"
              >
                LIVE &bull; NEXT SHOWS
              </span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* ─── 2. Slide-out Left Drawer ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Slide-out Sidebar Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-full sm:w-96 bg-[#2A1D26] border-r border-white/20 shadow-2xl z-50 flex flex-col justify-between overflow-hidden font-mono"
            >
              {/* Drawer Top Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#4C3549]/80 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF3E41] animate-pulse" />
                  <span className="font-display font-black text-white text-base tracking-wide">
                    FESTIVAL TELEMETRY
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="p-5 space-y-6 overflow-y-auto flex-1">
                {/* 🔴 LIVE STAGE CARD */}
                {liveEvent && liveTiming && (
                  <div className="bg-red-500/15 border-2 border-red-500/50 rounded-2xl p-4 space-y-3 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                        <Radio className="w-3 h-3 animate-ping" />
                        LIVE NOW
                      </span>
                      <span className="text-[10px] text-red-300 font-bold">{liveTiming.countdownText}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-white leading-snug">{liveEvent.title}</h4>
                      <p className="text-[11px] text-white/70 mt-0.5">{liveEvent.artistOrHost}</p>
                      <p className="text-[10px] text-white/50 mt-1">{liveEvent.venue}</p>
                    </div>

                    <button
                      onClick={() => handleSelectSeats(liveEvent)}
                      className="w-full py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Gate Admission (&#8377;{liveEvent.basePrice})</span>
                    </button>
                  </div>
                )}

                {/* ⚡ NEXT UPCOMING SHOW CARD */}
                {nextEvent && nextTiming && (
                  <div className="bg-[#4C3549] border-2 border-[#FF3E41]/50 rounded-2xl p-4 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF3E41] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-white" />
                        NEXT SHOW
                      </span>
                      <span className="text-[10px] text-[#FF7099] font-bold">{nextTiming.countdownText}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-white leading-snug">{nextEvent.title}</h4>
                      <p className="text-[11px] text-[#FF7099] mt-0.5">{nextTiming.formattedDate} &bull; {nextTiming.formattedTime}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/60">
                        <span>SEAT AVAILABILITY</span>
                        <span className="text-white font-bold">{nextEvent.availableSeats} / {nextEvent.totalSeats}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-[#FF3E41]" style={{ width: `${(nextEvent.bookedSeatsCount / nextEvent.totalSeats) * 100}%` }} />
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectSeats(nextEvent)}
                      className="w-full py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Reserve Seats (&#8377;{nextEvent.basePrice})</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                )}

                {/* Quick Schedule Overview */}
                <div className="space-y-2">
                  <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">All Stages Timeline</div>
                  <div className="space-y-1.5">
                    {events.map((ev) => {
                      const t = getEventTiming(ev);
                      return (
                        <div
                          key={ev.id}
                          onClick={() => handleSelectSeats(ev)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            t.isLive
                              ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                              : t.isExpired
                              ? 'bg-white/5 border-white/5 opacity-50'
                              : 'bg-[#4C3549]/50 border-white/10 hover:border-white/25 hover:bg-[#4C3549]'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="text-xs font-bold text-white truncate">{ev.title}</div>
                            <div className="text-[10px] text-white/50">{t.formattedDate}</div>
                          </div>
                          <span className={`text-[10px] font-bold shrink-0 ${t.isLive ? 'text-red-400' : t.isExpired ? 'text-white/40' : 'text-[#FF7099]'}`}>
                            {t.countdownText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ACID 2PL Status Guarantee */}
                <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-[11px] text-white/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Strict 2PL Engine</span>
                  </div>
                  <p className="text-[10px] leading-relaxed">
                    Seats are reserved under serialized pessimistic locks with automatic 3-minute lease timeouts.
                  </p>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-white/10 bg-[#4C3549]/80 backdrop-blur-xl">
                <Link
                  to="/events"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Full Event Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
