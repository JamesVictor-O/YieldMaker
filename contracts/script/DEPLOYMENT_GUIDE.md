# SelfVerificationRegistry Deployment Guide

Complete guide for deploying the SelfVerificationRegistry contract to Celo networks.

## 📋 Prerequisites

1. **Install Dependencies:**
   ```bash
   cd /Users/musaga/YieldMaker
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory with:
   ```env
   # Deployer wallet
   PRIVATE_KEY=0xYourPrivateKeyHere

   # Network RPC URLs
   CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
   CELO_MAINNET_RPC=https://forno.celo.org

   # Calculated scope (from calculateScope.ts)
   HASHED_SCOPE=<will be calculated>

   # Optional: Block explorer API key for verification
   CELOSCAN_API_KEY=YourCeloscanApiKey
   ```

3. **Fund Your Deployer:**
   - **Testnet:** Get free CELO from [Celo Alfajores Faucet](https://faucet.celo.org)
   - **Mainnet:** Ensure you have at least 1 CELO

---

## 🚀 Deployment Workflow

### Step 1: Calculate Scope Hash

The scope hash must be calculated **immediately before deployment** based on your deployer's current nonce.

```bash
# Run the TypeScript calculation script
npm run calculate-scope
```

**Output:**
```
=== YieldMaker Scope Calculation ===
Deployer address: 0x1234...
Current nonce: 5
Predicted contract address: 0x5678...

=== Results ===
App name: YieldMaker
Hashed scope: 12345678901234567890...

Add this to your .env file:
HASHED_SCOPE=12345678901234567890...

⚠️  Important: Deploy immediately after running this script
    If you make any transactions, the nonce will change!
```

**⚠️ CRITICAL:** Copy the `HASHED_SCOPE` value to your `.env` file immediately!

---

### Step 2: Choose Deployment Script

We provide three deployment scripts:

| Script | Use Case | Network |
|--------|----------|---------|
| `DeploySelfVerificationRegistryFixed.s.sol` | Testnet-only, hardcoded values | Alfajores (44787) |
| `DeploySelfVerificationRegistry.s.sol` | Auto-detects network | Any Celo network |
| `DeploySelfVerificationRegistryMainnet.s.sol` | Mainnet-only, strict checks | Mainnet (42220) |

---

### Step 3: Deploy to Testnet

**Recommended for first-time deployment:**

```bash
cd contracts

# Using the testnet-specific script
forge script script/DeploySelfVerificationRegistryFixed.s.sol \
  --rpc-url $CELO_SEPOLIA_RPC \
  --broadcast \
  --verify \
  -vvvv

# OR using the auto-detect script
forge script script/DeploySelfVerificationRegistry.s.sol \
  --rpc-url $CELO_SEPOLIA_RPC \
  --broadcast \
  -vvvv
```

**Expected Output:**
```
=== DEPLOYING TO CELO SEPOLIA TESTNET ===
Chain ID: 44787
Deployer: 0x1234...
Balance: 10.5 CELO
Self Hub: 0x68c931C9a534D37aa78094877F46fE46a49F1A51
Scope (HASHED_SCOPE): 12345678901234567890...
Verification Config ID:
0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61

=== DEPLOYMENT SUCCESSFUL ===
SelfVerificationRegistry: 0xABCD...
Owner: 0x1234...
Contract size: 4567 bytes

Verify on explorer:
https://celo-alfajores.celoscan.io/address/0xABCD...

=== NEXT STEPS ===
1. Verify contract on block explorer (if --verify flag was used)
2. Set registry in YieldmakerVault:
   vault.setVerificationRegistry(0xABCD...)
3. Mark strategies requiring verification:
   vault.setStrategyVerificationRequirement(<strategy_address>, true)
```

---

### Step 4: Deploy to Mainnet

**⚠️ WARNING: This will deploy to production with real funds!**

```bash
cd contracts

# Using the mainnet-specific script (RECOMMENDED)
forge script script/DeploySelfVerificationRegistryMainnet.s.sol \
  --rpc-url $CELO_MAINNET_RPC \
  --broadcast \
  --verify \
  -vvvv

# OR using the auto-detect script
forge script script/DeploySelfVerificationRegistry.s.sol \
  --rpc-url $CELO_MAINNET_RPC \
  --broadcast \
  --verify \
  -vvvv
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════╗
║         DEPLOYING TO CELO MAINNET                      ║
║         !!! THIS WILL COST REAL FUNDS !!!              ║
╚════════════════════════════════════════════════════════╝

Network: Celo Mainnet
Chain ID: 42220
Deployer: 0x1234...
Balance: 5.0 CELO
Self Hub: 0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF
...

!!! FINAL WARNING !!!
- Ensure HASHED_SCOPE is calculated correctly
- Ensure you have NOT made any transactions since calculating scope
- This deployment will be PERMANENT and IMMUTABLE

╔════════════════════════════════════════════════════════╗
║         DEPLOYMENT SUCCESSFUL                          ║
╚════════════════════════════════════════════════════════╝

SelfVerificationRegistry: 0xDEF0...
...
```

---

## 🔧 Post-Deployment Configuration

### 1. Verify Contract on Block Explorer

If you didn't use `--verify` flag during deployment:

```bash
forge verify-contract \
  --chain-id 44787 \
  --compiler-version v0.8.20 \
  --constructor-args $(cast abi-encode "constructor(address,uint256,bytes32)" <hub_address> <scope> <config_id>) \
  <deployed_contract_address> \
  src/SelfVerificationRegistry.sol:SelfVerificationRegistry
```

### 2. Connect Registry to YieldmakerVault

Using Foundry's cast tool:

```bash
# Set verification registry
cast send <VAULT_ADDRESS> \
  "setVerificationRegistry(address)" <REGISTRY_ADDRESS> \
  --rpc-url $CELO_ALFAJORES_RPC \
  --private-key $PRIVATE_KEY

