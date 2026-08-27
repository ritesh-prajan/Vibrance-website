import os

def w(p, c):
    os.makedirs(os.path.dirname(os.path.abspath(p)), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c.strip() + "\n")
    print(f'Wrote {p}')

# ─── 1. LandingPage.tsx with explicit button to jump to login + scroll tracking ───
w('src/pages/public/LandingPage.tsx', """import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AmbientBlobs } from '../../components/common/AmbientBlobs';
import { GlitchText } from '../../components/common/GlitchText';
import { CrowdSilhouettes } from '../../components/landing/CrowdSilhouettes';
import { StageLightBeams } from '../../components/landing/StageLightBeams';
import { ParticleHazeCanvas } from '../../components/landing/ParticleHazeCanvas';
import { LoginFormSection } from '../../components/landing/LoginFormSection';
import { ChevronDown, Sparkles, Zap, ShieldCheck, ArrowDown, LogIn } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Scroll tracking across the 240vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setIsPastHero(latest > 0.35);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Section 1: Hero title & content transforms
  const heroTitleOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const heroTitleScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.88]);
  const heroTitleY = useTransform(scrollYProgress, [0, 0.28], [0, -40]);

  // Section 1: Stage visual layer dimming + fog rolling in
  const heroDarkenOverlay = useTransform(scrollYProgress, [0, 0.45], [0, 0.78]);
  const heroBackdropBlur = useTransform(scrollYProgress, [0.1, 0.5], [0, 12]);

  // Section 2: Login card reveal
  const loginOpacity = useTransform(scrollYProgress, [0.28, 0.58], [0, 1]);
  const loginY = useTransform(scrollYProgress, [0.28, 0.58], [80, 0]);
  const loginScale = useTransform(scrollYProgress, [0.28, 0.58], [0.95, 1]);

  // Scroll down to login helper
  const handleScrollToLogin = () => {
    if (!containerRef.current) return;
    const target = containerRef.current.scrollHeight * 0.75;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  const handleScrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative bg-[#2A1D26] text-[#F3EDF2] min-h-[240vh]">
      {/* Quick Nav Bar on Top Right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {!isPastHero ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleScrollToLogin}
            className="px-4 py-2 rounded-full bg-[#FF3E41] hover:bg-[#e03235] text-white font-mono font-bold text-xs shadow-2xl flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Personas &darr;</span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleScrollToHero}
            className="px-4 py-2 rounded-full bg-[#4C3549]/90 hover:bg-[#883955] text-white border border-white/20 font-mono font-bold text-xs shadow-2xl flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
          >
            <span>&uarr; Back to Hero Stage</span>
          </motion.button>
        )}
      </div>

      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* ─── LAYER 1: Ambient Gradient Blobs (Back) ─── */}
        <AmbientBlobs variant="login" />

        {/* ─── LAYER 2: Stage Sweeping Light Beams ─── */}
        <StageLightBeams />

        {/* ─── LAYER 3: Canvas Particle Haze Field (Front of beams) ─── */}
        <ParticleHazeCanvas isPaused={false} />

        {/* ─── LAYER 4: Energetic Crowd Silhouettes (Bottom third) ─── */}
        <CrowdSilhouettes />

        {/* Dynamic Darken + Fog Overlay */}
        <motion.div
          style={{
            opacity: reduced ? 0.35 : heroDarkenOverlay,
            backdropFilter: reduced ? 'none' : `blur(${heroBackdropBlur}px)`,
          }}
          className="pointer-events-none absolute inset-0 bg-[#2A1D26] z-15"
        />

        {/* ─── LAYER 5: Hero Main Headings & Content (Centered) ─── */}
        <motion.div
          style={{
            opacity: reduced ? (isPastHero ? 0 : 1) : heroTitleOpacity,
            scale: reduced ? 1 : heroTitleScale,
            y: reduced ? 0 : heroTitleY,
            pointerEvents: isPastHero ? 'none' : 'auto',
          }}
          className="relative z-20 max-w-4xl mx-auto px-4 text-center space-y-5 select-none"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF3E41]/20 border border-[#FF3E41]/50 text-[#FF3E41] text-xs font-mono font-bold tracking-widest uppercase shadow-xl"
          >
            <Zap className="w-3.5 h-3.5 fill-[#FF3E41]" />
            <span>ANNUAL CAMPUS FESTIVAL &bull; MARCH 13–15, 2026</span>
          </motion.div>

          {/* Glitch-in title reveal */}
          <GlitchText
            as="h1"
            className="text-6xl sm:text-8xl md:text-9xl font-display font-black text-white tracking-widest drop-shadow-[0_10px_35px_rgba(255,62,65,0.4)]"
            delay={50}
          >
            VIBRANCE 2026
          </GlitchText>

          <p className="text-sm sm:text-base text-white/80 font-mono max-w-2xl mx-auto leading-relaxed drop-shadow">
            Campus Fest Pass Reservations &bull; Real-time Seat Locking &bull; DBMS Concurrency Benchmark
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Strict 2PL ACID Concurrency
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF7099]" /> 6 Arena Stages &bull; 50k+ Passes
            </span>
          </div>

          {/* Direct CTA + Scroll indicator */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleScrollToLogin}
              className="px-6 py-3.5 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-mono font-bold text-xs shadow-2xl flex items-center gap-2 cursor-pointer"
            >
              <span>Get Passes &bull; Choose Persona</span>
              <ArrowDown className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="pt-4">
            <motion.button
              onClick={handleScrollToLogin}
              animate={reduced ? {} : { y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex flex-col items-center gap-1 text-[11px] font-mono text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <span>SCROLL DOWN TO ENTER PORTAL</span>
              <ChevronDown className="w-4 h-4 text-[#FF7099]" />
            </motion.button>
          </div>
        </motion.div>

        {/* ─── LAYER 6: Scroll-Linked Login Form Card ─── */}
        <motion.div
          style={{
            opacity: reduced ? (isPastHero ? 1 : 0) : loginOpacity,
            y: reduced ? 0 : loginY,
            scale: reduced ? 1 : loginScale,
            pointerEvents: isPastHero ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-30 flex items-center justify-center py-8 overflow-y-auto"
        >
          <LoginFormSection />
        </motion.div>
      </div>
    </div>
  );
};
""")

