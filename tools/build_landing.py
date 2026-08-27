import os

def w(p, c):
    os.makedirs(os.path.dirname(os.path.abspath(p)), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c.strip() + "\n")
    print(f'Wrote {p}')

# ─── 1. CrowdSilhouettes.tsx ───
w('src/components/landing/CrowdSilhouettes.tsx', """import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

// Distinct SVG crowd human silhouette icons with varied concert poses
const SILHOUETTE_PATHS = [
  // 0. Double hands raised high, cheering
  "M 30 140 L 30 90 Q 30 70 42 62 L 32 30 Q 30 24 35 20 Q 40 18 44 24 L 54 54 Q 60 48 68 48 Q 76 48 82 54 L 92 24 Q 96 18 101 20 Q 106 24 104 30 L 94 62 Q 106 70 106 90 L 106 140 Z M 68 18 A 12 12 0 1 0 68 42 A 12 12 0 1 0 68 18 Z",
  // 1. Right fist pumped up, head bobbing
  "M 25 140 L 25 85 Q 25 65 38 58 L 44 64 L 40 85 L 50 85 Q 55 52 65 52 Q 74 52 80 58 L 98 20 Q 103 14 108 17 Q 112 21 109 28 L 96 66 Q 108 72 108 92 L 108 140 Z M 65 20 A 13 13 0 1 0 65 46 A 13 13 0 1 0 65 20 Z",
  // 2. Both arms angled outwards rocking out (rock horns pose)
  "M 20 140 L 20 88 Q 20 68 34 60 L 16 28 Q 12 22 17 18 Q 23 16 26 22 L 42 54 Q 56 46 70 46 Q 84 46 98 54 L 114 22 Q 117 16 123 18 Q 128 22 124 28 L 106 60 Q 120 68 120 88 L 120 140 Z M 70 14 A 14 14 0 1 0 70 42 A 14 14 0 1 0 70 14 Z",
  // 3. Side profile, left arm pointing forward/up
  "M 28 140 L 28 80 Q 28 62 40 54 L 18 20 Q 14 14 20 10 Q 25 8 28 15 L 48 48 Q 58 44 68 44 Q 80 44 88 52 L 96 74 L 104 140 Z M 66 16 A 12 12 0 1 0 66 40 A 12 12 0 1 0 66 16 Z",
  // 4. Clapping hands over head
  "M 26 140 L 26 86 Q 26 66 40 58 L 52 24 Q 56 16 62 16 Q 66 16 70 24 L 84 58 Q 98 66 98 86 L 98 140 Z M 62 18 A 12 12 0 1 0 62 42 A 12 12 0 1 0 62 18 Z",
  // 5. Jump / celebratory wide pose
  "M 22 140 L 22 84 Q 22 64 36 56 L 14 18 Q 10 12 16 8 Q 21 6 25 12 L 46 48 Q 58 42 72 42 Q 86 42 98 48 L 119 12 Q 123 6 128 8 Q 134 12 130 18 L 108 56 Q 122 64 122 84 L 122 140 Z M 72 12 A 13 13 0 1 0 72 38 A 13 13 0 1 0 72 12 Z",
];

interface SilhouetteItem {
  id: number;
  pathIdx: number;
  xOffset: number; // in %
  scale: number;
  duration: number; // in seconds
  delay: number;
  yBounce: number;
  rotDeg: number;
  isBackRow?: boolean;
}

const CROWD_ITEMS: SilhouetteItem[] = [
  { id: 1, pathIdx: 0, xOffset: 2, scale: 0.95, duration: 0.52, delay: 0.05, yBounce: 12, rotDeg: 2.5 },
  { id: 2, pathIdx: 1, xOffset: 9, scale: 0.82, duration: 0.64, delay: 0.18, yBounce: 9, rotDeg: -2, isBackRow: true },
  { id: 3, pathIdx: 2, xOffset: 16, scale: 1.05, duration: 0.48, delay: 0.12, yBounce: 14, rotDeg: 3 },
  { id: 4, pathIdx: 5, xOffset: 24, scale: 0.86, duration: 0.68, delay: 0.28, yBounce: 10, rotDeg: -2.5, isBackRow: true },
  { id: 5, pathIdx: 4, xOffset: 31, scale: 1.0, duration: 0.55, delay: 0.0, yBounce: 11, rotDeg: 2 },
  { id: 6, pathIdx: 0, xOffset: 39, scale: 0.88, duration: 0.62, delay: 0.22, yBounce: 8, rotDeg: -1.5, isBackRow: true },
  { id: 7, pathIdx: 1, xOffset: 46, scale: 1.1, duration: 0.46, delay: 0.08, yBounce: 15, rotDeg: 3.5 },
  { id: 8, pathIdx: 3, xOffset: 54, scale: 0.9, duration: 0.58, delay: 0.15, yBounce: 10, rotDeg: -2, isBackRow: true },
  { id: 9, pathIdx: 2, xOffset: 62, scale: 1.02, duration: 0.5, delay: 0.32, yBounce: 13, rotDeg: 2.5 },
  { id: 10, pathIdx: 4, xOffset: 70, scale: 0.85, duration: 0.66, delay: 0.1, yBounce: 9, rotDeg: -3, isBackRow: true },
  { id: 11, pathIdx: 5, xOffset: 77, scale: 1.08, duration: 0.49, delay: 0.25, yBounce: 14, rotDeg: 3 },
  { id: 12, pathIdx: 0, xOffset: 85, scale: 0.88, duration: 0.6, delay: 0.04, yBounce: 10, rotDeg: -2, isBackRow: true },
  { id: 13, pathIdx: 1, xOffset: 92, scale: 1.0, duration: 0.54, delay: 0.16, yBounce: 12, rotDeg: 2.5 },
];

export const CrowdSilhouettes: React.FC = () => {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[38vh] min-h-[220px] max-h-[380px] w-full overflow-hidden select-none z-10">
      {/* Subtle stage floor / crowd gradient anchor */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#160E15] via-[#1F141E] to-transparent z-20" />

      {/* Back row silhouettes (darker, slightly smaller, creates visual depth) */}
      <div className="absolute inset-x-0 bottom-6 h-full flex justify-between">
        {CROWD_ITEMS.filter((item) => item.isBackRow).map((item) => (
          <motion.div
            key={`back-${item.id}`}
            style={{
              position: 'absolute',
              left: `${item.xOffset}%`,
              bottom: 0,
              transformOrigin: 'bottom center',
            }}
            animate={
              reduced
                ? {}
                : {
                    y: [0, -item.yBounce, 0],
                    rotate: [0, item.rotDeg, 0, -item.rotDeg, 0],
                  }
            }
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              viewBox="0 0 140 140"
              className="w-24 sm:w-32 md:w-36 h-auto drop-shadow-md"
              style={{
                fill: '#241723',
                opacity: 0.75,
                transform: `scale(${item.scale})`,
              }}
            >
              <path d={SILHOUETTE_PATHS[item.pathIdx]} />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Front row silhouettes (crisp dark tone, high energy bob/sway) */}
      <div className="absolute inset-x-0 bottom-0 h-full flex justify-between z-10">
        {CROWD_ITEMS.filter((item) => !item.isBackRow).map((item) => (
          <motion.div
            key={`front-${item.id}`}
            style={{
              position: 'absolute',
              left: `${item.xOffset}%`,
              bottom: 0,
              transformOrigin: 'bottom center',
            }}
            animate={
              reduced
                ? {}
                : {
                    y: [0, -item.yBounce, 2, -item.yBounce * 0.7, 0],
                    rotate: [0, item.rotDeg, -item.rotDeg * 0.5, item.rotDeg * 0.8, 0],
                  }
            }
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              viewBox="0 0 140 140"
              className="w-28 sm:w-36 md:w-44 h-auto drop-shadow-2xl"
              style={{
                fill: '#180F17',
                transform: `scale(${item.scale})`,
              }}
            >
              <path d={SILHOUETTE_PATHS[item.pathIdx]} />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
""")

