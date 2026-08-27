import React from 'react';
import { Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';
import { LayoutDashboard, Calendar, Ticket, Cpu, Activity, DollarSign, ShieldCheck, Flame, ArrowRight, Database, TrendingUp } from 'lucide-react';

const KpiCard: React.FC<{ label: string; value: number; suffix?: string; color: string; icon: React.ReactNode; sub: string; index: number }> = ({ label, value, suffix = '', color, icon, sub, index }) => {
  const counted = useCountUp(value, 900);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="bg-[#4C3549] border border-white/15 rounded-2xl p-5 space-y-2 shadow-lg"
    >
      <div className="flex items-center justify-between text-white/40 text-[10px] uppercase font-mono">
        <span>{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-2xl font-black font-mono" style={{ color: color === 'white' ? 'white' : color }}>
        {suffix === '₹' ? `₹${counted.toLocaleString()}` : `${counted}${suffix}`}
      </div>
      <div className="text-[11px] text-white/50 font-mono">{sub}</div>
    </motion.div>
  );
};

export const AdminDashboardPage: React.FC = () => {
  const { events, allBookings, auditLogs, scanHistory } = useFest();

  const confirmedBookings = allBookings.filter((b) => b.status === 'confirmed' || b.status === 'checked_in');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.amount, 0);
  const checkedInCount = allBookings.filter((b) => b.status === 'checked_in').length;
  const checkInRate = confirmedBookings.length > 0 ? Math.round((checkedInCount / confirmedBookings.length) * 100) : 0;
  const contentionConflicts = auditLogs.filter((l) => l.action === 'LOCK_REJECTED' || l.action === 'RACE_OVERBOOK').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">FACULTY CONTROLLER</span>
            <span className="text-xs text-white/50 font-mono">DBMS Lab &amp; Festival Executive Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">EXECUTIVE AUDIT &amp; TELEMETRY</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/concurrency-lab" className="px-4 py-2.5 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /><span>Launch Concurrency Simulator</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard index={0} label="Total Events" value={events.length} color="#FF7099" icon={<Calendar className="w-4 h-4" />} sub="Active Festival Stages" />
        <KpiCard index={1} label="Passes Issued" value={confirmedBookings.length} color="#FF3E41" icon={<Ticket className="w-4 h-4" />} sub="Confirmed / Serialized" />
        <KpiCard index={2} label="Total Revenue" value={totalRevenue} suffix="₹" color="#10B981" icon={<TrendingUp className="w-4 h-4" />} sub="Gross Ticketing Volume" />
        <KpiCard index={3} label="Contention Conflicts" value={contentionConflicts} color="#f59e0b" icon={<Flame className="w-4 h-4" />} sub="409 Conflicts Handled" />
        <KpiCard index={4} label="Check-in Rate" value={checkInRate} suffix="%" color="#FF7099" icon={<ShieldCheck className="w-4 h-4" />} sub={`${checkedInCount} of ${confirmedBookings.length} Admitted`} />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { to: '/admin/concurrency-lab', icon: <Cpu className="w-5 h-5" />, iconBg: '#DF367C', title: 'CONCURRENCY SIMULATOR', desc: 'Benchmark database isolation strategies (No Locking vs Strict 2PL vs OCC) with live side-by-side transaction execution.' },
          { to: '/admin/events', icon: <Calendar className="w-5 h-5" />, iconBg: '#883955', title: 'EVENT & STAGE INVENTORY', desc: 'Create new stages, edit pricing tiers, adjust total capacity, and delete events with live ACID logging.' },
          { to: '/admin/users', icon: <ShieldCheck className="w-5 h-5" />, iconBg: '#10B981', title: 'STAFF & USER PROVISIONING', desc: 'Provision gate security personnel, assign scanner badge IDs, manage student profiles, and test login.' },
          { to: '/admin/audit-logs', icon: <Activity className="w-5 h-5" />, iconBg: '#FF3E41', title: 'SYSTEM AUDIT & LOGS', desc: 'Inspect all ACID commits, lock grants, timeout expirations, overbooking anomalies, and gate verification logs.' },
        ].map(({ to, icon, iconBg, title, desc }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 + i * 0.07 }}
          >
            <Link to={to} className="block bg-gradient-to-br from-[#4C3549] to-[#883955] border border-white/15 rounded-3xl p-6 hover:border-white/30 transition-all shadow-xl space-y-3 group">
              <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold shadow-md" style={{ backgroundColor: iconBg }}>{icon}</div>
              <h3 className="text-xl font-bold text-white font-display flex items-center justify-between">
                <span>{title}</span>
                <ArrowRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">{desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Per-Event Sales Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.55 }}
        className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
      >
        <h2 className="text-lg font-bold text-white font-display tracking-wide">EVENT INVENTORY &amp; SALES BREAKDOWN</h2>
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
                    <td className="py-3 pr-4 font-bold text-white">{e.title}</td>
                    <td className="py-3 px-4 text-white/60">{e.category.replace('_', ' ')}</td>
                    <td className="py-3 px-4 text-[#FF7099]">&#8377;{e.basePrice}</td>
                    <td className="py-3 px-4 text-white/60">{e.totalSeats} seats</td>
                    <td className="py-3 px-4 text-[#10B981] font-bold">{e.bookedSeatsCount}</td>
                    <td className="py-3 px-4 text-amber-300">{e.lockedSeatsCount}</td>
                    <td className="py-3 px-4 text-white font-bold">{e.availableSeats}</td>
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-[#2A1D26] overflow-hidden">
                          <div className="h-full bg-[#FF3E41]" style={{ width: `${bookedPct}%` }} />
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
      </motion.div>
    </div>
  );
};
