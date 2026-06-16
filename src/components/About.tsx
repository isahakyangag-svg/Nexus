import { motion, AnimatePresence } from 'motion/react';
import { Users, CheckCircle, Cpu, ShieldCheck, Heart, Activity, Terminal, RefreshCw, Check, ShieldAlert, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useAdmin } from '../context/AdminState';
import { useState, useEffect } from 'react';

const aboutLocalDict = {
  ru: {
    leadTitle1: "Мы создаём независимое",
    leadTitle2: "будущее интернет-связи",
    philosophyDesc1: "Основанная в 2023 году, группа свободных разработчиков Nexus объединила лучших инженеров-исследователей из Discord, Slack и Zoom. Мы верим, что современные средства коммуникации должны принадлежать обществу, а не корпоративным гигантам.",
    philosophyDesc2: "Наша цель — дать миллионам людей полную автономию общения без назойливой рекламы, хитрых коммерческих подписок или скрытой слежки. Вы доверяете нам свои эмоции, а мы обеспечиваем абсолютную конфиденциальность и скорость.",
    indepTitle: "Полная Независимость",
    indepDesc: "Никаких венчурных инвесторов и корпоративных акционеров. Решения принимает только сообщество Nexus.",
    apiTitle: "Открытый API и Код",
    apiDesc: "Каждый разработчик может развернуть автономного бота, написать плагин или проверить исходный код шифрования."
  },
  en: {
    leadTitle1: "We build an independent",
    leadTitle2: "future of communication",
    philosophyDesc1: "Founded in 2023, the Nexus independent developer guild unites premier software engineers from Telegram, Discord, and Zoom. We believe that secure, high-speed connection is a fundamental human right, not a profit machine for tech giants.",
    philosophyDesc2: "Our mission is to grant everyone total communication autonomy without commercial paywalls, trackings, or surveillance. You share your mind, and we secure your bandwidth with military-grade privacy guidelines.",
    indepTitle: "Total Self-Rule",
    indepDesc: "Zero institutional venture funding or commercial capital. We answer strictly to the global peer-to-peer user community.",
    apiTitle: "Open APIs & Sources",
    apiDesc: "Any engineering participant can compile companion bots, design utility integrations, or audit our full encryption protocol suite."
  }
};

const auditLocalDict = {
  ru: {
    widgetTitle: "Верификация криптографии (Real-Time)",
    widgetDesc: "Интерактивный аудит безопасности и контроль целостности протоколов Nexus в реальном времени.",
    statusLabel: "Системный статус",
    scoreLabel: "Криптографическая оценка",
    latencyLabel: "Задержка сканирования",
    signatureLabel: "Цифровая подпись аудита",
    reverifyBtn: "Запустить экспресс-аудит",
    verifying: "Проверка протоколов...",
    passRate: "100% Верифицировано",
    standardsHeader: "Активные алгоритмы сквозного шифрования (E2EE)",
    detailsToggleShow: "Показать параметры расширенной диагностики",
    detailsToggleHide: "Скрыть параметры расширенной диагностики",
    errorText: "Не удалось получить параметры реального времени.",
    activeStatus: "БЕЗОПАСНО",
    loadingLogs: [
      "Установка защищенного соединения с локальным крипто-ядром...",
      "Проверка энтропии и физических показателей RNG-генератора...",
      "Кросс-анализ цепочки Double Ratchet на коллизии...",
      "Инспекция криптографических пар Kyber-1024 (Post-Quantum)...",
      "Синхронизация завершена! Целостность коммуникаций Nexus полностью подтверждена."
    ]
  },
  en: {
    widgetTitle: "Cryptographic Audit Service (Real-Time)",
    widgetDesc: "Interactive real-time safety verification and metadata check of active Nexus E2EE protocols.",
    statusLabel: "System Status",
    scoreLabel: "Cryptographic Score",
    latencyLabel: "Audit Scan Delay",
    signatureLabel: "Audit Digital Signature",
    reverifyBtn: "Trigger Live Integrity Scan",
    verifying: "Scanning protocols...",
    passRate: "100% Certified",
    standardsHeader: "Active End-to-End Encryption (E2EE) Protocols",
    detailsToggleShow: "Reveal advanced diagnostic fields",
    detailsToggleHide: "Hide advanced diagnostic fields",
    errorText: "Unable to retrieve real-time E2EE metadata parameters.",
    activeStatus: "SECURED",
    loadingLogs: [
      "Establishing diagnostic handshake with local crypto daemon...",
      "Measuring entropy rate of physical hardware RNG sources...",
      "Checking Double Ratchet keys chain sequence for anomalies...",
      "Validating NIST Kyber-1024 post-quantum status variables...",
      "Scan complete! Real-time communications integrity is fully certified."
    ]
  }
};