# ─── 2. StageLightBeams.tsx ───
w('src/components/landing/StageLightBeams.tsx', """import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface BeamConfig {
  id: number;
  origin: string;
  left?: string;
  right?: string;
  top: string;
  width: number;
  height: number;
  color: string;
  initialRotate: number;
  sweepRange: [number, number];
  duration: number;
  delay: number;
}

const BEAMS: BeamConfig[] = [
  // Left stage moving head (Red accent)
  {
    id: 1,
    origin: 'top center',
    left: '10%',
    top: '-5%',
    width: 240,
    height: 900,
    color: '#FF3E41',
    initialRotate: -25,
    sweepRange: [-45, 15],
    duration: 7.5,
    delay: 0,
  },
  // Left-center beam (Rose Punch)
  {
    id: 2,
    origin: 'top center',
    left: '28%',
    top: '-5%',
    width: 190,
    height: 850,
    color: '#DF367C',
    initialRotate: -10,
    sweepRange: [-25, 30],
    duration: 9.2,
    delay: 1.2,
  },
  // Right-center beam (Highlight pink/white)
  {
    id: 3,
    origin: 'top center',
    right: '28%',
    top: '-5%',
    width: 200,
    height: 850,
    color: '#FF7099',
    initialRotate: 10,
    sweepRange: [-30, 25],
    duration: 8.4,
    delay: 2.5,
  },
  // Right stage moving head (Red accent)
  {
    id: 4,
    origin: 'top center',
    right: '10%',
    top: '-5%',
    width: 250,
    height: 920,
    color: '#FF3E41',
    initialRotate: 25,
    sweepRange: [-15, 45],
    duration: 6.8,
    delay: 0.8,
  },
];

export const StageLightBeams: React.FC = () => {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {BEAMS.map((beam) => (
        <motion.div
          key={beam.id}
          style={{
            position: 'absolute',
            left: beam.left,
            right: beam.right,
            top: beam.top,
            width: beam.width,
            height: beam.height,
            transformOrigin: beam.origin,
            background: `linear-gradient(180deg, ${beam.color}44 0%, ${beam.color}18 45%, transparent 100%)`,
            clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
            mixBlendMode: 'screen',
            filter: 'blur(8px)',
            opacity: 0.85,
          }}
          animate={
            reduced
              ? { rotate: beam.initialRotate }
              : {
                  rotate: [beam.sweepRange[0], beam.sweepRange[1], beam.sweepRange[0]],
                  opacity: [0.65, 0.95, 0.65],
                }
          }
          transition={{
            duration: beam.duration,
            delay: beam.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
""")

