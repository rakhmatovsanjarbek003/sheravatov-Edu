import { Shield, FileText, ChevronLeft, Instagram, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onBack: () => void;
}

export default function LegalView({ onBack }: Props) {
  return (
    <div className="min-h-full pb-20 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-xl p-4 border-b border-white/10 flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Huquqiy va Yordam</h1>
        <div className="w-9" />
      </div>

      <div className="px-4 space-y-6">
        
        {/* Support Card */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass-card p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-neon-blue/20 blur-3xl rounded-full" />
          <h2 className="text-xl font-bold mb-2">Yordam Markazi</h2>
          <p className="text-white/60 text-sm mb-6">Ilovada muammoga duch keldingizmi? Bizning administratorga yozing.</p>
          
          <a href="https://t.me/sheravatovshaxzod" target="_blank" rel="noreferrer" 
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
                <Send className="w-5 h-5 text-neon-blue" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">@sheravatovshaxzod</p>
                <p className="text[10px] text-white/40">Telegram</p>
              </div>
            </div>
          </a>
        </motion.div>

        {/* Maxfiylik Siyosati */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <Shield className="w-6 h-6 text-neon-purple" />
            <h2 className="text-lg font-bold">Maxfiylik Siyosati</h2>
          </div>
          <div className="text-sm text-white/70 space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar">
            <p><strong>1. Umumiy qoidalar:</strong> "EduBot Pro" (keyingi o'rinlarda Ilova) foydalanuvchilarning shaxsiy ma'lumotlarini himoya qilishni kafolatlaydi.</p>
            <p><strong>2. Yig'iladigan ma'lumotlar:</strong> Tizim asosan Telegram ochiq datalarini (IP, Ism, UserID) oladi va fayllarni generatsiya qilish jarayonida foydalanadi.</p>
            <p><strong>3. Uchinchi tomonga uzatish:</strong> Biz sizning ba'zi yuborgan test fayllaringizni AI API lari (Groq) orqali qayta ishlaymiz va hech qanday davlat organga ruxsatsiz yubormaymiz.</p>
            <p><strong>4. Ma'lumotlarni nazorat qilish:</strong> Ma'lumotingizni admin bilan bog'lanib Telegram orqali o'chirtirishingiz mumkin.</p>
          </div>
        </div>

        {/* Ofera */}
        <div className="glass-card p-6 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <FileText className="w-6 h-6 text-neon-green" />
            <h2 className="text-lg font-bold">Ommaviy Ofera</h2>
          </div>
          <div className="text-sm text-white/70 space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar">
            <p><strong>1. Xizmat shartlari:</strong> Ushbu ofera ommaviy hisoblanib "EduBot Pro" Premium hizmatlariga obuna bo'lish shartlarini belgilaydi.</p>
            <p><strong>2. Pulni qaytarish yo'qligi:</strong> Tizim AI generation imkoniyatini darxol ochib bergani sababli, Premium obuna sotib olingach to'lov qaytarilmaydi.</p>
            <p><strong>3. Cheklovlar:</strong> Foydalanuvchilar platformadan noto'g'ri (serverga kiber hujum) maqsadda foydalansa, admin uni blocklash huquqiga ega.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
