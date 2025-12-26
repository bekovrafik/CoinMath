
import React, { useState, useMemo } from 'react';
import { UserStats } from '../types';
import { 
  VERIFICATION_MIN_LEVEL, 
  VERIFICATION_MIN_ADS, 
  COMMISSION_TIER_1, 
  COMMISSION_TIER_2 
} from '../constants';

interface ProfileProps {
  stats: UserStats;
  onUpdateSettings: (settings: UserStats['settings']) => void;
  onLogout: () => void;
  onWithdraw: (amount: number) => void;
  onConnectWallet: () => Promise<void>;
}

const Profile: React.FC<ProfileProps> = ({ stats, onUpdateSettings, onLogout, onWithdraw, onConnectWallet }) => {
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'NETWORK' | 'LEGAL' | 'SUPPORT'>('NETWORK');

  const toggleHaptics = () => onUpdateSettings({ ...stats.settings, haptics: !stats.settings.haptics });
  const toggleSound = () => onUpdateSettings({ ...stats.settings, sound: !stats.settings.sound });

  const copyRefCode = () => {
    navigator.clipboard.writeText(stats.referralCode);
    if (window.navigator.vibrate) window.navigator.vibrate([10, 40]);
  };

  const shareNode = (platform: string) => {
    const text = `Join my CoinMath Node! 🧠 Use code ${stats.referralCode} for a 2X speed boost and start earning cloud-mined $COIM.`;
    const url = window.location.origin;
    if (platform === 'wa') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
    if (platform === 'tg') window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
    if (platform === 'x') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
  };

  const nodeStability = useMemo(() => {
    const base = 98.4;
    const fluctuation = (Math.random() * 1.5).toFixed(1);
    return `${base + parseFloat(fluctuation)}%`;
  }, []);

  return (
    <div className="space-y-6 pb-44 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* SECTION 1: MASTER IDENTITY TERMINAL */}
      <section className="bg-[#151a28] rounded-[3rem] border-2 border-white/5 p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl border border-white/10 font-black italic group-hover:scale-105 transition-transform">
              {stats.username.charAt(0).toUpperCase()}
            </div>
            {stats.isVerifiedHuman && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-[#151a28] flex items-center justify-center text-xs shadow-lg animate-pulse">✓</div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{stats.username}</h2>
            <div className="flex flex-wrap items-center gap-2">
               <span className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border ${stats.isVerifiedHuman ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                 {stats.isVerifiedHuman ? 'Verified Registry' : 'KYC Pending'}
               </span>
               <span className="text-[8px] font-mono text-slate-500 uppercase font-black">NODE LVL {stats.level}</span>
            </div>
          </div>
        </div>
        
        {/* Balance Metrics Block */}
        <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-white/5 relative z-10">
           <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Available Assets</p>
              <p className="text-2xl font-black text-white font-mono tracking-tighter">{stats.balance.toFixed(4)} <span className="text-[10px] text-blue-500">COIM</span></p>
           </div>
           <div className="text-right">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Pending</p>
              <p className="text-2xl font-black text-yellow-500 font-mono tracking-tighter">+{stats.pendingBalance.toFixed(4)}</p>
           </div>
        </div>
      </section>

      {/* SECTION 2: REFERRAL COMMAND CENTER (Viral Growth Node) */}
      <section className="bg-blue-600 rounded-[3rem] p-8 shadow-[0_40px_80px_rgba(37,99,235,0.4)] border border-white/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[90px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="relative z-10 space-y-8">
           <header className="flex justify-between items-start">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.4em]">Viral Distribution Protocol</p>
                 <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Referral Node</h4>
              </div>
              <div className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 text-center shadow-lg">
                 <p className="text-[7px] font-black text-white/60 uppercase tracking-widest mb-0.5">Network Boost</p>
                 <span className="text-xs font-black text-white tracking-tighter">+{(stats.referrals * 2)} GH/s</span>
              </div>
           </header>

           {/* Core Referral Logic Breakdown */}
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                 <span className="text-[8px] font-black text-blue-100/60 uppercase tracking-widest mb-1">Tier 1 Bonus</span>
                 <p className="text-xl font-black text-white">{(COMMISSION_TIER_1 * 100)}%</p>
                 <span className="text-[7px] font-bold text-white/40 uppercase mt-1 italic">Direct Nodes</span>
              </div>
              <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                 <span className="text-[8px] font-black text-blue-100/60 uppercase tracking-widest mb-1">Tier 2 Bonus</span>
                 <p className="text-xl font-black text-white">{(COMMISSION_TIER_2 * 100)}%</p>
                 <span className="text-[7px] font-bold text-white/40 uppercase mt-1 italic">Sub-Nodes</span>
              </div>
           </div>

           {/* ID & Multi-Channel Sharing */}
           <div className="space-y-4">
              <div 
                onClick={copyRefCode}
                className="w-full bg-black/40 backdrop-blur-md rounded-3xl h-16 flex items-center justify-between px-8 border border-white/10 active:scale-[0.98] transition-all cursor-pointer group/node"
              >
                 <div className="flex flex-col">
                   <span className="text-[7px] font-black text-blue-200/50 uppercase tracking-widest mb-0.5">Registry Node Key</span>
                   <span className="text-white font-mono font-black tracking-[0.3em] text-xl">{stats.referralCode || 'NODE_OFFLINE'}</span>
                 </div>
                 <span className="text-blue-100 text-xl opacity-60 group-hover/node:opacity-100 transition-opacity">📋</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                 <button onClick={() => shareNode('wa')} className="h-16 bg-green-500 rounded-3xl flex items-center justify-center text-3xl shadow-lg border border-white/10 active:scale-90 transition-all">💬</button>
                 <button onClick={() => shareNode('tg')} className="h-16 bg-sky-500 rounded-3xl flex items-center justify-center text-3xl shadow-lg border border-white/10 active:scale-90 transition-all">✈️</button>
                 <button onClick={() => shareNode('x')} className="h-16 bg-black rounded-3xl flex items-center justify-center text-3xl shadow-lg border border-white/10 active:scale-90 transition-all">𝕏</button>
              </div>
           </div>

           <p className="text-center text-[8px] font-black text-blue-100/40 uppercase tracking-widest leading-relaxed px-4">
             Rewards are finalized when referred nodes reach <span className="text-white">Level {VERIFICATION_MIN_LEVEL}</span> + <span className="text-white">{VERIFICATION_MIN_ADS} Sync Cycles</span>.
           </p>
        </div>
      </section>

      {/* SECTION 3: MASTER CONTROLLER TABS */}
      <section className="bg-[#151a28] rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
         <nav className="flex bg-white/[0.02] border-b border-white/5">
            {[
              { id: 'NETWORK', label: 'Network', icon: '📡' },
              { id: 'SYSTEM', label: 'System', icon: '⚙️' },
              { id: 'LEGAL', label: 'Privacy', icon: '⚖️' },
              { id: 'SUPPORT', label: 'Support', icon: '✉️' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); if (stats.settings.haptics) window.navigator.vibrate(5); }}
                className={`flex-1 py-5 flex flex-col items-center gap-1.5 transition-all ${activeTab === tab.id ? 'bg-white/5 text-white' : 'text-slate-600'}`}
              >
                <span className={`text-xl transition-transform ${activeTab === tab.id ? 'scale-110 opacity-100' : 'opacity-40'}`}>{tab.icon}</span>
                <span className="text-[7px] font-black uppercase tracking-widest">{tab.label}</span>
                {activeTab === tab.id && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 animate-pulse"></div>}
              </button>
            ))}
         </nav>

         <div className="p-8 flex-1">
            {/* NETWORK VIEW */}
            {activeTab === 'NETWORK' && (
              <div className="space-y-6 animate-in slide-in-from-right-6 duration-300">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-black/30 p-5 rounded-[2.2rem] border border-white/5 space-y-1">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Nodes</p>
                      <p className="text-2xl font-black text-white font-mono tracking-tighter italic">{stats.referrals}</p>
                   </div>
                   <div className="bg-black/30 p-5 rounded-[2.2rem] border border-white/5 space-y-1">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Net Revenue</p>
                      <p className="text-2xl font-black text-green-500 font-mono tracking-tighter italic">{stats.totalNetworkEarnings.toFixed(2)}</p>
                   </div>
                </div>
                
                <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-[2.5rem] border border-white/5 relative group overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 text-white/5 text-6xl font-black pointer-events-none select-none">LOGS</div>
                   <h6 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Cluster Activity Stream</h6>
                   <div className="space-y-3 font-mono text-[8px] text-slate-500 overflow-hidden h-28">
                      <p className="animate-in fade-in slide-in-from-left duration-300">>> NODE #{Math.floor(Math.random() * 9000 + 1000)} AUTH SUCCESSFUL</p>
                      <p className="animate-in fade-in slide-in-from-left duration-500">>> DISTRIBUTING POOL_REWARDS: 0.005 COIM</p>
                      <p className="animate-in fade-in slide-in-from-left duration-700">>> CLUSTER CM-9 SYNC COMPLETED [14MS]</p>
                      <p className="animate-in fade-in slide-in-from-left duration-1000 text-blue-400">>> STANDBY FOR NEXT CONSENSUS CYCLE...</p>
                   </div>
                </div>
              </div>
            )}

            {/* SYSTEM VIEW */}
            {activeTab === 'SYSTEM' && (
              <div className="space-y-8 animate-in slide-in-from-right-6 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Haptic Feedback</p>
                    <button onClick={toggleHaptics} className={`w-full h-16 rounded-3xl border flex items-center justify-center gap-4 transition-all ${stats.settings.haptics ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'bg-black/40 border-white/5 text-slate-700'}`}>
                      <span className="text-xl">📳</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">Tactile</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Signal Audio</p>
                    <button onClick={toggleSound} className={`w-full h-16 rounded-3xl border flex items-center justify-center gap-4 transition-all ${stats.settings.sound ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'bg-black/40 border-white/5 text-slate-700'}`}>
                      <span className="text-xl">🔊</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">Sonic</span>
                    </button>
                  </div>
                </div>

                <div className="bg-black/20 rounded-[2.5rem] p-8 border border-white/5 space-y-6">
                   <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Stability</p>
                        <p className="text-xs font-black text-white uppercase italic tracking-tighter">Diagnostic Index</p>
                      </div>
                      <span className="text-3xl font-mono font-black text-green-500">{nodeStability}</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[99.2%] animate-pulse"></div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5 text-[8px] font-black uppercase tracking-widest text-slate-600">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                         <span>Latency: 14MS</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                         <span>Registry: NOMINAL</span>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* PRIVACY ACCORD VIEW */}
            {activeTab === 'LEGAL' && (
              <div className="space-y-6 animate-in slide-in-from-right-6 duration-300">
                <header className="flex items-center gap-4">
                  <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
                  <h5 className="text-lg font-black text-white uppercase italic tracking-tighter">Consensus Accord</h5>
                </header>
                <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 h-64 overflow-y-auto space-y-6 scrollbar-hide font-medium text-[10px] leading-relaxed text-slate-400">
                   <div className="space-y-2">
                     <p className="text-blue-400 font-black uppercase tracking-widest text-[9px] underline underline-offset-4 decoration-blue-500/30">I. Cloud Compute Ethics</p>
                     <p>CoinMath operates a zero-hardware-impact protocol. We do NOT perform hashing or mining on user hardware. All rewards are derived from intellectual validation of mathematical blocks processed in our secure cloud cluster.</p>
                   </div>
                   <div className="space-y-2">
                     <p className="text-blue-400 font-black uppercase tracking-widest text-[9px] underline underline-offset-4 decoration-blue-500/30">II. Data Sovereignty</p>
                     <p>User privacy is cryptographically protected. We collect anonymized telemetry for anti-bot validation (Node ID, level, ad engagement). We never store biometric or sensitive financial data on our registry.</p>
                   </div>
                   <div className="space-y-2">
                     <p className="text-blue-400 font-black uppercase tracking-widest text-[9px] underline underline-offset-4 decoration-blue-500/30">III. Ad Engagement Integrity</p>
                     <p>Ad interactions are utilized strictly for "Proof of Humanity". Revenue generated supports the reward pool and compute costs, ensuring the ecosystem remains sustainable and eco-neutral.</p>
                   </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group active:scale-95 transition-all">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Full Protocol PDF</span>
                   <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">⬇️</span>
                </div>
              </div>
            )}

            {/* SUPPORT UPLINK VIEW */}
            {activeTab === 'SUPPORT' && (
              <div className="space-y-4 animate-in slide-in-from-right-6 duration-300">
                 {[
                   { icon: '📧', label: 'Registry Support', value: 'support@coinmath.io', tag: '24H ETA' },
                   { icon: '💬', label: 'Discord Cluster', value: 'discord.gg/coinmath', tag: 'LIVE HUB' },
                   { icon: '📚', label: 'Knowledge Base', value: 'docs.coinmath.io', tag: 'WIKI' },
                   { icon: '🤖', label: 'AI Signal Bot', value: 'Open Terminal', tag: '24/7' }
                 ].map((channel, i) => (
                   <div key={i} className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group active:bg-white/[0.08] transition-all">
                      <div className="flex items-center gap-5">
                         <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">{channel.icon}</div>
                         <div>
                            <p className="text-[11px] font-black text-white uppercase tracking-widest mb-0.5">{channel.label}</p>
                            <p className="text-[10px] font-mono text-blue-500 tracking-tighter">{channel.value}</p>
                         </div>
                      </div>
                      <span className="text-[8px] font-black bg-blue-500/10 text-blue-500 px-3 py-1.5 rounded-xl border border-blue-500/20">{channel.tag}</span>
                   </div>
                 ))}
              </div>
            )}
         </div>
      </section>

      {/* FOOTER & DANGER ZONE */}
      <div className="px-4 space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-4">
           <button className="h-16 bg-white/5 rounded-3xl border border-white/10 text-[10px] font-black text-slate-600 uppercase tracking-widest active:scale-95 transition-all">Export Node Hash</button>
           <button onClick={onLogout} className="h-16 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 font-black uppercase tracking-widest rounded-3xl transition-all text-[10px] active:scale-95 flex items-center justify-center gap-3">
             <span className="text-lg">⚠️</span> TERMINATE NODE
           </button>
        </div>
        
        <div className="text-center space-y-2 pb-12">
           <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.5em] leading-relaxed">
             CoinMath Distributed Network • Cluster CM-9 Terminal • Protocol v5.8.5
           </p>
           <p className="text-[7px] font-mono text-slate-900 uppercase">Registry Sig: {Math.random().toString(16).slice(2, 18).toUpperCase()}</p>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Profile;
