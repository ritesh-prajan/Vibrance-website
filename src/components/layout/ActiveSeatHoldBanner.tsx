import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Seat } from '../../types';

interface ActiveSeatHoldBannerProps {
  activeSeat: Seat;
  activeSeatEventId: string | null;
  eventTitle?: string;
  timeRemaining: number;
  onRelease: () => void;
}

export const ActiveSeatHoldBanner: React.FC<ActiveSeatHoldBannerProps> = ({
  activeSeat,
  activeSeatEventId,
  eventTitle,
  timeRemaining,
  onRelease,
}) => {
  const location = useLocation();

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isCheckoutPage = activeSeatEventId ? location.pathname === `/checkout/${activeSeatEventId}` : false;


  return (
    <div className="sticky top-0 z-50 bg-[#4C3549] border-b border-[#FF3E41] text-white px-4 py-2 text-xs font-mono flex items-center justify-between shadow-xl">
      <div className="flex items-center gap-2">
        <motion.span
          className="w-2 h-2 rounded-full bg-[#FF3E41] inline-block"
          animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        <span className="font-bold text-[#FF7099]">ACTIVE SEAT HOLD:</span>
        <span>Seat [{activeSeat.row}-{activeSeat.number}]</span>
        <span className="hidden sm:inline text-white/60">({activeSeat.eventTitle})</span>
        <motion.span
          className="font-mono px-2 py-0.5 rounded text-[11px] font-bold"
          animate={{
            backgroundColor:
              timeRemaining <= 10
                ? ['#FF3E41', '#FF0000', '#FF3E41']
                : timeRemaining <= 30
                ? ['#FF3E41', '#f59e0b', '#FF3E41']
                : ['#FF3E41'],
          }}
          transition={{
            duration: timeRemaining <= 10 ? 0.6 : 1.5,
            repeat: Infinity,
          }}
          style={{ color: 'white' }}
        >
          {formatTimer(timeRemaining)}
        </motion.span>
      </div>

      <div className="flex items-center gap-2">
        {!isCheckoutPage && (
          <NavLink
            to={`/checkout/${activeSeat.eventId}`}
            className="px-3 py-1 rounded bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold transition-all shadow-md flex items-center gap-1"
          >
            <span>Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        )}
        <button
          onClick={onRelease}
          className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
        >
          Release
        </button>
      </div>
    </div>
  );
};
