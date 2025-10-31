# Self Protocol Configuration Guide

## Overview
This guide explains how to configure Self Protocol for both Celo Alfajores (testnet) and Celo Mainnet.

## Network Configuration

### Celo Alfajores Testnet (Chain ID: 44787)

| Parameter | Value |
|-----------|-------|
| **Self Hub Address** | `0x68c931C9a534D37aa78094877F46fE46a49F1A51` |
| **Chain ID** | `44787` |
| **Endpoint Type** | `staging_celo` |
| **cUSD Address** | `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1` |
| **RPC URL** | `https://alfajores-forno.celo-testnet.org` |
| **Block Explorer** | `https://alfajores.celoscan.io` |
| **Faucet** | `https://faucet.celo.org` |

### Celo Mainnet (Chain ID: 42220)

| Parameter | Value |
|-----------|-------|
| **Self Hub Address** | `0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF` |
| **Chain ID** | `42220` |
| **Endpoint Type** | `celo` |
| **cUSD Address** | `0x765DE816845861e75A25fCA122bb6898B8B1282a` |
| **RPC URL** | `https://forno.celo.org` |
| **Block Explorer** | `https://celoscan.io` |

## Self Protocol SDK Configuration

### Common Parameters (Both Networks)

```typescript
{
  appName: "YieldMaker DeFi",
  scope: "YieldMaker",
  version: 2,
  userIdType: "hex",
  userDefinedData: "yieldmaker_verification",
  devMode: false, // Set to true for testing
}
```

### Network-Specific Configuration

**Alfajores (Testnet):**
```typescript
{
  chainID: 44787,
  endpointType: "staging_celo",
  endpoint: VAULT_CONTRACT_ADDRESS.toLowerCase(),
  userId: userWalletAddress.toLowerCase(),
}
```

**Mainnet:**
```typescript
{
  chainID: 42220,
  endpointType: "celo",
  endpoint: VAULT_CONTRACT_ADDRESS.toLowerCase(),
  userId: userWalletAddress.toLowerCase(),
}
```

## What You Need to Provide

### For Testnet Deployment:
1. ✅ **Self Hub Address**: Already configured (`0x68c931C9a534D37aa78094877F46fE46a49F1A51`)
2. ✅ **Verification Config ID**: Already configured (`0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61`)
3. ⚠️ **Hashed Scope**: Calculate using `npm run calculate-scope` before deploying
4. ✅ **Private Key**: Set in `.env` file

### For Mainnet Deployment:
1. ✅ **Self Hub Address**: Already configured (`0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF`)
2. ✅ **Verification Config ID**: Same as testnet (`0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61`)
3. ⚠️ **Hashed Scope**: Calculate using `npm run calculate-scope` **with mainnet RPC**
4. ⚠️ **Private Key**: Set in `.env` file (ensure sufficient mainnet CELO balance)
5. ⚠️ **Mainnet CELO**: At least 1 CELO for deployment

## Deployment Steps

### Option 1: Interactive Deployment (Recommended)

```bash
cd contracts
./deploy-interactive.sh
```

This script will:
1. Ask you to choose between Alfajores or Mainnet
2. Perform safety checks
3. Deploy all contracts
4. Save addresses to `deployment.env`

### Option 2: Manual Deployment

**For Alfajores:**
```bash
cd contracts
./deploy.sh  # Configured for Alfajores by default
```

**For Mainnet:**
```bash
cd contracts

# Deploy SelfVerificationRegistry
forge script script/DeploySelfVerificationRegistryMainnet.s.sol \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify \
  -vvvv

# Deploy YieldmakerVault
forge script script/DeployYieldmakerVaultV2Mainnet.s.sol \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify \
  -vvvv
```

## Calculating Hashed Scope

**IMPORTANT**: The hashed scope is different for each network because it depends on your deployer nonce.

### For Alfajores:
```bash
# Set RPC to Alfajores
export CELO_TESTNET_RPC_URL=https://alfajores-forno.celo-testnet.org
npm run calculate-scope
```

### For Mainnet:
```bash
# Set RPC to Mainnet
export CELO_TESTNET_RPC_URL=https://forno.celo.org
npm run calculate-scope
```

Copy the output `HASHED_SCOPE` value to your `.env` file.

## Environment Variables

Create or update `.env` file in the contracts directory:

