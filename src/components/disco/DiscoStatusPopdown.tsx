import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ChevronDown, Check, Sparkles, Clock, Calendar } from 'lucide-react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

export type TimeFilterStatus = 'ALL' | 'LIVE_SOON' | 'UPCOMING' | 'EXPIRED';

interface DiscoStatusPopdownProps {
  value: TimeFilterStatus;
  onChange: (status: TimeFilterStatus) => void;
}

export const DiscoStatusPopdown: React.FC<DiscoStatusPopdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, () => setIsOpen(false), isOpen);

  const options: Array<{ value: TimeFilterStatus; label: string; icon: React.ReactNode; desc: string }> = [
    { value: 'ALL', label: 'All Shows', icon: <Sparkles className="w-3.5 h-3.5" />, desc: 'Show all timeline events' },
    { value: 'LIVE_SOON', label: 'Live & Coming Up (< 2h)', icon: <Radio className="w-3.5 h-3.5 text-red-400" />, desc: 'On stage now or starting shortly' },
    { value: 'UPCOMING', label: 'Upcoming Festival Lineup', icon: <Calendar className="w-3.5 h-3.5 text-[#10B981]" />, desc: 'Upcoming scheduled stages' },
    { value: 'EXPIRED', label: 'Past Concluded Shows', icon: <Clock className="w-3.5 h-3.5 text-white/40" />, desc: 'Concluded festival events' },
  ];

  const activeLabel = options.find((o) => o.value === value)?.label || 'Live Status';

  return (
    <div ref={containerRef} className="relative font-mono text-xs z-50">
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer shadow-md ${
          value !== 'ALL'
            ? 'bg-[#FF3E41] text-white border-[#FF3E41] font-bold shadow-[0_0_15px_rgba(255,62,65,0.4)]'
            : 'bg-[#2A1D26]/95 text-white/90 border-white/20 hover:border-white/40 hover:text-white'
        }`}
      >
        <Radio className="w-3.5 h-3.5 text-[#FF7099]" />
        <span className="truncate max-w-[130px] sm:max-w-[160px] font-bold">{activeLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-[#1f151c] border border-white/25 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] backdrop-blur-3xl space-y-1"
          >
            <div className="px-3 py-1.5 text-[10px] text-white/40 font-bold uppercase tracking-wider border-b border-white/10">
              Filter by Schedule Timing
            </div>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                  value === opt.value
                    ? 'bg-[#FF3E41] text-white font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    {opt.icon}
                    <span>{opt.label}</span>
                  </div>
                  <div className="text-[10px] opacity-75">{opt.desc}</div>
                </div>
                {value === opt.value && <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
