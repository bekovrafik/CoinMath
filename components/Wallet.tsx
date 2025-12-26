
import React, { useMemo, useState } from 'react';
import { UserStats } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WalletProps {
  stats: UserStats;
  onConnect: () => Promise<void>;
}

const Wallet: React.FC<WalletProps> = ({ stats, onConnect }) => {
  const address = stats.walletAddress;
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'LEDGER'>('TELEMETRY');

  const activityData = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${(new Date(now - (23 - i) * 60 * 60 * 1000)).getHours()}:00`,
      activity: Math.floor(Math.random() * 5) + 1
    }));
  }, []);

  const ledgerHistory = [
    { type: 'INBOUND', amount: '+0.005', desc: 'Solved Block #822', time: '2m ago', color: 'text-green-500' },
    { type: 'SYNC', amount: '+0.012', desc: 'Referral T1 Comm', time: '14m ago', color: 'text-blue-400' },
    { type: 'BOOST', amount: '+0.050', desc: 'Daily Reward Pack', time: '1h ago', color: 'text-yellow-500' },
    { type: 'SYNC', amount: '+0.003', desc: 'Referral T2 Comm', time: '3h ago', color: 'text-blue-400' },
    { type: 'INBOUND', amount: '+0.005', desc: 'Solved Block #821', time: '4h ago', color: 'text-green-500' },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ASSET CORE */}
      <div className="relative bg-[#0b0f1a] rounded-[3.5rem] border-2 border-white/5 p-10 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col items-center">
          <header className="w-full flex justify-between items-center mb-10">
             <div className="space-y-1">
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em]">Vault Sync</span>
                <span className="text-[10px] font-mono text-slate-500 block uppercase">ID: {stats.referralCode || 'NODE_X'}</span>
             </div>
             <div className="flex items-center gap-1.5 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Active</span>
             </div>
          </header>

          <div className="relative w-56 h-56 flex items-center justify-center">
             <div className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full animate-[spin_30s_linear_infinite]"></div>
             <div className="absolute inset-6 border border-blue-500/10 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
             <div className="text-center z-20">
                <h2 className="text-6xl font-black text-white font-mono tracking-tighter italic">{stats.balance.toFixed(3)}</h2>
                <span className="text-blue-500 text-[10px] font-black tracking-widest uppercase mt-2 block">COIM Assets</span>
             </div>
          </div>

          <div className="w-full mt-12">
            {!address ? (
              <button onClick={onConnect} className="w-full py-6 bg-blue-600 rounded-[2.2rem] text-white font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all">Link Node Key</button>
            ) : (
              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 flex justify-between items-center">
                <div>
                  <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Linked Hub</p>
                  <p className="text-[10px] font-mono font-bold text-white truncate max-w-[140px]">{address}</p>
                </div>
                <span className="text-[8px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase">Synced</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 gap-5 px-1">
        <button className="h-20 bg-[#151a28] border border-white/5 rounded-[2.2rem] flex items-center justify-center gap-4 transition-all active:scale-95 text-white shadow-xl opacity-30">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">📤</div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Egress</span>
        </button>
        <button className="h-20 bg-[#151a28] border border-white/5 rounded-[2.2rem] flex items-center justify-center gap-4 transition-all active:scale-95 text-white shadow-xl opacity-30">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl">📥</div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ingress</span>
        </button>
      </div>

      {/* DATA TABS (Filling Space) */}
      <section className="bg-[#151a28] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="flex border-b border-white/5">
           <button onClick={() => setActiveTab('TELEMETRY')} className={`flex-1 py-5 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'TELEMETRY' ? 'text-white bg-white/5' : 'text-slate-600'}`}>Telemetry</button>
           <button onClick={() => setActiveTab('LEDGER')} className={`flex-1 py-5 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'LEDGER' ? 'text-white bg-white/5' : 'text-slate-600'}`}>Ledger History</button>
        </div>

        <div className="p-8 min-h-[320px]">
           {activeTab === 'TELEMETRY' ? (
             <div className="space-y-8 animate-in fade-in duration-500">
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="activity" stroke="#3b82f6" strokeWidth={3} fill="url(#glow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-black/30 p-5 rounded-[2rem] space-y-1">
                      <p className="text-[7px] font-black text-slate-500 uppercase">Avg Yield</p>
                      <p className="text-lg font-black text-white font-mono">0.008 <span className="text-[10px] text-slate-600">H</span></p>
                   </div>
                   <div className="bg-black/30 p-5 rounded-[2rem] space-y-1">
                      <p className="text-[7px] font-black text-slate-500 uppercase">Net Stability</p>
                      <p className="text-lg font-black text-green-500 font-mono">99.8%</p>
                   </div>
                </div>
                <div className="bg-blue-600/5 p-5 rounded-3xl border border-blue-500/10 flex gap-4 items-center">
                   <div className="text-2xl">🛡️</div>
                   <div>
                      <p className="text-[8px] font-black text-white uppercase tracking-widest">Insurance Protocol</p>
                      <p className="text-[7px] font-bold text-slate-500 uppercase leading-relaxed">Assets covered by de-centralized consensus insurance tier 1.</p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                {ledgerHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg">{item.type === 'INBOUND' ? '💎' : '⚡'}</div>
                        <div>
                           <p className="text-[10px] font-black text-white uppercase tracking-tight">{item.desc}</p>
                           <p className="text-[8px] font-bold text-slate-500 uppercase">{item.time}</p>
                        </div>
                     </div>
                     <p className={`text-sm font-mono font-black ${item.color}`}>{item.amount}</p>
                  </div>
                ))}
             </div>
           )}
        </div>
      </section>

      <footer className="text-center px-10">
        <p className="text-[7px] font-black text-slate-800 uppercase tracking-[0.5em] leading-relaxed">
          Cryptographically secured vault protocols v5.2. Verified by de-centralized cluster CM-9.
        </p>
      </footer>
    </div>
  );
};

export default Wallet;
