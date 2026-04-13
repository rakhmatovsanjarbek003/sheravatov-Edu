import { Brain, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function AIRecommendations() {
  return (
    <div className="px-4 mb-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Brain className="w-4 h-4 text-purple-400" />
        <h5 className="text-[10px] uppercase font-bold text-white/20 tracking-widest">AI Tavsiyalar</h5>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-[32px] border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent relative overflow-hidden"
      >
        <div className="absolute -top-4 -right-4 opacity-10">
          <Sparkles className="w-24 h-24 text-purple-400" />
        </div>
        
        <div className="relative z-10">
          <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
            Bilimingizni oshiring
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[8px] uppercase">Shaxsiy</span>
          </h4>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            Statistikangizga ko'ra, sizda "Dasturlash" bo'yicha natijalar juda yaxshi. 
            Lekin "Fizika" bo'limida "Mexanika" mavzusini takrorlash foydali bo'ladi.
          </p>
          
          <button className="flex items-center gap-2 text-xs font-bold text-purple-400 group">
            Tavsiya etilgan testni boshlash
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
