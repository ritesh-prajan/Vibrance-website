import os

def w(p, c):
    full = os.path.abspath(p)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(c.strip() + '\n')
    print(f'Wrote {p}')

# 1. RegisterPage.tsx
w('src/pages/public/RegisterPage.tsx', '''import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-[#2A1D26] text-[#F3EDF2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF3E41] to-[#DF367C] text-white font-display font-black text-xl shadow-lg mb-3">
          V
        </div>
        <h1 className="text-3xl font-black text-white font-display tracking-wide">
          STUDENT REGISTRATION
        </h1>
        <p className="mt-1 text-xs text-[#FF7099] font-mono">
          Vibrance 2026 Pass Reservation Account
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
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
                  Year of Study
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
                  <option value="Postgraduate / PhD">Postgraduate / PhD</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Registration & Enter Fest</span>
            </button>
          </form>

          <div className="text-center pt-3 border-t border-white/10 text-xs text-white/60">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-[#FF7099] hover:underline font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Role Sign-in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
''')

# 2. NotFoundPage.tsx
w('src/pages/public/NotFoundPage.tsx', '''import React from 'react';
import { Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { currentUser } = useFest();

  const homePath =
    currentUser?.role === 'admin'
      ? '/admin'
      : currentUser?.role === 'gate_staff'
      ? '/verify'
      : '/events';

  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-8 sm:p-14 max-w-lg shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#FF3E41]/20 border border-[#FF3E41]/40 text-[#FF3E41] flex items-center justify-center mx-auto shadow-lg">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#FF3E41]/20 text-[#FF3E41] border border-[#FF3E41]/40">
            ERROR 404 • ROUTE NOT FOUND
          </span>
          <h1 className="text-3xl font-black text-white font-display tracking-wide pt-2">
            RESOURCE NOT FOUND
          </h1>
          <p className="text-xs text-white/60 font-sans-body leading-relaxed max-w-sm mx-auto">
            The page or festival pass route you requested does not exist in the Vibrance 2026 database registry.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
          <Link
            to={homePath}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            to="/events"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Festival Events Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
''')

# 3. EventsCatalogPage.tsx
w('src/pages/student/EventsCatalogPage.tsx', '''import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { FestEvent } from '../../types';
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

export const EventsCatalogPage: React.FC = () => {
  const { events, setSelectedEvent } = useFest();
  const navigate = useNavigate();

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

  return (
    <div className="space-y-8">
      {/* 1. Hero Festival Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#4C3549] via-[#2A1D26] to-[#2A1D26] border border-white/15 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#FF3E41] text-white shadow-md">
                MARCH 13–15, 2026
              </span>
              <span className="text-xs text-[#FF7099] font-mono flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#FF7099]" /> 50,000+ ATTENDEES • 6 ARENAS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.08] font-display">
              VIBRANCE 2026 PASS RESERVATIONS
            </h1>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl font-sans-body">
              Select your festival pro-show or competition passes below. Real-time seat locking with
              <strong> 3-Minute Hold TTL</strong> powered by <strong>Strict 2-Phase Locking (2PL)</strong>.
            </p>
          </div>

          {/* High Urgency Contention Card */}
          <div className="bg-[#4C3549]/90 border border-[#FF3E41]/40 rounded-2xl p-5 w-full lg:w-80 shrink-0 backdrop-blur-md space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FF3E41] font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> CRITICAL CONTENTION
              </span>
              <span className="text-[9px] font-mono text-white/40">VIP SEATS</span>
            </div>

            <h3 className="text-sm font-bold text-white leading-snug font-display text-base">
              {events[0]?.title || 'PRO-SHOW: ARMAAN MALIK'}
            </h3>
            <p className="text-[11px] text-[#FF7099] font-mono">
              Only {events[0]?.availableSeats ?? 2} seats remaining in database!
            </p>

            <button
              onClick={() => handleSelectSeats(events[0])}
              className="w-full py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Lock Seats Now (₹{events[0]?.basePrice || 699})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all font-mono cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-[#FF3E41] text-white font-bold shadow-md'
                    : 'bg-[#4C3549] text-white/70 hover:text-white hover:bg-[#883955] border border-white/10'
                }`}
              >
                {cat.label}
              </button>
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

      {/* 3. Events Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event) => {
            const isHighContention = event.availableSeats <= 4;
            return (
              <div
                key={event.id}
                className="bg-[#4C3549] border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between transition-colors shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#883955] text-white">
                      {event.category.replace('_', ' ')}
                    </span>

                    {isHighContention ? (
                      <span className="text-[10px] font-mono font-bold text-[#FF3E41] bg-[#FF3E41]/10 px-2 py-0.5 rounded border border-[#FF3E41]/30 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> {event.availableSeats} Seats Left!
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
                    <button
                      onClick={() => handleViewDetails(event)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="View Full Details"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Details</span>
                    </button>

                    <button
                      onClick={() => handleSelectSeats(event)}
                      className="px-4 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md flex items-center gap-1 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Select Seats</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
''')

