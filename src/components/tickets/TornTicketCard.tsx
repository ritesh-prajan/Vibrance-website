import React from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../../types';
import { getEventTiming } from '../../utils/timeUtils';
import { TicketInkStamp } from './TicketInkStamp';
import { Calendar, Clock, MapPin, QrCode, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface TornTicketCardProps {
  booking: Booking;
}

export const TornTicketCard: React.FC<TornTicketCardProps> = ({ booking }) => {
  const timing = getEventTiming(booking);
  const isUsed = booking.status === 'checked_in';
  const stampType = isUsed ? 'USED' : booking.status === 'cancelled' ? 'CANCELLED' : 'EXPIRED';

  // Exact complementary jagged clip paths:
  // Left half right edge:
  const leftClipPath = 'polygon(0% 0%, calc(100% - 14px) 0%, 100% 10%, calc(100% - 16px) 20%, 100% 32%, calc(100% - 14px) 45%, 100% 58%, calc(100% - 18px) 70%, 100% 82%, calc(100% - 12px) 92%, 100% 100%, 0% 100%)';

  // Right half left edge (complementary match):
  const rightClipPath = 'polygon(calc(0% + 14px) 0%, 100% 0%, 100% 100%, calc(0% + 0px) 100%, calc(0% + 12px) 92%, calc(0% + 0px) 82%, calc(0% + 18px) 70%, calc(0% + 0px) 58%, calc(0% + 14px) 45%, calc(0% + 0px) 32%, calc(0% + 16px) 20%, calc(0% + 0px) 10%, calc(0% + 14px) 0%)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative py-3 my-2"
    >
      {/* ─── Two Torn Halves Container with Gap & Tilt ─── */}
      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-3 filter grayscale-[35%] brightness-[88%] opacity-85 hover:opacity-95 hover:grayscale-[20%] transition-all">
        
        {/* ─── LEFT HALF (Event & Schedule Stub) ─── */}
        <div
          style={{ clipPath: leftClipPath }}
          className="flex-1 bg-[#3A2937] border-l border-y border-white/10 rounded-l-3xl p-5 sm:p-6 space-y-4 shadow-2xl relative md:-rotate-[2.2deg] md:origin-right transform transition-transform ticket-notch-left"
        >
          {/* Subtle Paper Grain & Tear Border */}
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />

          {/* Left Stub Header */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white/50 font-display font-black text-base flex items-center justify-center">
                V
              </div>
              <div>
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-bold">
                  {booking.eventCategory || 'FESTIVAL SHOW'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white/80 font-display leading-tight">
                  {booking.eventTitle}
                </h3>
              </div>
            </div>
          </div>

          {/* Schedule & Attendee Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#241723] rounded-xl border border-white/5 space-y-0.5">
              <span className="text-[9px] text-white/40 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#FF7099]" /> Event Date &amp; Time
              </span>
              <p className="font-bold text-white/90">{timing.formattedDate}</p>
              <p className="text-[#FF7099]/80 text-[11px]">{timing.formattedTime}</p>
            </div>

            <div className="p-3 bg-[#241723] rounded-xl border border-white/5 space-y-0.5">
              <span className="text-[9px] text-white/40 uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF7099]" /> Venue Stage
              </span>
              <p className="font-bold text-white/90 truncate">{booking.eventVenue}</p>
              <p className="text-white/40 text-[10px]">Gate Post Alpha</p>
            </div>
          </div>

          {/* Attendee Info */}
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-1">
            <span className="truncate">Holder: <strong className="text-white/70">{booking.studentName}</strong> ({booking.regNumber})</span>
            <span className="text-[10px] text-white/40 uppercase">{timing.countdownText}</span>
          </div>
        </div>

        {/* ─── RIGHT HALF (Seat & Verification Stub) ─── */}
        <div
          style={{ clipPath: rightClipPath }}
          className="w-full md:w-80 bg-[#352533] border-r border-y border-white/10 rounded-r-3xl p-5 sm:p-6 space-y-3 shadow-2xl relative md:rotate-[2.2deg] md:origin-left transform transition-transform ticket-notch-right flex flex-col justify-between"
        >
          {/* Left Jagged Highlight Glow */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />

          {/* Right Stub Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <span className="text-[9px] font-mono text-white/40 uppercase">Assigned Seat</span>
              <p className="text-xl font-black text-white/90 font-mono">Seat {booking.seatLabel}</p>
            </div>
            <div className="text-right font-mono">
              <span className="text-[9px] text-white/40 uppercase">Ref Code</span>
              <p className="text-xs font-bold text-[#FF7099] tracking-wider">{booking.bookingRef}</p>
            </div>
          </div>

          {/* Check-in / Expiry Verification Data */}
          <div className="p-2.5 bg-[#241723] rounded-xl border border-white/5 text-[10px] font-mono space-y-1">
            <div className="flex justify-between text-white/60">
              <span>Paid: &#8377;{booking.amount}</span>
              <span className="text-white/40">{booking.paymentMethod}</span>
            </div>
            {isUsed ? (
              <div className="text-emerald-400 font-bold flex items-center gap-1 pt-0.5 border-t border-white/5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified: Admitted at gate</span>
              </div>
            ) : (
              <div className="text-white/40 flex items-center gap-1 pt-0.5 border-t border-white/5">
                <Clock className="w-3 h-3" />
                <span>Concluded: Admission closed</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-1">
            <Link
              to={`/ticket/${booking.id}`}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Inspect Stub Record</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Authentic Diagonal Ink Stamp Across the Tear ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <TicketInkStamp type={stampType} />
      </div>
    </motion.div>
  );
};
