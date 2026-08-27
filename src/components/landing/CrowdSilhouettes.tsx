import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

// Distinct SVG crowd human silhouette icons with varied concert poses
const SILHOUETTE_PATHS = [
  // 0. Double hands raised high, cheering
  "M 30 140 L 30 90 Q 30 70 42 62 L 32 30 Q 30 24 35 20 Q 40 18 44 24 L 54 54 Q 60 48 68 48 Q 76 48 82 54 L 92 24 Q 96 18 101 20 Q 106 24 104 30 L 94 62 Q 106 70 106 90 L 106 140 Z M 68 18 A 12 12 0 1 0 68 42 A 12 12 0 1 0 68 18 Z",
  // 1. Right fist pumped up, head bobbing
  "M 25 140 L 25 85 Q 25 65 38 58 L 44 64 L 40 85 L 50 85 Q 55 52 65 52 Q 74 52 80 58 L 98 20 Q 103 14 108 17 Q 112 21 109 28 L 96 66 Q 108 72 108 92 L 108 140 Z M 65 20 A 13 13 0 1 0 65 46 A 13 13 0 1 0 65 20 Z",
  // 2. Both arms angled outwards rocking out (rock horns pose)
  "M 20 140 L 20 88 Q 20 68 34 60 L 16 28 Q 12 22 17 18 Q 23 16 26 22 L 42 54 Q 56 46 70 46 Q 84 46 98 54 L 114 22 Q 117 16 123 18 Q 128 22 124 28 L 106 60 Q 120 68 120 88 L 120 140 Z M 70 14 A 14 14 0 1 0 70 42 A 14 14 0 1 0 70 14 Z",
  // 3. Side profile, left arm pointing forward/up
  "M 28 140 L 28 80 Q 28 62 40 54 L 18 20 Q 14 14 20 10 Q 25 8 28 15 L 48 48 Q 58 44 68 44 Q 80 44 88 52 L 96 74 L 104 140 Z M 66 16 A 12 12 0 1 0 66 40 A 12 12 0 1 0 66 16 Z",
  // 4. Clapping hands over head
  "M 26 140 L 26 86 Q 26 66 40 58 L 52 24 Q 56 16 62 16 Q 66 16 70 24 L 84 58 Q 98 66 98 86 L 98 140 Z M 62 18 A 12 12 0 1 0 62 42 A 12 12 0 1 0 62 18 Z",
  // 5. Jump / celebratory wide pose
  "M 22 140 L 22 84 Q 22 64 36 56 L 14 18 Q 10 12 16 8 Q 21 6 25 12 L 46 48 Q 58 42 72 42 Q 86 42 98 48 L 119 12 Q 123 6 128 8 Q 134 12 130 18 L 108 56 Q 122 64 122 84 L 122 140 Z M 72 12 A 13 13 0 1 0 72 38 A 13 13 0 1 0 72 12 Z",
];

interface SilhouetteItem {
  id: number;
  pathIdx: number;
  xOffset: number; // in %
  scale: number;
  duration: number; // in seconds
  delay: number;
  yBounce: number;
  rotDeg: number;
  isBackRow?: boolean;
}

