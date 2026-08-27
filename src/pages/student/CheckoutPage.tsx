import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { motion } from 'framer-motion';
import {
  Clock,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const {
    events,
    currentUser,
    activeSeat,
    seatLockTimeRemaining,
    confirmBooking,
  } = useFest();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === eventId) || events[0];

  const [name, setName] = useState(currentUser?.name || 'Rahul Sharma');
  const [regNumber, setRegNumber] = useState(currentUser?.regNumber || 'RA2111003010142');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science & Engineering');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CAMPUS_CARD' | 'NET_BANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeSeat || seatLockTimeRemaining <= 0) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Events Catalog', path: '/events' },
            { label: event.title, path: `/events/${event.id}` },
            { label: 'Checkout' },
          ]}
          backLink={{ label: 'Back to Seat Map', path: `/events/${event.id}/seats` }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#4C3549] border border-white/15 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl space-y-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              SEAT LEASE TIMEOUT
            </span>
            <h2 className="text-2xl font-black text-white font-display tracking-wide pt-1">
              Reservation Window Expired
            </h2>
            <p className="text-xs text-white/60 font-sans-body leading-relaxed max-w-sm mx-auto">
              Your 3-minute seat hold lease has expired and the seat was released back to the festival inventory pool.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to={`/events/${event.id}/seats`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-lg gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Select Seats Again</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const basePrice = activeSeat.price;
  const convenienceFee = 25;
  const gst = Math.round(basePrice * 0.05);
  const totalAmount = basePrice + convenienceFee + gst;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regNumber.trim()) {
      setErrorMsg('Please fill in attendee details.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const booking = await confirmBooking({
      name,
      regNumber,
      department,
      paymentMethod,
    });

    if (booking) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate(`/ticket/${booking.id}`);
      }, 450);
    } else {
      setIsProcessing(false);
      setErrorMsg('Failed to serialize transaction. Lock lease expired or lost update prevented.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Events Catalog', path: '/events' },
          { label: event.title, path: `/events/${event.id}` },
          { label: 'Seat Selection', path: `/events/${event.id}/seats` },
          { label: 'Payment Checkout' },
        ]}
        backLink={{ label: 'Change Seat Selection', path: `/events/${event.id}/seats` }}
      />

      {/* Sticky Hold Timer Warning Strip */}
      <div className="bg-[#4C3549] border-2 border-[#FF3E41] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF3E41] text-white flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span>HOLD EXPIRES IN</span>
              <span className="px-2 py-0.5 rounded bg-[#FF3E41] text-white text-[11px]">
                {formatTimer(seatLockTimeRemaining)}
              </span>
            </div>
            <p className="text-[11px] text-white/70 font-sans-body">
              Seat [{activeSeat.row}-{activeSeat.number}] will be auto-released if payment is not finalized.
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-[10px] text-white/40 uppercase block">Total Due</span>
          <span className="text-xl font-black text-white font-mono">₹{totalAmount}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center gap-2 text-red-300 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Attendee Details & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              1. ATTENDEE VERIFICATION
            </h2>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-white/70 mb-1 uppercase text-[10px]">
                  Attendee Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 uppercase text-[10px]">
                    Registration / Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 uppercase text-[10px]">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              2. PAYMENT GATEWAY (SANDBOX SIMULATION)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              {[
                { id: 'UPI', label: 'UPI / QR', desc: 'GooglePay, PhonePe, Paytm', icon: <Smartphone className="w-5 h-5" /> },
                { id: 'CAMPUS_CARD', label: 'Campus SmartCard', desc: 'Auto-debit from student wallet', icon: <CreditCard className="w-5 h-5" /> },
                { id: 'NET_BANKING', label: 'Net Banking', desc: 'SBI, HDFC, ICICI, Axis', icon: <Building className="w-5 h-5" /> },
              ].map((m) => (
                <motion.button
                  key={m.id}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    paymentMethod === m.id
                      ? 'border-[#FF3E41] bg-[#FF3E41]/10 text-white'
                      : 'border-white/10 bg-[#2A1D26] text-white/70 hover:border-white/20'
                  }`}
                >
                  <div className="text-[#FF7099]">{m.icon}</div>
                  <div>
                    <div className="font-bold text-white">{m.label}</div>
                    <div className="text-[10px] text-white/50">{m.desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              ORDER SUMMARY
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="font-bold text-white">{event.title}</div>
                <div className="text-white/60">{event.date} • {event.time}</div>
                <div className="text-[#FF7099] pt-1">
                  Seat: Row {activeSeat.row} - #{activeSeat.number} ({activeSeat.category})
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 text-white/80">
                <div className="flex justify-between">
                  <span className="text-white/60">Base Ticket Pass:</span>
                  <span>₹{basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Convenience / Tech Fee:</span>
                  <span>₹{convenienceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">GST (5%):</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-base font-black text-white">
                  <span>Total Amount:</span>
                  <span className="text-[#FF7099]">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold font-mono text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isProcessing ? (
                isSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-white"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    <span>Booking Confirmed!</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                      className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Acquiring 2PL Commit...</span>
                  </div>
                )
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pay ₹{totalAmount} &amp; Issue Pass</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};
