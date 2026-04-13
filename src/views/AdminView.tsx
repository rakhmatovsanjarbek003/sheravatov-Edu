import { 
  Users, 
  Database, 
  ShieldAlert, 
  MessageSquare, 
  Zap, 
  Activity, 
  Terminal, 
  Monitor, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useState } from 'react';
import { triggerHaptic } from '../lib/haptics';
import WebAdminView from './WebAdminView';

export default function AdminView() {
  const [showWebAdmin, setShowWebAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string, targetId?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId: targetId || 'system' })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      }
    } catch (e) {
      alert("Xatolik: Tarmoq bilan bog'lanishda muammo");
    } finally {
      setLoading(false);
    }
  };

  if (showWebAdmin) {
    return <WebAdminView onBack={() => setShowWebAdmin(false)} />;
  }

  return (
    <div className="px-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-neon-green" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Fast Admin</h2>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Mobile Control</p>
          </div>
        </div>
        <button 
          onClick={() => {
            triggerHaptic('medium');
            setShowWebAdmin(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
        >
          <Monitor className="w-4 h-4 text-neon-blue" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Web Panel</span>
          <ChevronRight className="w-3 h-3 text-white/20 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Teacher Assignment Section */}
      <div className="mb-8">
        <h5 className="text-[10px] uppercase font-bold text-white/20 mb-4 tracking-widest px-1">Ustoz Biriktirish</h5>
        <div className="glass-card p-6 rounded-[32px] border border-neon-purple/20 bg-gradient-to-br from-neon-purple/5 to-transparent relative overflow-hidden">
           {loading && (
             <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-6 h-6 border-2 border-neon-purple border-t-transparent rounded-full animate-spin" />
             </div>
           )}
           <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
               <Users className="w-24 h-24" />
           </div>
           
           <div className="space-y-4 mb-2 relative z-10 text-left">
              <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Foydalanuvchi ID</label>
                  <input placeholder="Masalan: 10423851" className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 px-4 text-sm mt-1 focus:border-neon-purple/40 outline-none transition" />
              </div>
              <button 
                 onClick={() => {
                   triggerHaptic('success');
                   handleAction('Assign Mentor');
                 }} 
                 disabled={loading}
                 className="w-full bg-neon-purple text-black font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50"
              >
                  Mentor Rolini Berish
              </button>
           </div>
        </div>
      </div>

      {/* Quick Moderation Section */}
      <div className="mb-8">
        <h5 className="text-[10px] uppercase font-bold text-white/20 mb-4 tracking-widest px-1">Instant Moderation</h5>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => {
              triggerHaptic('error');
              handleAction('Flash Ban');
            }}
            disabled={loading}
            className="glass-card p-5 rounded-[32px] border border-red-500/20 flex flex-col items-center gap-3 text-center active:scale-95 transition-transform disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Flash Ban</span>
          </button>
          <button 
            onClick={() => {
              triggerHaptic('warning');
              handleAction('Chat Clean');
            }}
            disabled={loading}
            className="glass-card p-5 rounded-[32px] border border-blue-500/20 flex flex-col items-center gap-3 text-center active:scale-95 transition-transform disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Chat Clean</span>
          </button>
        </div>
      </div>

      {/* System Health Section */}
      <div className="mb-8 text-left">
        <h5 className="text-[10px] uppercase font-bold text-white/20 mb-4 tracking-widest px-1">System Health</h5>
        <div className="glass-card rounded-[32px] p-6 border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-neon-green" />
              <span className="text-sm font-medium">Server Status</span>
            </div>
            <span className="text-xs font-bold text-neon-green">Online</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">DB Load</span>
            </div>
            <span className="text-xs font-bold text-blue-400">12%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">Error Logs</span>
            </div>
            <span className="text-xs font-bold">2 New</span>
          </div>
        </div>
      </div>

      {/* Admin Tools Section */}
      <div className="space-y-3 text-left">
        <h5 className="text-[10px] uppercase font-bold text-white/20 mb-4 tracking-widest px-1">System Tools</h5>
        {[
          { icon: Users, label: 'User Management', color: 'text-blue-400' },
          { icon: Terminal, label: 'Debug Console', color: 'text-purple-400' },
          { icon: Lock, label: 'Security Settings', color: 'text-neon-green' },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => {
              triggerHaptic('light');
              handleAction(`Enter ${item.label}`);
            }}
            disabled={loading}
            className="w-full flex items-center justify-between p-4 rounded-2xl glass-card hover:bg-white/10 transition-colors border border-white/5 group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/10 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
}
