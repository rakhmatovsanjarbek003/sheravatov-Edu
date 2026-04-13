import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Brain, FileUp, Trophy, Presentation, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    id: 2,
    title: "AI-Generated Path",
    description: "Generate quiz from any topic.",
    icon: <Brain className="w-12 h-12 text-neon-blue" />,
    color: "from-blue-500/20 to-cyan-500/20",
    btnColor: "bg-neon-blue text-black",
    btnText: "Create Now"
  },
  {
    id: 3,
    title: "Upload & Quiz",
    description: "Upload a file and get quiz instantly.",
    icon: <FileUp className="w-12 h-12 text-sky-400" />,
    color: "from-sky-500/20 to-indigo-500/20",
    btnColor: "bg-sky-400 text-black",
    btnText: "Upload"
  },
  {
    id: 4,
    title: "Presentation AI",
    description: "Convert text to slides instantly.",
    icon: <Presentation className="w-12 h-12 text-purple-400" />,
    color: "from-purple-500/20 to-pink-500/20",
    btnColor: "bg-purple-400 text-white",
    btnText: "Generate Slides"
  },
  {
    id: 5,
    title: "Academic Paper",
    description: "AI-powered research assistant.",
    icon: <BookOpen className="w-12 h-12 text-rose-400" />,
    color: "from-rose-500/20 to-red-500/20",
    btnColor: "bg-rose-400 text-white",
    btnText: "Write Paper"
  },
  {
    id: 6,
    title: "Session Mode",
    description: "Memorize questions with friends.",
    icon: <Brain className="w-12 h-12 text-fuchsia-400" />,
    color: "from-fuchsia-500/20 to-purple-500/20",
    btnColor: "bg-fuchsia-400 text-black",
    btnText: "Start Session"
  },
  {
    id: 7,
    title: "Challenge",
    description: "Compete with friends.",
    icon: <Trophy className="w-12 h-12 text-amber-400" />,
    color: "from-amber-500/20 to-orange-500/20",
    btnColor: "bg-amber-400 text-black",
    btnText: "Challenge"
  }
];

interface Props {
  onAction?: (id: number) => void;
}

export default function FeatureCarousel({ onAction }: Props) {
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, offsetWidth, scrollWidth } = scrollRef.current;
        const nextScroll = scrollLeft + offsetWidth;
        
        if (nextScroll >= scrollWidth) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
        }
      }
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveDot(index);
  };

  return (
    <div className="px-4 mb-8">
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
        onScroll={handleScroll}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            className={`min-w-[280px] md:min-w-[320px] p-6 rounded-3xl glass-card snap-center bg-gradient-to-br ${feature.color} flex flex-col justify-between h-56`}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start">
              <div className="max-w-[180px]">
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{feature.description}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                {feature.icon}
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction?.(feature.id)}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-transform ${feature.btnColor}`}
            >
              {feature.btnText}
            </motion.button>
          </motion.div>
        ))}
      </div>
      
      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {features.map((_, dot) => (
          <div 
            key={dot} 
            className={`h-1.5 rounded-full transition-all duration-300 ${activeDot === dot ? 'w-8 bg-neon-blue' : 'w-2 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}
