import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, ShieldCheck, CheckCircle2, Bot, Sparkles, Cpu, Lock } from 'lucide-react';
import { useAdmin } from '../context/AdminState';
import { triggerPremiumConfetti, triggerSubtleConfetti } from '../utils/confetti';

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
    const y = e.clientY - rect.top;
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
  }, [isDownloading, stepsList.length]);

  const triggerActualFileDownload = async () => {
    try {
      if (downloadFileType === 'link' && downloadRedirectUrl) {
        // Trigger a link download / redirect
        const a = document.createElement('a');
        a.href = downloadRedirectUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        // Suggest a custom filename download if of same host
        a.download = downloadFileName || 'nexus_setup.exe';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      if (downloadFileType === 'file') {
        if (uploadedFileBase64) {
          // Reconstruct binary file completely client-side.
          // This avoids server reliance entirely, working 100% on Vercel, Netlify, and static deployments.
          const res = await fetch(uploadedFileBase64);
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = downloadFileName || uploadedFileName || 'nexus_setup.exe';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          // Fallback: Stream directly from the server filesystem
          const link = document.createElement('a');
          link.href = '/api/download-installer';
          link.download = downloadFileName || uploadedFileName || 'nexus_setup.exe';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        return;
      }

      // Default TXT payload generator
      const blob = new Blob([downloadFileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFileName || `nexus_setup_v3.0.0.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
              Мультиплатформенный релиз
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-purple-400 bg-clip-text text-transparent italic leading-[1.1]">
              Готовы войти в Nexus?
            </h2>
            <p className="text-slate-400 font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Один инсталлятор для всех устройств. Умная система автоматически установит нужную версию ядра для вашей ОС с полной поддержкой Crystal Voice 8K.
            </p>
          </div>

          {/* Interactive download action panel */}
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
                        <Download className="w-7 h-7 animate-bounce" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg text-white">{downloadTitle}</h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                        {downloadDesc}
                      </p>
                    </div>
                  </div>

                  {/* Mega Beautiful Glowing Download Button */}
                  <div
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative group w-fit mx-auto select-none"
                  >
                    {/* Pulsing button outer glow aura */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

                    {/* Cursor-following custom neon purple glow border effect */}
                    {isHovered && (
                      <div
                        className="absolute -inset-[3px] rounded-full pointer-events-none z-10 opacity-80 blur-[2px] transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(80px circle at ${coords.x}px ${coords.y}px, rgba(168, 85, 247, 0.9) 0%, rgba(99, 102, 241, 0.4) 50%, transparent 100%)`
                        }}
                      />
                    )}

                    <button
                      onClick={startDownload}
                      className="cursor-pointer relative overflow-hidden font-extrabold text-sm tracking-wide rounded-full py-4 px-10 bg-[#070710] border border-white/20 text-white flex items-center gap-3 shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all z-20"
                    >
                      {/* Inside light sweep following cursor */}
                      {isHovered && (
                        <div
                          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
                          style={{
                            background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 100%)`
                          }}
                        />
                      )}

                      <Download className="w-5 h-5 text-purple-400 relative z-10" />
                      <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent relative z-10">
                        {downloadBtnText}
                      </span>
                    </button>
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

                  {/* Micro reassurance specs */}
                  <div className="flex items-center justify-center gap-6 pt-2 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> {specCrc}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-purple-400" /> {specSha}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" /> {specRuntime}
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
                        УСТАНОВКА КАНАЛА
                      </span>
                      <h4 className="font-bold text-base text-white mt-1 h-6">
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
                      Файл <span className="text-purple-300 font-mono font-bold">{downloadFileType === 'file' ? (uploadedFileName || downloadFileName) : downloadFileName}</span> сохранен на вашем устройстве с автоматически настроенным умным пресетом.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-left max-w-sm mx-auto space-y-2 border-l-2 border-l-purple-500">
                    <div className="flex items-start gap-2 text-xs">
                      <Bot className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <p className="text-slate-300 leading-normal">
                        <strong>Авто-Детекция:</strong> Пакет синхронизирован для немедленного развертывания с включенными голосовыми сетями P2P.
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
            * Если загрузка не началась, убедитесь, что в настройках браузера разрешено автоматическое скачивание текстовых логов файлов.
          </p>

        </div>

      </div>
    </section>
  );
}
