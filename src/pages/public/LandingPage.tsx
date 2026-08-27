import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AmbientBlobs } from '../../components/common/AmbientBlobs';
import { GlitchText } from '../../components/common/GlitchText';
import { CrowdSilhouettes } from '../../components/landing/CrowdSilhouettes';
import { StageLightBeams } from '../../components/landing/StageLightBeams';
import { ParticleHazeCanvas } from '../../components/landing/ParticleHazeCanvas';
import { LoginFormSection } from '../../components/landing/LoginFormSection';
import { ChevronDown, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Scroll tracking across the 260vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track if hero is scrolled past to pause canvas particles
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setIsPastHero(latest > 0.85);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Section 1: Hero title & content transforms
  const heroTitleOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0]);
  const heroTitleScale = useTransform(scrollYProgress, [0, 0.32], [1, 0.86]);
  const heroTitleY = useTransform(scrollYProgress, [0, 0.32], [0, -45]);

  // Section 1: Stage & crowd visual layer dimming + fog rolling in
  const heroSceneOpacity = useTransform(scrollYProgress, [0, 0.45, 0.85], [1, 0.45, 0.15]);
  const heroDarkenOverlay = useTransform(scrollYProgress, [0, 0.55], [0, 0.82]);
  const heroBackdropBlur = useTransform(scrollYProgress, [0.15, 0.6], [0, 14]);

  // Section 2: Login card reveal
  const loginOpacity = useTransform(scrollYProgress, [0.38, 0.68], [0, 1]);
  const loginY = useTransform(scrollYProgress, [0.38, 0.68], [90, 0]);
  const loginScale = useTransform(scrollYProgress, [0.38, 0.68], [0.94, 1]);

  // Scroll down helper
  const handleScrollDown = () => {
    if (!containerRef.current) return;
    const scrollTarget = containerRef.current.scrollHeight * 0.72;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative bg-[#2A1D26] text-[#F3EDF2] min-h-[250vh]">
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* ─── LAYER 1: Ambient Gradient Blobs (Back) ─── */}
        <AmbientBlobs variant="login" />

        {/* ─── LAYER 2: Stage Sweeping Light Beams ─── */}
        <StageLightBeams />

        {/* ─── LAYER 3: Canvas Particle Haze Field (Front of beams) ─── */}
        <ParticleHazeCanvas isPaused={isPastHero} />

        {/* ─── LAYER 4: Energetic Crowd Silhouettes (Bottom third) ─── */}
        <CrowdSilhouettes />

        {/* Dynamic Darken + Fog Overlay (increases as user scrolls into login) */}
        <motion.div
          style={{
            opacity: reduced ? 0.4 : heroDarkenOverlay,
            backdropFilter: reduced ? 'none' : `blur(${heroBackdropBlur}px)`,
          }}
          className="pointer-events-none absolute inset-0 bg-[#2A1D26] z-15"
        />

        {/* ─── LAYER 5: Hero Main Headings & Content (Centered) ─── */}
        <motion.div
          style={{
            opacity: reduced ? 1 : heroTitleOpacity,
            scale: reduced ? 1 : heroTitleScale,
            y: reduced ? 0 : heroTitleY,
            pointerEvents: isPastHero ? 'none' : 'auto',
          }}
          className="relative z-20 max-w-4xl mx-auto px-4 text-center space-y-5 select-none"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF3E41]/20 border border-[#FF3E41]/50 text-[#FF3E41] text-xs font-mono font-bold tracking-widest uppercase shadow-xl"
          >
            <Zap className="w-3.5 h-3.5 fill-[#FF3E41]" />
            <span>ANNUAL CAMPUS FESTIVAL &bull; MARCH 13–15, 2026</span>
          </motion.div>

          {/* Glitch-in title reveal */}
          <GlitchText
            as="h1"
            className="text-6xl sm:text-8xl md:text-9xl font-display font-black text-white tracking-widest drop-shadow-[0_10px_35px_rgba(255,62,65,0.4)]"
            delay={50}
          >
            VIBRANCE 2026
          </GlitchText>

          <p className="text-sm sm:text-base text-white/80 font-mono max-w-2xl mx-auto leading-relaxed drop-shadow">
            Campus Fest Pass Reservations &bull; Real-time Seat Locking &bull; DBMS Concurrency Benchmark
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Strict 2PL ACID Concurrency
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF7099]" /> 6 Arena Stages &bull; 50k+ Passes
            </span>
          </div>

          {/* Scroll down indicator button */}
          <div className="pt-8">
            <motion.button
              onClick={handleScrollDown}
              animate={reduced ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex flex-col items-center gap-1.5 text-xs font-mono text-[#FF7099] hover:text-white transition-colors cursor-pointer"
            >
              <span className="tracking-widest uppercase text-[10px] font-bold">
                SCROLL TO ENTER PASS PORTAL
              </span>
              <ChevronDown className="w-5 h-5 text-[#FF3E41]" />
            </motion.button>
          </div>
        </motion.div>

        {/* ─── LAYER 6: Scroll-Linked Login Form Card (Fades & slides up) ─── */}
        <motion.div
          style={{
            opacity: reduced ? 1 : loginOpacity,
            y: reduced ? 0 : loginY,
            scale: reduced ? 1 : loginScale,
            pointerEvents: 'auto',
          }}
          className="absolute inset-0 z-30 flex items-center justify-center py-6 overflow-y-auto"
        >
          <LoginFormSection />
        </motion.div>
      </div>
    </div>
  );
};
