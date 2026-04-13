import { X, ChevronRight, Timer, Trophy, RotateCcw, Home, Target, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { Quiz, Question } from '../types';
import { triggerHaptic } from '../lib/haptics';

interface Props {
  quiz: Quiz;
  onClose: () => void;
}

const mockQuestions: Question[] = [
  { id: '1', text: 'To\'g\'ri javobni toping: 2 + 2 = ?', options: ['3', '4', '5', '6'], correctAnswer: 1 },
  { id: '2', text: 'O\'zbekiston poytaxti qayer?', options: ['Samarqand', 'Buxoro', 'Toshkent', 'Andijon'], correctAnswer: 2 },
  { id: '3', text: 'Python qanday til?', options: ['Past darajali', 'Faqat frontend', 'Obyektga yo\'naltirilgan, yuqori darajali', 'Belgilash tili'], correctAnswer: 2 }
];

// Fisher-Yates Shuffle
function shuffleArray<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Props {
  quiz: Quiz;
  onClose: () => void;
  settings?: { shuffleQuestions: boolean; shuffleOptions: boolean; limit: number };
}

// ... helper functions (shuffleArray is above)

export default function QuizActiveView({ quiz, onClose, settings }: Props) {
  const rawQuestions = Array.isArray(quiz.questions) && quiz.questions.length > 0 ? quiz.questions : mockQuestions;
  
  // Phase management
  const [phase, setPhase] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [testCount, setTestCount] = useState<number>(settings?.limit || Math.min(10, rawQuestions.length));
  
  // Active state
  const [activeQuestions, setActiveQuestions] = useState<{q: Question, originalIdx: number, shuffledOptions: string[], correctShuffledIdx: number}[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const startQuiz = () => {
    // 1. Shuffle raw questions if enabled and pick subset
    const subset = settings?.shuffleQuestions ? shuffleArray(rawQuestions) : [...rawQuestions];
    const selectedSubset = subset.slice(0, testCount);
    
    // 2. Map and shuffle options if enabled
    const formatted = selectedSubset.map(q => {
        const correctText = q.options[q.correctAnswer];
        const shuffledOptions = settings?.shuffleOptions ? shuffleArray(q.options) : [...q.options];
        const newCorrectIdx = shuffledOptions.findIndex(o => o === correctText);
        return { q, originalIdx: rawQuestions.indexOf(q), shuffledOptions, correctShuffledIdx: newCorrectIdx };
    });

    setActiveQuestions(formatted);
    setScore(0);
    setCurrentIdx(0);
    setSelectedOption(null);
    setTimeLeft(testCount * 30); // 30 seconds per question
    setPhase('playing');
    triggerHaptic('heavy');
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPhase('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const handleNext = () => {
    const isCorrect = selectedOption === activeQuestions[currentIdx].correctShuffledIdx;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      triggerHaptic('success');
    } else {
      triggerHaptic('error');
    }

    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setPhase('finished');
      triggerHaptic('heavy');
    }
  };

  if (phase === 'setup') {
      return (
        <div className="fixed inset-0 z-[200] bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-6 rounded-[40px] max-w-sm w-full">
          <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-blue/50">
            <Settings2 className="w-8 h-8 text-neon-blue" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Test Sozlamalari</h2>
          <p className="text-white/60 mb-6 text-sm">Umumiy baza: {rawQuestions.length} ta savol. Nechtasini yechoqchisiz?</p>
          
          <div className="flex gap-3 justify-center mb-6">
            {[10, 15, 20].map(cnt => {
               if(cnt > rawQuestions.length && cnt !== 10) return null; // Only show if enough
               return (
                 <button key={cnt} onClick={() => setTestCount(Math.min(cnt, rawQuestions.length))} 
                 className={`px-4 py-2 rounded-xl border ${testCount === Math.min(cnt, rawQuestions.length) ? 'bg-neon-blue text-black font-bold' : 'bg-white/10 text-white/60'}`}>
                    {Math.min(cnt, rawQuestions.length)} ta
                 </button>
               )
            })}
             <button onClick={() => setTestCount(rawQuestions.length)} className={`px-4 py-2 rounded-xl border ${testCount === rawQuestions.length ? 'bg-neon-blue text-black font-bold' : 'bg-white/10 text-white/60'}`}>Hammasi</button>
          </div>

          <button onClick={startQuiz} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-neon-blue text-[#0f172a] font-bold">
            <Target className="w-5 h-5" /> Testni Boshlash
          </button>
          <button onClick={onClose} className="w-full mt-3 py-3 text-white/50 hover:text-white transition">Bekor qilish</button>
        </motion.div>
      </div>
      );
  }

  if (phase === 'finished') {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10 rounded-[40px] max-w-sm w-full">
          <div className="w-24 h-24 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-400/50">
            <Trophy className="w-12 h-12 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Tugadi!</h2>
          <p className="text-white/60 mb-8">Natijangiz: {score} / {activeQuestions.length}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setPhase('setup')} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold">
              <RotateCcw className="w-4 h-4" /> Qayta
            </button>
            <button onClick={onClose} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-neon-blue text-[#0f172a] font-bold">
              <Home className="w-4 h-4" /> Asosiy
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentInfo = activeQuestions[currentIdx];
  const progress = ((currentIdx + 1) / activeQuestions.length) * 100;

  return (
    <div className="fixed inset-0 z-[200] bg-[#0f172a] flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <button onClick={onClose} className="p-2 rounded-xl bg-white/5 border border-white/10">
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/40 uppercase tracking-widest font-bold">{quiz.title}</span>
          <div className="flex items-center gap-2 text-neon-blue">
            <Timer className="w-4 h-4" />
            <span className="font-mono font-bold">{Math.floor(timeLeft / 60)}:{ (timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        <div className="w-10" />
      </div>

      <div className="px-6 mb-8">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-white/40 font-bold">SAVOL {currentIdx + 1}/{activeQuestions.length}</span>
          <span className="text-[10px] text-neon-blue font-bold">{Math.round(progress)}% Bajarildi</span>
        </div>
      </div>

      <div className="flex-1 px-6 overflow-y-auto hide-scrollbar">
        <h2 className="text-xl font-bold mb-8 leading-tight">{currentInfo.q.text}</h2>
        
        <div className="space-y-4">
          {currentInfo.shuffledOptions.map((option, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedOption(i); triggerHaptic('selection'); }}
              className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                selectedOption === i 
                  ? 'bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_15px_rgba(0,242,255,0.2)]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
              }`}
            >
              <span className="font-medium text-sm pr-4">{option}</span>
              <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
                selectedOption === i ? 'border-neon-blue bg-neon-blue' : 'border-white/10'
              }`}>
                {selectedOption === i && <div className="w-2 h-2 bg-[#0f172a] rounded-full" />}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <button
          disabled={selectedOption === null}
          onClick={handleNext}
          className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
            selectedOption === null 
              ? 'bg-white/5 text-white/20 cursor-not-allowed' 
              : 'bg-neon-blue text-[#0f172a] shadow-[0_0_20px_rgba(0,242,255,0.3)]'
          }`}
        >
          {currentIdx === activeQuestions.length - 1 ? 'Testni Yakunlash' : 'Keyingi Savol'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