# 4. EventDetailPage.tsx
w('src/pages/student/EventDetailPage.tsx', '''import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { events, setSelectedEvent } = useFest();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div>
        <Breadcrumbs
          items={[{ label: 'Events Catalog', path: '/events' }, { label: 'Event Not Found' }]}
          backLink={{ label: 'Back to Events', path: '/events' }}
        />
        <EmptyState
          title="Event Not Found"
          description="The requested event does not exist in the festival schedule."
          actionText="Browse Available Events"
          actionPath="/events"
        />
      </div>
    );
  }

  const handleSelectSeats = () => {
    setSelectedEvent(event);
    navigate(`/events/${event.id}/seats`);
  };

  const isLowStock = event.availableSeats <= 4;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Events Catalog', path: '/events' },
          { label: event.title },
        ]}
        backLink={{ label: 'Back to Events', path: '/events' }}
      />

      {/* Main Event Card Header */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-[#883955] text-white">
              {event.category.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-white/10 text-white/80">
              {event.tag}
            </span>
          </div>

          {isLowStock ? (
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold text-[#FF3E41] bg-[#FF3E41]/20 border border-[#FF3E41]/40 flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>CRITICAL CONTENTION • ONLY {event.availableSeats} SEATS LEFT</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold text-[#FF7099] bg-[#883955]/30 border border-[#883955]/50">
              {event.availableSeats} SEATS AVAILABLE
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide">
            {event.title}
          </h1>
          <p className="text-sm sm:text-base text-[#FF7099] font-mono font-semibold">
            Starring: {event.artistOrHost}
          </p>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
          <div className="bg-[#2A1D26] p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#FF7099] shrink-0" />
            <div>
              <div className="text-[10px] text-white/40 uppercase">Date</div>
              <div className="font-bold text-white text-sm">{event.date}</div>
            </div>
          </div>

          <div className="bg-[#2A1D26] p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#FF7099] shrink-0" />
            <div>
              <div className="text-[10px] text-white/40 uppercase">Show Timing</div>
              <div className="font-bold text-white text-sm">{event.time}</div>
            </div>
          </div>

          <div className="bg-[#2A1D26] p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#FF7099] shrink-0" />
            <div>
              <div className="text-[10px] text-white/40 uppercase">Venue Location</div>
              <div className="font-bold text-white text-sm truncate">{event.venue}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Seat Tiers Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-white font-display tracking-wide">
              ABOUT THIS SHOW & VENUE
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans-body">
              {event.shortDesc}
            </p>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans-body">
              Entry opens 45 minutes prior to show time. Present the QR code on your verified digital
              ticket at the Gate Staff check-in counters.
            </p>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-xs font-mono font-bold text-[#FF7099] uppercase tracking-wider mb-3">
                DBMS ACID Reservation Guarantee:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strict 2PL Isolation:</strong>
                    <p className="text-[11px] text-white/60">Zero double-booking risk during high contention spikes.</p>
                  </div>
                </div>

                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">3-Minute Exclusive Lock:</strong>
                    <p className="text-[11px] text-white/60">Pessimistic lease locks your seat while you checkout.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 space-y-5 shadow-xl">
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              TIER PRICING BREAKDOWN
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#2A1D26] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">VIP FRONT ROW</div>
                  <div className="text-[10px] text-white/50">Rows A–B • Stage Front</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#FF7099] text-sm">₹{Math.round(event.basePrice * 1.5)}</div>
                  <div className="text-[10px] text-white/40">1.5x Multiplier</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#2A1D26] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">GOLD CENTER</div>
                  <div className="text-[10px] text-white/50">Rows C–D • Prime Acoustic</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#FF7099] text-sm">₹{Math.round(event.basePrice * 1.25)}</div>
                  <div className="text-[10px] text-white/40">1.25x Multiplier</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#2A1D26] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">REGULAR SEATING</div>
                  <div className="text-[10px] text-white/50">Rows E–F • Standard View</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white text-sm">₹{event.basePrice}</div>
                  <div className="text-[10px] text-white/40">Base Pass</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSelectSeats}
              className="w-full py-3.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Select Seats on Venue Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
''')

