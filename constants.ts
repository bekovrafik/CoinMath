
import { UserStats, Achievement } from './types';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', label: 'Genesis Miner', description: 'Solved your first math block', icon: '💎', achieved: false },
  { id: '2', label: 'Compute Titan', description: 'Reach Level 10', icon: '🧬', achieved: false },
  { id: '3', label: 'Network Node', description: 'Connect a Web3 Wallet', icon: '🔗', achieved: false },
  { id: '4', label: 'Overclocker', description: 'Use a 5X Turbo Boost', icon: '🔥', achieved: false },
];

export const INITIAL_STATS: UserStats = {
  username: '',
  email: '',
  balance: 0,
  pendingBalance: 0,
  level: 1,
  miningPower: 10,
  problemsSolved: 0,
  totalEarned: 0,
  energy: 100,
  boostMultiplier: 1.0,
  boostEndTime: 0,
  lastAdTimestamp: 0,
  superComputeEndTime: 0,
  lastHeartbeat: Date.now(),
  heartbeatHistory: [Date.now()],
  tapsCount: 0,
  isAutoMining: false,
  lastDailyReward: 0,
  referrals: 0,
  referralCode: '',
  referredBy: null,
  grandReferredBy: null,
  networkActiveMiners: 0,
  totalNetworkEarnings: 0,
  isVerifiedHuman: false,
  adWatchCount: 0,
  withdrawalPaused: false,
  achievements: INITIAL_ACHIEVEMENTS,
  settings: {
    haptics: true,
    sound: true
  }
};

export const COMMISSION_TIER_1 = 0.10; // 10%
export const COMMISSION_TIER_2 = 0.025; // 2.5%
export const VERIFICATION_MIN_LEVEL = 5;
export const VERIFICATION_MIN_ADS = 10;

export const DIFFICULTY_MULTIPLIERS = {
  Easy: 1,
  Medium: 2.5,
  Hard: 5.0
};

export const BASE_REWARD = 0.005;
export const MATH_BASE_REWARD = 0.05;
export const ENERGY_MAX = 100;
export const DAILY_REWARD_COOLDOWN = 24 * 60 * 60 * 1000;

// Fix: Adding missing constants required by Dashboard, MathLab, and App components
export const AD_COOLDOWN_MS = 60 * 1000; // 1 minute cooldown for rewards
export const TAP_ENERGY_COST = 1; // Energy consumed per manual block process
export const MATH_ENERGY_COST = 10; // Energy consumed per math lab sync
export const BOOST_DURATION_MS = 60 * 60 * 1000; // 1 hour standard boost
export const SUPER_COMPUTE_DURATION_MS = 10 * 60 * 1000; // 10 minutes super-compute