# ─── 2. Upgrade LoginPage.tsx with the full concert stage scenery! ───
w('src/pages/public/LoginPage.tsx', """import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { UserRole, StudentProfile, GateStaffProfile, AdminProfile } from '../../types';
import {
  MOCK_STUDENT_PROFILES,
  MOCK_STAFF_PROFILES,
  MOCK_ADMIN_PROFILES,
} from '../../data/mockEvents';
import { User, ShieldCheck, Cpu, ArrowRight, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AmbientBlobs } from '../../components/common/AmbientBlobs';
import { GlitchText } from '../../components/common/GlitchText';
import { CrowdSilhouettes } from '../../components/landing/CrowdSilhouettes';
import { StageLightBeams } from '../../components/landing/StageLightBeams';
import { ParticleHazeCanvas } from '../../components/landing/ParticleHazeCanvas';

export const LoginPage: React.FC = () => {
  const { loginAsStudent, loginAsGateStaff, loginAsAdmin } = useFest();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [customName, setCustomName] = useState('');
  const [customIdentifier, setCustomIdentifier] = useState('');
  const [customDept, setCustomDept] = useState('');
  const [pendingSelect, setPendingSelect] = useState<string | null>(null);

  const handleQuickProfileLogin = (
    profile: StudentProfile | GateStaffProfile | AdminProfile,
    role: UserRole
  ) => {
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
    const name =
      customName.trim() ||
      (selectedRole === 'student'
        ? 'Student Attendee'
        : selectedRole === 'gate_staff'
        ? 'Gate Security Officer'
        : 'System Admin');
    const identifier =
      customIdentifier.trim() ||
      (selectedRole === 'student'
        ? 'RA2111003010142'
        : selectedRole === 'gate_staff'
        ? 'STF-GATE-01'
        : 'FAC-DBMS-001');

    if (selectedRole === 'student') {
      loginAsStudent(name, identifier, customDept || 'Engineering', '3rd Year');
      navigate('/events', { replace: true });
    } else if (selectedRole === 'gate_staff') {
      loginAsGateStaff(name, identifier, 'Gate A');
      navigate('/verify', { replace: true });
    } else if (selectedRole === 'admin') {
      loginAsAdmin(name, identifier, customDept || 'Computer Science');
      navigate('/admin', { replace: true });
    }
  };

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
    {
      role: 'student',
      label: 'STUDENT ATTENDEE',
      icon: <User className="w-6 h-6" />,
      desc: 'Access event catalog, reserve seats, manage bookings & digital passes',
      color: '#FF3E41',
    },
    {
      role: 'gate_staff',
      label: 'GATE SECURITY',
      icon: <ShieldCheck className="w-6 h-6" />,
      desc: 'Real-time ticket verification console & check-in audit trail',
      color: '#DF367C',
    },
    {
      role: 'admin',
      label: 'FACULTY / ADMIN',
      icon: <Cpu className="w-6 h-6" />,
      desc: 'DBMS Concurrency Lab, event inventory management & full audit access',
      color: '#FF7099',
    },
  ];

  const profilesForRole =
    selectedRole === 'student'
      ? MOCK_STUDENT_PROFILES
      : selectedRole === 'gate_staff'
      ? MOCK_STAFF_PROFILES
      : MOCK_ADMIN_PROFILES;

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-[#2A1D26] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Full Stage Concert Backdrops */}
      <AmbientBlobs variant="login" />
      <StageLightBeams />
      <ParticleHazeCanvas />
      <CrowdSilhouettes />

      {/* Dimmed backdrop filter */}
      <div className="pointer-events-none absolute inset-0 bg-[#2A1D26]/75 backdrop-blur-[6px] z-15" />

      <div className="relative z-20 w-full max-w-5xl my-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Experience Full Landing Stage</span>
            </Link>
          </div>

          <GlitchText
            as="h1"
            className="text-5xl sm:text-7xl font-display font-black text-white tracking-widest"
            delay={50}
          >
            VIBRANCE 2026
          </GlitchText>
          <p className="text-white/60 text-xs sm:text-sm font-mono mt-2">
            Annual College Fest &bull; Ticket Booking &amp; DBMS Concurrency Platform
          </p>
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
                      ? 'border-[var(--c)] bg-[var(--c)]/15 shadow-lg'
                      : 'border-white/10 bg-[#4C3549]/90 hover:border-white/25'
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
                  <div className="mb-2" style={{ color: selectedRole === role ? color : '#ffffff99' }}>
                    {icon}
                  </div>
                  <div
                    className="text-[10px] font-mono font-black uppercase tracking-wider"
                    style={{ color: selectedRole === role ? color : 'rgba(255,255,255,0.7)' }}
                  >
                    {label}
                  </div>
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
            <div className="bg-[#4C3549]/95 border border-white/15 rounded-3xl p-5 space-y-3 shadow-2xl backdrop-blur-md">
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
                      onClick={() => handleQuickProfileLogin(profile, selectedRole)}
                      className="w-full text-left p-3.5 rounded-2xl bg-[#2A1D26]/90 hover:bg-[#3a2434] border border-white/10 hover:border-white/25 transition-colors flex items-center justify-between group cursor-pointer"
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
            className="lg:col-span-2 bg-[#4C3549]/95 border border-white/15 rounded-3xl p-6 space-y-5 flex flex-col justify-between shadow-2xl backdrop-blur-md"
          >
            <div>
              <h2 className="text-lg font-black text-white font-display tracking-wide mb-1">
                CUSTOM LOGIN
              </h2>
              <p className="text-[11px] text-white/60 font-mono">Enter your own credentials</p>
            </div>
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/60 uppercase">Your Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Priya Nair"
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/60 uppercase">
                  {selectedRole === 'student' ? 'Reg. Number' : 'Staff / Employee ID'}
                </label>
                <input
                  type="text"
                  value={customIdentifier}
                  onChange={(e) => setCustomIdentifier(e.target.value)}
                  placeholder={selectedRole === 'student' ? 'RA2111003010142' : 'STF-GATE-01'}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/60 uppercase">Department</label>
                <input
                  type="text"
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  placeholder="Computer Science & Engineering"
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold font-mono text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  Enter as{' '}
                  {selectedRole === 'student'
                    ? 'Student'
                    : selectedRole === 'gate_staff'
                    ? 'Gate Staff'
                    : 'Admin'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
            <div className="text-center">
              <Link to="/register" className="text-[11px] font-mono text-[#FF7099] hover:underline">
                New student? Register here &rarr;
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
""")

print('Landing and Login visibility update script ready.')

