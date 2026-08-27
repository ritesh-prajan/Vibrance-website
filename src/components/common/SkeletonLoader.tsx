import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'table' | 'seatmap';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  count = 3,
}) => {
  const items = Array.from({ length: count });

  if (variant === 'table') {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-[#4C3549] rounded-xl border border-white/10" />
        {items.map((_, i) => (
          <div
            key={i}
            className="h-14 bg-[#4C3549]/60 rounded-xl border border-white/5"
          />
        ))}
      </div>
    );
  }

  if (variant === 'seatmap') {
    return (
      <div className="p-6 bg-[#4C3549] rounded-3xl border border-white/15 space-y-4">
        <div className="h-10 bg-[#2A1D26] rounded-xl" />
        <div className="grid grid-cols-8 gap-2 py-4">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="h-10 bg-[#2A1D26] rounded-lg border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  // 'card' variant
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-[#4C3549] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg"
        >
          <div className="h-4 bg-[#883955] rounded w-1/3" />
          <div className="h-6 bg-[#2A1D26] rounded w-3/4" />
          <div className="h-3 bg-[#2A1D26] rounded w-1/2" />
          <div className="h-16 bg-[#2A1D26] rounded-xl" />
          <div className="h-9 bg-[#FF3E41]/30 rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
};
