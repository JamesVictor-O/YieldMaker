# 🚀 YieldMaker Deployment - Quick Start Guide

## Deploy Everything in 5 Steps (10 minutes)

---

## Step 1: Setup Environment (2 min)

```bash
cd /Users/musaga/YieldMaker/contracts

# Create .env file
cat > .env << 'EOF'
PRIVATE_KEY=0xYourPrivateKeyHere
HASHED_SCOPE=will_calculate_next
CELO_SEPOLIA_RPC=https://forno.celo-alfajores.celo-testnet.org
EOF
```

---

## Step 2: Calculate Scope Hash (1 min)

```bash
cd /Users/musaga/YieldMaker
npm run calculate-scope
```

**Copy the HASHED_SCOPE value and update your `.env` file:**
```bash
# Edit contracts/.env
HASHED_SCOPE=<paste_value_here>
```

---

## Step 3: Get Testnet Tokens (2 min)

1. Visit: https://faucet.celo.org
2. Enter your wallet address
3. Select "Celo Alfajores"
4. Claim free CELO

---

## Step 4: Deploy Contracts (3 min)

```bash
cd /Users/musaga/YieldMaker/contracts
./deploy.sh
```

The script will:
- ✅ Deploy SelfVerificationRegistry
- ✅ Deploy YieldmakerVault
- ✅ Deploy SimpleHoldStrategy
- ✅ Connect everything together
- ✅ Save addresses to `deployment.env`

---

## Step 5: Update Frontend (2 min)

### 5a. Update Contract Addresses

**Edit:** `frontend/src/contracts/addresses/index.ts`

```typescript
export const CONTRACT_ADDRESSES = {
  // Copy these from deployment.env
  YIELDMAKER_VAULT: "0xYourVaultAddress",
  SIMPLE_HOLD_STRATEGY: "0xYourStrategyAddress",
  SELF_VERIFICATION_REGISTRY: "0xYourRegistryAddress",

  // Keep these as-is for now
  CUSD: "0x0000000000000000000000000000000000000000",
  AAVE_POOL: "0x0000000000000000000000000000000000000000",
  AAVE_STRATEGY: "0x0000000000000000000000000000000000000000",
  // ...
};
```

### 5b. Update Environment Variables

**Edit:** `frontend/.env.local`

```env
# Copy vault address from deployment.env
NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_44787=0xYourVaultAddress

# Copy from contracts/.env
NEXT_PUBLIC_SELF_SCOPE=YourCalculatedScope

# Your existing values
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_id
```

---

## Step 6: Test! (1 min)

```bash
cd /Users/musaga/YieldMaker/frontend
npm run dev
```

Visit: http://localhost:3000

### Test Checklist:
- [ ] Wallet connects to Celo Alfajores
- [ ] Network shows "Celo Alfajores Testnet"
- [ ] Navigate to `/verify-self`
- [ ] QR code appears
- [ ] Can scan with Self mobile app

---

## 📁 Files Created

After deployment, you'll have:

```
contracts/
├── deploy.sh ✅ (executable)
├── deployment.env ✅ (contract addresses)
├── deployment-YYYYMMDD-HHMMSS.log ✅ (full log)
└── .env (your private key)
```

---

## 🎯 What You Deployed

| Contract | Purpose | Chain |
|----------|---------|-------|
| **SelfVerificationRegistry** | Identity verification | Celo Alfajores |
| **YieldmakerVault** | User deposits & shares | Celo Alfajores |
| **SimpleHoldStrategy** | Basic holding strategy | Celo Alfajores |

---

## 🔍 Verify Deployment

### Check on Block Explorer

Visit: https://celo-alfajores.celoscan.io

Search for your contract addresses (from `deployment.env`)

### Check Contract Integration

```bash
# From contracts directory
source deployment.env

# Verify registry is set in vault
cast call $VAULT_ADDRESS \
  "verificationRegistry()(address)" \
  --rpc-url https://forno.celo-alfajores.celo-testnet.org

# Should return your REGISTRY_ADDRESS
```

---

## 🚨 Troubleshooting

### "HASHED_SCOPE not set"
```bash
cd /Users/musaga/YieldMaker
npm run calculate-scope
# Update contracts/.env with output
```

### "Insufficient balance"
```bash
# Get more testnet CELO
open https://faucet.celo.org
```

### "Wrong network"
```bash
# Check you're on Alfajores
cast chain-id --rpc-url https://forno.celo-alfajores.celo-testnet.org
# Should return: 44787
```

### "Deployment failed"
```bash
# Check the log file
cat deployment-*.log | tail -50

# Try deploying manually
forge script script/DeploySelfVerificationRegistryFixed.s.sol \
  --rpc-url https://forno.celo-alfajores.celo-testnet.org \
  --broadcast \
  -vvv
```

---

## 📚 Detailed Guides

| Guide | Purpose |
|-------|---------|
| [DEPLOY_README.md](contracts/DEPLOY_README.md) | Complete deployment guide |
| [DEPLOYMENT_GUIDE.md](contracts/script/DEPLOYMENT_GUIDE.md) | Step-by-step instructions |
| [SEPOLIA_MIGRATION_COMPLETE.md](SEPOLIA_MIGRATION_COMPLETE.md) | Migration overview |
| [FRONTEND_UPDATES_SUMMARY.md](frontend/FRONTEND_UPDATES_SUMMARY.md) | Frontend changes |

---

## 🎉 Success Checklist

After completing all steps:

- [ ] `deployment.env` file exists with 3 addresses
- [ ] Frontend `addresses/index.ts` updated
- [ ] Frontend `.env.local` updated
- [ ] Contracts visible on block explorer
- [ ] Frontend connects to Celo Alfajores
- [ ] Can navigate to verification page

---

## 📞 Quick Reference

| Resource | URL/Command |
|----------|-------------|
| **Faucet** | https://faucet.celo.org |
| **Explorer** | https://celo-alfajores.celoscan.io |
| **RPC** | https://forno.celo-alfajores.celo-testnet.org |
| **Chain ID** | 44787 |
| **Deploy** | `./deploy.sh` |
| **Calculate Scope** | `npm run calculate-scope` |
| **Test Frontend** | `npm run dev` |

---

## 🚀 One-Line Deploy (After Setup)

```bash
cd /Users/musaga/YieldMaker/contracts && ./deploy.sh && echo "✅ Deployment complete! Check deployment.env for addresses"
```

---

**Time to Complete:** ~10 minutes
**Difficulty:** Easy
**Cost:** Free (testnet)

**Ready?** Start with Step 1! 🎯
