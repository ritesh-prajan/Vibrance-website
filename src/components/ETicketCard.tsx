import React from 'react';
import { Booking } from '../types';
import { QrCode, Calendar, MapPin, Ticket, ShieldCheck, Download, Share2, CheckCircle2, User } from 'lucide-react';

interface ETicketCardProps {
  booking: Booking;
  onClose?: () => void;
  onViewMyBookings?: () => void;
  isModal?: boolean;
}

export const ETicketCard: React.FC<ETicketCardProps> = ({
  booking,
  onClose,
  onViewMyBookings,
  isModal = false,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const ticketContent = (
    <div className="bg-[#0e121a] border border-white/20 rounded-3xl overflow-hidden shadow-2xl max-w-xl w-full mx-auto relative">
      {/* Top Holographic / Foil Festival Header */}
      <div className="holo-foil p-6 border-b border-white/10 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-black text-[#ccff00] font-display flex items-center justify-center text-sm font-bold">
              V26
            </span>
            <span className="font-display text-xl text-white tracking-wider">VIBRANCE 2026 OFFICIAL PASS</span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-[#ccff00] border border-[#ccff00]/40">
            {booking.status}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/70">{booking.eventCategory}</p>
          <h2 className="text-2xl font-black text-white tracking-tight leading-none mt-1">{booking.eventTitle}</h2>
          <p className="text-xs text-white/80 font-medium mt-1">{booking.artistOrHost}</p>
        </div>
      </div>

      {/* Perforated Cutout Divider */}
      <div className="relative py-1">
        <div className="ticket-notch-left ticket-notch-right">
          <div className="border-t-2 border-dashed border-white/20 w-full mx-auto" />
        </div>
      </div>

      {/* Main Ticket Pass Info */}
      <div className="p-6 space-y-5 bg-[#090b10]">
        {/* Seat & Booking Reference Hero Block */}
        <div className="grid grid-cols-2 gap-3 bg-[#131822] p-4 rounded-2xl border border-white/10">
          <div>
            <p className="text-[10px] text-white/40 uppercase font-mono">Assigned Seat</p>
            <p className="text-2xl font-black text-[#ccff00] font-mono tracking-tight">{booking.seatLabel}</p>
            <p className="text-[10px] text-white/60 font-mono mt-0.5">{booking.seatCategory} TIER</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase font-mono">Booking Reference</p>
            <p className="text-xs font-mono font-bold text-white tracking-wider mt-1 bg-white/10 px-2 py-1 rounded inline-block">
              {booking.bookingRef}
            </p>
            <p className="text-[10px] text-white/50 font-mono mt-1">₹{booking.amount} Paid ({booking.paymentMethod})</p>
          </div>
        </div>

        {/* Event Schedule & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-white/80 bg-white/5 p-2.5 rounded-xl border border-white/5">
            <Calendar className="w-4 h-4 text-[#ccff00] shrink-0" />
            <div>
              <p className="text-[9px] text-white/40">DATE & TIME</p>
              <p className="font-bold">{booking.eventDate}</p>
              <p className="text-[10px] text-white/60">{booking.eventTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/80 bg-white/5 p-2.5 rounded-xl border border-white/5">
            <MapPin className="w-4 h-4 text-[#00e5ff] shrink-0" />
            <div>
              <p className="text-[9px] text-white/40">VENUE GATE</p>
              <p className="font-bold truncate">{booking.eventVenue}</p>
            </div>
          </div>
        </div>

        {/* Student Holder Credentials */}
        <div className="bg-[#131822] p-3.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ccff00]/20 text-[#ccff00] flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">{booking.studentName}</p>
              <p className="text-[10px] text-white/50 font-mono">{booking.regNumber} • {booking.department}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/30 px-2 py-0.5 rounded">
            STUDENT PASS
          </span>
        </div>

        {/* QR & Barcode Section */}
        <div className="bg-[#080a0f] p-4 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center gap-4">
          {/* Real styled QR Canvas Placeholder */}
          <div className="bg-white p-2.5 rounded-xl shrink-0 flex flex-col items-center shadow-md">
            <div className="w-24 h-24 grid grid-cols-6 grid-rows-6 gap-0.5 bg-black p-1 rounded">
              {Array.from({ length: 36 }).map((_, i) => {
                const isBlack = (i * 13 + i * i * 7 + booking.bookingRef.charCodeAt(i % 5)) % 2 === 0;
                const isCorner =
                  (i >= 0 && i < 3) ||
                  (i >= 6 && i < 9) ||
                  (i >= 12 && i < 15) ||
                  (i >= 3 && i < 6) ||
                  (i >= 20 && i < 24) ||
                  (i >= 30 && i < 33);
                return (
                  <div
                    key={i}
                    className={`${isCorner || isBlack ? 'bg-white' : 'bg-transparent'} rounded-[1px]`}
                  />
                );
              })}
            </div>
            <span className="text-[8px] font-mono font-bold text-black mt-1">SCAN AT GATE</span>
          </div>

          <div className="flex-1 w-full text-center sm:text-left space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-white/80 justify-center sm:justify-start">
              <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
              <span className="font-mono font-bold text-[11px]">CRYPTOGRAPHICALLY VERIFIED SEAT</span>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              Show this QR pass along with valid College RFID Smart Card at Security Gate 3. Single entry only.
            </p>
            {/* Visual Barcode strip */}
            <div className="flex items-center justify-center sm:justify-start gap-[2px] h-6 opacity-70">
              {Array.from({ length: 42 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white"
                  style={{
                    width: `${(idx % 3 === 0 ? 3 : idx % 2 === 0 ? 1 : 2)}px`,
                    height: '100%',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Save / Print
            </button>
          </div>

          {onViewMyBookings && (
            <button
              onClick={onViewMyBookings}
              className="px-4 py-2 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(204,255,0,0.25)] flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5" /> View in My Passes
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (!isModal) {
    return ticketContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-xl w-full">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 rounded-full"
          >
            ✕
          </button>
        )}
        {ticketContent}
      </div>
    </div>
  );
};
