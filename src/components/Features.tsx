import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ShieldCheck, Sparkles, Tv, Eye, Lock, Unlock, Play, Square, Activity, Volume2, Terminal, Code, Cpu, Layers, Globe } from 'lucide-react';
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

const CODE_STREAM_TEXT = `// Node.JS Client - Initializing Nexus P2P Engine
import { PeerStream, CryptoEngine } from '@nexus/protocol';

async function startSession() {
  const node = await PeerStream.createNode({
    enableAV1Codec: true,
    hardwareAcceleration: "auto",
    tunnelBypass: true
  });

  const shield = new CryptoEngine.QuantumShield();
  await node.secureAllConnections(shield);

  console.log("Nexus Node connected & secure!");
  return node;
}

startSession();`;

const MASTER_TERMINAL_LOGS = [
  "SYSTEM: Bootstrapping P2P transport on port tcp://3000...",
  "AV1: Initialized AV1 Hardware-Accelerated Encoder.",
  "E2E: Quantum key exchange established with 12 peers.",
  "NET: Bitrate optimized: active tunnel connection active.",
  "MEM: Buffer allocated: 512MB Ring Stack.",
  "PEER: Joined room node://london-relay-primary",
  "AUDIO: Noise Cleaner activated: 99.8% static reduced.",
  "STREAM: Capturing raw display raster buffers.",
  "DECODE: Remote client handshakes matched TLS v1.3.",
  "SYNC: System clock synchronized with atomic GMT time.",
  "CONN: Ping: 12ms | Jitter: 0.4ms | Loss: 0.00%",
  "SECURE: Handshake verified by 256-bit elliptic signature.",
  "AV1: Dynamic frame quantizer optimized (QP: 18).",
  "NETWORK: P2P Multiplexer streaming packet chunk #1405",
  "PEER: Linked with node://tokyo-relay-secondary",
  "SYSTEM: Heap usage stable at 45.2 MB",
  "METRIC: Direct-by-pass Tunneling linked (UPnP bypass: OK)",
  "E2E: Rotating session key #83A1D-F79B...",
  "AUDIO: CrystalVoice AI neural weights hot-swapped.",
  "STREAM: Render pipeline latency: 1.4 milliseconds.",
  "PEER: Linked with node://newyork-edge-09",
  "AV1: Frame rate synced to monitor V-Sync at 144Hz.",
  "METRIC: Raw pixel buffer transfer overhead direct.",
  "SYSTEM: P2P Mesh swarm density at 1,482 nodes peak.",
  "CONN: Peer packet acknowledgement latency under 10ms."
];

interface FeatureCardProps {
  key?: any;
  feat: {
    id: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
    badge: string;
  };
  isSelected: boolean;
  theme: any;
  onSelect: () => void;
}

