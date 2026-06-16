import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Terminal, Shield, Sparkles, Moon, Sun, Globe, 
  ArrowRight, CornerDownLeft, Laptop, ShieldCheck, Key, Eye, HelpCircle, X
} from 'lucide-react';
import { useAdmin } from '../context/AdminState';

interface CommandItem {
  id: string;
  category: 'navigation' | 'system' | 'crypto';
  titleRu: string;
  titleEn: string;
  descRu: string;
  descEn: string;
  badgeRu: string;
  badgeEn: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: (utils: {
    setTheme: (t: 'dark' | 'light') => void;
    theme: 'dark' | 'light';
    setLanguage: (l: 'ru' | 'en') => void;
    language: 'ru' | 'en';
    setIsLoginModalOpen: (b: boolean) => void;
    setShowUpdatesModal: (b: boolean) => void;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
    closePalette: () => void;
  }) => void;
}

export default function CommandPalette() {
  const { 
    theme, setTheme, 
    language, setLanguage, 
    isLoginModalOpen, setIsLoginModalOpen,
    showUpdatesModal, setShowUpdatesModal,
    showToast
  } = useAdmin();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global Key listeners for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Esc to close modals / palette
      if (e.key === 'Escape' || e.key === 'Esc') {
        let didCloseAny = false;
        
        if (isOpen) {
          setIsOpen(false);
          didCloseAny = true;
        }
        if (isLoginModalOpen) {
          setIsLoginModalOpen(false);
          didCloseAny = true;
        }
        if (showUpdatesModal) {
          setShowUpdatesModal(false);
          didCloseAny = true;
        }

        if (didCloseAny) {
          e.preventDefault();
        }
      }

      // 2. Ctrl+K / Cmd+K to open/close search command palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setSearchQuery('');
        setSelectedIndex(0);
      }

      // 3. Ctrl+G / Cmd+G to open Admin Portal langsung
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsLoginModalOpen(true);
        setIsOpen(false);
        showToast(
          language === 'ru' 
            ? 'Активирован скрытый шлюз аутентификации ядра...' 
            : 'Triggering hidden core certification gateway...', 
          'info'
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoginModalOpen, showUpdatesModal, language, setIsLoginModalOpen, setShowUpdatesModal, showToast]);

  // Focus search input when palette opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const closePalette = () => {
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
  };

  const smoothScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      return true;
    }
    return false;
  };

  // Commands register
  const commands: CommandItem[] = [
    {
      id: 'scroll-home',
      category: 'navigation',
      titleRu: 'Скролл на Главную',
      titleEn: 'Scroll to Home Header',
      descRu: 'Быстрая промотка в самое начало сайта',
      descEn: 'Instant teleportation back to hero banner',
      badgeRu: 'Навигация',
      badgeEn: 'Jump',
      icon: <Laptop className="w-4 h-4 text-violet-400" />,
      action: ({ closePalette }) => {
        smoothScrollTo('hero-section');
        closePalette();
      }
    },
    {
      id: 'scroll-features',
      category: 'navigation',
      titleRu: 'Перейти к Функциям',
      titleEn: 'Scroll to Features & Lab',
      descRu: 'Промотка к интерактивным песочницам Nexus',
      descEn: 'Smooth scroll to core features dynamic playground',
      badgeRu: 'Навигация',
      badgeEn: 'Jump',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      action: ({ closePalette }) => {
        smoothScrollTo('features');
        closePalette();
      }
    },
    {
      id: 'scroll-about',
      category: 'navigation',
      titleRu: 'Перейти к Технологии и Команде',
      titleEn: 'Scroll to Our Tech & Philosophy',
      descRu: 'Промотка к разделу ценностей и показателей скорости',
      descEn: 'Scroll to mission, specs, latency benchmarks',
      badgeRu: 'Навигация',
      badgeEn: 'Jump',
      icon: <Eye className="w-4 h-4 text-emerald-400" />,
      action: ({ closePalette }) => {
        smoothScrollTo('about-philosophies');
        closePalette();
      }
    },
    {
      id: 'scroll-support',
      category: 'navigation',
      titleRu: 'Перейти в Контактный Центр с ИИ',
      titleEn: 'Scroll to Live Chat & Support Desk',
      descRu: 'Скролл к виртуальному помощнику Марку',
      descEn: 'Jump to automated P2P AI assist logs',
      badgeRu: 'Навигация',
      badgeEn: 'Jump',
      icon: <Terminal className="w-4 h-4 text-blue-400" />,
      action: ({ closePalette }) => {
        smoothScrollTo('ai-support-desk');
        closePalette();
      }
    },
    {
      id: 'scroll-download',
      category: 'navigation',
      titleRu: 'Перейти в раздел Загрузки',
      titleEn: 'Scroll to Application Download Bay',
      descRu: 'Инсталлятор под все операционные системы',
      descEn: 'Direct teleportation to multi-OS generator panel',
      badgeRu: 'Навигация',
      badgeEn: 'Jump',
      icon: <CornerDownLeft className="w-4 h-4 text-purple-400" />,
      action: ({ closePalette }) => {
        smoothScrollTo('installer-downloads-section');
        closePalette();
      }
    },
    {
      id: 'toggle-theme',
      category: 'system',
      titleRu: 'Смена визуальной схемы (Тёмная/Светлая)',
      titleEn: 'Toggle Interface Visual Theme',
      descRu: 'Быстрое переключение цвета с Light на Dark и наоборот',
      descEn: 'Instantly swap between premium dark canvas & readable light mode',
      badgeRu: 'Оформление',
      badgeEn: 'Visual',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-violet-400" />,
      action: ({ setTheme, theme, showToast, closePalette }) => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        showToast(
          nextTheme === 'light' 
            ? 'Активирована светлая схема оформления' 
            : 'Активирован премиальный 8K темный холст', 
          'info'
        );
        closePalette();
      }
    },
    {
      id: 'toggle-lang',
      category: 'system',
      titleRu: 'Переключить язык (Русский / English)',
      titleEn: 'Change Language / Toggle Translation',
      descRu: 'Смысловая локализация интерфейса системы',
      descEn: 'Toggle linguistic package of complete UI instantly',
      badgeRu: 'Локаль',
      badgeEn: 'Language',
      icon: <Globe className="w-4 h-4 text-purple-400" />,
      action: ({ setLanguage, language, showToast, closePalette }) => {
        const nextLang = language === 'ru' ? 'en' : 'ru';
        setLanguage(nextLang);
        showToast(
          nextLang === 'ru' 
            ? 'Язык интерфейса успешно изменен на Русский' 
            : 'Interface context successfully localized to English', 
          'success'
        );
        closePalette();
      }
    },
    {
      id: 'admin-gateway',
      category: 'system',
      titleRu: 'Вход в Панель Администрирования',
      titleEn: 'Open Cryptographic Admin Panel',
      descRu: 'Запуск крипто-архитектуры верификации',
      descEn: 'Triggering AES-GCM credential key validation portal',
      badgeRu: 'Безопасность',
      badgeEn: 'Admin Auth',
      shortcut: 'Ctrl+G',
      icon: <Shield className="w-4 h-4 text-purple-400" />,
      action: ({ setIsLoginModalOpen, closePalette, showToast, language }) => {
        setIsLoginModalOpen(true);
        closePalette();
        showToast(
          language === 'ru'
            ? 'Требуется ввод ключа инженера Nexus'
            : 'Nexus engineer passphrase validation active',
          'info'
        );
      }
    },
    {
      id: 'check-updates',
      category: 'system',
      titleRu: 'Проверить новые обновления и патчи',
      titleEn: 'Verify Latest Core Security Bulletins',
      descRu: 'Запустить экран интерактивной лог-проверки обновлений',
      descEn: 'Open interactive console showing real-time distribution versions',
      badgeRu: 'Логи ядра',
      badgeEn: 'Updates',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-450" />,
      action: ({ setShowUpdatesModal, closePalette }) => {
        setShowUpdatesModal(true);
        closePalette();
      }
    },
    {
      id: 'key-rotation-palette',
      category: 'crypto',
      titleRu: 'Срочная Ротация Ключей Туннеля (Quantum)',
      titleEn: 'Emergency Key Rotation & Tunnel Reset',
      descRu: 'Абсолютная смена защитных шифротекстов реле сети',
      descEn: 'Instant regeneration of post-quantum tunnel encryption matrices',
      badgeRu: 'Шифрование',
      badgeEn: 'PQ-Crypto',
      icon: <Key className="w-4 h-4 text-rose-450 animate-pulse" />,
      action: ({ showToast, language, closePalette }) => {
        closePalette();
        // Mimic clicking key rotation with success toast
        showToast(
          language === 'ru'
            ? 'Инициация экстренной ротации. Квантовые ключи туннелей перевыпущены.'
            : 'Emergency key rotation initiated. Post-quantum cryptosystems re-established!',
          'success'
        );
      }
    }
  ];

  // Filtering commands based on user query
  const filteredCommands = commands.filter(cmd => {
    const q = searchQuery.toLowerCase();
    const tRu = cmd.titleRu.toLowerCase();
    const tEn = cmd.titleEn.toLowerCase();
    const dRu = cmd.descRu.toLowerCase();
    const dEn = cmd.descEn.toLowerCase();
    
    return tRu.includes(q) || tEn.includes(q) || dRu.includes(q) || dEn.includes(q) || cmd.category.includes(q);
  });

  // Handle keyboard navigation inside list
  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action({
          setTheme,
          theme,
          setLanguage,
          language,
          setIsLoginModalOpen,
          setShowUpdatesModal,
          showToast,
          closePalette
        });
      }
    }
  };

  // Keep index in bound when search filter narrows results
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  return (
    <>
      {/* Search Trigger Button Overlay HUD hint */}
      <div className="fixed bottom-22 right-6 z-40 hidden sm:block">
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-full border text-[10.5px] font-mono font-black tracking-wider transition-all shadow-md select-none group border-zinc-500/10 cursor-pointer ${
            theme === 'light'
              ? 'bg-white/80 border-slate-200 text-slate-500 hover:text-purple-600 hover:bg-white'
              : 'bg-zinc-950/60 text-zinc-450 border-white/5 hover:text-white hover:bg-zinc-950'
          }`}
        >
          <Search className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          <span>SEARCH</span>
          <kbd className="px-1.5 py-0.5 text-[8.5px] font-sans font-bold bg-white/10 dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-md text-slate-600 dark:text-zinc-400">
            Ctrl K
          </kbd>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[120] flex items-start justify-center pt-[10vh] px-4 w-screen h-screen">
            
            {/* Soft Backdrop blur mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closePalette}
              className="absolute inset-0 bg-[#020205]/75 backdrop-blur-md"
            />

            {/* Main Command Box Modal widget */}
            <motion.div
              id="nexus-command-palette"
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-2xl flex flex-col ${
                theme === 'light'
                  ? 'bg-white border-slate-200/90 shadow-slate-200/50 text-slate-800'
                  : 'bg-zinc-950/95 border-zinc-800/80 shadow-black'
              }`}
            >
              
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-600/20 via-indigo-500/40 to-purple-600/20" />

              {/* Input Box Row */}
              <div className="flex items-center gap-3.5 px-5 py-4.5 border-b border-slate-100 dark:border-zinc-900">
                <Search className="w-5 h-5 text-slate-400 dark:text-zinc-550 shrink-0 select-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleListKeyDown}
                  placeholder={
                    language === 'ru' 
                      ? 'Введите команду, раздел или настройку...' 
                      : 'Search commands, navigation shortcuts, settings...'
                  }
                  className="w-full bg-transparent border-none outline-none text-sm dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-650 font-medium focus:ring-0 focus:border-none p-0"
                />
                
                <div className="flex items-center gap-1.5 shrink-0 select-none">
                  <span className="text-[10px] font-mono bg-slate-100 dark:bg-zinc-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 font-bold text-slate-550 dark:text-zinc-400">
                    ESC
                  </span>
                  <button 
                    onClick={closePalette}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-slate-400 dark:text-zinc-550"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Interactive suggestion categories list */}
              <div className="max-h-[360px] overflow-y-auto p-2.5 custom-scrollbar min-h-24">
                {filteredCommands.length > 0 ? (
                  <div className="space-y-1">
                    {filteredCommands.map((cmd, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <button
                          key={cmd.id}
                          className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all relative overflow-hidden cursor-pointer ${
                            isSelected
                              ? theme === 'light'
                                ? 'bg-purple-50/80 shadow-xs text-purple-900'
                                : 'bg-zinc-900/60 text-white'
                              : 'bg-transparent text-slate-600 dark:text-zinc-350 hover:bg-slate-50 dark:hover:bg-zinc-900/45'
                          }`}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => cmd.action({
                            setTheme,
                            theme,
                            setLanguage,
                            language,
                            setIsLoginModalOpen,
                            setShowUpdatesModal,
                            showToast,
                            closePalette
                          })}
                        >
                          {/* Inner glow indicator */}
                          {isSelected && (
                            <div className="absolute top-0 left-0 h-full w-[3px] bg-gradient-to-b from-purple-500 to-indigo-500 rounded-lg" />
                          )}

                          <div className="flex items-center gap-3.5">
                            <div className={`p-2.5 rounded-xl border transition-all ${
                              isSelected
                                ? 'bg-white/90 dark:bg-zinc-950 border-purple-500/20'
                                : 'bg-slate-50 dark:bg-zinc-900/60 border-transparent'
                            }`}>
                              {cmd.icon}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-bold leading-normal">
                                {language === 'ru' ? cmd.titleRu : cmd.titleEn}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-zinc-550 font-light mt-0.5 leading-normal">
                                {language === 'ru' ? cmd.descRu : cmd.descEn}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 font-mono shrink-0">
                            {cmd.shortcut && (
                              <kbd className="text-[9px] px-1.5 py-0.5 bg-purple-500/10 text-purple-405 font-extrabold rounded-md border border-purple-500/25 select-none uppercase">
                                {cmd.shortcut}
                              </kbd>
                            )}
                            <span className="text-[9px] font-mono bg-slate-100 dark:bg-zinc-900 text-slate-450 dark:text-zinc-500 border border-slate-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-md uppercase font-bold select-none">
                              {language === 'ru' ? cmd.badgeRu : cmd.badgeEn}
                            </span>
                            {isSelected && (
                              <CornerDownLeft className="w-3 h-3 text-purple-400 animate-pulse hidden sm:inline" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-2 select-none flex flex-col items-center justify-center">
                    <HelpCircle className="w-7 h-7 text-zinc-650 animate-bounce" />
                    <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 font-mono uppercase tracking-wider">
                      {language === 'ru' ? 'Результаты не найдены' : 'Zero actions matching inquiry'}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-600 max-w-xs font-light">
                      {language === 'ru' 
                        ? 'Попробуйте изменить формулировку или используйте скролл-навигацию' 
                        : 'Adjust query parameter or use arrows to query standard system commands'}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Hotkey Help Rail bar */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#08080c] border-t border-slate-100 dark:border-zinc-900/60 flex items-center justify-between font-mono text-[9px] text-slate-400 dark:text-zinc-550 select-none">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="text-purple-450 dark:text-purple-400">↑↓</span>
                    {language === 'ru' ? 'Выбрать' : 'Navigate'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-purple-450 dark:text-purple-400">↵ Enter</span>
                    {language === 'ru' ? 'Запустить' : 'Execute'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span>{language === 'ru' ? 'Повер-Юзер консоль' : 'Power-User Toolkit'}</span>
                  <span>v1.8</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
