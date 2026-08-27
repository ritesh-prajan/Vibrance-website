import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  Activity,
  Search,
  Download,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
} from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs, clearAuditLogs } = useFest();
  const reduced = usePrefersReducedMotion();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const actionTypes = [
    { label: 'All Action Logs', value: 'ALL' },
    { label: 'Lock Granted', value: 'LOCK_GRANTED' },
    { label: 'Lock Released', value: 'LOCK_RELEASED' },
    { label: 'Lock Rejected (409)', value: 'LOCK_REJECTED' },
    { label: 'Booking Confirmed', value: 'BOOKING_CONFIRMED' },
    { label: 'Scan Verified', value: 'SCAN_VERIFIED' },
    { label: 'Scan Rejected', value: 'SCAN_REJECTED' },
    { label: 'Overbooking Anomaly', value: 'RACE_OVERBOOK' },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedAction !== 'ALL' && log.action !== selectedAction) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.resourceId.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,Action,Resource,User,Details\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.action}","${l.resourceId}","${l.user}","${l.details.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibrance26-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'BOOKING_CONFIRMED':
      case 'SCAN_VERIFIED':
      case 'LOCK_GRANTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
            {action}
          </span>
        );
      case 'LOCK_REJECTED':
      case 'SCAN_REJECTED':
      case 'LOCK_TIMEOUT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {action}
          </span>
        );
      case 'RACE_OVERBOOK':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1">
            <Flame className="w-3 h-3" /> {action}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/70">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF3E41]/25 text-[#FF3E41] border border-[#FF3E41]/50">
              AUDIT &amp; COMPLIANCE
            </span>
            <span className="text-xs text-white/50 font-mono">Immutable ACID System Event Stream</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            SYSTEM AUDIT &amp; TRANSACTION LOGS
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-[#4C3549] hover:bg-[#883955] text-white border border-white/15 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={clearAuditLogs}
            className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-white/70 transition-colors flex items-center gap-1 cursor-pointer"
            title="Clear Log History"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action, resource ID, user, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2A1D26] border border-white/15 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-white/40 shrink-0" />
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="bg-[#2A1D26] border border-white/15 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#FF3E41] w-full md:w-auto"
            >
              {actionTypes.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table with Animated Rows */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-display tracking-wide flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FF7099]" />
            <span>TRANSACTION AUDIT FEED</span>
          </h2>
          <span className="text-xs font-mono text-white/50">
            {filteredLogs.length} Records Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                <th className="pb-3 pr-3">Timestamp</th>
                <th className="pb-3 px-3">Action Type</th>
                <th className="pb-3 px-3">Target Resource</th>
                <th className="pb-3 px-3">User / Actor</th>
                <th className="pb-3 pl-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              <AnimatePresence initial={false}>
                {filteredLogs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, x: -10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                    transition={{ duration: 0.25 }}
                    className="hover:bg-white/5"
                  >
                    <td className="py-3 pr-3 text-white/50 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-3">{getActionBadge(log.action)}</td>
                    <td className="py-3 px-3 font-bold text-[#FF7099] whitespace-nowrap">
                      {log.resourceId}
                    </td>
                    <td className="py-3 px-3 text-white whitespace-nowrap">{log.user}</td>
                    <td className="py-3 pl-3 text-white/70">{log.details}</td>
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
