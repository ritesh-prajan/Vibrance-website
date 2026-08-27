import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { FestEvent, EventCategory } from '../../types';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  RotateCcw,
} from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const { events, addEvent, updateEvent, resetDatabaseState } = useFest();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FestEvent | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('PRO_SHOW');
  const [artist, setArtist] = useState('');
  const [date, setDate] = useState('MARCH 16, 2026');
  const [time, setTime] = useState('06:00 PM IST');
  const [venue, setVenue] = useState('Main Campus Amphitheatre');
  const [basePrice, setBasePrice] = useState(499);
  const [shortDesc, setShortDesc] = useState('');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      title,
      category,
      artistOrHost: artist || 'Special Guest Artists',
      date,
      time,
      venue,
      basePrice,
      tag: 'NEWLY ADDED PASS',
      shortDesc: shortDesc || 'Exclusive festival stage event added by administrator.',
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setArtist('');
    setShortDesc('');
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    updateEvent({
      ...editingEvent,
      title,
      basePrice,
      venue,
      date,
      time,
    });

    setEditingEvent(null);
  };

  const openEdit = (e: FestEvent) => {
    setEditingEvent(e);
    setTitle(e.title);
    setBasePrice(e.basePrice);
    setVenue(e.venue);
    setDate(e.date);
    setTime(e.time);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">
              INVENTORY MANAGEMENT
            </span>
            <span className="text-xs text-white/50 font-mono">Stage Schedules &amp; Tiers</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            FESTIVAL EVENTS &amp; CAPACITY
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white text-xs font-bold font-mono transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Fest Event</span>
          </button>

          <button
            onClick={resetDatabaseState}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset DB to clean benchmark baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset DB</span>
          </button>
        </div>
      </div>

      {/* Events Inventory Table */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-x-auto space-y-4">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
              <th className="pb-3 pr-4">Event Details</th>
              <th className="pb-3 px-4">Category</th>
              <th className="pb-3 px-4">Base Price</th>
              <th className="pb-3 px-4">Capacity Breakdown</th>
              <th className="pb-3 px-4">Venue &amp; Schedule</th>
              <th className="pb-3 pl-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-white/5">
                <td className="py-4 pr-4">
                  <div className="font-bold text-white text-sm">{e.title}</div>
                  <div className="text-[11px] text-white/60">{e.artistOrHost}</div>
                </td>
                <td className="py-4 px-4 text-white/70">
                  {e.category.replace('_', ' ')}
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
                <td className="py-4 pl-4">
                  <button
                    onClick={() => openEdit(e)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Edit Event"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#4C3549] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white font-display">
              CREATE FESTIVAL STAGE EVENT
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 font-mono text-xs">
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
                  <label className="block text-white/70 mb-1">Base Pass Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                  />
                </div>
              </div>

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
                  className="flex-1 py-2.5 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white font-bold cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#4C3549] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white font-display">
              EDIT EVENT: {editingEvent.title}
            </h3>

            <form onSubmit={handleUpdateEvent} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-white/70 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#DF367C]"
                />
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
                  className="flex-1 py-2.5 rounded-xl bg-[#DF367C] hover:bg-[#c42867] text-white font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
