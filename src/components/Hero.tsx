import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Headset, Circle, Mic, MicOff, Sparkles, ShieldAlert, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminState';

export default function Hero() {
  const { theme, language, heroTagline, heroDescription, broadcastMessage, t, showUpdatesAlert, updatesAlertText, setShowUpdatesModal } = useAdmin();
  const [onlineCount, setOnlineCount] = useState(5342);
  const [isNoiseCleanerActive, setIsNoiseCleanerActive] = useState(true);
  const [userMuted, setUserMuted] = useState(false);
  
  // Simulated equalizers for other speakers
  const [speakerHeight1, setSpeakerHeight1] = useState([12, 28, 16, 8]);
  const [speakerHeight2, setSpeakerHeight2] = useState([8, 14, 22, 10]);

  // Typing animation state
  const [typedTagline, setTypedTagline] = useState('');

  useEffect(() => {
    let index = 0;
    setTypedTagline('');
    const rawText = t('heroTagline');
    if (!rawText) return;

    const interval = setInterval(() => {
      setTypedTagline(rawText.substring(0, index + 1));
      index++;
      if (index >= rawText.length) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [language, heroTagline]);

  // Minor fluctuations in online counter to make it look alive
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animate voice indicators for speaking participants
  useEffect(() => {
    const interval = setInterval(() => {
      if (!userMuted) {
        setSpeakerHeight1([
          Math.floor(Math.random() * 24) + 6,
          Math.floor(Math.random() * 24) + 6,
          Math.floor(Math.random() * 24) + 6,
          Math.floor(Math.random() * 24) + 6,
        ]);
      }
      setSpeakerHeight2([
        Math.floor(Math.random() * 20) + 4,
        Math.floor(Math.random() * 20) + 4,
        Math.floor(Math.random() * 20) + 4,
        Math.floor(Math.random() * 20) + 4,
      ]);
    }, 200);
    return () => clearInterval(interval);
  }, [userMuted]);

  const handleScrollToDownload = () => {
    const element = document.getElementById('download');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative pt-[190px] sm:pt-[210px] md:pt-[240px] pb-20 md:pb-40 flex items-center justify-between">
      {/* Premium Dynamic Update Alert Banner & Master Announcement Bar */}
      <div className="absolute top-[90px] sm:top-[104px] md:top-[112px] left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-5xl z-40 select-none flex flex-col gap-3">
        <AnimatePresence>
          {showUpdatesAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              className={`w-full border backdrop-blur-lg px-6 sm:px-8 py-4 sm:py-5 rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)] ${
                theme === 'light'
                  ? 'bg-purple-50/95 border-purple-200 shadow-slate-300/40'
                  : 'bg-[#0a0a16]/65 border-purple-500/40 shadow-purple-950/50 hover:border-purple-500/60'
              }`}
            >
              <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto text-left">
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center relative shadow-lg ${
                  theme === 'light'
                    ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-purple-500/30'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-purple-500/20'
                }`}>
                  <Sparkles className="w-5.5 h-5.5 animate-pulse" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500"></span>
                  </span>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] sm:text-[11px] tracking-widest uppercase font-extrabold font-mono px-2.5 py-0.5 rounded-full border ${
                      theme === 'light'
                        ? 'text-purple-600 bg-purple-100 border-purple-200'
                        : 'text-purple-300 bg-purple-500/15 border-purple-500/25'
                    }`}>
                      {language === 'ru' ? 'Доступно Обновление' : 'New Update Available'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-450 uppercase font-bold tracking-wide animate-pulse">v4.2.1-PRO</span>
                  </div>
                  <p className={`text-sm sm:text-[15px] font-semibold mt-1 leading-normal max-w-3xl ${
                    theme === 'light' ? 'text-slate-800' : 'text-slate-150'
                  }`}>
                    {updatesAlertText}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowUpdatesModal(true)}
                className="cursor-pointer shrink-0 w-full sm:w-auto py-3 px-6 sm:px-8 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <span>{language === 'ru' ? 'Подробности' : 'Details'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {broadcastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`w-full border backdrop-blur-md px-4 py-2.5 rounded-2xl text-center shadow-lg ${
                theme === 'light'
                  ? 'bg-slate-100/90 border-purple-200/60 shadow-slate-200'
                  : 'bg-purple-950/50 border-purple-500/30 shadow-purple-950/40'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-xs">
                <ShieldAlert className={`w-4 h-4 animate-pulse shrink-0 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                <span className={`font-mono font-extrabold tracking-widest uppercase text-[9px] px-1.5 py-0.5 rounded mr-1 ${
                  theme === 'light' ? 'bg-purple-200 text-purple-750' : 'bg-purple-600/30 text-purple-200'
                }`}>
                  {t('announcement')}
                </span>
                <span className={`font-medium ${theme === 'light' ? 'text-slate-800' : 'text-purple-200'}`}>{broadcastMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Hero Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-bold text-purple-600 dark:text-purple-450 uppercase tracking-widest mb-6 select-none">
            <span className="flex h-2 w-2 rounded-full bg-purple-500"></span>
            {t('newEra')}
          </div>

          {/* Heading with typing animation */}
          <h1 className="text-4xl md:text-5xl xl:text-[62px] font-extrabold leading-[1.08] tracking-tight mb-6 bg-clip-text text-transparent italic min-h-[140px] sm:min-h-[120px] lg:min-h-[190px] xl:min-h-[260px] select-none block w-full bg-gradient-to-br from-purple-800 via-slate-900 to-indigo-600 dark:from-white dark:via-white dark:to-purple-400">
            <span>{typedTagline}</span>
            <span className="animate-ping text-purple-600 dark:text-purple-400 font-light ml-0.5 relative -top-1">|</span>
          </h1>

          {/* Sub-heading */}
          <p className={`text-lg md:text-xl font-light max-w-xl leading-relaxed mb-8 transition-colors ${
            theme === 'light' ? 'text-slate-650' : 'text-slate-400'
          }`}>
            {t('heroDescription')}
          </p>

          {/* Trigger Links */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-12">
            <button
              onClick={handleScrollToDownload}
              className="cursor-pointer font-bold rounded-full py-3.5 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-605/30 hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-3.5"
            >
              <Download className="w-5 h-5" />
              <span>{t('navButton')}</span>
            </button>
            <a
              href="#features"
              className={`font-semibold transition-colors py-3 px-6 rounded-full border flex items-center justify-center gap-2 ${
                theme === 'light'
                  ? 'border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <span>{t('learnMore')}</span>
            </a>
          </div>

          {/* Stats Bar */}
          <div className={`grid grid-cols-3 gap-8 md:gap-12 border-t pt-8 w-full max-w-md ${
            theme === 'light' ? 'border-slate-205' : 'border-white/10'
          }`}>
            <div>
              <div className={`text-3xl md:text-4xl font-extrabold ${theme === 'light' ? 'text-purple-605' : 'text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300'}`}>2M+</div>
              <div className={`text-[10px] uppercase tracking-widest mt-1 font-semibold ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>{t('users')}</div>
            </div>
            <div>
              <div className={`text-3xl md:text-4xl font-extrabold ${theme === 'light' ? 'text-purple-650' : 'text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300'}`}>150+</div>
              <div className={`text-[10px] uppercase tracking-widest mt-1 font-semibold ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>{t('countries')}</div>
            </div>
            <div>
              <div className={`text-3xl md:text-4xl font-extrabold ${theme === 'light' ? 'text-purple-650' : 'text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300'}`}>24/7</div>
              <div className={`text-[10px] uppercase tracking-widest mt-1 font-semibold ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>{t('supportStat')}</div>
            </div>
          </div>
        </motion.div>

        {/* Hero Right Interactive Widget: Voice Server Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="lg:col-span-5 relative"
        >
          {/* Glass Card Glowing Border Effect */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-[34px] blur-xl opacity-25 animate-pulse" style={{ animationDuration: '6s' }} />

          <div className={`relative border backdrop-blur-2xl rounded-[32px] p-6 text-center select-none shadow-2xl transition-all ${
            theme === 'light'
              ? 'bg-white border-purple-200/50 shadow-slate-300 text-slate-800'
              : 'bg-slate-950/60 border-violet-500/30 text-white shadow-black'
          }`}>
            
            {/* Call Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping" />
                <span className={`text-xs font-semibold tracking-wider uppercase ${theme === 'light' ? 'text-purple-650' : 'text-violet-300'}`}>{t('activeCall')}</span>
              </div>
              <div className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                theme === 'light' ? 'bg-slate-100 text-slate-500 border border-slate-205' : 'bg-white/5 border border-white/10 text-slate-400'
              }`}>
                15ms PING
              </div>
            </div>

            {/* Premium Icon and Circle */}
            <div className={`relative inline-flex items-center justify-center p-6 rounded-full border mb-5 text-center ${
              theme === 'light' ? 'bg-purple-100 border-purple-200' : 'bg-violet-600/10 border-violet-500/20'
            }`}>
              <Headset className={`w-20 h-20 ${theme === 'light' ? 'text-purple-600 font-light' : 'text-violet-400'}`} />
              <div className="absolute inset-0 bg-violet-500 blur-xl opacity-10 hover:opacity-20 transition-opacity" />
            </div>

            <h3 className="text-2xl font-extrabold mb-1 tracking-tight">{t('voiceChatTitle')}</h3>
            <p className={`text-sm mb-6 font-light ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{t('voiceChatDesc')}</p>

            {/* Noise cleaner toggler playpen */}
            <div className={`mb-6 p-4 rounded-2xl text-left transition-all border ${
              theme === 'light'
                ? 'bg-slate-50 border-purple-200/50 hover:border-purple-305'
                : 'bg-slate-900/60 border-violet-500/15 hover:border-violet-500/30'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-semibold flex items-center gap-1.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  <Sparkles className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                  {t('aiNoise')}
                </span>
                <button
                  onClick={() => setIsNoiseCleanerActive(!isNoiseCleanerActive)}
                  className={`cursor-pointer w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${isNoiseCleanerActive ? 'bg-violet-500' : 'bg-slate-800'}`}
                >
                  <motion.div
                    layout
                    className="bg-white w-4 h-4 rounded-full shadow-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{ marginStart: isNoiseCleanerActive ? 'auto' : '0' }}
                  />
                </button>
              </div>

              {/* Dynamic Waveform depending on noise cleaner */}
              <div className="h-10 bg-black/40 rounded-lg flex items-center justify-center gap-0.5 px-3 overflow-hidden">
                {isNoiseCleanerActive ? (
                  // Smooth crystal clear wave
                  [...Array(24)].map((_, i) => {
                    const val = Math.sin((i / 23) * Math.PI * 2) * 12 + 16;
                    return (
                      <motion.div
                        key={i}
                        className="w-1 rounded-sm bg-gradient-to-t from-violet-500 to-indigo-400"
                        animate={{ height: [val, val + Math.sin(Date.now() + i) * 6, val] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      />
                    );
                  })
                ) : (
                  // Highly jagged chaotic raw sound waves (noise)
                  [...Array(24)].map((_, i) => {
                    const noiseHeight = Math.floor(Math.random() * 26) + 4;
                    return (
                      <motion.div
                        key={i}
                        className="w-1 bg-[#ef4444] rounded-sm"
                        animate={{ height: [noiseHeight, Math.floor(Math.random() * 26) + 4, noiseHeight] }}
                        transition={{ repeat: Infinity, duration: 0.15, ease: 'linear' }}
                      />
                    );
                  })
                )}
              </div>
              <div className={`text-[10px] text-center mt-1.5 ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
                {isNoiseCleanerActive ? t('filterActive') : t('filterInactive')}
              </div>
            </div>

            {/* Active Participants simulated list */}
            <div className={`space-y-3 mb-6 font-medium text-xs ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
              
              {/* Participant 1: Speaking */}
              <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                theme === 'light' ? 'bg-purple-500/5 border-purple-200' : 'bg-violet-500/10 border-violet-500/25'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    theme === 'light' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-violet-400/20 border border-violet-400/40 text-violet-300'
                  }`}>
                    МР
                  </div>
                  <span className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Марк (Nexus AI)</span>
                </div>
                {/* Speaker Equalizer dots */}
                <div className="flex items-end gap-0.5 h-6 px-2">
                  {speakerHeight1.map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-0.75 bg-violet-500 dark:bg-violet-400 rounded-xs"
                      animate={{ height: h }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </div>

              {/* Participant 2: Other Speaker */}
              <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border border-white/5'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    theme === 'light' ? 'bg-cyan-100 border-cyan-200 text-cyan-600' : 'bg-cyan-400/20 border border-cyan-400/30 text-cyan-300'
                  }`}>
                    АЛ
                  </div>
                  <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Алина</span>
                </div>
                {/* Speaker Equalizer */}
                <div className="flex items-end gap-0.5 h-6 px-2">
                  {speakerHeight2.map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-0.75 bg-cyan-500 dark:bg-cyan-400 rounded-xs"
                      animate={{ height: h }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </div>

              {/* Participant 3: Muted Dmitry */}
              <div className={`flex items-center justify-between p-2.5 rounded-xl border opacity-55 ${
                theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border border-white/5'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-400 border border-slate-300 text-[10px] flex items-center justify-center font-bold text-slate-700">
                    ДМ
                  </div>
                  <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}>Дмитрий</span>
                </div>
                <div className="text-[#ef4444] px-2">
                  <MicOff className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* User Participant: Interactive */}
              <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                userMuted 
                  ? 'bg-red-500/5 border-red-500/20' 
                  : theme === 'light' ? 'bg-emerald-500/5 border-emerald-300' : 'bg-emerald-500/5 border-emerald-500/20'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full text-[10px] flex items-center justify-center font-bold font-mono ${
                    userMuted 
                      ? 'bg-red-100 text-red-650 border border-red-200' 
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-250'
                  }`}>
                    ВЫ
                  </div>
                  <div>
                    <span className={`font-semibold block text-left ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t('meChannel')}</span>
                    <span className="text-[10px] text-slate-500 block text-left">
                      {userMuted ? t('micOff') : t('micOn')}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setUserMuted(!userMuted)}
                  className={`cursor-pointer p-1.5 rounded-lg border transition-all ${
                    userMuted
                      ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/40 text-red-700 dark:text-red-200'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-700 dark:text-emerald-200'
                  }`}
                  title={userMuted ? 'Включить' : 'Отключить'}
                >
                  {userMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

            </div>

            {/* Quick Online Stats Label */}
            <div className={`flex items-center justify-center gap-2 border py-3 px-4 rounded-xl ${
              theme === 'light' ? 'bg-purple-50/70 border-purple-250 shadow-sm' : 'bg-black/45 border-violet-500/20'
            }`}>
              <Circle className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500 animate-pulse" />
              <span className={`text-sm font-bold tracking-wide ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                {onlineCount.toLocaleString('ru-RU')} {t('onlineSuffix')}
              </span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
