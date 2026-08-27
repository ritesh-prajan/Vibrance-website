import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { FestEvent } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Zap,
  Flame,
  Info,
} from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { AmbientBlobs } from '../../components/common/AmbientBlobs';
import { GlitchText } from '../../components/common/GlitchText';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const EventsCatalogPage: React.FC = () => {
  const { events, setSelectedEvent } = useFest();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'POPULARITY' | 'DATE' | 'PRICE_ASC' | 'PRICE_DESC'>('POPULARITY');
  const [isLoading] = useState(false);

  const categories = [
    { label: 'All Passes', value: 'ALL' },
    { label: 'Pro-Shows', value: 'PRO_SHOW' },
    { label: 'EDM Nights', value: 'EDM' },
    { label: 'Rock Bands', value: 'BATTLE_OF_BANDS' },
    { label: 'Choreo Clashes', value: 'DANCE' },
    { label: 'Hackathons', value: 'HACKATHON' },
    { label: 'Stand-up Comedy', value: 'COMEDY' },
  ];

  const filteredEvents = events.filter((e) => {
    if (selectedCategory !== 'ALL' && e.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.artistOrHost.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'PRICE_ASC') return a.basePrice - b.basePrice;
    if (sortBy === 'PRICE_DESC') return b.basePrice - a.basePrice;
    if (sortBy === 'DATE') return a.date.localeCompare(b.date);
    return a.availableSeats - b.availableSeats;
  });

  const handleSelectSeats = (event: FestEvent) => {
    setSelectedEvent(event);
    navigate(`/events/${event.id}/seats`);
  };

  const handleViewDetails = (event: FestEvent) => {
    setSelectedEvent(event);
    navigate(`/events/${event.id}`);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
  };

  return (
    <div className="space-y-8">
      {/* 1. Hero Festival Banner with Glitch & Ambient Blobs */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#4C3549] via-[#2A1D26] to-[#2A1D26] border border-white/15 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <AmbientBlobs variant="hero" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#FF3E41] text-white shadow-md">
                MARCH 13–15, 2026
              </span>
              <span className="text-xs text-[#FF7099] font-mono flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#FF7099]" /> 50,000+ ATTENDEES &bull; 6 ARENAS
              </span>
            </div>

            <GlitchText
              as="h1"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08] font-display"
              delay={50}
            >
              VIBRANCE 2026 PASS RESERVATIONS
            </GlitchText>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl font-sans-body">
              Select your festival pro-show or competition passes below. Real-time seat locking with
              <strong> 3-Minute Hold TTL</strong> powered by <strong>Strict 2-Phase Locking (2PL)</strong>.
            </p>
          </div>

          {/* High Urgency Contention Card */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-[#4C3549]/90 border border-[#FF3E41]/40 rounded-2xl p-5 w-full lg:w-80 shrink-0 backdrop-blur-md space-y-3 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FF3E41] font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> CRITICAL CONTENTION
              </span>
              <span className="text-[9px] font-mono text-white/40">VIP SEATS</span>
            </div>

            <h3 className="text-base font-bold text-white leading-snug font-display">
              {events[0]?.title || 'PRO-SHOW: ARMAAN MALIK'}
            </h3>
            <p className="text-[11px] text-[#FF7099] font-mono">
              Only{' '}
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block font-bold text-white"
              >
                {events[0]?.availableSeats ?? 2}
              </motion.span>{' '}
              seats remaining in database!
            </p>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectSeats(events[0])}
              className="w-full py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Lock Seats Now (₹{events[0]?.basePrice || 699})</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all font-mono cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-[#FF3E41] text-white font-bold shadow-md'
                    : 'bg-[#4C3549] text-white/70 hover:text-white hover:bg-[#883955] border border-white/10'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search artist, stage, event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#4C3549] border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 focus:border-[#FF3E41] focus:outline-none font-mono"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#4C3549] border border-white/15 rounded-xl px-3 py-2 text-xs text-white/80 font-mono focus:border-[#FF3E41] focus:outline-none shrink-0"
            >
              <option value="POPULARITY">Sort: Contention / Scarcity</option>
              <option value="DATE">Sort: Event Date</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Events Grid with Stagger */}
      {isLoading ? (
        <SkeletonLoader count={6} />
      ) : sortedEvents.length === 0 ? (
        <EmptyState
          title="No Matching Festival Events"
          description="No events matched your filter criteria or search query. Try clearing your filters."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('ALL');
          }}
        />
      ) : (
        <motion.div
          key={`${selectedCategory}-${sortBy}-${searchQuery}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedEvents.map((event) => {
            const isHighContention = event.availableSeats <= 4;
            return (
              <motion.div
                key={event.id}
                variants={cardVariants}
                whileHover={{ y: -4, boxShadow: `0 16px 40px ${event.accentColor ?? '#FF3E41'}20` }}
                className="bg-[#4C3549] border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between transition-colors shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#883955] text-white">
                      {event.category.replace('_', ' ')}
                    </span>

                    {isHighContention ? (
                      <span className="text-[10px] font-mono font-bold text-[#FF3E41] bg-[#FF3E41]/10 px-2 py-0.5 rounded border border-[#FF3E41]/30 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <motion.span
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                          className="inline-block"
                        >
                          {event.availableSeats} Seats Left!
                        </motion.span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#FF7099] bg-[#883955]/30 px-2 py-0.5 rounded border border-[#883955]/50">
                        {event.availableSeats} Available
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-display tracking-wide group-hover:text-[#FF7099] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-white/60 font-mono mt-0.5">{event.artistOrHost}</p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs text-white/70 font-mono">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#FF7099] shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#FF7099] shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#FF7099] shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 line-clamp-2 pt-1 font-sans-body leading-relaxed">
                    {event.shortDesc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase">Base Pass</div>
                    <div className="text-base font-black text-white font-mono">
                      ₹{event.basePrice}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewDetails(event)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="View Full Details"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Details</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectSeats(event)}
                      className="px-4 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md flex items-center gap-1 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Select Seats</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
