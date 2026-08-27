import os

def w(p, c):
    full = os.path.abspath(p)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(c.strip() + '\n')
    print(f'Wrote {p}')

# 1. VerifyConsolePage.tsx
w('src/pages/staff/VerifyConsolePage.tsx', '''import React, { useState } from 'react';
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
''')

# 2. VerifyHistoryPage.tsx
w('src/pages/staff/VerifyHistoryPage.tsx', '''import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const VerifyHistoryPage: React.FC = () => {
  const { scanHistory, clearScanHistory } = useFest();

  const [filterResult, setFilterResult] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = scanHistory.filter((s) => {
    if (filterResult !== 'ALL' && s.result !== filterResult) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (s.bookingRef && s.bookingRef.toLowerCase().includes(q)) ||
        (s.attendeeName && s.attendeeName.toLowerCase().includes(q)) ||
        (s.eventTitle && s.eventTitle.toLowerCase().includes(q)) ||
        s.query.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const validCount = scanHistory.filter((s) => s.result === 'VALID').length;
  const duplicateCount = scanHistory.filter((s) => s.result === 'ALREADY_USED').length;
  const invalidCount = scanHistory.filter((s) => s.result === 'INVALID').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">
              GATE TELEMETRY
            </span>
            <span className="text-xs text-white/50 font-mono">Central Verification Log</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            CHECK-IN AUDIT HISTORY
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/verify"
            className="px-4 py-2 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white text-xs font-bold font-mono transition-all shadow-md flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Verify Scanner</span>
          </Link>

          {scanHistory.length > 0 && (
            <button
              onClick={clearScanHistory}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-colors border border-white/10 cursor-pointer"
              title="Clear Scan History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#4C3549] p-4 rounded-2xl border border-white/15">
          <div className="text-[10px] text-white/40 uppercase">Total Scans</div>
          <div className="text-2xl font-black text-white mt-1">{scanHistory.length}</div>
        </div>

        <div className="bg-[#4C3549] p-4 rounded-2xl border border-white/15">
          <div className="text-[10px] text-[#10B981] uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Valid Check-ins
          </div>
          <div className="text-2xl font-black text-[#10B981] mt-1">{validCount}</div>
        </div>

        <div className="bg-[#4C3549] p-4 rounded-2xl border border-white/15">
          <div className="text-[10px] text-amber-300 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Duplicates Intercepted
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1">{duplicateCount}</div>
        </div>

        <div className="bg-[#4C3549] p-4 rounded-2xl border border-white/15">
          <div className="text-[10px] text-red-400 uppercase flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Invalid Passes
          </div>
          <div className="text-2xl font-black text-red-400 mt-1">{invalidCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto font-mono text-xs">
          <button
            onClick={() => setFilterResult('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterResult === 'ALL' ? 'bg-[#DF367C] text-white font-bold' : 'bg-[#4C3549] text-white/60 hover:text-white'
            }`}
          >
            All Results ({scanHistory.length})
          </button>
          <button
            onClick={() => setFilterResult('VALID')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterResult === 'VALID' ? 'bg-[#DF367C] text-white font-bold' : 'bg-[#4C3549] text-white/60 hover:text-white'
            }`}
          >
            Valid Passes ({validCount})
          </button>
          <button
            onClick={() => setFilterResult('ALREADY_USED')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterResult === 'ALREADY_USED' ? 'bg-[#DF367C] text-white font-bold' : 'bg-[#4C3549] text-white/60 hover:text-white'
            }`}
          >
            Duplicates ({duplicateCount})
          </button>
          <button
            onClick={() => setFilterResult('INVALID')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterResult === 'INVALID' ? 'bg-[#DF367C] text-white font-bold' : 'bg-[#4C3549] text-white/60 hover:text-white'
            }`}
          >
            Invalid ({invalidCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ref, attendee, event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#4C3549] border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white font-mono placeholder-white/40 focus:border-[#DF367C] focus:outline-none"
          />
        </div>
      </div>

      {/* History Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Check-in Records Found"
          description="No scans match your selected filter criteria."
          actionText="Reset Filters"
          onAction={() => {
            setFilterResult('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                <th className="pb-3 pr-4">Timestamp</th>
                <th className="pb-3 px-4">Status Result</th>
                <th className="pb-3 px-4">Pass Ref</th>
                <th className="pb-3 px-4">Attendee Name</th>
                <th className="pb-3 px-4">Seat</th>
                <th className="pb-3 px-4">Event Title</th>
                <th className="pb-3 pl-4">Staff Member</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-white/5">
                  <td className="py-3 pr-4 text-white/50 text-[11px]">
                    {new Date(s.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={s.result} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-bold text-[#FF7099]">
                    {s.bookingRef || s.query}
                  </td>
                  <td className="py-3 px-4 text-white">
                    {s.attendeeName || '—'}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {s.seatLabel || '—'}
                  </td>
                  <td className="py-3 px-4 text-white/70 truncate max-w-[180px]">
                    {s.eventTitle || '—'}
                  </td>
                  <td className="py-3 pl-4 text-white/50 text-[11px]">
                    {s.staffMember.name} ({s.staffMember.staffId})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
''')

