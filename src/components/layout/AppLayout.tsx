import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Menu, X } from 'lucide-react';
import { LiveScheduleDrawer } from '../common/LiveScheduleDrawer';
import { DiscoLightsBackground } from '../common/DiscoLightsBackground';
import { ActiveSeatHoldBanner } from './ActiveSeatHoldBanner';
import { NavbarBrand } from './NavbarBrand';
import { NavRoleLinks } from './NavRoleLinks';
import { UserPersonaMenu } from './UserPersonaMenu';
import { MobileNavMenu } from './MobileNavMenu';
import AuroraBackground from '../ui/aurora-background';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, activeSeat, activeSeatEventId, selectedEvent, seatLockTimeRemaining, releaseActiveSeat } = useFest();
  const navigate = useNavigate();
  const location = useLocation();
  const reduced = usePrefersReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const pageVariants = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 8 },
    animate: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit:    reduced ? { opacity: 0 } : { opacity: 0, y: -6 },
  };

  return (
    <>
      {/* Fixed aurora atmospheric layer — sits behind everything */}
      <AuroraBackground
        className="fixed inset-0 w-full h-full pointer-events-none"
        starCount={60}
        pulseDuration={14}
        ariaLabel="Vibrance aurora atmosphere"
      />

      <div className="min-h-screen text-[#F3EDF2] flex flex-col font-sans selection:bg-[#FF3E41] selection:text-white relative z-10">
        {/* Global Left Slide Telemetry Drawer — students only */}
        {currentUser?.role === 'student' && <LiveScheduleDrawer />}

        {/* Seat Hold Banner */}
        {activeSeat && seatLockTimeRemaining > 0 && currentUser?.role === 'student' && (
          <ActiveSeatHoldBanner
            activeSeat={activeSeat}
            activeSeatEventId={activeSeatEventId}
            eventTitle={selectedEvent?.title}
            timeRemaining={seatLockTimeRemaining}
            onRelease={releaseActiveSeat}
          />
        )}

        {/* Main Navbar */}
        <header className="bg-[#4C3549]/95 backdrop-blur-xl border-b border-white/15 sticky top-0 z-50 shadow-xl">
          <DiscoLightsBackground intensity="subtle" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between h-16">
              <NavbarBrand />

              <NavRoleLinks role={currentUser?.role} />

              <div className="flex items-center gap-3">
                <UserPersonaMenu onLogout={handleLogout} />

                <div className="flex md:hidden items-center gap-2">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-xl bg-[#2A1D26] text-white border border-white/15 cursor-pointer"
                    aria-label="Toggle mobile menu"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <MobileNavMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            role={currentUser?.role}
            userName={currentUser?.name}
            onLogout={handleLogout}
          />
        </header>

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-[#4C3549]/60 border-t border-white/10 py-6 mt-12 text-center text-xs font-mono text-white/50">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>&copy; 2026 Vibrance Annual Cultural Fest &bull; VIT Chennai</div>
            <div className="text-[#FF7099]">DBMS ACID Strict 2PL Demonstration</div>
          </div>
        </footer>
      </div>
    </>
  );
};
