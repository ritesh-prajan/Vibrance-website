import React from 'react';
import { NavLink } from 'react-router-dom';

export const NavbarBrand: React.FC = () => {
  return (
    <NavLink to="/" className="flex items-center gap-3 focus:outline-none group">
      <img
        src="/vibrance-logo.png"
        alt="VIT Chennai Vibrance 2026 Logo"
        className="w-10 h-10 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform ring-2 ring-[#FF3E41]/50 bg-black"
      />
      <div>
        <span className="font-display font-black tracking-wider text-xl text-white block leading-none">
          VIBRANCE
        </span>
        <span className="text-[10px] font-mono text-[#FF7099] tracking-widest uppercase block mt-0.5 font-bold">
          VIT CHENNAI &bull; 2026
        </span>
      </div>
    </NavLink>
  );
};