# 3. AdminDashboardPage.tsx
w('src/pages/admin/AdminDashboardPage.tsx', '''import React from 'react';
import { Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Cpu,
  Activity,
  DollarSign,
  ShieldCheck,
  Flame,
  ArrowRight,
  Database,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { events, allBookings, auditLogs, scanHistory } = useFest();

  const confirmedBookings = allBookings.filter((b) => b.status === 'confirmed' || b.status === 'checked_in');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.amount, 0);

  const checkedInCount = allBookings.filter((b) => b.status === 'checked_in').length;
  const checkInRate = confirmedBookings.length > 0
    ? Math.round((checkedInCount / confirmedBookings.length) * 100)
    : 0;

  const contentionConflicts = auditLogs.filter((l) => l.action === 'LOCK_REJECTED' || l.action === 'RACE_OVERBOOK').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">
              FACULTY CONTROLLER
            </span>
            <span className="text-xs text-white/50 font-mono">DBMS Lab &amp; Festival Executive Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            EXECUTIVE AUDIT &amp; TELEMETRY
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/concurrency-lab"
            className="px-4 py-2.5 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center gap-1.5"
          >
            <Cpu className="w-4 h-4" />
            <span>Launch Concurrency Simulator</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        <div className="bg-[#4C3549] border border-white/15 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-white/40 text-[10px] uppercase">
            <span>Total Events</span>
            <Calendar className="w-4 h-4 text-[#FF7099]" />
          </div>
          <div className="text-2xl font-black text-white">{events.length}</div>
          <div className="text-[11px] text-white/50">Active Festival Stages</div>
        </div>

        <div className="bg-[#4C3549] border border-white/15 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-white/40 text-[10px] uppercase">
            <span>Passes Issued</span>
            <Ticket className="w-4 h-4 text-[#FF3E41]" />
          </div>
          <div className="text-2xl font-black text-white">{confirmedBookings.length}</div>
          <div className="text-[11px] text-white/50">Confirmed / Serialized</div>
        </div>

        <div className="bg-[#4C3549] border border-white/15 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-white/40 text-[10px] uppercase">
            <span>Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-black text-[#10B981]">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-white/50">Gross Ticketing Volume</div>
        </div>

        <div className="bg-[#4C3549] border border-white/15 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-white/40 text-[10px] uppercase">
            <span>Contention Conflicts</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{contentionConflicts}</div>
          <div className="text-[11px] text-white/50">409 Conflicts Handled</div>
        </div>

        <div className="bg-[#4C3549] border border-white/15 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-white/40 text-[10px] uppercase">
            <span>Check-in Rate</span>
            <ShieldCheck className="w-4 h-4 text-[#DF367C]" />
          </div>
          <div className="text-2xl font-black text-[#FF7099]">{checkInRate}%</div>
          <div className="text-[11px] text-white/50">{checkedInCount} of {confirmedBookings.length} Admitted</div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/concurrency-lab"
          className="bg-gradient-to-br from-[#4C3549] to-[#883955] border border-white/15 rounded-3xl p-6 hover:border-white/30 transition-all shadow-xl space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DF367C] text-white flex items-center justify-center font-bold shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white font-display flex items-center justify-between">
            <span>CONCURRENCY SIMULATOR LAB</span>
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-white/70 font-sans-body leading-relaxed">
            Benchmark database isolation strategies (No Locking vs Strict 2PL vs OCC) with live side-by-side transaction execution tables.
          </p>
        </Link>

        <Link
          to="/admin/events"
          className="bg-gradient-to-br from-[#4C3549] to-[#883955] border border-white/15 rounded-3xl p-6 hover:border-white/30 transition-all shadow-xl space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#883955] text-white flex items-center justify-center font-bold shadow-md border border-white/20">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white font-display flex items-center justify-between">
            <span>INVENTORY &amp; EVENT MANAGEMENT</span>
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-white/70 font-sans-body leading-relaxed">
            Manage stage event capacities, modify base pricing tiers, and inspect per-event seat contention metrics.
          </p>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="bg-gradient-to-br from-[#4C3549] to-[#883955] border border-white/15 rounded-3xl p-6 hover:border-white/30 transition-all shadow-xl space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FF3E41] text-white flex items-center justify-center font-bold shadow-md">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white font-display flex items-center justify-between">
            <span>SYSTEM AUDIT &amp; TRANSACTION LOGS</span>
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-white/70 font-sans-body leading-relaxed">
            Inspect all ACID commits, lock grants, timeout expirations, overbooking anomalies, and gate verification check-ins.
          </p>
        </Link>
      </div>

      {/* Per-Event Sales Breakdown Table */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h2 className="text-lg font-bold text-white font-display tracking-wide">
          EVENT INVENTORY &amp; SALES BREAKDOWN
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                <th className="pb-3 pr-4">Event Title</th>
                <th className="pb-3 px-4">Category</th>
                <th className="pb-3 px-4">Base Price</th>
                <th className="pb-3 px-4">Capacity (Total)</th>
                <th className="pb-3 px-4">Booked</th>
                <th className="pb-3 px-4">Locked (TTL)</th>
                <th className="pb-3 px-4">Available</th>
                <th className="pb-3 pl-4">Occupancy %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {events.map((e) => {
                const bookedPct = Math.round((e.bookedSeatsCount / e.totalSeats) * 100);
                return (
                  <tr key={e.id} className="hover:bg-white/5">
                    <td className="py-3 pr-4 font-bold text-white">
                      {e.title}
                    </td>
                    <td className="py-3 px-4 text-white/60">
                      {e.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-[#FF7099]">
                      ₹{e.basePrice}
                    </td>
                    <td className="py-3 px-4 text-white/60">
                      {e.totalSeats} seats
                    </td>
                    <td className="py-3 px-4 text-[#10B981] font-bold">
                      {e.bookedSeatsCount}
                    </td>
                    <td className="py-3 px-4 text-amber-300">
                      {e.lockedSeatsCount}
                    </td>
                    <td className="py-3 px-4 text-white font-bold">
                      {e.availableSeats}
                    </td>
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-[#2A1D26] overflow-hidden">
                          <div
                            className="h-full bg-[#FF3E41]"
                            style={{ width: `${bookedPct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-white/70">{bookedPct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
''')

