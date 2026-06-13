import { motion } from 'motion/react';
import { Users, CheckCircle, Cpu, ShieldCheck, Heart } from 'lucide-react';
import { useAdmin } from '../context/AdminState';

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

export default function About() {
  const { theme, language, t } = useAdmin();
  const activeLocal = aboutLocalDict[language];

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
      </div>
    </section>
  );
}
