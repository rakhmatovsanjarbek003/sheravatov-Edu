import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, MessageSquare, Plus, Heart, Share2, MoreHorizontal, Video, BookOpen, Crown, Edit3, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

type Section = 'ustozlar' | 'chatlar' | 'kurslar' | 'darsliklar';

// Mock Data
const USTOZLAR = [
  { id: 1, name: 'Jasur Sheravatov', handle: '@jasur_ai', role: 'Python & AI Mentor', rating: 4.9, students: '12.4k', img: 'https://picsum.photos/seed/j1/100/100', isPro: true },
  { id: 2, name: 'Malika Umarova', handle: '@malika_eng', role: 'IELTS Expert 8.5', rating: 5.0, students: '8.2k', img: 'https://picsum.photos/seed/m1/100/100', isPro: false },
];

const THREADS = [
  { id: 1, author: 'Jasur Sheravatov', handle: '@jasur_ai', time: '2s oldin', content: 'Yangi "Python asoslari" bepul kursni platformaga yukladim. Barcha o\'quvchilar qo\'shilishlari mumkin! 🔥', likes: 124, replies: 12, img: 'https://picsum.photos/seed/j1/100/100' },
  { id: 2, author: 'Sardor', handle: '@s23_coder', time: '1s oldin', content: 'Groq API bilan ishlashda Limit muammosini qanday aylanib o\'tyapsizlar?', likes: 14, replies: 5, img: 'https://picsum.photos/seed/s2/100/100' },
];

const DARSLIKLAR = [
  { id: 1, title: 'Informatika - OTM uchun', type: 'Test', count: '45 savol', author: 'Jasur Sheravatov' },
  { id: 2, title: 'Tarix: Amir Temur davlati', type: 'Mustaqil ish', count: '10 bet', author: 'Tizim AI' },
];

export default function CommunityView({ onBack, onOpenAdmin }: { onBack?: () => void, onOpenAdmin?: () => void }) {
  const [activeTab, setActiveTab] = useState<Section>('ustozlar');
  const [search, setSearch] = useState('');
  
  // A simple boolean check for demo purpose. In real app, this comes from TG Context.
  const isTeacher = true; 

  const handleTab = (t: Section) => {
      setActiveTab(t);
      triggerHaptic('selection');
  };

  return (
    <div className="absolute inset-0 z-[150] bg-[#0f172a] overflow-y-auto hide-scrollbar pb-32 animate-in slide-in-from-right-8 duration-500">
       {/* Background Glows */}
       <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-neon-blue/10 blur-[120px] rounded-full" />
      </div>

      <div className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/5 pt-10 pb-4">
          <div className="px-4 mb-4 flex items-center gap-3">
              {onBack && (
                  <button onClick={() => { triggerHaptic('medium'); onBack(); }} className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/5 active:scale-95">
                      <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
              )}
              <h2 className="text-2xl font-black text-white">Hamjamiyat</h2>
          </div>
          
          <div className="px-4 mb-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                 <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Izlash..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder:text-white/40 focus:border-neon-blue/40 outline-none transition"/>
              </div>
          </div>

          <div className="flex gap-2 px-4 overflow-x-auto hide-scrollbar pb-1">
             {(['ustozlar', 'chatlar', 'kurslar', 'darsliklar'] as Section[]).map(t => (
                 <button key={t} onClick={() => handleTab(t)} className={`px-4 py-2 shrink-0 rounded-2xl text-[11px] font-bold uppercase transition flex items-center gap-1.5 ${activeTab === t ? 'bg-white text-black' : 'bg-white/5 text-white/40 border border-white/5 hover:text-white/80'}`}>
                    {t}
                 </button>
             ))}
          </div>
      </div>

      <div className="px-4 pt-4">
          <AnimatePresence mode="wait">
             <motion.div key={activeTab} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{duration:0.2}}>
                 {activeTab === 'ustozlar' && <UstozlarFeed isTeacher={isTeacher} onOpenAdmin={onOpenAdmin} />}
                 {activeTab === 'chatlar' && <ThreadsFeed />}
                 {activeTab === 'darsliklar' && <DarsliklarFeed />}
                 {activeTab === 'kurslar' && <KurslarFeed />}
             </motion.div>
          </AnimatePresence>
      </div>

       {/* Floating Action Button for Teachers in Chat/Darsliklar */}
       {(activeTab === 'chatlar' || (isTeacher && activeTab === 'darsliklar')) && (
           <motion.button whileTap={{scale:0.9}} className="fixed bottom-24 right-4 w-14 h-14 bg-neon-blue rounded-full flex items-center justify-center text-[#0f172a] shadow-[0_0_20px_rgba(0,242,255,0.4)] z-[200]">
               {activeTab === 'chatlar' ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
           </motion.button>
       )}
    </div>
  );
}