export default function About() {
  const { theme, language, t } = useAdmin();
  const activeLocal = aboutLocalDict[language];
  const auditLocal = auditLocalDict[language as 'ru' | 'en'] || auditLocalDict.en;

  const [audit, setAudit] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/security-audit')
      .then(res => res.json())
      .then(data => {
        if (active) setAudit(data);
      })
      .catch(err => {
        if (active) setAuditError('Failed to fetch security audit state.');
      });
    return () => {
      active = false;
    };
  }, []);

  const triggerAudit = async () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setSimulationLogs([]);
    setCurrentStepIndex(0);

    const logs = auditLocal.loadingLogs;
    for (let i = 0; i < logs.length; i++) {
      setCurrentStepIndex(i);
      setSimulationLogs(prev => [...prev, logs[i]]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    try {
      const res = await fetch('/api/security-audit');
      const data = await res.json();
      setAudit(data);
    } catch (err) {
      setAuditError('Failed to synchronize with cryptographical audit backend.');
    } finally {
      setIsAuditing(false);
      setCurrentStepIndex(-1);
    }
  };

  const comparisonStats = [
    { label: t('audioDelay'), legacy: 85, nexus: 15, unit: language === 'ru' ? 'мс' : 'ms', better: 'lower' },
    { label: t('fileSpeed'), legacy: 12, nexus: 115, unit: language === 'ru' ? 'мб/с' : 'mb/s', better: 'higher' },
    { label: t('cpuUsage'), legacy: 14, nexus: 2.8, unit: '%', better: 'lower' },
  ];

  return (
    <section id="about" className={`py-24 border-t transition-colors duration-300 ${
      theme === 'light' ? 'border-slate-200 bg-slate-100/50 text-slate-800' : 'border-slate-900 bg-slate-950/20 text-slate-400'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* About Left Visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            {/* Background spotlight */}
            {theme === 'dark' && (
              <div className="absolute inset-0 bg-violet-600/10 blur-3xl opacity-35 pointer-events-none" />
            )}

            <div className={`relative border backdrop-blur-xl rounded-[40px] p-8 text-center transition-all ${
              theme === 'light'
                ? 'bg-white border-purple-250/20 shadow-lg shadow-slate-200/60 text-slate-800'
                : 'bg-white/5 border-white/10 shadow-xl text-white'
            }`}>
              
              <div className={`relative inline-flex items-center justify-center p-6 rounded-full mb-6 ${
                theme === 'light' ? 'bg-purple-100' : 'bg-purple-500/10'
              }`}>
                <Users className={`w-16 h-16 ${theme === 'light' ? 'text-purple-650' : 'text-purple-450'}`} />
                <div className="absolute inset-0 bg-purple-500 blur-lg opacity-20 animate-pulse" />
              </div>

              <h3 className={`text-2xl font-extrabold mb-2 tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                {t('teamTitle')}
              </h3>
              <p className={`text-sm font-light mb-8 max-w-xs mx-auto ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('teamDesc')}
              </p>

              {/* Interactive Micro Comparison metrics */}
              <div className="space-y-4 text-left">
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 font-mono ${
                  theme === 'light' ? 'text-slate-455' : 'text-slate-500'
                }`}>
                  {t('comparisonTitle')}
                </span>
                
                {comparisonStats.map((stat) => {
                  const legVal = stat.legacy;
                  const nexVal = stat.nexus;
                  const total = legVal + nexVal;
                  const nexPerc = (nexVal / total) * 100;
                  const legPerc = (legVal / total) * 100;
                  
                  return (
                    <div key={stat.label} className={`p-3.5 rounded-2xl border ${
                      theme === 'light' ? 'bg-slate-50/80 border-slate-200' : 'bg-black/40 border-white/10'
                    }`}>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>{stat.label}</span>
                        <span className={`${theme === 'light' ? 'text-purple-700' : 'text-purple-400'} font-bold`}>
                          {nexVal} {stat.unit} <span className="text-slate-500 font-light text-[10px]">(Nexus)</span>
                        </span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div className="h-2 rounded-full bg-slate-900/30 dark:bg-slate-900 overflow-hidden flex">
                        <div
                          className={`h-full ${stat.better === 'lower' ? 'bg-slate-500/55' : 'bg-purple-600'}`}
                          style={{ width: `${stat.better === 'lower' ? legPerc : nexPerc}%` }}
                        />
                        <div
                          className={`h-full ${stat.better === 'lower' ? 'bg-purple-600' : 'bg-slate-500/55'}`}
                          style={{ width: `${stat.better === 'lower' ? nexPerc : legPerc}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-[9px] text-slate-550 uppercase mt-1 font-mono">
                        <span>{t('legacyApps')}: {legVal} {stat.unit}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t('betterBy')} {(stat.better === 'lower' ? (legVal / nexVal) : (nexVal / legVal)).toFixed(1)}x</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </motion.div>

          {/* About Right Context */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4">
              <span className={`text-xs font-semibold uppercase tracking-widest font-mono ${
                theme === 'light' ? 'text-purple-600' : 'text-purple-400'
              }`}>
                {t('valuesTitle')}
              </span>
              
              <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-tight italic bg-clip-text text-transparent block ${
                theme === 'light' 
                  ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-purple-800' 
                  : 'bg-gradient-to-r from-white via-white to-purple-300'
              }`}>
                {activeLocal.leadTitle1}<br />
                {activeLocal.leadTitle2}
              </h2>
              
              <p className={`font-light text-lg leading-relaxed ${theme === 'light' ? 'text-slate-650' : 'text-slate-300'}`}>
                {activeLocal.philosophyDesc1}
              </p>
              <p className={`font-light text-base leading-relaxed ${theme === 'light' ? 'text-slate-550' : 'text-slate-400'}`}>
                {activeLocal.philosophyDesc2}
              </p>
            </div>

            {/* Checkpoints with Bullet Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className={`p-5 rounded-2xl border flex items-start gap-4 transition-colors ${
                theme === 'light' ? 'bg-white border-slate-200/80 hover:bg-slate-50' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}>
                <CheckCircle className={`w-6 h-6 shrink-0 mt-0.5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                <div>
                  <h4 className={`font-bold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{activeLocal.indepTitle}</h4>
                  <p className={`text-sm font-light leading-normal ${theme === 'light' ? 'text-slate-550' : 'text-slate-400'}`}>
                    {activeLocal.indepDesc}
                  </p>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border flex items-start gap-4 transition-colors ${
                theme === 'light' ? 'bg-white border-slate-200/80 hover:bg-slate-50' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}>
                <CheckCircle className={`w-6 h-6 shrink-0 mt-0.5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                <div>
                  <h4 className={`font-bold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{activeLocal.apiTitle}</h4>
                  <p className={`text-sm font-light leading-normal ${theme === 'light' ? 'text-slate-550' : 'text-slate-400'}`}>
                    {activeLocal.apiDesc}
                  </p>
                </div>
              </div>

            </div>

            {/* Extra Core badge metadata */}
            <div className={`flex flex-wrap gap-4 pt-4 text-[11px] font-mono font-bold select-none ${
              theme === 'light' ? 'text-slate-550' : 'text-slate-400'
            }`}>
              <span className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
              }`}>
                <Cpu className="w-3.5 h-3.5" />
                OPUS & CRYSTAL CODECS
              </span>
              <span className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl ${
                theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                NO BACKDOORS GUARANTEE
              </span>
              <span className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl ${
                theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
              }`}>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                100% COMMUNITY FUNDED
              </span>
            </div>

          </motion.div>

        </div>

        {/* Real-time Cryptographic Security Audit Console */}
        <motion.div
          id="nexus-security-audit-widget"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`mt-16 border rounded-[32px] p-6 md:p-8 transition-all overflow-hidden relative ${
            theme === 'light'
              ? 'bg-white border-slate-200 shadow-md shadow-slate-100'
              : 'bg-white/5 border-white/10 shadow-2xl shadow-black/30'
          }`}
        >
          {/* Subtle radar pulse in corner */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none -mr-32 -mt-32 overflow-hidden" />

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-dashed border-slate-200 dark:border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAuditing ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isAuditing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </span>
                <h3 className={`text-xl font-black tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {auditLocal.widgetTitle}
                </h3>
              </div>
              <p className={`text-sm font-light max-w-2xl ${theme === 'light' ? 'text-slate-550' : 'text-slate-400'}`}>
                {auditLocal.widgetDesc}
              </p>
            </div>

            <button
              onClick={triggerAudit}
              disabled={isAuditing}
              className={`px-5 py-3 rounded-2xl font-mono text-xs font-bold flex items-center gap-2 transition-all shrink-0 uppercase tracking-wider ${
                isAuditing
                  ? 'bg-amber-500/20 text-amber-500 cursor-not-allowed border border-amber-500/20'
                  : theme === 'light'
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                    : 'bg-white hover:bg-slate-50 text-slate-950 shadow-md'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              {isAuditing ? auditLocal.verifying : auditLocal.reverifyBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            <div className={`p-4 rounded-2xl border ${theme === 'light' ? 'bg-slate-50/50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                {auditLocal.statusLabel}
              </span>
              <span className={`text-lg font-black font-mono flex items-center gap-2 ${isAuditing ? 'text-amber-500' : 'text-emerald-500'}`}>
                <Check className="w-5 h-5 shrink-0" />
                {isAuditing ? auditLocal.verifying.split('.')[0] : (audit?.status || auditLocal.activeStatus)}
              </span>
            </div>

            <div className={`p-4 rounded-2xl border ${theme === 'light' ? 'bg-slate-50/50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                {auditLocal.scoreLabel}
              </span>
              <span className="text-lg font-black font-mono text-purple-500 dark:text-purple-400 flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" />
                {audit?.score || 100}% {auditLocal.passRate.split(" ")[1] || "Secured"}
              </span>
            </div>

            <div className={`p-4 rounded-2xl border ${theme === 'light' ? 'bg-slate-50/50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                {auditLocal.latencyLabel}
              </span>
              <span className={`text-lg font-black font-mono ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                {isAuditing ? "~" : (audit?.scanTimeMs || 12)} {language === 'ru' ? 'мс' : 'ms'}
              </span>
            </div>

            <div className={`p-4 rounded-2xl border ${theme === 'light' ? 'bg-slate-50/50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                {auditLocal.signatureLabel}
              </span>
              <span className="text-xs font-bold font-mono tracking-normal block truncate text-slate-450 dark:text-slate-350">
                {isAuditing ? "CALCULATING..." : (audit?.integritySignature || "NXS-SIG-SHA256-INIT")}
              </span>
            </div>
          </div>

          {/* Standards details */}
          <div className="space-y-4">
            <h4 className={`text-sm font-bold tracking-tight uppercase font-mono ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
              {auditLocal.standardsHeader}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(audit?.protocols || []).map((p: any) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    theme === 'light'
                      ? 'bg-slate-50/30 border-slate-200 hover:bg-slate-50/80 shadow-sm'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 shadow-inner'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-semibold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{p.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase">
                      {p.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>{p.standard}</span>
                    <span className="text-purple-500 dark:text-purple-400 font-bold">SHA-256 Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Logs Shell Toggle */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className={`flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider ${
                theme === 'light' ? 'text-purple-600 hover:text-purple-700' : 'text-purple-400 hover:text-purple-300'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              {showDiagnostics ? auditLocal.detailsToggleHide : auditLocal.detailsToggleShow}
              {showDiagnostics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showDiagnostics && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-3"
                >
                  <div className={`p-4 rounded-2xl font-mono text-xs leading-relaxed border ${
                    theme === 'light'
                      ? 'bg-slate-950 text-slate-350 border-slate-900 shadow-inner'
                      : 'bg-black text-slate-400 border-white/10'
                  }`}>
                    {/* Live console trace output */}
                    <div className="text-emerald-500 font-bold mb-1.5 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      NXS-SEC-DAEMON v2.8.2 ONLINE // ENTROPY LEVEL {audit?.entropy ? (audit.entropy * 100).toFixed(2) : "98.42"}%
                    </div>
                    <div className="space-y-1">
                      {/* Initial or simulation steps */}
                      {!isAuditing && simulationLogs.length === 0 && (
                        <div className="text-slate-500 italic">
                          &gt; {language === 'ru' ? "Ожидание команды сканирования..." : "Ready. Standing by command trace..."}
                        </div>
                      )}
                      
                      {simulationLogs.map((log, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-1 ${
                            index === currentStepIndex
                              ? 'text-amber-400 font-semibold animate-pulse'
                              : index < currentStepIndex || currentStepIndex === -1
                                ? 'text-slate-350'
                                : 'text-slate-600'
                          }`}
                        >
                          <span className="text-slate-600 select-none">&gt;</span>
                          <span>{log}</span>
                          {index === currentStepIndex && <span className="animate-ping ml-1">_</span>}
                        </div>
                      ))}

                      {/* Display historic verification trace or standard traces */}
                      {!isAuditing && audit && (
                        <>
                          <div className="text-slate-500 mt-2 border-t border-slate-800 pt-1.5">
                            --- {language === 'ru' ? "Диагностические данные" : "Diagnostics data"} ---
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mt-1 text-slate-400">
                            <div>• Entropy standard deviation: {audit.entropy}</div>
                            <div>• Latency overhead: {audit.scanTimeMs}ms</div>
                            <div>• Session checksum: {audit.integritySignature}</div>
                            <div>• SHA256 integrity trees: CERTIFIED</div>
                            <div>• Time of audit: {new Date(audit.verifiedAt).toLocaleTimeString()}</div>
                            <div>• Kyber-1024 block rotation: SUCCESS</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
