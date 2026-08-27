import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Check, Search, Sparkles } from 'lucide-react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface DiscoGenrePopdownProps {
  value: string;
  onChange: (category: string) => void;
}

export const DiscoGenrePopdown: React.FC<DiscoGenrePopdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, () => setIsOpen(false), isOpen);

  const categories = [
    { value: 'ALL', label: 'All Genres & Stages', badge: 'ALL' },
    { value: 'PRO_SHOW', label: '🎤 Pro-Shows Live Concerts', badge: 'CONCERTS' },
    { value: 'EDM', label: '🎧 EDM & Visual Pyrotechnics', badge: 'ELECTRONIC' },
    { value: 'DANCE', label: '💃 Choreonite & Urban Clash', badge: 'DANCE' },
    { value: 'COMEDY', label: '🎭 Stand-up Comedy Specials', badge: 'COMEDY' },
    { value: 'BATTLE_OF_BANDS', label: '🎸 Rock Band Decibel Wars', badge: 'ROCK' },
    { value: 'HACKATHON', label: '💻 36-Hour Hackathon Build', badge: 'TECH' },
  ];

  const activeCategory = categories.find((c) => c.value === value);
  const activeLabel = activeCategory ? activeCategory.label : 'Select Category';
  const filtered = categories.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.badge.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative font-mono text-xs z-50">
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer shadow-md ${
          value !== 'ALL'
            ? 'bg-[#DF367C] text-white border-[#DF367C] font-bold shadow-[0_0_15px_rgba(223,54,124,0.4)]'
            : 'bg-[#2A1D26]/95 text-white/90 border-white/20 hover:border-white/40 hover:text-white'
        }`}
      >
        <Filter className="w-3.5 h-3.5 text-[#FF7099]" />
        <span className="truncate max-w-[130px] sm:max-w-[160px] font-bold">{activeLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 bg-[#1f151c] border border-white/25 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] backdrop-blur-3xl space-y-2.5"
          >
            {/* Popdown Header */}
            <div className="flex items-center justify-between px-1 text-[10px] text-white/40 font-bold uppercase tracking-wider">
              <span>Filter by Genre</span>
              <span className="text-[#FF7099]">{filtered.length} categories</span>
            </div>

            {/* In-built Search Field */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search genre (EDM, Dance, Rock)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-black/60 border border-white/20 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF7099]"
              />
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="p-3 text-center text-white/40 text-xs">
                  No categories match "{query}"
                </div>
              ) : (
                filtered.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => {
                      onChange(cat.value);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      value === cat.value
                        ? 'bg-[#DF367C] text-white font-bold shadow-md'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    {value === cat.value && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
