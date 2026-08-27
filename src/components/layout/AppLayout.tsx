import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  Calendar, Ticket, User, ShieldCheck, History,
  LayoutDashboard, Cpu, Activity, LogOut, Menu, X, ArrowRight, Sparkles,
} from 'lucide-react';
import { LiveScheduleDrawer } from '../common/LiveScheduleDrawer';
import { DiscoLightsBackground } from '../common/DiscoLightsBackground';

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
    <div className="min-h-screen bg-[#2A1D26] text-[#F3EDF2] flex flex-col font-sans selection:bg-[#FF3E41] selection:text-white relative">
      {/* ─── Global Left Vertical Sliding Drawer ─── */}
      <LiveScheduleDrawer />

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

      {/* Navbar with Disco Accent */}
      <header className="bg-[#4C3549]/95 backdrop-blur-xl border-b border-white/15 sticky top-0 z-40 shadow-xl overflow-hidden">
        <DiscoLightsBackground intensity="subtle" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
              {currentUser?.role === 'student' && (
                <>
                  <NavLink
                    to="/events"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl transition-all font-semibold ${
                        isActive ? 'bg-[#FF3E41] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Events Lineup
                  </NavLink>
                  <NavLink
                    to="/my-bookings"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl transition-all font-semibold ${
                        isActive ? 'bg-[#FF3E41] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    My Bookings
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl transition-all font-semibold ${
                        isActive ? 'bg-[#FF3E41] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                </>
              )}

              {currentUser?.role === 'staff' && (
                <>
                  <NavLink
                    to="/verify"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl transition-all font-semibold ${
                        isActive ? 'bg-[#DF367C] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Gate Scanner
                  </NavLink>
                  <NavLink
                    to="/verify/history"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl transition-all font-semibold ${
                        isActive ? 'bg-[#DF367C] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Scan Log
                  </NavLink>
                </>
              )}

              {currentUser?.role === 'admin' && (
                <>
                  <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl transition-all font-semibold ${
                        isActive ? 'bg-[#883955] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/admin/events"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl transition-all font-semibold ${
                        isActive ? 'bg-[#883955] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Events Admin
                  </NavLink>
                  <NavLink
                    to="/admin/concurrency"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl transition-all font-semibold ${
                        isActive ? 'bg-[#883955] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    2PL Concurrency Lab
                  </NavLink>
                  <NavLink
                    to="/admin/audit"
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl transition-all font-semibold ${
                        isActive ? 'bg-[#883955] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Audit Logs
                  </NavLink>
                </>
              )}
            </nav>

            {/* User Role Switcher & Profile */}
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#2A1D26] border border-white/15 hover:border-white/30 text-white text-xs font-mono transition-all cursor-pointer shadow-md"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#FF3E41] text-white font-bold flex items-center justify-center text-[11px]">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <span className="font-bold block leading-none">{currentUser.name.split(' ')[0]}</span>
                      <span className="text-[9px] text-[#FF7099] uppercase tracking-wider leading-none">
                        {currentUser.role}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-[#2A1D26] border border-white/20 rounded-2xl p-3 shadow-2xl z-50 backdrop-blur-2xl space-y-2 font-mono text-xs"
                      >
                        <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                          <div className="font-bold text-white text-sm">{currentUser.name}</div>
                          <div className="text-[#FF7099] text-[10px]">{currentUser.email}</div>
                          <div className="text-white/40 text-[9px] uppercase mt-1">Role: {currentUser.role}</div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-[9px] text-white/40 uppercase font-bold px-1">Switch Active Persona</div>
                          <button
                            onClick={() => { loginAsStudent(); setUserDropdownOpen(false); }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-xs"
                          >
                            🎓 Student Persona
                          </button>
                          <button
                            onClick={() => { loginAsGateStaff(); setUserDropdownOpen(false); }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-xs"
                          >
                            🛡️ Gate Staff Persona
                          </button>
                          <button
                            onClick={() => { loginAsAdmin(); setUserDropdownOpen(false); }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-xs"
                          >
                            ⚡ Admin / Faculty Lab
                          </button>
                        </div>

                        <div className="pt-1 border-t border-white/10">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-mono font-bold transition-all shadow-md"
                >
                  Sign In
                </NavLink>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[#2A1D26] text-white border border-white/15 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-[#2A1D26] px-4 py-4 space-y-3 font-mono text-xs"
            >
              {currentUser?.role === 'student' && (
                <>
                  <NavLink to="/events" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white">Events Lineup</NavLink>
                  <NavLink to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white">My Bookings</NavLink>
                  <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white">Profile</NavLink>
                </>
              )}
              {currentUser?.role === 'staff' && (
                <>
                  <NavLink to="/verify" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white">Gate Scanner</NavLink>
                  <NavLink to="/verify/history" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white">Scan Log</NavLink>
                </>
              )}
              {currentUser?.role === 'admin' && (
                <>
                  <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white">Dashboard</NavLink>
                  <NavLink to="/admin/events" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white">Events Admin</NavLink>
                  <NavLink to="/admin/concurrency" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white">2PL Lab</NavLink>
                  <NavLink to="/admin/audit" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white">Audit Logs</NavLink>
                </>
              )}
              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="text-white/60">{currentUser?.name}</span>
                <button onClick={handleLogout} className="text-red-400 font-bold">Sign Out</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>

      {/* Footer */}
      <footer className="bg-[#4C3549]/60 border-t border-white/10 py-6 mt-12 text-center text-xs font-mono text-white/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>&copy; 2026 Vibrance Annual Cultural Fest &bull; VIT Chennai</div>
          <div className="text-[#FF7099]">DBMS ACID Strict 2PL Demonstration</div>
        </div>
      </footer>
    </div>
  );
};
