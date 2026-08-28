import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FestEvent } from '../types';
import { getEventTiming } from '../utils/timeUtils';
import { Calendar, MapPin, Ticket, Flame, Clock, Users, ArrowRight, Zap, CheckCircle2, Eye } from 'lucide-react';
import { EventDetailsModal } from './events/EventDetailsModal';

interface EventCardProps {
  event: FestEvent;
  onSelectSeats: (event: FestEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelectSeats }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const timing = getEventTiming(event);
  const isUrgent = event.availableSeats <= 4 && !timing.isExpired;
  const isSoldOut = event.availableSeats === 0 || timing.isExpired;

  return (
    <>
      <EventDetailsModal
        event={event}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onSelectSeats={onSelectSeats}
      />

      <motion.div
        whileHover={!timing.isExpired ? { y: -4, boxShadow: `0 20px 60px ${event.accentColor ?? '#FF3E41'}22` } : {}}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`relative group border rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg transition-all ${
          timing.isExpired
            ? 'bg-[#1e151c] border-white/5 opacity-60'
            : timing.isLive
            ? 'bg-[#0e121a] border-red-500/40 hover:border-red-500 shadow-[0_0_25px_rgba(255,62,65,0.15)]'
            : 'bg-[#0e121a] hover:bg-[#131822] border-white/10 hover:border-white/25'
        }`}
      >
      <div
        onClick={() => setIsDetailsOpen(true)}
        className="p-5 pb-3 cursor-pointer group/header"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
            style={{ backgroundColor: `${event.accentColor ?? '#FF3E41'}18`, color: event.accentColor ?? '#FF7099', border: `1px solid ${event.accentColor ?? '#FF3E41'}40` }}
          >
            {event.category.replace(/_/g, ' ')}
          </span>

          {timing.isLive && (
            <motion.div
              animate={{ opacity: [1, 0.6, 1], scale: [1, 1.04, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="flex items-center gap-1.5 bg-red-500/20 border border-red-500 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>LIVE NOW</span>
            </motion.div>
          )}

          {timing.status === 'STARTING_SOON' && (
            <div className="flex items-center gap-1 bg-[#FF3E41]/20 border border-[#FF3E41]/40 text-[#FF7099] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
              <Zap className="w-3 h-3 fill-[#FF7099]" />
              <span>{timing.countdownText}</span>
            </div>
          )}

          {timing.isExpired && (
            <span className="bg-white/10 text-white/50 border border-white/10 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
              CONCLUDED
            </span>
          )}

          {isUrgent && !timing.isExpired && timing.status !== 'STARTING_SOON' && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="flex items-center gap-1 bg-red-500/15 border border-red-500/40 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
            >
              <Flame className="w-3 h-3 text-red-400" />
              <span>{event.availableSeats} LEFT</span>
            </motion.div>
          )}
        </div>

        <h3 className={`text-lg font-bold tracking-tight leading-snug transition-colors flex items-center justify-between gap-2 ${timing.isExpired ? 'text-white/60' : 'text-white group-hover/header:text-[#FF7099]'}`}>
          <span>{event.title}</span>
          <Eye className="w-4 h-4 text-white/30 group-hover/header:text-[#FF7099] shrink-0 transition-colors" />
        </h3>
        <p className="text-xs text-white/70 mt-1 font-medium flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-white/40" />{event.artistOrHost}
        </p>
        <p className="text-xs text-white/50 mt-2.5 line-clamp-2 leading-relaxed">{event.shortDesc}</p>
      </div>

      <div className="relative py-2">
        <div className="ticket-notch-left ticket-notch-right">
          <div className="border-t border-dashed border-white/15 w-full mx-auto" />
        </div>
      </div>

      <div className="p-5 pt-2 space-y-3.5">
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-white/70 bg-white/5 p-2 rounded-lg truncate">
            <Calendar className="w-3.5 h-3.5 text-[#FF7099] shrink-0" />
            <span className="truncate">{timing.formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/70 bg-white/5 p-2 rounded-lg truncate">
            <Clock className="w-3.5 h-3.5 text-[#DF367C] shrink-0" />
            <span className="truncate">{timing.formattedTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/60 font-mono">
          <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" /><span className="truncate">{event.venue}</span>
        </div>

        <div className="bg-[#080a0f] p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
          <span className="text-white/50 text-[11px]">TIMELINE:</span>
          <span className={`font-bold ${timing.isLive ? 'text-red-400' : timing.isExpired ? 'text-white/40' : 'text-[#FF7099]'}`}>
            {timing.countdownText}
          </span>
        </div>

        <div className="bg-[#080a0f] p-3 rounded-xl border border-white/10 space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60 font-mono text-[11px]">LIVE CAPACITY</span>
            <span className="font-mono font-bold text-white text-xs">
              {timing.isExpired ? (
                <span className="text-white/40">Event Ended</span>
              ) : (
                <span>{event.availableSeats} / {event.totalSeats} Available</span>
              )}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden flex">
            <div className="h-full bg-red-500/70" style={{ width: `${(event.bookedSeatsCount / event.totalSeats) * 100}%` }} />
            <div className="h-full bg-amber-400/90" style={{ width: `${(event.lockedSeatsCount / event.totalSeats) * 100}%` }} />
            <div className="h-full bg-[#10B981]" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 gap-2">
          <div>
            <p className="text-[10px] text-white/40 font-mono uppercase">Ticket Pass</p>
            <p className="text-lg font-bold text-white font-mono">&#8377;{event.basePrice}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDetailsOpen(true)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors cursor-pointer"
              title="Preview Ticket & Details"
            >
              <Eye className="w-4 h-4 text-white/80" />
            </button>
            <motion.button
              whileTap={!isSoldOut ? { scale: 0.96 } : {}}
              onClick={() => onSelectSeats(event)}
              disabled={isSoldOut}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md ${
                timing.isExpired
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : event.availableSeats === 0
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-[#FF3E41] hover:bg-[#e03235] text-white shadow-[0_0_15px_rgba(255,62,65,0.25)] cursor-pointer'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>{timing.isExpired ? 'Concluded' : event.availableSeats === 0 ? 'Sold Out' : 'Select Seat'}</span>
              {!isSoldOut && <ArrowRight className="w-3 h-3 ml-0.5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
};