# 5. SeatSelectionPage.tsx
w('src/pages/student/SeatSelectionPage.tsx', '''import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Seat } from '../../types';
import {
  Clock,
  Ticket,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export const SeatSelectionPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { events, activeSeat, seatLockTimeRemaining, selectSeatForBooking, releaseActiveSeat } = useFest();
  const navigate = useNavigate();

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
      {activeSeat && seatLockTimeRemaining > 0 && (
        <div className="bg-[#4C3549] border-2 border-[#FF3E41] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF3E41] text-white flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <span>SEAT [{activeSeat.row}-{activeSeat.number}] EXCLUSIVELY HELD</span>
                <span className="px-2 py-0.5 rounded bg-[#FF3E41] text-white text-[11px]">
                  {formatTimer(seatLockTimeRemaining)} Remaining
                </span>
              </div>
              <p className="text-[11px] text-white/70 font-sans-body">
                3-minute pessimistic lease lock active. Complete checkout before timer expires.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={releaseActiveSeat}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors cursor-pointer"
            >
              Release Seat
            </button>
            <button
              onClick={handleProceedToCheckout}
              className="px-5 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Conflict Alert Banner */}
      {conflictMsg && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 text-red-300 text-xs font-mono">
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
        </div>
      )}

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
            {Object.keys(rowsMap).map((rowKey) => {
              const rowSeats = rowsMap[rowKey];
              const tierLabel =
                rowKey === 'A' || rowKey === 'B'
                  ? 'VIP FRONT (₹' + Math.round(event.basePrice * 1.5) + ')'
                  : rowKey === 'C' || rowKey === 'D'
                  ? 'GOLD (₹' + Math.round(event.basePrice * 1.25) + ')'
                  : 'REGULAR (₹' + event.basePrice + ')';

              return (
                <div key={rowKey} className="space-y-1.5">
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
                        seatClass += ' bg-[#FF3E41] text-white border-white shadow-lg scale-105';
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
                          <button
                            type="button"
                            onClick={() => handleSeatClick(seat)}
                            disabled={isBooked}
                            className={seatClass}
                            title={`Seat ${seat.row}-${seat.number} (${seat.category}): ₹${seat.price}`}
                          >
                            {seat.number}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl">
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

              {activeSeat ? (
                <div className="p-3.5 rounded-xl bg-[#883955]/40 border border-[#FF7099]/40 space-y-2">
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
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-[#2A1D26] border border-dashed border-white/20 text-center text-white/50 text-xs">
                  <Ticket className="w-6 h-6 mx-auto mb-2 text-white/30" />
                  <span>Click an available seat on the venue map to hold it for 3 minutes.</span>
                </div>
              )}
            </div>

            {activeSeat && (
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
''')

