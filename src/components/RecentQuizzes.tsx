import { RotateCcw, Share2, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Quiz } from '../types';
import { triggerHaptic } from '../lib/haptics';

interface Props {
  quizzes: Quiz[];
  onStartQuiz: (quiz: Quiz) => void;
}

export default function RecentQuizzes({ quizzes, onStartQuiz }: Props) {
  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Recent Quizzes</h3>
      </div>
      
      <div className="max-h-[320px] overflow-y-auto pr-1 space-y-3 hide-scrollbar scroll-smooth">
        {quizzes.length > 0 ? quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-4 rounded-2xl glass-card hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl border border-white/10`}>
                {quiz.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm">{quiz.title}</h4>
                <p className="text-[10px] text-white/40">{quiz.questionsCount} savol • {quiz.timeAgo || 'Yaqinda'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {quiz.score && <span className="text-neon-green font-bold text-sm mr-2">{quiz.score}</span>}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  triggerHaptic('light');
                  // Simple like simulation
                  alert(`Likelangan: ${quiz.title}`);
                }}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-red-500 transition-colors"
              >
                <Heart className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  triggerHaptic('light');
                  // Simple share simulation
                  alert(`Ulashildi: ${quiz.title}`);
                }}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
              >
                <Share2 className="w-4 h-4 text-white/60" />
              </motion.button>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                onClick={() => onStartQuiz(quiz)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 text-white/60" />
              </motion.button>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-8 glass-card rounded-2xl border-dashed border-white/10">
            <p className="text-xs text-white/20">Hali testlar mavjud emas</p>
          </div>
        )}
      </div>
    </div>
  );
}
