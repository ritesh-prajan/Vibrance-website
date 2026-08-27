import React from 'react';

interface TicketInkStampProps {
  type: 'USED' | 'EXPIRED' | 'CANCELLED';
  className?: string;
}

export const TicketInkStamp: React.FC<TicketInkStampProps> = ({ type, className = '' }) => {
  const isUsed = type === 'USED';
  const label = isUsed ? 'USED' : type === 'CANCELLED' ? 'VOID' : 'EXPIRED';
  const sublabel = isUsed ? 'GATE CHECKED IN' : type === 'CANCELLED' ? 'CANCELLED' : 'EVENT CONCLUDED';

  return (
    <div
      className={`pointer-events-none select-none inline-flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-lg border-2 sm:border-4 border-dashed rotate-[-14deg] sm:rotate-[-16deg] font-mono tracking-widest uppercase transition-transform ${
        isUsed
          ? 'border-emerald-500/80 text-emerald-400 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
          : 'border-[#FF3E41]/85 text-[#FF7099] bg-black/60 shadow-[0_0_18px_rgba(255,62,65,0.3)]'
      } ${className}`}
      style={{
        textShadow: '0 0 4px rgba(0,0,0,0.8)',
        maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 85%, rgba(0,0,0,0.6) 100%)',
      }}
    >
      <span className="font-display font-black text-xl sm:text-2xl leading-none tracking-wider">
        {label}
      </span>
      <span className="text-[8px] sm:text-[9px] font-bold tracking-widest mt-0.5 opacity-90">
        {sublabel}
      </span>
    </div>
  );
};
