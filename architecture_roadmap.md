
# CoinMath: Multi-Tier Referral Architecture

## 1. Quality Gate Logic (Verification)
Rewards are earned in two states:
- **PENDING**: Earned by non-verified referrals. visible in parent's "On Hold" balance.
- **AVAILABLE**: Moved to parent's spendable balance once referral reaches **Level 5 + 10 Ads**.

## 2. Sybil Guard (Fraud Detection)
- **Cluster Window**: 60 minutes.
- **Cluster Limit**: 10 accounts per IP or Device ID.
- **Action**: Automatic account flagging + withdrawal pause + Security Alert entry.

## 3. Viral UX Messaging Templates

### Template A: The "Bonanza" Trigger (WhatsApp)
> "🚀 I've started a Math Mining Farm on my phone! It doesn't use battery—just logic. Join my node team to get a 0.10 $COIM instant bonus! 🧠 Use my link: [REF_LINK]"

### Template B: The "Web3 Alpha" Trigger (X/Twitter)
> "De-centralized compute powered by logic. Joining the #CoinMath cluster to build the future of mobile intelligence. ⚡️ My node link for a 2X speed boost: [REF_LINK] #Web3 #CryptoMiner"

### Template C: The "Eco-Mining" Trigger (Telegram)
> "Finally found a miner that doesn't kill my battery. CoinMath uses cloud-distribution for math blocks. Solve with me and let's earn $COIM together! 🌿 My invite: [REF_LINK]"

## 4. Implementation Checklist
- [x] Sybil cluster detection in SSV handler.
- [x] Verification trigger for pending balance migration.
- [x] Compact mobile-friendly Math Lab UI.
- [x] High-conversion social sharing in Profile.
