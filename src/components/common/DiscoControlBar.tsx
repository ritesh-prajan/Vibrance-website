import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Check,
  Radio,
  Zap,
  Calendar,
  Clock,
  Sparkles,
  Grid,
  Layers,
} from 'lucide-react';
import { DiscoLightsBackground } from './DiscoLightsBackground';

export interface DiscoControlBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  timeFilter: 'ALL' | 'LIVE_SOON' | 'UPCOMING' | 'EXPIRED';
  onTimeFilterChange: (t: 'ALL' | 'LIVE_SOON' | 'UPCOMING' | 'EXPIRED') => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'GRID' | 'GROUPED';
  onViewModeChange: (mode: 'GRID' | 'GROUPED') => void;
  totalResults: number;
}

export const DiscoControlBar: React.FC<DiscoControlBarProps> = ({
  searchQuery,
  onSearchChange,
  timeFilter,
  onTimeFilterChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
}) => {
  const [timePopdownOpen, setTimePopdownOpen] = useState(false);
  const [categoryPopdownOpen, setCategoryPopdownOpen] = useState(false);
  const [sortPopdownOpen, setSortPopdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  const timeRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) setTimePopdownOpen(false);
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCategoryPopdownOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortPopdownOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const timeOptions = [
    { value: 'ALL', label: 'All Statuses', icon: <Sparkles className="w-3.5 h-3.5" />, desc: 'All active & past festival shows' },
    { value: 'LIVE_SOON', label: '🔴 Live & Starting Soon', icon: <Radio className="w-3.5 h-3.5 text-red-400" />, desc: 'Shows happening right now or in < 2h' },
    { value: 'UPCOMING', label: '📅 Upcoming Schedule', icon: <Calendar className="w-3.5 h-3.5 text-[#FF7099]" />, desc: 'Future concert lineup & reservations' },
    { value: 'EXPIRED', label: '⏱️ Concluded / Expired', icon: <Clock className="w-3.5 h-3.5 text-white/40" />, desc: 'Past events with closed admission' },
  ];

  const categoryOptions = [
    { value: 'ALL', label: 'All Genres & Stages', count: 6 },
    { value: 'PRO_SHOW', label: '🎤 Pro-Shows Live Concerts', count: 1 },
    { value: 'EDM', label: '🎧 EDM & Visual Pyrotechnics', count: 1 },
    { value: 'DANCE', label: '💃 Choreonite & Urban Clash', count: 1 },
    { value: 'COMEDY', label: '🎭 Stand-up Comedy Specials', count: 1 },
    { value: 'BATTLE_OF_BANDS', label: '🎸 Rock Band Decibel Wars', count: 1 },
    { value: 'HACKATHON', label: '💻 36-Hour Hackathon Build', count: 1 },
  ];

  const sortOptions = [
    { value: 'TIMING_CHRONOLOGICAL', label: '🕒 Real-Time Schedule (Earliest First)' },
    { value: 'STARTING_SOONEST', label: '⚡ Starting Soonest / Live First' },
    { value: 'POPULARITY', label: '🔥 Seat Contention (Fewest Seats Left)' },
    { value: 'PRICE_ASC', label: '💰 Price: Low to High' },
    { value: 'PRICE_DESC', label: '💎 Price: High to Low' },
  ];

  const activeTimeLabel = timeOptions.find((t) => t.value === timeFilter)?.label || 'Status';
  const activeCatLabel = categoryOptions.find((c) => c.value === selectedCategory)?.label || 'Genre';
  const activeSortLabel = sortOptions.find((s) => s.value === sortBy)?.label || 'Sort';

  const filteredCategories = categoryOptions.filter((c) =>
    c.label.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="relative rounded-3xl bg-[#4C3549]/85 backdrop-blur-2xl border border-white/20 p-4 sm:p-5 shadow-[0_15px_45px_rgba(0,0,0,0.4)] overflow-hidden font-mono text-xs z-30">
      {/* ─── Embedded Disco Stage Lights ─── */}
      <DiscoLightsBackground intensity="vibrant" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        {/* 1. Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search stage, artist, venue (e.g. Armaan, Zaeden, Hack)..."
            className="w-full bg-[#2A1D26]/90 border border-white/20 rounded-2xl pl-10 pr-9 py-2.5 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#FF3E41] shadow-inner transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 2. Control Pills Container */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Popdown 1: Live & Schedule Status */}
          <div ref={timeRef} className="relative">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setTimePopdownOpen(!timePopdownOpen);
                setCategoryPopdownOpen(false);
                setSortPopdownOpen(false);
              }}
              className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                timeFilter !== 'ALL'
                  ? 'bg-[#FF3E41] text-white border-[#FF3E41] font-bold shadow-[0_0_15px_rgba(255,62,65,0.3)]'
                  : 'bg-[#2A1D26]/90 text-white/80 border-white/20 hover:border-white/40 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-[#FF7099]" />
              <span className="truncate max-w-[130px] sm:max-w-[160px] font-bold">{activeTimeLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${timePopdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {timePopdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-[#2A1D26] border border-white/20 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-2xl space-y-1"
                >
                  <div className="px-3 py-1.5 text-[10px] text-white/40 font-bold uppercase tracking-wider border-b border-white/10">
                    Filter by Stage Status
                  </div>
                  {timeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onTimeFilterChange(opt.value as any);
                        setTimePopdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                        timeFilter === opt.value
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
                      {timeFilter === opt.value && <Check className="w-4 h-4 text-[#FF7099] shrink-0 mt-0.5" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Popdown 2: Event Genre / Category with in-built search */}
          <div ref={catRef} className="relative">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setCategoryPopdownOpen(!categoryPopdownOpen);
                setTimePopdownOpen(false);
                setSortPopdownOpen(false);
              }}
              className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                selectedCategory !== 'ALL'
                  ? 'bg-[#DF367C] text-white border-[#DF367C] font-bold shadow-[0_0_15px_rgba(223,54,124,0.3)]'
                  : 'bg-[#2A1D26]/90 text-white/80 border-white/20 hover:border-white/40 hover:text-white'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-[#FF7099]" />
              <span className="truncate max-w-[120px] sm:max-w-[150px] font-bold">{activeCatLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoryPopdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {categoryPopdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-[#2A1D26] border border-white/20 rounded-2xl p-2.5 shadow-2xl z-50 backdrop-blur-2xl space-y-2"
                >
                  {/* Built-in category search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter genres..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF7099]"
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                    {filteredCategories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          onCategoryChange(cat.value);
                          setCategoryPopdownOpen(false);
                          setCategorySearch('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                          selectedCategory === cat.value
                            ? 'bg-[#DF367C]/20 text-white border border-[#DF367C]/40 font-bold'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{cat.label}</span>
                        {selectedCategory === cat.value && <Check className="w-3.5 h-3.5 text-[#FF7099] shrink-0" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Popdown 3: Sorting Options */}
          <div ref={sortRef} className="relative">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setSortPopdownOpen(!sortPopdownOpen);
                setTimePopdownOpen(false);
                setCategoryPopdownOpen(false);
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-[#2A1D26]/90 border border-white/20 hover:border-white/40 text-white/80 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#FF7099]" />
              <span className="hidden sm:inline font-bold">Sort</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortPopdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {sortPopdownOpen && (
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
                        onSortChange(opt.value);
                        setSortPopdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                        sortBy === opt.value
                          ? 'bg-[#FF3E41]/20 text-white border border-[#FF3E41]/40 font-bold'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-xs truncate">{opt.label}</span>
                      {sortBy === opt.value && <Check className="w-3.5 h-3.5 text-[#FF7099] shrink-0" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Mode Toggle: Grid vs Grouped Swimlanes */}
          <div className="flex items-center bg-[#2A1D26]/90 border border-white/20 rounded-2xl p-1 shadow-inner">
            <button
              onClick={() => onViewModeChange('GRID')}
              title="Modern Grid Cards"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'GRID' ? 'bg-[#FF3E41] text-white shadow-md' : 'text-white/40 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('GROUPED')}
              title="Timeline Category Sections"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'GROUPED' ? 'bg-[#FF3E41] text-white shadow-md' : 'text-white/40 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
