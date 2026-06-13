import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ShieldCheck, Sparkles, Tv, Eye, Lock, Unlock, Play, Square, Activity, Volume2 } from 'lucide-react';
import { useAdmin } from '../context/AdminState';

const featuresLocalDict = {
  ru: {
    title: "Всё для идеальной связи",
    desc: "Nexus объединяет передовой софт с возможностями искусственного интеллекта. Попробуйте функции прямо здесь.",
    testDrive: "ИНТЕРАКТИВНЫЙ ТЕСТ-ДРАЙВ",
    onlineSimulator: "ОНЛАЙН СИМУЛЯТОР",
    quantumTitle: "Quantum Shield",
    quantumDesc: "Сквозное шифрование нового поколения",
    quantumBadge: "БЕЗОПАСНОСТЬ",
    noiseTitle: "AI Noise Cleaner",
    noiseDesc: "Удаление шума нейросетью в реальном времени",
    noiseBadge: "АУДИО AI",
    streamTitle: "Режим 8K Stream",
    streamDesc: "Демонстрация экрана в ультра-HD качестве",
    streamBadge: "СТРИMИНГ",
    avatarTitle: "AR Аватары",
    avatarDesc: "3D-персонажи и виртуальные миры",
    avatarBadge: "ВИРТУАЛЬНОСТЬ",
    quantumHeader: "Сквозной Квантовый Канал",
    quantumSub: "Попробуйте встроенный генератор криптографического ключа. Сообщение шифруется локально на вашем девайсе перед отправкой.",
    inputLabel: "Введите исходное сообщение:",
    inputPlaceholder: "Ваш сверхсекретный пароль или фраза...",
    btnEncrypt: "Зашифровать",
    phase1: "ФАЗА 1: ЗАШИФРОВАННЫЙ КАНАЛ",
    idleText: "Ожидание ввода...",
    quantizing: "Квантование потоков данных...",
    recipientDecrypt: "Расшифровать на стороне получателя →",
    phase2: "ФАЗА 2: ДЕШИФРАЦИЯ",
    noData: "Нет данных.",
    preparing: "Подготовка квантового ключа...",
    underway: "Зашифрованный пакет получен. Ждет дешифрации.",
    syncing: "Синхронизация спиральных сигнатур...",
    successIntegrity: "✅ УСПЕШНО: ЦЕЛОСТНОСТЬ 100%",
    noiseHeader: "Слуховой Нейросетевой Фильтр",
    noiseSub: "Послушайте, как локальный Web Audio фильтр мгновенно убирает пронзительное высокочастотное шипение, сохраняя приятный тон.",
    toneOff: "Выключить звук",
    toneOn: "Запустить тест звука",
    tunerText: "Очиститель шума AI",
    genDisabled: "Генератор отключен",
    tunerTip: "Совет: Включите генератор звука и попереключайте тумблер AI Очистителя для оценки разницы ушами.",
    streamHeader: "Сверхчёткое Демо-Вещание",
    streamSub: "Поделитесь экраном со скоростью 144 FPS без потери деталей. Переключите режимы качества и сравните производительность.",
    pixel720: "Пикселизация 720p",
    arHeader: "Создайте своего AR-Аватара",
    arSub: "Полная мимика лица. Аватар оживает при диалоге, повторяя ваши жесты. Поиграйте со стилем и настроением.",
    avatarLabel: "Стиль Персонажа:",
    expressionLabel: "Эмоции Аватара:",
    neonLabel: "Неоновая Подсветка:",
    style1: "Киборг",
    style2: "Неон-Фокс",
    style3: "Космонавт",
    style4: "Мистик",
    expr1: "Улыбка",
    expr2: "Подмигнуть",
    expr3: "Покой",
    expr4: "Удивление",
    clientFooterPrompt: "Все симуляторы работают на 100% клиентском коде без отправки ваших диалогов на внешние сервера."
  },
  en: {
    title: "Everything for Perfect Communication",
    desc: "Nexus integrates bleeding-edge software with artificial intelligence. Experience the live widgets below.",
    testDrive: "INTERACTIVE TEST-DRIVE",
    onlineSimulator: "ONLINE SIMULATOR",
    quantumTitle: "Quantum Shield",
    quantumDesc: "Next-generation decentralized end-to-end encryption",
    quantumBadge: "SECURITY",
    noiseTitle: "AI Noise Cleaner",
    noiseDesc: "Neural noise cancellation in real time",
    noiseBadge: "AUDIO AI",
    streamTitle: "8K Stream Mode",
    streamDesc: "Screen sharing in crisp ultra-high definition",
    streamBadge: "STREAMING",
    avatarTitle: "AR Avatars",
    avatarDesc: "Interactive 3D avatars and virtual environments",
    avatarBadge: "VIRTUALITY",
    quantumHeader: "End-to-End Quantum Channel",
    quantumSub: "Try our built-in cryptokey builder. Messages are completely scrambled on your device before transfer.",
    inputLabel: "Enter source message:",
    inputPlaceholder: "Your top secret passcode or message phrase...",
    btnEncrypt: "Encrypt",
    phase1: "PHASE 1: SECURED METRIC STREAM",
    idleText: "Awaiting payload string...",
    quantizing: "Quantizing raw data packets...",
    recipientDecrypt: "Decrypt on recipient's end →",
    phase2: "PHASE 2: DECRYPTION NODE",
    noData: "No payload.",
    preparing: "Assembling peer handshake...",
    underway: "Encrypted packet received. Awaiting local decoding.",
    syncing: "Decrypting block indexes...",
    successIntegrity: "✅ SECURED: INTEGRITY 100%",
    noiseHeader: "Neural Voice Filter Core",
    noiseSub: "Listen to how the safe web-synthesizer isolates raw pitch while wiping high-frequency background ringings.",
    toneOff: "Mute Sound",
    toneOn: "Launch Test Sound",
    tunerText: "AI Noise Restitution",
    genDisabled: "Wave generator offline",
    tunerTip: "Hint: Turn on the sound test and toggle the AI Filter to experience real-time clean audio.",
    streamHeader: "Ultra-HD Screen sharing",
    streamSub: "Transmit raw pixel buffers at 144 FPS with absolute zero downsampling. Cycle resolution steps to compare compression ratios.",
    pixel720: "Pixelated 720p stream",
    arHeader: "Deploy your virtual AR Persona",
    arSub: "Happen to speak? The avatar models lip-sync in real time. Adjust materials, shapes, and backlight accents.",
    avatarLabel: "Avatar Styling:",
    expressionLabel: "Expression State:",
    neonLabel: "Neon Backlight Highlight:",
    style1: "Cyborg",
    style2: "Neon Fox",
    style3: "Cosmonaut",
    style4: "Mystic",
    expr1: "Smile",
    expr2: "Wink",
    expr3: "Rest State",
    expr4: "Shocked",
    clientFooterPrompt: "All simulations execute entirely on internal browser sandboxes without relaying logs online."
  }
};

