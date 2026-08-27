import React, { useState } from 'react';
import { useFest } from '../context/FestContext';
import { FestEvent, Seat, Booking } from '../types';
import { X, CreditCard, QrCode, Building2, ShieldCheck, Zap, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  event: FestEvent | null;
  seat: Seat | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  event,
  seat,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const { currentUser, confirmBooking, seatLockTimeRemaining, releaseActiveSeat } = useFest();

  const [studentName, setStudentName] = useState(currentUser?.name || 'Rahul Sharma');
  const [regNumber, setRegNumber] = useState(currentUser?.regNumber || 'RA2111003010142');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science & Engineering');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CAMPUS_CARD' | 'NET_BANKING'>('UPI');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  if (!isOpen || !event || !seat) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Visual step sequence for DBMS Presentation
    setProcessingStep('1/3: Validating Exclusive Lease Lock (X-Lock)...');
    await new Promise((r) => setTimeout(r, 350));

    setProcessingStep('2/3: Executing Transaction & Write-Ahead Log (WAL)...');
    await new Promise((r) => setTimeout(r, 400));

    setProcessingStep('3/3: Committing ACID Transaction & Generating Pass...');
    const result = await confirmBooking({
      name: studentName,
      regNumber,
      department,
      paymentMethod,
    });

    setIsProcessing(false);

    if (result) {
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ccff00', '#00e5ff', '#ff3366', '#ffffff'],
      });
      onBookingSuccess(result);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e121a] border border-white/15 rounded-3xl max-w-xl w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#121620] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ccff00] text-black font-bold flex items-center justify-center font-display text-sm">
              PASS
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Confirm Ticket Reservation</h2>
              <p className="text-xs text-white/50 font-mono">DBMS TRANSACTION COMMITTAL FLOW</p>
            </div>
          </div>

          <button
            onClick={() => {
              releaseActiveSeat();
              onClose();
            }}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Timer Alert */}
        <div className="bg-[#ccff00]/10 border-b border-[#ccff00]/25 px-5 py-2 flex items-center justify-between text-xs text-[#ccff00] font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Seat [{seat.row}-{seat.number}] locked under your student session.</span>
          </div>
          <span className="font-bold">
            {Math.floor(seatLockTimeRemaining / 60)}:
            {(seatLockTimeRemaining % 60).toString().padStart(2, '0')}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Selected Pass Summary Card */}
          <div className="bg-[#080a0f] p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/40 uppercase font-mono">{event.category}</p>
              <h4 className="text-sm font-bold text-white leading-tight">{event.title}</h4>
              <p className="text-xs text-white/60 mt-0.5 font-mono">
                Seat <span className="text-[#ccff00] font-bold">[{seat.row}-{seat.number}]</span> ({seat.category}) • {event.venue}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40 font-mono">Total Payable</p>
              <p className="text-xl font-bold text-[#ccff00] font-mono">₹{seat.price}</p>
            </div>
          </div>

          {/* Student Credentials Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-[#080a0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#ccff00] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">Registration / Roll No.</label>
                <input
                  type="text"
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full bg-[#080a0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#ccff00] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">Academic Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#080a0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#ccff00] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector (Dummy Mock) */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-white/80 mb-2">Simulated Payment Channel</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-[#ccff00]/15 border-[#ccff00] text-white shadow-sm'
                    : 'bg-[#080a0f] border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                <QrCode className="w-4 h-4 mb-1 text-[#ccff00]" />
                <p className="text-xs font-bold">Campus UPI</p>
                <p className="text-[9px] text-white/40 font-mono">GPay / PhonePe</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CAMPUS_CARD')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'CAMPUS_CARD'
                    ? 'bg-[#ccff00]/15 border-[#ccff00] text-white shadow-sm'
                    : 'bg-[#080a0f] border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                <CreditCard className="w-4 h-4 mb-1 text-[#00e5ff]" />
                <p className="text-xs font-bold">RFID Card</p>
                <p className="text-[9px] text-white/40 font-mono">Student Smart Wallet</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NET_BANKING')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'NET_BANKING'
                    ? 'bg-[#ccff00]/15 border-[#ccff00] text-white shadow-sm'
                    : 'bg-[#080a0f] border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                <Building2 className="w-4 h-4 mb-1 text-purple-400" />
                <p className="text-xs font-bold">NetBanking</p>
                <p className="text-[9px] text-white/40 font-mono">Direct Portal</p>
              </button>
            </div>
          </div>

          {/* ACID Processing Status */}
          {isProcessing && (
            <div className="bg-[#121620] p-3 rounded-xl border border-white/10 flex items-center gap-3 text-xs text-white font-mono animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-[#ccff00]" />
              <span>{processingStep}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black py-3.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] hover:scale-101 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Committing Transaction...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Confirm & Commit Booking (₹{seat.price})</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-white/40 text-center font-mono flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#ccff00]" /> 2-Phase Locking ensures no duplicate seats are committed.
          </p>
        </form>
      </div>
    </div>
  );
};
