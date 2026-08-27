import os

def w(p, c):
    full = os.path.abspath(p)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(c.strip() + '\n')
    print(f'Wrote {p}')

# 1. StatusBadge.tsx
w('src/components/common/StatusBadge.tsx', '''import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Lock,
  RefreshCw,
  Flame,
} from 'lucide-react';
import { BookingStatus, LockStatus, ScanResultStatus } from '../../types';

interface StatusBadgeProps {
  status: BookingStatus | LockStatus | ScanResultStatus | string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  label,
  showIcon = true,
}) => {
  let bgClass = 'bg-white/10 text-white/80 border-white/20';
  let icon = <Clock className="w-3 h-3" />;
  let text = label || status;

  switch (status) {
    // Booking & Scan status
    case 'confirmed':
    case 'VALID':
    case 'COMMITTED':
    case 'ACQUIRED':
      bgClass = 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40';
      icon = <CheckCircle2 className="w-3.5 h-3.5" />;
      text = label || (status === 'VALID' ? 'VALID PASS' : status === 'confirmed' ? 'CONFIRMED' : status);
      break;

    case 'checked_in':
      bgClass = 'bg-[#DF367C]/20 text-[#FF7099] border-[#DF367C]/40';
      icon = <CheckCircle2 className="w-3.5 h-3.5" />;
      text = label || 'CHECKED IN';
      break;

    case 'cancelled':
    case 'INVALID':
    case 'REJECTED':
    case 'DEADLOCK_ABORT':
      bgClass = 'bg-red-500/20 text-red-400 border-red-500/40';
      icon = <XCircle className="w-3.5 h-3.5" />;
      text = label || (status === 'INVALID' ? 'INVALID PASS' : status === 'cancelled' ? 'CANCELLED' : status);
      break;

    case 'ALREADY_USED':
      bgClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      icon = <AlertTriangle className="w-3.5 h-3.5" />;
      text = label || 'ALREADY USED';
      break;

    case 'LOCKED':
    case 'locked':
      bgClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      icon = <Lock className="w-3.5 h-3.5" />;
      text = label || 'LOCKED (TTL)';
      break;

    case 'EXPIRED':
      bgClass = 'bg-white/10 text-white/50 border-white/10';
      icon = <Clock className="w-3.5 h-3.5" />;
      text = label || 'EXPIRED';
      break;

    case 'RACE_OVERBOOK':
    case 'OVERBOOKED':
      bgClass = 'bg-red-500/30 text-red-300 border-red-500/50';
      icon = <Flame className="w-3.5 h-3.5" />;
      text = label || 'OVERBOOKED ANOMALY';
      break;

    default:
      break;
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px]'
      : size === 'lg'
      ? 'px-3 py-1.5 text-xs'
      : 'px-2.5 py-1 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono font-bold tracking-wider uppercase border ${bgClass} ${sizeClasses}`}
    >
      {showIcon && icon}
      <span>{text}</span>
    </span>
  );
};
''')

# 2. Breadcrumbs.tsx
w('src/components/common/Breadcrumbs.tsx', '''import React from 'react';
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
''')

# 3. SkeletonLoader.tsx
w('src/components/common/SkeletonLoader.tsx', '''import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'table' | 'seatmap';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  count = 3,
}) => {
  const items = Array.from({ length: count });

  if (variant === 'table') {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-[#4C3549] rounded-xl border border-white/10" />
        {items.map((_, i) => (
          <div
            key={i}
            className="h-14 bg-[#4C3549]/60 rounded-xl border border-white/5"
          />
        ))}
      </div>
    );
  }

  if (variant === 'seatmap') {
    return (
      <div className="p-6 bg-[#4C3549] rounded-3xl border border-white/15 space-y-4">
        <div className="h-10 bg-[#2A1D26] rounded-xl" />
        <div className="grid grid-cols-8 gap-2 py-4">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="h-10 bg-[#2A1D26] rounded-lg border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  // 'card' variant
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-[#4C3549] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg"
        >
          <div className="h-4 bg-[#883955] rounded w-1/3" />
          <div className="h-6 bg-[#2A1D26] rounded w-3/4" />
          <div className="h-3 bg-[#2A1D26] rounded w-1/2" />
          <div className="h-16 bg-[#2A1D26] rounded-xl" />
          <div className="h-9 bg-[#FF3E41]/30 rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
};
''')

# 4. EmptyState.tsx
w('src/components/common/EmptyState.tsx', '''import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionPath?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox className="w-8 h-8 text-white/40" />,
  title,
  description,
  actionText,
  actionPath,
  onAction,
}) => {
  return (
    <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xl space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#2A1D26] border border-white/10 flex items-center justify-center mx-auto shadow-inner">
        {icon}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-black text-white font-display tracking-wide">
          {title}
        </h3>
        <p className="text-xs text-white/60 font-sans-body leading-relaxed max-w-sm mx-auto">
          {description}
        </p>
      </div>

      {(actionText && (actionPath || onAction)) && (
        <div className="pt-2">
          {actionPath ? (
            <Link
              to={actionPath}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white text-xs font-bold font-mono transition-all shadow-md cursor-pointer"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
''')

# 5. RequireAuth.tsx
w('src/components/layout/RequireAuth.tsx', '''import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { UserRole } from '../../types';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  allowedRoles,
}) => {
  const { currentUser } = useFest();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (currentUser.role === 'gate_staff') {
      return <Navigate to="/verify" replace />;
    }
    return <Navigate to="/events" replace />;
  }

  return <>{children}</>;
};
''')

print('All common and layout components written cleanly.')
