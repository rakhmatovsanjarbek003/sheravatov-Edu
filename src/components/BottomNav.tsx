import { Home, PlusCircle, BarChart3, User, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
}

const tabs = [
  { id: 'home', label: 'Asosiy', icon: Home },
  { id: 'create', label: 'Yaratish', icon: PlusCircle },
  { id: 'community', label: 'Tarmoq', icon: Users },
  { id: 'profile', label: 'Profil', icon: User },
];

export default function BottomNav({ activeTab, onTabChange, isAdmin = true }: Props) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
      <nav className="glass-card rounded-[24px] p-2 flex items-center justify-around backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300",
                isActive ? "text-neon-blue bg-white/10" : "text-white/40 hover:text-white/80"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]")} />
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-neon-blue rounded-full"
                />
              )}
            </motion.button>
          );
        })}

        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange('admin')}
            className={cn(
              "relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300",
              activeTab === 'admin' ? "text-neon-green bg-white/10" : "text-white/40 hover:text-white/80"
            )}
          >
            <ShieldCheck className={cn("w-6 h-6", activeTab === 'admin' && "drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]")} />
            {activeTab === 'admin' && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 w-1 h-1 bg-neon-green rounded-full"
              />
            )}
          </motion.button>
        )}
      </nav>
    </div>
  );
}