# 6. CheckoutPage.tsx
w('src/pages/student/CheckoutPage.tsx', '''import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
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

        <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl space-y-5">
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
        </div>
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

    try {
      const booking = await confirmBooking({
        name,
        regNumber,
        department,
        paymentMethod,
      });

      if (booking) {
        navigate(`/ticket/${booking.id}`);
      } else {
        setErrorMsg('Booking transaction could not be committed. Please try again.');
        setIsProcessing(false);
      }
    } catch {
      setErrorMsg('Transaction failed due to concurrency conflict.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Events Catalog', path: '/events' },
          { label: event.title, path: `/events/${event.id}` },
          { label: 'Seat Selection', path: `/events/${event.id}/seats` },
          { label: 'Checkout' },
        ]}
        backLink={{ label: 'Back to Seat Map', path: `/events/${event.id}/seats` }}
      />

      <div className="bg-[#4C3549] border-2 border-[#FF3E41] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF3E41] text-white flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span>HOLD TIMER ACTIVE • SEAT [{activeSeat.row}-{activeSeat.number}]</span>
              <span className="px-2 py-0.5 rounded bg-[#FF3E41] text-white text-[11px]">
                {formatTimer(seatLockTimeRemaining)}
              </span>
            </div>
            <p className="text-[11px] text-white/70 font-sans-body">
              Seat held with Exclusive X-Lock. Auto-releases if countdown reaches 0:00.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center gap-2 text-red-300 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleConfirm} className="space-y-6">
            <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <h2 className="text-lg font-bold text-white font-display tracking-wide">
                1. ATTENDEE VERIFICATION DETAILS
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>
            </div>

            <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white font-display tracking-wide">
                  2. PAYMENT METHOD (DEMO SANDBOX)
                </h2>
                <span className="text-[10px] font-mono text-white/40 uppercase">Dummy Gateway</span>
              </div>

              <div className="space-y-2.5">
                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'UPI'
                      ? 'bg-[#883955]/40 border-[#FF3E41] text-white'
                      : 'bg-[#2A1D26] border-white/10 text-white/70 hover:bg-[#883955]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#FF7099]" />
                    <div>
                      <div className="text-xs font-mono font-bold">UPI / QR Payment</div>
                      <div className="text-[11px] text-white/50">Google Pay, PhonePe, Paytm, BHIM</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="accent-[#FF3E41]"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod('CAMPUS_CARD')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'CAMPUS_CARD'
                      ? 'bg-[#883955]/40 border-[#FF3E41] text-white'
                      : 'bg-[#2A1D26] border-white/10 text-white/70 hover:bg-[#883955]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#FF7099]" />
                    <div>
                      <div className="text-xs font-mono font-bold">Campus RFID Smartcard</div>
                      <div className="text-[11px] text-white/50">Deduct from College Student Wallet</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CAMPUS_CARD'}
                    onChange={() => setPaymentMethod('CAMPUS_CARD')}
                    className="accent-[#FF3E41]"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod('NET_BANKING')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'NET_BANKING'
                      ? 'bg-[#883955]/40 border-[#FF3E41] text-white'
                      : 'bg-[#2A1D26] border-white/10 text-white/70 hover:bg-[#883955]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-[#FF7099]" />
                    <div>
                      <div className="text-xs font-mono font-bold">Net Banking / Debit Card</div>
                      <div className="text-[11px] text-white/50">HDFC, SBI, ICICI, Axis Bank</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'NET_BANKING'}
                    onChange={() => setPaymentMethod('NET_BANKING')}
                    className="accent-[#FF3E41]"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs sm:text-sm font-bold font-mono transition-all shadow-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Committing Transaction to DBMS Engine...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm & Commit Booking (₹{totalAmount})</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-white font-display tracking-wide">
              ORDER BREAKDOWN
            </h2>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/40 uppercase">Event</div>
                <div className="font-bold text-white">{event.title}</div>
                <div className="text-white/60">{event.date} • {event.time}</div>
                <div className="text-white/40 truncate">{event.venue}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#883955]/30 border border-[#883955]/50 space-y-2">
                <div className="flex justify-between items-center text-white/70">
                  <span>Seat Allocation:</span>
                  <span className="font-bold text-white">
                    Seat {activeSeat.row}-{activeSeat.number}
                  </span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Seat Tier:</span>
                  <span className="text-[#FF7099]">{activeSeat.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Base Pass Price:</span>
                  <span className="font-bold text-white">₹{basePrice}</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Convenience Fee:</span>
                  <span>₹{convenienceFee}</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Festival GST (5%):</span>
                  <span>₹{gst}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/15 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase">Total Amount</span>
                <span className="text-xl font-black text-white font-mono">₹{totalAmount}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#2A1D26]/60 border border-white/10 text-[11px] font-mono text-white/60 space-y-1">
              <div className="flex items-center gap-1.5 text-[#10B981]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-bold">2PL Commit Protocol</span>
              </div>
              <p>On confirmation, exclusive lock transitions to permanently committed row record.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
''')

