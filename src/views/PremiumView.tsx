import { Crown, CheckCircle2, ChevronLeft, Zap, Infinity, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../lib/haptics';

interface Props {
  onBack: () => void;
  isPremium: boolean;
}

export default function PremiumView({ onBack, isPremium }: Props) {
  const handlePurchase = (type: string) => {
      triggerHaptic('medium');
      alert(`To'lov tizimi ulanmoqda... Tarif: ${type}`);
  };

  return (
    <div className="min-h-full pb-20 animate-in fade-in slide-in-from-bottom-4">
      <div className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-xl p-4 border-b border-white/10 flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="px-3 py-1 bg-amber-400/20 text-amber-400 font-bold rounded-full text-xs flex items-center gap-1 border border-amber-400/20">
          <Crown className="w-3 h-3" /> PRO TIZIM
        </div>
        <div className="w-9" />
      </div>

      <div className="px-4">
        {/* Banner */}
        <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-amber-400/10 to-[#0f172a] border border-amber-400/20 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 blur-[50px] rounded-full" />
          <h1 className="text-3xl font-black mb-2 text-white/90">Chegarasiz <span className="text-amber-400">Imkoniyat</span></h1>
          <p className="text-white/60 text-sm mb-6 max-w-[200px]">Kunlik 1 ta emissiya cheklovidan xalos bo'ling va cheksiz tezlikka erishing.</p>
          
          <button className="px-6 py-3 bg-amber-400 text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 transition">
            PRO Sotib olish <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Compare */}
        <h3 className="text-lg font-bold mb-4 ml-2">Ta'riflar</h3>
        <div className="space-y-4 mb-8">
            <div className="glass-card p-5 rounded-3xl border border-white/5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="text-xl font-bold">Standard (Free)</h4>
                        <p className="text-xs text-white/40">Boshlang'ich imkoniyat</p>
                    </div>
                    <span className="font-bold">0 UZS/oy</span>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/60"><CheckCircle2 className="w-4 h-4 text-white/20"/> Kuniga 1 AI Test</div>
                    <div className="flex items-center gap-2 text-sm text-white/60"><CheckCircle2 className="w-4 h-4 text-white/20"/> Kuniga 1 Mustaqil ish</div>
                    <div className="flex items-center gap-2 text-sm text-white/60"><CheckCircle2 className="w-4 h-4 text-white/20"/> Boshlang'ich yordam</div>
                </div>
            </div>

            <div className="glass-card p-5 rounded-3xl border-2 border-amber-400/50 relative overflow-hidden bg-white/5">
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-amber-400/20 blur-[30px] rounded-full point-events-none" />
                <div className="absolute top-3 right-3 text-xs bg-amber-400 text-black font-bold px-2 py-1 rounded-lg">PRO</div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="text-xl font-bold text-amber-400">Premium Pro</h4>
                        <p className="text-xs text-white/40">Maksimal Ustozlik Formati</p>
                    </div>
                </div>
                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-white/90"><Infinity className="w-4 h-4 text-amber-400"/> Cheksiz AI Test & Darslik</div>
                    <div className="flex items-center gap-2 text-sm text-white/90"><Infinity className="w-4 h-4 text-amber-400"/> Cheksiz Taqdimot ishlab chiqarish</div>
                    <div className="flex items-center gap-2 text-sm text-white/90"><Zap className="w-4 h-4 text-amber-400"/> Eng tez GPO server oqimlari</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handlePurchase('kunlik')} className="py-3 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-center border border-white/10">
                        <p className="text-xs text-white/50 mb-1">Kunlik</p>
                        <p className="text-[11px] font-bold">4,999</p>
                    </button>
                    <button onClick={() => handlePurchase('haftalik')} className="py-3 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-center border border-white/10">
                        <p className="text-xs text-white/50 mb-1">Haftalik</p>
                        <p className="text-[11px] font-bold">9,999</p>
                    </button>
                    <button onClick={() => handlePurchase('oylik')} className="py-3 px-1 rounded-xl bg-amber-400 hover:scale-105 transition-transform text-[#0f172a] text-center border border-amber-400">
                        <p className="text-xs opacity-70 mb-1">Oylik</p>
                        <p className="text-[11px] font-black">14,999</p>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