# ─── 3. ParticleHazeCanvas.tsx ───
w('src/components/landing/ParticleHazeCanvas.tsx', """import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
}

const COLORS = [
  'rgba(255, 62, 65, ',   // #FF3E41
  'rgba(223, 54, 124, ',  // #DF367C
  'rgba(255, 112, 153, ', // #FF7099
  'rgba(255, 255, 255, ', // White dust highlight
];

export const ParticleHazeCanvas: React.FC<{ isPaused?: boolean }> = ({ isPaused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Responsive particle count (fewer on mobile for 60fps)
    const particleCount = width < 640 ? 20 : 36;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        speedY: -(Math.random() * 0.45 + 0.18),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        alphaSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reduced && !isPaused) {
          p.y += p.speedY;
          p.x += p.speedX;
          p.alpha += p.alphaSpeed;

          if (p.alpha <= 0.1 || p.alpha >= 0.8) {
            p.alphaSpeed = -p.alphaSpeed;
          }

          // Loop particles when they float off the top or sides
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.alpha))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.fill();
      }

      if (!isPaused) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isPaused, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full select-none z-5"
    />
  );
};
""")

# ─── 4. LoginFormSection.tsx ───
w('src/components/landing/LoginFormSection.tsx', """import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { UserRole, StudentProfile, GateStaffProfile, AdminProfile } from '../../types';
import {
  MOCK_STUDENT_PROFILES,
  MOCK_STAFF_PROFILES,
  MOCK_ADMIN_PROFILES,
} from '../../data/mockEvents';
import { User, ShieldCheck, Cpu, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginFormSection: React.FC = () => {
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
      icon: <User className="w-5 h-5" />,
      desc: 'Reserve passes, 3-min seat lease & digital tickets',
      color: '#FF3E41',
    },
    {
      role: 'gate_staff',
      label: 'GATE SECURITY',
      icon: <ShieldCheck className="w-5 h-5" />,
      desc: 'Real-time check-in scanner & access verification',
      color: '#DF367C',
    },
    {
      role: 'admin',
      label: 'FACULTY / ADMIN',
      icon: <Cpu className="w-5 h-5" />,
      desc: 'DBMS Concurrency Simulator & ACID telemetry',
      color: '#FF7099',
    },
  ];

  const profilesForRole =
    selectedRole === 'student'
      ? MOCK_STUDENT_PROFILES
      : selectedRole === 'gate_staff'
      ? MOCK_STAFF_PROFILES
      : MOCK_ADMIN_PROFILES;

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Header banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3E41]/20 border border-[#FF3E41]/40 text-[#FF3E41] text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
          GATEWAY AUTHENTICATION
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-wider">
          CHOOSE YOUR PERSONA OR SIGN IN
        </h2>
        <p className="text-white/60 text-xs font-mono mt-1">
          Select a 1-click test profile or enter custom credentials to enter the festival platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Role Selection + 1-Click Persona Cards */}
        <div className="lg:col-span-3 space-y-4">
          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-2.5">
            {roles.map(({ role, label, icon, desc, color }) => (
              <motion.button
                key={role}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedRole(role)}
                className={`relative p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  selectedRole === role
                    ? 'border-[var(--c)] bg-[var(--c)]/15 shadow-lg'
                    : 'border-white/10 bg-[#4C3549]/90 hover:border-white/25'
                }`}
                style={{ '--c': color } as React.CSSProperties}
              >
                <div className="mb-1.5" style={{ color: selectedRole === role ? color : '#ffffffaa' }}>
                  {icon}
                </div>
                <div
                  className="text-[10px] font-mono font-black uppercase tracking-wider"
                  style={{ color: selectedRole === role ? color : 'rgba(255,255,255,0.8)' }}
                >
                  {label}
                </div>
                <div className="text-[9px] text-white/50 mt-1 leading-tight line-clamp-2">{desc}</div>
                {selectedRole === role && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Quick 1-Click Fast Login Personas */}
          <div className="bg-[#4C3549]/95 border border-white/15 rounded-3xl p-4 sm:p-5 space-y-2.5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/60">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7099]" />
              <span>1-Click Fast Login Personas ({selectedRole.replace('_', ' ')}):</span>
            </div>

            <div className="space-y-2">
              {profilesForRole.map((profile) => (
                <motion.button
                  key={profile.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: pendingSelect === profile.id ? 0.95 : 0.98 }}
                  onClick={() => handleQuickProfileLogin(profile, selectedRole)}
                  className="w-full text-left p-3 rounded-2xl bg-[#2A1D26]/90 hover:bg-[#3d2435] border border-white/10 hover:border-white/25 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#4C3549] border border-white/15 text-white font-bold flex items-center justify-center text-xs">
                      {profile.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{profile.name}</div>
                      <div className="text-[10px] text-[#FF7099] font-mono">{profile.regNumber}</div>
                      <div className="text-[9px] text-white/50">{profile.department}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Custom Login Form Card */}
        <div className="lg:col-span-2 bg-[#4C3549]/95 border border-white/15 rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-2xl backdrop-blur-md">
          <div>
            <h3 className="text-base font-black text-white font-display tracking-wide mb-0.5">
              CUSTOM CREDENTIALS
            </h3>
            <p className="text-[10px] text-white/60 font-mono">Sign in with custom name and ID</p>
          </div>

          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-white/60 uppercase">Your Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Priya Nair"
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#FF3E41]"
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
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#FF3E41]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-white/60 uppercase">Department</label>
              <input
                type="text"
                value={customDept}
                onChange={(e) => setCustomDept(e.target.value)}
                placeholder="Computer Science & Engineering"
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#FF3E41]"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold font-mono text-xs transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <span>
                Enter as{' '}
                {selectedRole === 'student'
                  ? 'Student'
                  : selectedRole === 'gate_staff'
                  ? 'Gate Staff'
                  : 'Admin'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </form>

          <div className="text-center pt-2 border-t border-white/10">
            <Link to="/register" className="text-[10px] font-mono text-[#FF7099] hover:underline">
              New student attendee? Register here &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
""")

