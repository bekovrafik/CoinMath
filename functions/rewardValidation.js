
/**
 * CoinMath Protocol: Cloud Reward & Multi-Tier Commission System
 * Implements tiered networking rewards and anti-fraud cluster detection.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

// Commission Rates
const T1_RATE = 0.10; // 10%
const T2_RATE = 0.025; // 2.5%

/**
 * HELPER: Distribute Commissions
 * Logic to calculate and assign rewards with 'Pending' vs 'Available' logic.
 */
async function distributeCommissions(childId, rewardAmount, transaction) {
  const childRef = db.collection('users').doc(childId);
  const childDoc = await transaction.get(childRef);
  if (!childDoc.exists) return;
  
  const childData = childDoc.data();
  // Verification check: Level 5+ and 10+ Ads
  const isSourceVerified = (childData.level >= 5 && childData.adWatchCount >= 10);
  const status = isSourceVerified ? 'AVAILABLE' : 'PENDING';

  // Tier 1 Parent
  if (childData.referredBy) {
    const commission = rewardAmount * T1_RATE;
    const parentRef = db.collection('users').doc(childData.referredBy);
    transaction.update(parentRef, {
      [status === 'AVAILABLE' ? 'balance' : 'pendingBalance']: admin.firestore.FieldValue.increment(commission),
      totalNetworkEarnings: admin.firestore.FieldValue.increment(commission)
    });
    const logRef = db.collection('commission_logs').doc();
    transaction.set(logRef, { recipientUid: childData.referredBy, sourceUid: childId, tier: 1, amount: commission, status, timestamp: admin.firestore.FieldValue.serverTimestamp() });
  }

  // Tier 2 Grandparent
  if (childData.grandReferredBy) {
    const commission = rewardAmount * T2_RATE;
    const gpRef = db.collection('users').doc(childData.grandReferredBy);
    transaction.update(gpRef, {
      [status === 'AVAILABLE' ? 'balance' : 'pendingBalance']: admin.firestore.FieldValue.increment(commission),
      totalNetworkEarnings: admin.firestore.FieldValue.increment(commission)
    });
    const logRef = db.collection('commission_logs').doc();
    transaction.set(logRef, { recipientUid: childData.grandReferredBy, sourceUid: childId, tier: 2, amount: commission, status, timestamp: admin.firestore.FieldValue.serverTimestamp() });
  }
}

/**
 * ADMOB SSV HANDLER (with Sybil Cluster Detection)
 */
exports.adMobSSVHandler = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('POST Required');
  const { user_id: userId, reward_type: rewardType, ip_address: ip, device_id: deviceId } = req.body;
  if (!userId) return res.status(400).send('Missing UserID');

  try {
    await db.runTransaction(async (transaction) => {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) throw new Error('User not found');

      // --- SYBIL GUARD: Cluster Detection (10+ accounts / 60 mins) ---
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const ipCluster = await db.collection('users')
        .where('lastIp', '==', ip || '0.0.0.0')
        .where('lastHeartbeat', '>', oneHourAgo)
        .limit(11)
        .get();

      const deviceCluster = await db.collection('users')
        .where('deviceId', '==', deviceId || 'unknown')
        .where('lastHeartbeat', '>', oneHourAgo)
        .limit(11)
        .get();

      if (ipCluster.size > 10 || deviceCluster.size > 10) {
        transaction.update(userRef, { status: 'FLAGGED', withdrawalPaused: true });
        console.warn(`[SybilGuard] Cluster detected for ${userId} on ${ip || deviceId}`);
        // Log the alert for manual review
        const alertRef = db.collection('security_alerts').doc();
        transaction.set(alertRef, { userId, ip, deviceId, timestamp: Date.now(), type: 'CLUSTER_SYBIL' });
      }

      // Process Reward
      const rewardAmount = (rewardType === 'INSTANT_COIM') ? 0.05 : 0.01;
      transaction.update(userRef, {
        balance: admin.firestore.FieldValue.increment(rewardAmount),
        adWatchCount: admin.firestore.FieldValue.increment(1),
        lastHeartbeat: Date.now(),
        lastIp: ip || null,
        deviceId: deviceId || null
      });

      await distributeCommissions(userId, rewardAmount, transaction);
    });
    return res.status(200).send('OK');
  } catch (err) {
    console.error('[AdSync] Failure:', err);
    return res.status(500).send('Error');
  }
});

/**
 * TRIGGER: Verification Unlocking
 * Automatically moves pending balances to available when a user hits criteria.
 */
exports.onUserVerified = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    const isNowVerified = (newData.level >= 5 && newData.adWatchCount >= 10);
    const wasVerified = (oldData.level >= 5 && oldData.adWatchCount >= 10);

    if (isNowVerified && !wasVerified) {
      const userId = context.params.userId;
      const logs = await db.collection('commission_logs')
        .where('sourceUid', '==', userId)
        .where('status', '==', 'PENDING')
        .get();

      const batch = db.batch();
      logs.forEach(logDoc => {
        const log = logDoc.data();
        const recipientRef = db.collection('users').doc(log.recipientUid);
        batch.update(recipientRef, {
          pendingBalance: admin.firestore.FieldValue.increment(-log.amount),
          balance: admin.firestore.FieldValue.increment(log.amount)
        });
        batch.update(logDoc.ref, { status: 'AVAILABLE' });
      });
      batch.update(change.after.ref, { isVerifiedHuman: true });
      return batch.commit();
    }
    return null;
  });
