import React, { useState } from 'react';
import { useFest } from '../context/FestContext';
import { MOCK_STUDENT_PROFILES, MOCK_ADMIN_PROFILES } from '../data/mockEvents';
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Cpu,
  Ticket,
  ArrowRight,
  User,
  Key,
  Building,
  CheckCircle2,
  Lock,
  Flame,
  Layers,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess?: (role: 'STUDENT' | 'ADMIN') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { loginAsStudent, loginAsAdmin } = useFest();

  const [activePortal, setActivePortal] = useState<'STUDENT' | 'ADMIN'>('STUDENT');

  // Student Form State
  const [studentName, setStudentName] = useState('Rahul Sharma');
  const [studentReg, setStudentReg] = useState('RA2111003010142');
  const [studentDept, setStudentDept] = useState('Computer Science & Engineering');

  // Admin Form State
  const [adminName, setAdminName] = useState('Dr. Ramesh Sundaram');
  const [adminStaffId, setAdminStaffId] = useState('FAC-DBMS-702');
  const [adminDept, setAdminDept] = useState('DBMS Lab Coordinator & Tech Lead');
  const [adminAccessKey, setAdminAccessKey] = useState('VIB26-DBMS-AUTH');

  // Quick Select Preset
  const handleSelectStudentPreset = (preset: typeof MOCK_STUDENT_PROFILES[0]) => {
    setStudentName(preset.name);
    setStudentReg(preset.regNumber);
    setStudentDept(preset.department);
  };

  const handleSelectAdminPreset = (preset: typeof MOCK_ADMIN_PROFILES[0]) => {
    setAdminName(preset.name);
    setAdminStaffId(preset.regNumber);
    setAdminDept(preset.department);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentReg.trim()) return;
    loginAsStudent(studentName, studentReg, studentDept);
    if (onLoginSuccess) {
      onLoginSuccess('STUDENT');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminStaffId.trim()) return;
    loginAsAdmin(adminName, adminStaffId, adminDept);
    if (onLoginSuccess) {
      onLoginSuccess('ADMIN');
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e2e8f0] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ccff00]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#00e5ff]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl z-10 space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="text-white/70">Vibrance 2026</span>
            <span className="text-white/30">•</span>
            <span className="text-[#00e5ff] font-semibold">Campus Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Festival Pass & System Portal
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto leading-relaxed">
            Select your portal below to sign in. Students access pass reservations and seat bookings; administrators access the system transaction lab and telemetry.
          </p>
        </div>

        {/* Portal Switcher Tabs */}
        <div className="flex justify-center">
          <div className="bg-[#121620] p-1.5 rounded-2xl border border-white/15 flex items-center gap-2 max-w-md w-full shadow-2xl">
            <button
              id="tab-student-portal"
              onClick={() => setActivePortal('STUDENT')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activePortal === 'STUDENT'
                  ? 'bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </button>

            <button
              id="tab-admin-portal"
              onClick={() => setActivePortal('ADMIN')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activePortal === 'ADMIN'
                  ? 'bg-[#00e5ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.3)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin / Faculty Portal</span>
            </button>
          </div>
        </div>

        {/* Dynamic Card based on Active Portal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left / Info Side */}
          <div className="lg:col-span-5 bg-[#0e121a] border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-4">
              {activePortal === 'STUDENT' ? (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00] flex items-center justify-center">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#ccff00] font-bold">
                      Student Access
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                      Festival Pass Reservation
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                    Book festival concert passes, select tiered seats (VIP, Gold, Regular) with 3-minute temporary holds, and generate digital QR e-tickets.
                  </p>

                  <div className="pt-2 space-y-2 text-xs text-white/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                      <span>Live interactive seat-map selection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                      <span>3-minute exclusive hold lease timer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                      <span>Digital QR passes with download & cancel</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-[#00e5ff]/15 border border-[#00e5ff]/30 text-[#00e5ff] flex items-center justify-center">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#00e5ff] font-bold">
                      Faculty & Admin Access
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                      System Lab & Telemetry
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                    Execute high-concurrency transaction stress tests, compare 2PL locking protocols vs no-locking anomalies, and monitor real-time audit logs.
                  </p>

                  <div className="pt-2 space-y-2 text-xs text-white/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00e5ff]" />
                      <span>Transaction & locking simulator engine</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00e5ff]" />
                      <span>Side-by-side serializability benchmarks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00e5ff]" />
                      <span>Live transaction telemetry & audit stream</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Demo Presets */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                Quick 1-Click Profile Presets:
              </p>
              <div className="space-y-1.5">
                {activePortal === 'STUDENT' ? (
                  MOCK_STUDENT_PROFILES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectStudentPreset(p)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        studentReg === p.regNumber
                          ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 font-semibold'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-[10px] text-white/50">{p.department}</span>
                      </div>
                      <span className="text-[10px] font-mono">{p.regNumber}</span>
                    </button>
                  ))
                ) : (
                  MOCK_ADMIN_PROFILES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectAdminPreset(p)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        adminStaffId === p.regNumber
                          ? 'bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/30 font-semibold'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-[10px] text-white/50">{p.department}</span>
                      </div>
                      <span className="text-[10px] font-mono">{p.regNumber}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right / Form Side */}
          <div className="lg:col-span-7 bg-[#121620] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {activePortal === 'STUDENT' ? (
              <form onSubmit={handleStudentSubmit} className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">Student Sign In</h3>
                    <p className="text-xs text-white/50">Enter your university student credentials</p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
                    STUDENT
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-white/70 font-medium mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#ccff00]" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080a0f] border border-white/15 text-white focus:outline-none focus:border-[#ccff00] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-medium mb-1.5 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#ccff00]" /> Student Registration Number
                    </label>
                    <input
                      type="text"
                      required
                      value={studentReg}
                      onChange={(e) => setStudentReg(e.target.value)}
                      placeholder="e.g. RA2111003010142"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080a0f] border border-white/15 text-white focus:outline-none focus:border-[#ccff00] font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-medium mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#ccff00]" /> Department / Major
                    </label>
                    <select
                      value={studentDept}
                      onChange={(e) => setStudentDept(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080a0f] border border-white/15 text-white focus:outline-none focus:border-[#ccff00] text-sm"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="School of Management">School of Management</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="btn-login-student-submit"
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-sm transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Sign In as Student & Browse Passes</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-center text-white/40 font-mono">
                  Session will be authenticated for seat bookings and digital passes.
                </p>
              </form>
            ) : (
              <form onSubmit={handleAdminSubmit} className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">Admin & Faculty Sign In</h3>
                    <p className="text-xs text-white/50">Enter faculty staff credentials & authorization key</p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30">
                    FACULTY / ADMIN
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-white/70 font-medium mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#00e5ff]" /> Faculty / Admin Name
                    </label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Dr. Ramesh Sundaram"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080a0f] border border-white/15 text-white focus:outline-none focus:border-[#00e5ff] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-medium mb-1.5 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#00e5ff]" /> Faculty Staff ID
                    </label>
                    <input
                      type="text"
                      required
                      value={adminStaffId}
                      onChange={(e) => setAdminStaffId(e.target.value)}
                      placeholder="e.g. FAC-DBMS-702"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080a0f] border border-white/15 text-white focus:outline-none focus:border-[#00e5ff] font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-medium mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#00e5ff]" /> Designation / Lab Role
                    </label>
                    <input
                      type="text"
                      value={adminDept}
                      onChange={(e) => setAdminDept(e.target.value)}
                      placeholder="e.g. DBMS Lab Coordinator & Event Tech Lead"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080a0f] border border-white/15 text-white focus:outline-none focus:border-[#00e5ff] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-medium mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#00e5ff]" /> Authorization Access Key
                    </label>
                    <input
                      type="password"
                      value={adminAccessKey}
                      onChange={(e) => setAdminAccessKey(e.target.value)}
                      placeholder="Enter access key"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080a0f] border border-white/15 text-white focus:outline-none focus:border-[#00e5ff] font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="btn-login-admin-submit"
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#00e5ff] hover:bg-[#00cce6] text-black font-bold text-sm transition-all shadow-[0_0_25px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Authenticate & Launch System Lab</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-center text-white/40 font-mono">
                  Administrator privileges grant full control over the transaction engine & telemetry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