# 7. TicketPage.tsx
w('src/pages/student/TicketPage.tsx', '''import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
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

      <div className="bg-[#10B981]/20 border border-[#10B981]/40 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs font-mono text-[#10B981]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            <strong>Booking Confirmed & Serialized!</strong> Reference code: {booking.bookingRef}
          </span>
        </div>
        <Link
          to="/my-bookings"
          className="text-white hover:underline text-xs font-bold"
        >
          View in My Bookings &rarr;
        </Link>
      </div>

      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 ticket-notch-left ticket-notch-right">
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
                <div className="text-[10px] text-white/40 uppercase">Seat & Tier</div>
                <div className="font-black text-white text-base">Seat {booking.seatLabel}</div>
                <div className="text-[#FF7099]">{booking.seatCategory.replace('_', ' ')}</div>
                <div className="text-[10px] text-white/50">Admit One Pass</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4 text-[#FF7099]" />
                <span className="font-bold">{booking.eventDate}</span>
                <span>•</span>
                <Clock className="w-4 h-4 text-[#FF7099]" />
                <span>{booking.eventTime}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-4 h-4 text-[#FF7099]" />
                <span>{booking.eventVenue}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between p-3.5 rounded-xl bg-[#883955]/30 border border-[#883955]/50 text-xs font-mono">
              <div>
                <span className="text-white/50">Amount Paid: </span>
                <strong className="text-white font-bold">₹{booking.amount}</strong>
              </div>
              <div>
                <span className="text-white/50">Payment Method: </span>
                <span className="text-[#FF7099]">{booking.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#2A1D26] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <QrCode className="w-28 h-28 text-black" />
            </div>

            <div className="space-y-1 font-mono">
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Entry Ref Code</div>
              <div className="text-xs font-bold text-[#FF7099] bg-[#4C3549] px-2 py-1 rounded border border-white/10">
                {booking.bookingRef}
              </div>
            </div>

            <p className="text-[10px] text-white/50 font-sans-body leading-tight">
              Scan this QR code or provide reference at Gate Entry Security.
            </p>
          </div>
        </div>

        {booking.status === 'checked_in' && booking.checkedInAt && (
          <div className="p-3 rounded-xl bg-[#DF367C]/20 border border-[#DF367C]/40 text-xs font-mono text-[#FF7099] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              Admitted at Gate: {new Date(booking.checkedInAt).toLocaleTimeString()} by Staff: {booking.checkedInBy?.name || 'Gate Staff'}
            </span>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Demo Stub: Ticket PDF downloaded successfully.')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => alert('Demo Stub: Pass link copied to clipboard.')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Pass</span>
            </button>
          </div>

          <Link
            to="/my-bookings"
            className="px-5 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span>View All My Bookings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
''')

# 8. MyBookingsPage.tsx
w('src/pages/student/MyBookingsPage.tsx', '''import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Ticket,
  Calendar,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { myBookings, cancelBooking } = useFest();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED'>('ALL');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const filtered = myBookings.filter((b) => {
    if (filterStatus === 'CONFIRMED') return b.status === 'confirmed';
    if (filterStatus === 'CHECKED_IN') return b.status === 'checked_in';
    if (filterStatus === 'CANCELLED') return b.status === 'cancelled';
    return true;
  });

  const handleConfirmCancel = () => {
    if (cancellingBooking) {
      cancelBooking(cancellingBooking.id);
      setCancellingBooking(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide">
            MY FESTIVAL PASSES & BOOKINGS
          </h1>
          <p className="text-xs text-white/60 font-mono mt-0.5">
            Manage your reserved seats, view e-tickets, or cancel upcoming bookings.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md shrink-0"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Browse More Events</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 text-xs font-mono">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
            filterStatus === 'ALL'
              ? 'bg-[#883955] text-white font-bold'
              : 'text-white/60 hover:text-white hover:bg-[#4C3549]'
          }`}
        >
          All Passes ({myBookings.length})
        </button>
        <button
          onClick={() => setFilterStatus('CONFIRMED')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
            filterStatus === 'CONFIRMED'
              ? 'bg-[#883955] text-white font-bold'
              : 'text-white/60 hover:text-white hover:bg-[#4C3549]'
          }`}
        >
          Upcoming / Confirmed ({myBookings.filter((b) => b.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setFilterStatus('CHECKED_IN')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
            filterStatus === 'CHECKED_IN'
              ? 'bg-[#883955] text-white font-bold'
              : 'text-white/60 hover:text-white hover:bg-[#4C3549]'
          }`}
        >
          Used / Checked In ({myBookings.filter((b) => b.status === 'checked_in').length})
        </button>
        <button
          onClick={() => setFilterStatus('CANCELLED')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
            filterStatus === 'CANCELLED'
              ? 'bg-[#883955] text-white font-bold'
              : 'text-white/60 hover:text-white hover:bg-[#4C3549]'
          }`}
        >
          Cancelled ({myBookings.filter((b) => b.status === 'cancelled').length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Ticket className="w-7 h-7" />}
          title="No Festival Passes Found"
          description="You don't have any bookings in this category yet. Explore the event catalog to reserve passes."
          actionText="Browse Festival Events"
          actionPath="/events"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-white/25 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#883955] text-white">
                    {b.eventCategory.replace('_', ' ')}
                  </span>
                  <StatusBadge status={b.status} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-display tracking-wide">
                    {b.eventTitle}
                  </h3>
                  <p className="text-xs text-white/60 font-mono mt-0.5">{b.artistOrHost}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#2A1D26] border border-white/10 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="w-3.5 h-3.5 text-[#FF7099]" />
                    <span>{b.eventDate} • {b.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin className="w-3.5 h-3.5 text-[#FF7099]" />
                    <span className="truncate">{b.eventVenue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <div>
                    <span className="text-white/40">Seat: </span>
                    <strong className="text-white">Seat {b.seatLabel} ({b.seatCategory})</strong>
                  </div>
                  <div>
                    <span className="text-white/40">Ref: </span>
                    <span className="text-[#FF7099] font-bold">{b.bookingRef}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 font-mono text-xs">
                <Link
                  to={`/ticket/${b.id}`}
                  className="px-4 py-2 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>View Pass</span>
                </Link>

                {b.status === 'confirmed' && (
                  <button
                    onClick={() => setCancellingBooking(b)}
                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                  >
                    Cancel Pass
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#4C3549] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white font-display">
                CANCEL FESTIVAL PASS?
              </h3>
              <p className="text-xs text-white/70 font-sans-body leading-relaxed">
                Are you sure you want to cancel your pass for <strong>{cancellingBooking.eventTitle}</strong> (Seat {cancellingBooking.seatLabel})?
              </p>
              <p className="text-[11px] text-white/50 font-mono">
                This transaction will be rolled back and the seat returned to the festival inventory.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => setCancellingBooking(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
              >
                Keep Pass
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
''')

