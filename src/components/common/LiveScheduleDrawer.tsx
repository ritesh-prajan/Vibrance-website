import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFest } from '../../context/FestContext';
import { getEventTiming } from '../../utils/timeUtils';
import { Link, useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import {
  TelemetryTriggerTab,
  TelemetryLiveCard,
  TelemetryNextUpCard,
  TelemetryTimelineList,
  TelemetryConcurrencyBadge,
} from '../telemetry';

export const LiveScheduleDrawer: React.FC = () => {
  const { events, setSelectedEvent } = useFest();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const liveEvent = events.find((e) => getEventTiming(e).isLive);
  const liveTiming = liveEvent ? getEventTiming(liveEvent) : null;

  const nextEvent =
    events.find((e) => getEventTiming(e).status === 'STARTING_SOON') ||
    events.find((e) => getEventTiming(e).isUpcoming) ||
    events[0];
  const nextTiming = nextEvent ? getEventTiming(nextEvent) : null;

  const handleSelectSeats = (event: any) => {
    setSelectedEvent(event);
    setIsOpen(false);
    navigate(`/events/${event.id}/seats`);
  };

  return (
    <>
      {/* 1. Left Sticky Tab Button */}
      {!isOpen && <TelemetryTriggerTab onOpen={() => setIsOpen(true)} />}

      {/* 2. Slide-out Left Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-full sm:w-96 bg-[#2A1D26] border-r border-white/20 shadow-2xl z-50 flex flex-col justify-between overflow-hidden font-mono"
            >
              {/* Header */}
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
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Telemetry Body */}
              <div className="p-5 space-y-6 overflow-y-auto flex-1">
                {liveEvent && liveTiming && (
                  <TelemetryLiveCard
                    event={liveEvent}
                    timing={liveTiming}
                    onSelectSeats={handleSelectSeats}
                  />
                )}

                {nextEvent && nextTiming && (
                  <TelemetryNextUpCard
                    event={nextEvent}
                    timing={nextTiming}
                    onSelectSeats={handleSelectSeats}
                  />
                )}

                <TelemetryTimelineList events={events} onSelectEvent={handleSelectSeats} />

                <TelemetryConcurrencyBadge />
              </div>

              {/* Footer */}
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
