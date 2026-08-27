import React from 'react';
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
