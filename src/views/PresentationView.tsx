import { Presentation, Download, Layout, Type, ChevronRight, Loader2, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { triggerHaptic } from '../lib/haptics';

interface Props {
  onBack?: () => void;
}

export default function PresentationView({ onBack }: Props) {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    triggerHaptic('medium');

    try {
      const res = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setSlides(data.slides);
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
        <div className="p-3 bg-purple-500/20 rounded-2xl">
          <Presentation className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold">Presentation AI</h2>
      </div>

      {!slides.length ? (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl">
            <label className="text-[10px] uppercase font-bold text-white/40 mb-3 block">Paste your text or article</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the content you want to convert into slides..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm min-h-[200px] outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          <button 
            disabled={!text.trim() || isGenerating}
            onClick={handleGenerate}
            className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
              !text.trim() || isGenerating ? 'bg-white/5 text-white/20' : 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
            }`}
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Slides'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white/40">{slides.length} Slides Generated</span>
            <button className="flex items-center gap-2 text-xs font-bold text-purple-400 bg-purple-400/10 px-4 py-2 rounded-full border border-purple-400/20">
              <Download className="w-4 h-4" />
              Download .pptx
            </button>
          </div>

          <div className="space-y-4">
            {slides.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-3xl border-l-4 border-purple-400"
              >
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-purple-400/20 text-purple-400 text-[10px] flex items-center justify-center">{i + 1}</span>
                  {s.title}
                </h4>
                <ul className="space-y-2">
                  {s.bullets.map((b: string, bi: number) => (
                    <li key={bi} className="text-xs text-white/60 flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => setSlides([])}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white/40"
          >
            Start New Presentation
          </button>
        </div>
      )}
    </div>
  );
}
