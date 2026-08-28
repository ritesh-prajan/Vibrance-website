import React, { useState, useMemo } from 'react';
import { useFest } from '../../context/FestContext';
import { FestEvent, EventCategory } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Search,
  AlertTriangle,
  X,
  Eye,
  Image as ImageIcon,
  Upload,
  Check,
  Sparkles,
} from 'lucide-react';
import { EventDetailsModal } from '../../components/events/EventDetailsModal';

const TICKET_BG_PRESETS = [
  {
    name: 'Concert Stage',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'EDM Lasers',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dance Arena',
    url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Comedy Spotlight',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rock Band',
    url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tech Matrix',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
  },
];

export const AdminEventsPage: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, resetDatabaseState } = useFest();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FestEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<FestEvent | null>(null);
  const [previewingEvent, setPreviewingEvent] = useState<FestEvent | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('PRO_SHOW');
  const [artist, setArtist] = useState('');
  const [date, setDate] = useState('MARCH 16, 2026');
  const [time, setTime] = useState('06:00 PM IST');
  const [venue, setVenue] = useState('Main Campus Amphitheatre');
  const [basePrice, setBasePrice] = useState(499);
  const [totalSeats, setTotalSeats] = useState(48);
  const [shortDesc, setShortDesc] = useState('');
  const [tag, setTag] = useState('');
  const [ticketBgImage, setTicketBgImage] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.artistOrHost.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setTicketBgImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      title: title.trim(),
      category,
      artistOrHost: artist.trim() || 'Special Guest Artists',
      date: date.trim() || 'MARCH 16, 2026',
      time: time.trim() || '06:00 PM IST',
      venue: venue.trim() || 'Main Campus Amphitheatre',
      basePrice: Number(basePrice) || 299,
      totalSeats: Number(totalSeats) || 48,
      tag: tag.trim() || 'NEWLY ADDED PASS',
      shortDesc: shortDesc.trim() || 'Exclusive festival stage event added by administrator.',
      ticketBgImage: ticketBgImage.trim() || undefined,
    });

    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    updateEvent({
      ...editingEvent,
      title: title.trim(),
      category,
      artistOrHost: artist.trim() || editingEvent.artistOrHost,
      basePrice: Number(basePrice) || editingEvent.basePrice,
      venue: venue.trim() || editingEvent.venue,
      date: date.trim() || editingEvent.date,
      time: time.trim() || editingEvent.time,
      tag: tag.trim() || editingEvent.tag,
      shortDesc: shortDesc.trim() || editingEvent.shortDesc,
      ticketBgImage: ticketBgImage.trim() || undefined,
    });

    setEditingEvent(null);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (!deletingEvent) return;
    deleteEvent(deletingEvent.id);
    setDeletingEvent(null);
  };

  const openEdit = (e: FestEvent) => {
    setEditingEvent(e);
    setTitle(e.title);
    setCategory(e.category);
    setArtist(e.artistOrHost);
    setBasePrice(e.basePrice);
    setVenue(e.venue);
    setDate(e.date);
    setTime(e.time);
    setTag(e.tag || '');
    setShortDesc(e.shortDesc || '');
    setTicketBgImage(e.ticketBgImage || '');
  };

  const resetForm = () => {
    setTitle('');
    setCategory('PRO_SHOW');
    setArtist('');
    setDate('MARCH 16, 2026');
    setTime('06:00 PM IST');
    setVenue('Main Campus Amphitheatre');
    setBasePrice(499);
    setTotalSeats(48);
    setShortDesc('');
    setTag('');
    setTicketBgImage('');
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Event Details & Live Ticket Pass Preview Modal */}
      <EventDetailsModal
        event={previewingEvent}
        isOpen={!!previewingEvent}
        onClose={() => setPreviewingEvent(null)}
        onSelectSeats={() => setPreviewingEvent(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">
              INVENTORY MANAGEMENT
            </span>
            <span className="text-xs text-white/50">Stage Schedules &amp; Seat Tiers</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            FESTIVAL EVENTS &amp; CAPACITY
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Fest Event</span>
          </button>

          <button
            onClick={resetDatabaseState}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset DB to clean benchmark baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset DB</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#4C3549]/80 border border-white/15 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by title, artist, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#2A1D26] border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#DF367C]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#2A1D26] border border-white/15 rounded-xl px-3 py-2 text-white/80 focus:outline-none focus:border-[#DF367C]"
          >
            <option value="ALL">All Categories</option>
            <option value="PRO_SHOW">Pro Shows</option>
            <option value="EDM">EDM Nights</option>
            <option value="DANCE">Dance Clash</option>
            <option value="COMEDY">Comedy</option>
            <option value="BATTLE_OF_BANDS">Battle of Bands</option>
            <option value="HACKATHON">Hackathon</option>
          </select>
          <span className="text-white/40 px-2">Total: {filteredEvents.length}</span>
        </div>
      </div>

      {/* Events Inventory Table */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-x-auto space-y-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
              <th className="pb-3 pr-4">Event Details &amp; Ticket Style</th>
              <th className="pb-3 px-4">Category</th>
              <th className="pb-3 px-4">Base Price</th>
              <th className="pb-3 px-4">Capacity Breakdown</th>
              <th className="pb-3 px-4">Venue &amp; Schedule</th>
              <th className="pb-3 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {filteredEvents.map((e) => (
              <tr key={e.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 pr-4">
                  <div
                    onClick={() => setPreviewingEvent(e)}
                    className="cursor-pointer group flex items-start gap-3"
                  >
                    {e.ticketBgImage ? (
                      <img
                        src={e.ticketBgImage}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0 mt-0.5 shadow"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[#2A1D26] border border-white/15 flex items-center justify-center shrink-0 mt-0.5 text-white/40">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-[#FF7099] transition-colors flex items-center gap-1.5">
                        <span>{e.title}</span>
                        <Eye className="w-3.5 h-3.5 text-white/30 group-hover:text-[#FF7099] transition-colors" />
                      </div>
                      <div className="text-[11px] text-[#FF7099]">{e.artistOrHost}</div>
                      {e.tag && (
                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                          {e.tag}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-white/70">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase">
                    {e.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold text-[#FF7099]">
                  ₹{e.basePrice}
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-0.5 text-[11px]">
                    <div>Total: <strong className="text-white">{e.totalSeats}</strong></div>
                    <div className="text-[#10B981]">Booked: {e.bookedSeatsCount}</div>
                    <div className="text-amber-300">Locked: {e.lockedSeatsCount}</div>
                    <div className="text-white/60">Available: {e.availableSeats}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-white/60 text-[11px]">
                  <div>{e.date}</div>
                  <div>{e.time}</div>
                  <div className="truncate max-w-[160px] text-white/40">{e.venue}</div>
                </td>
                <td className="py-4 pl-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setPreviewingEvent(e)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title="Inspect Event & Ticket Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEdit(e)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title="Edit Event"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingEvent(e)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-white/40">
            No events match your current filter query.
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#4C3549] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#DF367C]/30 text-[#FF7099] text-[10px] font-bold">
                  NEW STAGE
                </span>
                <h3 className="text-xl font-bold text-white font-display">
                  CREATE FESTIVAL STAGE EVENT
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DJ SNAKE ARENA LIVE"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  >
                    <option value="PRO_SHOW">PRO_SHOW</option>
                    <option value="EDM">EDM</option>
                    <option value="BATTLE_OF_BANDS">BATTLE_OF_BANDS</option>
                    <option value="DANCE">DANCE</option>
                    <option value="HACKATHON">HACKATHON</option>
                    <option value="COMEDY">COMEDY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Headline Artist / Host</label>
                  <input
                    type="text"
                    placeholder="e.g. DJ Snake"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Total Seats (Capacity)</label>
                  <input
                    type="number"
                    min={12}
                    max={200}
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Timing</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. HIGH CONTENTION STAGE"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              {/* ── PHOTO BACKGROUND FOR TICKET PASS ── */}
              <div className="p-4 bg-[#2A1D26] rounded-2xl border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-white/90 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#FF7099]" />
                    <span>Ticket Background Photo</span>
                  </label>
                  {ticketBgImage && (
                    <button
                      type="button"
                      onClick={() => setTicketBgImage('')}
                      className="text-[10px] text-red-400 hover:underline"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL (e.g. https://...)"
                    value={ticketBgImage}
                    onChange={(e) => setTicketBgImage(e.target.value)}
                    className="flex-1 bg-[#1A1218] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#DF367C]"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#FF7099]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Presets */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-white/50">Or choose vibrant stage preset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {TICKET_BG_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setTicketBgImage(preset.url)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all flex items-center gap-1 cursor-pointer ${
                          ticketBgImage === preset.url
                            ? 'bg-[#DF367C] border-[#FF7099] text-white font-bold'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {ticketBgImage === preset.url && <Check className="w-3 h-3" />}
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mini Ticket Preview */}
                {ticketBgImage && (
                  <div className="pt-2">
                    <span className="text-[10px] text-white/40 block mb-1">Ticket Live Preview:</span>
                    <div
                      className="rounded-2xl p-3.5 border border-white/20 shadow-md text-white ticket-notch-left ticket-notch-right"
                      style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(20, 10, 18, 0.82), rgba(30, 15, 26, 0.94)), url(${ticketBgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold border-b border-white/15 pb-1.5">
                        <span className="text-[#FF7099]">VIBRANCE 2026 PASS</span>
                        <span className="text-emerald-300">₹{basePrice || 499}</span>
                      </div>
                      <div className="pt-1.5 text-xs font-black truncate">{title || 'STAGE EVENT TITLE'}</div>
                      <div className="text-[10px] text-white/60 truncate">{artist || 'Artist Name'} &bull; {venue}</div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis of event..."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white font-bold cursor-pointer shadow-lg"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#4C3549] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#FF7099]/20 text-[#FF7099] text-[10px] font-bold">
                  EDIT
                </span>
                <h3 className="text-xl font-bold text-white font-display">
                  EDIT EVENT: {editingEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  >
                    <option value="PRO_SHOW">PRO_SHOW</option>
                    <option value="EDM">EDM</option>
                    <option value="BATTLE_OF_BANDS">BATTLE_OF_BANDS</option>
                    <option value="DANCE">DANCE</option>
                    <option value="HACKATHON">HACKATHON</option>
                    <option value="COMEDY">COMEDY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Artist / Host</label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Timing</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              {/* ── PHOTO BACKGROUND FOR TICKET PASS (EDIT) ── */}
              <div className="p-4 bg-[#2A1D26] rounded-2xl border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-white/90 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#FF7099]" />
                    <span>Ticket Background Photo</span>
                  </label>
                  {ticketBgImage && (
                    <button
                      type="button"
                      onClick={() => setTicketBgImage('')}
                      className="text-[10px] text-red-400 hover:underline"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL (e.g. https://...)"
                    value={ticketBgImage}
                    onChange={(e) => setTicketBgImage(e.target.value)}
                    className="flex-1 bg-[#1A1218] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#DF367C]"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#FF7099]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Presets */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-white/50">Or choose vibrant stage preset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {TICKET_BG_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setTicketBgImage(preset.url)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all flex items-center gap-1 cursor-pointer ${
                          ticketBgImage === preset.url
                            ? 'bg-[#DF367C] border-[#FF7099] text-white font-bold'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {ticketBgImage === preset.url && <Check className="w-3 h-3" />}
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mini Ticket Preview */}
                {ticketBgImage && (
                  <div className="pt-2">
                    <span className="text-[10px] text-white/40 block mb-1">Ticket Live Preview:</span>
                    <div
                      className="rounded-2xl p-3.5 border border-white/20 shadow-md text-white ticket-notch-left ticket-notch-right"
                      style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(20, 10, 18, 0.82), rgba(30, 15, 26, 0.94)), url(${ticketBgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold border-b border-white/15 pb-1.5">
                        <span className="text-[#FF7099]">VIBRANCE 2026 PASS</span>
                        <span className="text-emerald-300">₹{basePrice || 499}</span>
                      </div>
                      <div className="pt-1.5 text-xs font-black truncate">{title || 'STAGE EVENT TITLE'}</div>
                      <div className="text-[10px] text-white/60 truncate">{artist || 'Artist Name'} &bull; {venue}</div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white font-bold cursor-pointer shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#4C3549] border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">DELETE FESTIVAL EVENT</h3>
                <p className="text-[11px] text-red-300">Action cannot be reversed</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#2A1D26] border border-white/10 space-y-2 text-xs">
              <div className="font-bold text-white text-sm">{deletingEvent.title}</div>
              <div className="text-white/60">{deletingEvent.artistOrHost} &bull; {deletingEvent.venue}</div>
              <div className="text-amber-300 text-[11px]">
                Deleting this event will remove its {deletingEvent.totalSeats} seats and cancel active locks.
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingEvent(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
              >
                Keep Event
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
