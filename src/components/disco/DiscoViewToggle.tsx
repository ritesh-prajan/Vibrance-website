import React from 'react';
import { Grid, Layers } from 'lucide-react';

interface DiscoViewToggleProps {
  mode: 'GRID' | 'GROUPED';
  onChange: (mode: 'GRID' | 'GROUPED') => void;
}

export const DiscoViewToggle: React.FC<DiscoViewToggleProps> = ({ mode, onChange }) => {
  return (
    <div className="flex items-center bg-[#2A1D26]/90 border border-white/20 rounded-2xl p-1 shadow-inner">
      <button
        onClick={() => onChange('GRID')}
        title="Grid View"
        className={`p-1.5 rounded-xl transition-all cursor-pointer ${
          mode === 'GRID' ? 'bg-[#FF3E41] text-white shadow-md' : 'text-white/40 hover:text-white'
        }`}
      >
        <Grid className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onChange('GROUPED')}
        title="Categorized Swimlanes View"
        className={`p-1.5 rounded-xl transition-all cursor-pointer ${
          mode === 'GROUPED' ? 'bg-[#FF3E41] text-white shadow-md' : 'text-white/40 hover:text-white'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
