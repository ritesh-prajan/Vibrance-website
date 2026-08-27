import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { FestEvent } from '../../types';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Zap,
  Flame,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { AmbientBlobs } from '../../components/common/AmbientBlobs';
import { GlitchText } from '../../components/common/GlitchText';
import { EventCard } from '../../components/EventCard';
import { getEventTiming, sortEventsByTiming } from '../../utils/timeUtils';

export const EventsCatalogPage: React.FC = () => {
  const { events, setSelectedEvent } = useFest();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'LIVE_SOON' | 'UPCOMING' | 'EXPIRED'>('ALL');
  const [sortBy, setSortBy] = useState<any>('TIMING_CHRONOLOGICAL');

  const categories = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Pro-Shows', value: 'PRO_SHOW' },
    { label: 'EDM Nights', value: 'EDM' },
    { label: 'Rock Bands', value: 'BATTLE_OF_BANDS' },
    { label: 'Choreo Clashes', value: 'DANCE' },
    { label: 'Hackathons', value: 'HACKATHON' },
    { label: 'Stand-up Comedy', value: 'COMEDY' },
  ];

  const filteredEvents = events.filter((e) => {
    if (selectedCategory !== 'ALL' && e.category !== selectedCategory) return false;
    const timing = getEventTiming(e);

    if (timeFilter === 'LIVE_SOON') {
      if (!timing.isLive && timing.status !== 'STARTING_SOON') return false;
    } else if (timeFilter === 'UPCOMING') {
      if (timing.isExpired) return false;
    } else if (timeFilter === 'EXPIRED') {
      if (!timing.isExpired) return false;
    }

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

  const sortedEvents = sortEventsByTiming(filteredEvents, sortBy);

  const nextEvent = events.find((e) => {
    const t = getEventTiming(e);
    return t.isLive || t.status === 'STARTING_SOON';
  }) || events[0];

  const nextTiming = nextEvent ? getEventTiming(nextEvent) : null;

  const handleSelectSeats = (event: FestEvent) => {
    setSelectedEvent(event);
    navigate(`/events/${event.id}/seats`);
  };

  return (
    <div className="space-y-8">
      {/* 1. Hero Live Timeline Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#4C3549] via-[#2A1D26] to-[#2A1D26] border border-white/15 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <AmbientBlobs variant="hero" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#FF3E41] text-white shadow-md flex items-center gap-1.5">
                <Radio className="w-3 h-3 animate-ping" />
                REAL-TIME FESTIVAL SCHEDULE
              </span>
              <span className="text-xs text-[#FF7099] font-mono flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#FF7099]" /> STRICT 2PL CONCURRENCY ENGINE ACTIVE
              </span>
            </div>

            <GlitchText
              as="h1"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08] font-display"
              delay={50}
            >
              FESTIVAL PASS RESERVATIONS
            </GlitchText>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl font-sans-body">
              All festival stages are ordered in <strong>real-time chronological sequence</strong>. Pass reservation holds expire after 3 minutes under Strict 2PL lease concurrency.
            </p>
          </div>

          {/* Next Up Highlight Card */}
          {nextEvent && nextTiming && (
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-[#4C3549]/95 border-2 border-[#FF3E41]/60 rounded-2xl p-5 w-full lg:w-88 shrink-0 backdrop-blur-md space-y-3 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#FF3E41] font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-[#FF3E41]" />
                  {nextTiming.isLive ? '🔴 LIVE ON STAGE' : '⚡ NEXT UPCOMING SHOW'}
                </span>
                <span className="text-[10px] font-mono text-[#FF7099] font-bold">
                  {nextTiming.countdownText}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug font-display">
                {nextEvent.title}
              </h3>
              <p className="text-xs text-white/60 font-mono">
                {nextTiming.formattedDate} &bull; {nextTiming.formattedTime}
              </p>

              <div className="pt-1">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectSeats(nextEvent)}
                  disabled={nextTiming.isExpired}
                  className="w-full py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Reserve Seats (&#8377;{nextEvent.basePrice})</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 2. Real-Time Status Filter Tabs + Search & Sorting */}
      <div className="space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10">
          <button
            onClick={() => setTimeFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
              timeFilter === 'ALL' ? 'bg-[#FF3E41] text-white shadow-md' : 'bg-[#4C3549] text-white/70 hover:text-white'
            }`}
          >
            All Passes ({events.length})
          </button>
          <button
            onClick={() => setTimeFilter('LIVE_SOON')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
              timeFilter === 'LIVE_SOON' ? 'bg-red-500 text-white shadow-md' : 'bg-[#4C3549] text-red-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>Live &amp; Starting Soon</span>
          </button>
          <button
            onClick={() => setTimeFilter('UPCOMING')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
              timeFilter === 'UPCOMING' ? 'bg-[#883955] text-white shadow-md' : 'bg-[#4C3549] text-white/70 hover:text-white'
            }`}
          >
            Upcoming Schedule
          </button>
          <button
            onClick={() => setTimeFilter('EXPIRED')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
              timeFilter === 'EXPIRED' ? 'bg-white/20 text-white shadow-md' : 'bg-[#4C3549] text-white/40 hover:text-white'
            }`}
          >
            Concluded / Expired
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-[#883955] text-white font-bold border border-white/20'
                    : 'bg-[#2A1D26] text-white/60 hover:text-white hover:bg-[#4C3549] border border-white/10'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search stage, artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#4C3549] border border-white/15 rounded-xl pl-9 pr-4 py-2 text-white placeholder-white/40 focus:border-[#FF3E41] focus:outline-none"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#4C3549] border border-white/15 rounded-xl px-3 py-2 text-white/90 focus:border-[#FF3E41] focus:outline-none shrink-0 font-bold"
            >
              <option value="TIMING_CHRONOLOGICAL">Sort: Real-Time Schedule (Earliest First)</option>
              <option value="STARTING_SOONEST">Sort: Starting Soonest / Live</option>
              <option value="POPULARITY">Sort: Seats Remaining / Contention</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Event Cards Grid */}
      {sortedEvents.length === 0 ? (
        <EmptyState
          title="No Matching Festival Events"
          description="No events match your current real-time filter or search query."
          actionText="Reset All Filters"
          actionPath="/events"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} onSelectSeats={handleSelectSeats} />
          ))}
        </div>
      )}
    </div>
  );
};
