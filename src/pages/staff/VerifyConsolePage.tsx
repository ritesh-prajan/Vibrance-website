import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { ScanRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  History,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const VerifyConsolePage: React.FC = () => {
  const { currentUser, verifyTicket, scanHistory, allBookings } = useFest();

  const [scanQuery, setScanQuery] = useState('');
  const [lastScanResult, setLastScanResult] = useState<ScanRecord | null>(null);

  const staff = {
    name: currentUser?.name || 'Officer Rajesh Menon',
    staffId: currentUser?.regNumber || 'STF-GATE-04',
  };

  const handleScan = (queryToScan?: string) => {
    const q = (queryToScan || scanQuery).trim();
    if (!q) return;

    const result = verifyTicket(q, staff);
    setLastScanResult(result);
    setScanQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Header with Active Gate Staff Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">
              GATE SECURITY CONSOLE
            </span>
            <span className="text-xs text-white/50 font-mono">Real-time Check-in Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            TICKET SCANNER &amp; ACCESS CONTROL
          </h1>
        </div>

        <div className="bg-[#4C3549] border border-white/15 rounded-2xl p-3.5 flex items-center gap-3 text-xs font-mono">
          <div className="w-8 h-8 rounded-xl bg-[#DF367C] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-white font-bold">{staff.name}</div>
            <div className="text-[#FF7099] text-[10px]">{staff.staffId} • Active Post</div>
          </div>
        </div>
      </div>

      {/* Main Scanner Input + Quick Test Buttons */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="space-y-4"
        >
          <label className="block text-xs font-mono font-bold text-white/80 uppercase tracking-wider">
            Scan / Enter Booking Reference Code or QR Payload:
          </label>

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

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-[#DF367C] hover:bg-[#c42867] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Verify Pass</span>
            </button>
          </div>
        </form>

        {/* Quick 1-Click Simulation Shortcut Buttons for Demos */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="text-[11px] font-mono text-white/50 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7099]" />
            <span>Gate Demo Quick-Scan Shortcuts:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => handleScan('VIB26-EDM-C3')}
              className="px-3 py-1.5 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Test Valid Pass (VIB26-EDM-C3)</span>
            </button>

            <button
              type="button"
              onClick={() => handleScan('VIB26-ARMAAN-A1')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Test Used / Duplicate (VIB26-ARMAAN-A1)</span>
            </button>

            <button
              type="button"
              onClick={() => handleScan('VIB26-INVALID-TEST99')}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Test Invalid Code (VIB26-INVALID-TEST99)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Verification Result Display */}
      {lastScanResult && (
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold text-white/70 uppercase tracking-wider">
            Verification Result Inspection:
          </div>

          {/* 1. VALID RESULT */}
          {lastScanResult.result === 'VALID' && (
            <div className="bg-[#4C3549] border-2 border-[#10B981] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                      ACCESS GRANTED • VALID PASS
                    </span>
                    <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">
                      {lastScanResult.eventTitle}
                    </h2>
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
            </div>
          )}

          {/* 2. ALREADY USED / FRAUD ALERT RESULT */}
          {lastScanResult.result === 'ALREADY_USED' && (
            <div className="bg-[#4C3549] border-2 border-amber-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      DUPLICATE ENTRY ALERT • FRAUD WARNING
                    </span>
                    <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">
                      Pass Already Checked In
                    </h2>
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
                  <div className="font-bold text-white text-sm">
                    {lastScanResult.originalCheckedInBy || 'Gate Staff #01'}
                  </div>
                  <div className="text-[10px] text-amber-300">
                    Timestamp: {lastScanResult.originalCheckedInAt ? new Date(lastScanResult.originalCheckedInAt).toLocaleTimeString() : 'Prior check-in'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-200">
                <strong>Access Denied:</strong> This digital pass barcode has already been scanned and admitted. Intercept duplicate holder.
              </div>
            </div>
          )}

          {/* 3. INVALID / NOT FOUND RESULT */}
          {lastScanResult.result === 'INVALID' && (
            <div className="bg-[#4C3549] border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shadow-lg">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                      ACCESS DENIED • INVALID PASS
                    </span>
                    <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">
                      No Record Located
                    </h2>
                  </div>
                </div>

                <StatusBadge status="INVALID" size="lg" />
              </div>

              <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-300">
                {lastScanResult.message} Code scanned: [{lastScanResult.query}]. Direct attendee to Helpdesk.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shift Recent Scans Table */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#FF7099]" />
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              RECENT SCANS THIS SHIFT
            </h2>
          </div>

          <Link
            to="/verify/history"
            className="text-xs font-mono text-[#FF7099] hover:underline"
          >
            View Full Check-in History &rarr;
          </Link>
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
              {scanHistory.slice(0, 6).map((scan) => (
                <tr key={scan.id} className="hover:bg-white/5">
                  <td className="py-3 pr-4 text-white/50 text-[11px]">
                    {new Date(scan.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={scan.result} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-bold text-[#FF7099]">
                    {scan.bookingRef || scan.query}
                  </td>
                  <td className="py-3 px-4 text-white">
                    {scan.attendeeName || 'Unknown Attendee'}
                  </td>
                  <td className="py-3 px-4 text-white/70 truncate max-w-[180px]">
                    {scan.eventTitle || 'N/A'}
                  </td>
                  <td className="py-3 pl-4 text-white/50 text-[11px]">
                    {scan.staffMember.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