# ─── 5. LandingPage.tsx ─── full scroll-linked landing hero sequence
w('src/pages/public/LandingPage.tsx', """import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AmbientBlobs } from '../../components/common/AmbientBlobs';
import { GlitchText } from '../../components/common/GlitchText';
import { CrowdSilhouettes } from '../../components/landing/CrowdSilhouettes';
import { StageLightBeams } from '../../components/landing/StageLightBeams';
import { ParticleHazeCanvas } from '../../components/landing/ParticleHazeCanvas';
import { LoginFormSection } from '../../components/landing/LoginFormSection';
import { ChevronDown, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Scroll tracking across the 260vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track if hero is scrolled past to pause canvas particles
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setIsPastHero(latest > 0.85);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Section 1: Hero title & content transforms
  const heroTitleOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0]);
  const heroTitleScale = useTransform(scrollYProgress, [0, 0.32], [1, 0.86]);
  const heroTitleY = useTransform(scrollYProgress, [0, 0.32], [0, -45]);

  // Section 1: Stage & crowd visual layer dimming + fog rolling in
  const heroSceneOpacity = useTransform(scrollYProgress, [0, 0.45, 0.85], [1, 0.45, 0.15]);
  const heroDarkenOverlay = useTransform(scrollYProgress, [0, 0.55], [0, 0.82]);
  const heroBackdropBlur = useTransform(scrollYProgress, [0.15, 0.6], [0, 14]);

  // Section 2: Login card reveal
  const loginOpacity = useTransform(scrollYProgress, [0.38, 0.68], [0, 1]);
  const loginY = useTransform(scrollYProgress, [0.38, 0.68], [90, 0]);
  const loginScale = useTransform(scrollYProgress, [0.38, 0.68], [0.94, 1]);

  // Scroll down helper
  const handleScrollDown = () => {
    if (!containerRef.current) return;
    const scrollTarget = containerRef.current.scrollHeight * 0.72;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative bg-[#2A1D26] text-[#F3EDF2] min-h-[250vh]">
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* ─── LAYER 1: Ambient Gradient Blobs (Back) ─── */}
        <AmbientBlobs variant="login" />

        {/* ─── LAYER 2: Stage Sweeping Light Beams ─── */}
        <StageLightBeams />

        {/* ─── LAYER 3: Canvas Particle Haze Field (Front of beams) ─── */}
        <ParticleHazeCanvas isPaused={isPastHero} />

        {/* ─── LAYER 4: Energetic Crowd Silhouettes (Bottom third) ─── */}
        <CrowdSilhouettes />

        {/* Dynamic Darken + Fog Overlay (increases as user scrolls into login) */}
        <motion.div
          style={{
            opacity: reduced ? 0.4 : heroDarkenOverlay,
            backdropFilter: reduced ? 'none' : `blur(${heroBackdropBlur}px)`,
          }}
          className="pointer-events-none absolute inset-0 bg-[#2A1D26] z-15"
        />

        {/* ─── LAYER 5: Hero Main Headings & Content (Centered) ─── */}
        <motion.div
          style={{
            opacity: reduced ? 1 : heroTitleOpacity,
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

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Strict 2PL ACID Concurrency
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF7099]" /> 6 Arena Stages &bull; 50k+ Passes
            </span>
          </div>

          {/* Scroll down indicator button */}
          <div className="pt-8">
            <motion.button
              onClick={handleScrollDown}
              animate={reduced ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex flex-col items-center gap-1.5 text-xs font-mono text-[#FF7099] hover:text-white transition-colors cursor-pointer"
            >
              <span className="tracking-widest uppercase text-[10px] font-bold">
                SCROLL TO ENTER PASS PORTAL
              </span>
              <ChevronDown className="w-5 h-5 text-[#FF3E41]" />
            </motion.button>
          </div>
        </motion.div>

        {/* ─── LAYER 6: Scroll-Linked Login Form Card (Fades & slides up) ─── */}
        <motion.div
          style={{
            opacity: reduced ? 1 : loginOpacity,
            y: reduced ? 0 : loginY,
            scale: reduced ? 1 : loginScale,
            pointerEvents: 'auto',
          }}
          className="absolute inset-0 z-30 flex items-center justify-center py-6 overflow-y-auto"
        >
          <LoginFormSection />
        </motion.div>
      </div>
    </div>
  );
};
""")