const CROWD_ITEMS: SilhouetteItem[] = [
  { id: 1, pathIdx: 0, xOffset: 2, scale: 0.95, duration: 0.52, delay: 0.05, yBounce: 12, rotDeg: 2.5 },
  { id: 2, pathIdx: 1, xOffset: 9, scale: 0.82, duration: 0.64, delay: 0.18, yBounce: 9, rotDeg: -2, isBackRow: true },
  { id: 3, pathIdx: 2, xOffset: 16, scale: 1.05, duration: 0.48, delay: 0.12, yBounce: 14, rotDeg: 3 },
  { id: 4, pathIdx: 5, xOffset: 24, scale: 0.86, duration: 0.68, delay: 0.28, yBounce: 10, rotDeg: -2.5, isBackRow: true },
  { id: 5, pathIdx: 4, xOffset: 31, scale: 1.0, duration: 0.55, delay: 0.0, yBounce: 11, rotDeg: 2 },
  { id: 6, pathIdx: 0, xOffset: 39, scale: 0.88, duration: 0.62, delay: 0.22, yBounce: 8, rotDeg: -1.5, isBackRow: true },
  { id: 7, pathIdx: 1, xOffset: 46, scale: 1.1, duration: 0.46, delay: 0.08, yBounce: 15, rotDeg: 3.5 },
  { id: 8, pathIdx: 3, xOffset: 54, scale: 0.9, duration: 0.58, delay: 0.15, yBounce: 10, rotDeg: -2, isBackRow: true },
  { id: 9, pathIdx: 2, xOffset: 62, scale: 1.02, duration: 0.5, delay: 0.32, yBounce: 13, rotDeg: 2.5 },
  { id: 10, pathIdx: 4, xOffset: 70, scale: 0.85, duration: 0.66, delay: 0.1, yBounce: 9, rotDeg: -3, isBackRow: true },
  { id: 11, pathIdx: 5, xOffset: 77, scale: 1.08, duration: 0.49, delay: 0.25, yBounce: 14, rotDeg: 3 },
  { id: 12, pathIdx: 0, xOffset: 85, scale: 0.88, duration: 0.6, delay: 0.04, yBounce: 10, rotDeg: -2, isBackRow: true },
  { id: 13, pathIdx: 1, xOffset: 92, scale: 1.0, duration: 0.54, delay: 0.16, yBounce: 12, rotDeg: 2.5 },
];

export const CrowdSilhouettes: React.FC = () => {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[38vh] min-h-[220px] max-h-[380px] w-full overflow-hidden select-none z-10">
      {/* Subtle stage floor / crowd gradient anchor */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#160E15] via-[#1F141E] to-transparent z-20" />

      {/* Back row silhouettes (darker, slightly smaller, creates visual depth) */}
      <div className="absolute inset-x-0 bottom-6 h-full flex justify-between">
        {CROWD_ITEMS.filter((item) => item.isBackRow).map((item) => (
          <motion.div
            key={`back-${item.id}`}
            style={{
              position: 'absolute',
              left: `${item.xOffset}%`,
              bottom: 0,
              transformOrigin: 'bottom center',
            }}
            animate={
              reduced
                ? {}
                : {
                    y: [0, -item.yBounce, 0],
                    rotate: [0, item.rotDeg, 0, -item.rotDeg, 0],
                  }
            }
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              viewBox="0 0 140 140"
              className="w-24 sm:w-32 md:w-36 h-auto drop-shadow-md"
              style={{
                fill: '#241723',
                opacity: 0.75,
                transform: `scale(${item.scale})`,
              }}
            >
              <path d={SILHOUETTE_PATHS[item.pathIdx]} />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Front row silhouettes (crisp dark tone, high energy bob/sway) */}
      <div className="absolute inset-x-0 bottom-0 h-full flex justify-between z-10">
        {CROWD_ITEMS.filter((item) => !item.isBackRow).map((item) => (
          <motion.div
            key={`front-${item.id}`}
            style={{
              position: 'absolute',
              left: `${item.xOffset}%`,
              bottom: 0,
              transformOrigin: 'bottom center',
            }}
            animate={
              reduced
                ? {}
                : {
                    y: [0, -item.yBounce, 2, -item.yBounce * 0.7, 0],
                    rotate: [0, item.rotDeg, -item.rotDeg * 0.5, item.rotDeg * 0.8, 0],
                  }
            }
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              viewBox="0 0 140 140"
              className="w-28 sm:w-36 md:w-44 h-auto drop-shadow-2xl"
              style={{
                fill: '#180F17',
                transform: `scale(${item.scale})`,
              }}
            >
              <path d={SILHOUETTE_PATHS[item.pathIdx]} />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
