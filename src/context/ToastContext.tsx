import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, X, Clock } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export type ToastType = 'success' | 'warning' | 'error' | 'info';
export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
interface ToastCtx { showToast: (type: ToastType, message: string, duration?: number) => void; }

const ToastContext = createContext<ToastCtx>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  error: <XCircle className="w-4 h-4" />,
  info: <Clock className="w-4 h-4" />,
};
const STYLES: Record<ToastType, string> = {
  success: 'bg-[#0a1f18] border-[#10B981]/50 text-[#10B981]',
  warning: 'bg-[#211600] border-amber-500/50 text-amber-300',
  error: 'bg-[#200909] border-red-500/50 text-red-400',
  info: 'bg-[#4C3549] border-white/20 text-white/80',
};

const ToastEntry: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const reduced = usePrefersReducedMotion();
  React.useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), toast.duration ?? 3500);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: 70, scale: 0.95 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: 70, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={"flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-2xl font-mono text-xs max-w-xs w-full " + STYLES[toast.type]}
    >
      <span className="mt-0.5 shrink-0">{ICONS[toast.type]}</span>
      <span className="flex-1 leading-relaxed">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="ml-1 opacity-60 hover:opacity-100 transition-opacity shrink-0 cursor-pointer" aria-label="Dismiss">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const showToast = useCallback((type: ToastType, message: string, duration = 3500) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [{ id, type, message, duration }, ...prev].slice(0, 5));
  }, []);
  const dismiss = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastEntry toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
