import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface AmbientBlobsProps {
  variant?: 'login' | 'hero';
}

export const AmbientBlobs: React.FC<AmbientBlobsProps> = ({ variant = 'login' }) => {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  const size = variant === 'hero' ? 480 : 400;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute rounded-full bg-[#FF3E41] blur-[100px]"
        style={{ width: size, height: size, top: '-15%', left: '-10%', opacity: 0.055 }}
        animate={{ x: [0, 35, -18, 28, 0], y: [0, -22, 32, -12, 0], scale: [1, 1.07, 0.94, 1.04, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full bg-[#DF367C] blur-[110px]"
        style={{ width: size * 0.85, height: size * 0.85, bottom: '-12%', right: '-8%', opacity: 0.062 }}
        animate={{ x: [0, -28, 18, -22, 0], y: [0, 24, -28, 16, 0], scale: [1, 0.92, 1.09, 0.96, 1] }}
        transition={{ duration: 37, repeat: Infinity, ease: 'linear', delay: 7 }}
      />
    </div>
  );
};
