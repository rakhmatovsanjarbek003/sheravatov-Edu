import { 
  Users, 
  CheckCircle, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  ArrowLeft,
  LayoutDashboard,
  Settings,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface WebAdminViewProps {
  onBack: () => void;
}

export default function WebAdminView({ onBack }: WebAdminViewProps) {
  const [mentors, setMentors] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, sRes] = await Promise.all([
          fetch('/api/admin/mentors'),
          fetch('/api/admin/stats')
        ]);
        const mData = await mRes.json();
        const sData = await sRes.json();
        setMentors(mData);
        setStats(sData);
      } catch (e) {
        console.error("Failed to fetch admin data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVerify = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/verify-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setMentors(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      }
    } catch (e) {
      alert("Xatolik yuz berdi");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[300] bg-[#0f172a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest opacity-40">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] bg-[#0f172a] overflow-y-auto p-8 text-white animate-in fade-in duration-500">
      {/* Sidebar Simulation */}
      <div className="max-w-7xl mx-auto flex gap-8">
        <aside className="w-64 hidden lg:block space-y-2">
          <div className="flex items-center gap-3 mb-10 px-4">
            <ShieldCheck className="w-8 h-8 text-neon-blue" />
            <span className="text-xl font-bold tracking-tight">Admin OS</span>
          </div>
          
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Users, label: 'Users & Mentors' },
            { icon: FileText, label: 'Content Moderation' },
            { icon: BarChart3, label: 'Analytics' },
            { icon: DollarSign, label: 'Finance' },
            { icon: Settings, label: 'System Settings' },
          ].map((item, i) => (
            <button 
              key={i} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active ? 'bg-neon-blue text-black font-bold' : 'text-white/40 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </aside>

        <main className="flex-1">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-white/40 hover:text-white mb-2 transition-colors lg:hidden"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Back to Mini App</span>
              </button>
              <h1 className="text-3xl font-bold">Web Admin Dashboard</h1>
              <p className="text-white/40 text-sm">System Overview & Global Control</p>
            </div>
            
            <button 
              onClick={onBack}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold">Exit to Mobile</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
            {[
              { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toLocaleString()}`, trend: '+12%', icon: DollarSign, color: 'text-green-400' },
              { label: 'Active Users', value: `${(stats?.activeUsers / 1000).toFixed(1)}k`, trend: '+5.2%', icon: Users, color: 'text-blue-400' },
              { label: 'Retention Rate', value: `${stats?.retentionRate}%`, trend: '+2.1%', icon: TrendingUp, color: 'text-purple-400' },
              { label: 'AI Accuracy', value: `${stats?.aiAccuracy}%`, trend: '+0.5%', icon: Activity, color: 'text-neon-blue' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-green-400">{stat.trend}</span>
                </div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left">
            {/* Mentor Verification Table */}
            <div className="xl:col-span-2 glass-card rounded-[32px] p-8 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Mentor Verification</h3>
                <button 
                  onClick={() => alert("Barcha mentorlarni ko'rish")}
                  className="text-xs font-bold text-neon-blue uppercase tracking-widest"
                >
                  View All
                </button>
              </div>
              <div className="space-y-6">
                {mentors.map((mentor, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center font-bold text-neon-blue">
                        {mentor.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{mentor.name}</p>
                        <p className="text-[10px] text-white/40">{mentor.field} • {mentor.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        mentor.status === 'Verified' ? 'text-neon-green' : 
                        mentor.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'
                      }`}>{mentor.status}</span>
                      
                      {mentor.status !== 'Verified' && (
                        <button 
                          onClick={() => handleVerify(mentor.id, 'Verified')}
                          className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {mentor.status !== 'Rejected' && (
                        <button 
                          onClick={() => handleVerify(mentor.id, 'Rejected')}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="space-y-8">
              <div className="glass-card rounded-[32px] p-8 border border-white/5">
                <h3 className="text-xl font-bold mb-8">System Health</h3>
                <div className="space-y-8 text-left">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-white/60">Server Load</span>
                      <span className="text-xs font-bold text-neon-green">24%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-neon-green w-[24%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-white/60">Database Usage</span>
                      <span className="text-xs font-bold text-blue-400">42%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 w-[42%]" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-red-400">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-xs font-bold">2 Critical Errors in Logs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEW: Official Quiz Management */}
              <div className="glass-card rounded-[32px] p-8 border border-neon-blue/20 bg-neon-blue/5">
                 <h3 className="text-xl font-bold mb-6 text-left">Rasmiy Fanlar Boshqaruvi</h3>
                 <div className="space-y-4 text-left">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Test Sarlavhasi</label>
                      <input id="q-title" placeholder="Masalan: Fizika Bob 1" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm mt-1 focus:border-neon-blue transition" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Fan Kategoriya</label>
                      <select id="q-cat" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm mt-1 focus:border-neon-blue outline-none">
                         <option value="math">Mathematics</option>
                         <option value="programming">Programming</option>
                         <option value="english">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Savollar (JSON)</label>
                      <textarea id="q-json" placeholder='[{"text":"Savol?","options":["A","B","C","D"],"correctAnswer":0}]' className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs mt-1 min-h-[100px] font-mono focus:border-neon-blue outline-none transition" />
                    </div>
                    <button 
                      onClick={async () => {
                        const title = (document.getElementById('q-title') as HTMLInputElement).value;
                        const category = (document.getElementById('q-cat') as HTMLSelectElement).value;
                        const jsonStr = (document.getElementById('q-json') as HTMLTextAreaElement).value;
                        try {
                          const questions = JSON.parse(jsonStr);
                          const res = await fetch('/api/admin/add-official-quiz', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ title, category, questions })
                          });
                          if (res.ok) alert("Muvaffaqiyatli qo'shildi!");
                        } catch (e) {
                          alert("JSON xato yoki tarmoqda muammo");
                        }
                      }}
                      className="w-full py-3 bg-neon-blue text-black font-bold rounded-xl shadow-lg active:scale-95 transition-all"
                    >
                      Testni Saqlash
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
