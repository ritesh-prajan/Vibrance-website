import os

def w(p, c):
    os.makedirs(os.path.dirname(os.path.abspath(p)), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c.strip() + "\n")
    print(f'Wrote {p}')

# ─── RegisterPage.tsx ───
w('src/pages/public/RegisterPage.tsx', """import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AmbientBlobs } from '../../components/common/AmbientBlobs';
import { GlitchText } from '../../components/common/GlitchText';

export const RegisterPage: React.FC = () => {
  const { loginAsStudent } = useFest();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year (B.Tech)');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regNumber.trim()) return;

    loginAsStudent(name, regNumber, department, year);
    navigate('/events', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#2A1D26] text-[#F3EDF2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <AmbientBlobs variant="login" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF3E41] to-[#DF367C] text-white font-display font-black text-xl shadow-lg mb-3"
        >
          V
        </motion.div>
        <GlitchText
          as="h1"
          className="text-3xl font-black text-white font-display tracking-wide"
          delay={50}
        >
          STUDENT REGISTRATION
        </GlitchText>
        <p className="mt-1 text-xs text-[#FF7099] font-mono">
          Vibrance 2026 Pass Reservation Account
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 relative z-10"
      >
        <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RA2111003010142"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  College Email
                </label>
                <input
                  type="email"
                  placeholder="student@vibrance.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3E41]"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Management Studies">Management Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3E41]"
                >
                  <option value="1st Year (B.Tech)">1st Year (B.Tech)</option>
                  <option value="2nd Year (B.Tech)">2nd Year (B.Tech)</option>
                  <option value="3rd Year (B.Tech)">3rd Year (B.Tech)</option>
                  <option value="4th Year (B.Tech)">4th Year (B.Tech)</option>
                  <option value="Postgraduate / M.Tech">Postgraduate / M.Tech</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold font-mono text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Complete Registration &amp; Enter</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </form>

          <div className="pt-2 border-t border-white/10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Already registered? Back to Login</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
""")

# ─── EventsCatalogPage.tsx ───
w('src/pages/student/EventsCatalogPage.tsx', """import React, { useState } from 'react';
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
""")