# 9. ProfilePage.tsx
w('src/pages/student/ProfilePage.tsx', '''import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import {
  CheckCircle2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile, myBookings } = useFest();

  const [name, setName] = useState(currentUser?.name || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [year, setYear] = useState(currentUser?.year || '3rd Year (B.Tech)');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      department,
      year,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  const confirmedCount = myBookings.filter((b) => b.status === 'confirmed').length;
  const usedCount = myBookings.filter((b) => b.status === 'checked_in').length;
  const cancelledCount = myBookings.filter((b) => b.status === 'cancelled').length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide">
          STUDENT PROFILE & BADGE
        </h1>
        <p className="text-xs text-white/60 font-mono mt-0.5">
          Vibrance 2026 Student Delegate Profile & Pass History
        </p>
      </div>

      {savedFeedback && (
        <div className="bg-[#10B981]/20 border border-[#10B981]/40 rounded-2xl p-4 flex items-center gap-2 text-xs font-mono text-[#10B981]">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes saved successfully in local session.</span>
        </div>
      )}

      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FF3E41] to-[#DF367C] text-white font-display font-black text-3xl flex items-center justify-center shadow-xl shrink-0">
            {currentUser?.name?.charAt(0) || 'S'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF3E41]/20 text-[#FF3E41] border border-[#FF3E41]/40">
                STUDENT DELEGATE
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono text-white/60 bg-white/10">
                {currentUser?.regNumber}
              </span>
            </div>

            <h2 className="text-2xl font-black text-white font-display tracking-wide">
              {currentUser?.name}
            </h2>

            <p className="text-xs text-white/70 font-mono">
              {currentUser?.department} • {currentUser?.year || 'B.Tech'}
            </p>
            <p className="text-xs text-[#FF7099] font-mono">
              {currentUser?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10 text-center font-mono">
          <div className="p-3 bg-[#2A1D26] rounded-xl border border-white/10">
            <div className="text-xl font-black text-white">{confirmedCount}</div>
            <div className="text-[10px] text-white/40 uppercase">Active Passes</div>
          </div>
          <div className="p-3 bg-[#2A1D26] rounded-xl border border-white/10">
            <div className="text-xl font-black text-[#FF7099]">{usedCount}</div>
            <div className="text-[10px] text-white/40 uppercase">Attended Events</div>
          </div>
          <div className="p-3 bg-[#2A1D26] rounded-xl border border-white/10">
            <div className="text-xl font-black text-white/40">{cancelledCount}</div>
            <div className="text-[10px] text-white/40 uppercase">Cancelled</div>
          </div>
        </div>
      </div>

      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h2 className="text-lg font-bold text-white font-display tracking-wide">
          EDIT PROFILE INFORMATION
        </h2>

        <form onSubmit={handleSave} className="space-y-4 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3E41]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                Registration Number (Read Only)
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.regNumber || ''}
                className="w-full bg-[#2A1D26]/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white/50 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3E41]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                Year of Study
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3E41]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
''')

print('All Public & Student pages generated successfully.')
