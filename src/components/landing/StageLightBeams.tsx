import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface BeamConfig {
  id: number;
  origin: string;
  left?: string;
  right?: string;
  top: string;
  width: number;
  height: number;
  color: string;
  initialRotate: number;
  sweepRange: [number, number];
  duration: number;
  delay: number;
}

const BEAMS: BeamConfig[] = [
  // Left stage moving head (Red accent)
  {
    id: 1,
    origin: 'top center',
    left: '10%',
    top: '-5%',
    width: 240,
    height: 900,
    color: '#FF3E41',
    initialRotate: -25,
    sweepRange: [-45, 15],
    duration: 7.5,
    delay: 0,
  },
  // Left-center beam (Rose Punch)
  {
    id: 2,
    origin: 'top center',
    left: '28%',
    top: '-5%',
    width: 190,
    height: 850,
    color: '#DF367C',
    initialRotate: -10,
    sweepRange: [-25, 30],
    duration: 9.2,
    delay: 1.2,
  },
  // Right-center beam (Highlight pink/white)
  {
    id: 3,
    origin: 'top center',
    right: '28%',
    top: '-5%',
    width: 200,
    height: 850,
    color: '#FF7099',
    initialRotate: 10,
    sweepRange: [-30, 25],
    duration: 8.4,
    delay: 2.5,
  },
  // Right stage moving head (Red accent)
  {
    id: 4,
    origin: 'top center',
    right: '10%',
    top: '-5%',
    width: 250,
    height: 920,
    color: '#FF3E41',
    initialRotate: 25,
    sweepRange: [-15, 45],
    duration: 6.8,
    delay: 0.8,
  },
];

export const StageLightBeams: React.FC = () => {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {BEAMS.map((beam) => (
        <motion.div
          key={beam.id}
          style={{
            position: 'absolute',
            left: beam.left,
            right: beam.right,
            top: beam.top,
            width: beam.width,
            height: beam.height,
            transformOrigin: beam.origin,
            background: `linear-gradient(180deg, ${beam.color}44 0%, ${beam.color}18 45%, transparent 100%)`,
            clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
            mixBlendMode: 'screen',
            filter: 'blur(8px)',
            opacity: 0.85,
          }}
          animate={
            reduced
              ? { rotate: beam.initialRotate }
              : {
                  rotate: [beam.sweepRange[0], beam.sweepRange[1], beam.sweepRange[0]],
                  opacity: [0.65, 0.95, 0.65],
                }
          }
          transition={{
            duration: beam.duration,
            delay: beam.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
