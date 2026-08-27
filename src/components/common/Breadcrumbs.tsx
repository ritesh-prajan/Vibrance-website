import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  backLink?: {
    label: string;
    path: string;
  };
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, backLink }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-6">
      {/* Breadcrumbs Trail */}
      <nav className="flex items-center gap-1.5 text-white/60">
        <Link
          to="/"
          className="hover:text-white flex items-center gap-1 transition-colors"
          title="Home"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Vibrance 2026</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="hover:text-white transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#FF7099] font-bold truncate max-w-[220px]">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Back Link CTA */}
      {backLink && (
        <Link
          to={backLink.path}
          className="inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors text-xs font-mono font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{backLink.label}</span>
        </Link>
      )}
    </div>
  );
};