function FeatureInteractiveCard({ feat, isSelected, theme, onSelect }: FeatureCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate normalized relative coords from center (-0.5 to 0.5)
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;
    
    // Constrain tilt to 8 degrees max for extremely subtle premium control
    setRotateX(-normY * 8);
    setRotateY(normX * 8);
    
    // Stream mouse positions dynamically to the custom highlight overlay
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        scale: isHovered ? (isSelected ? 1.01 : 1.025) : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 22,
        mass: 0.5,
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className={`relative cursor-pointer text-left p-6 rounded-2xl transition-all duration-300 border flex gap-5 items-start overflow-hidden select-none outline-none ${
        isSelected
          ? theme === 'light'
            ? 'bg-purple-100/40 border-purple-500 shadow-md shadow-purple-500/5 backdrop-blur-xl'
            : 'bg-white/10 border-purple-500/50 shadow-xl shadow-purple-500/15 backdrop-blur-xl'
          : theme === 'light'
            ? 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-slate-100/50 hover:shadow-lg hover:shadow-purple-500/5'
            : 'bg-white/5 border-white/10 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/5'
      }`}
    >
      {/* Dynamic glossy spot-flare that tracks mouse cursor directly */}
      {isHovered && (
        <div 
          className="absolute inset-0 opacity-[0.14] dark:opacity-[0.24] pointer-events-none transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(circle 140px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(147, 51, 234, 0.45), transparent 100%)`,
          }}
        />
      )}

      {/* Selected Background Highlight Arc Indicator */}
      {isSelected && theme === 'dark' && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/15 to-transparent rounded-bl-full pointer-events-none" />
      )}

      {/* Floating Icon Box (Z-elevated for depth) */}
      <motion.div 
        animate={{
          scale: isHovered ? 1.08 : 1,
          rotate: isHovered ? [0, -3, 3, 0] : 0,
        }}
        transition={{
          rotate: { duration: 0.45, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 400, damping: 15 }
        }}
        style={{ transformZ: "30px" }}
        className={`relative z-10 p-3.5 rounded-xl border transition-all shrink-0 ${
          isSelected
            ? theme === 'light'
              ? 'bg-purple-150 border-purple-300 text-purple-800'
              : 'bg-purple-500/20 border-purple-500/40 text-purple-300'
            : theme === 'light'
              ? 'bg-slate-100 border-slate-200 text-slate-600'
              : 'bg-white/5 border-white/10 text-slate-400'
        }`}
      >
        {feat.icon}
      </motion.div>

      {/* Text Details Container (Z-elevated slightly less than icon to create layered depth) */}
      <div className="relative z-10 flex-1 min-w-0" style={{ transformZ: "18px" }}>
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
    </motion.button>
  );
}

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
  const toneOscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const toneGainRef = useRef<GainNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);

  // 8K Stream State
  const [resolution, setResolution] = useState<'725p' | '720p' | '1080p' | '4k' | '8k'>('8k');
  const [currentFps, setCurrentFps] = useState<number>(144);
  const [currentKbps, setCurrentKbps] = useState<number>(85200);

  // 8K Video Stream simulation animations
  const [typewriterIndex, setTypewriterIndex] = useState<number>(0);
  const [logOffset, setLogOffset] = useState<number>(0);
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number }>({ x: 40, y: 30 });

  // Stream typewriter, console scrolling, and pointer cursor effects
  useEffect(() => {
    if (activePlayground !== 'stream') return;
    
    // Typewriter loop
    const textLength = CODE_STREAM_TEXT.length;
    const typewriterTimer = setInterval(() => {
      setTypewriterIndex(prev => {
        if (prev >= textLength) {
          return 0; // Loop back
        }
        // Higher resolution = faster typewriter / processing
        const step = resolution === '720p' ? 1 : resolution === '1080p' ? 2 : resolution === '4k' ? 4 : 7;
        return Math.min(prev + step, textLength);
      });
    }, 60);

    // Terminal log scroll
    const logTimer = setInterval(() => {
      setLogOffset(prev => prev + 1);
    }, resolution === '720p' ? 3000 : resolution === '1080p' ? 2000 : resolution === '4k' ? 1200 : 750);

    // Mouse cursor coordinates movement ( Lissajous curve )
    let frame = 0;
    const cursorTimer = setInterval(() => {
      frame += 0.04;
      const x = 50 + Math.sin(frame * 1.5) * 35;
      const y = 50 + Math.cos(frame * 2.1) * 30;
      setCursorCoords({ x, y });
    }, resolution === '720p' ? 95 : resolution === '1080p' ? 50 : resolution === '4k' ? 25 : 15);

    return () => {
      clearInterval(typewriterTimer);
      clearInterval(logTimer);
      clearInterval(cursorTimer);
    };
  }, [activePlayground, resolution]);

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

  // Web Audio Noise simulation (synthesized safe electronic streams with high-fidelity noise)
  const stopWebAudioTest = () => {
    try {
      if (toneOscillatorsRef.current) {
        toneOscillatorsRef.current.forEach(osc => {
          try { osc.stop(); } catch (e) {}
          try { osc.disconnect(); } catch (e) {}
        });
        toneOscillatorsRef.current = [];
      }
      if (noiseSourceRef.current) {
        try { noiseSourceRef.current.stop(); } catch (e) {}
        try { noiseSourceRef.current.disconnect(); } catch (e) {}
        noiseSourceRef.current = null;
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch (e) {}
        audioContextRef.current = null;
      }
    } catch (e) {
      console.warn('Audio cleanup issue:', e);
    }
    setIsPlayingTestTone(false);
  };

  const startWebAudioTest = async () => {
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

      // Resume context if suspended (browser security autostart policy)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // 1. Stable Premium Ambient Voice/Melody Simulator
      const toneGain = ctx.createGain();
      toneGain.gain.setValueAtTime(0.06, ctx.currentTime); // Gentle and soothing

      const oscs: OscillatorNode[] = [];
      const frequencies = [261.63, 329.63, 392.00, 523.25]; // Warm C Major chord (C4, E4, G4, C5)
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // Add a tiny detune to create a lush wide stereo-chorus soundscape (analogous to premium stream)
        const detuneValue = (idx - 1.5) * 8; // detunes between -12 and +12 cents
        osc.detune.setValueAtTime(detuneValue, ctx.currentTime);

        osc.connect(toneGain);
        osc.start();
        oscs.push(osc);
      });

      toneGain.connect(ctx.destination);
      toneOscillatorsRef.current = oscs;
      toneGainRef.current = toneGain;

      // 2. High-Fidelity Room Hiss & Fan Noise (True White Noise Simulation)
      const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise buffer
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseGain = ctx.createGain();
      // Smoothly set initial state based on noise cleaner toggle
      const initialNoiseVolume = noiseCleanerActive ? 0.0 : 0.035;
      noiseGain.gain.setValueAtTime(initialNoiseVolume, ctx.currentTime);

      whiteNoise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      whiteNoise.start();
      noiseSourceRef.current = whiteNoise;
      noiseGainRef.current = noiseGain;

      setIsPlayingTestTone(true);
    } catch (err) {
      console.warn('Could not launch synthesizer nodes:', err);
    }
  };

  // Sync noise cleaner toggle directly to sound synthesis gain if playing
  useEffect(() => {
    if (isPlayingTestTone && noiseGainRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      const targetGain = noiseCleanerActive ? 0.0 : 0.035;
      // Exponential transition over 150ms for that high-tech neural "cancelling" effect
      noiseGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.12);
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
            {featureList.map((feat) => (
              <FeatureInteractiveCard
                key={feat.id}
                feat={feat}
                isSelected={activePlayground === feat.id}
                theme={theme}
                onSelect={() => handleSelectPlayground(feat.id)}
              />
            ))}
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
                      <div className="relative aspect-video rounded-2xl border border-white/15 bg-[#030307] overflow-hidden group flex flex-col font-sans select-none shadow-2xl">
                        
                        {/* The Actual Video Stream Canvas with Codec Compression Simulator */}
                        <div 
                          className={`absolute inset-0 flex flex-col bg-[#05050b] transition-all duration-300 ${
                            resolution === '720p' 
                              ? 'blur-[1.6px] contrast-[0.92] brightness-[0.95]' 
                              : resolution === '1080p' 
                                ? 'blur-[0.5px]' 
                                : resolution === '4k' 
                                  ? 'brightness-[1.03]' 
                                  : 'brightness-[1.05]'
                          }`}
                        >
                          {/* Pixelation matrix simulation overlay for 720p */}
                          {resolution === '720p' && (
                            <div 
                              className="absolute inset-0 pointer-events-none z-10 opacity-30" 
                              style={{ 
                                backgroundImage: `radial-gradient(#000 24%, transparent 25%), radial-gradient(#000 24%, transparent 25%)`,
                                backgroundPosition: `0 0, 1.5px 1.5px`,
                                backgroundSize: `3px 3px`
                              }} 
                            />
                          )}

                          {/* Desktop Top Menu/Status Bar */}
                          <div className="h-5 bg-[#0a0a14] border-b border-white/5 px-2 flex items-center justify-between text-[8px] font-mono text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <div className="flex gap-1">
                                <span className="w-1 h-3 rounded bg-red-500/80" />
                                <span className="w-1 h-3 rounded bg-yellow-500/80" />
                                <span className="w-1 h-3 rounded bg-green-500/80" />
                              </div>
                              <span className="font-semibold text-slate-300 font-mono tracking-normal leading-none block pt-[1px]">PresenterNode-8v4.local</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-purple-400">P2P Tunnel Active</span>
                              <span>CPU: {resolution === '720p' ? '12%' : resolution === '1080p' ? '8%' : resolution === '4k' ? '4%' : '2%'}</span>
                              <span>{(currentKbps / 1000).toFixed(1)} Mbps</span>
                            </div>
                          </div>

                          {/* Desktop Main Grid Area (Left: IDE Code, Right: Network Signal Visualizer + Terminal Logs) */}
                          <div className="flex-1 grid grid-cols-12 gap-2 p-2 min-h-0 text-left overflow-hidden">
                            
                            {/* IDE Code window */}
                            <div className="col-span-7 bg-[#080810]/95 border border-white/5 rounded-lg p-2 flex flex-col justify-between overflow-hidden relative shadow-lg">
                              <div className="flex items-center justify-between border-b border-white/5 pb-1">
                                <div className="flex items-center gap-1.5 text-[8px] text-slate-400 font-mono">
                                  <span className="bg-purple-500/10 text-purple-300 font-bold px-1.5 py-0.5 rounded border border-purple-500/20">nexus_protocol.ts</span>
                                  <span className="opacity-40">test_suite.go</span>
                                </div>
                                <span className="text-[7px] font-mono text-slate-600">TypeScript</span>
                              </div>

                              <div className="flex-1 font-mono text-[8px] leading-relaxed text-purple-200 overflow-hidden select-none whitespace-pre py-1.5 pl-1">
                                <pre className="whitespace-pre">
                                  {CODE_STREAM_TEXT.slice(0, typewriterIndex)}
                                  <span className="w-1 h-3 bg-purple-400 inline-block animate-pulse ml-0.5" />
                                </pre>
                              </div>
                            </div>

                            {/* Right components column */}
                            <div className="col-span-5 flex flex-col gap-2 min-h-0">
                              
                              {/* Orb Network Frequency Visualizer */}
                              <div className="h-[43%] bg-[#080810]/90 border border-white/5 rounded-lg p-1.5 flex flex-col justify-between overflow-hidden relative shadow-lg">
                                <div className="flex items-center justify-between border-b border-white/5 pb-1 text-[7px] text-slate-500 font-mono">
                                  <span>STREAM DENSITY</span>
                                  <span className="text-purple-455 font-bold uppercase">{resolution === '720p' ? 'Low' : resolution === '1080p' ? 'Medium' : resolution === '4k' ? 'Optimal' : 'Quantum Crisp'}</span>
                                </div>

                                <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                                  {/* Dynamic resolution-based orbits */}
                                  <div className="absolute inset-0 flex items-center justify-center scale-[0.85]">
                                    {/* 720p simple orbit */}
                                    {resolution === '720p' && (
                                      <div className="w-14 h-14 rounded-full border-2 border-dashed border-red-500/30 animate-spin flex items-center justify-center">
                                        <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-[7px] text-red-400 font-bold">720P</div>
                                      </div>
                                    )}

                                    {/* 1080p neat dual orbit */}
                                    {resolution === '1080p' && (
                                      <div className="relative w-16 h-16 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-pulse" />
                                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-sky-450/40 animate-spin animate-pulse" style={{ animationDuration: '6s' }} />
                                        <span className="text-[7px] font-mono text-sky-400 font-bold z-10">1080P</span>
                                      </div>
                                    )}

                                    {/* 4K multiple rings */}
                                    {resolution === '4k' && (
                                      <div className="relative w-20 h-20 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: '4s' }} />
                                        <div className="absolute w-16 h-16 rounded-full border border-cyan-400/40 animate-spin" style={{ animationDuration: '4s' }} />
                                        <div className="absolute w-12 h-12 rounded-full border border-dashed border-purple-500/40 animate-spin" style={{ animationDuration: '8s' }} />
                                        <span className="text-[7.5px] font-mono text-cyan-400 font-bold z-10 animate-pulse">4K UHD</span>
                                      </div>
                                    )}

                                    {/* 8K absolute massive particles */}
                                    {resolution === '8k' && (
                                      <div className="relative w-24 h-24 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-550/30 animate-spin" style={{ animationDuration: '10s' }} />
                                        <div className="absolute w-16 h-16 rounded-full border border-pink-500/20 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />
                                        <div className="absolute w-10 h-10 rounded-full border border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: '3s' }} />
                                        <span className="text-[7.5px] font-bold font-mono text-purple-300 tracking-wider z-10 animate-pulse">8K ULTRA</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Terminal Window with rolling logs */}
                              <div className="h-[57%] bg-black/95 border border-white/5 rounded-lg p-1.5 flex flex-col justify-between overflow-hidden shadow-lg">
                                <div className="flex items-center justify-between border-b border-white/5 pb-1 text-[7px] text-slate-500 font-mono">
                                  <span>TERMINAL LOG STACK / BASH</span>
                                  <span className="text-emerald-500">LIVE</span>
                                </div>
                                <div className="flex-1 font-mono text-[7px] text-emerald-400 leading-normal pt-1 flex flex-col gap-0.5 select-none overflow-hidden text-left">
                                  {Array.from({ length: 4 }).map((_, idx) => {
                                    const logIndex = (logOffset + idx) % MASTER_TERMINAL_LOGS.length;
                                    return (
                                      <div key={idx} className="truncate select-none opacity-85 hover:opacity-100 transition-opacity">
                                        <span className="text-slate-500 mr-1">&gt;</span>
                                        {MASTER_TERMINAL_LOGS[logIndex]}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                            </div>

                          </div>

                          {/* Animated pointer cursor to mimic live user presenter */}
                          <div 
                            className="absolute pointer-events-none z-20 transition-all duration-[80ms] ease-out text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                            style={{ 
                              left: `${cursorCoords.x}%`, 
                              top: `${cursorCoords.y}%` 
                            }}
                          >
                            <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
                              <path d="M0 0V11L3 8L7 8L0 0Z" fill="white" stroke="black" strokeWidth="0.8"/>
                            </svg>
                          </div>

                        </div>

                        {/* Top Overlay metrics block (Sharp and clean, acts as visual decoder overlay) */}
                        <div className="absolute top-8 left-3 bg-black/85 px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-2 select-none text-[8.5px] font-mono font-medium z-20">
                          <span className="flex items-center gap-1 font-bold text-purple-400">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                            SCREEN LIVE
                          </span>
                          <span className="text-slate-600">|</span>
                          <span className="text-emerald-400 font-semibold">{currentFps} FPS</span>
                          <span className="text-slate-600">|</span>
                          <span className="text-slate-300">{(currentKbps / 1000).toFixed(1)} Mbps</span>
                        </div>

                        {/* Right overlay resolution info */}
                        <div className="absolute bottom-3 right-3 bg-black/90 px-2.5 py-1 rounded-lg text-[8.5px] uppercase font-bold font-mono text-cyan-400 tracking-wider z-20 border border-white/5">
                          {resolution === '720p' && '1280 x 720 (HD)'}
                          {resolution === '1080p' && '1920 x 1080 (HD)'}
                          {resolution === '4k' && '3840 x 2160 (4K UHD)'}
                          {resolution === '8k' && '7680 x 4320 (8K MAX)'}
                        </div>

                        {/* Custom visual warning banner only for 720p low fidelity mode */}
                        {resolution === '720p' && (
                          <div className="absolute bottom-3 left-3 bg-red-950/90 border border-red-500/20 px-2 py-1 rounded text-[7.5px] font-mono font-bold text-red-400 animate-pulse select-none z-20">
                            ⚠ LOW COMPRESSION MODE
                          </div>
                        )}

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
