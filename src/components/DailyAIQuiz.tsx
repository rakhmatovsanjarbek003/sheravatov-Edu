import { Sparkles, Play, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../lib/haptics';
import { useState } from 'react';

interface Props {
  onStart: (quiz: any) => void;
}

export default function DailyAIQuiz({ onStart }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    triggerHaptic('medium');
    setLoading(true);
    try {
      const res = await fetch('/api/daily-quiz');
      const quiz = await res.json();
      onStart(quiz);
    } catch (e) {
      alert("Testni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 mb-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Sparkles className="w-4 h-4 text-neon-blue" />
        <h5 className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Kunlik AI Savol</h5>
      </div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="glass-card p-6 rounded-[32px] border border-neon-blue/20 bg-gradient-to-br from-neon-blue/5 to-transparent flex items-center justify-between"
      >
        <div className="max-w-[200px] text-left">
          <h4 className="text-sm font-bold mb-1">Bugungi AI Challenge</h4>
          <p className="text-[10px] text-white/60 leading-tight">
            Sun'iy intellekt tomonidan tayyorlangan 10 ta maxsus savol. Bilimingizni sinab ko'ring!
          </p>
        </div>
        
        <button 
          onClick={handlePlay}
          disabled={loading}
          className="w-12 h-12 rounded-2xl bg-neon-blue text-[#0f172a] flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.3)] disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
        </button>
      </motion.div>
    </div>
  );
}