export default function Features() {
  const { theme, language } = useAdmin();
  const loc = featuresLocalDict[language];
  const [activePlayground, setActivePlayground] = useState<string>('shield');
  const [isPlaygroundLoading, setIsPlaygroundLoading] = useState<boolean>(true);

  // Setup parallax scroll reference on Features section container
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Calculate distinct speed parameters to drive a multi-layered parallax background depth
  const yBgSlow = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const yBgMedium = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const yBgFast = useTransform(scrollYProgress, [0, 1], [-130, 130]);
  const rotateBg = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Trigger loading screen on mount to simulate active rig connections
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaygroundLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // Soft high-speed skeleton interceptor when user switches tests
  const handleSelectPlayground = (id: string) => {
    if (activePlayground === id && !isPlaygroundLoading) return;
    setIsPlaygroundLoading(true);
    setActivePlayground(id);
    setTimeout(() => {
      setIsPlaygroundLoading(false);
    }, 700);
  };

  // Quantum Shield State
  const [shieldInput, setShieldInput] = useState<string>(language === 'ru' ? 'Секретное сообщение Nexus' : 'Top Secret Nexus Channel');
  const [encryptedText, setEncryptedText] = useState<string>('');
  const [decryptedText, setDecryptedText] = useState<string>('');
  const [shieldState, setShieldState] = useState<'idle' | 'encrypting' | 'encrypted' | 'decrypting' | 'decrypted'>('idle');

  // AI Noise Cleaner State (audio simulation)
  const [isPlayingTestTone, setIsPlayingTestTone] = useState<boolean>(false);
  const [noiseCleanerActive, setNoiseCleanerActive] = useState<boolean>(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const toneNodeRef = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | OscillatorNode | null>(null);
  const toneGainRef = useRef<GainNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);

  // 8K Stream State
  const [resolution, setResolution] = useState<'725p' | '720p' | '1080p' | '4k' | '8k'>('8k');
  const [currentFps, setCurrentFps] = useState<number>(144);
  const [currentKbps, setCurrentKbps] = useState<number>(85200);

  // AR Avatar State
  const [avatarStyle, setAvatarStyle] = useState<'cyber' | 'fox' | 'cosmo' | 'holo'>('cyber');
  const [avatarExpression, setAvatarExpression] = useState<'smile' | 'wink' | 'neutral' | 'shocked'>('smile');
  const [glowColor, setGlowColor] = useState<string>('#a855f7'); // violet

  // List of features to map to UI
  const featureList = [
    {
      id: 'shield',
      icon: <ShieldCheck className="w-8 h-8" />,
      title: loc.quantumTitle,
      desc: loc.quantumDesc,
      badge: loc.quantumBadge,
    },
    {
      id: 'noisecleaner',
      icon: <Sparkles className="w-8 h-8" />,
      title: loc.noiseTitle,
      desc: loc.noiseDesc,
      badge: loc.noiseBadge,
    },
    {
      id: 'stream',
      icon: <Tv className="w-8 h-8" />,
      title: loc.streamTitle,
      desc: loc.streamDesc,
      badge: loc.streamBadge,
    },
    {
      id: 'avatar',
      icon: <Eye className="w-8 h-8" />,
      title: loc.avatarTitle,
      desc: loc.avatarDesc,
      badge: loc.avatarBadge,
    },
  ];

  // Quantum Encryption Simulation
  const handleQuantumEncrypt = () => {
    if (!shieldInput.trim()) return;
    setShieldState('encrypting');
    setDecryptedText('');
    
    // Simulate encryption
    setTimeout(() => {
      const scrambled = shieldInput
        .split('')
        .map((char) => {
          const charCode = char.charCodeAt(0);
          return (charCode + 42).toString(16).toUpperCase();
        })
        .join(' ');
      setEncryptedText(scrambled);
      setShieldState('encrypted');
    }, 1200);
  };

  const handleQuantumDecrypt = () => {
    if (shieldState !== 'encrypted') return;
    setShieldState('decrypting');

    // Simulate quantum signature check and descrambling
    setTimeout(() => {
      setDecryptedText(shieldInput);
      setShieldState('decrypted');
    }, 1200);
  };

  // Web Audio Noise simulation (synthesized safe electronic bleeps)
  const stopWebAudioTest = () => {
    try {
      if (toneNodeRef.current) {
        toneNodeRef.current.stop();
        toneNodeRef.current.disconnect();
        toneNodeRef.current = null;
      }
      if (noiseNodeRef.current) {
        (noiseNodeRef.current as OscillatorNode).stop();
        noiseNodeRef.current.disconnect();
        noiseNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (e) {
      console.warn('Audio cleanup issue:', e);
    }
    setIsPlayingTestTone(false);
  };

  const startWebAudioTest = () => {
    if (isPlayingTestTone) {
      stopWebAudioTest();
      return;
    }

    try {
      // Create Web Audio context safely
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        alert('Web Audio API is not supported by your browser');
        return;
      }
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // 1. Stable Test Signal (Electronic sound)
      const toneOsc = ctx.createOscillator();
      toneOsc.type = 'sine';
      toneOsc.frequency.setValueAtTime(440, ctx.currentTime); // Standard 440Hz A4 note

      const toneGain = ctx.createGain();
      toneGain.gain.setValueAtTime(0.08, ctx.currentTime); // Quiet

      toneOsc.connect(toneGain);
      toneGain.connect(ctx.destination);
      toneNodeRef.current = toneOsc;
      toneGainRef.current = toneGain;

      // 2. High-Frequency "Hiss" Noise (Synthesized via heavy-grained pulse oscillator)
      const noiseOsc = ctx.createOscillator();
      noiseOsc.type = 'triangle';
      noiseOsc.frequency.setValueAtTime(8000, ctx.currentTime); // High pitched screech/hiss

      const noiseGain = ctx.createGain();
      // Set initial state based on noise cleaner toggle
      noiseGain.gain.setValueAtTime(noiseCleanerActive ? 0.0 : 0.04, ctx.currentTime);

      noiseOsc.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseNodeRef.current = noiseOsc;
      noiseGainRef.current = noiseGain;

      // Start triggers
      toneOsc.start();
      noiseOsc.start();
      setIsPlayingTestTone(true);
    } catch (err) {
      console.warn('Could not launch synthesizer nodes:', err);
    }
  };

  // Sync noise cleaner toggle directly to sound synthesis gain if playing
  useEffect(() => {
    if (isPlayingTestTone && noiseGainRef.current) {
      noiseGainRef.current.gain.setValueAtTime(noiseCleanerActive ? 0.0 : 0.04, audioContextRef.current?.currentTime || 0);
    }
  }, [noiseCleanerActive, isPlayingTestTone]);

  // Clean up sound on feature change or unmount
  useEffect(() => {
    return () => {
      stopWebAudioTest();
    };
  }, [activePlayground]);

  // 8K Stream Resolution visual indicators switcher
  useEffect(() => {
    if (resolution === '720p') {
      setCurrentFps(30);
      setCurrentKbps(1500);
    } else if (resolution === '1080p') {
      setCurrentFps(60);
      setCurrentKbps(4500);
    } else if (resolution === '4k') {
      setCurrentFps(120);
      setCurrentKbps(25000);
    } else {
      setCurrentFps(144);
      setCurrentKbps(85200);
    }
  }, [resolution]);

  // Dynamic Avatar Expressions mapper
  const getAvatarExpressionEmoji = () => {
    switch (avatarExpression) {
      case 'smile':
        return '😄';
      case 'wink':
        return '😉';
      case 'shocked':
        return '😲';
      case 'neutral':
      default:
        return '😐';
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className={`relative py-24 border-t overflow-hidden transition-colors duration-300 ${
        theme === 'light' ? 'border-slate-200 bg-white text-slate-800' : 'border-slate-900 bg-slate-950/10 text-slate-400'
      }`}
    >
      {/* Subtle Premium Parallax Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Subtle decorative grid background with slow parallax shift */}
        <motion.div 
          style={{ y: yBgSlow }}
          className={`absolute inset-0 opacity-[0.03] dark:opacity-[0.07] ${
            theme === 'light' 
              ? 'bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]' 
              : 'bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]'
          } bg-[size:4rem_4rem]`}
        />

        {/* Ambient Top-Left Glowing Soft Orb with fast parallax scroll and smooth rotation */}
        <motion.div
          style={{
            y: yBgFast,
            rotate: rotateBg,
            background: theme === 'light'
              ? 'radial-gradient(circle, rgba(147,51,234,0.2) 0%, rgba(99,102,241,0.05) 75%, transparent 100%)'
              : 'radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(99,102,241,0.1) 75%, transparent 100%)',
          }}
          className="absolute -top-[10%] -left-[10%] w-[50%] aspect-square rounded-full filter blur-[100px] opacity-25 dark:opacity-[0.35]"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Ambient Bottom-Right Glowing Soft Orb with medium reverse parallax scroll */}
        <motion.div
          style={{
            y: yBgMedium,
            background: theme === 'light'
              ? 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(147,51,234,0.05) 75%, transparent 100%)'
              : 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(147,51,234,0.1) 75%, transparent 100%)',
          }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] aspect-square rounded-full filter blur-[120px] opacity-[0.18] dark:opacity-[0.25]"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />

        {/* Floating tech rings with parallax elevation to reinforce cybersecurity & space themes */}
        <motion.div
          style={{ y: yBgFast, rotate: rotateBg }}
          className={`absolute top-[40%] right-[3%] w-72 h-72 rounded-full border border-dashed opacity-5 dark:opacity-15 pointer-events-none hidden md:block ${
            theme === 'light' ? 'border-purple-300' : 'border-purple-500/30'
          }`}
        />
        
        <motion.div
          style={{ y: yBgSlow }}
          className={`absolute top-[20%] left-[8%] w-44 h-44 rounded-full border opacity-5 dark:opacity-10 pointer-events-none hidden md:block ${
            theme === 'light' ? 'border-slate-300' : 'border-slate-500/20'
          }`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full z-10">
        
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 italic block bg-clip-text text-transparent ${
            theme === 'light' 
              ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-purple-800' 
              : 'bg-gradient-to-r from-white via-white to-purple-300'
          }`}>
            {loc.title}
          </h2>
          <p className={`text-lg font-light ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
            {loc.desc}
          </p>
        </motion.div>

        {/* Outer Grid: Left layout maps cards, Right layout executes the interactive playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Bento Menu Selection Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            {featureList.map((feat) => {
              const isSelected = activePlayground === feat.id;
              return (
                <button
                  key={feat.id}
                  onClick={() => handleSelectPlayground(feat.id)}
                  className={`cursor-pointer text-left p-6 rounded-2xl transition-all duration-300 border flex gap-5 items-start relative overflow-hidden ${
                    isSelected
                      ? theme === 'light'
                        ? 'bg-purple-50/70 border-purple-500 shadow-md shadow-purple-500/5 backdrop-blur-xl'
                        : 'bg-white/10 border-purple-500/50 shadow-xl shadow-purple-500/10 backdrop-blur-xl'
                      : theme === 'light'
                        ? 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-slate-100/50'
                        : 'bg-white/5 border-white/10 hover:border-purple-500/30 hover:bg-white/10'
                  }`}
                >
                  {/* Subtle Glow background indicator when selected */}
                  {isSelected && theme === 'dark' && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
                  )}

                  {/* Icon Block */}
                  <div className={`p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? theme === 'light'
                        ? 'bg-purple-100 border-purple-300 text-purple-750'
                        : 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                      : theme === 'light'
                        ? 'bg-slate-100 border-slate-200 text-slate-600'
                        : 'bg-white/5 border-white/10 text-slate-400'
                  }`}>
                    {feat.icon}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] tracking-wider font-extrabold block mb-1 uppercase font-mono ${
                      theme === 'light' ? 'text-purple-750' : 'text-purple-400'
                    }`}>
                      {feat.badge}
                    </span>
                    <h3 className={`text-lg font-bold mb-1 tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {feat.title}
                    </h3>
                    <p className={`text-sm leading-normal font-light ${theme === 'light' ? 'text-slate-550' : 'text-slate-400'}`}>
                      {feat.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </motion.div>

          {/* Interactive Playground Dynamic Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className={`relative border rounded-[32px] p-6 min-h-[460px] flex flex-col justify-between transition-all ${
              theme === 'light'
                ? 'bg-white border-purple-250/25 shadow-xl shadow-slate-250/30'
                : 'bg-white/5 border-white/10 shadow-2xl'
            }`}>
              
              {/* Top Banner indicating preview mode */}
              <div className={`flex justify-between items-center border-b pb-4 mb-6 ${
                theme === 'light' ? 'border-slate-200' : 'border-white/5'
              }`}>
                <span className={`text-xs font-bold font-mono flex items-center gap-2 ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  <Activity className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-purple-600' : 'text-violet-400'}`} />
                  {loc.testDrive}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  theme === 'light'
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                }`}>
                  {loc.onlineSimulator}
                </span>
              </div>

              {/* Dynamic Content Switching */}
              <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {isPlaygroundLoading ? (
                    <motion.div
                      key="playground-skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-6 w-full py-4 text-left"
                    >
                      {/* Mimic title/header */}
                      <div className="flex flex-col items-center text-center gap-2 mb-4">
                        <div className={`h-6 w-52 rounded-2xl ${
                          theme === 'light' ? 'bg-slate-200' : 'bg-white/10'
                        } animate-pulse`} />
                        <div className={`h-3 w-80 rounded-2xl ${
                          theme === 'light' ? 'bg-slate-100' : 'bg-white/5'
                        } animate-pulse`} />
                      </div>

                      {/* Mimic controls/preview layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`border rounded-2xl p-5 h-38 flex flex-col justify-between ${
                          theme === 'light' ? 'bg-slate-50/50 border-slate-200' : 'bg-white/5 border-white/10'
                        } animate-pulse`}>
                          <div className="space-y-2">
                            <div className={`h-2.5 w-1/4 rounded-full ${theme === 'light' ? 'bg-slate-200' : 'bg-white/15'}`} />
                            <div className={`h-3 w-3/4 rounded-full ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
                            <div className={`h-3 w-1/2 rounded-full ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
                          </div>
                          <div className={`h-4 w-1/3 rounded-full ${theme === 'light' ? 'bg-slate-200' : 'bg-white/15'}`} />
                        </div>

                        <div className={`border rounded-2xl p-5 h-38 flex flex-col justify-between ${
                          theme === 'light' ? 'bg-slate-50/50 border-slate-200' : 'bg-white/5 border-white/10'
                        } animate-pulse`}>
                          <div className="space-y-2">
                            <div className={`h-2.5 w-1/3 rounded-full ${theme === 'light' ? 'bg-slate-200' : 'bg-white/15'}`} />
                            <div className={`h-3 w-2/3 rounded-full ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
                          </div>
                          <div className="flex gap-1.5 mt-2">
                            <div className={`h-5 w-12 rounded-lg ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
                            <div className={`h-5 w-16 rounded-lg ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
                          </div>
                        </div>
                      </div>

                      {/* Bottom selector list skeleton */}
                      <div className="flex justify-center gap-3 mt-4">
                        <div className={`h-9 w-20 rounded-xl ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'} animate-pulse`} />
                        <div className={`h-9 w-20 rounded-xl ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'} animate-pulse`} />
                        <div className={`h-9 w-20 rounded-xl ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'} animate-pulse`} />
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      {/* PLAYGROUND: QUANTUM SHIELD */}
                      {activePlayground === 'shield' && (
                    <motion.div
                      key="shield"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <div className="text-center max-w-md mx-auto mb-2">
                        <h4 className={`text-xl font-bold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{loc.quantumHeader}</h4>
                        <p className={`text-xs font-light ${theme === 'light' ? 'text-slate-550' : 'text-slate-400'}`}>
                          {loc.quantumSub}
                        </p>
                      </div>

                      {/* Input Text Box */}
                      <div className="space-y-1.5 text-left">
                        <label className={`text-[10px] font-bold uppercase tracking-widest block ${
                          theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                        }`}>{loc.inputLabel}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={shieldInput}
                            onChange={(e) => {
                              setShieldInput(e.target.value);
                              setShieldState('idle');
                            }}
                            placeholder={loc.inputPlaceholder}
                            className={`rounded-xl px-4 py-3 text-sm flex-1 focus:outline-none transition-colors border ${
                              theme === 'light'
                                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500 focus:bg-white'
                                : 'bg-black/40 border-white/10 text-white focus:border-violet-500/50'
                            }`}
                          />
                          <button
                            onClick={handleQuantumEncrypt}
                            disabled={shieldState === 'encrypting'}
                            className="cursor-pointer font-bold rounded-xl py-3 px-5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-550 disabled:opacity-50 text-white text-sm transition-all flex items-center gap-2 shadow"
                          >
                            <Lock className="w-4 h-4" />
                            <span>{loc.btnEncrypt}</span>
                          </button>
                        </div>
                      </div>

                      {/* Display Encrypted Scrambled Content */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        
                        {/* Box 1: Encrypted state */}
                        <div className={`p-4 rounded-xl border flex flex-col justify-between h-36 ${
                          theme === 'light' ? 'bg-slate-50/50 border-purple-100' : 'bg-black/50 border-violet-500/10'
                        }`}>
                          <div>
                            <span className={`text-[10px] font-bold uppercase font-mono block mb-1 ${
                              theme === 'light' ? 'text-purple-700' : 'text-indigo-400'
                            }`}>{loc.phase1}</span>
                            <div className={`font-mono text-[11px] break-all leading-tight h-16 overflow-y-auto pr-1 ${
                              theme === 'light' ? 'text-purple-900' : 'text-indigo-300'
                            }`}>
                              {shieldState === 'idle' && loc.idleText}
                              {shieldState === 'encrypting' && loc.quantizing}
                              {(shieldState === 'encrypted' || shieldState === 'decrypting' || shieldState === 'decrypted') && encryptedText}
                            </div>
                          </div>
                          {shieldState === 'encrypted' && (
                            <button
                              onClick={handleQuantumDecrypt}
                              className="cursor-pointer text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>{loc.recipientDecrypt}</span>
                            </button>
                          )}
                        </div>

                        {/* Box 2: Decrypted state */}
                        <div className={`p-4 rounded-xl border flex flex-col justify-between h-36 ${
                          theme === 'light' ? 'bg-slate-50/50 border-emerald-100' : 'bg-black/50 border-emerald-500/10'
                        }`}>
                          <div>
                            <span className={`text-[10px] font-bold uppercase font-mono block mb-1 ${
                              theme === 'light' ? 'text-emerald-800' : 'text-emerald-400'
                            }`}>{loc.phase2}</span>
                            <div className={`text-sm font-medium leading-normal ${
                              theme === 'light' ? 'text-slate-800' : 'text-slate-300'
                            }`}>
                              {shieldState === 'idle' && loc.noData}
                              {shieldState === 'encrypting' && loc.preparing}
                              {shieldState === 'encrypted' && loc.underway}
                              {shieldState === 'decrypting' && loc.syncing}
                              {shieldState === 'decrypted' && (
                                <span className="text-emerald-600 dark:text-emerald-300 flex items-center gap-1.5 font-semibold">
                                  <Unlock className="w-4 h-4 text-emerald-500 inline" />
                                  {decryptedText}
                                </span>
                              )}
                            </div>
                          </div>
                          {shieldState === 'decrypted' && (
                            <span className="text-[10px] font-bold text-emerald-600 font-mono tracking-wider">
                              {loc.successIntegrity}
                            </span>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* PLAYGROUND: AI NOISE CLEANER */}
                  {activePlayground === 'noisecleaner' && (
                    <motion.div
                      key="noisecleaner"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <div className="text-center max-w-md mx-auto">
                        <h4 className={`text-xl font-bold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{loc.noiseHeader}</h4>
                        <p className={`text-xs font-light ${theme === 'light' ? 'text-slate-550' : 'text-slate-400'}`}>
                          {loc.noiseSub}
                        </p>
                      </div>

                      <div className={`border rounded-2xl p-6 flex flex-col items-center gap-5 justify-center max-w-sm mx-auto ${
                        theme === 'light' ? 'bg-slate-50 border-purple-100' : 'bg-black/40 border-white/5'
                      }`}>
                        
                        {/* Synthesizer Control button */}
                        <button
                          onClick={startWebAudioTest}
                          className={`cursor-pointer w-full font-bold rounded-full py-3 px-6 transition-all border flex items-center justify-center gap-3 ${
                            isPlayingTestTone
                              ? 'bg-red-500/15 border-red-550 text-red-500 hover:bg-red-500/25'
                              : 'bg-purple-650 border-purple-600 text-white hover:scale-[1.02]'
                          }`}
                        >
                          {isPlayingTestTone ? <Square className="w-5 h-5 fill-red-400" /> : <Play className="w-5 h-5 fill-white" />}
                          <span>{isPlayingTestTone ? loc.toneOff : loc.toneOn}</span>
                        </button>

                        {/* Interactive toggle of AI noise filter */}
                        <div className={`w-full flex justify-between items-center border-t pt-4 ${
                          theme === 'light' ? 'border-purple-200/50' : 'border-white/5'
                        }`}>
                          <span className={`text-xs font-semibold flex items-center gap-2 ${
                            theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                          }`}>
                            <Volume2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            {loc.tunerText}
                          </span>
                          <button
                            onClick={() => setNoiseCleanerActive(!noiseCleanerActive)}
                            className={`cursor-pointer w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 ${noiseCleanerActive ? 'bg-purple-600' : 'bg-slate-700'}`}
                          >
                            <motion.div
                              layout
                              className="bg-white w-5 h-5 rounded-full shadow-md"
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              style={{ marginStart: noiseCleanerActive ? 'auto' : '0' }}
                            />
                          </button>
                        </div>

                        {/* Visual wave box (high noise vs flat tone) */}
                        <div className={`w-full h-16 border rounded-xl flex items-center justify-center gap-0.5 overflow-hidden px-4 ${
                          theme === 'light' ? 'bg-slate-200/50 border-slate-300' : 'bg-black/60 border-violet-500/10'
                        }`}>
                          {!isPlayingTestTone ? (
                            <span className="text-xs text-slate-500 font-mono">{loc.genDisabled}</span>
                          ) : noiseCleanerActive ? (
                            // Pure tone wave (sine wave smoothly cycling)
                            [...Array(30)].map((_, i) => {
                              const h = Math.sin((i / 29) * Math.PI * 4) * 16 + 24;
                              return (
                                <motion.div
                                  key={i}
                                  className="w-1 bg-purple-600 dark:bg-[#8b5cf6]/80 rounded-sm"
                                  animate={{ height: [h, h - 8, h] }}
                                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', delay: i * 0.02 }}
                                />
                              );
                            })
                          ) : (
                            // Highly chaotic static waveform combining sine + randomized noisiness
                            [...Array(30)].map((_, i) => {
                              const sizeRand = Math.floor(Math.random() * 32) + 4;
                              return (
                                <motion.div
                                  key={i}
                                  className="w-1 bg-red-550 dark:bg-red-400/80 rounded-sm"
                                  animate={{ height: [sizeRand, Math.floor(Math.random() * 32) + 4, sizeRand] }}
                                  transition={{ repeat: Infinity, duration: 0.1, ease: 'linear' }}
                                />
                              );
                            })
                          )}
                        </div>

                      </div>

                      <div className="text-slate-500 text-[10px] text-center italic">
                        {loc.tunerTip}
                      </div>
                    </motion.div>
                  )}

                  {/* PLAYGROUND: 8K STREAM PREVIEW */}
                  {activePlayground === 'stream' && (
                    <motion.div
                      key="stream"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="text-center max-w-sm mx-auto">
                        <h4 className={`text-xl font-bold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{loc.streamHeader}</h4>
                        <p className={`text-xs font-light ${theme === 'light' ? 'text-slate-550' : 'text-slate-400'}`}>
                          {loc.streamSub}
                        </p>
                      </div>

                      {/* Screen shared mock representation */}
                      <div className="relative aspect-video rounded-2xl border border-white/10 bg-slate-900 overflow-hidden group flex items-center justify-center">
                        {/* Generative streaming background simulator */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-900 to-violet-950 flex items-center justify-center">
                          {/* Simulated high-tech geometric graphic */}
                          <div className={`w-32 h-32 rounded-full border-4 border-dashed border-violet-500/40 animate-spin flex items-center justify-center transition-all ${
                            resolution === '720p' ? 'scale-75 blur-[2.5px]' : resolution === '1080p' ? 'blur-[1px]' : resolution === '4k' ? 'scale-105' : 'scale-110'
                          }`} style={{ animationDuration: '10s' }}>
                            <div className="w-16 h-16 rounded-full bg-violet-600/20 flex items-center justify-center font-bold text-lg text-violet-300">
                              Nexus
                            </div>
                          </div>
                        </div>

                        {/* Compression noise overlaid on stream based on current resolution */}
                        {resolution === '720p' && (
                          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2.5px] pointer-events-none flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-400 bg-black/80 px-2 py-1 rounded">{loc.pixel720}</span>
                          </div>
                        )}
                        {resolution === '1080p' && (
                          <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[0.8px] pointer-events-none" />
                        )}

                        {/* Top Overlay metrics block */}
                        <div className="absolute top-3 left-3 bg-black/75 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-3 select-none text-[10px] font-mono font-medium">
                          <span className="flex items-center gap-1.5 font-bold text-violet-300">
                            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-ping" />
                            SCREEN SHARE LIVE
                          </span>
                          <span className="text-slate-400">|</span>
                          <span className="text-emerald-400">{currentFps} FPS</span>
                          <span className="text-slate-400">|</span>
                          <span className="text-slate-300">{(currentKbps / 1000).toFixed(1)} Mbps</span>
                        </div>

                        {/* Right overlay resolution info */}
                        <div className="absolute bottom-3 right-3 bg-black/85 px-3 py-1 rounded-lg text-[10px] uppercase font-bold font-mono text-cyan-400 tracking-wider">
                          {resolution === '720p' && '1280 x 720 (HD)'}
                          {resolution === '1080p' && '1920 x 1080 (Full HD)'}
                          {resolution === '4k' && '3840 x 2160 (4K UHD)'}
                          {resolution === '8k' && '7680 x 4320 (8K Ultra HD)'}
                        </div>
                      </div>

                      {/* Resolving Selector */}
                      <div className="flex justify-center gap-2">
                        {(['720p', '1080p', '4k', '8k'] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => setResolution(r)}
                            className={`cursor-pointer text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                              resolution === r
                                ? 'bg-purple-650 text-white shadow shadow-purple-500/20'
                                : theme === 'light'
                                  ? 'bg-slate-100 border border-slate-200 text-slate-650 hover:bg-slate-200 hover:text-slate-900'
                                  : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {r.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* PLAYGROUND: AR AVATARS */}
                  {activePlayground === 'avatar' && (
                    <motion.div
                      key="avatar"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="text-center max-w-sm mx-auto">
                        <h4 className={`text-xl font-bold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{loc.arHeader}</h4>
                        <p className={`text-xs font-light ${theme === 'light' ? 'text-slate-550' : 'text-slate-400'}`}>
                          {loc.arSub}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                        
                        {/* Custom visual avatar preview block */}
                        <div className={`relative aspect-square max-w-[200px] mx-auto w-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden h-44 ${
                          theme === 'light' ? 'bg-slate-50 border-purple-200' : 'bg-slate-900 border-violet-500/20'
                        }`}>
                          {/* Inner glowing circle */}
                          <div
                            className="absolute w-28 h-28 rounded-full blur-2xl opacity-25 animate-pulse"
                            style={{ backgroundColor: glowColor }}
                          />

                          {/* Avatar Icon / Character Emoji Face */}
                          <div className="relative z-10 text-6xl select-none transition-transform duration-300 hover:scale-115">
                            {avatarStyle === 'cyber' && '🤖'}
                            {avatarStyle === 'fox' && '🦊'}
                            {avatarStyle === 'cosmo' && '👩‍🚀'}
                            {avatarStyle === 'holo' && '👽'}
                          </div>

                          {/* Expression bubble emoji overlay */}
                          <div className={`absolute top-4 right-4 w-10 h-10 rounded-full border flex items-center justify-center text-xl shadow select-none animate-bounce ${
                            theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-black/60 border-white/10'
                          }`}>
                            {getAvatarExpressionEmoji()}
                          </div>

                          {/* Glowing collar/border ring underneath the style choice */}
                          <div
                            className="absolute bottom-6 w-24 h-1 border-t-2 rounded-full shadow-lg"
                            style={{ borderColor: glowColor, boxShadow: `0 -4px 12px ${glowColor}` }}
                          />

                          <span className={`absolute bottom-2 text-[10px] font-mono font-bold uppercase tracking-widest ${
                            theme === 'light' ? 'text-slate-450' : 'text-slate-500'
                          }`}>
                            {avatarStyle} STYLE
                          </span>
                        </div>

                        {/* Interactive configurator dials */}
                        <div className="space-y-4 text-left">
                          
                          {/* Choose style */}
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1.5 ${
                              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                            }`}>{loc.avatarLabel}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {([
                                { id: 'cyber', label: loc.style1 },
                                { id: 'fox', label: loc.style2 },
                                { id: 'cosmo', label: loc.style3 },
                                { id: 'holo', label: loc.style4 },
                              ] as const).map((sty) => (
                                <button
                                  key={sty.id}
                                  onClick={() => setAvatarStyle(sty.id)}
                                  className={`cursor-pointer text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                                    avatarStyle === sty.id
                                      ? theme === 'light'
                                        ? 'bg-purple-100 border border-purple-300 text-purple-750'
                                        : 'bg-violet-500/15 border border-violet-500/40 text-violet-400'
                                      : theme === 'light'
                                        ? 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
                                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {sty.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Choose expression */}
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1.5 font-sans ${
                              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                            }`}>{loc.expressionLabel}</span>
                            <div className="opacity-95 flex flex-wrap gap-1.5">
                              {([
                                { id: 'smile', label: loc.expr1 },
                                { id: 'wink', label: loc.expr2 },
                                { id: 'neutral', label: loc.expr3 },
                                { id: 'shocked', label: loc.expr4 },
                              ] as const).map((expr) => (
                                <button
                                  key={expr.id}
                                  onClick={() => setAvatarExpression(expr.id)}
                                  className={`cursor-pointer text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                                    avatarExpression === expr.id
                                      ? theme === 'light'
                                        ? 'bg-purple-100 border border-purple-300 text-purple-750'
                                        : 'bg-violet-500/15 border border-violet-500/40 text-violet-300'
                                      : theme === 'light'
                                        ? 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
                                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {expr.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Choose Neon Accent */}
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1.5 ${
                              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                            }`}>{loc.neonLabel}</span>
                            <div className="flex gap-2">
                              {['#a855f7', '#06b6d4', '#10b981', '#f43f5e'].map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setGlowColor(color)}
                                  className={`cursor-pointer w-6 h-6 rounded-full border transition-transform ${
                                    glowColor === color ? 'scale-120 border-white font-bold' : 'border-transparent opacity-60 hover:opacity-100'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>

                        </div>

                      </div>
                    </motion.div>
                  )}
                    </>
                  )}

                </AnimatePresence>
              </div>

              {/* Action Prompt */}
              <div className={`border-t pt-4 mt-6 text-center ${
                theme === 'light' ? 'border-slate-200' : 'border-white/5'
              }`}>
                <p className="text-xs text-slate-500 font-medium">
                  {loc.clientFooterPrompt}
                </p>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