# 4. AdminEventsPage.tsx
w('src/pages/admin/AdminEventsPage.tsx', '''import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { FestEvent, EventCategory } from '../../types';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  RotateCcw,
} from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const { events, addEvent, updateEvent, resetDatabaseState } = useFest();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FestEvent | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('PRO_SHOW');
  const [artist, setArtist] = useState('');
  const [date, setDate] = useState('MARCH 16, 2026');
  const [time, setTime] = useState('06:00 PM IST');
  const [venue, setVenue] = useState('Main Campus Amphitheatre');
  const [basePrice, setBasePrice] = useState(499);
  const [shortDesc, setShortDesc] = useState('');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      title,
      category,
      artistOrHost: artist || 'Special Guest Artists',
      date,
      time,
      venue,
      basePrice,
      tag: 'NEWLY ADDED PASS',
      shortDesc: shortDesc || 'Exclusive festival stage event added by administrator.',
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setArtist('');
    setShortDesc('');
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    updateEvent({
      ...editingEvent,
      title,
      basePrice,
      venue,
      date,
      time,
    });

    setEditingEvent(null);
  };

  const openEdit = (e: FestEvent) => {
    setEditingEvent(e);
    setTitle(e.title);
    setBasePrice(e.basePrice);
    setVenue(e.venue);
    setDate(e.date);
    setTime(e.time);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">
              INVENTORY MANAGEMENT
            </span>
            <span className="text-xs text-white/50 font-mono">Stage Schedules &amp; Tiers</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            FESTIVAL EVENTS &amp; CAPACITY
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Fest Event</span>
          </button>

          <button
            onClick={resetDatabaseState}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset DB to clean benchmark baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset DB</span>
          </button>
        </div>
      </div>

      {/* Events Inventory Table */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-x-auto space-y-4">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
              <th className="pb-3 pr-4">Event Details</th>
              <th className="pb-3 px-4">Category</th>
              <th className="pb-3 px-4">Base Price</th>
              <th className="pb-3 px-4">Capacity Breakdown</th>
              <th className="pb-3 px-4">Venue &amp; Schedule</th>
              <th className="pb-3 pl-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-white/5">
                <td className="py-4 pr-4">
                  <div className="font-bold text-white text-sm">{e.title}</div>
                  <div className="text-[11px] text-white/60">{e.artistOrHost}</div>
                </td>
                <td className="py-4 px-4 text-white/70">
                  {e.category.replace('_', ' ')}
                </td>
                <td className="py-4 px-4 font-bold text-[#FF7099]">
                  ₹{e.basePrice}
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-0.5 text-[11px]">
                    <div>Total: <strong className="text-white">{e.totalSeats}</strong></div>
                    <div className="text-[#10B981]">Booked: {e.bookedSeatsCount}</div>
                    <div className="text-amber-300">Locked: {e.lockedSeatsCount}</div>
                    <div className="text-white/60">Available: {e.availableSeats}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-white/60 text-[11px]">
                  <div>{e.date}</div>
                  <div>{e.time}</div>
                  <div className="truncate max-w-[160px] text-white/40">{e.venue}</div>
                </td>
                <td className="py-4 pl-4">
                  <button
                    onClick={() => openEdit(e)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Edit Event"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#4C3549] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white font-display">
              CREATE FESTIVAL STAGE EVENT
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-white/70 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DJ SNAKE ARENA LIVE"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  >
                    <option value="PRO_SHOW">PRO_SHOW</option>
                    <option value="EDM">EDM</option>
                    <option value="BATTLE_OF_BANDS">BATTLE_OF_BANDS</option>
                    <option value="DANCE">DANCE</option>
                    <option value="HACKATHON">HACKATHON</option>
                    <option value="COMEDY">COMEDY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Base Pass Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Headline Artist / Host</label>
                <input
                  type="text"
                  placeholder="e.g. DJ Snake"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Timing</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white font-bold cursor-pointer"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#4C3549] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white font-display">
              EDIT EVENT: {editingEvent.title}
            </h3>

            <form onSubmit={handleUpdateEvent} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-white/70 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
''')

