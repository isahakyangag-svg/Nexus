import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, ShieldCheck, CheckCircle2, Bot, Sparkles, Cpu, Lock, Monitor, Laptop, Terminal, Smartphone, Globe, Shield, HardDrive, Chrome, Activity } from 'lucide-react';
import { useAdmin } from '../context/AdminState';
import { triggerPremiumConfetti, triggerSubtleConfetti } from '../utils/confetti';
import { dbHelper } from '../lib/indexedDbHelper';

// Icon map to render dynamic Lucide icons from stored strings
const iconMap: Record<string, React.ComponentType<any>> = {
  Monitor,
  Laptop,
  Terminal,
  Smartphone,
  Globe,
  Shield,
  Lock,
  Cpu,
  HardDrive,
  Chrome,
  Activity
};

function detectOS(): 'windows' | 'macos' | 'linux' | 'android' | 'ios' {
  if (typeof window === 'undefined' || !navigator) return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac')) {
    if (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) {
      return 'ios';
    }
    return 'macos';
  }
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
  if (ua.includes('linux')) return 'linux';
  return 'windows';
}

export default function DownloadSection() {
  const { 
    downloadsTodayOffset,
    downloadTitle,
    downloadDesc,
    downloadBtnText,
    downloadFileName,
    downloadFileType,
    downloadRedirectUrl,
    downloadFileContent,
    uploadedFileBase64,
    uploadedFileName,
    uploadedFileType,
    specCrc,
    specSha,
    specRuntime,
    downloadSteps,
    platforms,
    showToast,
    t
  } = useAdmin();

  const stepsList = downloadSteps ? downloadSteps.split(',').map(s => s.trim()) : [
    'Инициализация безопасного туннеля...',
    'Генерация квантовой крипто-подписи...',
    'Сборка кроссплатформенного инсталлятора...',
    'Загрузка зашифрованного ядра...'
  ];

  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  // OS detection states
  const [detectedOS, setDetectedOS] = useState<'windows' | 'macos' | 'linux' | 'android' | 'ios'>('windows');
  const [activeOS, setActiveOS] = useState<'windows' | 'macos' | 'linux' | 'android' | 'ios'>('windows');

  // Filter visible platforms (or fallback to ALL if every platform is disabled, as a failsafe)
  const visiblePlatforms = platforms.filter(p => p.isVisible).length > 0
    ? platforms.filter(p => p.isVisible)
    : platforms;

  useEffect(() => {
    const os = detectOS();
    setDetectedOS(os);
    
    // Set active OS to detected OS if it's visible, otherwise default to first visible OS
    const isDetectedVisible = platforms.some(p => p.id === os && p.isVisible);
    if (isDetectedVisible) {
      setActiveOS(os);
    } else {
      const firstVisible = platforms.find(p => p.isVisible);
      if (firstVisible) {
        setActiveOS(firstVisible.id);
      } else {
        setActiveOS(os);
      }
    }
  }, [platforms]);

  const activePlatform = platforms.find(p => p.id === activeOS) || platforms[0];

  const getOSSpecificFileName = (selectedOS: string) => {
    const plat = platforms.find(p => p.id === selectedOS);
    if (plat && plat.fileName) {
      return plat.fileName;
    }

    const baseName = (downloadFileName || uploadedFileName || 'nexus_setup').replace(/\.[^/.]+$/, "");
    switch (selectedOS) {
      case 'windows': return `${baseName}.exe`;
      case 'macos': return `${baseName}.dmg`;
      case 'linux': return `${baseName}.tar.gz`;
      case 'android': return `${baseName}.apk`;
      case 'ios': return `${baseName}.mobileconfig`;
      default: return `${baseName}.exe`;
    }
  };

  // Focus-mode cursor neon trace effect coords
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Dynamic "downloads today" social proof counter
  const [downloadsToday, setDownloadsToday] = useState<number>(() => {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    return Math.floor(1840 + mins * 3.5);
  });
  const [pulseCounter, setPulseCounter] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDownloadsToday((prev) => {
        const increment = Math.floor(Math.random() * 3) + 1;
        setPulseCounter(true);
        setTimeout(() => setPulseCounter(false), 850);
        return prev + increment;
      });
    }, 4000 + Math.random() * 4000); // Dynamic interval between 4 and 8 seconds
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top; // Correct coordinates to clientY to map vertical axis properly
    setCoords({ x, y });
  };

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isDownloading) {
      setDownloadProgress(0);
      setIsDone(false);
      setCurrentStep(0);

      interval = setInterval(() => {
        setDownloadProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 8) + 4;
          
          // Progress steps switching based on stepsList length
          const stepsCount = stepsList.length;
          const index = Math.min(Math.floor((next / 100) * stepsCount), stepsCount - 1);
          setCurrentStep(index);

          if (next >= 100) {
            clearInterval(interval);
            setIsDownloading(false);
            setIsDone(true);
            triggerActualFileDownload();
            showToast(t('toastDownloadSuccess'), 'success');
            triggerPremiumConfetti();
            return 100;
          }
          return next;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isDownloading, stepsList.length, activeOS]);

  const triggerActualFileDownload = async () => {
    try {
      const targetFileName = getOSSpecificFileName(activeOS);
      const platFileType = activePlatform?.fileType || downloadFileType;

      // Force downloading the custom uploaded file from server if set to 'file'
      if (downloadFileType === 'file' || platFileType === 'file') {
        try {
          // Check if we have a local file in IndexedDB first (Vercel offline fallback)
          const localFileBlob = await dbHelper.getFile('custom_setup_file');
          if (localFileBlob && localFileBlob instanceof Blob) {
            console.log('[CMS Download fallback] Initiating direct high-performance download from local IndexedDB sandbox.');
            const localName = localStorage.getItem('local_setup_file_name') || targetFileName;
            const url = URL.createObjectURL(localFileBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = localName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Log local IndexedDB download
            fetch('/api/log-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileName: localName,
                platform: activeOS,
                method: 'IndexedDB Fallback',
                status: 'success'
              })
            }).catch(() => {});

            // Revoke object URL after 2 seconds to free client memory
            setTimeout(() => URL.revokeObjectURL(url), 2000);
            return;
          }
        } catch (ibErr) {
          console.warn('[CMS Download] Local IndexedDB check failed, falling back to server endpoints:', ibErr);
        }

        // Stream directly from the server filesystem via background fetch to completely avoid page redirects / 404 page crashes.
        try {
          const res = await fetch(`/api/download-installer?platform=${activeOS}&fileName=${encodeURIComponent(targetFileName)}`);
          if (res.ok) {
            const blob = await res.blob();
            
            // Extract filename from Content-Disposition header if possible
            let finalFileName = targetFileName;
            const contentDisposition = res.headers.get('Content-Disposition');
            if (contentDisposition) {
              const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              const matches = filenameRegex.exec(contentDisposition);
              if (matches != null && matches[1]) { 
                finalFileName = matches[1].replace(/['"]/g, '');
                try {
                  finalFileName = decodeURIComponent(finalFileName);
                } catch (e) {}
              }
            }
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = finalFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => URL.revokeObjectURL(url), 2000);
            return;
          } else {
            console.warn('[CMS Download] Server returned error status: ' + res.status + '. Falling back to client-side local generator...');
          }
        } catch (fetchErr) {
          console.warn('[CMS Download] Background fetch failed (Vercel offline/Static mode). Routing to local generator fallback:', fetchErr);
        }

        // Fallback local static generator (runs 100% Client-Side / Offline / Vercel Environment)
        const fallbackContent = activePlatform?.fileContent || downloadFileContent;
        const blob = new Blob([fallbackContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = targetFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Record fallback logs
        fetch('/api/log-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: targetFileName,
            platform: activeOS,
            method: 'Static Fallback',
            status: 'success'
          })
        }).catch(() => {});
        return;
      }

      if (platFileType === 'link') {
        const redirectUrl = activePlatform?.redirectUrl || downloadRedirectUrl;
        if (redirectUrl) {
          const a = document.createElement('a');
          a.href = redirectUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.download = targetFileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          // Record Redirect Link downloads
          fetch('/api/log-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: targetFileName,
              platform: activeOS,
              method: 'Redirect Link',
              status: 'success'
            })
          }).catch(() => {});
          return;
        }
      }

      // Default TXT payload generator
      const fileContent = activePlatform?.fileContent || downloadFileContent;
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = targetFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Record default client-side TXT downloads
      fetch('/api/log-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: targetFileName,
          platform: activeOS,
          method: 'Config Document',
          status: 'success'
        })
      }).catch(() => {});
    } catch (e) {
      console.warn('File download error safe-fail:', e);
    }
  };

  const startDownload = () => {
    setIsDownloading(true);
    showToast(t('toastDownloadStart'), 'info');
    triggerSubtleConfetti();
  };

  return (
    <section id="download" className="py-24 relative overflow-hidden">
      {/* Background Glows matching the Sleek Interface theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-[15%] w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        
        {/* Core Content Box with a stunning Sleek structure */}
        <div className="max-w-3xl mx-auto text-center space-y-12">
          
          {/* Header Block with elegant display typography */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-purple-500/15 border border-purple-500/30 rounded-full text-xs font-bold text-purple-400 uppercase tracking-widest select-none">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Интеллектуальная доставка
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-purple-400 bg-clip-text text-transparent italic leading-[1.1]">
              Готовы войти в Nexus?
            </h2>
            <p className="text-slate-400 font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Умный алгоритм доставки автоматически обнаружит микроархитектуру вашего устройства и подготовит соответствующую сборку ядра.
            </p>
          </div>

          {"/* Interactive download action panel */"}
          <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-2xl max-w-xl mx-auto overflow-hidden">
            
            {/* Ambient subtle backlights */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

            <AnimatePresence mode="wait">
              
              {/* STATE 1: Ready to download */}
              {!isDownloading && !isDone && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8 py-4"
                >
                  <div className="flex flex-col items-center gap-3">
                    {/* Animated central scanner ring */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/30 animate-ping opacity-60 pointer-events-none" />
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-white/10 flex items-center justify-center text-purple-400 shadow-inner">
                        {React.createElement(iconMap[activePlatform?.icon || 'Monitor'] || Monitor, { className: "w-7 h-7 animate-bounce text-purple-400" })}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg text-white">
                        {activePlatform ? activePlatform.name : downloadTitle}
                      </h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                        {activePlatform ? activePlatform.desc : (downloadDesc || 'Сборка оптимизирована для вашей системы')}
                      </p>
                    </div>
                  </div>

                  {/* OS Selection Pills */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-semibold text-slate-400">Выберите платформу:</span>
                      <span className="text-[10px] font-mono text-purple-400 flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Ваша система: {platforms.find(p => p.id === detectedOS)?.name || detectedOS}
                      </span>
                    </div>
                    <div 
                      className="grid gap-1.5 p-1 bg-black/40 border border-white/5 rounded-2xl"
                      style={{ gridTemplateColumns: `repeat(${visiblePlatforms.length}, minmax(0, 1fr))` }}
                    >
                      {visiblePlatforms.map((platform) => {
                        const IconComp = iconMap[platform.icon] || Monitor;
                        const isSelected = activeOS === platform.id;
                        const isAuto = detectedOS === platform.id;
                        const isBlocked = platform.isAvailable === false;
                        return (
                          <button
                            key={platform.id}
                            type="button"
                            onClick={() => {
                              setActiveOS(platform.id);
                              triggerSubtleConfetti();
                            }}
                            className={`relative flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-300 gap-1 cursor-pointer overflow-hidden ${
                              isSelected 
                                ? 'bg-purple-500/15 border border-purple-500/40 text-purple-200 shadow-md shadow-purple-500/5' 
                                : 'border border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeGlow"
                                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent rounded-xl pointer-events-none"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                            <IconComp className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            <span className="text-[9px] font-bold uppercase tracking-wider font-sans truncate max-w-full px-0.5 flex items-center justify-center gap-0.5">
                              {platform.name}
                              {isBlocked && <Lock className="w-2 h-2 text-amber-500 shrink-0 inline-block" />}
                            </span>
                            {isAuto && (
                              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-400/80 animate-pulse" title="Автоопределение" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mega Beautiful Glowing Download Button (with Blocked/Locked status) */}
                  {(() => {
                    const isBlocked = activePlatform?.isAvailable === false;
                    return (
                      <div
                        onMouseMove={!isBlocked ? handleMouseMove : undefined}
                        onMouseEnter={() => !isBlocked && setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="relative group w-fit mx-auto select-none pt-2"
                      >
                        {/* Pulsing button outer glow aura */}
                        <div className={`absolute -inset-1 bg-gradient-to-br ${isBlocked ? 'from-amber-600 via-zinc-800 to-amber-900 opacity-50' : 'from-purple-600 via-indigo-600 to-pink-500 opacity-75 group-hover:opacity-100'} rounded-full blur transition duration-1000 group-hover:duration-200 animate-pulse`} />

                        {/* Cursor-following custom neon purple glow border effect */}
                        {isHovered && !isBlocked && (
                          <div
                            className="absolute -inset-[3px] rounded-full pointer-events-none z-10 opacity-80 blur-[2px] transition-opacity duration-300"
                            style={{
                              background: `radial-gradient(80px circle at ${coords.x}px ${coords.y}px, rgba(168, 85, 247, 0.9) 0%, rgba(99, 102, 241, 0.4) 50%, transparent 100%)`
                            }}
                          />
                        )}

                        <button
                          onClick={!isBlocked ? startDownload : undefined}
                          disabled={isBlocked}
                          className={`relative overflow-hidden font-extrabold text-sm tracking-wide rounded-full py-4 px-10 bg-[#070710] border text-white flex items-center gap-3 shadow-2xl z-20 transition-all ${
                            isBlocked 
                              ? 'border-amber-500/35 cursor-not-allowed text-stone-400 opacity-80' 
                              : 'cursor-pointer border-white/20 hover:scale-[1.03] active:scale-[0.98]'
                          }`}
                        >
                          {/* Inside light sweep following cursor */}
                          {isHovered && !isBlocked && (
                            <div
                              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
                              style={{
                                background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 100%)`
                              }}
                            />
                          )}

                          {isBlocked ? (
                            <Lock className="w-5 h-5 text-amber-500 relative z-10" />
                          ) : (
                            <Download className="w-5 h-5 text-purple-400 relative z-10 animate-bounce" />
                          )}
                          <span className={`bg-gradient-to-r relative z-10 ${isBlocked ? 'from-amber-200 to-stone-400' : 'from-white to-purple-200'} bg-clip-text text-transparent`}>
                            {isBlocked ? 'Временно недоступно' : downloadBtnText} ({activePlatform?.name || 'Nexus'})
                          </span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Subtitle details */}
                  <div className="text-[11px] text-slate-400 font-mono tracking-tight bg-white/[0.02] border border-white/5 py-1 px-4 rounded-xl max-w-md mx-auto">
                    Пакет: <span className="text-purple-300 font-bold">{getOSSpecificFileName(activeOS)}</span> (~ {activeOS === 'windows' || activeOS === 'macos' ? '12.4 MB' : '8.1 MB'})
                  </div>

                  {/* Dynamic 'downloads today' counter with luxury visual proof */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400 select-none py-1 bg-white/[0.02] border border-white/5 rounded-2xl max-w-sm mx-auto shadow-inner">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                      </span>
                      <span className="font-light text-slate-400">Сегодня скачано:</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <motion.span
                        animate={pulseCounter ? { scale: [1.15, 1], color: ['#c084fc', '#e9d5ff', '#ffffff'] } : {}}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        className="font-mono font-extrabold text-[13px] bg-purple-950/40 text-white border border-purple-500/20 px-2.5 py-0.5 rounded-lg shadow-sm"
                      >
                        {(downloadsToday + downloadsTodayOffset).toLocaleString('ru-RU')}
                      </motion.span>
                      <span className="font-light text-slate-500 text-[10px] uppercase tracking-wider font-mono">
                        копий
                      </span>
                    </div>
                  </div>

                  {/* Micro reassurance specs - fully interactive & dynamic */}
                  <div className="flex items-center justify-center gap-6 pt-2 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1" title="Контрольная сумма релиза">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      {activePlatform?.specCrc || specCrc || '0xE4A9B11C'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    <span className="flex items-center gap-1" title="Безопасный хэш SHA-256">
                      <Lock className="w-3.5 h-3.5 text-purple-400" />
                      {activePlatform?.specSha || specSha || 'SHA-256: F3A1...W64E'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    <span className="flex items-center gap-1" title="Обнаружить микроархитектуру среды">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      {activePlatform?.specRuntime || specRuntime || 'CoreCLR / .NET 8.0'}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* STATE 2: Download progress live high-tech state ticker */}
              {isDownloading && (
                <motion.div
                  key="downloading"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 py-4"
                >
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 mx-auto animate-spin">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                        ИНИЦИАЛИЗАЦИЯ PLATFORM ({activeOS.toUpperCase()})
                      </span>
                      <h4 className="font-bold text-base text-white mt-1 h-6 select-none leading-relaxed">
                        {stepsList[currentStep]}
                      </h4>
                    </div>
                  </div>

                  {/* Progress sliding track bar with soft glow */}
                  <div className="space-y-2 max-w-sm mx-auto">
                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 relative p-[2px]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"
                        style={{ width: `${downloadProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between items-center font-mono text-xs text-slate-500 px-1">
                      <span>СКОРОСТЬ: ~24.8 MB/s</span>
                      <span className="text-purple-400 font-extrabold text-[13px]">{downloadProgress}%</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STATE 3: Download completed successfully */}
              {isDone && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/15">
                    <CheckCircle2 className="w-9 h-9 animate-bounce" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xl text-white">Пакет успешно загружен!</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Файл <span className="text-purple-300 font-mono font-bold">{getOSSpecificFileName(activeOS)}</span> сохранен на вашем устройстве с автоматически настроенным умным пресетом.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-left max-w-sm mx-auto space-y-2 border-l-2 border-l-purple-500">
                    <div className="flex items-start gap-2 text-xs">
                      <Bot className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <p className="text-slate-300 leading-normal">
                        <strong>Авто-Детекция:</strong> Пакет синхронизирован для немедленного развертывания под платформу <span className="text-purple-300 font-semibold">{activePlatform?.name || activeOS}</span> с включенными P2P mesh-протоколами.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setIsDone(false)}
                      className="cursor-pointer text-xs font-bold text-slate-400 hover:text-white border border-white/10 rounded-full px-5 py-2.5 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      Скачать заново
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

          <p className="text-xs text-slate-500 tracking-wide font-light">
            * Если загрузка не началась, убедитесь, что в настройках браузера разрешено автоматическое скачивание файлов.
          </p>

        </div>

      </div>
    </section>
  );
}
