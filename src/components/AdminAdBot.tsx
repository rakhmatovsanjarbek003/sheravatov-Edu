import { Megaphone, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const ADS = [
  { id: 1, title: 'Yangi Matematika Testi!', desc: 'Admin tomonidan 50 ta yangi savol qo\'shildi.', color: 'from-cyan-500/20 to-blue-500/20', icon: '📐' },
  { id: 2, title: 'Dasturlash Challenge', desc: 'Bugun soat 20:00 da jonli musobaqa boshlanadi.', color: 'from-lime-500/20 to-emerald-500/20', icon: '💻' },
  { id: 3, title: 'Haftalik Top 10', desc: 'Eng yuqori ball to\'plaganlar uchun maxsus sovg\'alar!', color: 'from-amber-500/20 to-orange-500/20', icon: '🏆' },
];

export default function AdminAdBot() {
  return (
    <div className="px-4 mb-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Megaphone className="w-4 h-4 text-neon-blue" />
        <h5 className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Admin Bildirishnomalari</h5>
      </div>
      
      <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2">
        {ADS.map((ad) => (
          <motion.div
            key={ad.id}
            className={`min-w-[280px] p-5 rounded-3xl glass-card snap-center bg-gradient-to-br ${ad.color} border border-white/5 flex items-center justify-between group cursor-pointer`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
                {ad.icon}
              </div>
              <div className="max-w-[160px]">
                <h4 className="text-sm font-bold mb-1">{ad.title}</h4>
                <p className="text-[10px] text-white/60 leading-tight">{ad.desc}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
