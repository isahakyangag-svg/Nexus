import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Menu, X, Download, Sun, Moon, Lock, Unlock } from 'lucide-react';
import { useAdmin } from '../context/AdminState';

export default function Navigation() {
  const { siteName, theme, setTheme, language, setLanguage, t, showToast } = useAdmin();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Real-time network state and latency tracker
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);
  const [estimatedPing, setEstimatedPing] = useState(15);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoveredLang, setHoveredLang] = useState<'ru' | 'en' | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const pingInterval = setInterval(() => {
      setEstimatedPing(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(8, Math.min(prev + delta, 36));
      });
    }, 4000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(pingInterval);
    };
  }, []);

  // Trigger toast on network connection status mutations
  const [isFirstOnlineCheck, setIsFirstOnlineCheck] = useState(true);
  useEffect(() => {
    if (isFirstOnlineCheck) {
      setIsFirstOnlineCheck(false);
      return;
    }
    if (isOnline) {
      showToast(t('toastOnlineRestore'), 'success');
    } else {
      showToast(t('toastOfflineWarning'), 'warning');
    }
  }, [isOnline]);

  const navLinks = [
    { id: 'home', label: t('navHome') },
    { id: 'features', label: t('navFeatures') },
    { id: 'about', label: t('navAbout') },
    { id: 'support', label: t('navSupport') },
    { id: 'download', label: t('navDownload') },
  ];

  // Monitor scroll for glass effect and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section finder
      const scrollPosition = window.scrollY + 200;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [language]);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? theme === 'light'
            ? 'bg-slate-50/90 border-slate-200/60 backdrop-blur-xl py-4 shadow-md shadow-slate-200/30'
            : 'bg-slate-950/70 border-white/10 backdrop-blur-xl py-4 shadow-lg shadow-purple-950/10'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Brand Logo */}
        <div
          onClick={() => handleLinkClick('home')}
          className="logo flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 transition-transform duration-500 group-hover:scale-105">
            <Globe className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <span className={`text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent ${
            theme === 'light'
              ? 'bg-gradient-to-r from-slate-950 to-purple-600'
              : 'bg-gradient-to-r from-white to-purple-300'
          }`}>
            {siteName}
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`text-sm font-medium transition-colors relative py-1 cursor-pointer ${
                activeSection === link.id
                  ? theme === 'light' ? 'text-purple-600 font-semibold' : 'text-purple-400 font-semibold'
                  : theme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.div
                  layoutId="activeSubbar"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls - Right */}
        <div className="hidden md:flex items-center gap-6">
          {/* Connection Status Indicator - Real-Time */}
          <div 
            id="nav-connection-status"
            className="relative" 
            onMouseEnter={() => setShowTooltip(true)} 
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all duration-300 cursor-pointer select-none ${
              isOnline
                ? theme === 'light'
                  ? 'bg-emerald-50/90 border-emerald-200/60 text-emerald-800 hover:bg-emerald-100/90'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-450 hover:bg-emerald-500/15'
                : theme === 'light'
                  ? 'bg-rose-50/90 border-rose-200/60 text-rose-800 hover:bg-rose-100/90'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/15'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOnline ? 'bg-emerald-400' : 'bg-rose-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                }`}></span>
              </span>
              
              <div className="flex items-center gap-1.5 font-mono tracking-tight text-[10.5px]">
                <span>{isOnline ? t('statusOnline') : t('statusOffline')}</span>
                <span className="opacity-35">|</span>
                <span className="flex items-center gap-0.5">
                  {isOnline ? <Lock className="w-3 h-3 text-emerald-500" /> : <Unlock className="w-3 h-3 text-rose-500" />}
                  <span className="text-[9.5px] uppercase font-bold">{isOnline ? t('statusSecured') : 'UNSECURED'}</span>
                </span>
                {isOnline && (
                  <>
                    <span className="opacity-35">|</span>
                    <span className="text-[10px] text-purple-400 font-extrabold">{estimatedPing}ms</span>
                  </>
                )}
              </div>
            </div>

            {/* Premium Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 top-9 z-50 w-64 p-4 rounded-2xl border shadow-xl backdrop-blur-lg text-xs leading-relaxed ${
                    theme === 'light'
                      ? 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50'
                      : 'bg-slate-950/95 border-white/10 text-slate-200 shadow-black/80'
                  }`}
                >
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-250/10 font-bold text-xs tracking-tight text-purple-400 justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-purple-500 animate-spin-slow" />
                      Nexus Tunnel
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                      isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                    }`}>
                      {isOnline ? 'ACTIVE' : 'DOWN'}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t('statusNetwork')}:</span>
                      <span className={isOnline ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold animate-pulse'}>
                        {isOnline ? t('statusOnline') : t('statusOffline')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t('statusProtocol')}:</span>
                      <span className="text-slate-300 font-semibold">{window.location.protocol.toUpperCase().replace(':', '')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t('statusEncryption')}:</span>
                      <span className="text-purple-400 font-semibold flex items-center gap-1">
                        {isOnline ? <Lock className="w-3 h-3 text-emerald-500 inline" /> : <Unlock className="w-3 h-3 text-rose-500 inline" />}
                        {isOnline ? 'TLSv1.3' : 'NONE'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t('statusPing')}:</span>
                      <span className="text-slate-300 font-semibold">{isOnline ? `${estimatedPing} ms` : '∞'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-slate-250/10 text-[9px] text-slate-400 text-center italic font-light">
                    {t('statusTLSDetail')}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <div className={`flex items-center gap-1 p-0.5 rounded-full text-xs border ${
              theme === 'light' ? 'bg-slate-200/50 border-slate-300/40' : 'bg-white/5 border-white/10'
            }`}>
              <button
                onClick={() => setLanguage('ru')}
                onMouseEnter={() => setHoveredLang('ru')}
                onMouseLeave={() => setHoveredLang(null)}
                className={`px-2.5 py-1 rounded-full text-[10px] tracking-wider transition-all font-extrabold cursor-pointer ${
                  language === 'ru'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : theme === 'light' ? 'text-slate-500 hover:text-slate-850' : 'text-slate-400 hover:text-white'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('en')}
                onMouseEnter={() => setHoveredLang('en')}
                onMouseLeave={() => setHoveredLang(null)}
                className={`px-2.5 py-1 rounded-full text-[10px] tracking-wider transition-all font-extrabold cursor-pointer ${
                  language === 'en'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : theme === 'light' ? 'text-slate-500 hover:text-slate-850' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <AnimatePresence>
              {hoveredLang && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 z-50 whitespace-nowrap px-3 py-1.5 rounded-xl text-[10.5px] font-bold border shadow-xl flex items-center gap-1.5 backdrop-blur-md pointer-events-none ${
                    theme === 'light'
                      ? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50'
                      : 'bg-slate-950/95 border-white/10 text-slate-200 shadow-black/80'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  <span>
                    {hoveredLang === 'ru'
                      ? (language === 'ru' ? t('langSelectedRU') : t('langSwitchRU'))
                      : (language === 'en' ? t('langSelectedEN') : t('langSwitchEN'))}
                  </span>
                  <div className={`absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 rotate-45 border-r border-b ${
                    theme === 'light'
                      ? 'bg-white/95 border-slate-200'
                      : 'bg-slate-950/95 border-white/10'
                  }`} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggler */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`cursor-pointer p-2 rounded-full border transition-all ${
              theme === 'light'
                ? 'bg-white border-slate-200 text-amber-500 hover:bg-slate-100 shadow-sm'
                : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
            }`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleLinkClick('download')}
            className="cursor-pointer relative overflow-hidden group py-2.5 px-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-purple-600/30 hover:shadow-purple-600/45 hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{t('navDownload')}</span>
            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`cursor-pointer p-2 rounded-full border transition-all ${
              theme === 'light'
                ? 'bg-slate-100 border-slate-200 text-amber-500'
                : 'bg-white/5 border-white/10 text-purple-300'
            }`}
          >
            {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex items-center justify-center transition-colors ${
              theme === 'light' ? 'text-slate-700 hover:text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={`md:hidden border-t overflow-hidden ${
              theme === 'light'
                ? 'border-slate-200 bg-slate-50/95 backdrop-blur-2xl'
                : 'border-white/10 bg-slate-950/95 backdrop-blur-2xl'
            }`}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left py-2 px-3 rounded-lg text-lg font-medium transition-all ${
                    activeSection === link.id
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold border-l-2 border-purple-500 pl-2'
                      : theme === 'light' ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              {/* Mobile Connection Status Bar */}
              <div className={`flex items-center justify-between py-2.5 px-4 rounded-2xl border transition-all ${
                theme === 'light' 
                  ? 'bg-slate-100/70 border-slate-200/80 text-slate-700 font-medium' 
                  : 'bg-white/5 border-white/5 text-slate-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isOnline ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}></span>
                  </span>
                  <span className="text-sm font-semibold font-mono">
                    {isOnline ? t('statusOnline') : t('statusOffline')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2.5 text-xs font-mono">
                  <span className={`flex items-center gap-1 font-bold ${isOnline ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isOnline ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{isOnline ? t('statusSecured') : 'UNSECURED'}</span>
                  </span>
                  {isOnline && <span className="opacity-30">|</span>}
                  {isOnline && <span className="text-purple-500 font-extrabold">{estimatedPing}ms</span>}
                </div>
              </div>

              <hr className={theme === 'light' ? 'border-slate-200 my-2' : 'border-slate-800/80 my-2'} />

              {/* Language Switcher inside mobile view */}
              <div className="flex justify-between items-center py-2">
                <span className={`text-sm font-semibold ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {language === 'ru' ? 'Язык' : 'Language'}
                </span>
                <div className={`flex items-center gap-1 p-0.5 rounded-full text-xs border ${
                  theme === 'light' ? 'bg-slate-200 border-slate-300' : 'bg-white/5 border-white/10'
                }`}>
                  <button
                    onClick={() => setLanguage('ru')}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      language === 'ru'
                        ? 'bg-purple-600 text-white'
                        : theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    RU
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      language === 'en'
                        ? 'bg-purple-600 text-white'
                        : theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              <hr className={theme === 'light' ? 'border-slate-200 my-2' : 'border-slate-800/80 my-2'} />

              <button
                onClick={() => handleLinkClick('download')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold transition-all shadow-md shadow-purple-600/30 font-semibold"
              >
                <Download className="w-5 h-5" />
                <span>{t('navButton')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
