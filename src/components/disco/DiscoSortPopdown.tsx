import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface DiscoSortPopdownProps {
  value: string;
  onChange: (sortKey: string) => void;
}

export const DiscoSortPopdown: React.FC<DiscoSortPopdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, () => setIsOpen(false), isOpen);

  const sortOptions = [
    { value: 'TIMING_CHRONOLOGICAL', label: '🕒 Real-Time Schedule (Earliest First)' },
    { value: 'STARTING_SOONEST', label: '⚡ Starting Soonest / Live First' },
    { value: 'POPULARITY', label: '🔥 Seat Contention (Fewest Seats Left)' },
    { value: 'PRICE_ASC', label: '💰 Price: Low to High' },
    { value: 'PRICE_DESC', label: '💎 Price: High to Low' },
  ];

  return (
    <div ref={containerRef} className="relative font-mono text-xs">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 rounded-2xl bg-[#2A1D26]/90 border border-white/20 hover:border-white/40 text-white/80 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-md"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-[#FF7099]" />
        <span className="hidden sm:inline font-bold">Sort</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 bg-[#2A1D26] border border-white/20 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-2xl space-y-1"
          >
            <div className="px-3 py-1.5 text-[10px] text-white/40 font-bold uppercase tracking-wider border-b border-white/10">
              Sort Order
            </div>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  value === opt.value
                    ? 'bg-[#FF3E41]/20 text-white border border-[#FF3E41]/40 font-bold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-xs truncate">{opt.label}</span>
                {value === opt.value && <Check className="w-3.5 h-3.5 text-[#FF7099] shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
