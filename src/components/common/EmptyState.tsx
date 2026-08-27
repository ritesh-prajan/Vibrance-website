import React from 'react';
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
