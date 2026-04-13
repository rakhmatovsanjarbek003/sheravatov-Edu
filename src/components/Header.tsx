import { Globe, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { triggerHaptic } from '../lib/haptics';
import { setLanguage, useLanguage } from '../lib/i18n';

interface HeaderProps {
  unreadCount: number;
  onOpenNotifications: () => void;
}

export default function Header({ unreadCount, onOpenNotifications }: HeaderProps) {
  const [timeLeft, setTimeLeft] = useState('08:12:45');
  const [showLang, setShowLang] = useState(false);
  const { lang, t } = useLanguage();

  const languages = [
    { code: 'UZ', name: 'O\'zbek' },
    { code: 'RU', name: 'Русский' },
    { code: 'EN', name: 'English' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const parts = timeLeft.split(':').map(Number);
      let seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      if (seconds > 0) {
        seconds--;
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        setTimeLeft(`${h}:${m}:${s}`);
      } else {
        setTimeLeft('READY!');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleMarkAllRead = () => {
    onOpenNotifications();
  };

  const handleClearAll = () => {
    // This is handled in App.tsx now
  };

  const handleMarkRead = (id: string) => {
    // This is handled in App.tsx now
  };

  return (
    <header className="flex items-center justify-between p-4 glass-card rounded-2xl mb-6 sticky top-4 z-50 mx-4">
      {/* Profile Section */}
      <div className="flex items-center gap-3 flex-1">
        <div className="relative shrink-0">
          <img
            src="https://picsum.photos/seed/ali/100/100"
            alt="Ali"
            className="w-10 h-10 rounded-full border-2 border-neon-blue object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 bg-neon-blue text-[#0f172a] text-[8px] font-bold px-1 rounded-full border border-[#0f172a]">
            Lvl 4
          </div>
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold leading-tight truncate">Ali</h1>
        </div>
      </div>

      {/* Central Info - MOVED TO RIGHT */}
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLang(!showLang)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-white/60" />
            <span className="text-[10px] font-bold text-white/80">{lang.toUpperCase()}</span>
          </motion.button>

          <AnimatePresence>
            {showLang && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowLang(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-32 bg-[#1a2235] backdrop-blur-2xl rounded-2xl border border-white/20 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60]"
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code.toLowerCase() as any);
                        setShowLang(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all mb-1 last:mb-0 ${
                        lang === l.code.toLowerCase()
                          ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[8px] font-medium text-white/40 uppercase tracking-wider">Next quiz</span>
          <span className="text-neon-green font-mono font-bold text-xs">{timeLeft}</span>
        </div>

        {/* Notifications Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            triggerHaptic('medium');
            onOpenNotifications();
          }}
          className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all relative group"
        >
          <Bell className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center text-[9px] font-black text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            >
              {unreadCount}
            </motion.span>
          )}
        </motion.button>
      </div>
    </header>
  );
}
