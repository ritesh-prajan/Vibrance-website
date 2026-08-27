import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface TelemetryTriggerTabProps {
  onOpen: () => void;
}

export const TelemetryTriggerTab: React.FC<TelemetryTriggerTabProps> = ({ onOpen }) => {
  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden sm:flex"
    >
      <motion.button
        whileHover={{ x: 4, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpen}
        className="group bg-gradient-to-b from-[#FF3E41] via-[#DF367C] to-[#883955] text-white p-2.5 pl-3 rounded-r-2xl shadow-[0_0_25px_rgba(255,62,65,0.4)] border-r-2 border-y-2 border-white/25 flex items-center gap-2 cursor-pointer backdrop-blur-md"
        aria-label="Open Festival Schedule Telemetry"
      >
        <div className="flex flex-col items-center gap-1.5 py-1">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            className="font-mono font-black text-[11px] tracking-widest uppercase rotate-180 py-1"
          >
            LIVE &bull; NEXT SHOWS
          </span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </motion.button>
    </motion.div>
  );
};
