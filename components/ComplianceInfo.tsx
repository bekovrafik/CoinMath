
import React from 'react';

const ComplianceInfo: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <section className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <span className="text-9xl font-black">M</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
          <span className="p-2 bg-blue-600 rounded-lg">🛡️</span>
          CoinMath Security & Protocol
        </h2>
        
        <div className="space-y-6 text-slate-300 relative z-10">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 underline decoration-blue-500 underline-offset-4">Cloud Computing Policy</h3>
            <p className="text-sm leading-relaxed">
              CoinMath is built on the <strong>Proof of Intelligence</strong> protocol. Unlike traditional cryptominers, CoinMath does <strong>NOT</strong> perform any high-intensity hashing on your device. Every reward generated is calculated via our secure cloud servers. This ensures 100% compliance with Google Play Store policies regarding on-device mining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800">
              <h4 className="text-green-400 text-xs font-black uppercase tracking-widest mb-3">CoinMath Operations</h4>
              <ul className="text-xs space-y-2 list-disc pl-4 text-slate-400">
                <li>Server-side distribution ledger</li>
                <li>Mathematical proof verification</li>
                <li>API-based balance synchronization</li>
                <li>Passive energy restoration</li>
              </ul>
            </div>
            <div className="p-5 bg-slate-900/50 rounded-2xl border border-red-900/30">
              <h4 className="text-red-400 text-xs font-black uppercase tracking-widest mb-3">Restricted Activity</h4>
              <ul className="text-xs space-y-2 list-disc pl-4 text-slate-400">
                <li>Local CPU/GPU mining algorithms</li>
                <li>Battery-draining background tasks</li>
                <li>Heavy hardware utilization</li>
                <li>Thermal-intensive processing</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2 underline decoration-blue-500 underline-offset-4">Verified Rewards</h3>
            <p className="text-sm leading-relaxed">
              Our Ad-to-Energy economy is fully integrated with AdMob's Server-Side Verification (SSV). Rewards are only finalized once our backend receives a secure signature from Google, protecting the integrity of the CoinMath ecosystem and preventing local manipulation.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2 underline decoration-blue-500 underline-offset-4">User Privacy</h3>
            <p className="text-sm leading-relaxed">
              CoinMath does not collect invasive data. We prioritize device longevity and user security. Our code is optimized to minimize battery impact, acting like a standard educational puzzle app while offering cloud-based reward potential.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">Official Play Store Metadata</h3>
        <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
          <p>This information is provided for compliance review and transparency:</p>
          <div className="bg-slate-900 p-6 rounded-2xl space-y-4 font-mono border border-slate-800">
            <div>
              <p className="text-blue-400 font-bold mb-1 uppercase tracking-tighter">App Name:</p>
              <p>CoinMath: Proof of Intelligence</p>
            </div>
            <div>
              <p className="text-blue-400 font-bold mb-1 uppercase tracking-tighter">Short Description:</p>
              <p>Solve math blocks to earn cloud rewards. Optimized for battery & safety.</p>
            </div>
            <div>
              <p className="text-blue-400 font-bold mb-1 uppercase tracking-tighter">Privacy Section:</p>
              <p>CoinMath utilizes AdMob for secure ad rewards. Device IDs may be used for fraud prevention and personalized ad delivery as per AdMob policies. No biometric or sensitive data is collected.</p>
            </div>
            <div>
              <p className="text-blue-400 font-bold mb-1 uppercase tracking-tighter">Compliance Clause:</p>
              <p>This application does not perform on-device crypto-mining. All rewards are managed and distributed via cloud servers based on intellectual problem-solving efforts.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center pb-8">
        <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">© 2025 CoinMath Protocol v2.6</p>
      </div>
    </div>
  );
};

export default ComplianceInfo;
