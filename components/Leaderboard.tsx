
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { UserStats, LeaderboardEntry, NetworkData } from '../types';
import { getLeaderboardData } from '../services/storageService';

interface LeaderboardProps {
  stats: UserStats;
  network: NetworkData;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ stats, network }) => {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  const statsAtFetchRef = useRef(stats);

  const fetchRanks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getLeaderboardData(statsAtFetchRef.current);
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error("Failed to sync leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRanks();
  }, [fetchRanks]);

  const processedData = useMemo(() => {
    const updated = data.map(entry => {
      if (entry.isUser) {
        return {
          ...entry,
          miningPower: stats.miningPower,
          totalEarned: stats.totalEarned
        };
      }
      return entry;
    });
    return updated.sort((a, b) => b.miningPower - a.miningPower);
  }, [data, stats.miningPower, stats.totalEarned]);

  const userIndex = useMemo(() => processedData.findIndex(e => e.isUser), [processedData]);
  const userEntry = processedData[userIndex];
  const nextNode = userIndex > 0 ? processedData[userIndex - 1] : null;

  const topThree = useMemo(() => processedData.slice(0, 3), [processedData]);
  const others = useMemo(() => processedData.slice(3), [processedData]);

  const getTier = (rank: number) => {
    if (rank <= 3) return { name: 'Titan', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    if (rank <= 10) return { name: 'Elite', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (rank <= 50) return { name: 'Guardian', color: 'text-purple-400', bg: 'bg-purple-400/10' };
    return { name: 'Node', color: 'text-slate-500', bg: 'bg-slate-500/10' };
  };

  const performanceMatrix = useMemo(() => {
    const totalUsers = network.totalUsers || 45201;
    const rank = userEntry?.rank || 12;
    const percentile = (rank / totalUsers) * 100;
    const gap = nextNode ? (nextNode.miningPower - userEntry.miningPower).toFixed(1) : '0';
    
    return {
      percentile: percentile < 1 ? `TOP ${percentile.toFixed(2)}%` : `TOP ${Math.ceil(percentile)}%`,
      tier: getTier(rank),
      gapToNext: gap,
      dailyEst: (userEntry?.miningPower || 0) * 0.005
    };
  }, [userEntry, nextNode, network.totalUsers]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">🌍</div>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Calculating Hierarchy</p>
          <p className="text-[9px] font-bold text-slate-600 uppercase mt-2">Connecting to Global Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-700 overflow-x-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-end px-2 pt-2">
        <div className="space-y-1">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">Ranks</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Global Cluster Feed</p>
        </div>
        <button onClick={fetchRanks} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-90 transition-all shadow-xl">
          <span className="text-xl">🔄</span>
        </button>
      </div>

      {/* PODIUM */}
      <section className="relative pt-12 pb-4">
        <div className="grid grid-cols-3 gap-3 items-end">
          <div className="flex flex-col items-center gap-4">
             <div className="relative">
                <div className="w-20 h-20 bg-[#1a2333] border-2 border-slate-400/30 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl relative z-10">🥈</div>
                <div className="absolute -top-3 -right-2 bg-slate-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-white/20 z-20">#2</div>
             </div>
             <div className="text-center">
               <p className="text-[9px] font-black text-white uppercase truncate w-24 tracking-tighter">{topThree[1]?.address}</p>
               <p className="text-[10px] font-black text-slate-400 font-mono italic">{topThree[1]?.miningPower.toFixed(0)}</p>
             </div>
          </div>
          <div className="flex flex-col items-center gap-5 -translate-y-8">
             <div className="relative">
                <div className="absolute -inset-6 bg-yellow-500/20 blur-[40px] rounded-full animate-pulse"></div>
                <div className="w-28 h-28 bg-gradient-to-br from-yellow-400/30 to-yellow-600/50 border-2 border-yellow-400/40 rounded-[2.8rem] flex items-center justify-center text-6xl shadow-2xl relative z-10">🥇</div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[11px] font-black px-4 py-1 rounded-xl z-20 shadow-lg tracking-widest uppercase italic">TITAN</div>
             </div>
             <div className="text-center">
               <p className="text-xs font-black text-white uppercase tracking-tighter truncate w-32">{topThree[0]?.address}</p>
               <p className="text-sm font-black text-yellow-500 font-mono italic">{topThree[0]?.miningPower.toFixed(0)} GH/s</p>
             </div>
          </div>
          <div className="flex flex-col items-center gap-4">
             <div className="relative">
                <div className="w-20 h-20 bg-[#1a2333] border-2 border-orange-800/30 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl relative z-10">🥉</div>
                <div className="absolute -top-3 -right-2 bg-orange-700 text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-white/20 z-20">#3</div>
             </div>
             <div className="text-center">
               <p className="text-[9px] font-black text-white uppercase truncate w-24 tracking-tighter">{topThree[2]?.address}</p>
               <p className="text-[10px] font-black text-slate-400 font-mono italic">{topThree[2]?.miningPower.toFixed(0)}</p>
             </div>
          </div>
        </div>
      </section>

      {/* NEW: DENSITY MAP (Visual filler) */}
      <section className="bg-[#151a28]/40 border border-white/5 rounded-[2.5rem] p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cluster Distribution</span>
          <span className="text-[8px] font-black text-green-500 uppercase tracking-widest animate-pulse">Optimized</span>
        </div>
        <div className="h-20 flex items-center justify-around gap-1">
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} className="flex-1 bg-blue-500/10 rounded-full relative overflow-hidden h-full">
              <div 
                className="absolute bottom-0 left-0 w-full bg-blue-500/40 transition-all duration-1000" 
                style={{ height: `${Math.random() * 80 + 20}%` }}
              ></div>
            </div>
          ))}
        </div>
      </section>

      {/* FEED LIST */}
      <section className="bg-[#151a28]/60 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
        <header className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
           <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Network Feed</span>
           <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Power GH/s</span>
        </header>
        <div className="divide-y divide-white/5">
          {others.map((entry) => (
            <div key={`${entry.rank}-${entry.address}`} className={`px-8 py-6 flex items-center justify-between transition-all ${entry.isUser ? 'bg-blue-600/10 border-l-4 border-blue-500' : ''}`}>
              <div className="flex items-center gap-5">
                <span className={`text-base font-mono font-black ${entry.isUser ? 'text-blue-500' : 'text-slate-700'}`}>{entry.rank.toString().padStart(2, '0')}</span>
                <div className="space-y-1">
                   <p className={`text-sm font-black uppercase tracking-tight ${entry.isUser ? 'text-white' : 'text-slate-300'}`}>{entry.address}</p>
                   <div className="flex items-center gap-2">
                     <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-600" style={{ width: `${(entry.miningPower / topThree[0].miningPower) * 100}%` }}></div>
                     </div>
                     <span className="text-[7px] font-black uppercase text-slate-600">{getTier(entry.rank).name}</span>
                   </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-white font-mono leading-none">{entry.miningPower.toFixed(0)}</p>
                <p className="text-[8px] font-bold text-green-500 uppercase mt-1">{entry.totalEarned.toFixed(1)} COIM</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: PERFORMANCE INDEX HUD (Filling lower space) */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-[9px] font-black text-blue-100/60 uppercase tracking-[0.4em] mb-1">Performance Index</p>
                <h4 className="text-3xl font-black text-white italic tracking-tighter">{performanceMatrix.percentile}</h4>
             </div>
             <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{performanceMatrix.tier.name}</span>
             </div>
          </div>
          <div className="bg-black/20 p-4 rounded-[1.8rem] space-y-3">
             <div className="flex justify-between text-[8px] font-black text-blue-200/50 uppercase tracking-widest">
                <span>Tier Progress</span>
                <span>{Math.max(0, 100 - parseFloat(performanceMatrix.gapToNext)).toFixed(0)}%</span>
             </div>
             <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white shadow-[0_0_10px_white]" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
             </div>
             <p className="text-[7px] font-bold text-white/40 uppercase text-center leading-relaxed">Solve {(parseFloat(performanceMatrix.gapToNext) / 0.1).toFixed(0)} more blocks to climb rank</p>
          </div>
        </div>
      </section>

      <footer className="text-center px-10">
         <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em] leading-relaxed">
           CoinMath Cluster Hierarchy Protocol v5.8. Distribution Ledger Secured by De-centralized Consensus Cluster CM-9.
         </p>
      </footer>
    </div>
  );
};

export default Leaderboard;
