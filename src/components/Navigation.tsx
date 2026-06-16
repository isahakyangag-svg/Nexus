import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Menu, X, Download, Sun, Moon, Lock, Unlock, Sparkles, Activity, Bell, Layers, Cpu, Terminal, Code, CheckCircle, Flame, Gift, Video, Headphones, RefreshCw, ChevronRight, Shield, RefreshCcw } from 'lucide-react';
import { useAdmin } from '../context/AdminState';
import AnimateBrand from './AnimateBrand';

const MODAL_MOCK_CODE = `// Initialize Nexus High Fidelity Video Relay
import { NexusCodec, AV1Engine } from '@nexus/video';

const session = await AV1Engine.startStream({
  resolution: "8K_ULTRA",
  framerate: 144,
  quantumSecure: true
});

console.log("Nexus video streams live!");`;

const MODAL_MOCK_LOGS = [
  "AV1: Booting dynamic rate allocator.",
  "NET: Peer linked to london-node-9.",
  "DECODE: HW Acceleration matched CJS.",
  "SECURE: Handshake validated cryptographically.",
  "AV1: Adaptive frame quantizer optimised (QP: 16)",
  "PEER: P2P Tunneling latency stabilized.",
  "AUDIO: Active voice enhancement toggled on.",
  "SYSTEM: CPU thread pool load under 3.5%",
  "DECODE: Remote client handshakes matched TLS v1.3."
];

