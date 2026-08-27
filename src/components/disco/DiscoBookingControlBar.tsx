import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ChevronDown, Check, Sparkles, Clock, Ticket, ShieldCheck } from 'lucide-react';
import { DiscoLightsBackground } from '../common/DiscoLightsBackground';
import { DiscoSearchInput } from './DiscoSearchInput';
import { DiscoGenrePopdown } from './DiscoGenrePopdown';
import { DiscoViewToggle } from './DiscoViewToggle';
import { BookingStatusFilter } from '../../hooks/useBookingFilters';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface DiscoBookingControlBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: BookingStatusFilter;
  onStatusFilterChange: (status: BookingStatusFilter) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'GRID' | 'GROUPED';
  onViewModeChange: (mode: 'GRID' | 'GROUPED') => void;
  totalResults: number;
}

export const DiscoBookingControlBar: React.FC<DiscoBookingControlBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useOutsideClick(statusRef, () => setStatusOpen(false), statusOpen);
  useOutsideClick(sortRef, () => setSortOpen(false), sortOpen);

  const statusOptions: Array<{ value: BookingStatusFilter; label: string; icon: React.ReactNode; desc: string }> = [
    { value: 'ALL', label: 'All Passes', icon: <Sparkles className="w-3.5 h-3.5" />, desc: 'All active and spent passes' },
    { value: 'ACTIVE_INTACT', label: 'Active Passes (Intact)', icon: <Ticket className="w-3.5 h-3.5 text-[#10B981]" />, desc: 'Upcoming confirmed passes ready for entry' },
    { value: 'LIVE', label: 'Live Stages', icon: <Radio className="w-3.5 h-3.5 text-red-400" />, desc: 'Shows in progress right now' },
    { value: 'CHECKED_IN', label: 'Used at Gate (Torn)', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />, desc: 'Passes with verified admission stub' },
    { value: 'EXPIRED', label: 'Expired / Past (Torn)', icon: <Clock className="w-3.5 h-3.5 text-white/40" />, desc: 'Concluded festival events' },
  ];

  const sortOptions = [
    { value: 'SCHEDULE_EARLIEST', label: 'Show Schedule (Earliest First)' },
    { value: 'BOOKED_LATEST', label: 'Booking Date (Newest First)' },
    { value: 'PRICE_DESC', label: 'Amount: High to Low' },
    { value: 'PRICE_ASC', label: 'Amount: Low to High' },
  ];

  const activeStatusLabel = statusOptions.find((s) => s.value === statusFilter)?.label || 'Status';

  return (
    <div className="relative rounded-3xl bg-[#4C3549]/85 backdrop-blur-2xl border border-white/20 p-4 sm:p-5 shadow-[0_15px_45px_rgba(0,0,0,0.4)] font-mono text-xs z-30">
      {/* Contained Disco Light Beam Animations */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <DiscoLightsBackground intensity="vibrant" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        {/* Search */}
        <DiscoSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search pass ref, event, seat (e.g. VIB26, Armaan)..."
        />

        {/* Control Popdown Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Status Popdown */}
          <div ref={statusRef} className="relative z-50">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setStatusOpen(!statusOpen)}
              className={`px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                statusFilter !== 'ALL'
                  ? 'bg-[#FF3E41] text-white border-[#FF3E41] font-bold shadow-[0_0_15px_rgba(255,62,65,0.4)]'
                  : 'bg-[#2A1D26]/95 text-white/90 border-white/20 hover:border-white/40 hover:text-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-[#FF7099]" />
              <span className="truncate max-w-[130px] sm:max-w-[160px] font-bold">{activeStatusLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {statusOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-[#1f151c] border border-white/25 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] backdrop-blur-3xl space-y-1"
                >
                  <div className="px-3 py-1.5 text-[10px] text-white/40 font-bold uppercase tracking-wider border-b border-white/10">
                    Filter by Pass Status
                  </div>
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onStatusFilterChange(opt.value);
                        setStatusOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                        statusFilter === opt.value
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
                      {statusFilter === opt.value && <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Genre Popdown */}
          <DiscoGenrePopdown value={selectedCategory} onChange={onCategoryChange} />

          {/* Sort Popdown */}
          <div ref={sortRef} className="relative z-50">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setSortOpen(!sortOpen)}
              className="px-3.5 py-2.5 rounded-2xl bg-[#2A1D26]/95 border border-white/20 hover:border-white/40 text-white/90 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span className="font-bold">Sort</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-[#1f151c] border border-white/25 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] backdrop-blur-3xl space-y-1"
                >
                  <div className="px-3 py-1.5 text-[10px] text-white/40 font-bold uppercase tracking-wider border-b border-white/10">
                    Sort Passes By
                  </div>
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSortChange(opt.value);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                        sortBy === opt.value
                          ? 'bg-[#883955] text-white font-bold'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-xs truncate">{opt.label}</span>
                      {sortBy === opt.value && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Mode Toggle */}
          <DiscoViewToggle mode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>
    </div>
  );
};
