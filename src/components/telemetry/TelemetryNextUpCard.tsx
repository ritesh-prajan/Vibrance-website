import React from 'react';
import { FestEvent } from '../../types';
import { EventTimingInfo } from '../../utils/timeUtils';
import { Zap, Ticket, ArrowRight } from 'lucide-react';

interface TelemetryNextUpCardProps {
  event: FestEvent;
  timing: EventTimingInfo;
  onSelectSeats: (event: FestEvent) => void;
}

export const TelemetryNextUpCard: React.FC<TelemetryNextUpCardProps> = ({
  event,
  timing,
  onSelectSeats,
}) => {
  const percentBooked = Math.round((event.bookedSeatsCount / event.totalSeats) * 100);

  return (
    <div className="bg-[#4C3549] border-2 border-[#FF3E41]/50 rounded-2xl p-4 space-y-3 shadow-xl font-mono">
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full bg-[#FF3E41] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3 h-3 fill-white" />
          NEXT SHOW
        </span>
        <span className="text-[10px] text-[#FF7099] font-bold">{timing.countdownText}</span>
      </div>

      <div>
        <h4 className="text-sm font-black text-white leading-snug">{event.title}</h4>
        <p className="text-[11px] text-[#FF7099] mt-0.5">
          {timing.formattedDate} &bull; {timing.formattedTime}
        </p>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-white/60">
          <span>SEAT AVAILABILITY</span>
          <span className="text-white font-bold">
            {event.availableSeats} / {event.totalSeats}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-[#FF3E41]" style={{ width: `${percentBooked}%` }} />
        </div>
      </div>

      <button
        onClick={() => onSelectSeats(event)}
        className="w-full py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition-colors"
      >
        <Ticket className="w-3.5 h-3.5" />
        <span>Reserve Seats (&#8377;{event.basePrice})</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </button>
    </div>
  );
};
