import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Check, Sparkles, Star } from 'lucide-react';
import { useAdmin } from '../context/AdminState';
import { triggerPremiumConfetti } from '../utils/confetti';

type CategoryType = 'AI' | 'UI' | 'SPEED' | 'OTHER';

export default function FeedbackWidget() {
  const { theme, language, addFeedback, t, showToast } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form states
  const [category, setCategory] = useState<CategoryType>('AI');
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoriesSet: { value: CategoryType; labelKey: string }[] = [
    { value: 'AI', labelKey: 'feedbackCatAI' },
    { value: 'UI', labelKey: 'feedbackCatDesign' },
    { value: 'SPEED', labelKey: 'feedbackCatSpeed' },
    { value: 'OTHER', labelKey: 'feedbackCatOther' }
  ];

  const ratingOptions = [
    { value: 1, label: '😢' },
    { value: 2, label: '😐' },
    { value: 3, label: '🙂' },
    { value: 4, label: '😄' },
    { value: 5, label: '😍' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    
    // Simulate high-speed cryptographically secured transport delay
    setTimeout(() => {
      // Find category translation
      const catObj = categoriesSet.find(c => c.value === category);
      const categoryLabel = catObj ? t(catObj.labelKey) : category;

      addFeedback({
        category: categoryLabel,
        rating,
        userText: text,
        userEmail: email.trim() || undefined
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast(t('toastFeedbackSuccess'), 'success');
      triggerPremiumConfetti();
      
      // Auto close popover after 3 seconds upon success
      setTimeout(() => {
        setIsOpen(false);
        // Reset states
        setTimeout(() => {
          setIsSubmitted(false);
          setText('');
          setEmail('');
          setRating(5);
          setCategory('AI');
        }, 300);
      }, 3000);
    }, 850);
  };

  const isDark = theme === 'dark';

  return (
    <div id="feedback-anchor" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Popover overlay panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className={`w-88 sm:w-96 rounded-3xl p-6 mb-4 border shadow-2xl relative backdrop-blur-xl ${
              isDark 
                ? 'bg-slate-950/95 border-white/10 text-white shadow-black/80' 
                : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/60'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-xl ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
                <h3 className="font-extrabold text-sm tracking-tight">{t('feedbackTitle')}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
                aria-label="Close Popover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* SUCCESS VIEW */}
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-8 flex flex-col items-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1, stiffness: 200, damping: 10 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30 mb-4"
                  >
                    <Check className="w-8 h-8" />
                  </motion.div>
                  <h4 className="font-bold text-sm text-emerald-400 mb-1">
                    {language === 'ru' ? 'Отправлено!' : 'Feedback Sent!'}
                  </h4>
                  <p className={`text-xs px-4 font-light leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t('feedbackSuccess')}
                  </p>
                </motion.div>
              ) : (
                /* FORM VIEW */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Category interactive grid */}
                  <div>
                    <label className={`text-[11px] font-bold block mb-1.5 uppercase font-mono tracking-wider ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {t('feedbackCategory')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {categoriesSet.map((cat) => {
                        const isSelected = category === cat.value;
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setCategory(cat.value)}
                            className={`cursor-pointer text-left py-2 px-3 rounded-xl border text-xs font-semibold select-none flex items-center justify-between transition-all ${
                              isSelected
                                ? isDark 
                                  ? 'bg-purple-600/20 border-purple-500/60 text-purple-200 shadow-sm shadow-purple-500/10'
                                  : 'bg-purple-50 border-purple-400 text-purple-700 shadow-xs'
                                : isDark
                                  ? 'bg-white/5 border-white/5 text-slate-400 hover:border-white/15'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span>{t(cat.labelKey)}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating emoji system */}
                  <div>
                    <label className={`text-[11px] font-bold block mb-1.5 uppercase font-mono tracking-wider ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {t('feedbackRating')}
                    </label>
                    <div className={`p-2.5 rounded-2xl flex justify-around items-center border ${
                      isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      {ratingOptions.map((opt) => {
                        const isSelected = rating === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setRating(opt.value)}
                            className={`cursor-pointer text-2xl transition-all relative ${
                              isSelected 
                                ? 'scale-125 filter drop-shadow-md' 
                                : 'opacity-40 grayscale-30 hover:opacity-80 hover:scale-110 grayscale-0'
                            }`}
                            title={`${opt.value}/5`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && (
                              <motion.div
                                layoutId="active-feedback-rating"
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-500"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text comments */}
                  <div>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={t('feedbackTextPlaceholder')}
                      rows={3}
                      required
                      className={`w-full text-xs p-3 rounded-2xl border transition-all resize-none focus:outline-none ${
                        isDark 
                          ? 'bg-black/40 border-white/10 text-slate-100 focus:border-purple-500/50' 
                          : 'bg-white border-slate-200 text-slate-800 focus:border-purple-400 shadow-inner'
                      }`}
                    />
                  </div>

                  {/* Contact Email (optional) */}
                  <div>
                    <label className={`text-[10px] font-semibold block mb-1 uppercase font-mono tracking-wider ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                      {t('feedbackEmailLabel')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. dev@nexus.org"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none transition-all ${
                        isDark 
                          ? 'bg-black/30 border-white/5 text-slate-200 focus:border-purple-500/40' 
                          : 'bg-white border-slate-200 text-slate-800 focus:border-purple-400'
                      }`}
                    />
                  </div>

                  {/* Submit code */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !text.trim()}
                    className={`cursor-pointer w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-white active:scale-98 ${
                      !text.trim()
                        ? 'bg-slate-800 text-slate-500 border border-transparent cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-500/20 hover:shadow-purple-500/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{t('feedbackSubmit')}</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`cursor-pointer w-14 h-14 rounded-full flex items-center justify-center border transition-all z-20 group relative shadow-lg ${
          isOpen
            ? 'bg-slate-900 border-white/10 text-white rotate-90'
            : isDark 
              ? 'bg-gradient-to-tr from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 border-white/10 text-white shadow-purple-950/50 hover:shadow-purple-500/20'
              : 'bg-gradient-to-tr from-purple-650 to-indigo-650 text-white border-slate-200 hover:opacity-95 shadow-purple-200/50 hover:shadow-purple-500/10'
        }`}
        aria-label="Toggle Feedback Form"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6" />
              {/* Pulsing indicator dot */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 rounded-full animate-ping block border-purple-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 rounded-full block border-purple-600" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover Text Label "Feedback / Обратная связь" */}
        <div className="absolute right-16 scale-0 group-hover:scale-100 transition-all origin-right duration-200 pr-1 pointer-events-none">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shadow-md border ${
            isDark 
              ? 'bg-slate-900 border-white/10 text-slate-200' 
              : 'bg-white border-slate-200 text-slate-700 shadow-slate-200/30'
          }`}>
            {t('feedbackButton')}
          </div>
        </div>
      </motion.button>
    </div>
  );
}
