import React from 'react';
import { DiscoLightsBackground } from './DiscoLightsBackground';
import {
  DiscoSearchInput,
  DiscoStatusPopdown,
  DiscoGenrePopdown,
  DiscoSortPopdown,
  DiscoViewToggle,
  TimeFilterStatus,
} from '../disco';

export interface DiscoControlBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  timeFilter: TimeFilterStatus;
  onTimeFilterChange: (t: TimeFilterStatus) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'GRID' | 'GROUPED';
  onViewModeChange: (mode: 'GRID' | 'GROUPED') => void;
  totalResults: number;
}

export const DiscoControlBar: React.FC<DiscoControlBarProps> = ({
  searchQuery,
  onSearchChange,
  timeFilter,
  onTimeFilterChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="relative rounded-3xl bg-[#4C3549]/85 backdrop-blur-2xl border border-white/20 p-4 sm:p-5 shadow-[0_15px_45px_rgba(0,0,0,0.4)] font-mono text-xs z-30">
      {/* Contained Disco Light Beam Animations */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <DiscoLightsBackground intensity="vibrant" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        {/* Search */}
        <DiscoSearchInput value={searchQuery} onChange={onSearchChange} />

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <DiscoStatusPopdown value={timeFilter} onChange={onTimeFilterChange} />
          <DiscoGenrePopdown value={selectedCategory} onChange={onCategoryChange} />
          <DiscoSortPopdown value={sortBy} onChange={onSortChange} />
          <DiscoViewToggle mode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>
    </div>
  );
};
