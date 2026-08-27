import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AmbientBlobs } from '../../components/common/AmbientBlobs';
import { GlitchText } from '../../components/common/GlitchText';
import { CrowdSilhouettes } from '../../components/landing/CrowdSilhouettes';
import { StageLightBeams } from '../../components/landing/StageLightBeams';
import { ParticleHazeCanvas } from '../../components/landing/ParticleHazeCanvas';
import { LoginFormSection } from '../../components/landing/LoginFormSection';
import { ChevronDown, Sparkles, Zap, ShieldCheck, ArrowDown, LogIn } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Scroll tracking across the 240vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setIsPastHero(latest > 0.35);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Section 1: Hero title & content transforms
  const heroTitleOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const heroTitleScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.88]);
  const heroTitleY = useTransform(scrollYProgress, [0, 0.28], [0, -40]);

  // Section 1: Stage visual layer dimming + fog rolling in
  const heroDarkenOverlay = useTransform(scrollYProgress, [0, 0.45], [0, 0.78]);
  const heroBackdropBlur = useTransform(scrollYProgress, [0.1, 0.5], [0, 12]);

  // Section 2: Login card reveal
  const loginOpacity = useTransform(scrollYProgress, [0.28, 0.58], [0, 1]);
  const loginY = useTransform(scrollYProgress, [0.28, 0.58], [80, 0]);
  const loginScale = useTransform(scrollYProgress, [0.28, 0.58], [0.95, 1]);

  // Scroll down to login helper
  const handleScrollToLogin = () => {
    if (!containerRef.current) return;
    const target = containerRef.current.scrollHeight * 0.75;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  const handleScrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative bg-[#2A1D26] text-[#F3EDF2] min-h-[240vh]">
      {/* Quick Nav Bar on Top Right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {!isPastHero ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleScrollToLogin}
            className="px-4 py-2 rounded-full bg-[#FF3E41] hover:bg-[#e03235] text-white font-mono font-bold text-xs shadow-2xl flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Personas &darr;</span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleScrollToHero}
            className="px-4 py-2 rounded-full bg-[#4C3549]/90 hover:bg-[#883955] text-white border border-white/20 font-mono font-bold text-xs shadow-2xl flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
          >
            <span>&uarr; Back to Hero Stage</span>
          </motion.button>
        )}
      </div>

      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* ─── LAYER 1: Ambient Gradient Blobs (Back) ─── */}
        <AmbientBlobs variant="login" />

        {/* ─── LAYER 2: Stage Sweeping Light Beams ─── */}
        <StageLightBeams />

        {/* ─── LAYER 3: Canvas Particle Haze Field (Front of beams) ─── */}
        <ParticleHazeCanvas isPaused={false} />

        {/* ─── LAYER 4: Energetic Crowd Silhouettes (Bottom third) ─── */}
        <CrowdSilhouettes />

        {/* Dynamic Darken + Fog Overlay */}
        <motion.div
          style={{
            opacity: reduced ? 0.35 : heroDarkenOverlay,
            backdropFilter: reduced ? 'none' : `blur(${heroBackdropBlur}px)`,
          }}
          className="pointer-events-none absolute inset-0 bg-[#2A1D26] z-15"
        />

        {/* ─── LAYER 5: Hero Main Headings & Content (Centered) ─── */}
        <motion.div
          style={{
            opacity: reduced ? (isPastHero ? 0 : 1) : heroTitleOpacity,
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

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Strict 2PL ACID Concurrency
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF7099]" /> 6 Arena Stages &bull; 50k+ Passes
            </span>
          </div>

          {/* Direct CTA + Scroll indicator */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleScrollToLogin}
              className="px-6 py-3.5 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-mono font-bold text-xs shadow-2xl flex items-center gap-2 cursor-pointer"
            >
              <span>Get Passes &bull; Choose Persona</span>
              <ArrowDown className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="pt-4">
            <motion.button
              onClick={handleScrollToLogin}
              animate={reduced ? {} : { y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex flex-col items-center gap-1 text-[11px] font-mono text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <span>SCROLL DOWN TO ENTER PORTAL</span>
              <ChevronDown className="w-4 h-4 text-[#FF7099]" />
            </motion.button>
          </div>
        </motion.div>

        {/* ─── LAYER 6: Scroll-Linked Login Form Card ─── */}
        <motion.div
          style={{
            opacity: reduced ? (isPastHero ? 1 : 0) : loginOpacity,
            y: reduced ? 0 : loginY,
            scale: reduced ? 1 : loginScale,
            pointerEvents: isPastHero ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-30 flex items-center justify-center py-8 overflow-y-auto"
        >
          <LoginFormSection />
        </motion.div>
      </div>
    </div>
  );
};
