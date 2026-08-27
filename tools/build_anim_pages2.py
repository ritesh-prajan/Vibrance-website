import os
def w(p, c):
    os.makedirs(os.path.dirname(os.path.abspath(p)), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f: f.write(c.strip()+"\n")
    print(f'Wrote {p}')

# ─── LoginPage.tsx ─── ambient blobs + role card stagger + glitch title
w('src/pages/public/LoginPage.tsx', """import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { UserRole, StudentProfile, GateStaffProfile, AdminProfile } from '../../types';
import { MOCK_STUDENT_PROFILES, MOCK_STAFF_PROFILES, MOCK_ADMIN_PROFILES } from '../../data/mockEvents';
import { User, ShieldCheck, Cpu, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AmbientBlobs } from '../../components/common/AmbientBlobs';
import { GlitchText } from '../../components/common/GlitchText';

export const LoginPage: React.FC = () => {
  const { loginAsStudent, loginAsGateStaff, loginAsAdmin } = useFest();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [customName, setCustomName] = useState('');
  const [customIdentifier, setCustomIdentifier] = useState('');
  const [customDept, setCustomDept] = useState('');
  const [pendingSelect, setPendingSelect] = useState<string | null>(null);

  const handleQuickProfileLogin = (profile: StudentProfile | GateStaffProfile | AdminProfile, role: UserRole) => {
    setPendingSelect(profile.id);
    setTimeout(() => {
      if (role === 'student') {
        const s = profile as StudentProfile;
        loginAsStudent(s.name, s.regNumber, s.department, s.year);
        navigate('/events', { replace: true });
      } else if (role === 'gate_staff') {
        const g = profile as GateStaffProfile;
        loginAsGateStaff(g.name, g.regNumber, g.department);
        navigate('/verify', { replace: true });
      } else if (role === 'admin') {
        const a = profile as AdminProfile;
        loginAsAdmin(a.name, a.regNumber, a.department);
        navigate('/admin', { replace: true });
      }
    }, 180);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customName.trim() || (selectedRole === 'student' ? 'Student Attendee' : selectedRole === 'gate_staff' ? 'Gate Security Officer' : 'System Admin');
    const identifier = customIdentifier.trim() || (selectedRole === 'student' ? 'RA2111003010142' : selectedRole === 'gate_staff' ? 'STF-GATE-01' : 'FAC-DBMS-001');
    if (selectedRole === 'student') { loginAsStudent(name, identifier, customDept || 'Engineering', '3rd Year'); navigate('/events', { replace: true }); }
    else if (selectedRole === 'gate_staff') { loginAsGateStaff(name, identifier, 'Gate A'); navigate('/verify', { replace: true }); }
    else if (selectedRole === 'admin') { loginAsAdmin(name, identifier, customDept || 'Computer Science'); navigate('/admin', { replace: true }); }
  };

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
    { role: 'student', label: 'STUDENT ATTENDEE', icon: <User className="w-6 h-6" />, desc: 'Access event catalog, reserve seats, manage bookings & digital passes', color: '#FF3E41' },
    { role: 'gate_staff', label: 'GATE SECURITY', icon: <ShieldCheck className="w-6 h-6" />, desc: 'Real-time ticket verification console & check-in audit trail', color: '#DF367C' },
    { role: 'admin', label: 'FACULTY / ADMIN', icon: <Cpu className="w-6 h-6" />, desc: 'DBMS Concurrency Lab, event inventory management & full audit access', color: '#FF7099' },
  ];

  const profilesForRole = selectedRole === 'student' ? MOCK_STUDENT_PROFILES : selectedRole === 'gate_staff' ? MOCK_STAFF_PROFILES : MOCK_ADMIN_PROFILES;

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-[#2A1D26] flex items-center justify-center p-4 relative overflow-hidden">
      <AmbientBlobs variant="login" />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <GlitchText
            as="h1"
            className="text-5xl sm:text-7xl font-display font-black text-white tracking-widest"
            delay={50}
          >
            VIBRANCE 2026
          </GlitchText>
          <p className="text-white/60 text-sm font-mono mt-3">Annual College Fest &bull; Ticket Booking &amp; DBMS Concurrency Platform</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Role + Profiles */}
          <div className="lg:col-span-3 space-y-6">
            {/* Role Selector */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-3"
            >
              {roles.map(({ role, label, icon, desc, color }) => (
                <motion.button
                  key={role}
                  variants={itemVariants}
                  whileHover={{ y: -3, boxShadow: `0 12px 40px ${color}25` }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedRole(role)}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    selectedRole === role
                      ? 'border-[var(--c)] bg-[var(--c)]/10'
                      : 'border-white/10 bg-[#4C3549] hover:border-white/25'
                  }`}
                  style={{ '--c': color } as React.CSSProperties}
                >
                  {selectedRole === role && (
                    <motion.div
                      layoutId="role-indicator"
                      className="absolute inset-0 rounded-2xl border-2"
                      style={{ borderColor: color }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <div className="mb-2" style={{ color: selectedRole === role ? color : '#ffffff99' }}>{icon}</div>
                  <div className="text-[10px] font-mono font-black uppercase tracking-wider" style={{ color: selectedRole === role ? color : 'rgba(255,255,255,0.7)' }}>{label}</div>
                  <div className="text-[9px] text-white/50 mt-1 leading-tight">{desc}</div>
                  {selectedRole === role && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Quick Profile Cards */}
            <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/60">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7099]" />
                <span>1-Click Fast Login Personas:</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRole}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {profilesForRole.map((profile) => (
                    <motion.button
                      key={profile.id}
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: pendingSelect === profile.id ? 0.95 : 0.98 }}
                      animate={pendingSelect === profile.id ? { scale: [1, 0.95, 0.95] } : {}}
                      onClick={() => handleQuickProfileLogin(profile, selectedRole)}
                      className="w-full text-left p-3.5 rounded-2xl bg-[#2A1D26] hover:bg-[#3a2434] border border-white/10 hover:border-white/25 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#4C3549] border border-white/15 text-white font-bold flex items-center justify-center text-sm">
                          {profile.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{profile.name}</div>
                          <div className="text-[10px] text-[#FF7099] font-mono">{profile.regNumber}</div>
                          <div className="text-[10px] text-white/50">{profile.department}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Custom Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="lg:col-span-2 bg-[#4C3549] border border-white/15 rounded-3xl p-6 space-y-5 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-black text-white font-display tracking-wide mb-1">CUSTOM LOGIN</h2>
              <p className="text-[11px] text-white/60 font-mono">Enter your own credentials</p>
            </div>
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/60 uppercase">Your Name</label>
                <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g. Priya Nair" className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#FF3E41]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/60 uppercase">{selectedRole === 'student' ? 'Reg. Number' : 'Staff / Employee ID'}</label>
                <input type="text" value={customIdentifier} onChange={(e) => setCustomIdentifier(e.target.value)} placeholder={selectedRole === 'student' ? 'RA2111003010142' : 'STF-GATE-01'} className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#FF3E41]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/60 uppercase">Department</label>
                <input type="text" value={customDept} onChange={(e) => setCustomDept(e.target.value)} placeholder="Computer Science & Engineering" className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#FF3E41]" />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold font-mono text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter as {selectedRole === 'student' ? 'Student' : selectedRole === 'gate_staff' ? 'Gate Staff' : 'Admin'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
            <div className="text-center">
              <Link to="/register" className="text-[11px] font-mono text-[#FF7099] hover:underline">New student? Register here &rarr;</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
""")

# ─── VerifyConsolePage.tsx ─── scan result animations (VALID flash, USED shake, INVALID fade)
w('src/pages/staff/VerifyConsolePage.tsx', """import React, { useState, useCallback } from 'react';
import { useFest } from '../../context/FestContext';
import { ScanRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ShieldCheck, Search, CheckCircle2, AlertTriangle, XCircle, Clock, History, QrCode, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VerifyConsolePage: React.FC = () => {
  const { currentUser, verifyTicket, scanHistory, allBookings } = useFest();
  const reduced = usePrefersReducedMotion();
  const duplicateControls = useAnimation();

  const [scanQuery, setScanQuery] = useState('');
  const [lastScanResult, setLastScanResult] = useState<ScanRecord | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const staff = { name: currentUser?.name || 'Officer Rajesh Menon', staffId: currentUser?.regNumber || 'STF-GATE-04' };

  const handleScan = useCallback(async (queryToScan?: string) => {
    const q = (queryToScan || scanQuery).trim();
    if (!q) return;
    setIsScanning(true);
    setLastScanResult(null);
    await new Promise((r) => setTimeout(r, 380));
    const result = verifyTicket(q, staff);
    setLastScanResult(result);
    setIsScanning(false);
    setScanQuery('');
    if (result.result === 'ALREADY_USED' && !reduced) {
      await duplicateControls.start({
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.45, ease: 'easeInOut' },
      });
    }
  }, [scanQuery, staff, verifyTicket, reduced, duplicateControls]);

  const resultVariants = {
    VALID: {
      initial: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10 },
      animate: reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0.25, ease: 'easeOut' },
    },
    ALREADY_USED: {
      initial: reduced ? { opacity: 0 } : { opacity: 0, y: 10 },
      animate: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
      transition: { duration: 0.22, ease: 'easeOut' },
    },
    INVALID: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const rv = lastScanResult ? resultVariants[lastScanResult.result] ?? resultVariants.INVALID : resultVariants.INVALID;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">GATE SECURITY CONSOLE</span>
            <span className="text-xs text-white/50 font-mono">Real-time Check-in Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">TICKET SCANNER &amp; ACCESS CONTROL</h1>
        </div>
        <div className="bg-[#4C3549] border border-white/15 rounded-2xl p-3.5 flex items-center gap-3 text-xs font-mono">
          <div className="w-8 h-8 rounded-xl bg-[#DF367C] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-white font-bold">{staff.name}</div>
            <div className="text-[#FF7099] text-[10px]">{staff.staffId} &bull; Active Post</div>
          </div>
        </div>
      </div>

      {/* Scanner Input */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <form onSubmit={(e) => { e.preventDefault(); handleScan(); }} className="space-y-4">
          <label className="block text-xs font-mono font-bold text-white/80 uppercase tracking-wider">Scan / Enter Booking Reference Code or QR Payload:</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <QrCode className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. VIB26-EDM-C3 or VIB26-ARMAAN-A1"
                value={scanQuery}
                onChange={(e) => setScanQuery(e.target.value)}
                className="w-full bg-[#2A1D26] border border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white font-mono placeholder-white/40 focus:outline-none focus:border-[#DF367C]"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isScanning}
              className="px-8 py-3.5 rounded-2xl bg-[#DF367C] hover:bg-[#c42867] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-70"
            >
              {isScanning ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }} className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{isScanning ? 'Verifying...' : 'Verify Pass'}</span>
            </motion.button>
          </div>
        </form>

        {/* Quick Test Buttons */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="text-[11px] font-mono text-white/50 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7099]" />
            <span>Gate Demo Quick-Scan Shortcuts:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => handleScan('VIB26-EDM-C3')} className="px-3 py-1.5 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 transition-colors flex items-center gap-1.5 cursor-pointer">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Test Valid Pass (VIB26-EDM-C3)</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => handleScan('VIB26-ARMAAN-A1')} className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Test Used / Duplicate (VIB26-ARMAAN-A1)</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => handleScan('VIB26-INVALID-TEST99')} className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 transition-colors flex items-center gap-1.5 cursor-pointer">
              <XCircle className="w-3.5 h-3.5" />
              <span>Test Invalid Code (VIB26-INVALID-TEST99)</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Scan Result */}
      <AnimatePresence mode="wait">
        {lastScanResult && (
          <div className="space-y-4" key={`${lastScanResult.id}-${lastScanResult.result}`}>
            <div className="text-xs font-mono font-bold text-white/70 uppercase tracking-wider">Verification Result Inspection:</div>

            {/* VALID */}
            {lastScanResult.result === 'VALID' && (
              <motion.div
                initial={rv.initial} animate={rv.animate} transition={rv.transition}
                className="bg-[#4C3549] border-2 border-[#10B981] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
                      className="w-14 h-14 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">ACCESS GRANTED &bull; VALID PASS</span>
                      <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">{lastScanResult.eventTitle}</h2>
                    </div>
                  </div>
                  <StatusBadge status="VALID" size="lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Attendee</div>
                    <div className="font-bold text-white text-base">{lastScanResult.attendeeName}</div>
                    <div className="text-[#FF7099]">Verified Student</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Seat Assignment</div>
                    <div className="font-black text-white text-xl">Seat {lastScanResult.seatLabel}</div>
                    <div className="text-[#FF7099]">Reserved Seat</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Pass Reference</div>
                    <div className="font-bold text-[#FF7099] text-base">{lastScanResult.bookingRef}</div>
                    <div className="text-[10px] text-white/50">Checked in just now</div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-mono text-[#10B981] flex items-center justify-between">
                  <span>{lastScanResult.message}</span>
                  <span className="text-white/60">Inspector: {staff.name}</span>
                </div>
              </motion.div>
            )}

            {/* ALREADY USED */}
            {lastScanResult.result === 'ALREADY_USED' && (
              <motion.div
                initial={rv.initial} animate={duplicateControls} transition={rv.transition}
                onAnimationStart={() => { duplicateControls.set(rv.initial); duplicateControls.start(rv.animate); }}
                className="bg-[#4C3549] border-2 border-amber-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ backgroundColor: ['rgba(245,158,11,0.2)', 'rgba(245,158,11,0.4)', 'rgba(245,158,11,0.2)'] }}
                      transition={{ duration: 0.8, repeat: 3 }}
                      className="w-14 h-14 rounded-2xl border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg"
                    >
                      <AlertTriangle className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">DUPLICATE ENTRY ALERT &bull; FRAUD WARNING</span>
                      <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">Pass Already Checked In</h2>
                    </div>
                  </div>
                  <StatusBadge status="ALREADY_USED" size="lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Registered Attendee</div>
                    <div className="font-bold text-white text-base">{lastScanResult.attendeeName}</div>
                    <div className="text-white/50">{lastScanResult.eventTitle}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Seat Claimed</div>
                    <div className="font-black text-white text-xl">Seat {lastScanResult.seatLabel}</div>
                    <div className="text-amber-300">Original Pass Used</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/40 uppercase">Original Check-in Staff</div>
                    <div className="font-bold text-white text-sm">{lastScanResult.originalCheckedInBy || 'Gate Staff #01'}</div>
                    <div className="text-[10px] text-amber-300">
                      Timestamp: {lastScanResult.originalCheckedInAt ? new Date(lastScanResult.originalCheckedInAt).toLocaleTimeString() : 'Prior check-in'}
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-200">
                  <strong>Access Denied:</strong> This digital pass barcode has already been scanned and admitted. Intercept duplicate holder.
                </div>
              </motion.div>
            )}

            {/* INVALID */}
            {lastScanResult.result === 'INVALID' && (
              <motion.div
                initial={rv.initial} animate={rv.animate} transition={rv.transition}
                className="bg-[#4C3549] border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shadow-lg">
                      <XCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">ACCESS DENIED &bull; INVALID PASS</span>
                      <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">No Record Located</h2>
                    </div>
                  </div>
                  <StatusBadge status="INVALID" size="lg" />
                </div>
                <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-300">
                  {lastScanResult.message} Code scanned: [{lastScanResult.query}]. Direct attendee to Helpdesk.
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Recent Scans - slide-in on new entry */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#FF7099]" />
            <h2 className="text-lg font-bold text-white font-display tracking-wide">RECENT SCANS THIS SHIFT</h2>
          </div>
          <Link to="/verify/history" className="text-xs font-mono text-[#FF7099] hover:underline">View Full Check-in History &rarr;</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                <th className="pb-3 pr-4">Timestamp</th>
                <th className="pb-3 px-4">Result</th>
                <th className="pb-3 px-4">Pass Reference</th>
                <th className="pb-3 px-4">Attendee</th>
                <th className="pb-3 px-4">Event</th>
                <th className="pb-3 pl-4">Staff Inspector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              <AnimatePresence initial={false}>
                {scanHistory.slice(0, 6).map((scan) => (
                  <motion.tr
                    key={scan.id}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, x: -16, backgroundColor: '#883955' }}
                    animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="hover:bg-white/5"
                  >
                    <td className="py-3 pr-4 text-white/50 text-[11px]">{new Date(scan.timestamp).toLocaleTimeString()}</td>
                    <td className="py-3 px-4"><StatusBadge status={scan.result} size="sm" /></td>
                    <td className="py-3 px-4 font-bold text-[#FF7099]">{scan.bookingRef || scan.query}</td>
                    <td className="py-3 px-4 text-white">{scan.attendeeName || 'Unknown Attendee'}</td>
                    <td className="py-3 px-4 text-white/70 truncate max-w-[180px]">{scan.eventTitle || 'N/A'}</td>
                    <td className="py-3 pl-4 text-white/50 text-[11px]">{scan.staffMember.name}</td>
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
""")

# ─── AdminDashboardPage.tsx ─── count-up KPI cards + stagger-in tiles
w('src/pages/admin/AdminDashboardPage.tsx', """import React from 'react';
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { to: '/admin/concurrency-lab', icon: <Cpu className="w-5 h-5" />, iconBg: '#DF367C', title: 'CONCURRENCY SIMULATOR LAB', desc: 'Benchmark database isolation strategies (No Locking vs Strict 2PL vs OCC) with live side-by-side transaction execution tables.' },
          { to: '/admin/events', icon: <Calendar className="w-5 h-5" />, iconBg: '#883955', title: 'INVENTORY & EVENT MANAGEMENT', desc: 'Manage stage event capacities, modify base pricing tiers, and inspect per-event seat contention metrics.' },
          { to: '/admin/audit-logs', icon: <Activity className="w-5 h-5" />, iconBg: '#FF3E41', title: 'SYSTEM AUDIT & TRANSACTION LOGS', desc: 'Inspect all ACID commits, lock grants, timeout expirations, overbooking anomalies, and gate verification check-ins.' },
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
""")

print('LoginPage, VerifyConsolePage, AdminDashboardPage written.')

