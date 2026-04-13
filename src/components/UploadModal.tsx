import React, { useState, useRef } from 'react';
import { X, FileUp, CheckCircle2, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../lib/haptics';
import { apiProvider } from '../api/client';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onQuizParsed: (questions: any[], isSession: boolean) => void;
}

export default function UploadModal({ isOpen, onClose, onQuizParsed }: Props) {
  const [step, setStep] = useState<'upload' | 'parsing' | 'verify'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<'marker' | 'delimiter' | 'ai'>('ai');
  const [isSession, setIsSession] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      triggerHaptic('light');
    }
  };

  const startParsing = async () => {
    if (!file) return;
    setStep('parsing');
    triggerHaptic('medium');

    // Simulate Liquid Fill Progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    try {
      const { questions } = await apiProvider.uploadAndParseQuiz(file, preset);
      
      setParsedQuestions(questions);
      setTimeout(() => {
        setStep('verify');
        triggerHaptic('success');
      }, 2500); // Wait for animation
    } catch (error) {
      console.error(error);
      triggerHaptic('error');
      setStep('upload');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card w-full max-w-sm rounded-[40px] overflow-hidden relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {step === 'upload' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-2">Upload & Quiz</h2>
              <p className="text-xs text-white/40 mb-6">PDF, DOCX yoki TXT fayllarini yuklang.</p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                <h4 className="text-[10px] uppercase font-bold text-neon-blue mb-2 tracking-widest">Qanday shaklda yuborish kerak?</h4>
                <ul className="space-y-2">
                  <li className="text-[10px] text-white/60 flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-neon-blue mt-1.5 shrink-0" />
                    Savol va 4 ta variant (A, B, C, D) aniq yozilgan bo'lishi kerak.
                  </li>
                  <li className="text-[10px] text-white/60 flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-neon-blue mt-1.5 shrink-0" />
                    To'g'ri javobni # yoki + belgisi bilan ajratib ko'rsating (Marker-based).
                  </li>
                  <li className="text-[10px] text-white/60 flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-neon-blue mt-1.5 shrink-0" />
                    Yoki AI Discovery formatini tanlang, tizim o'zi aniqlaydi.
                  </li>
                </ul>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 hover:border-neon-blue/40 transition-colors cursor-pointer mb-6 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileUp className="w-6 h-6 text-neon-blue" />
                </div>
                <span className="text-xs font-medium text-white/60">{file ? file.name : 'Faylni tanlang'}</span>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.txt" />
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] uppercase font-bold text-white/20">Sessiya sifatida yaratish</span>
                  <button 
                    onClick={() => {
                      setIsSession(!isSession);
                      triggerHaptic('light');
                    }}
                    className={`w-10 h-5 rounded-full relative transition-colors ${isSession ? 'bg-fuchsia-500' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: isSession ? 20 : 2 }}
                      className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>
                <span className="text-[10px] uppercase font-bold text-white/20">Formatni tanlang</span>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'ai', label: 'AI Discovery (Tavsiya etiladi)', desc: 'Gemini formatni avtomatik aniqlaydi' },
                    { id: 'marker', label: 'Marker-based (#, +)', desc: 'To\'g\'ri javoblar belgilar bilan ko\'rsatilgan' },
                    { id: 'delimiter', label: 'Delimiter-based (====)', desc: 'Savollar chiziqlar bilan ajratilgan' }
                  ].map((p) => (
                    <button 
                      key={p.id}
                      onClick={() => setPreset(p.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${preset === p.id ? 'border-neon-blue bg-neon-blue/10' : 'border-white/5 bg-white/5'}`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-bold">{p.label}</span>
                        {preset === p.id && <CheckCircle2 className="w-3 h-3 text-neon-blue" />}
                      </div>
                      <p className="text-[9px] text-white/40">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={!file}
                onClick={startParsing}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${file ? 'bg-neon-blue text-[#0f172a]' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
              >
                Start Parsing
              </button>
            </div>
          )}

          {step === 'parsing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden mb-8">
                {/* Liquid Fill Animation */}
                <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: `${100 - progress}%` }}
                  className="absolute inset-0 bg-neon-blue"
                  style={{ borderRadius: '0' }}
                >
                  <div className="absolute top-0 left-0 w-[200%] h-4 bg-neon-blue -translate-y-1/2 animate-wave opacity-50" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-2xl font-bold">{progress}%</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">AI is Parsing...</h3>
              <p className="text-xs text-white/40 text-center">Identifying questions and answers using {preset.toUpperCase()} logic.</p>
            </div>
          )}

          {step === 'verify' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-2">Verify & Correct</h2>
              <p className="text-xs text-white/40 mb-6">Tizim quyidagicha aniqladi. To'g'rimi?</p>

              <div className="space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar mb-8 pr-2">
                {parsedQuestions.slice(0, 3).map((q, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-bold text-neon-blue uppercase mb-2 block">Sample {i + 1}</span>
                    <p className="text-sm font-bold mb-3">{q.text}</p>
                    <div className="space-y-1">
                      {q.options.map((opt: string, oi: number) => (
                        <div key={oi} className={`text-[10px] p-2 rounded-lg flex justify-between items-center ${oi === q.correctAnswer ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'text-white/40'}`}>
                          <span>{String.fromCharCode(65 + oi)}) {opt}</span>
                          {oi === q.correctAnswer && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {parsedQuestions.length > 3 && (
                  <p className="text-center text-[10px] text-white/20">+{parsedQuestions.length - 3} more questions detected</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setStep('upload')}
                  className="py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => onQuizParsed(parsedQuestions, isSession)}
                  className="py-4 rounded-2xl bg-neon-blue text-[#0f172a] text-sm font-bold flex items-center justify-center gap-2"
                >
                  Confirm
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
