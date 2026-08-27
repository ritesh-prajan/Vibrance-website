import os
def w(p, c):
    full = os.path.abspath(p)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(c.strip() + '\n')
    print(f'Wrote {p}')

# ─── AppLayout.tsx ─── page transition wrapper + navbar press states
w('src/components/layout/AppLayout.tsx', """import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  Calendar, Ticket, User, ShieldCheck, History,
  LayoutDashboard, Cpu, Activity, LogOut, Menu, X, ArrowRight,
} from 'lucide-react';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser, logout, activeSeat, seatLockTimeRemaining,
    releaseActiveSeat, loginAsStudent, loginAsGateStaff, loginAsAdmin,
  } = useFest();

  const navigate = useNavigate();
  const location = useLocation();
  const reduced = usePrefersReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const pageVariants = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 8 },
    animate: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit:    reduced ? { opacity: 0 } : { opacity: 0, y: -6 },
  };

  return (
    <div className="min-h-screen bg-[#2A1D26] text-[#F3EDF2] flex flex-col font-sans selection:bg-[#FF3E41] selection:text-white">
      {/* Seat Hold Banner */}
      {activeSeat && seatLockTimeRemaining > 0 && currentUser?.role === 'student' && (
        <div className="sticky top-0 z-50 bg-[#4C3549] border-b border-[#FF3E41] text-white px-4 py-2 text-xs font-mono flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <motion.span
              className="w-2 h-2 rounded-full bg-[#FF3E41] inline-block"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <span className="font-bold text-[#FF7099]">ACTIVE SEAT HOLD:</span>
            <span>Seat [{activeSeat.row}-{activeSeat.number}]</span>
            <span className="hidden sm:inline text-white/60">({activeSeat.eventTitle})</span>
            <motion.span
              className="font-mono px-2 py-0.5 rounded text-[11px] font-bold"
              animate={{
                backgroundColor: seatLockTimeRemaining <= 10
                  ? ['#FF3E41', '#FF0000', '#FF3E41']
                  : seatLockTimeRemaining <= 30
                  ? ['#FF3E41', '#f59e0b', '#FF3E41']
                  : ['#FF3E41'],
              }}
              transition={{
                duration: seatLockTimeRemaining <= 10 ? 0.6 : 1.5,
                repeat: Infinity,
              }}
              style={{ color: 'white' }}
            >
              {formatTimer(seatLockTimeRemaining)}
            </motion.span>
          </div>
          <div className="flex items-center gap-2">
            {location.pathname !== `/checkout/${activeSeat.eventId}` && (
              <NavLink
                to={`/checkout/${activeSeat.eventId}`}
                className="px-3 py-1 rounded bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold transition-all shadow-md flex items-center gap-1"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            )}
            <button onClick={releaseActiveSeat} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer">
              Release
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="bg-[#4C3549] border-b border-white/15 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <NavLink to="/" className="flex items-center gap-2.5 focus:outline-none">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF3E41] to-[#DF367C] text-white font-display font-black text-xl flex items-center justify-center shadow-lg">V</div>
                <div>
                  <span className="font-display font-black tracking-wider text-xl text-white block leading-none">VIBRANCE</span>
                  <span className="text-[10px] font-mono text-[#FF7099] tracking-widest uppercase block mt-0.5">FEST 2026</span>
                </div>
              </NavLink>
              {currentUser && (
                <div className="hidden sm:inline-flex items-center ml-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    currentUser.role === 'admin' ? 'bg-[#883955] text-white border border-[#FF7099]/40'
                    : currentUser.role === 'gate_staff' ? 'bg-[#DF367C]/30 text-[#FF7099] border border-[#DF367C]/50'
                    : 'bg-[#FF3E41]/20 text-[#FF3E41] border border-[#FF3E41]/40'
                  }`}>{currentUser.role.replace('_', ' ')}</span>
                </div>
              )}
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
              {currentUser?.role === 'student' && (
                <>
                  <NavLink to="/events" className={({ isActive }) => `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${isActive ? 'bg-[#FF3E41] text-white font-bold shadow-md' : 'text-white/70 hover:text-white hover:bg-white/5'}`}><Calendar className="w-3.5 h-3.5" /><span>Events Catalog</span></NavLink>
                  <NavLink to="/my-bookings" className={({ isActive }) => `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${isActive ? 'bg-[#FF3E41] text-white font-bold shadow-md' : 'text-white/70 hover:text-white hover:bg-white/5'}`}><Ticket className="w-3.5 h-3.5" /><span>My Bookings</span></NavLink>
                  <NavLink to="/profile" className={({ isActive }) => `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${isActive ? 'bg-[#FF3E41] text-white font-bold shadow-md' : 'text-white/70 hover:text-white hover:bg-white/5'}`}><User className="w-3.5 h-3.5" /><span>My Profile</span></NavLink>
                </>
              )}
              {currentUser?.role === 'gate_staff' && (
                <>
                  <NavLink to="/verify" className={({ isActive }) => `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${isActive ? 'bg-[#DF367C] text-white font-bold shadow-md' : 'text-white/70 hover:text-white hover:bg-white/5'}`}><ShieldCheck className="w-3.5 h-3.5" /><span>Verify Scanner</span></NavLink>
                  <NavLink to="/verify/history" className={({ isActive }) => `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${isActive ? 'bg-[#DF367C] text-white font-bold shadow-md' : 'text-white/70 hover:text-white hover:bg-white/5'}`}><History className="w-3.5 h-3.5" /><span>Check-in Log</span></NavLink>
                </>
              )}
              {currentUser?.role === 'admin' && (
                <>
                  <NavLink to="/admin" end className={({ isActive }) => `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${isActive ? 'bg-[#883955] text-white font-bold shadow-md border border-white/20' : 'text-white/70 hover:text-white hover:bg-white/5'}`}><LayoutDashboard className="w-3.5 h-3.5" /><span>Dashboard</span></NavLink>
                  <NavLink to="/admin/concurrency-lab" className={({ isActive }) => `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${isActive ? 'bg-[#DF367C] text-white font-bold shadow-md' : 'text-white/70 hover:text-white hover:bg-white/5'}`}><Cpu className="w-3.5 h-3.5" /><span>Concurrency Lab</span></NavLink>
                  <NavLink to="/admin/events" className={({ isActive }) => `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${isActive ? 'bg-[#883955] text-white font-bold shadow-md border border-white/20' : 'text-white/70 hover:text-white hover:bg-white/5'}`}><Calendar className="w-3.5 h-3.5" /><span>Inventory</span></NavLink>
                  <NavLink to="/admin/audit-logs" className={({ isActive }) => `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${isActive ? 'bg-[#883955] text-white font-bold shadow-md border border-white/20' : 'text-white/70 hover:text-white hover:bg-white/5'}`}><Activity className="w-3.5 h-3.5" /><span>Audit Trail</span></NavLink>
                </>
              )}
            </nav>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#2A1D26] hover:bg-[#883955] border border-white/10 transition-colors text-xs font-mono text-left cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#FF3E41] text-white font-bold flex items-center justify-center text-[10px]">{currentUser.name.charAt(0)}</div>
                    <div className="hidden sm:block">
                      <div className="font-bold text-white leading-tight">{currentUser.name}</div>
                      <div className="text-[10px] text-[#FF7099]">{currentUser.regNumber}</div>
                    </div>
                  </motion.button>
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#4C3549] border border-white/20 shadow-2xl p-3 z-50 space-y-2 font-mono text-xs"
                      >
                        <div className="px-2 py-1.5 border-b border-white/10">
                          <div className="font-bold text-white">{currentUser.name}</div>
                          <div className="text-[11px] text-[#FF7099]">{currentUser.email}</div>
                          <div className="text-[10px] text-white/50">{currentUser.department}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase text-white/40 px-2">Quick Switch Role:</span>
                          <button onClick={() => { loginAsStudent('Rahul Sharma', 'RA2111003010142', 'Computer Science & Engineering', '3rd Year'); setUserDropdownOpen(false); navigate('/events'); }} className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/10 text-white flex items-center justify-between cursor-pointer">
                            <span>Student (Rahul)</span><span className="text-[10px] text-[#FF3E41]">Student</span>
                          </button>
                          <button onClick={() => { loginAsGateStaff('Officer Rajesh Menon', 'STF-GATE-04', 'Gate A'); setUserDropdownOpen(false); navigate('/verify'); }} className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/10 text-white flex items-center justify-between cursor-pointer">
                            <span>Staff (Rajesh)</span><span className="text-[10px] text-[#DF367C]">Gate Staff</span>
                          </button>
                          <button onClick={() => { loginAsAdmin('Dr. Ramesh Sundaram', 'FAC-DBMS-702', 'Computer Science & Engineering'); setUserDropdownOpen(false); navigate('/admin'); }} className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/10 text-white flex items-center justify-between cursor-pointer">
                            <span>Admin (Prof. Ramesh)</span><span className="text-[10px] text-[#FF7099]">Admin</span>
                          </button>
                        </div>
                        <div className="pt-2 border-t border-white/10">
                          <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogout} className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-red-500/20 text-red-300 flex items-center gap-2 cursor-pointer font-bold">
                            <LogOut className="w-3.5 h-3.5" /><span>Sign Out</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink to="/login" className="px-4 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md">Sign In</NavLink>
              )}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-[#2A1D26] text-white hover:bg-white/10 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden md:hidden bg-[#2A1D26] border-b border-white/15 px-4 py-4 space-y-2 font-mono text-xs"
            >
              {currentUser?.role === 'student' && (
                <>
                  <NavLink to="/events" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold">Events Catalog</NavLink>
                  <NavLink to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold">My Bookings</NavLink>
                  <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold">Student Profile</NavLink>
                </>
              )}
              {currentUser?.role === 'gate_staff' && (
                <>
                  <NavLink to="/verify" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold">Verify Scanner</NavLink>
                  <NavLink to="/verify/history" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold">Check-in Log</NavLink>
                </>
              )}
              {currentUser?.role === 'admin' && (
                <>
                  <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold">Admin Dashboard</NavLink>
                  <NavLink to="/admin/concurrency-lab" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold">Concurrency Lab Simulator</NavLink>
                  <NavLink to="/admin/events" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold">Inventory Management</NavLink>
                  <NavLink to="/admin/audit-logs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold">System Audit Logs</NavLink>
                </>
              )}
              <div className="pt-2 border-t border-white/10">
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="w-full text-left px-3 py-2 rounded-xl text-red-400 font-bold cursor-pointer">Sign Out</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* PAGE CONTENT with AnimatePresence transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#4C3549] border-t border-white/15 py-6 text-center text-xs font-mono text-white/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Vibrance 2026 DBMS Concurrency Engine Active</span>
          </div>
          <div>Strict 2-Phase Locking (2PL) &bull; Serializability Benchmark Edition</div>
        </div>
      </footer>
    </div>
  );
};
""")

