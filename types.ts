
export interface MathProblem {
  id: string;
  question: string;
  answer: string | number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Arithmetic' | 'Algebra' | 'Logic';
  reward: number;
  hint?: string;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  miningPower: number;
  totalEarned: number;
  isUser?: boolean;
}

export interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: string;
  achieved: boolean;
}

export interface UserStats {
  username: string;
  email: string;
  balance: number;
  pendingBalance: number; // Commissions waiting for referral verification
  level: number;
  miningPower: number;
  problemsSolved: number;
  totalEarned: number;
  energy: number;
  boostMultiplier: number;
  boostEndTime: number;
  lastAdTimestamp: number;
  superComputeEndTime: number;
  lastHeartbeat: number;
  heartbeatHistory: number[];
  tapsCount: number;
  isAutoMining: boolean;
  lastDailyReward: number; 
  // Referral System Fields
  referrals: number; 
  referralCode: string;
  referredBy: string | null;
  grandReferredBy: string | null;
  networkActiveMiners: number;
  totalNetworkEarnings: number;
  isVerifiedHuman: boolean; // True after Level 5 + 10 Ads
  adWatchCount: number;
  
  // Withdrawal & Security
  walletAddress?: string;
  withdrawalPaused: boolean; // Flagged by Sybil detection

  achievements: Achievement[];
  settings: {
    haptics: boolean;
    sound: boolean;
  };
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  MATH_LAB = 'MATH_LAB',
  WALLET = 'WALLET',
  LEADERBOARD = 'LEADERBOARD',
  COMPLIANCE = 'COMPLIANCE',
  PROFILE = 'PROFILE'
}

export interface NetworkData {
  hashrate: number;
  totalUsers: number;
  coimPrice: number;
  nextHalving: string;
}
