import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useFest } from '../../context/FestContext';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface UserPersonaMenuProps {
  onLogout: () => void;
}

export const UserPersonaMenu: React.FC<UserPersonaMenuProps> = ({ onLogout }) => {
  const { currentUser, loginAsStudent, loginAsGateStaff, loginAsAdmin } = useFest();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, () => setIsOpen(false), isOpen);

  if (!currentUser) {
    return (
      <NavLink
        to="/login"
        className="px-4 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-mono font-bold transition-all shadow-md"
      >
        Sign In
      </NavLink>
    );
  }

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#2A1D26] border border-white/15 hover:border-white/30 text-white text-xs font-mono transition-all cursor-pointer shadow-md"
        aria-label="User account and persona menu"
      >
        <div className="w-6 h-6 rounded-lg bg-[#FF3E41] text-white font-bold flex items-center justify-center text-[11px]">
          {currentUser.name.charAt(0)}
        </div>
        <div className="text-left">
          <span className="font-bold block leading-none">{currentUser.name.split(' ')[0]}</span>
          <span className="text-[9px] text-[#FF7099] uppercase tracking-wider leading-none">
            {currentUser.role}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 bg-[#2A1D26] border border-white/20 rounded-2xl p-3 shadow-2xl z-[100] backdrop-blur-2xl space-y-2 font-mono text-xs"
          >
            <div className="p-2 bg-white/5 rounded-xl border border-white/5">
              <div className="font-bold text-white text-sm">{currentUser.name}</div>
              <div className="text-[#FF7099] text-[10px]">{currentUser.email}</div>
              <div className="text-white/40 text-[9px] uppercase mt-1">Role: {currentUser.role}</div>
            </div>

            <div className="space-y-1">
              <div className="text-[9px] text-white/40 uppercase font-bold px-1">Switch Active Persona</div>
              <button
                onClick={() => { loginAsStudent(); setIsOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-xs"
              >
                🎓 Student Persona
              </button>
              <button
                onClick={() => { loginAsGateStaff(); setIsOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-xs"
              >
                🛡️ Gate Staff Persona
              </button>
              <button
                onClick={() => { loginAsAdmin(); setIsOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-xs"
              >
                ⚡ Admin / Faculty Lab
              </button>
            </div>

            <div className="pt-1 border-t border-white/10">
              <button
                onClick={onLogout}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
