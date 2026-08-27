import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Booking } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';
import { getEventTiming, sortBookingsByTiming } from '../../utils/timeUtils';
import { ETicketCard } from '../../components/ETicketCard';
import { motion } from 'framer-motion';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  QrCode,
  Radio,
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { myBookings, cancelBooking } = useFest();

  const [filterTab, setFilterTab] = useState<'ALL' | 'UPCOMING' | 'LIVE' | 'CHECKED_IN' | 'EXPIRED'>('ALL');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const { upcoming, expired, live } = sortBookingsByTiming(myBookings);

  const filteredBookings = myBookings.filter((b) => {
    const t = getEventTiming(b);
    if (filterTab === 'UPCOMING') return t.isUpcoming && b.status === 'confirmed';
    if (filterTab === 'LIVE') return t.isLive;
    if (filterTab === 'CHECKED_IN') return b.status === 'checked_in';
    if (filterTab === 'EXPIRED') return t.isExpired || b.status === 'checked_in';
    return true;
  });

  const sortedDisplayBookings = [...filteredBookings].sort((a, b) => {
    const tA = getEventTiming(a);
    const tB = getEventTiming(b);
    if (tA.isLive && !tB.isLive) return -1;
    if (!tA.isLive && tB.isLive) return 1;
    if (tA.isUpcoming && tB.isUpcoming) return tA.startTimestamp - tB.startTimestamp;
    if (tA.isUpcoming && tB.isExpired) return -1;
    if (tA.isExpired && tB.isUpcoming) return 1;
    return tB.endTimestamp - tA.endTimestamp;
  });

  const nextPass = upcoming[0] || live[0] || null;
  const nextTiming = nextPass ? getEventTiming(nextPass) : null;

  const handleConfirmCancel = () => {
    if (cancellingBooking) {
      cancelBooking(cancellingBooking.id);
      setCancellingBooking(null);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF3E41]/25 text-[#FF7099] border border-[#FF3E41]/50">
              STUDENT PASS WALLET
            </span>
            <span className="text-xs text-white/50 font-mono">Physical Pass Status &amp; Real-Time Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide mt-1">
            MY FESTIVAL PASSES &amp; BOOKINGS
          </h1>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md shrink-0"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Browse More Shows</span>
        </Link>
      </div>

      {/* 1. Next Up Highlight Card */}
      {nextPass && nextTiming && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#4C3549] to-[#883955] border-2 border-[#FF3E41]/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FF3E41] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              {nextTiming.isLive ? '🔴 YOUR PASS IS LIVE RIGHT NOW' : '⚡ YOUR NEXT UPCOMING PASS'}
            </span>
            <span className="text-xs font-mono text-white font-bold bg-black/30 px-3 py-1 rounded-full">
              {nextTiming.countdownText}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white font-display tracking-wide">
                {nextPass.eventTitle}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/80 pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF7099]" /> {nextTiming.formattedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF7099]" /> {nextTiming.formattedTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7099]" /> {nextPass.eventVenue}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-mono">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-white/40 uppercase">Seat Assigned</div>
                <div className="text-lg font-black text-white">Seat {nextPass.seatLabel}</div>
              </div>
              <Link
                to={`/ticket/${nextPass.id}`}
                className="px-5 py-3 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold shadow-xl flex items-center gap-2 transition-transform hover:scale-105"
              >
                <QrCode className="w-4 h-4" />
                <span>Show Gate QR Pass</span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Real-Time Status Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 text-xs font-mono">
        <button
          onClick={() => setFilterTab('ALL')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-bold ${
            filterTab === 'ALL' ? 'bg-[#883955] text-white' : 'text-white/60 hover:text-white hover:bg-[#4C3549]'
          }`}
        >
          All Passes ({myBookings.length})
        </button>
        <button
          onClick={() => setFilterTab('UPCOMING')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-bold ${
            filterTab === 'UPCOMING' ? 'bg-[#883955] text-white' : 'text-white/60 hover:text-white hover:bg-[#4C3549]'
          }`}
        >
          Active / Intact ({upcoming.length})
        </button>
        <button
          onClick={() => setFilterTab('LIVE')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-bold text-red-400 ${
            filterTab === 'LIVE' ? 'bg-red-500/25 text-red-300 border border-red-500/40' : 'hover:bg-[#4C3549]'
          }`}
        >
          🔴 Live Stages ({live.length})
        </button>
        <button
          onClick={() => setFilterTab('CHECKED_IN')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-bold ${
            filterTab === 'CHECKED_IN' ? 'bg-[#883955] text-white' : 'text-white/60 hover:text-white hover:bg-[#4C3549]'
          }`}
        >
          Used / Torn ({myBookings.filter((b) => b.status === 'checked_in').length})
        </button>
        <button
          onClick={() => setFilterTab('EXPIRED')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-bold text-white/50 ${
            filterTab === 'EXPIRED' ? 'bg-white/20 text-white' : 'hover:bg-[#4C3549]'
          }`}
        >
          ⏱️ Expired ({expired.length})
        </button>
      </div>

      {/* 3. Ticket Cards Listing (Intact or Torn) */}
      {sortedDisplayBookings.length === 0 ? (
        <EmptyState
          title="No Passes in this Category"
          description="You don't have any passes matching this schedule filter."
          actionText="Browse Events Catalog"
          actionPath="/events"
        />
      ) : (
        <div className="space-y-6">
          {sortedDisplayBookings.map((booking) => (
            <ETicketCard
              key={booking.id}
              booking={booking}
              onCancel={(b) => setCancellingBooking(b)}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#4C3549] border border-white/20 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white font-display">Cancel Festival Pass?</h3>
            </div>
            <p className="text-xs text-white/70 font-sans-body leading-relaxed">
              Are you sure you want to cancel pass <strong>{cancellingBooking.bookingRef}</strong> for {cancellingBooking.eventTitle}? Seat {cancellingBooking.seatLabel} will be released back to festival inventory.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 font-mono text-xs">
              <button
                onClick={() => setCancellingBooking(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                Keep Pass
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold cursor-pointer"
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
