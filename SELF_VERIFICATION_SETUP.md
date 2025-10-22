# Self Protocol Verification Setup for YieldMaker

This guide explains how to set up Self Protocol verification in the YieldMaker project, based on the working implementation from theonepercent.

## Overview

The Self Protocol integration allows users to verify their identity using zero-knowledge proofs, enabling access to premium features and bonus rewards in the YieldMaker platform.

## Components

### 1. Smart Contract (`SelfVerificationRegistry.sol`)

The contract inherits from `SelfVerificationRoot` and handles:
- User verification status tracking
- Nullifier management (prevents replay attacks)
- Integration with Self Protocol Hub V2

### 2. Frontend Integration

- **Verification Page**: `/verify-self` - QR code scanning interface
- **Hooks**: `use-verification.ts` - Contract interaction hooks
- **Toast System**: User feedback for verification status

### 3. Backend API

- **Verification Endpoint**: `/api/self/verify` - Server-side proof validation
- **Contract Integration**: Direct blockchain interaction

## Setup Instructions

### Step 1: Deploy Smart Contract

1. **Set Environment Variables**:
```bash
export PRIVATE_KEY="your_private_key"
export SELF_HUB_V2="0x68c931C9a534D37aa78094877F46fE46a49F1A51"  # Alfajores
export SELF_SCOPE="1234567890"  # Precomputed scope hash
export SELF_CONFIG_ID="0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61"
```

2. **Deploy Contract**:
```bash
cd contracts
forge script script/DeploySelfVerificationRegistry.s.sol --rpc-url $ALFAJORES_RPC_URL --broadcast --verify
```

3. **Update Frontend Configuration**:
```typescript
// In frontend/src/lib/contract.ts
addresses: {
  44787: "0xYOUR_DEPLOYED_ADDRESS", // Alfajores
  42220: "0xYOUR_MAINNET_ADDRESS",  // Mainnet
}
```

### Step 2: Configure Frontend Environment

Create `.env.local`:
```env
# Contract Addresses
NEXT_PUBLIC_SELF_VERIFICATION_CONTRACT_ADDRESS_44787=0xYOUR_ALFAJORES_ADDRESS
NEXT_PUBLIC_SELF_VERIFICATION_CONTRACT_ADDRESS_42220=0xYOUR_MAINNET_ADDRESS

# Self Protocol Configuration
NEXT_PUBLIC_SELF_HUB_ADDRESS_44787=0x68c931C9a534D37aa78094877F46fE46a49F1A51
NEXT_PUBLIC_SELF_HUB_ADDRESS_42220=0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF
NEXT_PUBLIC_SELF_VERIFICATION_CONFIG_ID=0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61
NEXT_PUBLIC_SELF_SCOPE=YieldMaker

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Step 3: Install Dependencies

```bash
cd frontend
npm install @selfxyz/qrcode @selfxyz/core
```

### Step 4: Test the Integration

1. **Start Development Server**:
```bash
npm run dev
```

2. **Navigate to Verification Page**:
- Go to `/verify-self`
- Connect your wallet
- Scan QR code with Self mobile app
- Complete verification process

## Key Differences from theonepercent

### Fixed Issues:

1. **Proper Self App Configuration**:
   - Correct endpoint (contract address, not API URL)
   - Proper scope and userDefinedData
   - Environment-based contract addresses

2. **Enhanced Error Handling**:
   - Toast notifications for user feedback
   - Proper error states and loading indicators
   - Fallback mechanisms

3. **Improved UX**:
   - Better visual feedback during verification
   - Proper navigation flow
   - Status indicators

4. **Contract Integration**:
   - Direct blockchain interaction
   - Proper proof submission
   - Real-time status updates

## Verification Flow

1. **User visits `/verify-self`**
2. **Connects wallet** (MetaMask, etc.)
3. **Scans QR code** with Self mobile app
4. **Completes identity verification** in Self app
5. **Proof submitted to contract** automatically
6. **User receives verification status** and access to premium features

## Troubleshooting

### Common Issues:

1. **"Contract not available" error**:
   - Check contract address in environment variables
   - Ensure contract is deployed and verified

2. **QR code not generating**:
   - Verify Self Protocol dependencies are installed
   - Check console for initialization errors

3. **Verification not completing**:
   - Check Self Protocol Hub configuration
   - Verify scope and config ID values

### Debug Steps:

1. **Check browser console** for errors
2. **Verify contract deployment** on block explorer
3. **Test with different networks** (Alfajores vs Mainnet)
4. **Check Self Protocol documentation** for latest requirements

## Production Deployment

### Environment Variables:
```env
# Production values
NEXT_PUBLIC_SELF_VERIFICATION_CONTRACT_ADDRESS_42220=0xYOUR_MAINNET_ADDRESS
NEXT_PUBLIC_SELF_HUB_ADDRESS_42220=0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF
```

### Security Considerations:
- Use environment variables for sensitive data
- Deploy to mainnet with proper verification
- Test thoroughly on testnet first
- Monitor contract interactions

## Integration with YieldMaker Features

Once verification is complete, users can:
- Access premium DeFi strategies
- Get bonus rewards for verified status
- Participate in exclusive pools
- Access advanced portfolio management features

The verification status is checked throughout the application using the `useIsVerified` hook.


   cd contracts
   forge script script/DeploySelfVerificationRegistry.s.sol --rpc-url $ALFAJORES_RPC_URL --broadcast --verify

      NEXT_PUBLIC_SELF_VERIFICATION_CONTRACT_ADDRESS_44787=0xYOUR_DEPLOYED_ADDRESS
   NEXT_PUBLIC_SELF_VERIFICATION_CONTRACT_ADDRESS_42220=0xYOUR_MAINNET_ADDRESS
   