function UstozlarFeed({ isTeacher, onOpenAdmin }: { isTeacher: boolean, onOpenAdmin?: () => void }) {
    return (
        <div className="space-y-4">
            {isTeacher && (
               <div className="glass-card rounded-2xl p-4 border border-neon-blue/20 bg-neon-blue/5 mb-6">
                   <h4 className="font-bold text-sm mb-1 text-left">Mening ustozlik panelim</h4>
                   <p className="text-[11px] text-white/50 mb-3 text-left">Kurslar yoki testlar qo'shishingiz, nazorat qilishingiz mumkin.</p>
                   <button 
                     onClick={() => onOpenAdmin ? onOpenAdmin() : alert("Admin paneli yuklanmoqda...")}
                     className="text-[10px] bg-neon-blue text-black font-bold px-4 py-2 rounded-xl active:scale-95 transition-transform"
                   >
                     Boshqaruv Paneli &rarr;
                   </button>
               </div>
            )}
            
            {USTOZLAR.map(u => (
                <div key={u.id} className="glass-card rounded-[24px] p-4 flex gap-4 items-start border border-white/5">
                    <img src={u.img} className="w-16 h-16 rounded-full border border-white/10" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold flex items-center gap-1">{u.name} {u.isPro && <Crown className="w-3 h-3 text-amber-400"/>}</h3>
                                <p className="text-[11px] text-white/40">{u.handle}</p>
                            </div>
                            <div className="flex gap-1 items-center bg-white/5 px-2 py-1 rounded-lg">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-[10px] font-bold">{u.rating}</span>
                            </div>
                        </div>
                        <p className="text-xs text-neon-blue font-medium mt-1">{u.role}</p>
                        <p className="text-[10px] text-white/50 mt-1">{u.students} obunachi</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ThreadsFeed() {
    return (
        <div className="space-y-6 isolate">
            <div className="absolute left-9 top-40 bottom-0 w-[1px] bg-white/5 -z-10" />
            
            {THREADS.map(t => (
                <div key={t.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                       <img src={t.img} className="w-10 h-10 rounded-full border-2 border-[#0f172a]" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-sm text-white">{t.author}</h4>
                            <span className="text-[10px] text-white/40">{t.time}</span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed mb-3">{t.content}</p>
                        
                        <div className="flex gap-4 items-center mb-2 text-white/40">
                             <button className="flex items-center gap-1.5 text-xs hover:text-neon-pink transition"><Heart className="w-4 h-4"/> {t.likes}</button>
                             <button className="flex items-center gap-1.5 text-xs hover:text-white transition"><MessageSquare className="w-4 h-4"/> {t.replies}</button>
                             <button className="col-start-3 ml-auto hover:text-white"><Share2 className="w-4 h-4"/></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function DarsliklarFeed() {
    return (
        <div className="space-y-3">
             {DARSLIKLAR.map(d => (
                 <div key={d.id} className="glass-card p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-colors flex justify-between items-center">
                     <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex justify-center items-center">
                             {d.type === 'Test' ? <Star className="w-5 h-5 text-neon-blue" /> : <BookOpen className="w-5 h-5 text-neon-purple" />}
                         </div>
                         <div>
                             <h4 className="font-bold text-sm text-white">{d.title}</h4>
                             <div className="flex gap-2 items-center text-[10px] text-white/40 mt-1">
                                <span className="bg-white/10 px-2 py-0.5 rounded-full">{d.type}</span>
                                <span>•</span>
                                <span>{d.count}</span>
                             </div>
                             <p className="text-[9px] text-white/30 mt-1">Muallif: {d.author}</p>
                         </div>
                     </div>
                 </div>
             ))}
        </div>
    );
}

function KurslarFeed() {
    return (
        <div className="grid grid-cols-2 gap-3">
            {[1,2,3,4].map(idx => (
                 <div key={idx} className="glass-card rounded-[24px] overflow-hidden border border-white/5">
                     <img src={`https://picsum.photos/seed/course${idx}/300/200`} className="w-full h-24 object-cover" />
                     <div className="p-3">
                         <h4 className="font-bold text-[11px] mb-1 leading-tight">Kurs Sarlavhasi {idx}</h4>
                         <p className="text-[9px] text-white/40 mb-2">Jasur Ustoz</p>
                         <button className="w-full py-1.5 text-[10px] font-bold border border-neon-blue text-neon-blue rounded-xl flex justify-center gap-1 items-center">
                            <Video className="w-3 h-3" /> Ko'rish
                         </button>
                     </div>
                 </div>
            ))}
        </div>
    );
}