# ─── EventCard.tsx ─── lift+glow hover, seats-remaining pulse
w('src/components/EventCard.tsx', """import React from 'react';
import { motion } from 'framer-motion';
import { FestEvent } from '../types';
import { Calendar, MapPin, Ticket, Flame, Clock, Users, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: FestEvent;
  onSelectSeats: (event: FestEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelectSeats }) => {
  const isUrgent = event.availableSeats <= 6;
  const isSoldOut = event.availableSeats === 0;
  const occupancyPercent = Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 20px 60px ${event.accentColor ?? '#FF3E41'}22` }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative group bg-[#0e121a] hover:bg-[#131822] border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
    >
      {/* Top Section */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
            style={{ backgroundColor: `${event.accentColor}18`, color: event.accentColor, border: `1px solid ${event.accentColor}40` }}
          >
            {event.category.replace(/_/g, ' ')}
          </span>
          {isUrgent && !isSoldOut && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/40 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
            >
              <Flame className="w-3 h-3 text-red-400" />
              <span>{event.availableSeats} SEATS LEFT</span>
            </motion.div>
          )}
          {isSoldOut && (
            <span className="bg-white/10 text-white/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">SOLD OUT</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-[#ccff00] transition-colors">{event.title}</h3>
        <p className="text-xs text-white/70 mt-1 font-medium flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-white/40" />{event.artistOrHost}
        </p>
        <p className="text-xs text-white/50 mt-2.5 line-clamp-2 leading-relaxed">{event.shortDesc}</p>
      </div>

      {/* Divider */}
      <div className="relative py-2">
        <div className="ticket-notch-left ticket-notch-right">
          <div className="border-t border-dashed border-white/15 w-full mx-auto" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-5 pt-2 space-y-3.5">
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-white/70 bg-white/5 p-2 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-[#ccff00]" /><span className="truncate">{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/70 bg-white/5 p-2 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-[#00e5ff]" /><span className="truncate">{event.time}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/60">
          <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" /><span className="truncate">{event.venue}</span>
        </div>

        {/* Seat Capacity Meter */}
        <div className="bg-[#080a0f] p-3 rounded-xl border border-white/10">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-white/60 font-mono text-[11px]">LIVE CAPACITY</span>
            <span className="font-mono font-bold text-white text-xs">
              <motion.span
                className={isUrgent ? 'text-red-400' : 'text-[#ccff00]'}
                animate={isUrgent && !isSoldOut ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block' }}
              >
                {event.availableSeats}
              </motion.span>{' '}/ {event.totalSeats} Available
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden flex">
            <div className="h-full bg-red-500/70" style={{ width: `${(event.bookedSeatsCount / event.totalSeats) * 100}%` }} />
            <motion.div
              className="h-full bg-amber-400/90"
              style={{ width: `${(event.lockedSeatsCount / event.totalSeats) * 100}%` }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <div className="h-full bg-[#ccff00]" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-white/40 mt-1">
            <span>{occupancyPercent}% Booked</span>
            {event.lockedSeatsCount > 0 && <span className="text-amber-300 font-semibold">{event.lockedSeatsCount} currently held</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-[10px] text-white/40 font-mono uppercase">Ticket Pass From</p>
            <p className="text-lg font-bold text-white font-mono">&#8377;{event.basePrice}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectSeats(event)}
            disabled={isSoldOut}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
              isSoldOut ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[0_0_15px_rgba(204,255,0,0.25)]'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isSoldOut ? 'Sold Out' : 'Select Seat'}</span>
            {!isSoldOut && <ArrowRight className="w-3 h-3 ml-0.5" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
""")

