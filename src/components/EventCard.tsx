import React from 'react';
import { motion } from 'framer-motion';
import { FestEvent } from '../types';
import { Calendar, MapPin, Ticket, Flame, Clock, Users, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: FestEvent;
  onSelectSeats: (event: FestEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelectSeats }) => {
  const isUrgent = event.availableSeats <= 6;
  const isSoldOut = event.availableSeats === 0;
  const occupancyPercent = Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 20px 60px ${event.accentColor ?? '#FF3E41'}22` }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative group bg-[#0e121a] hover:bg-[#131822] border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
    >
      {/* Top Section */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
            style={{ backgroundColor: `${event.accentColor}18`, color: event.accentColor, border: `1px solid ${event.accentColor}40` }}
          >
            {event.category.replace(/_/g, ' ')}
          </span>
          {isUrgent && !isSoldOut && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/40 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
            >
              <Flame className="w-3 h-3 text-red-400" />
              <span>{event.availableSeats} SEATS LEFT</span>
            </motion.div>
          )}
          {isSoldOut && (
            <span className="bg-white/10 text-white/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">SOLD OUT</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-[#ccff00] transition-colors">{event.title}</h3>
        <p className="text-xs text-white/70 mt-1 font-medium flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-white/40" />{event.artistOrHost}
        </p>
        <p className="text-xs text-white/50 mt-2.5 line-clamp-2 leading-relaxed">{event.shortDesc}</p>
      </div>

      {/* Divider */}
      <div className="relative py-2">
        <div className="ticket-notch-left ticket-notch-right">
          <div className="border-t border-dashed border-white/15 w-full mx-auto" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-5 pt-2 space-y-3.5">
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-white/70 bg-white/5 p-2 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-[#ccff00]" /><span className="truncate">{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/70 bg-white/5 p-2 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-[#00e5ff]" /><span className="truncate">{event.time}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/60">
          <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" /><span className="truncate">{event.venue}</span>
        </div>

        {/* Seat Capacity Meter */}
        <div className="bg-[#080a0f] p-3 rounded-xl border border-white/10">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-white/60 font-mono text-[11px]">LIVE CAPACITY</span>
            <span className="font-mono font-bold text-white text-xs">
              <motion.span
                className={isUrgent ? 'text-red-400' : 'text-[#ccff00]'}
                animate={isUrgent && !isSoldOut ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block' }}
              >
                {event.availableSeats}
              </motion.span>{' '}/ {event.totalSeats} Available
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden flex">
            <div className="h-full bg-red-500/70" style={{ width: `${(event.bookedSeatsCount / event.totalSeats) * 100}%` }} />
            <motion.div
              className="h-full bg-amber-400/90"
              style={{ width: `${(event.lockedSeatsCount / event.totalSeats) * 100}%` }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <div className="h-full bg-[#ccff00]" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-white/40 mt-1">
            <span>{occupancyPercent}% Booked</span>
            {event.lockedSeatsCount > 0 && <span className="text-amber-300 font-semibold">{event.lockedSeatsCount} currently held</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-[10px] text-white/40 font-mono uppercase">Ticket Pass From</p>
            <p className="text-lg font-bold text-white font-mono">&#8377;{event.basePrice}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectSeats(event)}
            disabled={isSoldOut}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
              isSoldOut ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[0_0_15px_rgba(204,255,0,0.25)]'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isSoldOut ? 'Sold Out' : 'Select Seat'}</span>
            {!isSoldOut && <ArrowRight className="w-3 h-3 ml-0.5" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
