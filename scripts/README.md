# YieldMaker Deployment Scripts

This directory contains scripts to help with contract deployment and Self Protocol integration.

## Prerequisites

Install dependencies from the root directory:

```bash
cd /Users/musaga/YieldMaker
npm install
```

## Scripts

### 1. Calculate Scope Hash (`calculateScope.ts`)

This script calculates the hashed scope value needed for Self Protocol integration by:
1. Predicting the future contract address based on your deployer's current nonce
2. Generating a scope hash using the predicted address and app name "YieldMaker"

**Usage:**

```bash
# Make sure you have PRIVATE_KEY in your .env file
npm run calculate-scope

# Or run directly
npx ts-node scripts/calculateScope.ts
```

**Output:**
```
=== YieldMaker Scope Calculation ===
Deployer address: 0x...
Current nonce: 5
Predicted contract address: 0x...

=== Results ===
App name: YieldMaker
Hashed scope: 12345678...

Add this to your .env file:
HASHED_SCOPE=12345678...

⚠️  Important: Deploy immediately after running this script
    If you make any transactions, the nonce will change!
```

## Deployment Workflow

### For Testnet (Celo Alfajores)

1. **Calculate Scope:**
   ```bash
   npm run calculate-scope
   ```

2. **Update .env file:**
   Add the `HASHED_SCOPE` value from the output to your `.env` file

3. **Deploy Contract:**
   ```bash
   cd contracts
   forge script script/DeploySelfVerificationRegistryFixed.s.sol \
     --rpc-url $CELO_ALFAJORES_RPC \
     --broadcast \
     --verify \
     -vvvv
   ```

### For Mainnet (Celo Mainnet)

1. **Calculate Scope** (using mainnet RPC):
   ```bash
   CELO_MAINNET_RPC=https://forno.celo.org npm run calculate-scope
   ```

2. **Update .env file:**
   Add the `HASHED_SCOPE` value

3. **Deploy Contract:**
   ```bash
   cd contracts
   forge script script/DeploySelfVerificationRegistry.s.sol \
     --rpc-url $CELO_MAINNET_RPC \
     --broadcast \
     --verify \
     -vvvv
   ```

## Environment Variables

Required in your `.env` file:

```env
# Deployer private key
PRIVATE_KEY=your_private_key_here

# Network RPC URLs
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
CELO_MAINNET_RPC=https://forno.celo.org

# Self Protocol Configuration (from calculateScope.ts)
HASHED_SCOPE=calculated_value_here

# Self Protocol Hub Addresses (automatically set in deployment scripts)
# Testnet: 0x68c931C9a534D37aa78094877F46fE46a49F1A51
# Mainnet: 0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF

# Verification Config ID (same for both networks)
SELF_CONFIG_ID=0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61
```

## Important Notes

- **Nonce Management**: The scope calculation depends on your current nonce. Deploy immediately after calculating the scope.
- **Network Selection**: Make sure you're using the correct RPC URL for your target network.
- **Contract Verification**: The `--verify` flag requires `ETHERSCAN_API_KEY` or `CELOSCAN_API_KEY` in your environment.

## Troubleshooting

### Scope hash mismatch
If you get a scope mismatch error during verification, it likely means:
- You made a transaction between calculating the scope and deploying
- Your nonce changed, so the predicted address is wrong

**Solution**: Re-run `calculateScope.ts` and update `HASHED_SCOPE` in your `.env`

### Contract deployment fails
- Check your deployer has enough balance
- Verify all environment variables are set correctly
- Ensure you're connected to the correct network
