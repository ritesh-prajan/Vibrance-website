import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const TelemetryConcurrencyBadge: React.FC = () => {
  return (
    <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-[11px] text-white/60 space-y-1 font-mono">
      <div className="flex items-center gap-1.5 text-white font-bold">
        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
        <span>Strict 2PL Concurrency Engine</span>
      </div>
      <p className="text-[10px] leading-relaxed">
        Seats are reserved under serialized pessimistic locks with automatic 3-minute lease timeouts.
      </p>
    </div>
  );
};