# ─── SeatSelectionPage.tsx ───
w('src/pages/student/SeatSelectionPage.tsx', """import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Seat } from '../../types';
import { Clock, Ticket, ArrowRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const SeatSelectionPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { events, activeSeat, seatLockTimeRemaining, selectSeatForBooking, releaseActiveSeat } = useFest();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();

  const [conflictMsg, setConflictMsg] = useState<string | null>(null);

  const event = events.find((e) => e.id === eventId) || events[0];

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeatClick = (seat: Seat) => {
    setConflictMsg(null);

    if (seat.status === 'booked') {
      setConflictMsg(`Seat [${seat.row}-${seat.number}] is already booked and unavailable.`);
      return;
    }

    if (seat.status === 'locked') {
      setConflictMsg(`Locked — held by another user in real time.`);
      return;
    }

    if (activeSeat?.id === seat.id) {
      releaseActiveSeat();
      return;
    }

    const ok = selectSeatForBooking(event, seat);
    if (!ok) {
      setConflictMsg(`Seat just taken — pick another seat.`);
    }
  };

  const handleProceedToCheckout = () => {
    if (!activeSeat) return;
    navigate(`/checkout/${event.id}`);
  };

  // Group seats by row
  const rowsMap: { [row: string]: Seat[] } = {};
  event.seats.forEach((s) => {
    if (!rowsMap[s.row]) rowsMap[s.row] = [];
    rowsMap[s.row].push(s);
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Events Catalog', path: '/events' },
          { label: event.title, path: `/events/${event.id}` },
          { label: 'Seat Map Selection' },
        ]}
        backLink={{ label: 'Back to Event Details', path: `/events/${event.id}` }}
      />

      {/* Sticky Top Notification Bar if Seat is Held */}
      <AnimatePresence>
        {activeSeat && seatLockTimeRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-[#4C3549] border-2 border-[#FF3E41] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF3E41] text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <span>SEAT [{activeSeat.row}-{activeSeat.number}] EXCLUSIVELY HELD</span>
                  <motion.span
                    animate={{
                      backgroundColor:
                        seatLockTimeRemaining <= 10
                          ? ['#FF3E41', '#FF0000', '#FF3E41']
                          : seatLockTimeRemaining <= 30
                          ? ['#FF3E41', '#f59e0b', '#FF3E41']
                          : ['#FF3E41'],
                    }}
                    transition={{
                      duration: seatLockTimeRemaining <= 10 ? 0.6 : 1.5,
                      repeat: Infinity,
                    }}
                    className="px-2 py-0.5 rounded text-white text-[11px] font-bold"
                  >
                    {formatTimer(seatLockTimeRemaining)} Remaining
                  </motion.span>
                </div>
                <p className="text-[11px] text-white/70 font-sans-body">
                  3-minute pessimistic lease lock active. Complete checkout before timer expires.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={releaseActiveSeat}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors cursor-pointer"
              >
                Release Seat
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleProceedToCheckout}
                className="px-5 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conflict Alert Banner */}
      <AnimatePresence>
        {conflictMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 text-red-300 text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{conflictMsg}</span>
            </div>
            <button
              onClick={() => setConflictMsg(null)}
              className="text-white/60 hover:text-white font-bold cursor-pointer"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Venue Seat Map + Summary Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2A1D26] via-[#883955] to-[#2A1D26] border border-white/20 text-center font-mono font-black text-xs tracking-widest text-white shadow-inner uppercase">
            ★★★ STAGE / SCREEN PROJECTION AREA ★★★
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 py-2 border-y border-white/10 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#883955]/40 border border-[#FF7099]/60" />
              <span className="text-white/80">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#FF3E41] border border-white" />
              <span className="text-white font-bold">Your Selected Seat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#F59E0B]/30 border border-[#F59E0B]" />
              <span className="text-amber-300">Locked (Other User)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#2A1D26] border border-white/10 opacity-40" />
              <span className="text-white/40">Booked</span>
            </div>
          </div>

          <div className="space-y-4 py-4 max-w-2xl mx-auto overflow-x-auto">
            {Object.keys(rowsMap).map((rowKey, rIdx) => {
              const rowSeats = rowsMap[rowKey];
              const tierLabel =
                rowKey === 'A' || rowKey === 'B'
                  ? 'VIP FRONT (₹' + Math.round(event.basePrice * 1.5) + ')'
                  : rowKey === 'C' || rowKey === 'D'
                  ? 'GOLD (₹' + Math.round(event.basePrice * 1.25) + ')'
                  : 'REGULAR (₹' + event.basePrice + ')';

              return (
                <motion.div
                  key={rowKey}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rIdx * 0.04, duration: 0.2 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50 px-2">
                    <span className="font-bold text-white/70">ROW {rowKey}</span>
                    <span>{tierLabel}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    {rowSeats.map((seat, idx) => {
                      const isSelectedByMe = activeSeat?.id === seat.id;
                      const isLocked = seat.status === 'locked';
                      const isBooked = seat.status === 'booked';

                      const isAisleBreak = idx === Math.floor(rowSeats.length / 2);

                      let seatClass =
                        'w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer border';

                      if (isSelectedByMe) {
                        seatClass += ' bg-[#FF3E41] text-white border-white shadow-lg';
                      } else if (isLocked) {
                        seatClass +=
                          ' bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40 hover:border-[#F59E0B]';
                      } else if (isBooked) {
                        seatClass +=
                          ' bg-[#2A1D26] text-white/20 border-white/5 cursor-not-allowed opacity-50';
                      } else {
                        seatClass +=
                          ' bg-[#883955]/30 text-white border-[#883955]/60 hover:bg-[#883955] hover:border-white/40';
                      }

                      return (
                        <React.Fragment key={seat.id}>
                          {isAisleBreak && <div className="w-4 sm:w-6" />}
                          <motion.button
                            type="button"
                            whileTap={!isBooked && !isLocked ? { scale: 1.18 } : undefined}
                            animate={
                              isLocked
                                ? { opacity: [0.6, 1, 0.6] }
                                : isSelectedByMe
                                ? { scale: [1, 1.05, 1] }
                                : { opacity: 1 }
                            }
                            transition={
                              isLocked
                                ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                                : isSelectedByMe
                                ? { duration: 0.3 }
                                : undefined
                            }
                            onClick={() => handleSeatClick(seat)}
                            disabled={isBooked}
                            className={seatClass}
                            title={`Seat ${seat.row}-${seat.number} (${seat.category}): ₹${seat.price}`}
                          >
                            {seat.number}
                          </motion.button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Persistent Booking Summary Panel */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              RESERVATION SUMMARY
            </h2>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Selected Event</div>
                <div className="font-bold text-white text-sm">{event.title}</div>
                <div className="text-white/60">{event.date} • {event.time}</div>
                <div className="text-white/40 truncate">{event.venue}</div>
              </div>

              <AnimatePresence mode="wait">
                {activeSeat ? (
                  <motion.div
                    key={activeSeat.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-3.5 rounded-xl bg-[#883955]/40 border border-[#FF7099]/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/60 uppercase">Selected Seat</span>
                      <span className="px-2 py-0.5 rounded bg-[#FF3E41] text-white font-bold text-[10px]">
                        HELD
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-white">
                        Seat {activeSeat.row}-{activeSeat.number}
                      </span>
                      <span className="text-base font-black text-[#FF7099]">
                        ₹{activeSeat.price}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/70">
                      Tier: {activeSeat.category.replace('_', ' ')}
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-5 rounded-xl bg-[#2A1D26] border border-dashed border-white/20 text-center text-white/50 text-xs">
                    <Ticket className="w-6 h-6 mx-auto mb-2 text-white/30" />
                    <span>Click an available seat on the venue map to hold it for 3 minutes.</span>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {activeSeat && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
""")

