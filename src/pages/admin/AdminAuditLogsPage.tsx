import React, { useState } from 'react';
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
    ].join('\n');

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
