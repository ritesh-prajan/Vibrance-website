import React, { useState } from 'react';
import { useFest } from '../context/FestContext';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Filter,
  CheckCircle2,
  XCircle,
  Database,
  Users,
  Ticket,
  Search,
} from 'lucide-react';

export const AdminAuditDashboard: React.FC = () => {
  const { events, auditLogs, clearAuditLogs, resetDatabaseState, myBookings, currentUser } = useFest();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'CONFLICT' | 'ANOMALY_OVERBOOK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Overall festival stats
  const totalCapacity = events.reduce((acc, e) => acc + e.totalSeats, 0);
  const totalBooked = events.reduce((acc, e) => acc + e.bookedSeatsCount, 0);
  const totalLocked = events.reduce((acc, e) => acc + e.lockedSeatsCount, 0);
  const totalAvailable = events.reduce((acc, e) => acc + e.availableSeats, 0);

  const confirmedLogs = auditLogs.filter((l) => l.status === 'SUCCESS').length;
  const conflictLogs = auditLogs.filter((l) => l.status === 'CONFLICT').length;
  const overbookAnomalies = auditLogs.filter((l) => l.status === 'ANOMALY_OVERBOOK').length;

  const filteredLogs = auditLogs.filter((log) => {
    if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.eventTitle.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.regNumber.toLowerCase().includes(q) ||
        log.seatLabel.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#0e121a] border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/30">
              AUDIT CONTROLLER
            </span>
            <span className="text-xs text-white/50 font-mono">ADMIN: {currentUser?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            DBMS Telemetry & Inventory Audit Hub
          </h1>
          <p className="text-xs text-white/60">
            Real-time transaction tracking, exclusive lock state audit, and anomaly detection across all fest venues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDatabaseState}
            className="px-4 py-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Database Baseline
          </button>
        </div>
      </div>

      {/* Aggregate DBMS Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e121a] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-white/40 text-xs font-mono mb-2">
            <span>TOTAL PASS INVENTORY</span>
            <Ticket className="w-4 h-4 text-[#ccff00]" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{totalCapacity}</p>
          <p className="text-[10px] text-white/50 font-mono mt-1">
            Across 6 major campus venues
          </p>
        </div>

        <div className="bg-[#0e121a] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-white/40 text-xs font-mono mb-2">
            <span>CONFIRMED COMMITS</span>
            <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
          </div>
          <p className="text-2xl font-black text-[#ccff00] font-mono">{totalBooked}</p>
          <p className="text-[10px] text-white/50 font-mono mt-1">
            {Math.round((totalBooked / totalCapacity) * 100)}% festival occupancy
          </p>
        </div>

        <div className="bg-[#0e121a] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-white/40 text-xs font-mono mb-2">
            <span>ACTIVE 2PL LEASE LOCKS</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">{totalLocked}</p>
          <p className="text-[10px] text-white/50 font-mono mt-1">
            Held by concurrent student sessions
          </p>
        </div>

        <div className="bg-[#0e121a] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-white/40 text-xs font-mono mb-2">
            <span>AVAILABLE SEAT POOL</span>
            <Database className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <p className="text-2xl font-black text-[#00e5ff] font-mono">{totalAvailable}</p>
          <p className="text-[10px] text-white/50 font-mono mt-1">
            Uncontested rows in seat table
          </p>
        </div>
      </div>

      {/* Per-Event Seat Inventory Allocation Breakdown */}
      <div className="bg-[#0e121a] border border-white/15 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-[#ccff00]" /> Real-time Venue Allocation & Capacity Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((evt) => {
            const occupancy = Math.round(((evt.totalSeats - evt.availableSeats) / evt.totalSeats) * 100);

            return (
              <div key={evt.id} className="bg-[#080a0f] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${evt.accentColor}18`,
                      color: evt.accentColor,
                    }}
                  >
                    {evt.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{occupancy}% Full</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white truncate">{evt.title}</h4>
                  <p className="text-[11px] text-white/50 truncate mt-0.5">{evt.venue}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden flex">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(evt.bookedSeatsCount / evt.totalSeats) * 100}%` }}
                  />
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${(evt.lockedSeatsCount / evt.totalSeats) * 100}%` }}
                  />
                  <div
                    className="h-full bg-[#ccff00]"
                    style={{ width: `${(evt.availableSeats / evt.totalSeats) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center pt-1 border-t border-white/5">
                  <div>
                    <span className="text-white/40 block">Available</span>
                    <span className="font-bold text-[#ccff00]">{evt.availableSeats}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Held</span>
                    <span className="font-bold text-amber-400">{evt.lockedSeatsCount}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Booked</span>
                    <span className="font-bold text-red-400">{evt.bookedSeatsCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction & Lock Audit Log Table */}
      <div className="bg-[#0e121a] border border-white/15 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00e5ff]" /> Live Transaction & Lock Audit Log
            </h3>
            <p className="text-xs text-white/50 font-mono">
              Audit trail of every seat selection, hold lease, commit, conflict rejection, and rollback
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#080a0f] border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:border-[#00e5ff] focus:outline-none font-mono w-48"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 bg-[#080a0f] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
                  statusFilter === 'ALL' ? 'bg-[#00e5ff] text-black font-bold' : 'text-white/60'
                }`}
              >
                All ({auditLogs.length})
              </button>
              <button
                onClick={() => setStatusFilter('SUCCESS')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
                  statusFilter === 'SUCCESS' ? 'bg-[#ccff00] text-black font-bold' : 'text-white/60'
                }`}
              >
                Success
              </button>
              <button
                onClick={() => setStatusFilter('CONFLICT')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
                  statusFilter === 'CONFLICT' ? 'bg-amber-400 text-black font-bold' : 'text-white/60'
                }`}
              >
                Conflicts
              </button>
              <button
                onClick={() => setStatusFilter('ANOMALY_OVERBOOK')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
                  statusFilter === 'ANOMALY_OVERBOOK' ? 'bg-red-400 text-black font-bold' : 'text-white/60'
                }`}
              >
                Anomalies
              </button>
            </div>

            <button
              onClick={clearAuditLogs}
              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors"
              title="Clear audit log"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#080a0f] text-white/50 sticky top-0 border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Event / Seat</th>
                <th className="py-2.5 px-3">Student / Thread</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Protocol / ACID Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/40">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 text-white/40 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">{log.action}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-white/80">{log.eventTitle}</span>
                      <span className="text-[#ccff00] font-bold ml-1.5">[{log.seatLabel}]</span>
                    </td>
                    <td className="py-2.5 px-3 text-white/70">
                      {log.userName} <span className="text-[10px] text-white/40">({log.regNumber})</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SUCCESS'
                            ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30'
                            : log.status === 'ANOMALY_OVERBOOK'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                            : log.status === 'CONFLICT'
                            ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-white/60 truncate max-w-sm" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
