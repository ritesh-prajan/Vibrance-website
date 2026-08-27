import React from 'react';
import { NavLink } from 'react-router-dom';

export const NavbarBrand: React.FC = () => {
  return (
    <NavLink to="/" className="flex items-center gap-2.5 focus:outline-none group">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF3E41] to-[#DF367C] text-white font-display font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
        V
      </div>
      <div>
        <span className="font-display font-black tracking-wider text-xl text-white block leading-none">
          VIBRANCE
        </span>
        <span className="text-[10px] font-mono text-[#FF7099] tracking-widest uppercase block mt-0.5">
          FEST 2026
        </span>
      </div>
    </NavLink>
  );
};
