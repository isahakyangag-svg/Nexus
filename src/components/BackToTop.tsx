import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useAdmin } from '../context/AdminState';

export default function BackToTop() {
  const { theme, t } = useAdmin();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past 350px (beyond hero section)
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-24 right-6 z-50 flex flex-col items-end pointer-events-none"
        >
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`pointer-events-auto cursor-pointer w-14 h-14 rounded-full flex items-center justify-center border transition-all group relative shadow-lg ${
              isDark
                ? 'bg-slate-900 border-white/10 text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-slate-200/50'
            }`}
            aria-label={t('backToTop')}
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-250 ease-out" />

            {/* Premium slide-out tooltip matching FeedbackWidget style */}
            <div className="absolute right-16 scale-0 group-hover:scale-100 transition-all origin-right duration-250 pr-1 pointer-events-none">
              <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shadow-md border ${
                isDark
                  ? 'bg-slate-900 border-white/10 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-700 shadow-slate-200/30'
              }`}>
                {t('backToTop')}
              </div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
