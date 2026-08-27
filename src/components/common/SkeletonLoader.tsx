import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'card' | 'table' | 'seatmap';
  count?: number;
}

const shimmer = {
  animate: {
    backgroundPosition: ['200% center', '-200% center'],
  },
  transition: {
    duration: 1.6,
    repeat: Infinity,
    ease: 'linear',
  },
};

const ShimmerDiv: React.FC<{ className: string }> = ({ className }) => (
  <motion.div
    className={className}
    animate={shimmer.animate}
    transition={shimmer.transition}
    style={{
      background: 'linear-gradient(90deg, #4C3549 25%, #5e3d5a 50%, #4C3549 75%)',
      backgroundSize: '400% 100%',
    }}
  />
);

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'card', count = 3 }) => {
  const items = Array.from({ length: count });

  if (variant === 'table') {
    return (
      <div className="space-y-3">
        <ShimmerDiv className="h-10 rounded-xl border border-white/10" />
        {items.map((_, i) => <ShimmerDiv key={i} className="h-14 rounded-xl border border-white/5" />)}
      </div>
    );
  }

  if (variant === 'seatmap') {
    return (
      <div className="p-6 bg-[#4C3549] rounded-3xl border border-white/15 space-y-4">
        <ShimmerDiv className="h-10 rounded-xl" />
        <div className="grid grid-cols-8 gap-2 py-4">
          {Array.from({ length: 48 }).map((_, i) => <ShimmerDiv key={i} className="h-10 rounded-lg border border-white/10" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, i) => (
        <div key={i} className="bg-[#4C3549] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
          <ShimmerDiv className="h-4 rounded w-1/3" />
          <ShimmerDiv className="h-6 rounded w-3/4" />
          <ShimmerDiv className="h-3 rounded w-1/2" />
          <ShimmerDiv className="h-16 rounded-xl" />
          <ShimmerDiv className="h-9 rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
};
