import { Plus, Save, Trash2, Layout, FileUp, Presentation, BookOpen, ChevronLeft, Sparkles, PenLine, HelpCircle, X, CheckCircle2, Play, Clock, AlertCircle, Users, Share2, Link, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { triggerHaptic } from '../lib/haptics';
import AICoach from '../components/AICoach';
import { Quiz } from '../types';

const CATEGORIES = [
  { id: 'math', name: 'Mathematics' },
  { id: 'programming', name: 'Programming' },
  { id: 'history', name: 'History' },
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
  { id: 'literature', name: 'Literature' },
  { id: 'geography', name: 'Geography' },
  { id: 'art', name: 'Art' },
  { id: 'music', name: 'Music' },
  { id: 'sports', name: 'Sports' },
  { id: 'psychology', name: 'Psychology' },
  { id: 'economics', name: 'Economics' },
  { id: 'english', name: 'English' }
];

interface Props {
  onOpenUpload: () => void;
  onOpenPresentation: () => void;
  onOpenPaper: () => void;
  quizzes?: Quiz[];
  onStartQuiz?: (quiz: Quiz) => void;
  onSaveQuiz?: (quiz: Quiz) => void;
  settings?: { shuffleQuestions: boolean; shuffleOptions: boolean; limit: number };
  onSettingsChange?: (settings: any) => void;
}

export default function CreateQuizView({ 
  onOpenUpload, onOpenPresentation, onOpenPaper, 
  quizzes = [], onStartQuiz, onSaveQuiz,
  settings, onSettingsChange 
}: Props) {
  const [mode, setMode] = useState<'hub' | 'manual' | 'session'>('hub');
  const [showHelp, setShowHelp] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCategory, setQuizCategory] = useState('math');
  const [questions, setQuestions] = useState([
    { id: 1, text: '', options: ['', '', '', ''], correct: 0 }
  ]);

  const tools = [
    {
      id: 'manual',
      title: 'Manual',
      desc: 'Savollarni qo‘lda kiritish',
      icon: <PenLine className="w-5 h-5 text-neon-blue" />,
      color: 'bg-neon-blue/10',
      help: 'Har bir savol uchun 4 ta variant va bitta to‘g‘ri javobni belgilash.',
      action: () => {
        setMode('manual');
        triggerHaptic('light');
      }
    },
    {
      id: 'upload',
      title: 'Upload',
      desc: 'PDF/Word dan testga',
      icon: <FileUp className="w-5 h-5 text-neon-green" />,
      color: 'bg-neon-green/10',
      help: 'Hujjatlarni yuklang, AI ularni avtomatik testga aylantiradi.',
      action: () => {
        onOpenUpload();
        triggerHaptic('light');
      }
    },
    {
      id: 'presentation',
      title: 'Slides',
      desc: 'Matndan slaydlar',
      icon: <Presentation className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-500/10',
      help: 'AI sarlavhalar va asosiy punktlarni tayyorlab beradi.',
      action: () => {
        onOpenPresentation();
        triggerHaptic('light');
      }
    },
    {
      id: 'paper',
      title: 'Paper',
      desc: 'Ilmiy ish yordamchisi',
      icon: <BookOpen className="w-5 h-5 text-rose-400" />,
      color: 'bg-rose-500/10',
      help: 'Maqolalar uchun reja va kontent yaratish.',
      action: () => {
        onOpenPaper();
        triggerHaptic('light');
      }
    },
    {
      id: 'session',
      title: 'Sessiya',
      desc: 'Guruh bo‘lib yodlash',
      icon: <Users className="w-5 h-5 text-fuchsia-400" />,
      color: 'bg-fuchsia-500/10',
      help: 'Guruh yaratish va savollarni birgalikda yodlash.',
      action: () => {
        setMode('session');
        triggerHaptic('light');
      }
    }
  ];

  if (mode === 'hub') {
    return (
      <div className="px-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Creation Hub</h2>
            <Sparkles className="w-4 h-4 text-neon-blue animate-pulse" />
          </div>
          <button 
            onClick={() => {
              setShowHelp(true);
              triggerHaptic('medium');
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* AI Coach integrated here - MOVED TO TOP */}
        <div className="mb-8">
          <h5 className="text-[10px] uppercase font-bold text-white/20 mb-4 tracking-widest px-1">AI Assistant</h5>
          <AICoach />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {tools.map((tool, i) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={tool.action}
              className="glass-card p-4 rounded-3xl flex flex-col gap-3 text-left group transition-all hover:bg-white/10 border border-white/5"
            >
              <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                {tool.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm mb-0.5">{tool.title}</h4>
                <p className="text-[10px] text-white/40 leading-tight line-clamp-2">{tool.help}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Quiz Settings / Modes */}
        <div className="mb-8">
          <h5 className="text-[10px] uppercase font-bold text-white/20 mb-4 tracking-widest px-1">Yechish Sozlamalari</h5>
          <div className="glass-card p-5 rounded-[32px] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Savollar tartibi</span>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => onSettingsChange?.({...settings, shuffleQuestions: true})}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg ${settings?.shuffleQuestions ? 'bg-neon-blue text-black' : 'text-white/40'}`}
                >Aralash</button>
                <button 
                  onClick={() => onSettingsChange?.({...settings, shuffleQuestions: false})}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg ${!settings?.shuffleQuestions ? 'bg-neon-blue text-black' : 'text-white/40'}`}
                >Tartibli</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Javoblar tartibi</span>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => onSettingsChange?.({...settings, shuffleOptions: true})}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg ${settings?.shuffleOptions ? 'bg-neon-blue text-black' : 'text-white/40'}`}
                >Aralash</button>
                <button 
                  onClick={() => onSettingsChange?.({...settings, shuffleOptions: false})}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg ${!settings?.shuffleOptions ? 'bg-neon-blue text-black' : 'text-white/40'}`}
                >Tartibli</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Savollar soni</span>
              <div className="flex gap-2">
                {[10, 20, 25, 50].map(n => (
                  <button 
                    key={n} 
                    onClick={() => onSettingsChange?.({...settings, limit: n})}
                    className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold rounded-lg border transition-all ${settings?.limit === n ? 'border-neon-blue bg-neon-blue/10 text-neon-blue' : 'border-white/10 text-white/40'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My Tests Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h5 className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Mening Testlarim</h5>
            <span className="text-[10px] text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded-full">{quizzes.length} ta</span>
          </div>
          
          <div className="space-y-3">
            {quizzes.length > 0 ? (
              quizzes.slice(0, 4).map((quiz, i) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                      {quiz.icon}
                    </div>
                    <div>
                      <h6 className="text-sm font-bold">{quiz.title}</h6>
                      <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <span className="flex items-center gap-1"><Layout className="w-3 h-3" /> {quiz.questionsCount} savol</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="flex items-center gap-1 uppercase">{quiz.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        triggerHaptic('light');
                        alert(`Likelangan: ${quiz.title}`);
                      }}
                      className="w-8 h-8 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        triggerHaptic('light');
                        alert(`Ulashildi: ${quiz.title}`);
                      }}
                      className="w-8 h-8 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:text-white transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onStartQuiz?.(quiz)}
                      className="w-8 h-8 rounded-full bg-neon-blue/10 text-neon-blue flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 glass-card rounded-2xl border-dashed border-white/10">
                <p className="text-xs text-white/20">Hali testlar yaratilmagan</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer Trigger */}
        <div className="mb-8">
          <button 
            onClick={() => setShowDisclaimer(true)}
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-white/20" />
              <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Disclaimer</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-white/20 rotate-180 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Help Modal */}
        <AnimatePresence>
          {showHelp && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHelp(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                className="relative w-full max-w-lg glass-card rounded-[40px] p-8 overflow-hidden max-h-[80vh] overflow-y-auto hide-scrollbar"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold">Qo‘llanma</h3>
                  <button 
                    onClick={() => setShowHelp(false)}
                    className="p-2 rounded-full bg-white/5 text-white/40"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-8">
                  {tools.map((tool) => (
                    <div key={tool.id} className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${tool.color} flex items-center justify-center shrink-0`}>
                        {tool.icon}
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">{tool.title}</h4>
                        <p className="text-sm text-white/60 leading-relaxed">{tool.help}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowHelp(false)}
                  className="w-full mt-10 py-4 bg-neon-blue text-black font-bold rounded-2xl shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                >
                  Tushunarlidir
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* Disclaimer Modal */}
        <AnimatePresence>
          {showDisclaimer && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDisclaimer(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="relative w-full max-w-lg glass-card rounded-[40px] p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-neon-blue" />
                    <h3 className="text-xl font-bold">Akademik Mas'uliyat</h3>
                  </div>
                  <button onClick={() => setShowDisclaimer(false)} className="p-2 rounded-full bg-white/5">
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                </div>
                <p className="text-sm text-white/60 leading-relaxed italic mb-8">
                  Mazkur platforma doirasida shakllantiriladigan barcha intellektual materiallar ilg'or sun'iy intellekt algoritmlari asosida generatsiya qilinadi. 
                  AI tizimlari kognitiv tahlil jarayonida texnik yoki mazmuniy noaniqliklarga yo'l qo'yishi ehtimoldan xoli emas. 
                  Olingan natijalarni akademik standartlarga muvofiqligini mustaqil ravishda verifikatsiya qilish tavsiya etiladi.
                </p>
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl"
                >
                  Yopish
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (mode === 'session') {
    return (
      <div className="px-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMode('hub')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold">Sessiya Rejimi</h2>
          </div>
          <Users className="w-6 h-6 text-fuchsia-400" />
        </div>

        <div className="space-y-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setQuizCategory('session');
              setMode('manual');
            }}
            className="w-full p-6 glass-card rounded-[32px] border border-fuchsia-500/20 flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center">
              <Plus className="w-6 h-6 text-fuchsia-400" />
            </div>
            <div>
              <h4 className="font-bold">Sessiya Yaratish</h4>
              <p className="text-xs text-white/40">Yangi guruh va savollar to'plami</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-6 glass-card rounded-[32px] border border-white/5 flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Link className="w-6 h-6 text-white/40" />
            </div>
            <div>
              <h4 className="font-bold">Sessiyaga Qo'shilish</h4>
              <p className="text-xs text-white/40">Havola orqali guruhga kiring</p>
            </div>
          </motion.button>
        </div>

        <div className="mb-8">
          <h5 className="text-[10px] uppercase font-bold text-white/20 mb-4 tracking-widest px-1">Mavjud Sessiyalar</h5>
          <div className="space-y-3">
            {quizzes.filter(q => q.category === 'session').map((quiz, i) => (
              <div key={quiz.id} className="glass-card p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-xl">
                    👥
                  </div>
                  <div>
                    <h6 className="text-sm font-bold">{quiz.title}</h6>
                    <span className="text-[10px] text-white/40">{quiz.questionsCount} savol • Faol</span>
                  </div>
                </div>
                <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {quizzes.filter(q => q.category === 'session').length === 0 && (
              <div className="text-center py-8 glass-card rounded-2xl border-dashed border-white/10">
                <p className="text-xs text-white/20">Hali sessiyalar yaratilmagan</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-[32px] bg-white/5 border border-white/10">
          <h6 className="text-[10px] uppercase font-bold text-fuchsia-400 mb-3 tracking-widest">Format Tushuntirishi</h6>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] text-white/60 mb-2 font-mono">Format 1:</p>
              <div className="bg-black/20 p-3 rounded-xl text-[10px] font-mono text-white/40">
                Savol?<br/>1<br/>2<br/>3<br/>#4 (to'g'ri)<br/>#current (joriy)
              </div>
            </div>
            <div>
              <p className="text-[11px] text-white/60 mb-2 font-mono">Format 2:</p>
              <div className="bg-black/20 p-3 rounded-xl text-[10px] font-mono text-white/40">
                Savol?<br/>a<br/>b<br/>c<br/>d
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'manual') {
    const handleSave = () => {
      if (!quizTitle.trim()) return;
      onSaveQuiz?.({
        id: Date.now().toString(),
        title: quizTitle,
        category: quizCategory,
        questionsCount: questions.length,
        icon: quizCategory === 'session' ? '👥' : '📝',
        timeAgo: 'Hozir'
      });
      setQuizTitle('');
      setQuestions([{ id: 1, text: '', options: ['', '', '', ''], correct: 0 }]);
      setMode('hub');
      triggerHaptic('medium');
    };

    return (
      <div className="px-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMode('hub')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold">Yangi Test</h2>
          </div>
          <button 
            onClick={handleSave}
            className="p-2 bg-neon-blue/10 text-neon-blue rounded-xl border border-neon-blue/20"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">Test Nomi</label>
              <input 
                type="text" 
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Masalan: Fizika asoslari"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-neon-blue outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">Fan (Kategoriya)</label>
              <select 
                value={quizCategory}
                onChange={(e) => setQuizCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-neon-blue outline-none transition-colors appearance-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-[#0f172a]">{cat.name}</option>
                ))}
                <option value="session" className="bg-[#0f172a]">Sessiya (Guruh)</option>
              </select>
            </div>
          </div>

        {questions.map((q, idx) => (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-3xl border-l-4 border-neon-blue"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-neon-blue">Question {idx + 1}</span>
              <button className="text-white/20 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <textarea 
              placeholder="Enter your question here..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm mb-4 min-h-[100px] outline-none focus:border-neon-blue transition-colors"
            />

            <div className="grid grid-cols-1 gap-3">
              {[0, 1, 2, 3].map((opt) => (
                <div key={opt} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={`Option ${opt + 1}`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-neon-blue transition-colors"
                  />
                  <button className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${opt === 0 ? 'bg-neon-green/20 border-neon-green text-neon-green' : 'border-white/10 text-white/20'}`}>
                    {opt === 0 ? <Plus className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <button 
          onClick={() => setQuestions([...questions, { id: Date.now(), text: '', options: ['', '', '', ''], correct: 0 }])}
          className="w-full py-4 border-2 border-dashed border-white/10 rounded-3xl text-white/40 hover:text-white/60 hover:border-white/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Question
        </button>
      </div>
    </div>
  );
}
}
