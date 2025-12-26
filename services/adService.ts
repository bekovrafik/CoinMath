
/**
 * Simulated Ad Service
 * In a real app, this would use Google Mobile Ads SDK (AdMob)
 */

export enum RewardType {
  BOOST_2X = 'BOOST_2X',
  ENERGY_REFILL = 'ENERGY_REFILL',
  SUPER_COMPUTE = 'SUPER_COMPUTE',
  INSTANT_COIM = 'INSTANT_COIM',
  BOOST_5X = 'BOOST_5X'
}

export const showRewardedAd = (type: RewardType): Promise<{ success: boolean; type: RewardType }> => {
  return new Promise((resolve) => {
    const duration = type === RewardType.BOOST_5X ? '15-second' : '30-second';
    console.log(`Starting ${duration} rewarded video for ${type}...`);
    
    // Simulate a 2-second delay for the ad experience
    setTimeout(() => {
      const success = Math.random() > 0.02; // 98% success rate for simulation
      resolve({ success, type });
    }, 2000);
  });
};
