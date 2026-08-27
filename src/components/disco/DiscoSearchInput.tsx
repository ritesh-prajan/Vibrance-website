import React from 'react';
import { Search, X } from 'lucide-react';

interface DiscoSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const DiscoSearchInput: React.FC<DiscoSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search stage, artist, venue...',
}) => {
  return (
    <div className="relative flex-1">
      <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#2A1D26]/90 border border-white/20 rounded-2xl pl-10 pr-9 py-2.5 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#FF3E41] shadow-inner transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