# ─── SkeletonLoader.tsx ─── shimmer sweep animation
w('src/components/common/SkeletonLoader.tsx', """import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'card' | 'table' | 'seatmap';
  count?: number;
}

const shimmer = {
  animate: {
    backgroundPosition: ['200% center', '-200% center'],
  },
  transition: {
    duration: 1.6,
    repeat: Infinity,
    ease: 'linear',
  },
};

const ShimmerDiv: React.FC<{ className: string }> = ({ className }) => (
  <motion.div
    className={className}
    animate={shimmer.animate}
    transition={shimmer.transition}
    style={{
      background: 'linear-gradient(90deg, #4C3549 25%, #5e3d5a 50%, #4C3549 75%)',
      backgroundSize: '400% 100%',
    }}
  />
);

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'card', count = 3 }) => {
  const items = Array.from({ length: count });

  if (variant === 'table') {
    return (
      <div className="space-y-3">
        <ShimmerDiv className="h-10 rounded-xl border border-white/10" />
        {items.map((_, i) => <ShimmerDiv key={i} className="h-14 rounded-xl border border-white/5" />)}
      </div>
    );
  }

  if (variant === 'seatmap') {
    return (
      <div className="p-6 bg-[#4C3549] rounded-3xl border border-white/15 space-y-4">
        <ShimmerDiv className="h-10 rounded-xl" />
        <div className="grid grid-cols-8 gap-2 py-4">
          {Array.from({ length: 48 }).map((_, i) => <ShimmerDiv key={i} className="h-10 rounded-lg border border-white/10" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, i) => (
        <div key={i} className="bg-[#4C3549] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
          <ShimmerDiv className="h-4 rounded w-1/3" />
          <ShimmerDiv className="h-6 rounded w-3/4" />
          <ShimmerDiv className="h-3 rounded w-1/2" />
          <ShimmerDiv className="h-16 rounded-xl" />
          <ShimmerDiv className="h-9 rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
};
""")

print('AppLayout, EventCard, SkeletonLoader written.')

