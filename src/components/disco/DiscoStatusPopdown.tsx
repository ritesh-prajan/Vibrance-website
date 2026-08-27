import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ChevronDown, Check, Sparkles, Calendar, Clock } from 'lucide-react';
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
    { value: 'ALL', label: 'All Statuses', icon: <Sparkles className="w-3.5 h-3.5" />, desc: 'All active & past festival shows' },
    { value: 'LIVE_SOON', label: '🔴 Live & Starting Soon', icon: <Radio className="w-3.5 h-3.5 text-red-400" />, desc: 'Shows happening right now or in < 2h' },
    { value: 'UPCOMING', label: '📅 Upcoming Schedule', icon: <Calendar className="w-3.5 h-3.5 text-[#FF7099]" />, desc: 'Future concert lineup & reservations' },
    { value: 'EXPIRED', label: '⏱️ Concluded / Expired', icon: <Clock className="w-3.5 h-3.5 text-white/40" />, desc: 'Past events with closed admission' },
  ];

  const activeLabel = options.find((o) => o.value === value)?.label || 'Status';

  return (
    <div ref={containerRef} className="relative font-mono text-xs">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer shadow-md ${
          value !== 'ALL'
            ? 'bg-[#FF3E41] text-white border-[#FF3E41] font-bold shadow-[0_0_15px_rgba(255,62,65,0.3)]'
            : 'bg-[#2A1D26]/90 text-white/80 border-white/20 hover:border-white/40 hover:text-white'
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
            className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-[#2A1D26] border border-white/20 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-2xl space-y-1"
          >
            <div className="px-3 py-1.5 text-[10px] text-white/40 font-bold uppercase tracking-wider border-b border-white/10">
              Filter by Stage Status
            </div>
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                  value === opt.value
                    ? 'bg-[#FF3E41]/20 text-white border border-[#FF3E41]/40'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    {opt.icon}
                    <span>{opt.label}</span>
                  </div>
                  <div className="text-[10px] text-white/50">{opt.desc}</div>
                </div>
                {value === opt.value && <Check className="w-4 h-4 text-[#FF7099] shrink-0 mt-0.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