```bash
# Required
PRIVATE_KEY=your_private_key_here
HASHED_SCOPE=your_calculated_scope_here

# Optional (uses defaults if not set)
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
CELO_MAINNET_RPC=https://forno.celo.org
```

## Frontend Configuration

After deployment, update the frontend:

1. **Update `.env.local`:**
```bash
# For Alfajores
NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_44787=<deployed_vault_address>

# For Mainnet
NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_42220=<deployed_vault_address>
```

2. **Update `frontend/src/contracts/addresses/index.ts`:**
```typescript
export const CONTRACT_ADDRESSES = {
  YIELDMAKER_VAULT: "deployed_vault_address",
  SIMPLE_HOLD_STRATEGY: "deployed_strategy_address",
  SELF_VERIFICATION_REGISTRY: "deployed_registry_address",
  CUSD: "network_cusd_address",
  // ...
};
```

## Self Protocol SDK Implementation

The frontend is already configured to automatically detect the network and use the correct settings:

```typescript
// Auto-detects based on chainId from wagmi
const chainId = useChainId(); // Returns 44787 or 42220
const endpointType = chainId === 44787 ? "staging_celo" : "celo";

const selfAppConfig = {
  appName: "YieldMaker DeFi",
  scope: "YieldMaker",
  endpoint: contractAddress.toLowerCase(),
  endpointType,
  userId: walletAddress.toLowerCase(),
  userIdType: "hex",
  version: 2,
  chainID: chainId as 42220 | 44787, // SDK only accepts these
  userDefinedData: "yieldmaker_verification",
  devMode: chainId === 44787, // true for testnet, false for mainnet
};
```

## Verification

### Verify Contracts on Block Explorer

**Alfajores:**
```bash
forge verify-contract <CONTRACT_ADDRESS> \
  src/ContractName.sol:ContractName \
  --chain-id 44787 \
  --etherscan-api-key <YOUR_API_KEY>
```

**Mainnet:**
```bash
forge verify-contract <CONTRACT_ADDRESS> \
  src/ContractName.sol:ContractName \
  --chain-id 42220 \
  --etherscan-api-key <YOUR_API_KEY>
```

## Testing Self Verification

### On Testnet (Alfajores):
1. Get testnet CELO from https://faucet.celo.org
2. Deploy contracts using `./deploy-interactive.sh` and select option 1
3. Download Self mobile app
4. Complete KYC in the Self app
5. Scan the QR code from your YieldMaker app
6. Verify that chainID shows `44787`

### On Mainnet:
1. Ensure you have real CELO and cUSD
2. Deploy contracts using `./deploy-interactive.sh` and select option 2
3. Complete KYC in the Self app (if not already done)
4. Scan the QR code from your YieldMaker app
5. Verify that chainID shows `42220`
6. **Real identity verification will be performed**

## Important Notes

1. **ChainID Limitation**: Self Protocol SDK only supports `42220` (mainnet) and `44787` (Alfajores). Sepolia (`11142220`) is NOT supported.

2. **Hashed Scope**: Must be calculated **separately** for each network using the correct RPC URL before deployment.

3. **Verification Config ID**: The same verification config ID works for both networks, but you can create different configs at https://tools.self.xyz if needed.

4. **Real KYC**: On mainnet, Self Protocol performs real identity verification with government-issued IDs.

5. **Deployment Order**: Always deploy SelfVerificationRegistry first, then YieldmakerVault, then connect them.

## Troubleshooting

### "Proof Failed" Error
- Ensure you've completed KYC in the Self mobile app
- Verify the chainID in QR code matches your network
- Check that Self Hub address is correct for your network

### "Wrong Network" Error
- Ensure your wallet is connected to the correct network (44787 or 42220)
- Check RPC URL in Web3Provider matches the network

### Contract Deployment Fails
- Verify you have enough CELO for gas
- Ensure `HASHED_SCOPE` is calculated for the correct network
- Check that you haven't made any transactions after calculating scope

## Resources

- Self Protocol Docs: https://docs.self.xyz
- Self Mobile App: https://self.xyz
- Celo Docs: https://docs.celo.org
- Alfajores Faucet: https://faucet.celo.org
- CeloScan (Mainnet): https://celoscan.io
- CeloScan (Alfajores): https://alfajores.celoscan.io
