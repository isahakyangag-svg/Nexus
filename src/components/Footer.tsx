import { useState, FormEvent } from 'react';
import { Globe, Github, Twitter, Shield, Heart } from 'lucide-react';
import { useAdmin } from '../context/AdminState';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { siteName, theme, language, t, triggerAdminNotification, setIsLoginModalOpen } = useAdmin();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate successful subscription
    setIsSubscribed(true);
    triggerAdminNotification(
      language === 'ru' 
        ? `Новая подписка на рассылку: ${email}` 
        : `New newsletter subscription: ${email}`
    );
    setEmail('');

    // Clear subscribed visual status after 4 seconds
    setTimeout(() => {
      setIsSubscribed(false);
    }, 4000);
  };

  return (
    <footer className={`relative border-t py-16 text-sm overflow-hidden select-none transition-colors duration-300 ${
      theme === 'light'
        ? 'border-slate-200 bg-slate-100 text-slate-600 shadow-inner'
        : 'border-slate-900 bg-[#020205] text-slate-400'
    }`}>
      
      {/* Background radial soft light */}
      {theme === 'dark' && (
        <div className="absolute bottom-0 left-[30%] w-80 h-80 bg-purple-600/5 rounded-full filter blur-[100px] pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        
        {/* Modern Glassmorphic Newsletter Box */}
        <div className={`relative mb-12 p-6 md:p-8 rounded-3xl border backdrop-blur-xl flex flex-col lg:flex-row justify-between items-center gap-6 ${
          theme === 'light'
            ? 'bg-white/80 border-purple-200/60 shadow-md shadow-slate-250/20'
            : 'bg-white/5 border-white/10 shadow-xl shadow-black/10'
        }`}>
          <div className="text-center lg:text-left space-y-1.5">
            <h3 className={`text-lg md:text-xl font-extrabold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              {t('subscribeTitle')}
            </h3>
            <p className={`text-xs max-w-xl leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-450'}`}>
              {t('subscribeDesc')}
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
            <div className="relative flex-1 sm:w-64">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className={`w-full text-xs py-3 px-4 rounded-xl border outline-none transition-all ${
                  theme === 'light'
                    ? 'bg-slate-100/80 text-slate-900 placeholder-slate-400 border-slate-200 focus:border-purple-500 focus:bg-white'
                    : 'bg-black/40 text-white placeholder-slate-500 border-white/10 focus:border-purple-550 focus:bg-black/60'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={isSubscribed}
              className={`cursor-pointer font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 select-none duration-250 ${
                isSubscribed 
                  ? 'bg-emerald-650 text-white shadow-emerald-500/20 scale-100' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25 hover:scale-103 active:scale-[0.98]'
              }`}
            >
              <span>{isSubscribed ? (language === 'ru' ? 'Вы подписаны! 🎉' : 'Subscribed! 🎉') : t('subscribeBtn')}</span>
            </button>
          </form>
        </div>

        {/* Core Links & Logo Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 border-b pb-12 mb-12 ${
          theme === 'light' ? 'border-slate-200' : 'border-white/5'
        }`}>
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div
              onClick={() => handleScrollToSection('home')}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <Globe className="w-6.5 h-6.5 text-purple-600 dark:text-purple-500 transition-transform duration-500 group-hover:rotate-45" />
              <span className={`font-extrabold text-xl tracking-wider ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                {siteName}
              </span>
            </div>
            <p className={`text-xs font-light max-w-sm leading-relaxed ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
              {t('footerBrandDesc')}
            </p>
            <div className={`text-xs font-mono tracking-wider ${theme === 'light' ? 'text-slate-450' : 'text-slate-600'}`}>
              PROJECT RECONSTITUTED IN {currentYear}
            </div>
          </div>

          {/* Column 2: Product items */}
          <div className="md:col-span-2.5 space-y-3">
            <h4 className={`font-bold tracking-tight text-xs uppercase ${theme === 'light' ? 'text-slate-800' : 'text-slate-300'}`}>{t('footerProduct')}</h4>
            <ul className={`space-y-2 text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              <li>
                <button onClick={() => handleScrollToSection('download')} className={`cursor-pointer transition-colors ${theme === 'light' ? 'hover:text-purple-600' : 'hover:text-white'}`}>
                  {t('footerDownload')}
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollToSection('features')} className={`cursor-pointer transition-colors ${theme === 'light' ? 'hover:text-purple-600' : 'hover:text-white'}`}>
                  {t('footerFeatures')}
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollToSection('about')} className={`cursor-pointer transition-colors ${theme === 'light' ? 'hover:text-purple-600' : 'hover:text-white'}`}>
                  {t('footerPrices')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resource directories */}
          <div className="md:col-span-2.5 space-y-3">
            <h4 className={`font-bold tracking-tight text-xs uppercase ${theme === 'light' ? 'text-slate-800' : 'text-slate-300'}`}>{t('footerResources')}</h4>
            <ul className={`space-y-2 text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              <li>
                <a href="#about" className={`transition-colors ${theme === 'light' ? 'hover:text-purple-600 text-slate-600' : 'hover:text-white text-slate-400'}`}>{t('footerBlog')}</a>
              </li>
              <li>
                <a href="#features" className={`transition-colors ${theme === 'light' ? 'hover:text-purple-600 text-slate-600' : 'hover:text-white text-slate-400'}`}>{t('footerApi')}</a>
              </li>
              <li>
                <a href="#home" className={`transition-colors ${theme === 'light' ? 'hover:text-purple-600 text-slate-600' : 'hover:text-white text-slate-400'}`}>{t('footerStatus')}</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Community Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className={`font-bold tracking-tight text-xs uppercase ${theme === 'light' ? 'text-slate-800' : 'text-slate-300'}`}>{t('footerCommunity')}</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={`w-15 h-10 rounded-xl border flex items-center justify-center transition-all ${
                  theme === 'light'
                    ? 'bg-white border-slate-250 text-slate-550 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-650'
                    : 'bg-white/5 border-white/5 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white text-slate-400'
                }`}
                aria-label="GitHub Repository"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className={`w-15 h-10 rounded-xl border flex items-center justify-center transition-all ${
                  theme === 'light'
                    ? 'bg-white border-slate-250 text-slate-550 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-650'
                    : 'bg-white/5 border-white/5 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white text-slate-400'
                }`}
                aria-label="Twitter Official Page"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className={`text-[10px] font-light max-w-[150px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-600'}`}>
              {t('footerFollow')}
            </p>
          </div>

        </div>

        {/* Bottom copyright alignment */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-4 text-xs ${
          theme === 'light' ? 'text-slate-500' : 'text-slate-600'
        }`}>
          <div>
            <span>© {currentYear} {t('footerRights')}</span>
          </div>
          <div className={`flex items-center gap-6 font-mono text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-600'}`}>
            <span className="flex items-center gap-1">
              <Shield className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`} />
              DECRYPTION ISO-COMPLIANT
            </span>
            <span 
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1 cursor-pointer hover:text-rose-500 transition-colors"
              title={t('devPanel')}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500/40 animate-pulse animate-duration-1500" />
              CRAFTED BY AI STUDIO
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
