import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TicketQrCanvas } from '../../components/common/TicketQrCanvas';
import { getEventTiming } from '../../utils/timeUtils';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export const TicketPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { allBookings } = useFest();

  const booking = allBookings.find(
    (b) => b.id === bookingId || b.bookingRef === bookingId
  );

  if (!booking) {
    return (
      <div>
        <Breadcrumbs
          items={[{ label: 'My Bookings', path: '/my-bookings' }, { label: 'Ticket Not Found' }]}
          backLink={{ label: 'Back to Passes', path: '/my-bookings' }}
        />
        <EmptyState
          title="Pass Not Found"
          description="The requested ticket could not be located in the booking records."
          actionText="View All My Bookings"
          actionPath="/my-bookings"
        />
      </div>
    );
  }

  const timing = getEventTiming(booking);
  const isExpired = timing.isExpired;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'My Bookings', path: '/my-bookings' },
          { label: `Pass ${booking.bookingRef}` },
        ]}
        backLink={{ label: 'Back to My Bookings', path: '/my-bookings' }}
      />

      {/* Real-time Status Banner */}
      {isExpired ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/20 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs font-mono text-amber-300"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
            <span>
              <strong>PASS EXPIRED / EVENT CONCLUDED:</strong> This event concluded {timing.countdownText.toLowerCase()}. Gate admission is closed.
            </span>
          </div>
          <Link to="/events" className="text-white hover:underline text-xs font-bold shrink-0">
            Browse Upcoming Shows &rarr;
          </Link>
        </motion.div>
      ) : timing.isLive ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs font-mono text-red-300"
        >
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 shrink-0 text-red-400 animate-pulse" />
            <span>
              <strong>EVENT LIVE RIGHT NOW:</strong> Head to {booking.eventVenue} for immediate admission.
            </span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#10B981]/20 border border-[#10B981]/40 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs font-mono text-[#10B981]"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>
              <strong>Booking Confirmed &amp; Serialized!</strong> Reference code: {booking.bookingRef} &bull; {timing.countdownText}
            </span>
          </div>
          <Link to="/my-bookings" className="text-white hover:underline text-xs font-bold">
            View in My Bookings &rarr;
          </Link>
        </motion.div>
      )}

      {/* Digital Festival Pass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`border rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 ticket-notch-left ticket-notch-right ${
          isExpired ? 'bg-[#2a1d26] border-white/10 opacity-75' : 'bg-[#4C3549] border-white/15'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl font-display font-black text-2xl flex items-center justify-center shadow-lg text-white ${
              isExpired ? 'bg-white/10 text-white/40' : 'bg-gradient-to-br from-[#FF3E41] to-[#DF367C]'
            }`}>
              V
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#FF7099] uppercase tracking-wider font-bold">
                {isExpired ? 'VIBRANCE 2026 CONCLUDED PASS' : 'VIBRANCE 2026 OFFICIAL PASS'}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display tracking-wide">
                {booking.eventTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isExpired ? (
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white/10 text-white/50 border border-white/15">
                EXPIRED
              </span>
            ) : (
              <StatusBadge status={booking.status} size="lg" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Attendee Name</div>
                <div className="font-bold text-white text-sm">{booking.studentName}</div>
                <div className="text-[#FF7099]">{booking.regNumber}</div>
                <div className="text-[10px] text-white/50 truncate">{booking.department}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Seat &amp; Tier</div>
                <div className="font-black text-white text-base">Seat {booking.seatLabel}</div>
                <div className="text-white/60">Tier: {booking.seatCategory}</div>
                <div className="text-[#10B981] font-bold">Paid: &#8377;{booking.amount}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Real-Time Schedule</div>
                <div className="text-white font-bold">{timing.formattedDate}</div>
                <div className="text-white/60">{timing.formattedTime}</div>
                <div className={`text-[10px] font-bold ${isExpired ? 'text-white/40' : 'text-[#FF7099]'}`}>
                  {timing.countdownText}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Venue Stage</div>
                <div className="text-white font-bold truncate">{booking.eventVenue}</div>
                <div className="text-[#FF7099]">Gate Post Alpha</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#883955]/30 border border-[#FF7099]/30 text-xs font-mono flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#FF7099] shrink-0" />
              <div>
                <span className="font-bold text-white">ACID Serializable Guarantee:</span>
                <p className="text-white/70 text-[11px] mt-0.5">
                  This e-pass is backed by Strict 2PL concurrency verification. {isExpired ? 'This pass has expired.' : 'Present QR code at the arena gate.'}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className={`flex flex-col items-center justify-between p-5 rounded-2xl border text-center space-y-4 relative overflow-hidden ${
              isExpired ? 'bg-[#1e131c] border-white/10' : 'bg-[#2A1D26] border-white/15'
            }`}
          >
            {isExpired && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-3 text-center">
                <span className="px-3 py-1 rounded-md bg-red-500/80 text-white font-mono font-bold text-xs uppercase tracking-widest shadow-xl">
                  PASS EXPIRED
                </span>
                <span className="text-[10px] font-mono text-white/60 mt-1">Event has ended</span>
              </div>
            )}

            <div className="space-y-2 flex flex-col items-center">
              <span className="text-[10px] font-mono text-white/40 uppercase">Official Gate Pass QR</span>
              <TicketQrCanvas
                payload={booking.qrPayload || booking.bookingRef}
                bookingRef={booking.bookingRef}
                size={160}
                color={isExpired ? '#6b7280' : '#10B981'}
                showDownload={false}
              />
              <div className="text-[11px] font-mono font-bold text-[#FF7099]">
                {booking.bookingRef}
              </div>
            </div>

            <div className="w-full flex items-center gap-2 pt-2 border-t border-white/10 font-mono text-xs">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigator.clipboard?.writeText(booking.bookingRef);
                  alert('Pass reference copied to clipboard!');
                }}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
