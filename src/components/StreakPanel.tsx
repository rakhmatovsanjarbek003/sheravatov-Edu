import { Flame, Check } from 'lucide-react';
import { motion } from 'motion/react';

const days = [
  { name: 'Mon', active: true },
  { name: 'Tue', active: true },
  { name: 'Wed', active: true },
  { name: 'Thu', active: true },
  { name: 'Fri', active: true },
  { name: 'Sat', active: false },
  { name: 'Sun', active: false }
];

export default function StreakPanel() {
  return (
    <div className="px-4 mb-20">
      <div className="p-6 rounded-3xl glass-card bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-500/20 rounded-xl">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="font-bold text-lg">5 Day Streak</h3>
        </div>
        
        <p className="text-xs text-white/60 mb-6">
          Keep it up! Solve daily quiz and keep your streak alive.
        </p>
        
        <div className="flex justify-between items-center">
          {days.map((day) => (
            <div key={day.name} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                day.active 
                  ? 'bg-neon-green/20 border-neon-green text-neon-green' 
                  : 'bg-white/5 border-white/10 text-white/20'
              }`}>
                {day.active ? <Check className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
              </div>
              <span className={`text-[10px] font-medium ${day.active ? 'text-white/80' : 'text-white/20'}`}>
                {day.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
