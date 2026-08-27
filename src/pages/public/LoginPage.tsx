import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { UserRole, StudentProfile, GateStaffProfile, AdminProfile } from '../../types';
import {
  MOCK_STUDENT_PROFILES,
  MOCK_STAFF_PROFILES,
  MOCK_ADMIN_PROFILES,
} from '../../data/mockEvents';
import {
  User,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginAsStudent, loginAsGateStaff, loginAsAdmin } = useFest();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [customName, setCustomName] = useState('');
  const [customIdentifier, setCustomIdentifier] = useState('');
  const [customDept, setCustomDept] = useState('');

  const handleQuickProfileLogin = (
    profile: StudentProfile | GateStaffProfile | AdminProfile,
    role: UserRole
  ) => {
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
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customName.trim() || (selectedRole === 'student' ? 'Student Attendee' : selectedRole === 'gate_staff' ? 'Gate Security Officer' : 'System Admin');
    const identifier = customIdentifier.trim() || (selectedRole === 'student' ? 'RA2111003010142' : selectedRole === 'gate_staff' ? 'STF-GATE-01' : 'FAC-DBMS-001');

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

  return (
    <div className="min-h-screen bg-[#2A1D26] text-[#F3EDF2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF3E41] via-[#DF367C] to-[#883955] text-white font-display font-black text-2xl shadow-xl mb-3">
          V
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-wide">
          VIBRANCE 2026
        </h1>
        <p className="mt-1 text-xs text-[#FF7099] font-mono">
          Annual College Fest Ticketing &amp; DBMS Lab Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-white/80 uppercase tracking-wider">
              Select Your Role:
            </label>
            <div className="grid grid-cols-3 gap-2 bg-[#2A1D26] p-1.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-[#FF3E41] text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('gate_staff')}
                className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'gate_staff'
                    ? 'bg-[#DF367C] text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Gate Staff</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-[#883955] text-white shadow-md border border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Admin / Lab</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/70 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7099]" />
                <span>1-Click Fast Login Persona:</span>
              </span>
              <span className="text-[10px] text-white/40 uppercase">Pre-seeded demo user</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedRole === 'student' &&
                MOCK_STUDENT_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleQuickProfileLogin(p, 'student')}
                    className="text-left p-3 rounded-xl bg-[#2A1D26] hover:bg-[#883955] border border-white/10 hover:border-[#883955] transition-colors group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{p.name}</span>
                      <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-white" />
                    </div>
                    <div className="text-[10px] font-mono text-[#FF7099] mt-0.5">{p.regNumber}</div>
                    <div className="text-[10px] text-white/50 truncate mt-0.5">{p.department}</div>
                  </button>
                ))}

              {selectedRole === 'gate_staff' &&
                MOCK_STAFF_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleQuickProfileLogin(p, 'gate_staff')}
                    className="text-left p-3 rounded-xl bg-[#2A1D26] hover:bg-[#883955] border border-white/10 hover:border-[#883955] transition-colors group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{p.name}</span>
                      <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-white" />
                    </div>
                    <div className="text-[10px] font-mono text-[#FF7099] mt-0.5">{p.regNumber}</div>
                    <div className="text-[10px] text-white/50 truncate mt-0.5">{p.department}</div>
                  </button>
                ))}

              {selectedRole === 'admin' &&
                MOCK_ADMIN_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleQuickProfileLogin(p, 'admin')}
                    className="text-left p-3 rounded-xl bg-[#2A1D26] hover:bg-[#883955] border border-white/10 hover:border-[#883955] transition-colors group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{p.name}</span>
                      <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-white" />
                    </div>
                    <div className="text-[10px] font-mono text-[#FF7099] mt-0.5">{p.regNumber}</div>
                    <div className="text-[10px] text-white/50 truncate mt-0.5">{p.department}</div>
                  </button>
                ))}
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#4C3549] text-white/50 font-mono text-[10px] uppercase">
                Or Custom Credentials
              </span>
            </div>
          </div>

          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder={
                  selectedRole === 'student'
                    ? 'e.g. Rahul Sharma'
                    : selectedRole === 'gate_staff'
                    ? 'e.g. Officer Rajesh Menon'
                    : 'e.g. Dr. Ramesh Sundaram'
                }
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  {selectedRole === 'student'
                    ? 'Registration Number'
                    : selectedRole === 'gate_staff'
                    ? 'Gate Staff ID'
                    : 'Faculty / Admin ID'}
                </label>
                <input
                  type="text"
                  placeholder={
                    selectedRole === 'student'
                      ? 'RA2111003010142'
                      : selectedRole === 'gate_staff'
                      ? 'STF-GATE-04'
                      : 'FAC-DBMS-702'
                  }
                  value={customIdentifier}
                  onChange={(e) => setCustomIdentifier(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  Department / Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-xs font-bold font-mono transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-[#FF3E41] hover:bg-[#e03235] text-white'
                  : selectedRole === 'gate_staff'
                  ? 'bg-[#DF367C] hover:bg-[#c42867] text-white'
                  : 'bg-[#883955] hover:bg-[#722e46] text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign In as {selectedRole.replace('_', ' ').toUpperCase()}</span>
            </button>
          </form>

          {selectedRole === 'student' && (
            <div className="text-center pt-2 border-t border-white/10 text-xs text-white/60">
              <span>New student attendee? </span>
              <Link
                to="/register"
                className="text-[#FF7099] hover:underline font-bold font-mono ml-1"
              >
                Create Student Account &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
