import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type GlassVariant =
  | 'default'
  | 'subtle'
  | 'interactive'
  | 'glow'
  | 'accent'
  | 'danger'
  | 'success';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: GlassVariant;
  rounded?: 'xl' | '2xl' | '3xl' | 'full';
  showSpecular?: boolean;
  glowColor?: string;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<GlassVariant, string> = {
  default:
    'bg-[#4C3549]/50 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
  subtle:
    'bg-[#2A1D26]/60 backdrop-blur-xl border border-white/10 shadow-[0_4px_24px_0_rgba(0,0,0,0.25)]',
  interactive:
    'bg-[#4C3549]/45 hover:bg-[#883955]/35 backdrop-blur-2xl border border-white/15 hover:border-[#FF7099]/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] hover:shadow-[0_12px_40px_0_rgba(255,62,65,0.22)] transition-all duration-300 cursor-pointer',
  glow:
    'bg-[#4C3549]/60 backdrop-blur-2xl border border-[#FF3E41]/40 shadow-[0_0_35px_rgba(255,62,65,0.25)]',
  accent:
    'bg-gradient-to-br from-[#FF3E41]/20 via-[#DF367C]/15 to-[#883955]/30 backdrop-blur-2xl border border-[#FF7099]/30 shadow-[0_8px_32px_0_rgba(223,54,124,0.25)]',
  danger:
    'bg-red-500/15 backdrop-blur-2xl border border-red-500/40 shadow-[0_8px_32px_0_rgba(239,68,68,0.2)]',
  success:
    'bg-emerald-500/15 backdrop-blur-2xl border border-emerald-500/40 shadow-[0_8px_32px_0_rgba(16,185,129,0.2)]',
};

const roundedStyles = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  rounded = '3xl',
  showSpecular = true,
  glowColor,
  className = '',
  children,
  ...props
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${variantStyles[variant]} ${roundedStyles[rounded]} ${className}`}
      {...props}
    >
      {/* Specular Top Reflection Edge */}
      {showSpecular && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-10" />
      )}

      {/* Optional Ambient Glow Sphere */}
      {glowColor && (
        <div
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ backgroundColor: glowColor }}
        />
      )}

      {children}
    </motion.div>
  );
};
