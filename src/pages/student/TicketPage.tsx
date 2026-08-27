import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'My Bookings', path: '/my-bookings' },
          { label: `Pass ${booking.bookingRef}` },
        ]}
        backLink={{ label: 'Back to My Bookings', path: '/my-bookings' }}
      />

      {/* Confirmation Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#10B981]/20 border border-[#10B981]/40 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs font-mono text-[#10B981]"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            <strong>Booking Confirmed &amp; Serialized!</strong> Reference code: {booking.bookingRef}
          </span>
        </div>
        <Link
          to="/my-bookings"
          className="text-white hover:underline text-xs font-bold"
        >
          View in My Bookings &rarr;
        </Link>
      </motion.div>

      {/* Digital Festival Pass Card Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 ticket-notch-left ticket-notch-right"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF3E41] to-[#DF367C] text-white font-display font-black text-2xl flex items-center justify-center shadow-lg">
              V
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#FF7099] uppercase tracking-wider font-bold">
                VIBRANCE 2026 OFFICIAL PASS
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display tracking-wide">
                {booking.eventTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} size="lg" />
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
                <div className="text-white/60">Tier: {booking.tier}</div>
                <div className="text-[#10B981] font-bold">Paid: ₹{booking.amount}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Date &amp; Schedule</div>
                <div className="text-white font-bold">{booking.date}</div>
                <div className="text-white/60">{booking.time}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Venue Stage</div>
                <div className="text-white font-bold truncate">{booking.venue}</div>
                <div className="text-[#FF7099]">Gate Post Alpha</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#883955]/30 border border-[#FF7099]/30 text-xs font-mono flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#FF7099] shrink-0" />
              <div>
                <span className="font-bold text-white">ACID Serializable Guarantee:</span>
                <p className="text-white/70 text-[11px] mt-0.5">
                  This e-pass is backed by Strict 2PL concurrency verification. Present QR code at the arena gate.
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Placeholder with Staggered Fade/Scale In */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="flex flex-col items-center justify-between p-5 bg-[#2A1D26] rounded-2xl border border-white/15 text-center space-y-4"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase">Digital Gate Pass QR</span>
              <div className="p-4 bg-white rounded-2xl shadow-inner flex items-center justify-center my-2">
                <QrCode className="w-32 h-32 text-black" />
              </div>
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
