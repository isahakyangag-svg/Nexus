import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Sparkles, Layers, Video, Headphones, Shield, Lock, 
  Download, ChevronRight, Activity, Terminal, RefreshCw, Cpu, 
  Settings, Check, Info, Server, Network, ShieldCheck, Play
} from 'lucide-react';
import { useAdmin } from '../context/AdminState';
import UpdateBlockRenderer from './UpdateBlockRenderer';

const LOGS_DATABASE = [
  "AV1: Booting dynamic rate allocator.",
  "NET: Peer linked to london-node-9.",
  "DECODE: HW Acceleration matched CJS.",
  "SECURE: Handshake validated cryptographically.",
  "AV1: Adaptive frame quantizer optimised (QP: 16)",
  "PEER: P2P Tunneling latency stabilized.",
  "AUDIO: Active voice enhancement toggled on.",
  "SYSTEM: CPU thread pool load under 3.5%",
  "DECODE: Remote client handshakes matched TLS v1.3.",
  "KRYPTO: Generated new key pair on sandbox thread 4.",
  "NET: Broadcast relay frame size matches 7680x4320.",
  "DECODE: AV1 hardware parser bound successfully."
];

export default function UpdatesScreen() {
  const { 
    theme, 
    language, 
    updatesVersion,
    updatesTitleRu,
    updatesTitleEn,
    updatesSubtitleRu,
    updatesSubtitleEn,
    updateBlocks,
    updatesAlertText, 
    setShowUpdatesModal 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [videoRes, setVideoRes] = useState<'720p' | '1080p' | '4k' | '8k'>('8k');
  const [audioFilterActive, setAudioFilterActive] = useState(true);
  const [noiseReductionFactor, setNoiseReductionFactor] = useState(95);
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);
  const [quantumKeys, setQuantumKeys] = useState({
    publicKey: "0x8F3D1C7A9E2B5C6D...3F",
    privateKey: "0x4A7B8C9D3E1F5A6B...7D",
    nodeName: "Central-UK-Router-Node-4"
  });

  // Simulator typewriter / logs variables
  const [typewriterIdx, setTypewriterIdx] = useState(0);
  const [logOffset, setLogOffset] = useState(0);
  const [activeLogList, setActiveLogList] = useState<string[]>([]);

  // Simulation timer effects
  useEffect(() => {
    const typewriterTimer = setInterval(() => {
      setTypewriterIdx(prev => {
        if (prev >= 200) return 0;
        return prev + 6;
      });
    }, 55);

    return () => clearInterval(typewriterTimer);
  }, [activeTab]);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogOffset(prev => (prev + 1) % LOGS_DATABASE.length);
    }, 1500);
    return () => clearInterval(logInterval);
  }, []);

  // Update real-time logs array simulating live console activity
  useEffect(() => {
    const logs = [];
    for (let i = 0; i < 4; i++) {
      const idx = (logOffset + i) % LOGS_DATABASE.length;
      logs.push(LOGS_DATABASE[idx]);
    }
    setActiveLogList(logs);
  }, [logOffset]);

  const handleRotateKeys = () => {
    setIsRotatingKeys(true);
    setTimeout(() => {
      const hexChars = "0123456789ABCDEF";
      let pKey = "0x";
      let sKey = "0x";
      for (let i = 0; i < 16; i++) {
        pKey += hexChars[Math.floor(Math.random() * 16)];
        sKey += hexChars[Math.floor(Math.random() * 16)];
      }
      pKey += "...";
      sKey += "...";
      const nodes = [
        "Gateway-US-East-Node-2",
        "Edge-DE-Frankfurt-Alpha",
        "Node-JP-Tokyo-Express",
        "Global-Core-Nexus-Tunnel"
      ];
      setQuantumKeys({
        publicKey: pKey + hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)],
        privateKey: sKey + hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)],
        nodeName: nodes[Math.floor(Math.random() * nodes.length)]
      });
      setIsRotatingKeys(false);
    }, 1000);
  };

  const getIconForBlock = (mediaType: string) => {
    switch (mediaType) {
      case 'all_summary': return Layers;
      case 'video_simulator': return Video;
      case 'audio_simulator': return Headphones;
      case 'crypto_simulator': return Shield;
      case 'image': return Sparkles;
      case 'video_url': return Play;
      case 'code': return Terminal;
      default: return Layers;
    }
  };

  const blocksToRender = activeTab === 'all'
    ? updateBlocks.filter(b => b.id !== 'all')
    : updateBlocks.filter(b => b.id === activeTab);

  function valueForSpec(key: 'bitrate' | 'latency') {
    if (key === 'bitrate') {
      if (videoRes === '720p') return '0.8 Mbps (Low)';
      if (videoRes === '1080p') return '3.5 Mbps (HD)';
      if (videoRes === '4k') return '12.4 Mbps (4K)';
      return '38.0 Mbps (8K ultra)';
    }
    return '12ms';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen pt-28 pb-24 px-4 sm:px-6 md:px-12 relative overflow-hidden select-none ${
        theme === 'light' 
          ? 'bg-slate-50 text-slate-900' 
          : 'bg-[#03020a] text-slate-100'
      }`}
    >
      {/* Absolute high-tech vector matrix patterns in dark mode */}
      {theme === 'dark' && (
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04)_0,transparent_65%)] pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-xs text-purple-400 font-mono font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{language === 'ru' ? 'Текущая версия:' : 'Current Patch:'} <span className="font-extrabold text-pink-400">{updatesVersion}</span></span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:via-purple-300 dark:to-indigo-400 font-sans">
              {language === 'ru' ? updatesTitleRu : updatesTitleEn}
            </h1>
            <p className={`text-base sm:text-lg font-normal mt-3 max-w-4xl leading-relaxed ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              {language === 'ru' ? updatesSubtitleRu : updatesSubtitleEn}
            </p>
          </div>

          <button
            onClick={() => {
              setShowUpdatesModal(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer group select-none self-start md:self-center py-3.5 px-6 rounded-2xl border transition-all duration-300 flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-purple-600/20 active:scale-95 font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{language === 'ru' ? 'Назад на главную' : 'Back to Main'}</span>
          </button>
        </div>

        {/* Global Broadcast Live Ticker Alert bar */}
        <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 justify-between ${
          theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/[0.15] border-white/5'
        }`}>
          <div className="flex items-center gap-3.5 text-left">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              theme === 'light' ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
            }`}>
              <Info className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                {language === 'ru' ? 'Объявление системы:' : 'System Broadcaster Announcement:'}
              </h4>
              <p className={`text-xs sm:text-sm mt-0.5 font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-300'}`}>
                "{updatesAlertText}"
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('demo-terminal');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="cursor-pointer text-[11px] font-bold text-white shrink-0 py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 transition-all shadow-md shadow-purple-600/25 flex items-center gap-2 select-none"
          >
            <span>{language === 'ru' ? 'К Инструменту' : 'Jump to Sandbox'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Split grid area: Category tabs Left + Showcase and Sandboxes on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Category Selector tabs */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`border p-6 rounded-[32px] space-y-5 ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#080812]/50 border-white/5'
            }`}>
              <span className="text-[10px] font-mono uppercase font-bold text-purple-400 tracking-widest block text-left">
                {language === 'ru' ? 'Навигация обновлений' : 'Updates Navigation'}
              </span>
              
              <div className="flex flex-col gap-2.5">
                {updateBlocks.map((item) => {
                  const Icon = getIconForBlock(item.mediaType);
                  const active = activeTab === item.id;
                  const label = language === 'ru' ? item.titleRu : item.titleEn;
                  const desc = language === 'ru' ? item.tabDescRu : item.tabDescEn;
                  const tag = language === 'ru' ? item.tagRu : item.tagEn;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setTypewriterIdx(0);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 relative cursor-pointer group ${
                        active
                          ? theme === 'light'
                            ? 'bg-purple-100/40 border-purple-400 text-slate-900 shadow-sm'
                            : 'bg-purple-650/10 border-purple-500/40 text-white shadow-lg shadow-purple-600/5'
                          : theme === 'light'
                            ? 'bg-slate-50/50 border-slate-150 text-slate-650 hover:bg-slate-100'
                            : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      {active && (
                        <div className="absolute top-4 left-1.5 w-1 h-8 rounded-full bg-purple-500" />
                      )}
                      <div className={`p-2.5 rounded-xl shrink-0 transition-all ${
                        active
                          ? 'bg-purple-600 text-white'
                          : theme === 'light' ? 'bg-slate-150 text-slate-650' : 'bg-white/5 text-slate-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-[13px] font-bold leading-none tracking-tight">{label}</span>
                          {tag && (
                            <span className="text-[8px] bg-pink-500/10 border border-pink-500/20 text-pink-400 font-extrabold px-1.5 py-0.5 rounded-full leading-none uppercase">
                              {tag}
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] sm:text-xs mt-1.5 font-light leading-normal line-clamp-1 ${
                          theme === 'light' ? 'text-slate-500' : 'text-slate-400 animate-pulse'
                        }`}>
                          {desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick specifications statistics card */}
            <div className={`border p-6 rounded-[32px] space-y-4 ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#080812]/50 border-white/5'
            }`}>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ru' ? 'Технические характеристики' : 'Performance Blueprint'}
                </span>
              </div>
              <div className="space-y-3 pt-2 text-xs">
                {[
                  { label: language === 'ru' ? 'Поддержка битрейта' : 'Stream Bandwidth Support', val: valueForSpec('bitrate') },
                  { label: language === 'ru' ? 'AI Удаление гармоник' : 'AI Harmonic Denoise', val: audioFilterActive ? '99.8% (Neural Shield)' : '35% (Offline Pass)' },
                  { label: language === 'ru' ? 'Частота дискретизации' : 'Audio Sampling Rate', val: '48 kHz Ultra-Core' },
                  { label: language === 'ru' ? 'Шифрование ключей' : 'Key Crypto Layer', val: quantumKeys.nodeName === 'Global-Core-Nexus-Tunnel' ? 'ECC-Quantum-Kyber-X4' : 'Kyber-Post-Quantum-1024' },
                  { label: language === 'ru' ? 'Заявленная задержка' : 'Direct End-to-End Latency', val: '12ms ~ 16ms max' }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-white/5 text-left">
                    <span className="text-slate-400">{spec.label}</span>
                    <span className="font-mono font-extrabold text-purple-400">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Highly Dynamic sandboxes showing the updates - Colspan 8 */}
          <div id="demo-terminal" className="lg:col-span-8 space-y-8 min-w-0">
            
            <div className={`border rounded-[32px] overflow-hidden flex flex-col ${
              theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#06060c] border-white/5'
            }`}>
              
              {/* Box Header containing tab specific info */}
              <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-black/[0.15]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Terminal className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <h5 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">
                      {language === 'ru' ? 'ИНТЕРАКТИВНЫЙ ТРАНСПОРТНЫЙ СЭНДБОКС' : 'INTERACTIVE TRANSPORT SANDBOX'}
                    </h5>
                    <h3 className="text-base font-bold mt-1 tracking-tight">
                      {language === 'ru' ? 'Свободная Симуляция Механизмов Связи' : 'Direct Simulated Communication Pipeline'}
                    </h3>
                  </div>
                </div>

                <div className="flex gap-2 font-mono text-[10px]">
                  <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold px-2.5 py-1 rounded-md">
                    CODEC: AV1
                  </span>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-md">
                    STATE: ACTIVE
                  </span>
                </div>
              </div>

              {/* Sub content grids depending on the active tab */}
              <div className="p-6 sm:p-8 space-y-8">
                {blocksToRender.map((block, index) => (
                  <motion.div 
                    key={block.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={index > 0 ? 'pt-8 border-t border-purple-500/10' : ''}
                  >
                    <UpdateBlockRenderer
                      block={block}
                      language={language}
                      theme={theme}
                      videoRes={videoRes}
                      setVideoRes={setVideoRes}
                      audioFilterActive={audioFilterActive}
                      setAudioFilterActive={setAudioFilterActive}
                      noiseReductionFactor={noiseReductionFactor}
                      setNoiseReductionFactor={setNoiseReductionFactor}
                      quantumKeys={quantumKeys}
                      isRotatingKeys={isRotatingKeys}
                      handleRotateKeys={handleRotateKeys}
                      activeLogList={activeLogList}
                      typewriterIdx={typewriterIdx}
                      setTypewriterIdx={setTypewriterIdx}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Sandbox interactive bottom code console bar */}
              <div className="p-5 border-t border-white/5 bg-black/[0.2] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-xs">
                  <Cpu className="w-4.5 h-4.5 text-purple-400 animate-pulse shrink-0" />
                  <span className={`font-light text-left ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {language === 'ru' 
                      ? 'Протестируйте другие возможности прямо сейчас в панели.' 
                      : 'These interactive modules act directly within your current client sandbox.'}
                  </span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const downloadSection = document.getElementById('download');
                      if (downloadSection) {
                        setShowUpdatesModal(false);
                        setTimeout(() => {
                          downloadSection.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }}
                    className="cursor-pointer flex-1 sm:flex-initial py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                  >
                    <Download className="w-3.5 h-3.5 animate-bounce" />
                    <span>{language === 'ru' ? 'Скачать клиент' : 'Download Client'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Immersive technical details grid - bento cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className={`p-6 border rounded-[32px] space-y-3 relative overflow-hidden text-left ${
                theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#080812]/50 border-white/5'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Network className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold tracking-tight">
                  {language === 'ru' ? 'Новые Серверные Узлы P2P' : 'Global Low Latency Relays'}
                </h4>
                <p className={`text-xs leading-relaxed font-light ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {language === 'ru'
                    ? 'Мы развернули 14 дополнительных Edge-узлов в Лондоне, Франкфурте, Токио и Сингапуре. Новое динамическое P2P-туннелирование автоматически переключает сетевые потоки в обход загруженных маршрутов, доводя пинг до рекордного минимума.'
                    : 'Deployed 14 ultra-fast global relays inside strategic zones. Tunnels adjust on-the-fly, directing signal waves using intelligent hops to completely avoid centralized pipeline jams and guarantee perfect audio streams.'}
                </p>
              </div>

              <div className={`p-6 border rounded-[32px] space-y-3 relative overflow-hidden text-left ${
                theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#080812]/50 border-white/5'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold tracking-tight">
                  {language === 'ru' ? 'Безопасность Песочницы' : 'Isolative Host Protections'}
                </h4>
                <p className={`text-xs leading-relaxed font-light ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {language === 'ru'
                    ? 'Клиентское приложение полностью изолирует аудио- и видео-драйверы операционной системы в независимом контейнере памяти. Это гарантирует, что шпионское ПО или сторонние утилиты не смогут перехватить трафик во время звонков.'
                    : 'Your host hardware peripherals remain secured under strict isolative containers. Operating system microphones and webcams are requested through encapsulated sandbox layers preventing malicious hook captures.'}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Global Back to Main Button placed prominently at the bottom for great UX */}
        <div className="pt-10 flex justify-center border-t border-purple-500/10">
          <button
            onClick={() => {
              setShowUpdatesModal(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer group py-3.5 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm transition-all duration-300 active:scale-95 flex items-center gap-2.5 shadow-xl shadow-purple-600/30"
          >
            <ArrowLeft className="w-4.5 h-4.5 transition-transform group-hover:-translate-x-1" />
            <span>{language === 'ru' ? 'Вернуться назад на главную' : 'Go Back to Main Page'}</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
}