# 5. AdminConcurrencyLabPage.tsx
w('src/pages/admin/AdminConcurrencyLabPage.tsx', '''import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { ConcurrencyStrategy } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Cpu,
  Play,
  Columns,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Code,
  Layers,
  Clock,
  RotateCcw,
  Zap,
} from 'lucide-react';

export const AdminConcurrencyLabPage: React.FC = () => {
  const {
    events,
    runConcurrencySimulation,
    runSideBySideSimulation,
    isSimulating,
    simulationProgress,
    lastSimResult,
    lastSideBySideResult,
    resetDatabaseState,
  } = useFest();

  const [strategy, setStrategy] = useState<ConcurrencyStrategy>('TWO_PHASE_LOCKING');
  const [concurrencyLevel, setConcurrencyLevel] = useState<number>(25);
  const [targetEventId, setTargetEventId] = useState<string>(events[0]?.id || 'evt-armaan');
  const [showSqlTrace, setShowSqlTrace] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'SINGLE' | 'SIDE_BY_SIDE'>('SINGLE');

  const selectedEvent = events.find((e) => e.id === targetEventId) || events[0];

  const handleRunSingle = async () => {
    setViewMode('SINGLE');
    await runConcurrencySimulation({
      strategy,
      concurrencyLevel,
      targetEventId,
    });
  };

  const handleRunSideBySide = async () => {
    setViewMode('SIDE_BY_SIDE');
    await runSideBySideSimulation({
      concurrencyLevel,
      targetEventId,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">
              DBMS TRANSACTION BENCHMARK
            </span>
            <span className="text-xs text-white/50 font-mono">Serializability &amp; Race Condition Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            CONCURRENCY CONTROL SIMULATOR
          </h1>
        </div>

        <button
          onClick={resetDatabaseState}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Inventory Baseline</span>
        </button>
      </div>

      {/* Control Panel Card */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* 1. Protocol Select */}
          <div className="space-y-2">
            <label className="block font-bold text-white/80 uppercase">
              1. Isolation Strategy
            </label>
            <select
              value={strategy}
              onChange={(e: any) => setStrategy(e.target.value)}
              disabled={isSimulating}
              className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-[#DF367C] disabled:opacity-50"
            >
              <option value="NO_LOCKING">No Locking (Dirty Read / Lost Update Overbook)</option>
              <option value="TWO_PHASE_LOCKING">Strict 2-Phase Locking (Serializable 2PL)</option>
              <option value="OPTIMISTIC_OCC">Optimistic Concurrency Control (OCC Versioning)</option>
            </select>
          </div>

          {/* 2. Concurrency Level */}
          <div className="space-y-2">
            <label className="block font-bold text-white/80 uppercase">
              2. Concurrency Volume
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 25, 50].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setConcurrencyLevel(lvl)}
                  disabled={isSimulating}
                  className={`py-3 rounded-xl font-bold transition-colors cursor-pointer ${
                    concurrencyLevel === lvl
                      ? 'bg-[#DF367C] text-white shadow-md'
                      : 'bg-[#2A1D26] text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  {lvl} Req
                </button>
              ))}
            </div>
          </div>

          {/* 3. Target Resource */}
          <div className="space-y-2">
            <label className="block font-bold text-white/80 uppercase">
              3. Target Seat Resource
            </label>
            <select
              value={targetEventId}
              onChange={(e) => setTargetEventId(e.target.value)}
              disabled={isSimulating}
              className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-[#DF367C] disabled:opacity-50"
            >
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} (1 unit test stock)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
          <button
            onClick={handleRunSingle}
            disabled={isSimulating}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#DF367C] hover:bg-[#c42867] text-white font-bold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Run Single Protocol ({strategy})</span>
          </button>

          <button
            onClick={handleRunSideBySide}
            disabled={isSimulating}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Columns className="w-4 h-4" />
            <span>Compare Side-by-Side (No-Lock vs Strict 2PL)</span>
          </button>
        </div>

        {/* Live Simulation Progress Indicator */}
        {isSimulating && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-white/70">
              <span>Executing Concurrent Transaction Threads...</span>
              <span>{simulationProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#2A1D26] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#DF367C] to-[#FF3E41] transition-all duration-75"
                style={{ width: `${simulationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* RESULTS DISPLAY SECTION */}

      {/* 1. SIDE-BY-SIDE COMPARATIVE VIEW */}
      {viewMode === 'SIDE_BY_SIDE' && lastSideBySideResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-display tracking-wide flex items-center gap-2">
              <Columns className="w-5 h-5 text-[#FF7099]" />
              <span>SIDE-BY-SIDE ISOLATION BENCHMARK RESULTS</span>
            </h2>
            <span className="text-xs font-mono text-white/50">
              {concurrencyLevel} Parallel Threads Tested Against Same Resource
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: No Locking */}
            <div className="bg-[#4C3549] border-2 border-red-500/50 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                  NO LOCKING (READ UNCOMMITTED)
                </span>
                {lastSideBySideResult.noLockResult.overbookingDetected && (
                  <span className="text-xs font-mono text-red-400 font-bold flex items-center gap-1">
                    <Flame className="w-4 h-4" /> OVERBOOKING ANOMALY!
                  </span>
                )}
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Committed</div>
                  <div className="text-xl font-black text-red-400">
                    {lastSideBySideResult.noLockResult.successfulCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Rejected</div>
                  <div className="text-xl font-black text-white/60">
                    {lastSideBySideResult.noLockResult.rejectedCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-red-500/40">
                  <div className="text-[10px] text-red-400 uppercase font-bold">Final Stock</div>
                  <div className="text-xl font-black text-red-400">
                    {lastSideBySideResult.noLockResult.finalStock}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-300 space-y-1">
                <strong>Lost Update Bug Manifested:</strong>
                <p className="text-[11px] text-white/70">
                  {lastSideBySideResult.noLockResult.successfulCount} clients simultaneous booked 1 physical seat! Final inventory became {lastSideBySideResult.noLockResult.finalStock} (Negative inventory bug).
                </p>
              </div>

              {/* Request Timeline Mini-Table */}
              <div className="max-h-60 overflow-y-auto font-mono text-[11px] space-y-1 pr-1">
                {lastSideBySideResult.noLockResult.transactions.slice(0, 10).map((tx) => (
                  <div
                    key={tx.txId}
                    className="p-2 rounded bg-[#2A1D26] border border-white/5 flex items-center justify-between"
                  >
                    <span>{tx.txId} ({tx.clientName})</span>
                    <span className={tx.status === 'COMMITTED' ? 'text-red-400 font-bold' : 'text-white/40'}>
                      {tx.status} ({tx.latencyMs}ms)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Strict 2PL */}
            <div className="bg-[#4C3549] border-2 border-[#10B981]/60 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                  STRICT TWO-PHASE LOCKING (2PL)
                </span>
                <span className="text-xs font-mono text-[#10B981] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> ACID SERIALIZABLE
                </span>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Committed</div>
                  <div className="text-xl font-black text-[#10B981]">
                    {lastSideBySideResult.twoPlResult.successfulCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Rejected (409)</div>
                  <div className="text-xl font-black text-white/60">
                    {lastSideBySideResult.twoPlResult.rejectedCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-[#10B981]/40">
                  <div className="text-[10px] text-[#10B981] uppercase font-bold">Final Stock</div>
                  <div className="text-xl font-black text-[#10B981]">
                    {lastSideBySideResult.twoPlResult.finalStock}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-mono text-[#10B981] space-y-1">
                <strong>Zero Overbooking Guarantee:</strong>
                <p className="text-[11px] text-white/70">
                  Exclusive X-Lock acquired on row. Exactly 1 transaction committed, remaining {lastSideBySideResult.twoPlResult.rejectedCount} safely rejected with 409 conflict.
                </p>
              </div>

              {/* Request Timeline Mini-Table */}
              <div className="max-h-60 overflow-y-auto font-mono text-[11px] space-y-1 pr-1">
                {lastSideBySideResult.twoPlResult.transactions.slice(0, 10).map((tx) => (
                  <div
                    key={tx.txId}
                    className="p-2 rounded bg-[#2A1D26] border border-white/5 flex items-center justify-between"
                  >
                    <span>{tx.txId} ({tx.clientName})</span>
                    <span className={tx.status === 'COMMITTED' ? 'text-[#10B981] font-bold' : 'text-white/40'}>
                      {tx.status} ({tx.latencyMs}ms)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SINGLE RUN DETAILED RESULT */}
      {viewMode === 'SINGLE' && lastSimResult && (
        <div className="space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-white/10 text-white/70">
                  BENCHMARK RUN: {lastSimResult.runId}
                </span>
                <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">
                  PROTOCOL: {lastSimResult.strategy.replace('_', ' ')}
                </h2>
              </div>

              {lastSimResult.overbookingDetected ? (
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  <span>OVERBOOKING ANOMALY ({lastSimResult.overbookedSeats} DUPLICATES)</span>
                </span>
              ) : (
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ACID SERIALIZABILITY PRESERVED</span>
                </span>
              )}
            </div>

            {/* Summary KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Requests</div>
                <div className="text-xl font-black text-white">{lastSimResult.concurrencyLevel}</div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-[#10B981] uppercase">Committed</div>
                <div className="text-xl font-black text-[#10B981]">{lastSimResult.successfulCount}</div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Rejected</div>
                <div className="text-xl font-black text-white/60">{lastSimResult.rejectedCount}</div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Final Stock</div>
                <div className={`text-xl font-black ${lastSimResult.finalStock < 0 ? 'text-red-400 font-bold' : 'text-white'}`}>
                  {lastSimResult.finalStock}
                </div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Duration</div>
                <div className="text-xl font-black text-[#FF7099]">{lastSimResult.durationMs}ms</div>
              </div>
            </div>

            {/* Transaction Execution Timeline Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                Thread Transaction Execution Log ({lastSimResult.transactions.length} Threads):
              </h3>

              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="sticky top-0 bg-[#4C3549] border-b border-white/10 text-white/40 text-[10px] uppercase">
                    <tr>
                      <th className="pb-2 pr-3">Tx ID</th>
                      <th className="pb-2 px-3">Client Worker</th>
                      <th className="pb-2 px-3">Status</th>
                      <th className="pb-2 px-3">Current Step</th>
                      <th className="pb-2 px-3">Message / Evaluation</th>
                      <th className="pb-2 pl-3">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    {lastSimResult.transactions.map((tx) => (
                      <tr key={tx.txId} className="hover:bg-white/5">
                        <td className="py-2.5 pr-3 font-bold text-[#FF7099]">{tx.txId}</td>
                        <td className="py-2.5 px-3 text-white">{tx.clientName}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.status === 'COMMITTED'
                                ? 'bg-[#10B981]/20 text-[#10B981]'
                                : tx.status === 'REJECTED'
                                ? 'bg-white/10 text-white/50'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-white/60">{tx.currentStep}</td>
                        <td className="py-2.5 px-3 text-white/70 truncate max-w-xs">{tx.message}</td>
                        <td className="py-2.5 pl-3 text-white/40">{tx.latencyMs}ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Literal SQL Statement Traces */}
            <div className="space-y-3 pt-4 border-t border-white/10 font-mono text-xs">
              <button
                onClick={() => setShowSqlTrace(!showSqlTrace)}
                className="flex items-center gap-2 text-[#FF7099] hover:underline font-bold cursor-pointer"
              >
                <Code className="w-4 h-4" />
                <span>{showSqlTrace ? 'Hide Literal SQL Traces' : 'Show Literal SQL Traces'}</span>
              </button>

              {showSqlTrace && (
                <div className="bg-[#2A1D26] p-4 rounded-2xl border border-white/10 space-y-2 text-[11px] text-[#FF7099] overflow-x-auto">
                  <div className="text-white/40 uppercase text-[10px]">Raw SQL Query Sequence:</div>
                  {lastSimResult.dbLogs.map((log, i) => (
                    <div key={i} className="text-white/80">{log}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
''')

