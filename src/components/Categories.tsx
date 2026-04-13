import { Calculator, FlaskConical, Landmark, Languages, Code2, Atom, BookOpenText, Microscope, Map, Palette, Music, Trophy, BrainCircuit, LineChart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categories = [
  { 
    id: 'math', 
    name: 'Mathematics', 
    icon: <Calculator />, 
    color: 'text-cyan-400', 
    neon: 'shadow-[0_0_15px_rgba(34,211,238,0.4)]',
    description: 'Algebra, Geometry and Calculus'
  },
  { 
    id: 'programming', 
    name: 'Programming', 
    icon: <Code2 />, 
    color: 'text-lime-400', 
    neon: 'shadow-[0_0_15px_rgba(163,230,53,0.4)]',
    description: 'Python, React and TypeScript'
  },
  { 
    id: 'history', 
    name: 'History', 
    icon: <Landmark />, 
    color: 'text-amber-400', 
    neon: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]',
    description: 'Ancient and Modern History'
  },
  { 
    id: 'physics', 
    name: 'Physics', 
    icon: <Atom />, 
    color: 'text-violet-400', 
    neon: 'shadow-[0_0_15px_rgba(167,139,250,0.4)]',
    description: 'Quantum and Classical Physics'
  },
  { 
    id: 'chemistry', 
    name: 'Chemistry', 
    icon: <FlaskConical />, 
    color: 'text-emerald-400', 
    neon: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]',
    description: 'Organic and Inorganic Chemistry'
  },
  { 
    id: 'biology', 
    name: 'Biology', 
    icon: <Microscope />, 
    color: 'text-green-400', 
    neon: 'shadow-[0_0_15px_rgba(74,222,128,0.4)]',
    description: 'Genetics and Human Anatomy'
  },
  { 
    id: 'literature', 
    name: 'Literature', 
    icon: <BookOpenText />, 
    color: 'text-orange-400', 
    neon: 'shadow-[0_0_15px_rgba(251,146,60,0.4)]',
    description: 'Classic and Modern Literature'
  },
  { 
    id: 'geography', 
    name: 'Geography', 
    icon: <Map />, 
    color: 'text-sky-400', 
    neon: 'shadow-[0_0_15px_rgba(56,189,248,0.4)]',
    description: 'World Maps and Geopolitics'
  },
  { 
    id: 'art', 
    name: 'Art', 
    icon: <Palette />, 
    color: 'text-pink-400', 
    neon: 'shadow-[0_0_15px_rgba(244,114,182,0.4)]',
    description: 'Art History and Techniques'
  },
  { 
    id: 'music', 
    name: 'Music', 
    icon: <Music />, 
    color: 'text-indigo-400', 
    neon: 'shadow-[0_0_15px_rgba(129,140,248,0.4)]',
    description: 'Theory and Music History'
  },
  { 
    id: 'sports', 
    name: 'Sports', 
    icon: <Trophy />, 
    color: 'text-yellow-400', 
    neon: 'shadow-[0_0_15px_rgba(250,204,21,0.4)]',
    description: 'Sports Rules and History'
  },
  { 
    id: 'psychology', 
    name: 'Psychology', 
    icon: <BrainCircuit />, 
    color: 'text-fuchsia-400', 
    neon: 'shadow-[0_0_15px_rgba(232,121,249,0.4)]',
    description: 'Human Behavior and Mind'
  },
  { 
    id: 'economics', 
    name: 'Economics', 
    icon: <LineChart />, 
    color: 'text-teal-400', 
    neon: 'shadow-[0_0_15px_rgba(45,212,191,0.4)]',
    description: 'Micro and Macro Economics'
  },
  { 
    id: 'english', 
    name: 'English', 
    icon: <Languages />, 
    color: 'text-rose-400', 
    neon: 'shadow-[0_0_15px_rgba(251,113,133,0.4)]',
    description: 'Grammar and Vocabulary'
  }
];

interface Props {
  onSelect: (id: string) => void;
  selectedId?: string;
}

export default function Categories({ onSelect, selectedId }: Props) {
  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Rasmiy Fanlar</h3>
        <span className="text-[8px] uppercase font-bold text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded-full border border-neon-blue/20">Admin Yuklagan</span>
      </div>
      
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 scroll-smooth">
          {categories.map((cat) => (
            <div key={cat.id} className="relative group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(cat.id)}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl glass-card min-w-[110px] transition-all ${
                  selectedId === cat.id ? `border-current ${cat.neon} bg-white/5` : 'hover:border-white/20'
                } ${cat.color}`}
              >
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 transition-all group-hover:scale-110`}>
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{cat.name}</span>
              </motion.button>
              
            <AnimatePresence>
              {selectedId === cat.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-[9px] font-medium px-3 py-1.5 rounded-full border border-white/10 z-10 whitespace-nowrap"
                >
                  {cat.description}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/10 border-t border-l border-white/10 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          ))}
        </div>
        
        {/* Subtle Next Indicator */}
        <motion.div 
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-full bg-gradient-to-l from-[#0f172a] to-transparent pointer-events-none flex items-center justify-end pr-1 opacity-50"
        >
          <div className="w-1 h-4 bg-white/30 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
