import { 
  Bell, 
  CheckCircle2, 
  Trophy, 
  MessageSquare, 
  Zap, 
  X,
  Clock,
  Trash2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../lib/haptics';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'quiz' | 'community' | 'system' | 'achievement';
  read: boolean;
}

interface NotificationViewProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onMarkRead: (id: string) => void;
}

export default function NotificationView({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAllRead, 
  onClearAll,
  onMarkRead
}: NotificationViewProps) {
  
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'quiz': return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'achievement': return <Trophy className="w-5 h-5 text-green-600" />;
      case 'community': return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'system': return <CheckCircle2 className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[2000]"
          />
          
          {/* Panel - Top Down Immersive */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y < -100) onClose();
            }}
            className="fixed top-0 left-0 right-0 z-[2001] max-w-md mx-auto bg-white/40 backdrop-blur-[40px] rounded-b-[40px] border-b border-white/40 p-5 pt-14 pb-10 max-h-[85vh] overflow-y-auto hide-scrollbar shadow-[0_10px_60px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-black/5 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-black/80" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black tracking-tight leading-none">Bildirishnomalar</h2>
                  <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest mt-1">Sizning yangiliklaringiz</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/30 hover:text-black transition-colors active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {notifications.length > 0 ? (
              <>
                <div className="flex gap-2 mb-5">
                  <button 
                    onClick={() => {
                      triggerHaptic('medium');
                      onMarkAllRead();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-black/5 text-[9px] font-bold text-black/50 uppercase tracking-widest hover:bg-black/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3 h-3" />
                    Hammasini o'qish
                  </button>
                  <button 
                    onClick={() => {
                      triggerHaptic('warning');
                      onClearAll();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-500/5 text-red-500/60 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        triggerHaptic('light');
                        onMarkRead(notif.id);
                      }}
                      className={`p-4 rounded-[24px] border transition-all duration-500 relative overflow-hidden ${
                        notif.read 
                          ? 'bg-black/5 border-transparent opacity-30' 
                          : 'bg-white/60 border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                      }`}
                    >
                      <div className="flex gap-3.5 relative z-10">
                        <div className="shrink-0 w-10 h-10 rounded-[18px] bg-black/5 flex items-center justify-center">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="font-bold text-xs text-black tracking-tight truncate">{notif.title}</h4>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                            )}
                          </div>
                          <p className="text-[11px] text-black/60 font-medium leading-relaxed mb-2 line-clamp-2">{notif.message}</p>
                          <div className="flex items-center gap-1.5 text-[9px] text-black/30 font-bold uppercase tracking-widest">
                            <Clock className="w-2.5 h-2.5" />
                            {notif.time}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <div className="w-20 h-20 rounded-[32px] bg-black/5 flex items-center justify-center mx-auto mb-5">
                  <Bell className="w-8 h-8 text-black/5" />
                </div>
                <h3 className="text-lg font-bold text-black/10 tracking-tight">Bildirishnomalar yo'q</h3>
              </div>
            )}

            {/* Apple Handle at bottom */}
            <div className="w-10 h-1 bg-black/5 rounded-full mx-auto mt-10 mb-1" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
