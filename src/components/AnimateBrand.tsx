import React from 'react';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { useAdmin } from '../context/AdminState';

interface AnimateBrandProps {
  variant?: 'nav' | 'footer' | 'preview';
  customLogo?: string;
  customLogoAnimation?: string;
  customTextAnimation?: string;
  customSiteName?: string;
}

export default function AnimateBrand({ 
  variant = 'nav',
  customLogo,
  customLogoAnimation,
  customTextAnimation,
  customSiteName
}: AnimateBrandProps) {
  const { siteName: contextSiteName, siteLogo: contextSiteLogo, logoAnimation: contextLogoAnimation, textAnimation: contextTextAnimation, theme } = useAdmin();

  const siteName = customSiteName !== undefined ? customSiteName : contextSiteName;
  const siteLogo = customLogo !== undefined ? customLogo : contextSiteLogo;
  const logoAnimation = customLogoAnimation !== undefined ? customLogoAnimation : contextLogoAnimation;
  const textAnimation = customTextAnimation !== undefined ? customTextAnimation : contextTextAnimation;

  const isLight = theme === 'light';
  
  // Custom Styles matching variants
  const containerClasses = {
    nav: "logo flex items-center gap-3 cursor-pointer group select-none",
    footer: "logo flex items-center gap-3 cursor-pointer group select-none",
    preview: "flex flex-col items-center justify-center p-6 bg-black/40 border border-white/10 rounded-2xl text-center space-y-3 w-full"
  }[variant];

  // Motion configs for LOGO
  const getLogoMotionProps = () => {
    switch (logoAnimation) {
      case 'spin-slow':
        return {
          animate: { rotate: 360 },
          transition: { duration: 10, repeat: Infinity, ease: 'linear' }
        };
      case 'bounce':
        return {
          animate: { y: [0, -10, 0] },
          transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'pulse':
        return {
          animate: { 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0px 0px 0px 0px rgba(168, 85, 247, 0)",
              "0px 0px 15px 4px rgba(168, 85, 247, 0.4)",
              "0px 0px 0px 0px rgba(168, 85, 247, 0)"
            ]
          },
          transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'float':
        return {
          animate: { y: [0, -6, 0], rotate: [-1.5, 1.5, -1.5] },
          transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'shake':
        return {
          animate: { x: [-1, 1, -1, 1, 0], y: [0.5, -0.5, 0.5, -0.5, 0] },
          transition: { duration: 0.25, repeat: Infinity, repeatType: 'reverse' as const }
        };
      case 'hover-rotate':
        return {
          whileHover: { rotate: 180, scale: 1.12 },
          transition: { type: 'spring', stiffness: 220, damping: 12 }
        };
      default:
        // 'none' or fallback
        return {
          whileHover: { scale: 1.05 },
          transition: { duration: 0.2 }
        };
    }
  };

  // Render Site Name with Letter-by-Letter stagger options
  const renderSiteNameWithAnimations = () => {
    const letters = (siteName || 'NEXUS').split('');

    const textGradient = isLight
      ? 'bg-gradient-to-r from-slate-950 via-purple-750 to-purple-600'
      : 'bg-gradient-to-r from-white via-purple-300 to-indigo-200';

    return (
      <span className={`text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent ${textGradient} flex items-center`}>
        {letters.map((char, idx) => {
          let letterMotion = {};
          let letterTransition = {};

          switch (textAnimation) {
            case 'bounce-letters':
              letterMotion = { y: [0, -8, 0] };
              letterTransition = {
                duration: 0.7,
                repeat: Infinity,
                delay: idx * 0.08,
                ease: "easeInOut"
              };
              break;
            case 'wave':
              letterMotion = { y: [0, -4, 0], scale: [1, 1.15, 1] };
              letterTransition = {
                duration: 1.5,
                repeat: Infinity,
                delay: idx * 0.12,
                ease: "linear"
              };
              break;
            case 'hover-hop':
              return (
                <motion.span
                  key={idx}
                  className="inline-block"
                  whileHover={{ y: -8, scale: 1.3, color: '#a855f7' }}
                  transition={{ type: 'spring', stiffness: 350, damping: 8 }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              );
            case 'glitch':
              letterMotion = {
                x: [0, -1.2, 1.2, -0.8, 0.8, 0],
                y: [0, 0.8, -0.8, 0.6, -0.6, 0]
              };
              letterTransition = {
                duration: 0.38,
                repeat: Infinity,
                delay: idx * 0.04,
                ease: "easeInOut"
              };
              break;
            case 'razvernulsya':
              letterMotion = { x: [ (idx - letters.length / 2) * 8, 0], opacity: [0, 1], scale: [0.5, 1] };
              letterTransition = {
                type: 'spring',
                stiffness: 140,
                damping: 10,
                delay: idx * 0.06
              };
              break;
            default:
              break;
          }

          return (
            <motion.span
              key={idx}
              className="inline-block origin-center"
              animate={letterMotion}
              transition={letterTransition}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          );
        })}
      </span>
    );
  };

  if (variant === 'preview') {
    return (
      <div className={containerClasses}>
        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Текущий логотип и текст</span>
        
        <div className="flex items-center gap-3 bg-[#0a0a10] border border-white/5 px-6 py-4 rounded-3xl shadow-2xl relative w-full justify-center">
          <motion.div 
            {...getLogoMotionProps()}
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 overflow-hidden relative shrink-0"
          >
            {siteLogo ? (
              <img src={siteLogo} alt="Логотип" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <Globe className="w-6 h-6 text-white" />
            )}
          </motion.div>

          {renderSiteNameWithAnimations()}
        </div>

        <div className="text-[10px] font-mono text-slate-350 bg-white/5 border border-white/10 px-3 py-1 rounded-full inline-block">
          {siteLogo ? 'Свой рисунок' : 'Встроенный Globe'} • Поведение Active
        </div>
      </div>
    );
  }

  // Rendering for Nav or Footer
  return (
    <div className={containerClasses}>
      <motion.div
        {...getLogoMotionProps()}
        className={`w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 overflow-hidden relative shrink-0`}
      >
        {siteLogo ? (
          <img src={siteLogo} alt={siteName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <Globe className="w-5 h-5 text-white" />
        )}
      </motion.div>
      {renderSiteNameWithAnimations()}
    </div>
  );
}