# ─── CheckoutPage.tsx ───
w('src/pages/student/CheckoutPage.tsx', """import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { motion } from 'framer-motion';
import {
  Clock,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const {
    events,
    currentUser,
    activeSeat,
    seatLockTimeRemaining,
    confirmBooking,
  } = useFest();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === eventId) || events[0];

  const [name, setName] = useState(currentUser?.name || 'Rahul Sharma');
  const [regNumber, setRegNumber] = useState(currentUser?.regNumber || 'RA2111003010142');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science & Engineering');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CAMPUS_CARD' | 'NET_BANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeSeat || seatLockTimeRemaining <= 0) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Events Catalog', path: '/events' },
            { label: event.title, path: `/events/${event.id}` },
            { label: 'Checkout' },
          ]}
          backLink={{ label: 'Back to Seat Map', path: `/events/${event.id}/seats` }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#4C3549] border border-white/15 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl space-y-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              SEAT LEASE TIMEOUT
            </span>
            <h2 className="text-2xl font-black text-white font-display tracking-wide pt-1">
              Reservation Window Expired
            </h2>
            <p className="text-xs text-white/60 font-sans-body leading-relaxed max-w-sm mx-auto">
              Your 3-minute seat hold lease has expired and the seat was released back to the festival inventory pool.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to={`/events/${event.id}/seats`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-lg gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Select Seats Again</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const basePrice = activeSeat.price;
  const convenienceFee = 25;
  const gst = Math.round(basePrice * 0.05);
  const totalAmount = basePrice + convenienceFee + gst;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regNumber.trim()) {
      setErrorMsg('Please fill in attendee details.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const booking = await confirmBooking({
      name,
      regNumber,
      department,
      paymentMethod,
    });

    if (booking) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate(`/ticket/${booking.id}`);
      }, 450);
    } else {
      setIsProcessing(false);
      setErrorMsg('Failed to serialize transaction. Lock lease expired or lost update prevented.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Events Catalog', path: '/events' },
          { label: event.title, path: `/events/${event.id}` },
          { label: 'Seat Selection', path: `/events/${event.id}/seats` },
          { label: 'Payment Checkout' },
        ]}
        backLink={{ label: 'Change Seat Selection', path: `/events/${event.id}/seats` }}
      />

      {/* Sticky Hold Timer Warning Strip */}
      <div className="bg-[#4C3549] border-2 border-[#FF3E41] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF3E41] text-white flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span>HOLD EXPIRES IN</span>
              <span className="px-2 py-0.5 rounded bg-[#FF3E41] text-white text-[11px]">
                {formatTimer(seatLockTimeRemaining)}
              </span>
            </div>
            <p className="text-[11px] text-white/70 font-sans-body">
              Seat [{activeSeat.row}-{activeSeat.number}] will be auto-released if payment is not finalized.
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-[10px] text-white/40 uppercase block">Total Due</span>
          <span className="text-xl font-black text-white font-mono">₹{totalAmount}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center gap-2 text-red-300 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Attendee Details & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              1. ATTENDEE VERIFICATION
            </h2>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-white/70 mb-1 uppercase text-[10px]">
                  Attendee Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 uppercase text-[10px]">
                    Registration / Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 uppercase text-[10px]">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              2. PAYMENT GATEWAY (SANDBOX SIMULATION)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              {[
                { id: 'UPI', label: 'UPI / QR', desc: 'GooglePay, PhonePe, Paytm', icon: <Smartphone className="w-5 h-5" /> },
                { id: 'CAMPUS_CARD', label: 'Campus SmartCard', desc: 'Auto-debit from student wallet', icon: <CreditCard className="w-5 h-5" /> },
                { id: 'NET_BANKING', label: 'Net Banking', desc: 'SBI, HDFC, ICICI, Axis', icon: <Building className="w-5 h-5" /> },
              ].map((m) => (
                <motion.button
                  key={m.id}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    paymentMethod === m.id
                      ? 'border-[#FF3E41] bg-[#FF3E41]/10 text-white'
                      : 'border-white/10 bg-[#2A1D26] text-white/70 hover:border-white/20'
                  }`}
                >
                  <div className="text-[#FF7099]">{m.icon}</div>
                  <div>
                    <div className="font-bold text-white">{m.label}</div>
                    <div className="text-[10px] text-white/50">{m.desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              ORDER SUMMARY
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="font-bold text-white">{event.title}</div>
                <div className="text-white/60">{event.date} • {event.time}</div>
                <div className="text-[#FF7099] pt-1">
                  Seat: Row {activeSeat.row} - #{activeSeat.number} ({activeSeat.category})
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 text-white/80">
                <div className="flex justify-between">
                  <span className="text-white/60">Base Ticket Pass:</span>
                  <span>₹{basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Convenience / Tech Fee:</span>
                  <span>₹{convenienceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">GST (5%):</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-base font-black text-white">
                  <span>Total Amount:</span>
                  <span className="text-[#FF7099]">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold font-mono text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isProcessing ? (
                isSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-white"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    <span>Booking Confirmed!</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                      className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Acquiring 2PL Commit...</span>
                  </div>
                )
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pay ₹{totalAmount} &amp; Issue Pass</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};
""")

