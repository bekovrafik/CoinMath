
import { UserStats, LeaderboardEntry } from '../types';

/**
 * CoinMath Cloud Sync Service
 * Simulates communication with the Firebase/Node.js backend
 */

export const syncWithCloud = async (localStats: UserStats): Promise<Partial<UserStats>> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // In a real app, this would be a POST to /api/sync
  return {
    isAutoMining: true,
    lastHeartbeat: Date.now(),
    // Reward for active networking
    balance: localStats.balance + 0.00005,
    miningPower: 10 + (localStats.level - 1) * 5 + (localStats.referrals * 2)
  };
};

export const connectToWeb3 = async (): Promise<string> => {
  // Simulate Web3Auth / WalletConnect flow
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
};

export const getLeaderboardData = async (userStats: UserStats): Promise<LeaderboardEntry[]> => {
  // Simulate API fetch delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockEntries: LeaderboardEntry[] = [
    { rank: 1, address: '0x8f2...a192', miningPower: 842.5, totalEarned: 124.52 },
    { rank: 2, address: '0x3c1...e451', miningPower: 710.2, totalEarned: 98.21 },
    { rank: 3, address: '0x1a9...c882', miningPower: 655.0, totalEarned: 82.14 },
    { rank: 4, address: '0x992...f012', miningPower: 520.5, totalEarned: 45.90 },
    { rank: 5, address: '0xbb1...d221', miningPower: 485.2, totalEarned: 38.12 },
    { rank: 6, address: '0xcc3...a991', miningPower: 410.1, totalEarned: 22.45 },
    { rank: 7, address: '0xee2...b881', miningPower: 385.5, totalEarned: 15.67 },
  ];

  const userEntry: LeaderboardEntry = {
    rank: 12, 
    address: '0x' + userStats.username.toUpperCase().slice(0, 3) + '...NODE',
    miningPower: userStats.miningPower,
    totalEarned: userStats.totalEarned,
    isUser: true
  };

  return [...mockEntries, userEntry].sort((a, b) => b.miningPower - a.miningPower);
};
