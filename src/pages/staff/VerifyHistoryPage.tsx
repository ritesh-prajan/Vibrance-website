import React, { useState } from 'react';
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
