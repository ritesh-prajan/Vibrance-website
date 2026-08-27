import React from 'react';
import { FestEvent } from '../../types';
import { getEventTiming } from '../../utils/timeUtils';

interface TelemetryTimelineListProps {
  events: FestEvent[];
  onSelectEvent: (event: FestEvent) => void;
}

export const TelemetryTimelineList: React.FC<TelemetryTimelineListProps> = ({
  events,
  onSelectEvent,
}) => {
  return (
    <div className="space-y-2 font-mono">
      <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">
        All Stages Timeline
      </div>
      <div className="space-y-1.5">
        {events.map((ev) => {
          const t = getEventTiming(ev);
          return (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                t.isLive
                  ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                  : t.isExpired
                  ? 'bg-white/5 border-white/5 opacity-50'
                  : 'bg-[#4C3549]/50 border-white/10 hover:border-white/25 hover:bg-[#4C3549]'
              }`}
            >
              <div className="truncate pr-2">
                <div className="text-xs font-bold text-white truncate">{ev.title}</div>
                <div className="text-[10px] text-white/50">{t.formattedDate}</div>
              </div>
              <span
                className={`text-[10px] font-bold shrink-0 ${
                  t.isLive ? 'text-red-400' : t.isExpired ? 'text-white/40' : 'text-[#FF7099]'
                }`}
              >
                {t.countdownText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
