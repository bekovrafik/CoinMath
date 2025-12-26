
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem } from '../types';
import { generateMathProblem } from '../services/geminiService';
import { MATH_ENERGY_COST, ENERGY_MAX } from '../constants';

interface MathLabProps {
  level: number;
  energy: number;
  boostActive: boolean;
  onSolve: (reward: number) => void;
  onWatchAd: () => void;
}

const MathLab: React.FC<MathLabProps> = ({ level, energy, boostActive, onSolve, onWatchAd }) => {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [logs, setLogs] = useState<string[]>(['Initializing Quantum Core...', 'Waiting for task...']);
  const timerRef = useRef<number | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const outOfEnergy = energy < MATH_ENERGY_COST;

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `> ${msg}`]);
  };

  const fetchNewProblem = async () => {
    if (outOfEnergy) return;
    setLoading(true);
    setUserAnswer('');
    setFeedback(null);
    setTimeLeft(60);
    addLog('Requesting new compute block...');
    
    const newProblem = await generateMathProblem(level);
    setProblem(newProblem);
    setLoading(false);
    addLog(`Block received: ${newProblem.category} - ${newProblem.difficulty}`);
  };

  useEffect(() => {
    if (!outOfEnergy) fetchNewProblem();
    else addLog('CRITICAL: Energy low. Cluster sync paused.');
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [outOfEnergy]);

  useEffect(() => {
    if (problem && !loading && !outOfEnergy) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setFeedback({ type: 'error', message: 'TIMEOUT' });
            addLog('Sync timeout. Dropping packet.');
            setTimeout(fetchNewProblem, 1500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [problem, loading, outOfEnergy]);

  const handleSubmit = () => {
    if (!problem || outOfEnergy || !userAnswer) return;
    
    addLog(`Verifying solution: ${userAnswer}...`);
    
    if (userAnswer.trim().toLowerCase() === String(problem.answer).toLowerCase()) {
      setFeedback({ type: 'success', message: 'VERIFIED' });
      addLog(`Success! Reward injected: +${problem.reward.toFixed(3)} COIM`);
      onSolve(problem.reward);
      setTimeout(fetchNewProblem, 800);
    } else {
      setFeedback({ type: 'error', message: 'REJECTED' });
      addLog('Validation failed. Check sum error.');
      if (window.navigator.vibrate) window.navigator.vibrate(50);
      setUserAnswer('');
    }
  };

  const handleKeyPress = (val: string) => {
    if (loading || outOfEnergy) return;
    if (window.navigator.vibrate) window.navigator.vibrate(5);
    if (val === 'DEL') setUserAnswer(prev => prev.slice(0, -1));
    else if (val === '.' && !userAnswer.includes('.')) setUserAnswer(prev => prev + '.');
    else if (userAnswer.length < 10) setUserAnswer(prev => prev + val);
  };

  if (outOfEnergy) {
    return (
      <div className="bg-[#151a28] border border-red-500/20 rounded-[2.5rem] p-8 text-center animate-in zoom-in duration-300 shadow-2xl">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-black uppercase text-white mb-2 italic tracking-tighter">Energy Depleted</h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-8 leading-relaxed tracking-widest">
          Quantum synchronization requires core energy.<br/>Please wait for recharge or inject booster.
        </p>
        <button 
          onClick={onWatchAd} 
          className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
        >
          Instant Core Recharge
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
      {/* STATUS HEADER */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
            <span className="text-[10px] font-black text-blue-400 uppercase italic">v5.0_Secure</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Core Energy</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-white font-mono">{energy}%</span>
              <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${energy}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUANTUM TERMINAL CORE */}
      <div className="bg-[#0b0f1a] rounded-[2.5rem] border-2 border-white/5 p-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* SCANLINE EFFECT */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        
        {/* TIMER BAR */}
        <div className="absolute bottom-0 left-0 h-1 bg-blue-500/50 transition-all duration-1000 z-20 shadow-[0_0_10px_#3b82f6]" style={{ width: `${(timeLeft/60)*100}%` }}></div>

        <div className="flex justify-between items-center mb-6 relative z-20">
           <div className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">{problem?.category || 'SCANNING...'}</span>
           </div>
           <div className={`font-mono text-xs font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
              <span className="opacity-50">SYNC:</span> 00:{timeLeft.toString().padStart(2, '0')}
           </div>
        </div>

        <div className="min-h-[100px] flex flex-col items-center justify-center relative z-20 py-4">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
               <div className="w-8 h-8 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Decrypting Block...</span>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-black text-white font-mono italic leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {problem?.question}
              </h2>
              {feedback && (
                <div className={`mt-4 inline-block px-4 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest animate-in zoom-in ${
                  feedback.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {feedback.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* LIVE COMPUTE LOGS */}
      <div className="bg-black/40 border border-white/5 rounded-2xl p-3 h-24 font-mono overflow-hidden">
        <div className="flex flex-col gap-0.5" ref={logContainerRef}>
          {logs.map((log, i) => (
            <p key={i} className={`text-[8px] font-bold uppercase tracking-tighter ${i === logs.length - 1 ? 'text-blue-400' : 'text-slate-600 opacity-60'}`}>
              {log}
            </p>
          ))}
        </div>
      </div>

      {/* ANSWER DISPLAY */}
      <div className="bg-[#151a28] border border-white/10 rounded-2xl h-16 flex items-center justify-center relative shadow-inner">
        <div className={`text-3xl font-mono font-black tracking-widest ${userAnswer ? 'text-blue-400 text-glow' : 'text-slate-800'}`}>
          {userAnswer || '________'}
        </div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[7px] font-black text-slate-600 uppercase tracking-widest">Input:</div>
      </div>

      {/* COMMAND KEYPAD */}
      <div className="grid grid-cols-4 gap-2">
        {['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', 'DEL'].map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className={`h-14 rounded-2xl font-black text-lg transition-all active:scale-90 flex items-center justify-center shadow-lg ${
              key === 'DEL' 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                : 'bg-[#151a28] text-slate-100 border border-white/5 active:bg-blue-600/20'
            }`}
          >
            {key === 'DEL' ? '⌫' : key}
          </button>
        ))}
        <button 
          onClick={handleSubmit} 
          disabled={!userAnswer || loading}
          className="col-span-4 h-16 bg-blue-600 disabled:bg-slate-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-95 transition-all mt-2 relative overflow-hidden group"
        >
          <span className="relative z-10">Inject Solution</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>

      <style>{`
        .text-glow {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.4);
        }
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default MathLab;
