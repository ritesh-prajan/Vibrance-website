import React, { useState } from 'react';
import { useFest } from '../context/FestContext';
import {
  Ticket,
  Cpu,
  ShieldCheck,
  User,
  LogOut,
  Sparkles,
  RotateCcw,
  Layers,
  ChevronDown,
  Activity,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'events' | 'my-bookings' | 'concurrency-lab' | 'audit-hub';
  setCurrentTab: (tab: 'events' | 'my-bookings' | 'concurrency-lab' | 'audit-hub') => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenLogin }) => {
  const { currentUser, logout, switchRole, myBookings, resetDatabaseState, seatLockTimeRemaining, activeSeat } =
    useFest();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const confirmedBookingsCount = myBookings.filter((b) => b.status === 'CONFIRMED').length;
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080a0f]/90 backdrop-blur-md">
      {/* Active Lock Timer Banner if user has a seat held */}
      {activeSeat && seatLockTimeRemaining > 0 && (
        <div className="bg-[#ccff00] text-black text-xs font-semibold px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-black animate-ping" />
            <span>
              <strong>EXCLUSIVE SEAT HOLD:</strong> Seat [{activeSeat.row}-{activeSeat.number}] reserved under your session.
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span>HOLD EXPIRES IN:</span>
            <span className="bg-black text-[#ccff00] px-2 py-0.5 rounded font-bold">
              {Math.floor(seatLockTimeRemaining / 60)}:
              {(seatLockTimeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Fest Identity */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentTab('events')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#ccff00] text-black flex items-center justify-center font-bold text-lg tracking-tighter group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(204,255,0,0.3)]">
              V26
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl text-white tracking-wider">VIBRANCE 2026</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/10 text-white/70 px-1.5 py-0.5 rounded">
                  FEST
                </span>
              </div>
              <p className="text-[10px] text-white/50 font-mono tracking-tight -mt-1 flex items-center gap-1">
                <Cpu className="w-2.5 h-2.5 text-[#ccff00]" /> DBMS TRANSACTION ENGINE
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#121620] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setCurrentTab('events')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'events'
                ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            Events & Passes
          </button>

          {currentUser?.role === 'STUDENT' && (
            <button
              onClick={() => setCurrentTab('my-bookings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'my-bookings'
                  ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              My Passes
              {confirmedBookingsCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    currentTab === 'my-bookings' ? 'bg-black text-[#ccff00]' : 'bg-[#ccff00] text-black'
                  }`}
                >
                  {confirmedBookingsCount}
                </span>
              )}
            </button>
          )}

          {/* Admin-Only Tabs: Transaction Simulator & Audit Dashboard */}
          {isAdmin && (
            <>
              <button
                onClick={() => setCurrentTab('concurrency-lab')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 relative ${
                  currentTab === 'concurrency-lab'
                    ? 'bg-[#00e5ff] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)] font-bold'
                    : 'text-[#00e5ff] hover:bg-[#00e5ff]/10 border border-[#00e5ff]/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>System Lab</span>
                <span className="text-[9px] uppercase tracking-wider bg-black/40 px-1 rounded">Admin</span>
              </button>

              <button
                onClick={() => setCurrentTab('audit-hub')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentTab === 'audit-hub'
                    ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Audit & Telemetry
              </button>
            </>
          )}
        </nav>

        {/* User Identity & Role Controls */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 bg-[#121620] hover:bg-[#1a202c] border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-xl transition-colors text-left"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    currentUser.role === 'ADMIN' ? 'bg-[#00e5ff] text-black' : 'bg-[#ccff00] text-black'
                  }`}
                >
                  {currentUser.role === 'ADMIN' ? 'A' : 'S'}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white leading-tight">{currentUser.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                        currentUser.role === 'ADMIN'
                          ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40'
                          : 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/50 font-mono">{currentUser.regNumber}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/40 ml-1" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-[#121620] border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-[11px] text-white/50 font-mono">ACTIVE SESSION</p>
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-white/60 font-mono">{currentUser.regNumber}</p>
                    <p className="text-[10px] text-[#ccff00] truncate mt-0.5">{currentUser.department}</p>
                  </div>

                  {/* Role Specific Actions */}
                  <div className="py-1">
                    {isAdmin ? (
                      <>
                        <div className="px-3 py-1 text-[10px] text-white/40 uppercase font-mono tracking-wider">
                          Admin Navigation
                        </div>
                        <button
                          onClick={() => {
                            setCurrentTab('concurrency-lab');
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                            currentTab === 'concurrency-lab'
                              ? 'bg-[#00e5ff]/15 text-[#00e5ff] font-bold'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5 text-[#00e5ff]" /> Open System Lab
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentTab('audit-hub');
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                            currentTab === 'audit-hub'
                              ? 'bg-[#ccff00]/15 text-[#ccff00] font-bold'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-[#ccff00]" /> Audit & Telemetry
                          </span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-1 text-[10px] text-white/40 uppercase font-mono tracking-wider">
                          Student Portal
                        </div>
                        <button
                          onClick={() => {
                            setCurrentTab('events');
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                            currentTab === 'events'
                              ? 'bg-[#ccff00]/15 text-[#ccff00] font-bold'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" /> Browse Passes
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentTab('my-bookings');
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                            currentTab === 'my-bookings'
                              ? 'bg-[#ccff00]/15 text-[#ccff00] font-bold'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Ticket className="w-3.5 h-3.5 text-[#ccff00]" /> My Passes ({confirmedBookingsCount})
                          </span>
                        </button>
                      </>
                    )}
                  </div>

                  <div className="border-t border-white/10 mt-1 pt-1">
                    {isAdmin && (
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-amber-400 hover:bg-amber-400/10 flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Database State
                      </button>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-400/10 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out / Switch Portal
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="bg-[#ccff00] hover:bg-[#b8e600] text-black px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(204,255,0,0.25)] flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              Sign In (Demo Auth)
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden border-t border-white/10 px-2 py-1.5 bg-[#0e121a] overflow-x-auto gap-1">
        <button
          onClick={() => setCurrentTab('events')}
          className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
            currentTab === 'events' ? 'bg-[#ccff00] text-black font-bold' : 'text-white/60'
          }`}
        >
          Events
        </button>
        {currentUser?.role === 'STUDENT' && (
          <button
            onClick={() => setCurrentTab('my-bookings')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'my-bookings' ? 'bg-[#ccff00] text-black font-bold' : 'text-white/60'
            }`}
          >
            My Passes ({confirmedBookingsCount})
          </button>
        )}
        {isAdmin && (
          <>
            <button
              onClick={() => setCurrentTab('concurrency-lab')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                currentTab === 'concurrency-lab' ? 'bg-[#00e5ff] text-black font-bold' : 'text-[#00e5ff]'
              }`}
            >
              System Lab
            </button>
            <button
              onClick={() => setCurrentTab('audit-hub')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                currentTab === 'audit-hub' ? 'bg-[#ccff00] text-black font-bold' : 'text-white/60'
              }`}
            >
              Audit Hub
            </button>
          </>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-white/20 rounded-2xl max-w-md w-full p-6 text-center">
            <RotateCcw className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Reset Database & State Baseline?</h3>
            <p className="text-xs text-white/70 mt-2 mb-6">
              This will re-initialize all seat inventories, release all active locks, and reset the simulation baseline
              for your DBMS demonstration.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDatabaseState();
                  setShowResetConfirm(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 shadow-lg"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
