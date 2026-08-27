import React from 'react';
import { Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { currentUser } = useFest();

  const homePath =
    currentUser?.role === 'admin'
      ? '/admin'
      : currentUser?.role === 'gate_staff'
      ? '/verify'
      : '/events';

  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-8 sm:p-14 max-w-lg shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#FF3E41]/20 border border-[#FF3E41]/40 text-[#FF3E41] flex items-center justify-center mx-auto shadow-lg">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#FF3E41]/20 text-[#FF3E41] border border-[#FF3E41]/40">
            ERROR 404 • ROUTE NOT FOUND
          </span>
          <h1 className="text-3xl font-black text-white font-display tracking-wide pt-2">
            RESOURCE NOT FOUND
          </h1>
          <p className="text-xs text-white/60 font-sans-body leading-relaxed max-w-sm mx-auto">
            The page or festival pass route you requested does not exist in the Vibrance 2026 database registry.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
          <Link
            to={homePath}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            to="/events"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Festival Events Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
