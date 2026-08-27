import React from 'react';
import { FestEvent } from '../../types';
import { EventTimingInfo } from '../../utils/timeUtils';
import { Radio, Ticket } from 'lucide-react';

interface TelemetryLiveCardProps {
  event: FestEvent;
  timing: EventTimingInfo;
  onSelectSeats: (event: FestEvent) => void;
}

export const TelemetryLiveCard: React.FC<TelemetryLiveCardProps> = ({
  event,
  timing,
  onSelectSeats,
}) => {
  return (
    <div className="bg-red-500/15 border-2 border-red-500/50 rounded-2xl p-4 space-y-3 shadow-lg relative overflow-hidden font-mono">
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
          <Radio className="w-3 h-3 animate-ping" />
          LIVE NOW
        </span>
        <span className="text-[10px] text-red-300 font-bold">{timing.countdownText}</span>
      </div>

      <div>
        <h4 className="text-sm font-black text-white leading-snug">{event.title}</h4>
        <p className="text-[11px] text-white/70 mt-0.5">{event.artistOrHost}</p>
        <p className="text-[10px] text-white/50 mt-1">{event.venue}</p>
      </div>

      <button
        onClick={() => onSelectSeats(event)}
        className="w-full py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
      >
        <Ticket className="w-3.5 h-3.5" />
        <span>Gate Admission (&#8377;{event.basePrice})</span>
      </button>
    </div>
  );
};