# ─── 6. Update App.tsx to route "/" to LandingPage ───
w('src/App.tsx', """import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FestProvider, useFest } from './context/FestContext';

// Layout & Route Guards
import { AppLayout } from './components/layout/AppLayout';
import { RequireAuth } from './components/layout/RequireAuth';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Student Pages
import { EventsCatalogPage } from './pages/student/EventsCatalogPage';
import { EventDetailPage } from './pages/student/EventDetailPage';
import { SeatSelectionPage } from './pages/student/SeatSelectionPage';
import { CheckoutPage } from './pages/student/CheckoutPage';
import { TicketPage } from './pages/student/TicketPage';
import { MyBookingsPage } from './pages/student/MyBookingsPage';
import { ProfilePage } from './pages/student/ProfilePage';

// Gate Staff Pages
import { VerifyConsolePage } from './pages/staff/VerifyConsolePage';
import { VerifyHistoryPage } from './pages/staff/VerifyHistoryPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminConcurrencyLabPage } from './pages/admin/AdminConcurrencyLabPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

const RootRedirect: React.FC = () => {
  const { currentUser } = useFest();

  if (!currentUser) {
    return <LandingPage />;
  }

  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (currentUser.role === 'gate_staff') {
    return <Navigate to="/verify" replace />;
  }

  return <Navigate to="/events" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root Route — Full-Bleed Animated Landing with Scroll-Linked Login */}
      <Route path="/" element={<RootRedirect />} />

      {/* Standalone Public Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Protected Flow */}
      <Route
        path="/events"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <EventsCatalogPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/events/:eventId"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <EventDetailPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/events/:eventId/seats"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <SeatSelectionPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/checkout/:eventId"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <CheckoutPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/ticket/:bookingId"
        element={
          <RequireAuth allowedRoles={['student', 'admin', 'gate_staff']}>
            <AppLayout>
              <TicketPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <MyBookingsPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth allowedRoles={['student']}>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </RequireAuth>
        }
      />

      {/* Gate Staff Protected Flow */}
      <Route
        path="/verify"
        element={
          <RequireAuth allowedRoles={['gate_staff']}>
            <AppLayout>
              <VerifyConsolePage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/verify/history"
        element={
          <RequireAuth allowedRoles={['gate_staff']}>
            <AppLayout>
              <VerifyHistoryPage />
            </AppLayout>
          </RequireAuth>
        }
      />

      {/* Admin Protected Flow */}
      <Route
        path="/admin"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AppLayout>
              <AdminDashboardPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/events"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AppLayout>
              <AdminEventsPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/concurrency-lab"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AppLayout>
              <AdminConcurrencyLabPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AppLayout>
              <AdminAuditLogsPage />
            </AppLayout>
          </RequireAuth>
        }
      />

      {/* 404 Catch All */}
      <Route
        path="*"
        element={
          <AppLayout>
            <NotFoundPage />
          </AppLayout>
        }
      />
    </Routes>
  );
};

export function App() {
  return (
    <FestProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </FestProvider>
  );
}

export default App;
""")

print('All landing page files generated successfully.')

