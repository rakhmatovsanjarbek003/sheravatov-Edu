import { Settings, LogOut, Award, BookOpen, Send, Shield, Info, HelpCircle, Star, Phone, AtSign, User, Camera, RefreshCw, Zap, Flame, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { triggerHaptic } from '../lib/haptics';

const WEEKLY_ACTIVITY = [
  { day: 'Du', active: true, level: 80 },
  { day: 'Se', active: true, level: 60 },
  { day: 'Ch', active: false, level: 0 },
  { day: 'Pa', active: true, level: 90 },
  { day: 'Ju', active: true, level: 40 },
  { day: 'Sh', active: false, level: 0 },
  { day: 'Ya', active: false, level: 0 },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Tezkor', icon: <Zap className="w-4 h-4" />, color: 'bg-orange-500/20 text-orange-500' },
  { id: 2, title: 'Bilimdon', icon: <Award className="w-4 h-4" />, color: 'bg-blue-500/20 text-blue-500' },
  { id: 3, title: 'Faol', icon: <Flame className="w-4 h-4" />, color: 'bg-red-500/20 text-red-500' },
];

const MY_COURSES = [
  { id: 1, title: 'Python Pro Kursi', teacher: 'Jasur Ustoz', progress: 65, icon: '🐍' },
  { id: 2, title: 'Matematika Master', teacher: 'Zafar Ustoz', progress: 30, icon: '📐' },
];

interface ProfileViewProps {
  user?: any;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export default function ProfileView({ user: tgUser, isPremium: initialPremium, onUpgrade }: ProfileViewProps) {
  const [isPremium, setIsPremium] = useState(initialPremium || false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState<{ title: string, content: string } | null>(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  
  const [user, setUser] = useState({
    name: tgUser?.first_name || 'Ali',
    username: tgUser?.username || 'ali_dev',
    phone: tgUser?.phone || '+998 90 123 45 67',
    bio: 'Learning Enthusiast & Quiz Master 🚀',
    avatar: tgUser?.photo_url || 'https://picsum.photos/seed/ali/200/200',
    level: 4,
    exp: 2450,
    nextLevelExp: 3000
  });

  return (
    <div className="px-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header Card - Redesigned: Avatar Left, Info Right */}
      <div className="glass-card rounded-[40px] p-6 mb-6 mt-4 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <User className="w-32 h-32 text-white" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative shrink-0">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src={user.avatar} 
              className="w-24 h-24 rounded-3xl border-2 border-neon-blue shadow-[0_0_20px_rgba(0,242,255,0.2)] object-cover"
              referrerPolicy="no-referrer"
            />
            <button className="absolute -bottom-2 -right-2 p-2 bg-neon-blue text-black rounded-xl border-4 border-[#1a2235] hover:scale-110 transition-transform shadow-lg">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black flex items-center gap-2 mb-1 truncate">
              {user.name}
              {isPremium && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
            </h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">Level {user.level} • {user.exp} EXP</p>
            
            <button 
              onClick={() => {
                setIsDetailsExpanded(!isDetailsExpanded);
                triggerHaptic('light');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              {isDetailsExpanded ? 'Yashirish' : 'Ma\'lumotlar'}
              <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isDetailsExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isDetailsExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full overflow-hidden"
            >
              <div className="pt-6 mt-6 space-y-4 text-left border-t border-white/5">
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5">
                  <AtSign className="w-4 h-4 text-white/40" />
                  <div>
                    <p className="text-[8px] uppercase font-black text-white/20 tracking-widest">Username</p>
                    <p className="text-sm font-bold">@{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5">
                  <Phone className="w-4 h-4 text-white/40" />
                  <div>
                    <p className="text-[8px] uppercase font-black text-white/20 tracking-widest">Telefon</p>
                    <p className="text-sm font-bold">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5">
                  <Info className="w-4 h-4 text-white/40" />
                  <div>
                    <p className="text-[8px] uppercase font-black text-white/20 tracking-widest">Bio</p>
                    <p className="text-sm font-bold leading-relaxed">{user.bio}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Rank', value: '#124', color: 'text-neon-blue' },
          { label: 'Tests', value: '42', color: 'text-neon-green' },
          { label: 'Likes', value: '1.2k', color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 rounded-[24px] border border-white/5 text-center">
            <p className="text-[8px] uppercase font-black text-white/20 tracking-widest mb-1">{stat.label}</p>
            <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Weekly Activity */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h5 className="text-[10px] uppercase font-black text-white/20 tracking-widest">Haftalik Faollik</h5>
          <span className="text-[10px] text-neon-green font-black">A'lo darajada!</span>
        </div>
        <div className="glass-card p-4 rounded-3xl flex justify-between items-end h-24">
          {WEEKLY_ACTIVITY.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full px-1 h-12 flex items-end justify-center">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${day.level}%` }}
                  className={`w-full rounded-t-lg transition-colors ${day.active ? 'bg-neon-blue/40' : 'bg-white/5'}`}
                />
              </div>
              <span className={`text-[8px] font-black ${day.active ? 'text-white/80' : 'text-white/20'}`}>{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-8">
        <h5 className="text-[10px] uppercase font-black text-white/20 mb-4 tracking-widest px-1">Yutuqlar</h5>
        <div className="flex gap-3">
          {ACHIEVEMENTS.map((ach) => (
            <div key={ach.id} className={`flex-1 p-3 rounded-2xl glass-card flex flex-col items-center gap-2 border border-white/5`}>
              <div className={`p-2 rounded-xl ${ach.color}`}>
                {ach.icon}
              </div>
              <span className="text-[10px] font-black">{ach.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Level Progress */}
      <div className="glass-card p-5 rounded-3xl mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] uppercase font-black text-white/20 tracking-widest">Level Progress</span>
          <span className="text-[10px] font-black text-neon-blue">{user.exp} / {user.nextLevelExp}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(user.exp / user.nextLevelExp) * 100}%` }}
            className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,242,255,0.5)]"
          />
        </div>
      </div>

      {/* Premium Section */}
      <div className="mb-8">
        <h5 className="text-[10px] uppercase font-black text-white/20 mb-4 tracking-widest px-1">Tariflar & Imkoniyatlar</h5>
        <div className="glass-card rounded-[40px] p-1 border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-[20px] bg-yellow-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <h4 className="text-xl font-black text-white">Premium Rejim</h4>
                <p className="text-xs text-white/40">Bilim olishda chegara yo'q</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {[
                'Reklamasiz interfeys',
                'AI bilan cheksiz muloqot',
                'Eksklyuziv kurslar va testlar',
                'Maxsus "Pro" nishoni'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-white/70 font-bold">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                triggerHaptic('medium');
                if (onUpgrade) onUpgrade();
                else setShowPremiumModal(true);
              }}
              className="w-full py-4 bg-yellow-500 text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(234,179,8,0.3)] active:scale-[0.98] transition-all"
            >
              Tariflarni ko'rish
            </button>
          </div>
        </div>
      </div>

      {/* Settings & Legal */}
      <div className="space-y-3 mb-12">
        <h5 className="text-[10px] uppercase font-black text-white/20 mb-4 tracking-widest px-1">Tizim</h5>
        {[
          { icon: HelpCircle, label: 'Yordam markazi', color: 'text-blue-400', content: 'Yordam markazi orqali barcha savollaringizga javob olishingiz mumkin. Biz bilan bog\'laning: @support_admin' },
          { icon: Shield, label: 'Maxfiylik siyosati', color: 'text-neon-green', content: 'Sizning ma\'lumotlaringiz xavfsizligi biz uchun ustuvor vazifa. Biz hech qachon shaxsiy ma\'lumotlaringizni uchinchi shaxslarga bermaymiz.' },
          { icon: Info, label: 'Ommaviy oferta', color: 'text-purple-400', content: 'Ushbu platformadan foydalanish orqali siz bizning barcha shartlarimizga rozilik bildirasiz. Batafsil ma\'lumot uchun saytimizga kiring.' },
          { icon: LogOut, label: 'Chiqish', color: 'text-red-400', content: 'Haqiqatan ham tizimdan chiqmoqchimisiz?' },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => {
              triggerHaptic('light');
              if (item.label === 'Chiqish') {
                 if (confirm("Haqiqatan ham tizimdan chiqmoqchimisiz?")) {
                    window.location.reload(); 
                 }
              } else {
                 setShowInfoModal({ title: item.label, content: item.content });
              }
            }}
            className="w-full flex items-center justify-between p-4 rounded-2xl glass-card hover:bg-white/10 transition-colors border border-white/5"
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-bold">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/10" />
          </button>
        ))}
      </div>

      {/* App Version */}
      <div className="text-center pb-8">
        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">Version 2.4.0 (Build 1024)</p>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm glass-card rounded-[40px] p-8 text-center"
            >
              <h3 className="text-xl font-black mb-4">{showInfoModal.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8">{showInfoModal.content}</p>
              <button 
                onClick={() => setShowInfoModal(null)}
                className="w-full py-4 bg-white/10 text-white font-black rounded-2xl"
              >
                Tushunarli
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPremiumModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-lg glass-card rounded-[40px] p-8 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Star className="w-32 h-32 text-yellow-500 fill-yellow-500" />
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2 tracking-tighter">Premium Rejim</h3>
                <p className="text-sm text-white/40 mb-8">Eksklyuziv imkoniyatlar to'plami</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
                    <h5 className="font-black text-sm mb-1">Free</h5>
                    <p className="text-[10px] text-white/40 mb-4">Asosiy funksiyalar</p>
                    <div className="text-xl font-black">$0</div>
                  </div>
                  <div className="p-5 rounded-3xl bg-yellow-500/10 border border-yellow-500/20">
                    <h5 className="font-black text-sm mb-1 text-yellow-500">Pro</h5>
                    <p className="text-[10px] text-yellow-500/60 mb-4">Cheksiz imkoniyatlar</p>
                    <div className="text-xl font-black text-yellow-500">$4.99</div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPremiumModal(false)}
                  className="w-full py-4 bg-white/10 text-white font-black rounded-2xl"
                >
                  Yopish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
