import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../../types';

interface NavRoleLinksProps {
  role?: UserRole;
}

export const NavRoleLinks: React.FC<NavRoleLinksProps> = ({ role }) => {
  const linkClass = (active: boolean, colorClass: string = 'bg-[#FF3E41]') =>
    `px-3.5 py-2 rounded-xl transition-all font-semibold ${
      active ? `${colorClass} text-white shadow-md` : 'text-white/70 hover:text-white hover:bg-white/10'
    }`;

  if (role === 'student') {
    return (
      <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
        <NavLink to="/events" className={({ isActive }) => linkClass(isActive, 'bg-[#FF3E41]')}>
          Events Lineup
        </NavLink>
        <NavLink to="/my-bookings" className={({ isActive }) => linkClass(isActive, 'bg-[#FF3E41]')}>
          My Bookings
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => linkClass(isActive, 'bg-[#FF3E41]')}>
          Profile
        </NavLink>
      </nav>
    );
  }

  if (role === 'gate_staff' || (role as any) === 'staff') {
    return (
      <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
        <NavLink to="/verify" className={({ isActive }) => linkClass(isActive, 'bg-[#DF367C]')}>
          Gate Scanner
        </NavLink>
        <NavLink to="/verify/history" className={({ isActive }) => linkClass(isActive, 'bg-[#DF367C]')}>
          Scan Log
        </NavLink>
      </nav>
    );
  }

  if (role === 'admin') {
    return (
      <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
        <NavLink to="/admin" end className={({ isActive }) => linkClass(isActive, 'bg-[#883955]')}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/events" className={({ isActive }) => linkClass(isActive, 'bg-[#883955]')}>
          Events Admin
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => linkClass(isActive, 'bg-[#883955]')}>
          Staff &amp; Users
        </NavLink>
        <NavLink to="/admin/concurrency" className={({ isActive }) => linkClass(isActive, 'bg-[#883955]')}>
          2PL Concurrency Lab
        </NavLink>
        <NavLink to="/admin/audit" className={({ isActive }) => linkClass(isActive, 'bg-[#883955]')}>
          Audit Logs
        </NavLink>
      </nav>
    );
  }

  return null;
};
