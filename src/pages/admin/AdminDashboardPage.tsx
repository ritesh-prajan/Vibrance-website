import React from 'react';
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
