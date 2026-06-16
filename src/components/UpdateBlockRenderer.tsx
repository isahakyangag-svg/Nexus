import { motion } from 'motion/react';
import { 
  Sparkles, Layers, Video, Headphones, Shield, Lock, 
  Terminal, RefreshCw, Play, Cpu, ShieldCheck
} from 'lucide-react';
import { UpdateBlock } from '../context/AdminState';

interface UpdateBlockRendererProps {
  block: UpdateBlock;
  language: 'ru' | 'en';
  theme: 'light' | 'dark';
  videoRes: '720p' | '1080p' | '4k' | '8k';
  setVideoRes: (res: '720p' | '1080p' | '4k' | '8k') => void;
  audioFilterActive: boolean;
  setAudioFilterActive: (active: boolean) => void;
  noiseReductionFactor: number;
  setNoiseReductionFactor: (factor: number) => void;
  quantumKeys: { publicKey: string; privateKey: string; nodeName: string };
  isRotatingKeys: boolean;
  handleRotateKeys: () => void;
  activeLogList: string[];
  typewriterIdx: number;
  setTypewriterIdx: (idx: number) => void;
}

export default function UpdateBlockRenderer({
  block,
  language,
  theme,
  videoRes,
  setVideoRes,
  audioFilterActive,
  setAudioFilterActive,
  noiseReductionFactor,
  setNoiseReductionFactor,
  quantumKeys,
  isRotatingKeys,
  handleRotateKeys,
  activeLogList,
  typewriterIdx,
  setTypewriterIdx
}: UpdateBlockRendererProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT/TOP: Interactive / media display of the block */}
        <div className="lg:w-[50%] shrink-0">
          {block.mediaType === 'video_simulator' && (
            <div className="h-52 rounded-2xl border border-white/10 bg-[#030306] relative overflow-hidden flex flex-col font-mono text-left shadow-2xl group w-full">
              {/* Windows controls panel mockup */}
              <div className="h-5 bg-[#080810] border-b border-white/5 px-3 flex items-center justify-between text-[8px] text-slate-500">
                <span className="text-purple-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                  nexus_node_relay.ts
                </span>
                <span>{videoRes === '720p' ? '0.8 Mbps' : videoRes === '1080p' ? '3.5 Mbps' : videoRes === '4k' ? '12.4 Mbps' : '38.0 Mbps'}</span>
              </div>

              {/* Rendering Canvas with conditional blur simulating different resolutions */}
              <div className={`flex-1 grid grid-cols-12 gap-1.5 p-1.5 min-h-0 overflow-hidden transition-all duration-300 ${
                videoRes === '720p' ? 'blur-[1.2px] contrast-[0.9]' : videoRes === '1080p' ? 'blur-[0.5px]' : ''
              }`}>
                {/* Live compilation Code panel */}
                <div className="col-span-7 bg-[#06060c]/90 border border-white/5 rounded-lg p-2 flex flex-col justify-between overflow-hidden relative">
                  <span className="text-[6px] text-slate-500 uppercase font-bold tracking-widest border-b border-white/5 pb-0.5">Stream Source Code</span>
                  <pre className="text-[6.5px] text-purple-300 overflow-hidden leading-tight whitespace-pre select-none py-1 mb-1 font-mono">
                    {`// Initialize Nexus Video
import { AV1Engine } from '@nexus/video';
await AV1Engine.startStream({
  resolution: "8K_ULTRA",
  framerate: 144
});`.slice(0, typewriterIdx)}
                    <span className="w-1 h-3 bg-purple-400 inline-block animate-pulse ml-0.5" />
                  </pre>
                </div>

                {/* Connection Orb visualizer panel */}
                <div className="col-span-5 flex flex-col gap-1.5 min-h-0">
                  <div className="h-[45%] bg-[#080810]/90 border border-white/5 rounded-lg p-1.5 flex items-center justify-center relative overflow-hidden bg-radial from-purple-950/20 to-transparent">
                    {videoRes === '720p' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="w-8 h-8 rounded-full border border-dashed border-red-500/30 animate-spin flex items-center justify-center" />
                        <span className="text-[6px] text-red-400 font-extrabold mt-1">720P (LOW BITRATE)</span>
                      </div>
                    )}
                    {videoRes === '1080p' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-full border border-dashed border-sky-400/30 animate-pulse flex items-center justify-center" />
                        <span className="text-[6px] text-sky-400 font-extrabold mt-1">1080P HD (REGULAR)</span>
                      </div>
                    )}
                    {videoRes === '4k' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping" />
                          <div className="absolute w-9 h-9 rounded-full border border-dashed border-purple-500/50 animate-spin" />
                        </div>
                        <span className="text-[6px] text-purple-300 font-extrabold mt-1">4K UHD COMPACT</span>
                      </div>
                    )}
                    {videoRes === '8k' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="relative w-14 h-14 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border border-pink-500/30 animate-spin" />
                          <div className="absolute w-10 h-10 rounded-full border border-dashed border-cyan-400/50 animate-spin" style={{ animationDirection: 'reverse' }} />
                          <span className="text-[6.5px] text-purple-300 font-black z-10 animate-pulse tracking-wide">8K DUAL</span>
                        </div>
                        <span className="text-[6px] text-cyan-400 font-black mt-1">8K ULTRA Broadcast</span>
                      </div>
                    )}
                  </div>

                  {/* Mini Logs view */}
                  <div className="h-[55%] bg-black/90 border border-white/5 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden">
                    <span className="text-[5.5px] text-slate-500 font-mono tracking-widest block font-bold">Relay Signal Logs</span>
                    <div className="flex-1 font-mono text-[5.5px] text-emerald-400 leading-tight flex flex-col gap-0.5 select-none text-left mt-1 overflow-hidden">
                      {activeLogList.slice(0, 3).map((log, pidx) => (
                        <div key={pidx} className="truncate select-none opacity-80 leading-normal">
                          &gt; {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsive resolution caption */}
              <div className="absolute bottom-2 left-2 bg-black/90 border border-white/10 px-2.5 py-1 rounded text-[6.5px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                {videoRes === '720p' && '1280 x 720 @ 30 FPS • 0.8Mbps'}
                {videoRes === '1080p' && '1920 x 1080 @ 60 FPS • 3.5Mbps'}
                {videoRes === '4k' && '3840 x 2160 @ 120 FPS • 12.4Mbps'}
                {videoRes === '8k' && '7680 x 4320 @ 144 FPS • 38.0Mbps'}
              </div>
            </div>
          )}

          {block.mediaType === 'audio_simulator' && (
            <div className="h-52 rounded-2xl border border-white/10 bg-[#030306] relative overflow-hidden flex flex-col items-center justify-between p-4 shrink-0 w-full">
              <div className="w-full flex justify-between items-center text-[8px] font-mono text-slate-500 font-bold">
                <span>NEXUS HARMONICS DE-NOISER</span>
                <span className={audioFilterActive ? 'text-cyan-400 animate-pulse' : 'text-rose-400'}>
                  {audioFilterActive ? 'AI PROCESSOR: LIVE ISOLATION' : 'RAW BYPASS (UNFILTERED)'}
                </span>
              </div>

              {/* Dynamic sinus waves path */}
              <div className="w-full flex-1 flex items-center justify-center relative py-6">
                <svg className="w-full h-20" viewBox="0 0 200 60">
                  {audioFilterActive ? (
                    <>
                      <path
                        d="M0 30 C 15 11, 35 15, 60 30 C 85 45, 115 15, 140 30 C 165 45, 185 15, 200 30"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <animate attributeName="d" dur="3s" repeatCount="indefinite"
                          values="
                            M0 30 C 15 42, 35 15, 60 30 C 85 45, 115 15, 140 30 C 165 45, 185 15, 200 30;
                            M0 30 C 15 18, 35 45, 60 30 C 85 15, 115 45, 140 30 C 165 15, 185 45, 200 30;
                            M0 30 C 15 42, 35 15, 60 30 C 85 45, 115 15, 140 30 C 165 45, 185 15, 200 30
                          "
                        />
                      </path>
                      <path
                        d="M0 30 Q 25 45 50 30 T 100 30 T 150 30 T 200 30"
                        fill="none"
                        stroke="#d946ef"
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.5"
                      >
                        <animate attributeName="d" dur="6s" repeatCount="indefinite"
                          values="
                            M0 30 Q 25 45 50 30 T 100 30 T 150 30 T 200 30;
                            M0 30 Q 25 15 50 30 T 100 30 T 150 30 T 200 30;
                            M0 30 Q 25 45 50 30 T 100 30 T 150 30 T 200 30
                          "
                        />
                      </path>
                    </>
                  ) : (
                    <path
                      d="M0 30 L10 5 L20 55 L30 18 L40 45 L50 15 L60 52 L70 12 L80 48 L90 22 L100 38 L110 5 L120 54 L130 18 L140 45 L150 15 L160 55 L170 25 L180 43 L190 12 L200 30"
                      fill="none"
                      stroke="#f87171"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <animate attributeName="d" dur="0.9s" repeatCount="indefinite"
                        values="
                          M0 30 L10 5 L20 55 L30 18 L40 45 L50 15 L60 52 L70 12 L80 48 L90 22 L100 38 L110 5 L120 54 L130 18 L140 45 L150 15 L160 55 L170 25 L180 43 L190 12 L200 30;
                          M0 30 L10 40 L20 12 L30 48 L40 18 L50 54 L60 10 L70 42 L80 15 L90 50 L100 24 L110 45 L120 15 L130 52 L140 22 L150 48 L160 10 L170 52 L180 18 L190 40 L200 30;
                          M0 30 L10 5 L20 55 L30 18 L40 45 L50 15 L60 52 L70 12 L80 48 L90 22 L100 38 L110 5 L120 54 L130 18 L140 45 L150 15 L160 55 L170 25 L180 43 L190 12 L200 30
                        "
                      />
                    </path>
                  )}
                </svg>
              </div>

              <div className="w-full flex justify-between items-center text-[8px] font-mono text-slate-500">
                <span>{audioFilterActive ? `${noiseReductionFactor}% NOISE ATTENUATION` : '0% BYPASS MUTED'}</span>
                <span className={audioFilterActive ? 'text-cyan-400 font-extrabold' : 'text-slate-500'}>
                  {audioFilterActive ? 'SIGNAL SECURED' : 'LOW QUALITY STREAM'}
                </span>
              </div>
            </div>
          )}

          {block.mediaType === 'crypto_simulator' && (
            <div className="h-52 rounded-2xl border border-white/10 bg-[#030306] p-4 shrink-0 flex flex-col justify-between text-left w-full">
              <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wider block font-bold leading-none">
                {language === 'ru' ? 'ПОСТКВАНТОВАЯ РОТАЦИЯ КЛЮЧЕЙ' : 'POST-QUANTUM END-TO-END ROTATOR'}
              </span>

              {/* Visual graph connecting servers */}
              <div className="flex-1 flex items-center justify-between relative px-4 py-2">
                <svg className="absolute inset-0 w-full h-full animate-pulse" xmlns="http://www.w3.org/2000/svg">
                  <line x1="45" y1="35" x2="155" y2="35" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
                    <animate attributeName="stroke-dashoffset" from="30" to="1" dur="2s" repeatCount="indefinite" />
                  </line>
                </svg>

                <div className="text-center z-10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/15 border border-purple-500/50 flex flex-col items-center justify-center text-[10px] font-mono font-black text-purple-300">
                    N-A
                  </div>
                  <span className="text-[6px] font-mono text-slate-500 mt-1 uppercase">Local Sandbox</span>
                </div>

                <div className="text-center z-10 flex flex-col items-center relative">
                  <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 shadow-xl ${
                    isRotatingKeys
                      ? 'bg-purple-600/20 border-purple-500 animate-spin'
                      : 'bg-emerald-500/10 border-emerald-500 animate-pulse'
                  }`}>
                    {isRotatingKeys ? (
                      <RefreshCw className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-[6px] font-mono text-emerald-400 font-extrabold mt-1.5 uppercase tracking-widest text-[7px]">
                    {isRotatingKeys ? 'ROTATING...' : 'TUNNEL SECURE'}
                  </span>
                </div>

                <div className="text-center z-10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/15 border border-purple-500/50 flex flex-col items-center justify-center text-[10px] font-mono font-black text-purple-300">
                    N-B
                  </div>
                  <span className="text-[6px] font-mono text-slate-500 mt-1 uppercase">Tunnel Link</span>
                </div>
              </div>

              {/* Interactive dynamic key strings */}
              <div className="bg-black/60 border border-white/5 rounded-xl p-2 font-mono text-[6.5px] space-y-1 mt-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">PUBLIC NODE KEY:</span>
                  <span className="text-purple-300 font-bold font-mono">{quantumKeys.publicKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">TUNNEL ROUTING:</span>
                  <span className="text-cyan-400 font-bold font-mono">{quantumKeys.nodeName}</span>
                </div>
              </div>
            </div>
          )}

          {block.mediaType === 'image' && (
            <div className="h-52 rounded-2xl border border-white/10 bg-[#030306] overflow-hidden relative flex items-center justify-center w-full shadow-lg group">
              {block.mediaUrl ? (
                <img 
                  src={block.mediaUrl} 
                  alt={language === 'ru' ? block.titleRu : block.titleEn} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-6 space-y-2 select-none">
                  <Sparkles className="w-10 h-10 text-purple-400 mx-auto animate-pulse" />
                  <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">Visual Backdrop Placeholder</p>
                  <p className="text-[9px] text-slate-500 leading-normal">Configure a custom background photo path inside the admin tab.</p>
                </div>
              )}
            </div>
          )}

          {block.mediaType === 'video_url' && (
            <div className="h-52 rounded-2xl border border-white/10 bg-[#030306] overflow-hidden relative flex items-center justify-center w-full shadow-lg">
              {block.mediaUrl ? (
                <video 
                  src={block.mediaUrl} 
                  controls 
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 space-y-2 select-none">
                  <Play className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
                  <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">Video Frame Placeholder</p>
                  <p className="text-[9px] text-slate-500 leading-normal">Enter any direct MP4 link in the updates manager category.</p>
                </div>
              )}
            </div>
          )}

          {block.mediaType === 'code' && (
            <div className="h-52 rounded-2xl border border-white/10 bg-[#030306] overflow-hidden relative flex flex-col font-mono text-xs text-left shadow-2xl w-full">
              <div className="h-5 bg-[#080810] border-b border-white/5 px-3 flex items-center justify-between text-[8px] text-slate-500 select-none">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5 uppercase tracking-widest">code_sandbox</span>
                <span>UTF-8 Script</span>
              </div>
              <pre className="flex-1 p-4 overflow-y-auto leading-relaxed text-[10px] text-purple-300 font-mono scrollbar-thin scrollbar-thumb-white/10">
                {block.codeTemplate || '// Put any script details inside the Updates Admin panel editor.'}
              </pre>
            </div>
          )}

          {block.mediaType === 'all_summary' && (
            <div className="h-52 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c20] via-[#04040a] to-[#010103] relative overflow-hidden flex flex-col justify-between p-6 w-full shadow-xl">
              <div className="flex justify-between items-start">
                <div className="space-y-1 text-left">
                  <span className="text-[9px] font-mono font-bold text-pink-400 tracking-widest uppercase">NEXUS MULTI-ENGINE INTEGRATION</span>
                  <h4 className="text-sm font-black text-white">Full Stack Core</h4>
                </div>
                <ShieldCheck className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">AV1 CODEC MODE</span>
                  <span className="text-[11px] font-thin text-slate-300">8K Broadcast Link</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">CRYSTAL VOICE AI</span>
                  <span className="text-[11px] font-thin text-slate-300">Active Harmonizer</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">POST-QUANTUM CRYPTO</span>
                  <span className="text-[11px] font-thin text-slate-300">Kyber-1024 Ratchet</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">PEER ROUTING LEVEL</span>
                  <span className="text-[11px] font-thin text-emerald-400">100% P2P E2E OK</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Text content area */}
        <div className="flex-1 flex flex-col justify-between text-left space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest block font-mono">
              {language === 'ru' ? (block.tagRu || 'ОБНОВЛЕНИЕ') : (block.tagEn || 'PATCH MODULE')}
            </span>
            <h4 className="text-lg font-bold tracking-tight">
              {language === 'ru' ? block.detailTitleRu : block.detailTitleEn}
            </h4>
            <p className={`text-xs sm:text-[13px] leading-relaxed font-light ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              {language === 'ru' ? block.detailDescRu : block.detailDescEn}
            </p>
          </div>

          {/* Render custom modifiers bottom bars or selectors to keep high-interactivity */}
          {block.mediaType === 'video_simulator' && (
            <div className="pt-3 border-t border-purple-500/10">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold font-mono">
                {language === 'ru' ? 'Выберите качество для симуляции:' : 'Select dynamic bitrate for simulator:'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(['720p', '1080p', '4k', '8k'] as any[]).map((res) => (
                  <button
                    key={res}
                    onClick={() => {
                      setVideoRes(res);
                      setTypewriterIdx(0);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 ${
                      videoRes === res
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : theme === 'light'
                          ? 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                          : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {res === '8k' ? '8K ULTRA (NEW)' : res.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {block.mediaType === 'audio_simulator' && (
            <div className="p-4 rounded-2xl bg-black/[0.15] border border-white/5 space-y-3 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest font-mono">
                  {language === 'ru' ? 'Включить AI-Подавитель задержки:' : 'Enable Noise Suppression Gate:'}
                </span>
                <button
                  onClick={() => setAudioFilterActive(!audioFilterActive)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-all outline-none cursor-pointer border ${
                    audioFilterActive ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-700 border-slate-600'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-all shadow-md transform ${
                    audioFilterActive ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {audioFilterActive && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-450 font-mono">
                    <span>{language === 'ru' ? 'Сила подавления шума:' : 'Suppression Strength:'}</span>
                    <span className="font-extrabold text-cyan-400">{noiseReductionFactor}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={50} 
                    max={100} 
                    value={noiseReductionFactor}
                    onChange={(e) => setNoiseReductionFactor(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                  />
                </div>
              )}
            </div>
          )}

          {block.mediaType === 'crypto_simulator' && (
            <div className="pt-2">
              <button
                onClick={handleRotateKeys}
                disabled={isRotatingKeys}
                className={`cursor-pointer inline-flex items-center justify-center gap-2.5 py-3 px-6 rounded-2xl text-xs font-bold text-white transition-all bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md ${
                  isRotatingKeys ? 'opacity-65 cursor-not-allowed' : 'active:scale-95'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isRotatingKeys ? 'animate-spin' : ''}`} />
                <span>
                  {isRotatingKeys
                    ? (language === 'ru' ? 'Вычисляем Новые Ключи...' : 'Re-computing Kyber-1024 keys...')
                    : (language === 'ru' ? 'Сгенерировать Ключи Заново' : 'Rotate Quantum Shield Keys Now')}
                </span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
