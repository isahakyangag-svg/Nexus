import { motion, AnimatePresence } from 'motion/react';
import AnimatedBg from './components/AnimatedBg';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Support from './components/Support';
import Download from './components/Download';
import Footer from './components/Footer';
import { AdminProvider, useAdmin } from './context/AdminState';
import AdminPanelOverlay from './components/AdminPanel';
import FeedbackWidget from './components/FeedbackWidget';
import ToastContainer from './components/ToastContainer';
import BackToTop from './components/BackToTop';
import UpdatesScreen from './components/UpdatesScreen';

function AppContent() {
  const { theme, showUpdatesModal } = useAdmin();
  
  return (
    <div className={`relative min-h-screen font-sans selection:bg-violet-500/30 selection:text-white transition-colors duration-300 ${
      theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#05050a] text-white'
    }`}>
      {/* 8K Premium Ambient Motion Wallpaper */}
      {theme === 'dark' && <AnimatedBg />}

      {/* Glassmorphic Sticky Header Brand Navigation */}
      <Navigation />

      {/* Main Content Area with Page Transitions */}
      <AnimatePresence mode="wait">
        {showUpdatesModal ? (
          <motion.div
            key="updates-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="pt-24 min-h-screen relative z-10"
          >
            <UpdatesScreen />
          </motion.div>
        ) : (
          <motion.div
            key="landing-screen"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main Structural Body */}
            <main className="relative z-10 w-full overflow-x-hidden pt-24">
              
              {/* Hero Banner Section with Voice chat demo */}
              <Hero />

              {/* Bento Interactive Features Grid Playgrounds Section */}
              <Features />

              {/* Values and Custom Metrics Section */}
              <About />

              {/* Live Customer AI Chat and Social contacts Desk Section */}
              <Support />

              {/* OS Selectable Setup Installer download bay */}
              <Download />

            </main>

            {/* Foot Directory and copyright info */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Interactive Custom Admin Panel overlay */}
      <AdminPanelOverlay />

      {/* Floating micro-interaction instant feedback popover trigger */}
      <FeedbackWidget />

      {/* Auto-hiding modern back-to-top feature */}
      <BackToTop />

      {/* Centralized notification toast system */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}