# ─── TicketPage.tsx ───
w('src/pages/student/TicketPage.tsx', """import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const TicketPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { allBookings } = useFest();

  const booking = allBookings.find(
    (b) => b.id === bookingId || b.bookingRef === bookingId
  );

  if (!booking) {
    return (
      <div>
        <Breadcrumbs
          items={[{ label: 'My Bookings', path: '/my-bookings' }, { label: 'Ticket Not Found' }]}
          backLink={{ label: 'Back to Passes', path: '/my-bookings' }}
        />
        <EmptyState
          title="Pass Not Found"
          description="The requested ticket could not be located in the booking records."
          actionText="View All My Bookings"
          actionPath="/my-bookings"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'My Bookings', path: '/my-bookings' },
          { label: `Pass ${booking.bookingRef}` },
        ]}
        backLink={{ label: 'Back to My Bookings', path: '/my-bookings' }}
      />

      {/* Confirmation Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#10B981]/20 border border-[#10B981]/40 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs font-mono text-[#10B981]"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            <strong>Booking Confirmed &amp; Serialized!</strong> Reference code: {booking.bookingRef}
          </span>
        </div>
        <Link
          to="/my-bookings"
          className="text-white hover:underline text-xs font-bold"
        >
          View in My Bookings &rarr;
        </Link>
      </motion.div>

      {/* Digital Festival Pass Card Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 ticket-notch-left ticket-notch-right"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF3E41] to-[#DF367C] text-white font-display font-black text-2xl flex items-center justify-center shadow-lg">
              V
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#FF7099] uppercase tracking-wider font-bold">
                VIBRANCE 2026 OFFICIAL PASS
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display tracking-wide">
                {booking.eventTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} size="lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Attendee Name</div>
                <div className="font-bold text-white text-sm">{booking.studentName}</div>
                <div className="text-[#FF7099]">{booking.regNumber}</div>
                <div className="text-[10px] text-white/50 truncate">{booking.department}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Seat &amp; Tier</div>
                <div className="font-black text-white text-base">Seat {booking.seatLabel}</div>
                <div className="text-white/60">Tier: {booking.tier}</div>
                <div className="text-[#10B981] font-bold">Paid: ₹{booking.amount}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Date &amp; Schedule</div>
                <div className="text-white font-bold">{booking.date}</div>
                <div className="text-white/60">{booking.time}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Venue Stage</div>
                <div className="text-white font-bold truncate">{booking.venue}</div>
                <div className="text-[#FF7099]">Gate Post Alpha</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#883955]/30 border border-[#FF7099]/30 text-xs font-mono flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#FF7099] shrink-0" />
              <div>
                <span className="font-bold text-white">ACID Serializable Guarantee:</span>
                <p className="text-white/70 text-[11px] mt-0.5">
                  This e-pass is backed by Strict 2PL concurrency verification. Present QR code at the arena gate.
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Placeholder with Staggered Fade/Scale In */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="flex flex-col items-center justify-between p-5 bg-[#2A1D26] rounded-2xl border border-white/15 text-center space-y-4"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase">Digital Gate Pass QR</span>
              <div className="p-4 bg-white rounded-2xl shadow-inner flex items-center justify-center my-2">
                <QrCode className="w-32 h-32 text-black" />
              </div>
              <div className="text-[11px] font-mono font-bold text-[#FF7099]">
                {booking.bookingRef}
              </div>
            </div>

            <div className="w-full flex items-center gap-2 pt-2 border-t border-white/10 font-mono text-xs">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigator.clipboard?.writeText(booking.bookingRef);
                  alert('Pass reference copied to clipboard!');
                }}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
""")

