import React, { useState, useCallback } from 'react';
import { useFest } from '../../context/FestContext';
import { ScanRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ShieldCheck, Search, CheckCircle2, AlertTriangle, XCircle, Clock, History, QrCode, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VerifyConsolePage: React.FC = () => {
  const { currentUser, verifyTicket, scanHistory, allBookings } = useFest();
  const reduced = usePrefersReducedMotion();
  const duplicateControls = useAnimation();

  const [scanQuery, setScanQuery] = useState('');
  const [lastScanResult, setLastScanResult] = useState<ScanRecord | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const staff = { name: currentUser?.name || 'Officer Rajesh Menon', staffId: currentUser?.regNumber || 'STF-GATE-04' };

  const handleScan = useCallback(async (queryToScan?: string) => {
    const q = (queryToScan || scanQuery).trim();
    if (!q) return;
    setIsScanning(true);
    setLastScanResult(null);
    await new Promise((r) => setTimeout(r, 380));
    const result = verifyTicket(q, staff);
    setLastScanResult(result);
    setIsScanning(false);
    setScanQuery('');
    if (result.result === 'ALREADY_USED' && !reduced) {
      await duplicateControls.start({
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.45, ease: 'easeInOut' },
      });
    }
  }, [scanQuery, staff, verifyTicket, reduced, duplicateControls]);

  const resultVariants = {
    VALID: {
      initial: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10 },
      animate: reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0.25, ease: 'easeOut' },
    },
    ALREADY_USED: {
      initial: reduced ? { opacity: 0 } : { opacity: 0, y: 10 },
      animate: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
      transition: { duration: 0.22, ease: 'easeOut' },
    },
    INVALID: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const rv = lastScanResult ? resultVariants[lastScanResult.result] ?? resultVariants.INVALID : resultVariants.INVALID;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">GATE SECURITY CONSOLE</span>
            <span className="text-xs text-white/50 font-mono">Real-time Check-in Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">TICKET SCANNER &amp; ACCESS CONTROL</h1>
        </div>
        <div className="bg-[#4C3549] border border-white/15 rounded-2xl p-3.5 flex items-center gap-3 text-xs font-mono">
          <div className="w-8 h-8 rounded-xl bg-[#DF367C] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-white font-bold">{staff.name}</div>
            <div className="text-[#FF7099] text-[10px]">{staff.staffId} &bull; Active Post</div>
          </div>
        </div>
      </div>

      {/* Scanner Input */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <form onSubmit={(e) => { e.preventDefault(); handleScan(); }} className="space-y-4">
          <label className="block text-xs font-mono font-bold text-white/80 uppercase tracking-wider">Scan / Enter Booking Reference Code or QR Payload:</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <QrCode className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. VIB26-EDM-C3 or VIB26-ARMAAN-A1"
                value={scanQuery}
                onChange={(e) => setScanQuery(e.target.value)}
                className="w-full bg-[#2A1D26] border border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white font-mono placeholder-white/40 focus:outline-none focus:border-[#DF367C]"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isScanning}
              className="px-8 py-3.5 rounded-2xl bg-[#DF367C] hover:bg-[#c42867] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-70"
            >
              {isScanning ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }} className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{isScanning ? 'Verifying...' : 'Verify Pass'}</span>
            </motion.button>
          </div>
        </form>

        {/* Quick Test Buttons */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="text-[11px] font-mono text-white/50 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7099]" />
            <span>Gate Demo Quick-Scan Shortcuts:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => handleScan('VIB26-EDM-C3')} className="px-3 py-1.5 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 transition-colors flex items-center gap-1.5 cursor-pointer">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Test Valid Pass (VIB26-EDM-C3)</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => handleScan('VIB26-ARMAAN-A1')} className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Test Used / Duplicate (VIB26-ARMAAN-A1)</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => handleScan('VIB26-INVALID-TEST99')} className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 transition-colors flex items-center gap-1.5 cursor-pointer">
              <XCircle className="w-3.5 h-3.5" />
              <span>Test Invalid Code (VIB26-INVALID-TEST99)</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Scan Result */}
      <AnimatePresence mode="wait">
        {lastScanResult && (
          <div className="space-y-4" key={`${lastScanResult.id}-${lastScanResult.result}`}>
            <div className="text-xs font-mono font-bold text-white/70 uppercase tracking-wider">Verification Result Inspection:</div>

            {/* VALID */}
            {lastScanResult.result === 'VALID' && (
              <motion.div
                initial={rv.initial} animate={rv.animate} transition={rv.transition}
                className="bg-[#4C3549] border-2 border-[#10B981] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
                      className="w-14 h-14 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">ACCESS GRANTED &bull; VALID PASS</span>
                      <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">{lastScanResult.eventTitle}</h2>
                    </div>
                  </div>
                  <StatusBadge status="VALID" size="lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Attendee</div>
                    <div className="font-bold text-white text-base">{lastScanResult.attendeeName}</div>
                    <div className="text-[#FF7099]">Verified Student</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Seat Assignment</div>
                    <div className="font-black text-white text-xl">Seat {lastScanResult.seatLabel}</div>
                    <div className="text-[#FF7099]">Reserved Seat</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Pass Reference</div>
                    <div className="font-bold text-[#FF7099] text-base">{lastScanResult.bookingRef}</div>
                    <div className="text-[10px] text-white/50">Checked in just now</div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-mono text-[#10B981] flex items-center justify-between">
                  <span>{lastScanResult.message}</span>
                  <span className="text-white/60">Inspector: {staff.name}</span>
                </div>
              </motion.div>
            )}

            {/* ALREADY USED */}
            {lastScanResult.result === 'ALREADY_USED' && (
              <motion.div
                initial={rv.initial} animate={duplicateControls} transition={rv.transition}
                onAnimationStart={() => { duplicateControls.set(rv.initial); duplicateControls.start(rv.animate); }}
                className="bg-[#4C3549] border-2 border-amber-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ backgroundColor: ['rgba(245,158,11,0.2)', 'rgba(245,158,11,0.4)', 'rgba(245,158,11,0.2)'] }}
                      transition={{ duration: 0.8, repeat: 3 }}
                      className="w-14 h-14 rounded-2xl border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg"
                    >
                      <AlertTriangle className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">DUPLICATE ENTRY ALERT &bull; FRAUD WARNING</span>
                      <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">Pass Already Checked In</h2>
                    </div>
                  </div>
                  <StatusBadge status="ALREADY_USED" size="lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Registered Attendee</div>
                    <div className="font-bold text-white text-base">{lastScanResult.attendeeName}</div>
                    <div className="text-white/50">{lastScanResult.eventTitle}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Seat Claimed</div>
                    <div className="font-black text-white text-xl">Seat {lastScanResult.seatLabel}</div>
                    <div className="text-amber-300">Original Pass Used</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Original Check-in Staff</div>
                    <div className="font-bold text-white text-sm">{lastScanResult.originalCheckedInBy || 'Gate Staff #01'}</div>
                    <div className="text-[10px] text-amber-300">
                      Timestamp: {lastScanResult.originalCheckedInAt ? new Date(lastScanResult.originalCheckedInAt).toLocaleTimeString() : 'Prior check-in'}
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-200">
                  <strong>Access Denied:</strong> This digital pass barcode has already been scanned and admitted. Intercept duplicate holder.
                </div>
              </motion.div>
            )}

            {/* INVALID */}
            {lastScanResult.result === 'INVALID' && (
              <motion.div
                initial={rv.initial} animate={rv.animate} transition={rv.transition}
                className="bg-[#4C3549] border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shadow-lg">
                      <XCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">ACCESS DENIED &bull; INVALID PASS</span>
                      <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">No Record Located</h2>
                    </div>
                  </div>
                  <StatusBadge status="INVALID" size="lg" />
                </div>
                <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-300">
                  {lastScanResult.message} Code scanned: [{lastScanResult.query}]. Direct attendee to Helpdesk.
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Recent Scans - slide-in on new entry */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#FF7099]" />
            <h2 className="text-lg font-bold text-white font-display tracking-wide">RECENT SCANS THIS SHIFT</h2>
          </div>
          <Link to="/verify/history" className="text-xs font-mono text-[#FF7099] hover:underline">View Full Check-in History &rarr;</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                <th className="pb-3 pr-4">Timestamp</th>
                <th className="pb-3 px-4">Result</th>
                <th className="pb-3 px-4">Pass Reference</th>
                <th className="pb-3 px-4">Attendee</th>
                <th className="pb-3 px-4">Event</th>
                <th className="pb-3 pl-4">Staff Inspector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              <AnimatePresence initial={false}>
                {scanHistory.slice(0, 6).map((scan) => (
                  <motion.tr
                    key={scan.id}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, x: -16, backgroundColor: '#883955' }}
                    animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="hover:bg-white/5"
                  >
                    <td className="py-3 pr-4 text-white/50 text-[11px]">{new Date(scan.timestamp).toLocaleTimeString()}</td>
                    <td className="py-3 px-4"><StatusBadge status={scan.result} size="sm" /></td>
                    <td className="py-3 px-4 font-bold text-[#FF7099]">{scan.bookingRef || scan.query}</td>
                    <td className="py-3 px-4 text-white">{scan.attendeeName || 'Unknown Attendee'}</td>
                    <td className="py-3 px-4 text-white/70 truncate max-w-[180px]">{scan.eventTitle || 'N/A'}</td>
                    <td className="py-3 pl-4 text-white/50 text-[11px]">{scan.staffMember.name}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
