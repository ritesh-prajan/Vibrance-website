import React, { useState } from 'react';
import { useFest } from '../context/FestContext';
import { User, ShieldCheck, Sparkles, Cpu, ArrowRight, Zap, Database } from 'lucide-react';
import { MOCK_STUDENT_PROFILES, MOCK_ADMIN_PROFILES } from '../data/mockEvents';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAsStudent, loginAsAdmin } = useFest();
  const [activeRoleTab, setActiveRoleTab] = useState<'STUDENT' | 'ADMIN'>('STUDENT');

  // Custom form state
  const [studentName, setStudentName] = useState('Rahul Sharma');
  const [studentReg, setStudentReg] = useState('RA2111003010142');

  const [adminName, setAdminName] = useState('Dr. Ramesh Sundaram');
  const [adminStaffId, setAdminStaffId] = useState('FAC-DBMS-702');

  if (!isOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsStudent(studentName, studentReg);
    onClose();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin(adminName, adminStaffId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f131c] border border-white/15 rounded-3xl max-w-2xl w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        {/* Top Decorative Banner */}
        <div className="relative h-28 bg-gradient-to-r from-[#121620] via-[#1a202c] to-[#121620] border-b border-white/10 p-6 flex flex-col justify-end">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 px-2.5 py-1 rounded-full">
              <Cpu className="w-3 h-3" /> DBMS LAB DEMO AUTH
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ccff00] text-black font-bold flex items-center justify-center text-sm font-display tracking-wider">
              V26
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Vibrance 2026 Authentication</h2>
              <p className="text-xs text-white/60">Select role session for fest ticket booking & database transaction lab</p>
            </div>
          </div>
        </div>

        {/* Role Toggle Selector */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#090b10] rounded-2xl border border-white/10 mb-6">
            <button
              onClick={() => setActiveRoleTab('STUDENT')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeRoleTab === 'STUDENT'
                  ? 'bg-[#ccff00] text-black shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student Booking Session</span>
            </button>
            <button
              onClick={() => setActiveRoleTab('ADMIN')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeRoleTab === 'ADMIN'
                  ? 'bg-[#00e5ff] text-black shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin / DBMS Controller</span>
            </button>
          </div>

          {/* Quick Preset Cards for Quick Presentation Switching */}
          <div className="mb-6">
            <p className="text-[11px] font-mono text-white/50 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Fast Demo Switcher (1-Click)</span>
              <span className="text-[#ccff00]">Instant Session</span>
            </p>

            {activeRoleTab === 'STUDENT' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MOCK_STUDENT_PROFILES.slice(0, 2).map((std) => (
                  <button
                    key={std.id}
                    onClick={() => {
                      loginAsStudent(std.name, std.regNumber);
                      onClose();
                    }}
                    className="text-left p-3 rounded-xl bg-[#141923] hover:bg-[#1c2331] border border-white/10 hover:border-[#ccff00]/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-[#ccff00]">{std.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#ccff00] transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[10px] text-white/50 font-mono mt-0.5">{std.regNumber}</p>
                    <p className="text-[9px] text-[#ccff00]/80 mt-1">{std.department}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MOCK_ADMIN_PROFILES.map((adm) => (
                  <button
                    key={adm.id}
                    onClick={() => {
                      loginAsAdmin(adm.name, adm.regNumber);
                      onClose();
                    }}
                    className="text-left p-3 rounded-xl bg-[#141923] hover:bg-[#1c2331] border border-white/10 hover:border-[#00e5ff]/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-[#00e5ff]">{adm.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#00e5ff] transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[10px] text-white/50 font-mono mt-0.5">{adm.regNumber}</p>
                    <p className="text-[9px] text-[#00e5ff]/80 mt-1">{adm.department}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Details Form */}
          <div className="border-t border-white/10 pt-5">
            <p className="text-[11px] font-mono text-white/50 uppercase tracking-wider mb-3">
              Or Enter Custom Credentials
            </p>

            {activeRoleTab === 'STUDENT' ? (
              <form onSubmit={handleStudentSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-[#090b10] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#ccff00] focus:outline-none"
                    placeholder="e.g. Priya Nair"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">Registration / Roll Number</label>
                  <input
                    type="text"
                    required
                    value={studentReg}
                    onChange={(e) => setStudentReg(e.target.value)}
                    className="w-full bg-[#090b10] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#ccff00] focus:outline-none font-mono"
                    placeholder="e.g. RA2111003010999"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 bg-[#ccff00] hover:bg-[#b8e600] text-black py-3 rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Start Student Session
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">Faculty / Admin Name</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full bg-[#090b10] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#00e5ff] focus:outline-none"
                    placeholder="e.g. Dr. Ramesh Sundaram"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">Staff / Lab ID</label>
                  <input
                    type="text"
                    required
                    value={adminStaffId}
                    onChange={(e) => setAdminStaffId(e.target.value)}
                    className="w-full bg-[#090b10] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#00e5ff] focus:outline-none font-mono"
                    placeholder="e.g. FAC-DBMS-702"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 bg-[#00e5ff] hover:bg-[#00cce6] text-black py-3 rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)] flex items-center justify-center gap-2"
                >
                  <Database className="w-4 h-4" /> Enter DBMS Controller Dashboard
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Academic Presentation Notice */}
        <div className="bg-[#090b10] border-t border-white/10 px-6 py-3 flex items-center justify-between text-[11px] text-white/50">
          <span className="flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" /> DBMS Presentation Demo Mode
          </span>
          <span className="text-white/40">Mock Authentication Active</span>
        </div>
      </div>
    </div>
  );
};