# ─── AdminConcurrencyLabPage.tsx ─── real-time streaming rows, flash highlights, count-up stats
w('src/pages/admin/AdminConcurrencyLabPage.tsx', """import React, { useState, useEffect, useRef } from 'react';
import { useFest } from '../../context/FestContext';
import { ConcurrencyStrategy, SimulatedTx, ConcurrencyRunResult } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  Cpu,
  Play,
  Columns,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Code,
  Layers,
  Clock,
  RotateCcw,
  Zap,
} from 'lucide-react';

export const AdminConcurrencyLabPage: React.FC = () => {
  const {
    events,
    runConcurrencySimulation,
    runSideBySideSimulation,
    isSimulating,
    simulationProgress,
    lastSimResult,
    lastSideBySideResult,
    resetDatabaseState,
  } = useFest();

  const reduced = usePrefersReducedMotion();

  const [strategy, setStrategy] = useState<ConcurrencyStrategy>('TWO_PHASE_LOCKING');
  const [concurrencyLevel, setConcurrencyLevel] = useState<number>(25);
  const [targetEventId, setTargetEventId] = useState<string>(events[0]?.id || 'evt-armaan');
  const [showSqlTrace, setShowSqlTrace] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'SINGLE' | 'SIDE_BY_SIDE'>('SINGLE');

  // Real-time streamed transactions for presentation feed
  const [streamedSingleTxs, setStreamedSingleTxs] = useState<SimulatedTx[]>([]);
  const [streamedNoLockTxs, setStreamedNoLockTxs] = useState<SimulatedTx[]>([]);
  const [streamedTwoPlTxs, setStreamedTwoPlTxs] = useState<SimulatedTx[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  const handleRunSingle = async () => {
    setViewMode('SINGLE');
    setStreamedSingleTxs([]);
    const res = await runConcurrencySimulation({
      strategy,
      concurrencyLevel,
      targetEventId,
    });
    if (res && res.transactions) {
      streamTransactions(res.transactions, setStreamedSingleTxs);
    }
  };

  const handleRunSideBySide = async () => {
    setViewMode('SIDE_BY_SIDE');
    setStreamedNoLockTxs([]);
    setStreamedTwoPlTxs([]);
    const res = await runSideBySideSimulation({
      concurrencyLevel,
      targetEventId,
    });
    if (res) {
      streamSideBySide(res.noLockResult.transactions, res.twoPlResult.transactions);
    }
  };

  const streamTransactions = (all: SimulatedTx[], setter: React.Dispatch<React.SetStateAction<SimulatedTx[]>>) => {
    if (reduced) {
      setter(all);
      return;
    }
    setIsStreaming(true);
    let index = 0;
    setter([]);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      index++;
      setter(all.slice(0, index));
      if (index >= all.length) {
        clearInterval(timerRef.current);
        setIsStreaming(false);
      }
    }, 110);
  };

  const streamSideBySide = (noLock: SimulatedTx[], twoPl: SimulatedTx[]) => {
    if (reduced) {
      setStreamedNoLockTxs(noLock);
      setStreamedTwoPlTxs(twoPl);
      return;
    }
    setIsStreaming(true);
    let index = 0;
    const max = Math.max(noLock.length, twoPl.length);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      index++;
      setStreamedNoLockTxs(noLock.slice(0, index));
      setStreamedTwoPlTxs(twoPl.slice(0, index));
      if (index >= max) {
        clearInterval(timerRef.current);
        setIsStreaming(false);
      }
    }, 110);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update streamed transactions if lastSimResult exists on mount
  useEffect(() => {
    if (lastSimResult && streamedSingleTxs.length === 0 && !isSimulating) {
      setStreamedSingleTxs(lastSimResult.transactions);
    }
  }, [lastSimResult]);

  useEffect(() => {
    if (lastSideBySideResult && streamedNoLockTxs.length === 0 && !isSimulating) {
      setStreamedNoLockTxs(lastSideBySideResult.noLockResult.transactions);
      setStreamedTwoPlTxs(lastSideBySideResult.twoPlResult.transactions);
    }
  }, [lastSideBySideResult]);

  const singleCommitted = useCountUp(lastSimResult?.successfulCount ?? 0, 700);
  const singleRejected = useCountUp(lastSimResult?.rejectedCount ?? 0, 700);
  const singleFinalStock = useCountUp(lastSimResult?.finalStock ?? 0, 700);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">
              DBMS TRANSACTION BENCHMARK
            </span>
            <span className="text-xs text-white/50 font-mono">Serializability &amp; Race Condition Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            CONCURRENCY CONTROL SIMULATOR
          </h1>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={resetDatabaseState}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Inventory Baseline</span>
        </motion.button>
      </div>

      {/* Control Panel Card */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* 1. Protocol Select */}
          <div className="space-y-2">
            <label className="block font-bold text-white/80 uppercase">
              1. Isolation Strategy
            </label>
            <select
              value={strategy}
              onChange={(e: any) => setStrategy(e.target.value)}
              disabled={isSimulating || isStreaming}
              className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-[#DF367C] disabled:opacity-50"
            >
              <option value="NO_LOCKING">No Locking (Dirty Read / Lost Update Overbook)</option>
              <option value="TWO_PHASE_LOCKING">Strict 2-Phase Locking (Serializable 2PL)</option>
              <option value="OPTIMISTIC_OCC">Optimistic Concurrency Control (OCC Versioning)</option>
            </select>
          </div>

          {/* 2. Concurrency Level */}
          <div className="space-y-2">
            <label className="block font-bold text-white/80 uppercase">
              2. Concurrency Volume
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 25, 50].map((lvl) => (
                <motion.button
                  key={lvl}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConcurrencyLevel(lvl)}
                  disabled={isSimulating || isStreaming}
                  className={`py-3 rounded-xl font-bold transition-colors cursor-pointer ${
                    concurrencyLevel === lvl
                      ? 'bg-[#DF367C] text-white shadow-md'
                      : 'bg-[#2A1D26] text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  {lvl} Req
                </motion.button>
              ))}
            </div>
          </div>

          {/* 3. Target Resource */}
          <div className="space-y-2">
            <label className="block font-bold text-white/80 uppercase">
              3. Target Seat Resource
            </label>
            <select
              value={targetEventId}
              onChange={(e) => setTargetEventId(e.target.value)}
              disabled={isSimulating || isStreaming}
              className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-[#DF367C] disabled:opacity-50"
            >
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} (1 unit test stock)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRunSingle}
            disabled={isSimulating || isStreaming}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#DF367C] hover:bg-[#c42867] text-white font-bold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Run Single Protocol ({strategy.replace('_', ' ')})</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRunSideBySide}
            disabled={isSimulating || isStreaming}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Columns className="w-4 h-4" />
            <span>Compare Side-by-Side (No-Lock vs Strict 2PL)</span>
          </motion.button>
        </div>

        {/* Live Simulation Progress Indicator */}
        {isSimulating && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-white/70">
              <span>Executing Concurrent Transaction Threads...</span>
              <span>{simulationProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#2A1D26] overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#DF367C] to-[#FF3E41]"
                style={{ width: `${simulationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* RESULTS DISPLAY SECTION */}

      {/* 1. SIDE-BY-SIDE COMPARATIVE VIEW */}
      {viewMode === 'SIDE_BY_SIDE' && lastSideBySideResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-display tracking-wide flex items-center gap-2">
              <Columns className="w-5 h-5 text-[#FF7099]" />
              <span>SIDE-BY-SIDE ISOLATION BENCHMARK RESULTS</span>
            </h2>
            <span className="text-xs font-mono text-white/50">
              {concurrencyLevel} Parallel Threads Tested Against Same Resource
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: No Locking */}
            <div className="bg-[#4C3549] border-2 border-red-500/50 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                  NO LOCKING (READ UNCOMMITTED)
                </span>
                {lastSideBySideResult.noLockResult.overbookingDetected && (
                  <motion.span
                    animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-xs font-mono text-red-400 font-bold flex items-center gap-1"
                  >
                    <Flame className="w-4 h-4" /> OVERBOOKING ANOMALY!
                  </motion.span>
                )}
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Committed</div>
                  <div className="text-xl font-black text-red-400">
                    {lastSideBySideResult.noLockResult.successfulCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Rejected</div>
                  <div className="text-xl font-black text-white/60">
                    {lastSideBySideResult.noLockResult.rejectedCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-red-500/40">
                  <div className="text-[10px] text-red-400 uppercase font-bold">Final Stock</div>
                  <motion.div
                    animate={lastSideBySideResult.noLockResult.finalStock < 0 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-xl font-black text-red-400"
                  >
                    {lastSideBySideResult.noLockResult.finalStock}
                  </motion.div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-300 space-y-1">
                <strong>Lost Update Bug Manifested:</strong>
                <p className="text-[11px] text-white/70">
                  {lastSideBySideResult.noLockResult.successfulCount} clients simultaneous booked 1 physical seat! Final inventory became {lastSideBySideResult.noLockResult.finalStock} (Negative inventory bug).
                </p>
              </div>

              {/* Request Timeline Mini-Table Streaming in Real-time */}
              <div className="max-h-64 overflow-y-auto font-mono text-[11px] space-y-1 pr-1">
                <AnimatePresence initial={false}>
                  {streamedNoLockTxs.map((tx) => {
                    const isAnomaly = tx.status === 'COMMITTED' && tx.txId !== 'TX-1001';
                    return (
                      <motion.div
                        key={tx.txId}
                        initial={reduced ? { opacity: 0 } : { opacity: 0, x: -10, backgroundColor: 'rgba(239,68,68,0.3)' }}
                        animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                        transition={{ duration: 0.25 }}
                        className={`p-2 rounded bg-[#2A1D26] border flex items-center justify-between ${
                          isAnomaly ? 'border-red-500 text-red-300' : 'border-white/5 text-white/80'
                        }`}
                      >
                        <span>{tx.txId} ({tx.clientName})</span>
                        <span className={tx.status === 'COMMITTED' ? 'text-red-400 font-bold' : 'text-white/40'}>
                          {tx.status} ({tx.latencyMs}ms)
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Col: Strict 2PL */}
            <div className="bg-[#4C3549] border-2 border-[#10B981]/60 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                  STRICT TWO-PHASE LOCKING (2PL)
                </span>
                <span className="text-xs font-mono text-[#10B981] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> ACID SERIALIZABLE
                </span>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Committed</div>
                  <div className="text-xl font-black text-[#10B981]">
                    {lastSideBySideResult.twoPlResult.successfulCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Rejected (409)</div>
                  <div className="text-xl font-black text-white/60">
                    {lastSideBySideResult.twoPlResult.rejectedCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-[#10B981]/40">
                  <div className="text-[10px] text-[#10B981] uppercase font-bold">Final Stock</div>
                  <div className="text-xl font-black text-[#10B981]">
                    {lastSideBySideResult.twoPlResult.finalStock}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-mono text-[#10B981] space-y-1">
                <strong>Zero Overbooking Guarantee:</strong>
                <p className="text-[11px] text-white/70">
                  Exclusive X-Lock acquired on row. Exactly 1 transaction committed, remaining {lastSideBySideResult.twoPlResult.rejectedCount} safely rejected with 409 conflict.
                </p>
              </div>

              {/* Request Timeline Mini-Table Streaming in Real-time */}
              <div className="max-h-64 overflow-y-auto font-mono text-[11px] space-y-1 pr-1">
                <AnimatePresence initial={false}>
                  {streamedTwoPlTxs.map((tx) => (
                    <motion.div
                      key={tx.txId}
                      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -10, backgroundColor: tx.status === 'COMMITTED' ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.05)' }}
                      animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                      transition={{ duration: 0.25 }}
                      className="p-2 rounded bg-[#2A1D26] border border-white/5 flex items-center justify-between"
                    >
                      <span>{tx.txId} ({tx.clientName})</span>
                      <span className={tx.status === 'COMMITTED' ? 'text-[#10B981] font-bold' : 'text-white/40'}>
                        {tx.status} ({tx.latencyMs}ms)
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SINGLE RUN DETAILED RESULT */}
      {viewMode === 'SINGLE' && lastSimResult && (
        <div className="space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-white/10 text-white/70">
                  BENCHMARK RUN: {lastSimResult.runId}
                </span>
                <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">
                  PROTOCOL: {lastSimResult.strategy.replace('_', ' ')}
                </h2>
              </div>

              {lastSimResult.overbookingDetected ? (
                <motion.span
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5"
                >
                  <Flame className="w-4 h-4" />
                  <span>OVERBOOKING ANOMALY ({lastSimResult.overbookedSeats} DUPLICATES)</span>
                </motion.span>
              ) : (
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ACID SERIALIZABILITY PRESERVED</span>
                </span>
              )}
            </div>

            {/* Summary KPI Strip with Count-Up */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Requests</div>
                <div className="text-xl font-black text-white">{lastSimResult.concurrencyLevel}</div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-[#10B981] uppercase">Committed</div>
                <div className="text-xl font-black text-[#10B981]">{singleCommitted}</div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Rejected</div>
                <div className="text-xl font-black text-white/60">{singleRejected}</div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Final Stock</div>
                <div className={`text-xl font-black ${lastSimResult.finalStock < 0 ? 'text-red-400 font-bold' : 'text-white'}`}>
                  {singleFinalStock}
                </div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Duration</div>
                <div className="text-xl font-black text-[#FF7099]">{lastSimResult.durationMs}ms</div>
              </div>
            </div>

            {/* Live Streaming Transaction Execution Timeline Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                  <span>Thread Transaction Execution Log:</span>
                  {isStreaming && (
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="text-xs text-[#FF7099]"
                    >
                      (Streaming in real time...)
                    </motion.span>
                  )}
                </h3>
                <span className="text-xs font-mono text-white/50">
                  {streamedSingleTxs.length} / {lastSimResult.transactions.length} rows
                </span>
              </div>

              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="sticky top-0 bg-[#4C3549] border-b border-white/10 text-white/40 text-[10px] uppercase">
                    <tr>
                      <th className="pb-2 pr-3">Tx ID</th>
                      <th className="pb-2 px-3">Client Worker</th>
                      <th className="pb-2 px-3">Status</th>
                      <th className="pb-2 px-3">Current Step</th>
                      <th className="pb-2 px-3">Message / Evaluation</th>
                      <th className="pb-2 pl-3">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    <AnimatePresence initial={false}>
                      {streamedSingleTxs.map((tx) => {
                        const isOverbookAnomaly =
                          lastSimResult.strategy === 'NO_LOCKING' &&
                          tx.status === 'COMMITTED' &&
                          tx.txId !== 'TX-1001';

                        return (
                          <motion.tr
                            key={tx.txId}
                            initial={
                              reduced
                                ? { opacity: 0 }
                                : {
                                    opacity: 0,
                                    x: -12,
                                    backgroundColor: isOverbookAnomaly
                                      ? 'rgba(239, 68, 68, 0.4)'
                                      : tx.status === 'COMMITTED'
                                      ? 'rgba(16, 185, 129, 0.25)'
                                      : 'rgba(255, 255, 255, 0.05)',
                                  }
                            }
                            animate={{ opacity: 1, x: 0, backgroundColor: isOverbookAnomaly ? 'rgba(239,68,68,0.1)' : 'transparent' }}
                            transition={{ duration: 0.25 }}
                            className={`hover:bg-white/5 ${isOverbookAnomaly ? 'text-red-300 font-semibold' : ''}`}
                          >
                            <td className="py-2.5 pr-3 font-bold text-[#FF7099]">{tx.txId}</td>
                            <td className="py-2.5 px-3 text-white">{tx.clientName}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  tx.status === 'COMMITTED'
                                    ? isOverbookAnomaly
                                      ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                                      : 'bg-[#10B981]/20 text-[#10B981]'
                                    : tx.status === 'REJECTED'
                                    ? 'bg-white/10 text-white/50'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {tx.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-white/60">{tx.currentStep}</td>
                            <td className="py-2.5 px-3 text-white/70 truncate max-w-xs">{tx.message}</td>
                            <td className="py-2.5 pl-3 text-white/40">{tx.latencyMs}ms</td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Literal SQL Statement Traces */}
            <div className="space-y-3 pt-4 border-t border-white/10 font-mono text-xs">
              <button
                onClick={() => setShowSqlTrace(!showSqlTrace)}
                className="flex items-center gap-2 text-[#FF7099] hover:underline font-bold cursor-pointer"
              >
                <Code className="w-4 h-4" />
                <span>{showSqlTrace ? 'Hide Literal SQL Traces' : 'Show Literal SQL Traces'}</span>
              </button>

              <AnimatePresence>
                {showSqlTrace && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#2A1D26] p-4 rounded-2xl border border-white/10 space-y-2 text-[11px] text-[#FF7099] overflow-x-auto"
                  >
                    <div className="text-white/40 uppercase text-[10px]">Raw SQL Query Sequence:</div>
                    {lastSimResult.dbLogs.map((log, i) => (
                      <div key={i} className="text-white/80">{log}</div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
""")

