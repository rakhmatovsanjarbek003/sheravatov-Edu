import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { apiProvider } from '../api/client';

interface Props {
  recentResults?: any[];
}

export default function AICoach({ recentResults = [] }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Salom! Men sizning shaxsiy AI murabbiyingizman. Qanday yordam bera olaman?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [insightIndex, setInsightIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const insights = [
    "Statistik tahlillar shuni ko'rsatadiki, muntazam takrorlash bilimlarni mustahkamlashning eng samarali usulidir. 📊",
    "Sizning so'nggi natijalaringiz o'sish tendensiyasini namoyon etmoqda. Tizimli yondashuvni davom ettiring. 📈",
    "Kognitiv yuklamani kamaytirish maqsadida murakkab mavzularni qismlarga bo'lib o'rganish tavsiya etiladi. 🧠",
    "Xatolar ustida ishlash metodologiyasi bilimlarni o'zlashtirish darajasini sezilarli darajada oshiradi. 🎯",
    "Intellektual salohiyatni rivojlantirish uchun har kuni yuqori konsentratsiyali mashg'ulotlar o'tkazish zarur. ⏱️"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % insights.length);
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isExpanded]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const contextString = recentResults.length > 0 
        ? `Foydalanuvchining so'nggi natijalari tahlili: ${JSON.stringify(recentResults)}. `
        : '';

      const reply = await apiProvider.chat(input, messages, contextString);

      const aiMsg: Message = { role: 'ai', content: reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to AI. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="px-4 mb-8">
      {/* AI Insights Bubble */}
      <AnimatePresence mode="wait">
        {!isExpanded && (
          <motion.div
            key={insightIndex}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mb-3 p-3 bg-neon-blue/5 border border-neon-blue/10 rounded-2xl relative overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-neon-blue shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-white/70 line-clamp-3 italic">
                {insights[insightIndex]}
              </p>
            </div>
            {/* Progress bar for insight update */}
            <motion.div 
              key={`progress-${insightIndex}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="absolute bottom-0 left-0 h-[1px] bg-neon-blue/30"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        initial={false}
        className={`glass-card rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 ${
          isExpanded ? 'h-[320px]' : 'h-[64px]'
        }`}
      >
        {/* Minimalist Header / Toggle */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-4 flex items-center justify-between w-full hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
              <Sparkles className="w-4 h-4 text-neon-blue" />
            </div>
            {!isExpanded && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm font-medium text-white/60"
              >
                AI Coach is ready to help...
              </motion.span>
            )}
          </div>
          <div className={`w-6 h-6 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Chat Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-white/10 border border-white/10 rounded-tr-none' 
                        : 'bg-neon-blue/10 border border-neon-blue/20 text-neon-blue rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-neon-blue/5 border border-neon-blue/10 p-3 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-neon-blue/50 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-neon-blue/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-neon-blue/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask your coach anything..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-neon-blue/50 transition-colors"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