# 6. AdminAuditLogsPage.tsx
w('src/pages/admin/AdminAuditLogsPage.tsx', '''import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Activity,
  Search,
  Trash2,
  Download,
  Filter,
} from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs, clearAuditLogs } = useFest();

  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterAction !== 'ALL' && log.action !== filterAction) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.eventTitle.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportCsv = () => {
    const csv = [
      'ID,Timestamp,Action,Event,Seat,User,RegNo,Status,Details,Protocol',
      ...auditLogs.map(
        (l) =>
          `"${l.id}","${new Date(l.timestamp).toISOString()}","${l.action}","${l.eventTitle}","${l.seatLabel}","${l.userName}","${l.regNumber}","${l.status}","${l.details.replace(/"/g, '""')}","${l.protocol || ''}"`
      ),
    ].join('\\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibrance_audit_logs_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">
              UNIFIED AUDIT TRAIL
            </span>
            <span className="text-xs text-white/50 font-mono">ACID &amp; Access Control Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            SYSTEM AUDIT &amp; TRANSACTION LOGS
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={exportCsv}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {auditLogs.length > 0 && (
            <button
              onClick={clearAuditLogs}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-colors border border-white/10 cursor-pointer"
              title="Clear Audit Logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto font-mono text-xs">
          <button
            onClick={() => setFilterAction('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterAction === 'ALL' ? 'bg-[#DF367C] text-white font-bold' : 'bg-[#4C3549] text-white/60 hover:text-white'
            }`}
          >
            All Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setFilterAction('BOOKING_COMMITTED')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterAction === 'BOOKING_COMMITTED' ? 'bg-[#DF367C] text-white font-bold' : 'bg-[#4C3549] text-white/60 hover:text-white'
            }`}
          >
            Commits
          </button>
          <button
            onClick={() => setFilterAction('LOCK_ACQUIRED')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterAction === 'LOCK_ACQUIRED' ? 'bg-[#DF367C] text-white font-bold' : 'bg-[#4C3549] text-white/60 hover:text-white'
            }`}
          >
            Locks Acquired
          </button>
          <button
            onClick={() => setFilterAction('LOCK_REJECTED')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterAction === 'LOCK_REJECTED' ? 'bg-[#DF367C] text-white font-bold' : 'bg-[#4C3549] text-white/60 hover:text-white'
            }`}
          >
            Lock Conflicts
          </button>
          <button
            onClick={() => setFilterAction('TICKET_VERIFIED')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterAction === 'TICKET_VERIFIED' ? 'bg-[#DF367C] text-white font-bold' : 'bg-[#4C3549] text-white/60 hover:text-white'
            }`}
          >
            Gate Check-ins
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search details, user, event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#4C3549] border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white font-mono placeholder-white/40 focus:border-[#DF367C] focus:outline-none"
          />
        </div>
      </div>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          title="No Audit Logs Found"
          description="No log entries match your filter criteria."
          actionText="Reset Filters"
          onAction={() => {
            setFilterAction('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                <th className="pb-3 pr-4">Timestamp</th>
                <th className="pb-3 px-4">Action Type</th>
                <th className="pb-3 px-4">Event Resource</th>
                <th className="pb-3 px-4">Seat</th>
                <th className="pb-3 px-4">Initiator / User</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 pl-4">Transaction Details &amp; Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="py-3 pr-4 text-white/50 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#883955] text-white">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white font-bold truncate max-w-[150px]">
                    {log.eventTitle}
                  </td>
                  <td className="py-3 px-4 text-[#FF7099]">
                    {log.seatLabel}
                  </td>
                  <td className="py-3 px-4 text-white/70">
                    <div>{log.userName}</div>
                    <div className="text-[10px] text-white/40">{log.regNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={log.status as any} size="sm" />
                  </td>
                  <td className="py-3 pl-4 text-white/70 text-[11px] max-w-sm">
                    <div>{log.details}</div>
                    {log.protocol && (
                      <div className="text-[10px] text-[#FF7099] mt-0.5">{log.protocol}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
''')

print('All Staff and Admin pages generated successfully.')
