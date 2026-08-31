import React from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../../types';
import { getEventTiming } from '../../utils/timeUtils';
import { StatusBadge } from '../common/StatusBadge';
import { Calendar, Clock, MapPin, QrCode, Radio, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface IntactTicketCardProps {
  booking: Booking;
  onCancel?: (booking: Booking) => void;
}

export const IntactTicketCard: React.FC<IntactTicketCardProps> = ({ booking, onCancel }) => {
  const timing = getEventTiming(booking);
  const hasCustomPhoto = Boolean(booking.ticketBgImage);

  // ── 1. PHOTO-CENTRIC CLUTTER-FREE TICKET CARD ──
  if (hasCustomPhoto) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundImage: `linear-gradient(to top, rgba(16, 8, 15, 0.96) 0%, rgba(20, 10, 18, 0.45) 45%, rgba(16, 8, 15, 0.88) 100%), url(${booking.ticketBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className={`border rounded-3xl p-6 sm:p-7 transition-all shadow-2xl flex flex-col justify-between min-h-[220px] ticket-notch-left ticket-notch-right relative overflow-hidden group ${
          timing.isLive
            ? 'border-red-500/60 shadow-[0_10px_30px_rgba(255,62,65,0.25)]'
            : 'border-white/20 hover:border-white/35'
        }`}
      >
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF3E41]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/15 relative z-10">
          <div className="flex items-center gap-3">
            <img
              src="/vibrance-logo.png"
              alt="Vibrance 2026"
              className="w-11 h-11 rounded-full object-cover shadow-md ring-2 ring-[#FF3E41]/60 bg-black"
            />
            <div>
              <span className="text-[10px] font-mono text-[#FF7099] font-bold tracking-wider uppercase">
                REF: {booking.bookingRef}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-display leading-tight tracking-wide">
                {booking.eventTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {timing.isLive ? (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-red-500/25 text-red-400 border border-red-500/50 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                LIVE NOW
              </span>
            ) : (
              <StatusBadge status={booking.status} />
            )}
          </div>
        </div>

        {/* Unobstructed photo middle zone */}
        <div className="py-2" />

        {/* Bottom Row: Event detail pills on the LEFT + action buttons on the RIGHT */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-white/15 relative z-10">
          {/* Small Event Detail Pills on the Left */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <div className="px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md border border-white/15 text-white flex items-center gap-1.5 shadow-sm">
              <Calendar className="w-3 h-3 text-[#FF7099]" />
              <span>{timing.formattedDate} &bull; {timing.formattedTime}</span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md border border-white/15 text-white flex items-center gap-1.5 shadow-sm">
              <span className="text-[#FF7099] font-bold">Seat:</span>
              <span className="font-bold">{booking.seatLabel}</span>
              <span className="text-white/40">({booking.seatCategory})</span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md border border-white/15 text-white/80 flex items-center gap-1.5 shadow-sm">
              <MapPin className="w-3 h-3 text-[#FF7099]" />
              <span className="truncate max-w-[160px]">{booking.eventVenue}</span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md border border-white/15 text-[#10B981] font-bold flex items-center gap-1 shadow-sm">
              <span>₹{booking.amount}</span>
            </div>
          </div>

          {/* Action Buttons on the Right */}
          <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
            {booking.status === 'confirmed' && onCancel && (
              <button
                type="button"
                onClick={() => onCancel(booking)}
                className="px-3 py-1.5 rounded-xl text-[11px] font-mono text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer border border-red-500/20"
              >
                Cancel Pass
              </button>
            )}
            <Link
              to={`/ticket/${booking.id}`}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF3E41] to-[#DF367C] hover:opacity-90 text-white text-xs font-mono font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Open Gate Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── 2. STANDARD DETAILED TICKET CARD (WHEN NO CUSTOM PHOTO) ──
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-3xl p-5 sm:p-6 transition-all shadow-xl space-y-4 ticket-notch-left ticket-notch-right relative overflow-hidden ${
        timing.isLive
          ? 'bg-[#4C3549] border-red-500/60 shadow-[0_10px_30px_rgba(255,62,65,0.2)]'
          : 'bg-[#4C3549] border-white/15 hover:border-white/30'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="/vibrance-logo.png"
            alt="Vibrance 2026"
            className="w-11 h-11 rounded-full object-cover shadow-md ring-2 ring-[#FF3E41]/50 bg-black"
          />
          <div>
            <span className="text-[10px] font-mono text-[#FF7099] font-bold">
              REF: {booking.bookingRef}
            </span>
            <h3 className="text-lg font-bold text-white font-display leading-tight">
              {booking.eventTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {timing.isLive ? (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-red-500/25 text-red-400 border border-red-500/50 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE NOW
            </span>
          ) : (
            <StatusBadge status={booking.status} />
          )}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-[#2A1D26] rounded-xl border border-white/5 space-y-1">
          <div className="text-[10px] text-white/40 uppercase">Event Schedule</div>
          <div className="text-white font-bold">{timing.formattedDate}</div>
          <div className="text-[#FF7099]">{timing.formattedTime}</div>
        </div>

        <div className="p-3 bg-[#2A1D26] rounded-xl border border-white/5 space-y-1">
          <div className="text-[10px] text-white/40 uppercase">Assigned Seat</div>
          <div className="text-white font-bold text-base">Seat {booking.seatLabel}</div>
          <div className="text-white/50">Tier: {booking.seatCategory}</div>
        </div>

        <div className="p-3 bg-[#2A1D26] rounded-xl border border-white/5 space-y-1">
          <div className="text-[10px] text-white/40 uppercase">Real-Time Status</div>
          <div className={`font-bold ${timing.isLive ? 'text-red-400' : 'text-[#10B981]'}`}>
            {timing.countdownText}
          </div>
          <div className="text-white/50">Gate Post Alpha</div>
        </div>

        <div className="p-3 bg-[#2A1D26] rounded-xl border border-white/5 space-y-1 flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-white/40 uppercase">Paid Amount</div>
            <div className="text-white font-black text-sm">&#8377;{booking.amount}</div>
          </div>
          <div className="text-[9px] text-white/40">{booking.paymentMethod}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs font-mono text-white/50 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-white/40" />
          <span>{booking.eventVenue}</span>
        </div>

        <div className="flex items-center gap-2">
          {booking.status === 'confirmed' && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(booking)}
              className="px-3 py-2 rounded-xl text-xs font-mono text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer"
            >
              Cancel Pass
            </button>
          )}
          <Link
            to={`/ticket/${booking.id}`}
            className="px-4 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Open Gate Pass</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
