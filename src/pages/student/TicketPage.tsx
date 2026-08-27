import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
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

      <div className="bg-[#10B981]/20 border border-[#10B981]/40 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs font-mono text-[#10B981]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            <strong>Booking Confirmed & Serialized!</strong> Reference code: {booking.bookingRef}
          </span>
        </div>
        <Link
          to="/my-bookings"
          className="text-white hover:underline text-xs font-bold"
        >
          View in My Bookings &rarr;
        </Link>
      </div>

      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 ticket-notch-left ticket-notch-right">
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
                <div className="text-[10px] text-white/40 uppercase">Seat & Tier</div>
                <div className="font-black text-white text-base">Seat {booking.seatLabel}</div>
                <div className="text-[#FF7099]">{booking.seatCategory.replace('_', ' ')}</div>
                <div className="text-[10px] text-white/50">Admit One Pass</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4 text-[#FF7099]" />
                <span className="font-bold">{booking.eventDate}</span>
                <span>•</span>
                <Clock className="w-4 h-4 text-[#FF7099]" />
                <span>{booking.eventTime}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-4 h-4 text-[#FF7099]" />
                <span>{booking.eventVenue}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between p-3.5 rounded-xl bg-[#883955]/30 border border-[#883955]/50 text-xs font-mono">
              <div>
                <span className="text-white/50">Amount Paid: </span>
                <strong className="text-white font-bold">₹{booking.amount}</strong>
              </div>
              <div>
                <span className="text-white/50">Payment Method: </span>
                <span className="text-[#FF7099]">{booking.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#2A1D26] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <QrCode className="w-28 h-28 text-black" />
            </div>

            <div className="space-y-1 font-mono">
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Entry Ref Code</div>
              <div className="text-xs font-bold text-[#FF7099] bg-[#4C3549] px-2 py-1 rounded border border-white/10">
                {booking.bookingRef}
              </div>
            </div>

            <p className="text-[10px] text-white/50 font-sans-body leading-tight">
              Scan this QR code or provide reference at Gate Entry Security.
            </p>
          </div>
        </div>

        {booking.status === 'checked_in' && booking.checkedInAt && (
          <div className="p-3 rounded-xl bg-[#DF367C]/20 border border-[#DF367C]/40 text-xs font-mono text-[#FF7099] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              Admitted at Gate: {new Date(booking.checkedInAt).toLocaleTimeString()} by Staff: {booking.checkedInBy?.name || 'Gate Staff'}
            </span>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Demo Stub: Ticket PDF downloaded successfully.')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => alert('Demo Stub: Pass link copied to clipboard.')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Pass</span>
            </button>
          </div>

          <Link
            to="/my-bookings"
            className="px-5 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span>View All My Bookings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
