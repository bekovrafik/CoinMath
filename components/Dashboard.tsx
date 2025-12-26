
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { UserStats, NetworkData } from '../types';
import { AD_COOLDOWN_MS, TAP_ENERGY_COST } from '../constants';
import { RewardType } from '../services/adService';

interface DashboardProps {
  stats: UserStats;
  network: NetworkData;
  onWatchAd: (type: RewardType) => Promise<string | null>;
  onManualMine: () => void;
}

const playSynthesizedSound = (type: 'tap' | 'reward' | 'levelup') => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'tap') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'reward') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'levelup') {
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    }
  } catch (e) { console.warn("Audio Context blocked", e); }
};

const Dashboard: React.FC<DashboardProps> = ({ stats, network, onWatchAd, onManualMine }) => {
  const [timers, setTimers] = useState({ boost: '', super: '', cooldown: '' });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(stats.level);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showPowerTooltip, setShowPowerTooltip] = useState(false);
  const [levelUpHighlight, setLevelUpHighlight] = useState(false);
  const [tapEffects, setTapEffects] = useState<{ id: number; x: number; y: number }[]>([]);

  const now = Date.now();
  const isBoostActive = stats.boostEndTime > now;
  const isSuperActive = stats.superComputeEndTime > now;

  useEffect(() => {
    if (stats.level > prevLevel) {
      setShowLevelUp(true);
      setLevelUpHighlight(true);
      playSynthesizedSound('levelup');
      const timer = setTimeout(() => {
        setShowLevelUp(false);
        setLevelUpHighlight(false);
        setPrevLevel(stats.level);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [stats.level, prevLevel]);

  const visualGHS = useMemo(() => {
    let base = stats.miningPower * 2.4; 
    const boostMult = isBoostActive ? stats.boostMultiplier : 1.0;
    base *= boostMult;
    if (isSuperActive) base *= 5;
    return base.toFixed(2);
  }, [stats.miningPower, isBoostActive, stats.boostMultiplier, isSuperActive]);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now();
      const format = (ms: number) => {
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      setTimers({
        boost: stats.boostEndTime > currentTime ? format(stats.boostEndTime - currentTime) : '',
        super: stats.superComputeEndTime > currentTime ? format(stats.superComputeEndTime - currentTime) : '',
        cooldown: (stats.lastAdTimestamp + AD_COOLDOWN_MS) > currentTime 
          ? format(stats.lastAdTimestamp + AD_COOLDOWN_MS - currentTime) : ''
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [stats.boostEndTime, stats.superComputeEndTime, stats.lastAdTimestamp]);

  const handleProcessTap = (e: React.MouseEvent) => {
    if (stats.energy < TAP_ENERGY_COST) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setTapEffects(prev => [...prev, { id, x, y }]);
    setTimeout(() => setTapEffects(prev => prev.filter(t => t.id !== id)), 800);
    
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 200);
    playSynthesizedSound('tap');
    onManualMine();
  };

  const handleRewardClick = async (type: RewardType) => {
    const resultMsg = await onWatchAd(type);
    if (resultMsg) {
      playSynthesizedSound('reward');
      if (window.navigator.vibrate) window.navigator.vibrate([20, 50, 20]);
    }
  };

  const chartData = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => {
      const time = new Date();
      time.setHours(time.getHours() - (14 - i));
      return {
        time: `${time.getHours()}:00`,
        hashrate: Number((network.hashrate + (Math.random() * 2 - 1)).toFixed(2))
      };
    });
  }, [network.hashrate]);

  const boosterItems = [
    { 
      type: RewardType.BOOST_5X, 
      title: '5X COIM PER TAP', 
      sub: 'Turbo Multiplier • 5 Minutes', 
      icon: '⚡', 
      color: 'border-purple-500/20 bg-purple-500/10',
      active: isBoostActive && stats.boostMultiplier === 5.0,
      time: timers.boost
    },
    { 
      type: RewardType.INSTANT_COIM, 
      title: 'INSTANT 0.05 COIM', 
      sub: 'Direct Cloud Credit Sync', 
      icon: '💰', 
      color: 'border-green-500/20 bg-green-500/10',
      active: false,
      time: ''
    },
    { 
      type: RewardType.SUPER_COMPUTE, 
      title: 'Super-Compute 5X', 
      sub: 'Global Cluster Speed • 10m', 
      icon: '🔥', 
      color: 'border-red-500/20 bg-red-500/5',
      active: isSuperActive,
      time: timers.super
    },
    { 
      type: RewardType.BOOST_2X, 
      title: '2X Booster Pack', 
      sub: 'Double Reward Rate • 1 Hour', 
      icon: '🚀', 
      color: 'border-yellow-500/20 bg-yellow-500/5',
      active: isBoostActive && stats.boostMultiplier === 2.0,
      time: timers.boost
    },
    { 
      type: RewardType.ENERGY_REFILL, 
      title: 'Core Refill', 
      sub: 'Restore 100% Compute Energy', 
      icon: '🔋', 
      color: 'border-blue-500/20 bg-blue-500/5',
      active: false,
      time: ''
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b0f1a]/95 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-blue-400 font-mono tracking-tighter">{payload[0].value}</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">TH/s</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <section className={`relative rounded-[3rem] p-10 flex flex-col items-center bg-[#151a28] border-2 transition-all duration-500 shadow-inner overflow-hidden ${
        levelUpHighlight ? 'border-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.2)]' : isSuperActive ? 'border-red-500/40' : 'border-white/5'
      }`}>
        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="relative w-72 h-72 mb-8 group flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#0b0f1a" strokeWidth="12" />
              {/* Fix: Moved pathLength from style to direct attribute to fix TypeScript error */}
              <circle cx="50%" cy="50%" r="45%" fill="none" stroke={levelUpHighlight ? '#facc15' : isSuperActive ? '#ef4444' : isBoostActive ? '#eab308' : '#3b82f6'} 
                strokeWidth="12" strokeDasharray="100 100" strokeDashoffset={100 - (stats.energy)} strokeLinecap="round" className="transition-all duration-700" pathLength={100} />
            </svg>
            <div className="text-center cursor-help relative z-20" onClick={() => setShowPowerTooltip(!showPowerTooltip)}>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 block text-slate-500">Mining Power</span>
              <h2 className={`text-7xl font-black font-mono tracking-tighter transition-all duration-300 ${isPulsing ? 'text-blue-400 scale-105' : 'text-white'}`}>{visualGHS}</h2>
              <p className="text-slate-400 font-bold text-sm mt-2 tracking-widest italic uppercase">GH/s</p>

              {showPowerTooltip && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-slate-900/95 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-2xl z-[120] animate-in zoom-in fade-in duration-200">
                  <div className="text-left space-y-3">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 border-b border-white/5 pb-2">Computation Breakdown</h5>
                    <div className="space-y-2 font-mono text-[10px]">
                      <div className="flex justify-between items-center"><span className="text-slate-500 uppercase tracking-tighter">Base</span><span className="text-white font-black">10.00</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-500 uppercase tracking-tighter">Rank Bonus</span><span className="text-green-500 font-black">+{(stats.level - 1) * 5}.00</span></div>
                      <div className="flex justify-between items-center pt-1 border-t border-white/5"><span className="text-slate-500 uppercase tracking-tighter">Protocol Mod</span><span className="text-blue-400 font-black">x 2.4</span></div>
                      {isBoostActive && <div className="flex justify-between items-center py-1 bg-yellow-500/5 px-2 rounded-lg"><span className="text-yellow-600 font-bold uppercase tracking-tighter">Boost</span><span className="text-yellow-400 font-black">x {stats.boostMultiplier.toFixed(1)}</span></div>}
                      {isSuperActive && <div className="flex justify-between items-center py-1 bg-red-500/5 px-2 rounded-lg"><span className="text-red-600 font-bold uppercase tracking-tighter">Super</span><span className="text-red-400 font-black">x 5.0</span></div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={handleProcessTap}
            disabled={stats.energy < TAP_ENERGY_COST} 
            className={`w-full h-20 rounded-[2.5rem] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden active:scale-95 shadow-2xl ${stats.energy >= TAP_ENERGY_COST ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-80'}`}
          >
             {tapEffects.map(tap => (
               <span key={tap.id} className="absolute text-blue-300 font-black text-sm pointer-events-none animate-float-up" style={{ left: tap.x, top: tap.y }}>+0.005</span>
             ))}
             <span className="relative z-10 text-xl flex items-center justify-center gap-4">PROCESS BLOCK</span>
             <div className="absolute bottom-0 left-0 h-1.5 w-full bg-black/20">
                <div className="h-full bg-white/40 transition-all duration-300" style={{ width: `${stats.energy}%` }}></div>
             </div>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl text-center group transition-all hover:bg-slate-800/80">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Global Nodes</p>
          <p className="text-xl font-black text-white italic">{network.totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl text-center group transition-all hover:bg-slate-800/80">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Net Hashrate</p>
          <p className="text-xl font-black text-blue-400 italic font-mono">{network.hashrate.toFixed(2)} TH/s</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 italic px-2">Reward Protocols</h3>
        <div className="grid grid-cols-1 gap-3">
          {boosterItems.map((boost, idx) => {
            const isCooldown = boost.type !== RewardType.ENERGY_REFILL && boost.type !== RewardType.INSTANT_COIM && !!timers.cooldown && !boost.active;
            return (
              <button key={idx} onClick={() => handleRewardClick(boost.type)} disabled={isCooldown}
                className={`group flex items-center justify-between p-6 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden ${boost.active ? 'border-green-500/50 bg-green-500/10 scale-[1.02]' : `${boost.color} hover:border-white/20`} ${isCooldown ? 'opacity-30 grayscale' : 'active:scale-95'}`}>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-3xl bg-[#0b0f1a] flex items-center justify-center text-3xl shadow-lg border border-white/5 group-hover:scale-110 transition-transform">{boost.icon}</div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{boost.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{boost.sub}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {boost.active ? (
                    <span className="text-[10px] font-mono font-black text-green-500 bg-green-500/20 px-4 py-1.5 rounded-full uppercase">ACTIVE: {boost.time}</span>
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:animate-ping"></div>
                    </div>
                  )}
                </div>
                {isCooldown && <div className="absolute inset-0 bg-[#0b0f1a]/80 flex items-center justify-center z-20"><span className="text-white font-mono font-black text-xs uppercase tracking-widest">RELOAD: {timers.cooldown}</span></div>}
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-[#151a28] p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mining Telemetry</span>
            <h4 className="text-sm font-black text-white italic tracking-tighter uppercase">Cluster Stability</h4>
          </div>
          <span className="text-[9px] font-mono font-black text-blue-500 uppercase bg-blue-500/10 px-3 py-1 rounded-full">LIVE FEED</span>
        </div>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
              <RechartsTooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="hashrate" 
                stroke="#3b82f6" 
                strokeWidth={4} 
                fill="url(#colorGlow)" 
                animationDuration={1500} 
                isAnimationActive={true}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
          animation: floatUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
