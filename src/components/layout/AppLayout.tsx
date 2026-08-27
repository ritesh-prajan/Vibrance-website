import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import {
  Calendar,
  Ticket,
  User,
  ShieldCheck,
  History,
  LayoutDashboard,
  Cpu,
  Activity,
  LogOut,
  Menu,
  X,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    logout,
    activeSeat,
    seatLockTimeRemaining,
    releaseActiveSeat,
    loginAsStudent,
    loginAsGateStaff,
    loginAsAdmin,
  } = useFest();

  const navigate = useNavigate();
  const location = useLocation();
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

  return (
    <div className="min-h-screen bg-[#2A1D26] text-[#F3EDF2] flex flex-col font-sans selection:bg-[#FF3E41] selection:text-white">
      {/* 1. TOP STICKY SEAT HOLD NOTIFICATION BANNER (When student has an active hold) */}
      {activeSeat && seatLockTimeRemaining > 0 && currentUser?.role === 'student' && (
        <div className="sticky top-0 z-50 bg-[#4C3549] border-b border-[#FF3E41] text-white px-4 py-2 text-xs font-mono flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3E41] animate-ping" />
            <span className="font-bold text-[#FF7099]">ACTIVE SEAT HOLD:</span>
            <span>Seat [{activeSeat.row}-{activeSeat.number}]</span>
            <span className="hidden sm:inline text-white/60">({activeSeat.eventTitle})</span>
            <span className="font-mono bg-[#FF3E41] text-white px-2 py-0.5 rounded text-[11px] font-bold">
              {formatTimer(seatLockTimeRemaining)}
            </span>
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
            <button
              onClick={releaseActiveSeat}
              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
            >
              Release
            </button>
          </div>
        </div>
      )}

      {/* 2. PERSISTENT PRIMARY HEADER NAVBAR */}
      <header className="bg-[#4C3549] border-b border-white/15 sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Monogram */}
            <div className="flex items-center gap-3">
              <NavLink
                to="/"
                className="flex items-center gap-2.5 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF3E41] to-[#DF367C] text-white font-display font-black text-xl flex items-center justify-center shadow-lg">
                  V
                </div>
                <div>
                  <span className="font-display font-black tracking-wider text-xl text-white block leading-none">
                    VIBRANCE
                  </span>
                  <span className="text-[10px] font-mono text-[#FF7099] tracking-widest uppercase block mt-0.5">
                    FEST 2026
                  </span>
                </div>
              </NavLink>

              {/* Role Badge Indicator */}
              {currentUser && (
                <div className="hidden sm:inline-flex items-center ml-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      currentUser.role === 'admin'
                        ? 'bg-[#883955] text-white border border-[#FF7099]/40'
                        : currentUser.role === 'gate_staff'
                        ? 'bg-[#DF367C]/30 text-[#FF7099] border border-[#DF367C]/50'
                        : 'bg-[#FF3E41]/20 text-[#FF3E41] border border-[#FF3E41]/40'
                    }`}
                  >
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
              {currentUser?.role === 'student' && (
                <>
                  <NavLink
                    to="/events"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#FF3E41] text-white font-bold shadow-md'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Events Catalog</span>
                  </NavLink>

                  <NavLink
                    to="/my-bookings"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#FF3E41] text-white font-bold shadow-md'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>My Bookings</span>
                  </NavLink>

                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#FF3E41] text-white font-bold shadow-md'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </NavLink>
                </>
              )}

              {currentUser?.role === 'gate_staff' && (
                <>
                  <NavLink
                    to="/verify"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#DF367C] text-white font-bold shadow-md'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify Scanner</span>
                  </NavLink>

                  <NavLink
                    to="/verify/history"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#DF367C] text-white font-bold shadow-md'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Check-in Log</span>
                  </NavLink>
                </>
              )}

              {currentUser?.role === 'admin' && (
                <>
                  <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#883955] text-white font-bold shadow-md border border-white/20'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </NavLink>

                  <NavLink
                    to="/admin/concurrency-lab"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#DF367C] text-white font-bold shadow-md'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Concurrency Lab</span>
                  </NavLink>

                  <NavLink
                    to="/admin/events"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#883955] text-white font-bold shadow-md border border-white/20'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Inventory</span>
                  </NavLink>

                  <NavLink
                    to="/admin/audit-logs"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#883955] text-white font-bold shadow-md border border-white/20'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Audit Trail</span>
                  </NavLink>
                </>
              )}
            </nav>

            {/* User Profile Switcher & Actions */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#2A1D26] hover:bg-[#883955] border border-white/10 transition-colors text-xs font-mono text-left cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#FF3E41] text-white font-bold flex items-center justify-center text-[10px]">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="hidden sm:block">
                      <div className="font-bold text-white leading-tight">{currentUser.name}</div>
                      <div className="text-[10px] text-[#FF7099]">{currentUser.regNumber}</div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#4C3549] border border-white/20 shadow-2xl p-3 z-50 space-y-2 font-mono text-xs">
                      <div className="px-2 py-1.5 border-b border-white/10">
                        <div className="font-bold text-white">{currentUser.name}</div>
                        <div className="text-[11px] text-[#FF7099]">{currentUser.email}</div>
                        <div className="text-[10px] text-white/50">{currentUser.department}</div>
                      </div>

                      {/* Switch Persona Shortcuts */}
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase text-white/40 px-2">Quick Switch Role:</span>
                        <button
                          onClick={() => {
                            loginAsStudent('Rahul Sharma', 'RA2111003010142', 'Computer Science & Engineering', '3rd Year');
                            setUserDropdownOpen(false);
                            navigate('/events');
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/10 text-white flex items-center justify-between cursor-pointer"
                        >
                          <span>Student (Rahul)</span>
                          <span className="text-[10px] text-[#FF3E41]">Student</span>
                        </button>
                        <button
                          onClick={() => {
                            loginAsGateStaff('Officer Rajesh Menon', 'STF-GATE-04', 'Gate A');
                            setUserDropdownOpen(false);
                            navigate('/verify');
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/10 text-white flex items-center justify-between cursor-pointer"
                        >
                          <span>Staff (Rajesh)</span>
                          <span className="text-[10px] text-[#DF367C]">Gate Staff</span>
                        </button>
                        <button
                          onClick={() => {
                            loginAsAdmin('Dr. Ramesh Sundaram', 'FAC-DBMS-702', 'Computer Science & Engineering');
                            setUserDropdownOpen(false);
                            navigate('/admin');
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/10 text-white flex items-center justify-between cursor-pointer"
                        >
                          <span>Admin (Prof. Ramesh)</span>
                          <span className="text-[10px] text-[#FF7099]">Admin</span>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-red-500/20 text-red-300 flex items-center gap-2 cursor-pointer font-bold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md"
                >
                  Sign In
                </NavLink>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-[#2A1D26] text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#2A1D26] border-b border-white/15 px-4 py-4 space-y-2 font-mono text-xs">
            {currentUser?.role === 'student' && (
              <>
                <NavLink
                  to="/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold"
                >
                  Events Catalog
                </NavLink>
                <NavLink
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold"
                >
                  My Bookings
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold"
                >
                  Student Profile
                </NavLink>
              </>
            )}

            {currentUser?.role === 'gate_staff' && (
              <>
                <NavLink
                  to="/verify"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold"
                >
                  Verify Scanner
                </NavLink>
                <NavLink
                  to="/verify/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold"
                >
                  Check-in Log
                </NavLink>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <>
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold"
                >
                  Admin Dashboard
                </NavLink>
                <NavLink
                  to="/admin/concurrency-lab"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold"
                >
                  Concurrency Lab Simulator
                </NavLink>
                <NavLink
                  to="/admin/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold"
                >
                  Inventory Management
                </NavLink>
                <NavLink
                  to="/admin/audit-logs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-[#4C3549] text-white font-bold"
                >
                  System Audit Logs
                </NavLink>
              </>
            )}

            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-red-400 font-bold"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. MAIN PAGE BODY CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* 4. FOOTER */}
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
