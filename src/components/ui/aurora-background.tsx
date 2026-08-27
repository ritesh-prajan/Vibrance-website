import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  starCount?: number;
  gradientColors?: [string, string];
  pulseDuration?: number;
  ariaLabel?: string;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className = '',
  children,
  starCount = 55,
  gradientColors = [
    'var(--aurora-color1, rgba(255,62,65,0.18))',
    'var(--aurora-color2, rgba(223,54,124,0.15))',
  ],
  pulseDuration = 12,
  ariaLabel = 'Animated aurora background',
}) => {
  const reduced = usePrefersReducedMotion();
  const [colorA, colorB] = gradientColors;

  // Pre-generate stable random star positions once per mount
  const stars = useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 6,
        peak: Math.random() * 0.75 + 0.1,
      })),
    [starCount]
  );

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`relative ${className}`}
    >
      {/* Background layers */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">

        {/* Pulsing radial gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 25% 40%, ${colorA} 0%, transparent 65%),
              radial-gradient(ellipse at 75% 60%, ${colorB} 0%, transparent 65%)
            `,
            animation: reduced ? 'none' : `vibrance-aurora-pulse ${pulseDuration}s ease-in-out infinite`,
          }}
        />

        {/* Slow drifting color blobs */}
        {!reduced && (
          <motion.div
            className="absolute inset-0 mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            {/* Blob 1 — deep crimson/red top-left */}
            <motion.div
              className="absolute -top-1/3 -left-1/4 w-[55%] h-[55%] rounded-full filter blur-3xl"
              style={{ backgroundColor: 'rgba(255, 62, 65, 0.12)' }}
              animate={{ x: [-40, 40, -40], y: [-15, 25, -15], scale: [1, 1.18, 1] }}
              transition={{ duration: 32, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            />

            {/* Blob 2 — fuchsia/magenta bottom-right */}
            <motion.div
              className="absolute -bottom-1/3 -right-1/4 w-[55%] h-[55%] rounded-full filter blur-3xl"
              style={{ backgroundColor: 'rgba(223, 54, 124, 0.12)' }}
              animate={{ x: [45, -45, 45], y: [20, -20, 20], scale: [1, 1.22, 1] }}
              transition={{ duration: 42, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            />

            {/* Blob 3 — rose highlight, center roaming */}
            <motion.div
              className="absolute top-[30%] left-[35%] w-[35%] h-[35%] rounded-full filter blur-3xl"
              style={{ backgroundColor: 'rgba(255, 112, 153, 0.09)' }}
              animate={{ x: [25, -25, 25], y: [-35, 35, -35], rotate: [0, 180, 360] }}
              transition={{ duration: 55, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            />

            {/* Blob 4 — deep wine top-right, subtle depth */}
            <motion.div
              className="absolute -top-1/4 right-[10%] w-[30%] h-[40%] rounded-full filter blur-3xl"
              style={{ backgroundColor: 'rgba(136, 57, 85, 0.15)' }}
              animate={{ x: [-20, 30, -20], y: [10, -30, 10] }}
              transition={{ duration: 38, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            />
          </motion.div>
        )}

        {/* Twinkling stars */}
        {!reduced &&
          stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute w-[2px] h-[2px] rounded-full"
              style={{
                left: `${star.x}vw`,
                top: `${star.y}vh`,
                backgroundColor: 'rgba(255,255,255,0.9)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, star.peak, 0] }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: 'easeInOut',
              }}
            />
          ))}

        {/* Very subtle bottom vignette to anchor content */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(42,29,38,0.6) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AuroraBackground;
