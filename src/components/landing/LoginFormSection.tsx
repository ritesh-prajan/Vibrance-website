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
