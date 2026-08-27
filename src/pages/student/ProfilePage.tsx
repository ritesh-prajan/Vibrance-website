import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import {
  CheckCircle2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile, myBookings } = useFest();

  const [name, setName] = useState(currentUser?.name || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [year, setYear] = useState(currentUser?.year || '3rd Year (B.Tech)');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      department,
      year,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  const confirmedCount = myBookings.filter((b) => b.status === 'confirmed').length;
  const usedCount = myBookings.filter((b) => b.status === 'checked_in').length;
  const cancelledCount = myBookings.filter((b) => b.status === 'cancelled').length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide">
          STUDENT PROFILE & BADGE
        </h1>
        <p className="text-xs text-white/60 font-mono mt-0.5">
          Vibrance 2026 Student Delegate Profile & Pass History
        </p>
      </div>

      {savedFeedback && (
        <div className="bg-[#10B981]/20 border border-[#10B981]/40 rounded-2xl p-4 flex items-center gap-2 text-xs font-mono text-[#10B981]">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes saved successfully in local session.</span>
        </div>
      )}

      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FF3E41] to-[#DF367C] text-white font-display font-black text-3xl flex items-center justify-center shadow-xl shrink-0">
            {currentUser?.name?.charAt(0) || 'S'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF3E41]/20 text-[#FF3E41] border border-[#FF3E41]/40">
                STUDENT DELEGATE
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono text-white/60 bg-white/10">
                {currentUser?.regNumber}
              </span>
            </div>

            <h2 className="text-2xl font-black text-white font-display tracking-wide">
              {currentUser?.name}
            </h2>

            <p className="text-xs text-white/70 font-mono">
              {currentUser?.department} • {currentUser?.year || 'B.Tech'}
            </p>
            <p className="text-xs text-[#FF7099] font-mono">
              {currentUser?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10 text-center font-mono">
          <div className="p-3 bg-[#2A1D26] rounded-xl border border-white/10">
            <div className="text-xl font-black text-white">{confirmedCount}</div>
            <div className="text-[10px] text-white/40 uppercase">Active Passes</div>
          </div>
          <div className="p-3 bg-[#2A1D26] rounded-xl border border-white/10">
            <div className="text-xl font-black text-[#FF7099]">{usedCount}</div>
            <div className="text-[10px] text-white/40 uppercase">Attended Events</div>
          </div>
          <div className="p-3 bg-[#2A1D26] rounded-xl border border-white/10">
            <div className="text-xl font-black text-white/40">{cancelledCount}</div>
            <div className="text-[10px] text-white/40 uppercase">Cancelled</div>
          </div>
        </div>
      </div>

      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h2 className="text-lg font-bold text-white font-display tracking-wide">
          EDIT PROFILE INFORMATION
        </h2>

        <form onSubmit={handleSave} className="space-y-4 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3E41]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                Registration Number (Read Only)
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.regNumber || ''}
                className="w-full bg-[#2A1D26]/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white/50 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3E41]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                Year of Study
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3E41]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
