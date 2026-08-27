import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const DiscoLightsBackground: React.FC<{ intensity?: 'subtle' | 'vibrant' }> = ({
  intensity = 'subtle',
}) => {
  const reduced = usePrefersReducedMotion();
  const opacityClass = intensity === 'vibrant' ? 'opacity-40' : 'opacity-25';

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${opacityClass}`}>
      {/* Sweeping Cone Beams */}
      <motion.div
        animate={reduced ? {} : { rotate: [-25, 25, -25], scaleX: [1, 1.3, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transformOrigin: 'top left',
          background: 'linear-gradient(135deg, rgba(255, 62, 65, 0.7) 0%, rgba(223, 54, 124, 0.3) 45%, transparent 75%)',
        }}
        className="absolute -top-10 -left-10 w-[60%] h-[140%] filter blur-xl"
      />
      <motion.div
        animate={reduced ? {} : { rotate: [20, -20, 20], scaleX: [1.2, 0.9, 1.2] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{
          transformOrigin: 'top right',
          background: 'linear-gradient(225deg, rgba(223, 54, 124, 0.7) 0%, rgba(255, 112, 153, 0.3) 45%, transparent 75%)',
        }}
        className="absolute -top-10 -right-10 w-[60%] h-[140%] filter blur-xl"
      />
      {/* Center Laser Sweep */}
      <motion.div
        animate={reduced ? {} : { x: ['-20%', '20%', '-20%'], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF3E41]/30 to-transparent filter blur-md"
      />
    </div>
  );
};
