import React from 'react';
import { FestEvent } from '../../types';
import { EventCard } from '../EventCard';

interface EventTimelineSwimlaneProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  events: FestEvent[];
  onSelectSeats: (event: FestEvent) => void;
  accentBorderClass?: string;
  opacityClass?: string;
}

export const EventTimelineSwimlane: React.FC<EventTimelineSwimlaneProps> = ({
  title,
  count,
  icon,
  events,
  onSelectSeats,
  accentBorderClass = 'border-white/10',
  opacityClass = 'opacity-100',
}) => {
  if (events.length === 0) return null;

  return (
    <section className={`space-y-4 ${opacityClass}`}>
      <div className={`flex items-center gap-2 pb-2 border-b ${accentBorderClass}`}>
        <span className="shrink-0">{icon}</span>
        <h2 className="text-sm font-black text-white/90 uppercase tracking-wider font-mono">
          {title} ({count})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onSelectSeats={onSelectSeats} />
        ))}
      </div>
    </section>
  );
};
