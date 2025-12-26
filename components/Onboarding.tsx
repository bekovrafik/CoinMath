
import React, { useState, useEffect } from 'react';

interface OnboardingProps {
  onComplete: (user: { username: string; email: string }) => void;
}

const steps = [
  {
    title: "Intelligence Protocol",
    description: "CoinMath replaces hardware-heavy mining with human logic. Solve blocks to secure the global cluster.",
    icon: "🧠",
    color: "from-blue-600 to-indigo-600",
    tag: "Protocol v5.2",
    glow: "rgba(59, 130, 246, 0.4)"
  },
  {
    title: "Quantum Sync",
    description: "Your device acts as a validation node. Zero battery drain, max yield through cloud-based compute.",
    icon: "⚡",
    color: "from-cyan-500 to-blue-500",
    tag: "100% Efficient",
    glow: "rgba(6, 182, 212, 0.4)"
  },
  {
    title: "Eco-Research",
    description: "Every solved equation contributes to decentralized scientific research. Build the future while you earn.",
    icon: "🔬",
    color: "from-emerald-500 to-green-600",
    tag: "Eco-Neutral",
    glow: "rgba(16, 185, 129, 0.4)"
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isAuth, setIsAuth] = useState(false);
  const [form, setForm] = useState({ username: '', email: '' });
  const [isAnimating, setIsAnimating] = useState(false);
  const [demoSolved, setDemoSolved] = useState(false);
  const [demoValue, setDemoValue] = useState('');

  const handleNext = () => {
    if (step < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsAnimating(false);
      }, 400);
    } else {
      setIsAuth(true);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.username && form.email) {
      onComplete({ username: form.username, email: form.email });
    }
  };

  if (isAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0b0f1a] safe-area-inset p-8 relative overflow-hidden font-sans">
        {/* Dynamic Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-700 relative z-10">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative group">
                {/* Brand Aura */}
                <div className="absolute -inset-10 bg-blue-500/20 blur-[50px] rounded-full animate-pulse"></div>
                <div className="absolute -inset-1 bg-white/10 blur-[8px] rounded-full"></div>
                
                {/* Logo Frame - Ensures high contrast for the logo */}
                <div className="w-24 h-24 p-0.5 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10 flex items-center justify-center overflow-hidden border border-white/20">
                  <img 
                    src="logo.png" 
                    alt="CoinMath" 
                    className="w-full h-full object-contain p-2 scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/google/material-design-icons/master/png/action/extension/materialicons/48dp/1x/baseline_extension_white_48dp.png';
                      (e.target as HTMLImageElement).parentElement!.style.backgroundColor = '#2563eb';
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">Initialize Node</h2>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] font-mono">Registry v2.85 Active</p>
            </div>
          </div>

          <form onSubmit={handleFinish} className="space-y-4">
            <div className="space-y-2 group">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4 group-focus-within:text-blue-400 transition-colors">Node Alias</label>
              <input 
                type="text" 
                placeholder="Ex: PrimeNode_01"
                required
                className="w-full h-16 bg-[#151a28]/80 backdrop-blur-md border border-white/5 rounded-[1.8rem] px-6 text-white font-bold focus:outline-none focus:border-blue-500/40 transition-all shadow-inner placeholder:text-slate-800"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
              />
            </div>
            
            <div className="space-y-2 group">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4 group-focus-within:text-blue-400 transition-colors">Signal Channel (Email)</label>
              <input 
                type="email" 
                placeholder="node@coinmath.io"
                required
                className="w-full h-16 bg-[#151a28]/80 backdrop-blur-md border border-white/5 rounded-[1.8rem] px-6 text-white font-bold focus:outline-none focus:border-blue-500/40 transition-all shadow-inner placeholder:text-slate-800"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
            
            <div className="pt-6">
              <button 
                type="submit"
                className="w-full h-20 bg-blue-600 hover:bg-blue-500 rounded-[2.2rem] text-white font-black uppercase tracking-[0.4em] shadow-[0_15px_40px_rgba(37,99,235,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">Initialize Sync <span className="text-xl">⚡</span></span>
              </button>
            </div>
          </form>

          <p className="text-center text-[7px] font-bold text-slate-700 uppercase tracking-[0.3em] leading-relaxed max-w-[240px] mx-auto opacity-60">
            By initializing, you agree to the Proof of Intelligence network consensus protocols.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f1a] relative overflow-hidden safe-area-inset font-sans">
      {/* Segmented Story HUD */}
      <div className="absolute top-12 left-10 right-10 flex gap-2 z-50">
        {steps.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
            <div 
              className={`h-full bg-blue-500 transition-all duration-700 ${i <= step ? 'w-full' : 'w-0'}`}
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          </div>
        ))}
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center px-10 transition-all duration-500 ${isAnimating ? 'opacity-0 scale-90 blur-lg' : 'opacity-100 scale-100'}`}>
        
        {step === 1 ? (
          /* Interactive Demo Block */
          <div className="relative mb-14 w-full max-w-[280px]">
            <div className="absolute inset-0 blur-[100px] rounded-full bg-cyan-500/10 animate-pulse"></div>
            <div className="bg-[#151a28]/60 backdrop-blur-xl rounded-[2.8rem] p-8 border border-white/5 shadow-2xl relative z-10 text-center space-y-6">
              <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Live Validation Test</span>
              <div className="text-4xl font-black text-white font-mono italic">5 + 7 = ?</div>
              <input 
                type="number" 
                value={demoValue}
                onChange={(e) => {
                  setDemoValue(e.target.value);
                  if (e.target.value === '12') setDemoSolved(true);
                }}
                placeholder="?"
                className="w-20 h-20 bg-black/40 border-2 border-white/5 rounded-3xl text-center text-3xl font-black text-blue-400 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-900"
              />
              {demoSolved && (
                <div className="text-[10px] font-black text-green-500 uppercase tracking-widest animate-bounce">
                  Block Verified! +0.05 COIM
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Educational Icon Block */
          <div className="relative mb-14">
            <div 
              className="absolute inset-0 blur-[80px] rounded-full animate-pulse transition-all duration-1000"
              style={{ background: steps[step].glow }}
            ></div>
            <div className={`w-40 h-40 rounded-[3.5rem] bg-gradient-to-br ${steps[step].color} flex items-center justify-center text-[70px] shadow-2xl border border-white/10 relative z-10 animate-float`}>
              {steps[step].icon}
            </div>
          </div>
        )}

        <div className="text-center space-y-4 max-w-xs relative z-20">
          <div className="flex justify-center">
            <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[8px] font-black text-blue-400 uppercase tracking-[0.4em] backdrop-blur-md">
              {steps[step].tag}
            </span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-2xl">
            {steps[step].title}
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed opacity-70 px-4">
            {steps[step].description}
          </p>
        </div>
      </div>

      {/* Main Action Zone (Bottom) */}
      <div className="p-10 pb-16 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a] to-transparent relative z-30">
        <div className="max-w-sm mx-auto space-y-6">
          <button 
            onClick={handleNext}
            className={`w-full h-20 rounded-[2.2rem] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all flex items-center justify-center group relative overflow-hidden ${
              step === 1 && !demoSolved ? 'bg-slate-800 text-slate-600 grayscale' : 'bg-white text-[#0b0f1a]'
            }`}
          >
            <span className="relative z-10">{step === steps.length - 1 ? "Get Started" : "Synchronize"}</span>
            {step === 1 && !demoSolved && (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                 <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mt-10">Solve Above to Continue</span>
              </div>
            )}
          </button>
          
          <button 
            onClick={() => setIsAuth(true)}
            className="w-full text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] text-center hover:text-slate-500 transition-colors py-2"
          >
            Skip Telemetry
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .safe-area-inset {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
