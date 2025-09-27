# Aave Strategy Deployment Guide

## Overview

This guide will help you deploy the Aave strategy to Celo L2, where Aave V3 is already live and operational.

## Prerequisites

1. **Celo L2 Setup**: Ensure your wallet is connected to Celo L2 (Chain ID: 42220)
2. **Private Key**: Have your deployment private key ready
3. **Aave V3 Addresses**: We need to find the actual Aave V3 contract addresses on Celo L2

## Step 1: Environment Setup

```bash
# Set your private key (keep this secure!)
export PRIVATE_KEY=0x...

# Navigate to contracts directory
cd contracts
```

## Step 2: Find Aave V3 Contract Addresses

### Option A: Automated Discovery (Try First)

```bash
# Run our discovery script
forge script script/FindAaveAddresses.s.sol:FindAaveAddresses \
    --rpc-url https://forno.celo.org \
    --broadcast
```

### Option B: Manual Discovery

1. Visit [Aave V3 on Celo](https://app.aave.com/markets/?marketName=proto_celo_v3)
2. Open browser developer tools (F12)
3. Go to Network tab and look for API calls
4. Find contract addresses in the responses

### Option C: Block Explorer Search

1. Visit [Celo L2 Explorer](https://explorer.celo.org)
2. Search for recent Aave transactions
3. Look for contract addresses in transaction details

## Step 3: Update Contract Addresses

Edit `script/DeployAaveStrategy.s.sol` and update these addresses:

```solidity
// Replace these with actual addresses found in Step 2
address constant AAVE_POOL = 0x...; // Aave V3 Pool contract
address constant CUSD_TOKEN = 0x...; // cUSD token on Celo L2
address constant VAULT_ADDRESS = 0x...; // Your YieldMaker Vault
```

## Step 4: Deploy the Strategy

### Option A: Use the automated script

```bash
./script/deploy.sh
```

### Option B: Manual deployment

```bash
forge script script/DeployAaveStrategy.s.sol:DeployAaveStrategy \
    --rpc-url https://forno.celo.org \
    --broadcast \
    --verify \
    --gas-estimate-multiplier 200
```

## Step 5: Update Frontend

Update the contract addresses in your frontend:

```typescript
// frontend/src/contracts/addresses/index.ts
export const CONTRACT_ADDRESSES = {
  // ... existing addresses
  AAVE_POOL: "0x...", // From Step 2
  AAVE_STRATEGY: "0x...", // From deployment output
} as const;
```

## Step 6: Test the Integration

1. **Small Test Deposit**: Try depositing a small amount (e.g., 1 cUSD)
2. **Check Strategy Balance**: Verify the strategy shows correct balance
3. **Test Withdrawal**: Withdraw the test amount
4. **Monitor APY**: Check that yield is being generated

## Verification Commands

```bash
# Check strategy deployment
forge verify-contract <STRATEGY_ADDRESS> \
    src/AaveStrategy.sol:AaveStrategy \
    --rpc-url https://forno.celo.org

# Test strategy functions
cast call <STRATEGY_ADDRESS> "totalAssets()" --rpc-url https://forno.celo.org
```

## Troubleshooting

### Common Issues:

1. **"Reserve not initialized on Aave"**

   - The asset is not supported by Aave V3 on Celo
   - Check available assets at https://app.aave.com/markets/?marketName=proto_celo_v3

2. **Gas Estimation Failed**

   - Increase gas estimate multiplier: `--gas-estimate-multiplier 300`
   - Check RPC endpoint is working

3. **Contract Verification Failed**
   - Verify manually on block explorer
   - Check compiler version matches

## Available Assets on Aave V3 Celo

Based on the Aave deployment announcement:

- **Collateral**: CELO, USDT, USDC
- **Borrowable**: CELO, USDT, USDC, cUSD, cEUR

## Important Notes

- **Test on small amounts first** before deploying large funds
- **Aave V3 is already live** on Celo L2 - we just need to connect to it
- **Gas is paid in CELO** on Celo L2
- **Transaction fees are very low** (sub-cent costs)

## Next Steps

After successful deployment:

1. Add the strategy to your vault contract
2. Update your frontend to show Aave yields
3. Monitor performance and APY
4. Consider adding more assets (USDC, USDT, etc.)
