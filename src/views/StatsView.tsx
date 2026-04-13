import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, TrendingUp, Brain, Users, Heart, ChevronRight } from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

const STATS_TABS = [
  { id: 'general', name: 'Umumiy', icon: <Star className="w-3 h-3" /> },
  { id: 'math', name: 'Matematika', icon: <TrendingUp className="w-3 h-3" /> },
  { id: 'programming', name: 'Dasturlash', icon: <Brain className="w-3 h-3" /> },
  { id: 'session', name: 'Sessiyalar', icon: <Users className="w-3 h-3" /> },
];

const RANKING_DATA = {
  general: [
    { name: 'Ali', score: 2450, rank: 1, avatar: 'https://picsum.photos/seed/1/40/40', likes: 120 },
    { name: 'Vali', score: 2300, rank: 2, avatar: 'https://picsum.photos/seed/2/40/40', likes: 95 },
    { name: 'Siz', score: 2150, rank: 4, avatar: 'https://picsum.photos/seed/ali/40/40', likes: 88, isMe: true },
    { name: 'Gani', score: 2100, rank: 5, avatar: 'https://picsum.photos/seed/4/40/40', likes: 70 },
  ],
  math: [
    { name: 'Zafar', score: 980, rank: 1, avatar: 'https://picsum.photos/seed/5/40/40', likes: 45 },
    { name: 'Siz', score: 850, rank: 2, avatar: 'https://picsum.photos/seed/ali/40/40', likes: 38, isMe: true },
    { name: 'Bekzod', score: 820, rank: 3, avatar: 'https://picsum.photos/seed/6/40/40', likes: 30 },
  ],
  programming: [
    { name: 'Jasur', score: 1200, rank: 1, avatar: 'https://picsum.photos/seed/7/40/40', likes: 60 },
    { name: 'Siz', score: 1150, rank: 2, avatar: 'https://picsum.photos/seed/ali/40/40', likes: 55, isMe: true },
    { name: 'Dilshod', score: 900, rank: 3, avatar: 'https://picsum.photos/seed/8/40/40', likes: 40 },
  ],
  session: [
    { name: 'IELTS Group', score: 4500, rank: 1, avatar: '👥', likes: 250 },
    { name: 'Python Pro', score: 4200, rank: 2, avatar: '👥', likes: 180 },
    { name: 'Sizning Guruh', score: 3800, rank: 3, avatar: '👥', likes: 150, isMe: true },
  ]
};

export default function StatsView() {
  const [activeTab, setActiveTab] = useState('general');

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    triggerHaptic('light');
  };

  return (
    <div className="px-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Statistika</h2>
        <div className="p-2 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
          <Trophy className="w-5 h-5 text-neon-blue" />
        </div>
      </div>

      {/* Horizontal Tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-2">
        {STATS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all border ${
              activeTab === tab.id 
                ? 'bg-neon-blue text-black border-neon-blue font-bold shadow-[0_0_15px_rgba(0,242,255,0.3)]' 
                : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
            }`}
          >
            {tab.icon}
            <span className="text-[11px] uppercase tracking-wider">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Ranking List */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between px-1">
          <h5 className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Reyting</h5>
          <span className="text-[10px] text-white/40">Siz {RANKING_DATA[activeTab as keyof typeof RANKING_DATA].find(r => r.isMe)?.rank}-o'rindasiz</span>
        </div>
        
        <div className="space-y-3">
          {RANKING_DATA[activeTab as keyof typeof RANKING_DATA].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 rounded-2xl flex items-center justify-between border ${
                item.isMe ? 'border-neon-blue/40 bg-neon-blue/5' : 'border-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  item.rank === 1 ? 'bg-yellow-400 text-black' : 
                  item.rank === 2 ? 'bg-slate-300 text-black' : 
                  item.rank === 3 ? 'bg-amber-600 text-black' : 'bg-white/5 text-white/40'
                }`}>
                  {item.rank}
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center text-xl">
                  {item.avatar.startsWith('http') ? (
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.avatar
                  )}
                </div>
                <div>
                  <h6 className="text-sm font-bold">{item.name} {item.isMe && <span className="text-[10px] text-neon-blue ml-1">(Siz)</span>}</h6>
                  <p className="text-[10px] text-white/40">{item.score.toLocaleString()} ball</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[10px] text-white/40">
                  <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                  {item.likes}
                </div>
                <ChevronRight className="w-4 h-4 text-white/10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Recommendation Section */}
      <div className="glass-card p-6 rounded-[32px] border border-neon-blue/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain className="w-24 h-24 text-neon-blue" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-neon-blue" />
            <h5 className="text-[10px] uppercase font-bold text-neon-blue tracking-widest">AI Tavsiya</h5>
          </div>
          <p className="text-sm text-white/80 leading-relaxed mb-6">
            Sizning dasturlash bo'yicha natijalaringiz a'lo darajada (Top 2%). 
            Lekin matematika bo'yicha "Logarifmlar" mavzusida biroz oqsayapsiz. 
            Bugun ushbu mavzuga 20 daqiqa vaqt ajratishni tavsiya qilaman.
          </p>
          <button className="w-full py-3 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue rounded-xl text-xs font-bold hover:bg-neon-blue/20 transition-all">
            Mavzuni boshlash
          </button>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
