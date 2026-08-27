import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../../types';

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  role?: UserRole;
  userName?: string;
  onLogout: () => void;
}

export const MobileNavMenu: React.FC<MobileNavMenuProps> = ({
  isOpen,
  onClose,
  role,
  userName,
  onLogout,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/10 bg-[#2A1D26] px-4 py-4 space-y-3 font-mono text-xs"
        >
          {role === 'student' && (
            <>
              <NavLink to="/events" onClick={onClose} className="block py-2 text-white">Events Lineup</NavLink>
              <NavLink to="/my-bookings" onClick={onClose} className="block py-2 text-white">My Bookings</NavLink>
              <NavLink to="/profile" onClick={onClose} className="block py-2 text-white">Profile</NavLink>
            </>
          )}
          {(role === 'gate_staff' || (role as any) === 'staff') && (
            <>
              <NavLink to="/verify" onClick={onClose} className="block py-2 text-white">Gate Scanner</NavLink>
              <NavLink to="/verify/history" onClick={onClose} className="block py-2 text-white">Scan Log</NavLink>
            </>
          )}
          {role === 'admin' && (
            <>
              <NavLink to="/admin" onClick={onClose} className="block py-2 text-white">Dashboard</NavLink>
              <NavLink to="/admin/events" onClick={onClose} className="block py-2 text-white">Events Admin</NavLink>
              <NavLink to="/admin/users" onClick={onClose} className="block py-2 text-white">Staff &amp; Users</NavLink>
              <NavLink to="/admin/concurrency" onClick={onClose} className="block py-2 text-white">2PL Lab</NavLink>
              <NavLink to="/admin/audit" onClick={onClose} className="block py-2 text-white">Audit Logs</NavLink>
            </>
          )}
          <div className="pt-2 border-t border-white/10 flex justify-between items-center">
            <span className="text-white/60">{userName}</span>
            <button onClick={onLogout} className="text-red-400 font-bold">Sign Out</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
