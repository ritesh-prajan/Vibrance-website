import React from 'react';
import { motion } from 'framer-motion';
import { FestEvent } from '../../types';
import { getEventTiming } from '../../utils/timeUtils';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  ShieldCheck,
  Zap,
  Radio,
  ArrowRight,
  Sparkles,
  QrCode,
} from 'lucide-react';

interface EventDetailsModalProps {
  event: FestEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSeats: (event: FestEvent) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onSelectSeats,
}) => {
  if (!isOpen || !event) return null;

  const timing = getEventTiming(event);
  const isSoldOut = event.availableSeats === 0 || timing.isExpired;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#2A1D26] border border-white/20 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#4C3549]/70 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#FF3E41]/25 text-[#FF7099] border border-[#FF3E41]/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              EVENT DETAILS &amp; TICKET PASS PREVIEW
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-white/5 border border-white/15 text-white/80">
                {event.category.replace(/_/g, ' ')}
              </span>
              {timing.isLive && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-500/20 border border-red-500 text-red-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" /> LIVE NOW
                </span>
              )}
              {timing.status === 'STARTING_SOON' && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FF3E41]/20 border border-[#FF3E41]/40 text-[#FF7099] flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {timing.countdownText}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              {event.title}
            </h2>
            <p className="text-sm text-[#FF7099] font-medium flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FF7099]/70" />
              <span>{event.artistOrHost}</span>
            </p>
            <p className="text-xs text-white/70 leading-relaxed font-sans pt-1">
              {event.shortDesc}
            </p>
          </div>

          {/* Schedule & Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-[#4C3549]/60 rounded-2xl border border-white/10 space-y-1">
              <div className="text-[10px] text-white/40 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#FF7099]" /> Date
              </div>
              <div className="font-bold text-white text-sm">{timing.formattedDate}</div>
              <div className="text-[11px] text-[#FF7099]">{timing.formattedTime}</div>
            </div>

            <div className="p-3.5 bg-[#4C3549]/60 rounded-2xl border border-white/10 space-y-1">
              <div className="text-[10px] text-white/40 uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF7099]" /> Venue Stage
              </div>
              <div className="font-bold text-white text-sm truncate">{event.venue}</div>
              <div className="text-[11px] text-white/50">Gate Post Alpha</div>
            </div>

            <div className="p-3.5 bg-[#4C3549]/60 rounded-2xl border border-white/10 space-y-1">
              <div className="text-[10px] text-white/40 uppercase flex items-center gap-1">
                <Ticket className="w-3 h-3 text-[#10B981]" /> Pass Pricing
              </div>
              <div className="font-bold text-[#10B981] text-base">₹{event.basePrice} <span className="text-[10px] text-white/40 font-normal">base</span></div>
              <div className="text-[11px] text-white/50">{event.availableSeats} of {event.totalSeats} seats left</div>
            </div>
          </div>

          {/* ── LIVE TICKET PASS PREVIEW SECTION ── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-[#FF7099]" />
                Issued Digital Ticket Pass Preview
              </span>
              <span className="text-[10px] text-white/40">Visual simulation of student e-pass</span>
            </div>

            <div
              className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-6 sm:p-7 text-white ticket-notch-left ticket-notch-right transition-all"
              style={{
                backgroundColor: '#1E121C',
                backgroundImage: event.ticketBgImage
                  ? `linear-gradient(to bottom, rgba(20, 10, 18, 0.82), rgba(30, 15, 26, 0.94)), url(${event.ticketBgImage})`
                  : 'linear-gradient(135deg, #4C3549 0%, #2A1D26 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Background Glow accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF3E41]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Pass Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/15 relative z-10">
                <div className="flex items-center gap-3">
                  <img
                    src="/vibrance-logo.png"
                    alt="Vibrance 2026"
                    className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-[#FF3E41]/60 bg-black"
                  />
                  <div>
                    <span className="text-[9px] text-[#FF7099] tracking-widest uppercase font-bold">
                      VIBRANCE 2026 OFFICIAL PASS
                    </span>
                    <h4 className="text-base sm:text-lg font-black font-display tracking-wide text-white leading-tight">
                      {event.title}
                    </h4>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  CONFIRMED
                </span>
              </div>

              {/* Pass Body */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 relative z-10 text-xs">
                <div className="space-y-1">
                  <div className="text-[9px] text-white/40 uppercase">Attendee Profile</div>
                  <div className="font-bold text-white text-sm">Sample Student Attendee</div>
                  <div className="text-[10px] text-[#FF7099]">RA2111003010142 &bull; CSE</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] text-white/40 uppercase">Assigned Seat Tier</div>
                  <div className="font-black text-white text-base">Seat A-1 (VIP FRONT)</div>
                  <div className="text-[10px] text-[#10B981] font-bold">₹{Math.round(event.basePrice * 1.5)} PAID</div>
                </div>

                <div className="space-y-1 sm:text-right">
                  <div className="text-[9px] text-white/40 uppercase">Pass Serial Ref</div>
                  <div className="font-bold text-[#FF7099] text-xs">VIB26-{event.category.substring(0, 3)}-DEMO99</div>
                  <div className="text-[10px] text-white/50">{timing.formattedDate}</div>
                </div>
              </div>

              {/* Pass Footer Barcode Mockup */}
              <div className="mt-5 pt-3 border-t border-dashed border-white/15 flex items-center justify-between text-[10px] text-white/50 relative z-10">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF7099]" />
                  <span>Strict 2PL Verified &bull; Gate Post Alpha</span>
                </div>
                <div className="flex items-center gap-1 text-white/70">
                  <QrCode className="w-3.5 h-3.5 text-white" />
                  <span>Digital QR Embedded</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#4C3549]/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-white/60">
            Base pass: <strong className="text-white">₹{event.basePrice}</strong> &bull; {event.availableSeats} seats remaining
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectSeats(event);
              }}
              disabled={isSoldOut}
              className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                isSoldOut
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FF3E41] to-[#DF367C] hover:opacity-90 text-white cursor-pointer'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>{timing.isExpired ? 'Event Concluded' : event.availableSeats === 0 ? 'Sold Out' : 'Select Seat & Book Pass'}</span>
              {!isSoldOut && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