export default function Navigation() {
  const { siteName, siteLogo, theme, setTheme, language, setLanguage, t, showToast, showUpdatesModal, setShowUpdatesModal } = useAdmin();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Updates Modal State & Controls
  const [updatesTab, setUpdatesTab] = useState<'all' | 'video' | 'audio' | 'crypto'>('all');
  const [modalAudioFilterActive, setModalAudioFilterActive] = useState(true);
  const [modalVideoRes, setModalVideoRes] = useState<'720p' | '1080p' | '4k' | '8k'>('8k');
  const [modalTypewriterIdx, setModalTypewriterIdx] = useState(0);
  const [modalLogOffset, setModalLogOffset] = useState(0);

  // Real-time network state and latency tracker
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);
  const [estimatedPing, setEstimatedPing] = useState(12);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoveredLang, setHoveredLang] = useState<'ru' | 'en' | null>(null);

  // Secure Nexus Relay Tunnels States
  const [selectedRelayId, setSelectedRelayId] = useState('zurich');
  const [txSpeed, setTxSpeed] = useState(148.4); // KB/s
  const [rxSpeed, setRxSpeed] = useState(384.9); // KB/s
  const [isRotating, setIsRotating] = useState(false);
  const [relayMetrics, setRelayMetrics] = useState<Record<string, { ping: number; load: number }>>({
    zurich: { ping: 11, load: 38 },
    frankfurt: { ping: 16, load: 42 },
    reykjavik: { ping: 29, load: 15 },
    tokyo: { ping: 115, load: 52 },
    singapore: { ping: 138, load: 47 },
  });

  const relayNodes = [
    { id: 'zurich', name: 'Zurich Secure Shield', city: 'Zurich, CH', flag: '🇨🇭', type: 'AES-256-GCM' },
    { id: 'frankfurt', name: 'Frankfurt Core Tunnel', city: 'Frankfurt, DE', flag: '🇩🇪', type: 'AES-256-GCM' },
    { id: 'reykjavik', name: 'Icelandic Polar Air', city: 'Reykjavik, IS', flag: '🇮🇸', type: 'PQ-KYBER-1024' },
    { id: 'tokyo', name: 'Tokyo Quantum Relay', city: 'Tokyo, JP', flag: '🇯🇵', type: 'AES-GCM-256' },
    { id: 'singapore', name: 'Singapore Equator Bridge', city: 'Singapore, SG', flag: '🇸🇬', type: 'AES-256-GCM' },
  ];

  const activeRelay = relayNodes.find(node => node.id === selectedRelayId) || relayNodes[0];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const pingInterval = setInterval(() => {
      // Dynamic overall ping
      setEstimatedPing(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(8, Math.min(prev + delta, 36));
      });

      // Update speeds dynamically to feel real-time and premium
      setTxSpeed(prev => {
        const delta = (Math.random() * 40 - 20);
        return parseFloat(Math.max(20.4, Math.min(prev + delta, 400)).toFixed(1));
      });
      setRxSpeed(prev => {
        const delta = (Math.random() * 80 - 40);
        return parseFloat(Math.max(50.8, Math.min(prev + delta, 950)).toFixed(1));
      });

      // Update individual node metrics
      setRelayMetrics(prev => ({
        zurich: { ping: Math.max(8, Math.min(prev.zurich.ping + Math.floor(Math.random() * 3) - 1, 20)), load: Math.max(25, Math.min(prev.zurich.load + Math.floor(Math.random() * 5) - 2, 60)) },
        frankfurt: { ping: Math.max(12, Math.min(prev.frankfurt.ping + Math.floor(Math.random() * 3) - 1, 25)), load: Math.max(30, Math.min(prev.frankfurt.load + Math.floor(Math.random() * 5) - 2, 65)) },
        reykjavik: { ping: Math.max(24, Math.min(prev.reykjavik.ping + Math.floor(Math.random() * 3) - 1, 40)), load: Math.max(10, Math.min(prev.reykjavik.load + Math.floor(Math.random() * 3) - 1, 30)) },
        tokyo: { ping: Math.max(105, Math.min(prev.tokyo.ping + Math.floor(Math.random() * 5) - 2, 130)), load: Math.max(40, Math.min(prev.tokyo.load + Math.floor(Math.random() * 5) - 2, 75)) },
        singapore: { ping: Math.max(125, Math.min(prev.singapore.ping + Math.floor(Math.random() * 5) - 2, 160)), load: Math.max(35, Math.min(prev.singapore.load + Math.floor(Math.random() * 5) - 2, 70)) },
      }));
    }, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(pingInterval);
    };
  }, []);

  const handleRotateRelay = () => {
    if (isRotating || !isOnline) return;
    setIsRotating(true);
    showToast(language === 'ru' ? 'Запуск ротации ключей и оптимизации крипто-туннелей...' : 'Initiating quantum key rotation & relay optimization...', 'info');
    
    setTimeout(() => {
      const otherNodes = relayNodes.filter(n => n.id !== selectedRelayId);
      const randomNode = otherNodes[Math.floor(Math.random() * otherNodes.length)];
      setSelectedRelayId(randomNode.id);
      setIsRotating(false);
      
      showToast(
        language === 'ru'
          ? `Успешный туннель: ${randomNode.name}! Канал переподписан шифром ${randomNode.type}`
          : `Fastest tunnel active: ${randomNode.name}! Channel re-signed with ${randomNode.type}`,
        'success'
      );
    }, 1800);
  };

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

  // Typewriter and logs animation for Updates Modal interactive cards
  useEffect(() => {
    if (!showUpdatesModal) return;

    const typewriterTimer = setInterval(() => {
      setModalTypewriterIdx(prev => {
        if (prev >= 250) return 0;
        return prev + 4;
      });
    }, 65);

    const logTimer = setInterval(() => {
      setModalLogOffset(prev => prev + 1);
    }, 1200);

    return () => {
      clearInterval(typewriterTimer);
      clearInterval(logTimer);
    };
  }, [showUpdatesModal]);

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
    setShowUpdatesModal(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
        <div onClick={() => handleLinkClick('home')}>
          <AnimateBrand variant="nav" />
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-sm font-medium transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                  activeSection === link.id
                    ? theme === 'light' ? 'text-purple-600 font-bold' : 'text-purple-400 font-bold'
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
            );
          })}
        </nav>

        {/* Action Controls - Right */}
        <div className="hidden md:flex items-center gap-6">
          {/* Connection Status Indicator - Real-Time */}
          <div 
            id="nav-connection-status"
            className="relative" 
            onMouseEnter={() => setShowTooltip(true)} 
            onMouseLeave={() => {
              if (!isRotating) setShowTooltip(false);
            }}
          >
            <div 
              onClick={() => setShowTooltip(!showTooltip)}
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all duration-300 cursor-pointer select-none shadow-sm hover:scale-102 ${
                isOnline
                  ? theme === 'light'
                    ? 'bg-emerald-50/90 border-emerald-250 text-emerald-800 hover:bg-emerald-100/90 hover:border-emerald-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/50'
                  : theme === 'light'
                    ? 'bg-rose-50/90 border-rose-250 text-rose-800 hover:bg-rose-100/90 hover:border-rose-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/15'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOnline ? 'bg-emerald-400' : 'bg-rose-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                }`}></span>
              </span>
              
              <div className="flex items-center gap-1.5 font-mono tracking-tight text-[10.5px]">
                <span className="font-bold">{isOnline ? (language === 'ru' ? 'СЕТЬ NEXUS' : 'NEXUS RELAY') : t('statusOffline')}</span>
                <span className="opacity-30">|</span>
                <span className="flex items-center gap-0.5">
                  {isOnline ? <Lock className="w-3 h-3 text-purple-400 animate-pulse" /> : <Unlock className="w-3 h-3 text-rose-500" />}
                  <span className={`text-[9.5px] uppercase font-black ${isOnline ? 'text-purple-400 dark:text-purple-300' : 'text-rose-500'}`}>
                    {isOnline ? activeRelay.flag + ' ' + activeRelay.city.split(',')[0].toUpperCase() : 'UNSECURED'}
                  </span>
                </span>
                {isOnline && (
                  <>
                    <span className="opacity-30">|</span>
                    <span className="text-[10px] text-emerald-500 font-extrabold">
                      {relayMetrics[selectedRelayId]?.ping || estimatedPing}ms
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Premium Multi-Node Relay Drawer Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className={`absolute right-0 top-9 z-50 w-76 p-4.5 rounded-3xl border shadow-2xl backdrop-blur-xl text-xs ${
                    theme === 'light'
                      ? 'bg-white/98 border-slate-200 text-slate-800 shadow-slate-250/50'
                      : 'bg-slate-950/98 border-white/10 text-slate-200 shadow-black/80'
                  }`}
                >
                  {/* Grid Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/50 dark:border-white/10">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-purple-500 dark:text-purple-400 font-black">
                        {language === 'ru' ? 'КРИПТОГРАФИЧЕСКОЕ РЕЛЕ' : 'CRYPTOGRAPHIC RELAY MESH'}
                      </span>
                      <h5 className={`text-xs font-bold leading-none mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        {language === 'ru' ? 'Узлы Nexus Shield' : 'Nexus Active Tunnels'}
                      </h5>
                    </div>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                    }`}>
                      {isOnline ? 'SECURED' : 'DISCONNECTED'}
                    </span>
                  </div>

                  {/* Active Connection Speed Bar */}
                  {isOnline && (
                    <div className="mb-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-2.5 flex items-center justify-between font-mono text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span>RX: <span className="text-emerald-500 font-extrabold">{rxSpeed}</span> KB/s</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                        <span>TX: <span className="text-indigo-400 font-extrabold">{txSpeed}</span> KB/s</span>
                      </div>
                    </div>
                  )}

                  {/* Server Nodes Selector */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5 custom-scrollbar">
                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-450 dark:text-slate-500 block mb-1">
                      {language === 'ru' ? 'Выберите защищенный сервер:' : 'Select secure tunnel node:'}
                    </span>
                    {relayNodes.map((node) => {
                      const isSelected = node.id === selectedRelayId;
                      const metrics = relayMetrics[node.id] || { ping: 20, load: 30 };
                      return (
                        <button
                          key={node.id}
                          disabled={!isOnline || isRotating}
                          onClick={() => {
                            if (isRotating) return;
                            setSelectedRelayId(node.id);
                            showToast(
                              language === 'ru'
                                ? `Маршрут изменен на ${node.city} (${node.type})`
                                : `Routed to ${node.city} (${node.type})`,
                              'success'
                            );
                          }}
                          className={`w-full text-left p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? theme === 'light'
                                ? 'bg-purple-50/80 border-purple-300 shadow-xs'
                                : 'bg-purple-500/10 border-purple-500/40 text-white'
                              : theme === 'light'
                              ? 'bg-transparent border-slate-150 hover:bg-slate-50'
                              : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10'
                          } ${(!isOnline || isRotating) ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm leading-none shrink-0" role="img" aria-label={node.city}>
                              {node.flag}
                            </span>
                            <div className="flex flex-col min-w-0">
                              <span className={`text-[11px] font-bold truncate leading-tight ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                                {node.city.split(',')[0]}
                              </span>
                              <span className="text-[8.5px] font-mono font-medium text-slate-450 opacity-80 leading-snug">
                                {node.type}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 font-mono text-[9px] font-semibold">
                            <div className="flex flex-col items-end">
                              <span className={metrics.ping < 50 ? 'text-emerald-500' : metrics.ping < 110 ? 'text-amber-500' : 'text-slate-400'}>
                                {isOnline ? `${metrics.ping}ms` : '---'}
                              </span>
                              <span className="text-[8px] text-slate-450">
                                {isOnline ? `${metrics.load}% нагрузка` : ''}
                              </span>
                            </div>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Encryption Meta Block */}
                  <div className="mt-3.5 pt-3 border-t border-slate-200/50 dark:border-white/10">
                    <button
                      type="button"
                      disabled={isRotating || !isOnline}
                      onClick={handleRotateRelay}
                      className={`w-full py-1.5 rounded-xl border font-bold text-[10px] tracking-wider font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-purple-50 border-purple-200 text-purple-750 hover:bg-purple-100'
                          : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10 hover:border-purple-500/30'
                      } ${isRotating ? 'animate-pulse' : ''}`}
                    >
                      <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
                      <span>
                        {isRotating
                          ? (language === 'ru' ? 'СИНХРОНИЗАЦИЯ...' : 'SYNCHRONIZING...')
                          : (language === 'ru' ? 'РОТИРОВАТЬ КЛЮЧИ' : 'ROTATE TUNNEL KEYS')}
                      </span>
                    </button>
                    
                    <div className="mt-2 text-[8.5px] font-mono text-slate-450 text-center leading-normal italic font-light">
                      {language === 'ru' 
                        ? 'Защищено квантово-устойчивым сквозным протоколом TLS 1.3' 
                        : 'Covered by post-quantum cryptographically resilient end-to-end TLS 1.3'}
                    </div>
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
            <div className="px-6 py-6 flex flex-col gap-3">
              {navLinks.map((link) => {
                const isHome = link.id === 'home';
                return (
                  <div key={link.id} className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => handleLinkClick(link.id)}
                      className={`text-left py-2 px-3 rounded-lg text-base font-semibold transition-all cursor-pointer ${
                        activeSection === link.id
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border-l-2 border-purple-500 pl-2'
                          : theme === 'light' ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {link.label}
                    </button>
                    {isHome && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowUpdatesModal(true);
                        }}
                        className={`text-left py-2 px-3 rounded-lg text-base font-semibold transition-all cursor-pointer flex items-center justify-between ${
                          theme === 'light' ? 'text-purple-600 hover:bg-purple-50/70' : 'text-purple-300 hover:bg-purple-950/20'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                          <span>{language === 'ru' ? 'Обновления Nexus' : 'Nexus Updates'}</span>
                        </span>
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pink-500"></span>
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Mobile Connection Status Bar */}
              <div className={`flex flex-col gap-2.5 py-3.5 px-4 rounded-2xl border transition-all ${
                theme === 'light' 
                  ? 'bg-slate-100/70 border-slate-200/80 text-slate-700 font-medium' 
                  : 'bg-white/5 border-white/5 text-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isOnline ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${
                        isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}></span>
                    </span>
                    <span className="text-xs font-bold font-mono tracking-tight uppercase">
                      {isOnline ? (language === 'ru' ? 'СЕТЬ РЕЛЕ NEXUS' : 'NEXUS RELAY GRID') : t('statusOffline')}
                    </span>
                  </div>

                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-405 border border-purple-500/20`}>
                    {isOnline ? activeRelay.type : 'UNSECURED'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-sm shrink-0">{activeRelay.flag}</span>
                    <span className={`font-black ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                      {isOnline ? activeRelay.name : 'OFFLINE'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className={`flex items-center gap-1 font-bold ${isOnline ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isOnline ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{isOnline ? t('statusSecured') : 'UNSECURED'}</span>
                    </span>
                    {isOnline && <span className="opacity-30">|</span>}
                    {isOnline && (
                      <span className="text-purple-500 dark:text-purple-400 font-extrabold animate-pulse">
                        {relayMetrics[selectedRelayId]?.ping || estimatedPing}ms
                      </span>
                    )}
                  </div>
                </div>

                {isOnline && (
                  <div className="flex justify-between items-center text-[9.5px] font-mono text-slate-450 border-t border-slate-200/40 dark:border-white/5 pt-2">
                    <span>RX: {rxSpeed} KB/s</span>
                    <span>TX: {txSpeed} KB/s</span>
                  </div>
                )}
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

      {/* High-Fidelity Interactive Nexus Release Notes / Updates Modal */}
      <AnimatePresence>
        {false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 select-none"
            onClick={() => setShowUpdatesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.93, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col md:flex-row relative ${
                theme === 'light'
                  ? 'bg-slate-50 border-slate-200 text-slate-900 shadow-slate-300'
                  : 'bg-slate-950 border-white/10 text-white shadow-purple-950/20'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Ambient Glows */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-[100px] pointer-events-none" />

              {/* Sidebar Tabs - 28% width */}
              <div className={`p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r md:w-72 shrink-0 ${
                theme === 'light' ? 'bg-slate-150/40 border-slate-200' : 'bg-black/40 border-white/15'
              }`}>
                <div>
                  {/* Brand Header */}
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[15px] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400">
                        NEXUS CHANGELOG
                      </h4>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        v4.2.1 PRO (Stable)
                      </p>
                    </div>
                  </div>

                  {/* Sidebar Filter Tabs */}
                  <nav className="flex flex-col gap-1.5">
                    {[
                      { id: 'all', label: language === 'ru' ? 'Все обновления' : 'All Updates', icon: Layers },
                      { id: 'video', label: language === 'ru' ? '8K Вещание' : '8K Broadcast', icon: Video },
                      { id: 'audio', label: language === 'ru' ? 'AI Аудио Фильтр' : 'AI Audio Filter', icon: Headphones },
                      { id: 'crypto', label: language === 'ru' ? 'Квантовая Сеть' : 'Quantum Network', icon: Shield }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const active = updatesTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setUpdatesTab(tab.id as any)}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 relative cursor-pointer ${
                            active
                              ? 'text-white'
                              : 'text-slate-400 hover:text-slate-250 hover:bg-white/5'
                          }`}
                        >
                          {active && (
                            <motion.div
                              layoutId="activeTabPill"
                              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-600/25 -z-10"
                            />
                          )}
                          <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                          <span>{tab.label}</span>
                          {tab.id !== 'all' && (
                            <span className={`text-[8.5px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ml-auto border ${
                              active 
                                ? 'bg-white/10 border-white/20 text-white' 
                                : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                            }`}>
                              NEW
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Footer Credits */}
                <div className="pt-6 border-t border-slate-500/10 text-[10px] font-mono text-slate-500">
                  <p>{language === 'ru' ? 'Построено на движке' : 'Powered by'}</p>
                  <p className="font-bold text-slate-400 mt-0.5">Nexus Transport Layer</p>
                </div>
              </div>

              {/* Main Content Area - Scrollable */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between max-h-[85vh] md:max-h-[75vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Top Close Button & Welcome */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <div>
                      <h3 className="text-xl font-extrabold tracking-tight">
                        {language === 'ru' ? 'Новые Кодеки & Чистый Звук' : 'Advanced Video & Smart Audio'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {language === 'ru' ? 'Крупный патч производительности и повышение безопасности связи.' : 'Large performance patch optimizing video streams and security pipelines.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowUpdatesModal(false)}
                      className="cursor-pointer p-2 rounded-full hover:bg-white/5 transition-all focus:outline-none border border-white/10"
                    >
                      <X className="w-4 h-4 text-slate-400 hover:text-white" />
                    </button>
                  </div>

                  {/* Interactive Cards Column */}
                  <div className="space-y-6">

                    {/* Interactive Video Update Component */}
                    {(updatesTab === 'all' || updatesTab === 'video') && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-5 rounded-2xl border flex flex-col lg:flex-row gap-5 ${
                          theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#06060c] border-white/5'
                        }`}
                      >
                        {/* Miniature Live Screen broadcast emulator */}
                        <div className="lg:w-[45%] h-44 rounded-xl border border-white/10 bg-[#030307] relative overflow-hidden flex flex-col font-sans text-left shadow-lg scale-95 origin-left shrink-0">
                          {/* Desktop Header */}
                          <div className="h-4 bg-[#0a0a14] border-b border-white/5 px-1.5 flex items-center justify-between text-[6px] font-mono text-slate-500">
                            <span className="text-slate-300 font-extrabold">Nexus-Engine.local</span>
                            <span>{modalVideoRes === '720p' ? '0.8' : modalVideoRes === '1080p' ? '3.5' : modalVideoRes === '4k' ? '12.4' : '38.0'} Mbps</span>
                          </div>

                          {/* Desktop Grid Area */}
                          <div className={`flex-1 grid grid-cols-12 gap-1 p-1 min-h-0 overflow-hidden ${
                            modalVideoRes === '720p' ? 'blur-[1px] contrast-[0.9]' : modalVideoRes === '1080p' ? 'blur-[0.4px]' : ''
                          }`}>
                            {/* Editor Panel */}
                            <div className="col-span-7 bg-[#080810]/95 border border-white/5 rounded-md p-1.5 flex flex-col justify-between overflow-hidden relative">
                              <span className="text-[5px] font-mono text-purple-400 border-b border-white/5 pb-0.5">stream_core.ts</span>
                              <pre className="text-[5.5px] font-mono text-purple-300 overflow-hidden leading-tight whitespace-pre select-none py-1">
                                {MODAL_MOCK_CODE.slice(0, modalTypewriterIdx)}
                                <span className="w-0.5 h-1.5 bg-purple-400 inline-block animate-pulse ml-0.5" />
                              </pre>
                            </div>

                            {/* Signal Orb Panel */}
                            <div className="col-span-5 flex flex-col gap-1 min-h-0">
                              <div className="h-[43%] bg-[#080810]/90 border border-white/5 rounded-md p-1 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  {modalVideoRes === '720p' && (
                                    <div className="w-7 h-7 rounded-full border border-dashed border-red-500/20 animate-spin flex items-center justify-center">
                                      <span className="text-[4px] text-red-400 font-bold">720P</span>
                                    </div>
                                  )}
                                  {modalVideoRes === '1080p' && (
                                    <div className="w-8 h-8 rounded-full border border-dashed border-sky-400/30 animate-spin animate-pulse" />
                                  )}
                                  {modalVideoRes === '4k' && (
                                    <div className="relative w-10 h-10 flex items-center justify-center">
                                      <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping" />
                                      <div className="absolute w-8 h-8 rounded-full border border-dashed border-purple-500/40 animate-spin" />
                                    </div>
                                  )}
                                  {modalVideoRes === '8k' && (
                                    <div className="relative w-12 h-12 flex items-center justify-center">
                                      <div className="absolute inset-0 rounded-full border border-pink-500/25 animate-spin" />
                                      <div className="absolute w-8 h-8 rounded-full border border-dashed border-cyan-400/40 animate-spin" style={{ animationDirection: 'reverse' }} />
                                      <span className="text-[5px] text-purple-300 font-bold z-10 animate-pulse">8K ULTRA</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Mini logs stack */}
                              <div className="h-[57%] bg-black/95 border border-white/5 rounded-md p-1 flex flex-col justify-between overflow-hidden">
                                <div className="flex-1 font-mono text-[5px] text-emerald-400 leading-tight flex flex-col gap-0.5 select-none text-left">
                                  {Array.from({ length: 3 }).map((_, idx) => {
                                    const logIndex = (modalLogOffset + idx) % MODAL_MOCK_LOGS.length;
                                    return (
                                      <div key={idx} className="truncate opacity-80">
                                        &gt; {MODAL_MOCK_LOGS[logIndex]}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Top Tag */}
                          <div className="absolute bottom-2 left-2 bg-black/85 border border-white/10 px-1 py-0.5 rounded text-[5px] font-mono text-cyan-400 font-bold uppercase">
                            {modalVideoRes === '720p' && '1280 x 720 (Low)'}
                            {modalVideoRes === '1080p' && '1920 x 1080 (HD)'}
                            {modalVideoRes === '4k' && '3840 x 2160 (4K UHD)'}
                            {modalVideoRes === '8k' && '7680 x 4320 (8K Max)'}
                          </div>
                        </div>

                        {/* Interactive controls & explanation */}
                        <div className="flex-1 flex flex-col justify-between text-left">
                          <div>
                            <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider block mb-1">
                              {language === 'ru' ? 'КОДЕК СВЕРХВЫСОКОЙ ЧЁТКОСТИ' : 'ULTRA HIGH FIDELITY CODEC'}
                            </span>
                            <h4 className="text-sm font-bold tracking-tight mb-2 flex items-center gap-2">
                              <Video className="w-4 h-4 text-purple-400 shrink-0" />
                              {language === 'ru' ? '1. Режим Демо-Вещания 8K 144 FPS' : '1. 8K Broadcast Stream Engine'}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {language === 'ru' 
                                ? 'Новая архитектура захвата пикселей экрана. Потоковое сжатие AV1 обеспечивает безупречную четкость шрифтов и кода, сохраняя идеальный баланс контрастности даже при высокой сетевой нагрузке.'
                                : 'Advanced display capture architecture. Real-time AV1 compression guarantees pixel-perfect rendering of minor font lines, maintaining maximum contrast and sharp colors.'}
                            </p>
                          </div>

                          {/* Real-time switcher inside updates dialog! */}
                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                              {language === 'ru' ? 'Пощупать кодек:' : 'Demo bit rate:'}
                            </span>
                            <div className="flex gap-1 bg-black/40 border border-white/5 p-0.5 rounded-lg text-[9px] font-mono">
                              {(['720p', '1080p', '4k', '8k'] as any[]).map((res) => (
                                <button
                                  key={res}
                                  onClick={() => setModalVideoRes(res)}
                                  className={`px-2 py-1 rounded font-bold cursor-pointer transition-all ${
                                    modalVideoRes === res
                                      ? 'bg-purple-600 text-white shadow'
                                      : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {res === '8k' ? '8K (NEW)' : res.toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Interactive Audio Update Component */}
                    {(updatesTab === 'all' || updatesTab === 'audio') && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-5 rounded-2xl border flex flex-col lg:flex-row gap-5 ${
                          theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#06060c] border-white/5'
                        }`}
                      >
                        {/* Real interactive wave frequency display */}
                        <div className="lg:w-[45%] h-44 rounded-xl border border-white/10 bg-[#030307] relative overflow-hidden flex flex-col items-center justify-between p-3 shrink-0">
                          <div className="w-full flex justify-between items-center text-[7px] font-mono text-slate-500">
                            <span>CRYSTALVOICE™ OSCILLOSCOPE</span>
                            <span className={modalAudioFilterActive ? 'text-cyan-400' : 'text-red-400'}>
                              {modalAudioFilterActive ? 'AI FILTER ACTIVE' : 'UNRAW STATIC STATIC'}
                            </span>
                          </div>

                          {/* Dynamic SVG Waveform */}
                          <div className="w-full flex-1 flex items-center justify-center relative py-4">
                            <svg className="w-full h-16" viewBox="0 0 200 60">
                              {modalAudioFilterActive ? (
                                // Clean, beautiful sinusoids
                                <path
                                  d={`M0 30 Q 15 ${30 + Math.sin(modalLogOffset) * 15} 30 30 T 60 30 T 90 30 T 120 30 T 150 30 T 180 30 T 200 30`}
                                  fill="none"
                                  stroke="#22d3ee"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  className="transition-all duration-500"
                                >
                                  <animate attributeName="d" dur="4s" repeatCount="indefinite"
                                    values={`
                                      M0 30 Q 15 15 30 30 T 60 30 T 90 30 T 120 30 T 150 30 T 180 30 T 200 30;
                                      M0 30 Q 15 45 30 30 T 60 30 T 90 30 T 120 30 T 150 30 T 180 30 T 200 30;
                                      M0 30 Q 15 15 30 30 T 60 30 T 90 30 T 120 30 T 150 30 T 180 30 T 200 30
                                    `}
                                  />
                                </path>
                              ) : (
                                // High noise rugged peaks
                                <path
                                  d="M0 30 L10 12 L20 48 L30 15 L40 55 L50 22 L60 48 L70 10 L80 50 L90 24 L100 38 L110 5 L120 54 L130 18 L140 45 L150 15 L160 55 L170 25 L180 43 L190 12 L200 30"
                                  fill="none"
                                  stroke="#f87171"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  className="transition-all duration-300"
                                >
                                  <animate attributeName="d" dur="0.8s" repeatCount="indefinite"
                                    values={`
                                      M0 30 L10 12 L20 48 L30 15 L40 52 L50 22 L60 48 L70 10 L80 50 L90 24 L100 38 L110 5 L120 54 L130 18 L140 45 L150 15 L160 55 L170 25 L180 43 L190 12 L200 30;
                                      M0 30 L10 40 L20 12 L30 45 L40 22 L50 54 L60 15 L70 48 L80 10 L90 40 L100 15 L110 45 L120 22 L130 52 L140 18 L150 48 L160 10 L170 54 L180 25 L190 43 L200 30;
                                      M0 30 L10 12 L20 48 L30 15 L40 52 L50 22 L60 48 L70 10 L80 50 L90 24 L100 38 L110 5 L120 54 L130 18 L140 45 L150 15 L160 55 L170 25 L180 43 L190 12 L200 30
                                    `}
                                  />
                                </path>
                              )}
                            </svg>
                          </div>

                          <div className="w-full flex justify-between items-center text-[8px] font-mono text-slate-500">
                            <span>{language === 'ru' ? '2.14 кГц синусоидальный пик' : '2.14 kHz harmonic peak'}</span>
                            <span className={modalAudioFilterActive ? 'text-emerald-400' : 'text-slate-500'}>
                              {modalAudioFilterActive ? 'CLEAN 99.8%' : 'STATIC 35%'}
                            </span>
                          </div>
                        </div>

                        {/* Explanation & Interaction switch */}
                        <div className="flex-1 flex flex-col justify-between text-left">
                          <div>
                            <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                              {language === 'ru' ? 'НЕЙРОННАЯ ИЗОЛЯЦИЯ ЗВУКА' : 'NEURAL VOICE CLEANER'}
                            </span>
                            <h4 className="text-sm font-bold tracking-tight mb-2 flex items-center gap-2">
                              <Headphones className="w-4 h-4 text-cyan-400 shrink-0" />
                              {language === 'ru' ? '2. Интеллектуальный Фильтр Звука AI' : '2. Smart AI CrystalVoice™ Filter'}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {language === 'ru'
                                ? 'Обновленный алгоритм детекции шума. Локальное удаление спектрального шума и высокочастотных паразитных гармоник. Ваши собеседники слышат только глубокий, кристально чистый голос без задержки.'
                                : 'Advanced vocal extraction system. Direct dynamic mitigation of room echo and microphone background fan noise. Delivers crystal-clear voice spectrums with absolute zero host latency.'}
                            </p>
                          </div>

                          {/* Toggle switches directly corresponding to wave change */}
                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-500">
                              {language === 'ru' ? 'Переключатель AI-Фильтра:' : 'Interactive voice gate:'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold font-mono uppercase ${
                                modalAudioFilterActive ? 'text-cyan-400' : 'text-slate-500'
                              }`}>
                                {modalAudioFilterActive ? 'ENABLED' : 'DISABLED'}
                              </span>
                              <button
                                onClick={() => setModalAudioFilterActive(!modalAudioFilterActive)}
                                className={`w-9 h-5 rounded-full p-0.5 transition-all outline-none cursor-pointer ${
                                  modalAudioFilterActive ? 'bg-cyan-500' : 'bg-slate-700'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-md ${
                                  modalAudioFilterActive ? 'translate-x-4' : 'translate-x-0'
                                }`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Interactive Crypto / Quantum Shield Update Component */}
                    {(updatesTab === 'all' || updatesTab === 'crypto') && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-5 rounded-2xl border flex flex-col lg:flex-row gap-5 ${
                          theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#06060c] border-white/5'
                        }`}
                      >
                        {/* Interactive secure node connection visualizer */}
                        <div className="lg:w-[45%] h-44 rounded-xl border border-white/10 bg-[#030307] relative overflow-hidden flex flex-col justify-between p-3 shrink-0">
                          <span className="text-[7.5px] font-mono text-slate-500 block text-left">QUANTUM SHIELD ENCRYPTION KEY ROTATION</span>
                          
                          {/* Animated secure server nodes */}
                          <div className="flex-1 flex items-center justify-center relative">
                            {/* Line connections */}
                            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                              <line x1="50" y1="20" x2="150" y2="20" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3">
                                <animate attributeName="stroke-dashoffset" from="1" to="30" dur="2s" repeatCount="indefinite" />
                              </line>
                              <line x1="50" y1="20" x2="100" y2="70" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3">
                                <animate attributeName="stroke-dashoffset" from="20" to="1" dur="1.5s" repeatCount="indefinite" />
                              </line>
                              <line x1="150" y1="20" x2="100" y2="70" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3">
                                <animate attributeName="stroke-dashoffset" from="1" to="20" dur="1.8s" repeatCount="indefinite" />
                              </line>
                            </svg>

                            {/* Node 1 */}
                            <div className="absolute top-[10px] left-[35px] flex flex-col items-center">
                              <div className="w-5 h-5 rounded bg-purple-600/20 border border-purple-500/50 flex items-center justify-center text-[7px] font-mono font-bold animate-pulse text-purple-300">N1</div>
                              <span className="text-[5px] font-mono text-slate-500 mt-0.5">TLSv1.3</span>
                            </div>

                            {/* Node 2 */}
                            <div className="absolute top-[10px] right-[35px] flex flex-col items-center">
                              <div className="w-5 h-5 rounded bg-purple-600/20 border border-purple-500/50 flex items-center justify-center text-[7px] font-mono font-bold animate-pulse text-purple-300">N2</div>
                              <span className="text-[5px] font-mono text-slate-500 mt-0.5">14.2ms</span>
                            </div>

                            {/* Lock Hub Node */}
                            <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                              <div className="w-6 h-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-[8px] font-bold text-emerald-400 animate-pulse">
                                <Lock className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[6px] font-mono text-emerald-400 font-bold mt-1">SHIELD SECURED</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[6.5px] font-mono text-slate-500">
                            <span>AES-GCM 256 BIT KEY STATUS</span>
                            <span className="text-emerald-400 font-bold">STABLE ROTATING</span>
                          </div>
                        </div>

                        {/* Explanation */}
                        <div className="flex-1 flex flex-col justify-start text-left">
                          <div>
                            <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider block mb-1">
                              {language === 'ru' ? 'КВАНТОВО-УСТОЙЧИВАЯ ЗАЩИТА' : 'QUANTUM-RESISTANT SHIELD'}
                            </span>
                            <h4 className="text-sm font-bold tracking-tight mb-2 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-purple-400 shrink-0" />
                              {language === 'ru' ? '3. Quantum Shield и Сквозные Туннели' : '3. Quantum Shield v2.1 Routing'}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {language === 'ru'
                                ? 'Интегрирован новый алгоритм гибридного квантового шифрования. Ключи генерируются локально в песочнице браузера и ротируются каждые 180 секунд. Прямое туннелирование P2P идет в обход любых центральных серверов.'
                                : 'Advanced system integrating local cryptographic key generation. Generates symmetric end-to-end P2P keys inside the client container, rotating them every 180 seconds to fully eliminate middleman bypasses.'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="mt-8 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 font-medium">
                    {language === 'ru' ? 'Все обновления протестированы и готовы к работе.' : 'All updates have been compiled & verified for high reliability.'}
                  </span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowUpdatesModal(false)}
                      className="cursor-pointer flex-1 sm:flex-initial py-2 px-5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs font-semibold"
                    >
                      {language === 'ru' ? 'Отлично' : 'Understand'}
                    </button>
                    <button
                      onClick={() => {
                        setShowUpdatesModal(false);
                        handleLinkClick('download');
                      }}
                      className="cursor-pointer flex-1 sm:flex-initial py-2 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-purple-650/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'ru' ? 'Обновить сейчас' : 'Update Client'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
