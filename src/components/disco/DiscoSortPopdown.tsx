import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface DiscoSortPopdownProps {
  value: string;
  onChange: (sort: string) => void;
}

export const DiscoSortPopdown: React.FC<DiscoSortPopdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, () => setIsOpen(false), isOpen);

  const sortOptions = [
    { value: 'TIMING_CHRONOLOGICAL', label: '🕒 Real-Time (Live & Upcoming First)' },
    { value: 'SEAT_CONTENTION', label: '⚡ Highest Contention (2PL Locks)' },
    { value: 'PRICE_ASC', label: '💰 Price: Low to High' },
    { value: 'PRICE_DESC', label: '💎 Price: High to Low' },
    { value: 'NAME_ASC', label: '🔤 Stage Title (A-Z)' },
  ];

  return (
    <div ref={containerRef} className="relative font-mono text-xs z-50">
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 rounded-2xl bg-[#2A1D26]/95 border border-white/20 hover:border-white/40 text-white/90 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-md"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-[#FF7099]" />
        <span className="font-bold">Sort</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute right-0 mt-2 w-72 bg-[#1f151c] border border-white/25 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] backdrop-blur-3xl space-y-1"
          >
            <div className="px-3 py-1.5 text-[10px] text-white/40 font-bold uppercase tracking-wider border-b border-white/10">
              Sort Stages Order
            </div>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  value === opt.value
                    ? 'bg-[#883955] text-white font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-xs truncate">{opt.label}</span>
                {value === opt.value && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