# Verify it was set
cast call <VAULT_ADDRESS> \
  "verificationRegistry()(address)" \
  --rpc-url $CELO_ALFAJORES_RPC
```

### 3. Mark Strategies Requiring Verification

```bash
# Enable verification requirement for a specific strategy
cast send <VAULT_ADDRESS> \
  "setStrategyVerificationRequirement(address,bool)" \
  <STRATEGY_ADDRESS> \
  true \
  --rpc-url $CELO_ALFAJORES_RPC \
  --private-key $PRIVATE_KEY

# Example: Require verification for Uniswap V3 strategy
cast send <VAULT_ADDRESS> \
  "setStrategyVerificationRequirement(address,bool)" \
  0xUniswapV3StrategyAddress \
  true \
  --rpc-url $CELO_ALFAJORES_RPC \
  --private-key $PRIVATE_KEY
```

### 4. Test Verification Flow

```bash
# Check if an address is verified
cast call <REGISTRY_ADDRESS> \
  "isCreatorVerified(address)(bool)" \
  0xUserAddressToCheck \
  --rpc-url $CELO_ALFAJORES_RPC

# Get detailed verification info
cast call <REGISTRY_ADDRESS> \
  "getVerificationInfo(address)(bool,uint256,uint256,string)" \
  0xUserAddressToCheck \
  --rpc-url $CELO_ALFAJORES_RPC
```

---

## 📊 Network Configuration Reference

### Celo Alfajores Testnet

| Parameter | Value |
|-----------|-------|
| Chain ID | 44787 |
| RPC URL | https://forno.celo-alfajores.celo-testnet.org |
| Self Hub Address | `0x68c931C9a534D37aa78094877F46fE46a49F1A51` |
| Verification Config ID | `0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61` |
| Block Explorer | https://celo-alfajores.celoscan.io |
| Faucet | https://faucet.celo.org |
| Min Balance | 0.1 CELO |

### Celo Mainnet

| Parameter | Value |
|-----------|-------|
| Chain ID | 42220 |
| Self Hub Address | `0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF` |
| Verification Config ID | `0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61` |
| Block Explorer | https://celoscan.io |
| Min Balance | 1 CELO |

---

## 🐛 Troubleshooting

### Issue: "Scope hash mismatch" error during verification

**Cause:** Your nonce changed between calculating scope and deploying.

**Solution:**
1. Re-run `npm run calculate-scope`
2. Update `HASHED_SCOPE` in `.env`
3. Deploy immediately (don't make any other transactions)

---

### Issue: "Deployer balance too low"

**Cause:** Insufficient CELO for gas fees.

**Solution:**
- **Testnet:** Get free CELO from https://faucet.celo.org
- **Mainnet:** Transfer at least 1 CELO to your deployer address

---

### Issue: "Must deploy to Celo Alfajores (44787)"

**Cause:** Using testnet script on wrong network.

**Solution:**
- Check your RPC URL matches the network
- Use `DeploySelfVerificationRegistry.s.sol` for auto-detection
- Verify with: `cast chain-id --rpc-url $YOUR_RPC_URL`

---

### Issue: Contract verification fails on block explorer

**Cause:** Various reasons (compiler version, optimizer settings, etc.)

**Solution:**
```bash
# Verify manually with exact settings
forge verify-contract \
  --chain-id 44787 \
  --compiler-version v0.8.20 \
  --num-of-optimizations 200 \
  --watch \
  <CONTRACT_ADDRESS> \
  src/SelfVerificationRegistry.sol:SelfVerificationRegistry
```

---

## 🔐 Security Checklist

Before mainnet deployment:

- [ ] **HASHED_SCOPE** calculated correctly
- [ ] No transactions made after calculating scope
- [ ] Deployer has sufficient balance (≥1 CELO)
- [ ] `.env` file secured (not committed to git)
- [ ] Private key backed up securely
- [ ] Contract code audited (if handling significant value)
- [ ] Testnet deployment successful
- [ ] Verification flow tested on testnet
- [ ] Owner address confirmed

---

## 📚 Additional Resources

- [Self Protocol Documentation](https://docs.self.xyz)
- [Celo Documentation](https://docs.celo.org)
- [Foundry Book](https://book.getfoundry.sh)
- [YieldMaker Scripts README](../../scripts/README.md)

---

## 📝 Example Complete Workflow

```bash
# 1. Install dependencies
cd /Users/musaga/YieldMaker
npm install

# 2. Calculate scope
npm run calculate-scope
# Copy HASHED_SCOPE to .env

# 3. Deploy to testnet
cd contracts
forge script script/DeploySelfVerificationRegistryFixed.s.sol \
  --rpc-url $CELO_SEPOLIA_RPC \
  --broadcast \
  --verify \
  -vvvv

# 4. Save deployed address
export REGISTRY_ADDRESS=0xDeployedAddressHere

# 5. Connect to vault
cast send $VAULT_ADDRESS \
  "setVerificationRegistry(address)" $REGISTRY_ADDRESS \
  --rpc-url $CELO_SEPOLIA_RPC \
  --private-key $PRIVATE_KEY

# 6. Test verification
cast call $REGISTRY_ADDRESS \
  "isCreatorVerified(address)(bool)" $TEST_USER_ADDRESS \
  --rpc-url $CELO_SEPOLIA_RPC

# 7. Deploy to mainnet (when ready)
forge script script/DeploySelfVerificationRegistryMainnet.s.sol \
  --rpc-url $CELO_MAINNET_RPC \
  --broadcast \
  --verify \
  -vvvv
```

---

**Need Help?** Check the [troubleshooting section](#-troubleshooting) or open an issue.
