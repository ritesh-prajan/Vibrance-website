import React, { useEffect, useRef, useState } from 'react';
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
