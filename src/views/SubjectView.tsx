import { ArrowLeft, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Quiz } from '../types';

interface Props {
  subjectName: string;
  quizzes: Quiz[];
  onStartQuiz: (q: Quiz) => void;
  onBack: () => void;
}

export default function SubjectView({ subjectName, quizzes, onStartQuiz, onBack }: Props) {
  return (
    <div className="px-4 pb-32 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3 mb-8 pt-4 text-left">
        <button onClick={onBack} className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white"/>
        </button>
        <div>
          <h2 className="text-2xl font-black text-white">{subjectName}</h2>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{quizzes.length} ta test mavjud</p>
        </div>
      </div>

      <div className="space-y-4 text-left">
        {quizzes.length > 0 ? (
          quizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onStartQuiz(quiz)}
              className="glass-card p-5 rounded-[32px] flex items-center justify-between group cursor-pointer border border-white/5 hover:border-neon-blue/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {quiz.icon}
                </div>
                <div>
                  <h6 className="text-base font-bold text-white group-hover:text-neon-blue transition-colors">{quiz.title}</h6>
                  <div className="flex items-center gap-2 text-[11px] text-white/40 mt-1">
                    <span className="bg-white/5 px-2 py-0.5 rounded-full">{quiz.questionsCount} savol</span>
                    {quiz.score && <span className="text-neon-green font-bold px-2 py-0.5 bg-neon-green/10 rounded-full">Natija: {quiz.score}</span>}
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity">
                 <ArrowLeft className="w-5 h-5 rotate-180" />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 glass-card rounded-[40px] border-dashed border-white/10">
            <p className="text-sm text-white/40 mb-2">Bu fanda hali testlar yo'q</p>
            <p className="text-[10px] text-white/20 uppercase font-bold">Tez orada qo'shiladi</p>
          </div>
        )}
      </div>
    </div>
  );
}
