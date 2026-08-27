import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  starCount?: number;
  pulseDuration?: number;
  ariaLabel?: string;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className = '',
  children,
  starCount = 60,
  pulseDuration = 14,
  ariaLabel = 'Animated aurora background',
}) => {
  const reduced = usePrefersReducedMotion();

  // Stable star positions using %, computed once per mount
  const stars = useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => ({
        id: i,
        x: Math.random() * 98 + 1,
        y: Math.random() * 98 + 1,
        dur: Math.random() * 3 + 2,
        delay: Math.random() * 8,
        peak: Math.random() * 0.6 + 0.3,
        size: Math.random() < 0.15 ? 3 : 2,
      })),
    [starCount]
  );

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ isolation: 'isolate' }}
    >
      {/* Layer 1: static radial atmosphere — always visible */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 55% at 20% 35%, rgba(255,62,65,0.28) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 80% 65%, rgba(223,54,124,0.24) 0%, transparent 70%),
            radial-gradient(ellipse 45% 40% at 55% 20%, rgba(136,57,85,0.18) 0%, transparent 65%)
          `,
          animation: reduced
            ? 'none'
            : `vibrance-aurora-pulse ${pulseDuration}s ease-in-out infinite`,
        }}
      />

      {/* Layer 2: drifting blobs — no overflow-hidden so they aren't clipped */}
      {!reduced && (
        <div aria-hidden="true" className="absolute inset-0">

          {/* Blob A — crimson, top-left drift */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '55%',
              height: '55%',
              top: '5%',
              left: '-10%',
              background:
                'radial-gradient(circle, rgba(255,62,65,0.40) 0%, transparent 70%)',
              filter: 'blur(72px)',
            }}
            animate={{ x: [-30, 50, -30], y: [-10, 30, -10], scale: [1, 1.12, 1] }}
            transition={{ duration: 30, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          />

          {/* Blob B — magenta, bottom-right drift */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '55%',
              height: '55%',
              bottom: '0%',
              right: '-10%',
              background:
                'radial-gradient(circle, rgba(223,54,124,0.38) 0%, transparent 70%)',
              filter: 'blur(72px)',
            }}
            animate={{ x: [40, -40, 40], y: [20, -20, 20], scale: [1, 1.18, 1] }}
            transition={{ duration: 40, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          />

          {/* Blob C — rose, centre roaming */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '40%',
              height: '40%',
              top: '25%',
              left: '30%',
              background:
                'radial-gradient(circle, rgba(255,112,153,0.28) 0%, transparent 70%)',
              filter: 'blur(64px)',
            }}
            animate={{ x: [20, -35, 20], y: [-25, 40, -25] }}
            transition={{ duration: 52, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          />

          {/* Blob D — deep wine, top-right */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '35%',
              height: '45%',
              top: '0%',
              right: '10%',
              background:
                'radial-gradient(circle, rgba(136,57,85,0.32) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
            animate={{ x: [-15, 25, -15], y: [5, -25, 5] }}
            transition={{ duration: 36, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          />

          {/* Blob E — crimson accent, bottom-left */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '30%',
              height: '30%',
              bottom: '10%',
              left: '5%',
              background:
                'radial-gradient(circle, rgba(255,62,65,0.22) 0%, transparent 70%)',
              filter: 'blur(56px)',
            }}
            animate={{ x: [10, 50, 10], y: [-10, 20, -10], scale: [1, 1.3, 1] }}
            transition={{ duration: 48, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          />
        </div>
      )}

      {/* Layer 3: twinkling star field — % positions, overflow-hidden here is fine */}
      {!reduced && (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          {stars.map((star) => (
            <motion.span
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, star.peak, 0] }}
              transition={{
                duration: star.dur,
                repeat: Infinity,
                delay: star.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Layer 4: bottom vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(42,29,38,0.75) 0%, transparent 100%)',
        }}
      />

      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};

export default AuroraBackground;

