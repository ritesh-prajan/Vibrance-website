import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
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

        <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl space-y-5">
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
        </div>
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

    try {
      const booking = await confirmBooking({
        name,
        regNumber,
        department,
        paymentMethod,
      });

      if (booking) {
        navigate(`/ticket/${booking.id}`);
      } else {
        setErrorMsg('Booking transaction could not be committed. Please try again.');
        setIsProcessing(false);
      }
    } catch {
      setErrorMsg('Transaction failed due to concurrency conflict.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Events Catalog', path: '/events' },
          { label: event.title, path: `/events/${event.id}` },
          { label: 'Seat Selection', path: `/events/${event.id}/seats` },
          { label: 'Checkout' },
        ]}
        backLink={{ label: 'Back to Seat Map', path: `/events/${event.id}/seats` }}
      />

      <div className="bg-[#4C3549] border-2 border-[#FF3E41] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF3E41] text-white flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span>HOLD TIMER ACTIVE • SEAT [{activeSeat.row}-{activeSeat.number}]</span>
              <span className="px-2 py-0.5 rounded bg-[#FF3E41] text-white text-[11px]">
                {formatTimer(seatLockTimeRemaining)}
              </span>
            </div>
            <p className="text-[11px] text-white/70 font-sans-body">
              Seat held with Exclusive X-Lock. Auto-releases if countdown reaches 0:00.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center gap-2 text-red-300 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleConfirm} className="space-y-6">
            <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <h2 className="text-lg font-bold text-white font-display tracking-wide">
                1. ATTENDEE VERIFICATION DETAILS
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>
            </div>

            <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white font-display tracking-wide">
                  2. PAYMENT METHOD (DEMO SANDBOX)
                </h2>
                <span className="text-[10px] font-mono text-white/40 uppercase">Dummy Gateway</span>
              </div>

              <div className="space-y-2.5">
                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'UPI'
                      ? 'bg-[#883955]/40 border-[#FF3E41] text-white'
                      : 'bg-[#2A1D26] border-white/10 text-white/70 hover:bg-[#883955]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#FF7099]" />
                    <div>
                      <div className="text-xs font-mono font-bold">UPI / QR Payment</div>
                      <div className="text-[11px] text-white/50">Google Pay, PhonePe, Paytm, BHIM</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="accent-[#FF3E41]"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod('CAMPUS_CARD')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'CAMPUS_CARD'
                      ? 'bg-[#883955]/40 border-[#FF3E41] text-white'
                      : 'bg-[#2A1D26] border-white/10 text-white/70 hover:bg-[#883955]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#FF7099]" />
                    <div>
                      <div className="text-xs font-mono font-bold">Campus RFID Smartcard</div>
                      <div className="text-[11px] text-white/50">Deduct from College Student Wallet</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CAMPUS_CARD'}
                    onChange={() => setPaymentMethod('CAMPUS_CARD')}
                    className="accent-[#FF3E41]"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod('NET_BANKING')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'NET_BANKING'
                      ? 'bg-[#883955]/40 border-[#FF3E41] text-white'
                      : 'bg-[#2A1D26] border-white/10 text-white/70 hover:bg-[#883955]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-[#FF7099]" />
                    <div>
                      <div className="text-xs font-mono font-bold">Net Banking / Debit Card</div>
                      <div className="text-[11px] text-white/50">HDFC, SBI, ICICI, Axis Bank</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'NET_BANKING'}
                    onChange={() => setPaymentMethod('NET_BANKING')}
                    className="accent-[#FF3E41]"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs sm:text-sm font-bold font-mono transition-all shadow-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Committing Transaction to DBMS Engine...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm & Commit Booking (₹{totalAmount})</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              ORDER BREAKDOWN
            </h2>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Event</div>
                <div className="font-bold text-white">{event.title}</div>
                <div className="text-white/60">{event.date} • {event.time}</div>
                <div className="text-white/40 truncate">{event.venue}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#883955]/30 border border-[#883955]/50 space-y-2">
                <div className="flex justify-between items-center text-white/70">
                  <span>Seat Allocation:</span>
                  <span className="font-bold text-white">
                    Seat {activeSeat.row}-{activeSeat.number}
                  </span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Seat Tier:</span>
                  <span className="text-[#FF7099]">{activeSeat.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Base Pass Price:</span>
                  <span className="font-bold text-white">₹{basePrice}</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Convenience Fee:</span>
                  <span>₹{convenienceFee}</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Festival GST (5%):</span>
                  <span>₹{gst}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/15 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase">Total Amount</span>
                <span className="text-xl font-black text-white font-mono">₹{totalAmount}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#2A1D26]/60 border border-white/10 text-[11px] font-mono text-white/60 space-y-1">
              <div className="flex items-center gap-1.5 text-[#10B981]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-bold">2PL Commit Protocol</span>
              </div>
              <p>On confirmation, exclusive lock transitions to permanently committed row record.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
