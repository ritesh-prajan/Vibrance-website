import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { UserRole, StudentProfile, GateStaffProfile, AdminProfile } from '../../types';
import {
  MOCK_STUDENT_PROFILES,
  MOCK_STAFF_PROFILES,
  MOCK_ADMIN_PROFILES,
} from '../../data/mockEvents';
import { User, ShieldCheck, Cpu, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AmbientBlobs } from '../../components/common/AmbientBlobs';
import { GlitchText } from '../../components/common/GlitchText';
import { CrowdSilhouettes } from '../../components/landing/CrowdSilhouettes';
import { StageLightBeams } from '../../components/landing/StageLightBeams';
import { ParticleHazeCanvas } from '../../components/landing/ParticleHazeCanvas';
import AuroraBackground from '../../components/ui/aurora-background';

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
        ? '22BCE1999'
        : selectedRole === 'gate_staff'
        ? 'STAFF-001'
        : 'ADMIN-SYS');

    if (selectedRole === 'student') {
      loginAsStudent(name, identifier, customDept || 'SCOPE');
      navigate('/events', { replace: true });
    } else if (selectedRole === 'gate_staff') {
      loginAsGateStaff(name, identifier, customDept || 'Security');
      navigate('/verify', { replace: true });
    } else {
      loginAsAdmin(name, identifier, customDept || 'Fest Operations');
      navigate('/admin', { replace: true });
    }
  };

  const roles: {
    role: UserRole;
    label: string;
    icon: React.ReactNode;
    desc: string;
    color: string;
  }[] = [
    {
      role: 'student',
      label: 'Student',
      icon: <User className="w-5 h-5" />,
      desc: 'Browse events & book seats',
      color: '#FF3E41',
    },
    {
      role: 'gate_staff',
      label: 'Gate Staff',
      icon: <ShieldCheck className="w-5 h-5" />,
      desc: 'Scan QR passes at gates',
      color: '#DF367C',
    },
    {
      role: 'admin',
      label: 'Admin',
      icon: <Cpu className="w-5 h-5" />,
      desc: 'DBMS concurrency lab & analytics',
      color: '#883955',
    },
  ];

  const currentProfiles =
    selectedRole === 'student'
      ? MOCK_STUDENT_PROFILES
      : selectedRole === 'gate_staff'
      ? MOCK_STAFF_PROFILES
      : MOCK_ADMIN_PROFILES;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <AuroraBackground
        className="fixed inset-0 w-full h-full pointer-events-none"
        starCount={70}
        pulseDuration={10}
        ariaLabel="Vibrance aurora atmosphere"
      />
      <div className="min-h-screen text-[#F3EDF2] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans z-10">
        <AmbientBlobs />
        <ParticleHazeCanvas />
        <StageLightBeams />
        <CrowdSilhouettes />

        <div className="max-w-4xl w-full mx-auto space-y-8 relative z-10">
          {/* Brand Header with Centered Official Vibrance Logo */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#FF3E41] via-[#DF367C] to-[#FF7099] blur-md opacity-70 animate-pulse pointer-events-none" />
              <img
                src="/vibrance-logo.png"
                alt="VIT Chennai Vibrance Logo"
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-2 ring-white/30 bg-black shadow-2xl"
              />
            </div>

            <div>
              <GlitchText
                as="h1"
                className="text-4xl sm:text-6xl font-display font-black text-white tracking-widest"
                delay={50}
              >
                VIBRANCE 2026
              </GlitchText>
              <p className="text-white/60 text-xs sm:text-sm font-mono mt-1">
                VIT Chennai Annual Cultural Fest &bull; Strict 2PL ACID Concurrency Engine
              </p>
            </div>
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
                      />
                    )}
                    <div className="flex items-center gap-2 mb-1" style={{ color }}>
                      {icon}
                      <span className="font-bold text-sm text-white font-mono">{label}</span>
                    </div>
                    <p className="text-[11px] text-white/50 leading-tight">{desc}</p>
                  </motion.button>
                ))}
              </motion.div>

              {/* Persona Profiles */}
              <div className="bg-[#4C3549]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/60 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF7099]" />
                    SELECT PRESET TEST PERSONA
                  </span>
                  <span className="text-[10px] font-mono text-white/40 uppercase">1-Click Auto Login</span>
                </div>

                <div className="space-y-2.5">
                  {currentProfiles.map((p) => {
                    const isPending = pendingSelect === p.id;
                    return (
                      <motion.button
                        key={p.id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickProfileLogin(p, selectedRole)}
                        className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                          isPending
                            ? 'border-[#FF3E41] bg-[#FF3E41]/20'
                            : 'border-white/10 bg-[#2A1D26]/70 hover:border-white/30 hover:bg-[#2A1D26]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF3E41] to-[#DF367C] text-white font-bold flex items-center justify-center text-sm shadow-md">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{p.name}</div>
                            <div className="text-xs text-white/50 font-mono">
                              {p.regNumber} &bull; {p.department}
                              {'year' in p && ` &bull; Yr ${p.year}`}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPending ? (
                            <CheckCircle2 className="w-5 h-5 text-[#FF3E41] animate-spin" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Custom Login Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#4C3549]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4 h-full flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-white/60 block mb-1">MANUAL CREDENTIALS</span>
                  <h2 className="text-lg font-bold text-white font-display">Sign In as {roles.find((r) => r.role === selectedRole)?.label}</h2>
                  <p className="text-xs text-white/50 mt-1">
                    Enter custom details to instantiate an active DBMS session.
                  </p>

                  <form onSubmit={handleCustomLogin} className="space-y-3.5 mt-5">
                    <div>
                      <label className="block text-[11px] font-mono text-white/60 mb-1">FULL NAME</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF3E41]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-white/60 mb-1">
                        {selectedRole === 'student' ? 'REGISTRATION NUMBER' : 'EMPLOYEE ID / BADGE'}
                      </label>
                      <input
                        type="text"
                        placeholder={selectedRole === 'student' ? 'e.g. 22BCE1001' : 'e.g. STAFF-99'}
                        value={customIdentifier}
                        onChange={(e) => setCustomIdentifier(e.target.value)}
                        className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF3E41]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-white/60 mb-1">DEPARTMENT / SCHOOL</label>
                      <input
                        type="text"
                        placeholder="e.g. SCOPE, SENSE, Operations"
                        value={customDept}
                        onChange={(e) => setCustomDept(e.target.value)}
                        className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF3E41]"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-[#FF3E41] to-[#DF367C] text-white font-bold text-xs font-mono shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Enter Festival Platform</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </form>
                </div>

                <div className="pt-4 border-t border-white/10 text-center">
                  <Link to="/register" className="text-xs text-[#FF7099] hover:underline font-mono">
                    Register new student profile &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
