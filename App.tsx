
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppView, UserStats, NetworkData } from './types';
import { 
  INITIAL_STATS, 
  TAP_ENERGY_COST, 
  MATH_ENERGY_COST, 
  BOOST_DURATION_MS, 
  SUPER_COMPUTE_DURATION_MS, 
  ENERGY_MAX, 
  BASE_REWARD,
  DAILY_REWARD_COOLDOWN,
  VERIFICATION_MIN_LEVEL,
  VERIFICATION_MIN_ADS
} from './constants';
import Dashboard from './components/Dashboard';
import MathLab from './components/MathLab';
import Wallet from './components/Wallet';
import Leaderboard from './components/Leaderboard';
import ComplianceInfo from './components/ComplianceInfo';
import Onboarding from './components/Onboarding';
import Profile from './components/Profile';
import { showRewardedAd, RewardType } from './services/adService';
import { connectToWeb3 } from './services/storageService';

interface ToastMessage {
  id: number;
  text: string;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [network, setNetwork] = useState<NetworkData>({
    hashrate: 124.52,
    totalUsers: 45201,
    coimPrice: 0.12,
    nextHalving: '42 Days'
  });

  useEffect(() => {
    const saved = localStorage.getItem('coinmath_session_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats(prev => ({ 
          ...prev, 
          ...parsed, 
          lastHeartbeat: Date.now()
        }));
        if (!parsed.username) setActiveView(AppView.ONBOARDING);
      } catch (e) { console.error("Restore failed", e); }
    } else {
      setActiveView(AppView.ONBOARDING);
    }
  }, []);

  useEffect(() => {
    if (stats.username) {
      localStorage.setItem('coinmath_session_v5', JSON.stringify(stats));
    }
  }, [stats]);

  // Handle Verification Logic
  useEffect(() => {
    if (!stats.isVerifiedHuman && stats.level >= VERIFICATION_MIN_LEVEL && stats.adWatchCount >= VERIFICATION_MIN_ADS) {
       setStats(prev => ({ ...prev, isVerifiedHuman: true }));
       triggerToast("Miner Identity Verified! Network Unlocked.");
    }
  }, [stats.level, stats.adWatchCount]);

  const haptic = useCallback((pattern: number | number[]) => {
    if (stats.settings.haptics && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  }, [stats.settings.haptics]);

  const triggerToast = (text: string) => {
    setToast({ id: Date.now(), text });
    setTimeout(() => setToast(null), 3000);
  };

  const handleManualMine = useCallback(async () => {
    haptic(5);
    setStats(prev => {
      if (prev.energy < TAP_ENERGY_COST) return prev;
      const reward = BASE_REWARD;
      return {
        ...prev,
        balance: prev.balance + reward,
        totalEarned: prev.totalEarned + reward,
        tapsCount: prev.tapsCount + 1,
        energy: prev.energy - TAP_ENERGY_COST,
        lastHeartbeat: Date.now()
      };
    });
  }, [haptic]);

  const handleMathSolve = async (baseReward: number) => {
    haptic([15, 45, 15]);
    setStats(prev => {
      if (prev.energy < MATH_ENERGY_COST) return prev;
      const solved = prev.problemsSolved + 1;
      const newLevel = Math.floor(solved / 10) + 1;
      
      return {
        ...prev,
        balance: prev.balance + baseReward,
        problemsSolved: solved,
        totalEarned: prev.totalEarned + baseReward,
        level: newLevel,
        miningPower: 10 + (newLevel - 1) * 5 + (prev.referrals * 2),
        energy: Math.max(0, prev.energy - MATH_ENERGY_COST),
        lastHeartbeat: Date.now()
      };
    });
  };

  const handleWatchAd = async (type: RewardType): Promise<string | null> => {
    if (isAdLoading) return null;
    setIsAdLoading(true);
    try {
      const result = await showRewardedAd(type);
      if (result.success) {
        haptic([30, 70, 30]);
        let msg = "";
        setStats(prev => {
          const now = Date.now();
          const newState = { ...prev };
          newState.adWatchCount += 1;
          
          if (type === RewardType.ENERGY_REFILL) {
            newState.energy = ENERGY_MAX;
            msg = "Energy Restored";
          } else if (type === RewardType.BOOST_5X) {
            newState.boostMultiplier = 5.0;
            newState.boostEndTime = now + (5 * 60 * 1000);
            newState.lastAdTimestamp = now;
            msg = "5X Turbo Active";
          }
          return newState;
        });
        if (msg) triggerToast(msg);
        return msg;
      }
      return null;
    } finally {
      setIsAdLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const addr = await connectToWeb3();
      setStats(prev => ({ ...prev, walletAddress: addr }));
      triggerToast("Non-Custodial Wallet Linked");
    } catch (e) {
      triggerToast("Connection Failed");
    }
  };

  const handleWithdraw = (amount: number) => {
    setStats(prev => ({
      ...prev,
      balance: prev.balance - amount,
    }));
    triggerToast(`Withdrawal of ${amount} COIM Initiated`);
  };

  const NavItem = ({ view, label, icon }: { view: AppView, label: string, icon: string }) => (
    <button
      onClick={() => { setActiveView(view); haptic(5); }}
      className={`relative flex flex-col items-center gap-1 transition-all flex-1 py-3 h-full justify-center ${
        activeView === view ? 'text-blue-500' : 'text-slate-500'
      }`}
    >
      <div className={`text-2xl transition-all duration-300 ${activeView === view ? 'scale-125 -translate-y-1' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}>{icon}</div>
      <span className="text-[7px] font-black uppercase tracking-[0.2em]">{label}</span>
      {activeView === view && (
        <div className="absolute bottom-0 w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
      )}
    </button>
  );

  if (activeView === AppView.ONBOARDING) {
    return <Onboarding onComplete={(u) => { setStats(prev => ({...prev, ...u, referralCode: u.username.toUpperCase() + '_NODE'})); setActiveView(AppView.DASHBOARD); }} />;
  }

  return (
    <div className="min-h-screen pb-36 flex flex-col bg-[#0b0f1a] text-slate-200 font-sans overflow-x-hidden selection:bg-blue-500/30">
      <header className="sticky top-0 z-[100] bg-[#0b0f1a]/80 backdrop-blur-xl border-b border-white/5 safe-area-top">
        <div className="px-5 py-4 flex items-center justify-between max-w-xl mx-auto w-full">
          <div className="flex items-center gap-3">
             <div className="w-11 h-11 bg-white rounded-2xl shadow-[0_5px_15px_rgba(255,255,255,0.1)] flex items-center justify-center p-1 border border-white/20 overflow-hidden">
                <img 
                  src="logo.png" 
                  alt="CoinMath" 
                  className="w-full h-full object-contain p-1" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/google/material-design-icons/master/png/action/extension/materialicons/48dp/1x/baseline_extension_white_48dp.png';
                    (e.target as HTMLImageElement).parentElement!.style.backgroundColor = '#2563eb';
                  }}
                />
             </div>
             <div>
                <h1 className="text-white font-black text-[11px] uppercase tracking-tighter leading-none italic">Cluster Active</h1>
                <div className="flex items-center gap-1.5 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{stats.username || 'Syncing...'}</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-2 bg-blue-600/10 pl-2 pr-4 py-1.5 rounded-2xl border border-blue-500/20 backdrop-blur-md">
             <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] shadow-lg">🪙</div>
             <span className="text-xs font-mono font-black text-white tracking-tighter">{stats.balance.toFixed(4)}</span>
          </div>
        </div>
      </header>

      {/* Global Toast Notifications */}
      {toast && (
        <div className="fixed top-24 left-6 right-6 z-[400] max-w-sm mx-auto pointer-events-none">
          <div className="bg-[#151a28]/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 animate-in slide-in-from-top-4">
             <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-xl shadow-lg">✨</div>
             <div>
                <p className="text-[8px] font-black uppercase text-blue-500 tracking-widest">Protocol Sync</p>
                <p className="text-white font-black uppercase text-xs tracking-tight">{toast.text}</p>
             </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-5 md:max-w-xl md:mx-auto w-full animate-in fade-in duration-700">
        {activeView === AppView.DASHBOARD && <Dashboard stats={stats} network={network} onWatchAd={handleWatchAd} onManualMine={handleManualMine} />}
        {activeView === AppView.MATH_LAB && <MathLab level={stats.level} energy={stats.energy} boostActive={false} onSolve={handleMathSolve} onWatchAd={() => handleWatchAd(RewardType.ENERGY_REFILL)} />}
        {activeView === AppView.WALLET && <Wallet stats={stats} onConnect={handleConnectWallet} />}
        {activeView === AppView.LEADERBOARD && <Leaderboard stats={stats} network={network} />}
        {activeView === AppView.PROFILE && (
          <Profile 
            stats={stats} 
            onUpdateSettings={(s) => setStats({...stats, settings: s})} 
            onLogout={() => { localStorage.clear(); window.location.reload(); }}
            onWithdraw={handleWithdraw}
            onConnectWallet={handleConnectWallet}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation */}
      <div className="fixed bottom-8 left-6 right-6 z-[300] safe-area-bottom max-w-sm mx-auto w-[calc(100%-3rem)]">
        <nav className="bg-[#1a1f2e]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] h-20 flex items-center px-4 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
           <NavItem view={AppView.DASHBOARD} label="Engine" icon="🕹️" />
           <NavItem view={AppView.MATH_LAB} label="Lab" icon="🧪" />
           <NavItem view={AppView.LEADERBOARD} label="Ranks" icon="🏆" />
           <NavItem view={AppView.WALLET} label="Vault" icon="💰" />
           <NavItem view={AppView.PROFILE} label="Node" icon="⚙️" />
        </nav>
      </div>
    </div>
  );
};

export default App;
