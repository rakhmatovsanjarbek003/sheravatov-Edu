import { X, ChevronRight, Clock, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Quiz } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  quizzes: Quiz[];
  onStartQuiz: (quiz: Quiz) => void;
}

export default function QuizListModal({ isOpen, onClose, categoryName, quizzes, onStartQuiz }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="text-xl font-bold">{categoryName} Quizzes</h3>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 hide-scrollbar">
              {quizzes.map((quiz) => (
                <motion.button
                  key={quiz.id}
                  whileHover={{ x: 4 }}
                  onClick={() => onStartQuiz(quiz)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl glass-card hover:bg-white/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center text-2xl border border-neon-blue/20">
                      {quiz.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{quiz.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-white/40">
                          <BookOpen className="w-3 h-3" />
                          {quiz.questionsCount} Questions
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-white/40">
                          <Clock className="w-3 h-3" />
                          15 min
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