# ─── AdminAuditLogsPage.tsx ───
w('src/pages/admin/AdminAuditLogsPage.tsx', """import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  Activity,
  Search,
  Download,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
} from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs, clearAuditLogs } = useFest();
  const reduced = usePrefersReducedMotion();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const actionTypes = [
    { label: 'All Action Logs', value: 'ALL' },
    { label: 'Lock Granted', value: 'LOCK_GRANTED' },
    { label: 'Lock Released', value: 'LOCK_RELEASED' },
    { label: 'Lock Rejected (409)', value: 'LOCK_REJECTED' },
    { label: 'Booking Confirmed', value: 'BOOKING_CONFIRMED' },
    { label: 'Scan Verified', value: 'SCAN_VERIFIED' },
    { label: 'Scan Rejected', value: 'SCAN_REJECTED' },
    { label: 'Overbooking Anomaly', value: 'RACE_OVERBOOK' },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedAction !== 'ALL' && log.action !== selectedAction) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.resourceId.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,Action,Resource,User,Details\\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.action}","${l.resourceId}","${l.user}","${l.details.replace(/"/g, '""')}"`
      )
      .join('\\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibrance26-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'BOOKING_CONFIRMED':
      case 'SCAN_VERIFIED':
      case 'LOCK_GRANTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
            {action}
          </span>
        );
      case 'LOCK_REJECTED':
      case 'SCAN_REJECTED':
      case 'LOCK_TIMEOUT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {action}
          </span>
        );
      case 'RACE_OVERBOOK':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1">
            <Flame className="w-3 h-3" /> {action}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/70">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF3E41]/25 text-[#FF3E41] border border-[#FF3E41]/50">
              AUDIT &amp; COMPLIANCE
            </span>
            <span className="text-xs text-white/50 font-mono">Immutable ACID System Event Stream</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            SYSTEM AUDIT &amp; TRANSACTION LOGS
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-[#4C3549] hover:bg-[#883955] text-white border border-white/15 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={clearAuditLogs}
            className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-white/70 transition-colors flex items-center gap-1 cursor-pointer"
            title="Clear Log History"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action, resource ID, user, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2A1D26] border border-white/15 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-white/40 shrink-0" />
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="bg-[#2A1D26] border border-white/15 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#FF3E41] w-full md:w-auto"
            >
              {actionTypes.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table with Animated Rows */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-display tracking-wide flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FF7099]" />
            <span>TRANSACTION AUDIT FEED</span>
          </h2>
          <span className="text-xs font-mono text-white/50">
            {filteredLogs.length} Records Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                <th className="pb-3 pr-3">Timestamp</th>
                <th className="pb-3 px-3">Action Type</th>
                <th className="pb-3 px-3">Target Resource</th>
                <th className="pb-3 px-3">User / Actor</th>
                <th className="pb-3 pl-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              <AnimatePresence initial={false}>
                {filteredLogs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, x: -10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                    transition={{ duration: 0.25 }}
                    className="hover:bg-white/5"
                  >
                    <td className="py-3 pr-3 text-white/50 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-3">{getActionBadge(log.action)}</td>
                    <td className="py-3 px-3 font-bold text-[#FF7099] whitespace-nowrap">
                      {log.resourceId}
                    </td>
                    <td className="py-3 px-3 text-white whitespace-nowrap">{log.user}</td>
                    <td className="py-3 pl-3 text-white/70">{log.details}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
""")

print('All pages in build_anim_pages3.py successfully written.')

