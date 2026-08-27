import React, { useState } from 'react';
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
