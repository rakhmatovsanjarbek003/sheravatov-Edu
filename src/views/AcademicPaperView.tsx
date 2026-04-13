import { BookOpen, Download, FileText, List, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { triggerHaptic } from '../lib/haptics';

interface Props {
  onBack?: () => void;
}

export default function AcademicPaperView({ onBack }: Props) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [paper, setPaper] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    triggerHaptic('medium');

    try {
      const res = await fetch('/api/generate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setPaper(data.paper);
      triggerHaptic('success');
    } catch (error) {
      console.error(error);
      triggerHaptic('error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="px-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="p-3 bg-rose-500/20 rounded-2xl">
          <BookOpen className="w-6 h-6 text-rose-400" />
        </div>
        <h2 className="text-2xl font-bold">Academic Paper AI</h2>
      </div>

      {!paper ? (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl">
            <label className="text-[10px] uppercase font-bold text-white/40 mb-3 block">Research Topic</label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The impact of AI on modern education"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-rose-400 transition-colors"
            />
          </div>

          <button 
            disabled={!topic.trim() || isGenerating}
            onClick={handleGenerate}
            className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
              !topic.trim() || isGenerating ? 'bg-white/5 text-white/20' : 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]'
            }`}
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Paper'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[40px] border-t-8 border-rose-500">
            <h1 className="text-2xl font-bold mb-4">{paper.title}</h1>
            <div className="mb-8">
              <span className="text-[10px] uppercase font-bold text-rose-400 block mb-2">Abstract</span>
              <p className="text-sm text-white/60 leading-relaxed italic">{paper.abstract}</p>
            </div>

            <div className="space-y-8">
              {paper.chapters.map((ch: any, i: number) => (
                <div key={i}>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-3">
                    <span className="text-rose-400/40 font-mono">0{i + 1}</span>
                    {ch.title}
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed">{ch.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setPaper(null)}
              className="py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold"
            >
              New Paper
            </button>
            <button className="py-4 rounded-2xl bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download .docx
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
