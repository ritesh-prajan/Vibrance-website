import os
def w(p, c):
    full = os.path.abspath(p)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(c.strip() + '\n')
    print(f'Wrote {p}')

# ---------- usePrefersReducedMotion ----------
w('src/hooks/usePrefersReducedMotion.ts', """import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setPrefersReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
""")

# ---------- useCountUp ----------
w('src/hooks/useCountUp.ts', """import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 1000): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setValue(0);
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return value;
}
""")

# ---------- AmbientBlobs ----------
w('src/components/common/AmbientBlobs.tsx', """import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface AmbientBlobsProps {
  variant?: 'login' | 'hero';
}

export const AmbientBlobs: React.FC<AmbientBlobsProps> = ({ variant = 'login' }) => {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  const size = variant === 'hero' ? 480 : 400;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute rounded-full bg-[#FF3E41] blur-[100px]"
        style={{ width: size, height: size, top: '-15%', left: '-10%', opacity: 0.055 }}
        animate={{ x: [0, 35, -18, 28, 0], y: [0, -22, 32, -12, 0], scale: [1, 1.07, 0.94, 1.04, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full bg-[#DF367C] blur-[110px]"
        style={{ width: size * 0.85, height: size * 0.85, bottom: '-12%', right: '-8%', opacity: 0.062 }}
        animate={{ x: [0, -28, 18, -22, 0], y: [0, 24, -28, 16, 0], scale: [1, 0.92, 1.09, 0.96, 1] }}
        transition={{ duration: 37, repeat: Infinity, ease: 'linear', delay: 7 }}
      />
    </div>
  );
};
""")

# ---------- GlitchText ----------
w('src/components/common/GlitchText.tsx', """import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  delay?: number;
}

type Phase = 'hidden' | 'glitch1' | 'glitch2' | 'settled';

export const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  className = '',
  as: Tag = 'h1',
  delay = 0,
}) => {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>('hidden');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const t0 = setTimeout(() => setPhase('glitch1'), delay);
    const t1 = setTimeout(() => setPhase('glitch2'), delay + 80);
    const t2 = setTimeout(() => setPhase('settled'), delay + 200);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [delay]);

  if (reduced) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: delay / 1000 }}>
        <Tag className={className}>{children}</Tag>
      </motion.div>
    );
  }

  const isGlitching = phase === 'glitch1' || phase === 'glitch2';
  const dx = phase === 'glitch1' ? -5 : 3;

  return (
    <div style={{ position: 'relative' }}>
      {isGlitching && (
        <Tag
          className={className}
          style={{ position: 'absolute', inset: 0, color: '#FF3E41', transform: `translateX(${dx}px)`,
            opacity: 0.65, clipPath: 'inset(15% 0 55% 0)', mixBlendMode: 'screen', pointerEvents: 'none', userSelect: 'none' }}
          aria-hidden
        >{children}</Tag>
      )}
      {isGlitching && (
        <Tag
          className={className}
          style={{ position: 'absolute', inset: 0, color: '#6699FF', transform: `translateX(${-dx}px)`,
            opacity: 0.55, clipPath: 'inset(55% 0 15% 0)', mixBlendMode: 'screen', pointerEvents: 'none', userSelect: 'none' }}
          aria-hidden
        >{children}</Tag>
      )}
      <Tag className={className} style={{ opacity: phase === 'hidden' ? 0 : 1, transition: 'opacity 0.04s' }}>
        {children}
      </Tag>
    </div>
  );
};
""")

# ---------- Toast system ----------
w('src/context/ToastContext.tsx', """import React, { createContext, useCallback, useContext, useState } from 'react';
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
""")

print('All anim utility files written successfully.')
