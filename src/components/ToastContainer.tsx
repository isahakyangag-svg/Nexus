import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAdmin, Toast } from '../context/AdminState';

export default function ToastContainer() {
  const { toasts, removeToast, theme } = useAdmin();

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          border: theme === 'light' ? 'border-emerald-200/80' : 'border-emerald-550/30',
          bg: theme === 'light' ? 'bg-emerald-50/95' : 'bg-emerald-950/90',
          text: theme === 'light' ? 'text-emerald-900' : 'text-emerald-200',
          bar: 'bg-emerald-500'
        };
      case 'error':
        return {
          icon: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          border: theme === 'light' ? 'border-rose-200/80' : 'border-rose-550/30',
          bg: theme === 'light' ? 'bg-rose-50/95' : 'bg-rose-950/90',
          text: theme === 'light' ? 'text-rose-900' : 'text-rose-200',
          bar: 'bg-rose-500'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
          border: theme === 'light' ? 'border-amber-200/80' : 'border-amber-550/30',
          bg: theme === 'light' ? 'bg-amber-50/95' : 'bg-amber-950/90',
          text: theme === 'light' ? 'text-amber-900' : 'text-amber-200',
          bar: 'bg-amber-500'
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-purple-400 shrink-0" />,
          border: theme === 'light' ? 'border-purple-200/80' : 'border-purple-550/30',
          bg: theme === 'light' ? 'bg-purple-50/95' : 'bg-purple-950/90',
          text: theme === 'light' ? 'text-purple-900' : 'text-purple-200',
          bar: 'bg-purple-500'
        };
    }
  };

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          
          return (
            <motion.div
              layout
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className={`pointer-events-auto relative overflow-hidden flex gap-3.5 p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 ${styles.bg} ${styles.border}`}
            >
              <div className="mt-0.5">{styles.icon}</div>
              
              <div className="flex-1 space-y-1">
                <p className={`text-xs font-semibold leading-relaxed font-sans ${styles.text}`}>
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className={`p-1 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                  theme === 'light' ? 'text-slate-400 hover:text-slate-755' : 'text-slate-500 hover:text-white'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Countdown Dynamic visual indicator */}
              {toast.duration && toast.duration > 0 && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                  className={`absolute bottom-0 left-0 h-1 ${styles.bar}`}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
