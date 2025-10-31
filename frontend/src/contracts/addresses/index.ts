// Contract addresses for Celo Alfajores Testnet
// NOTE: These addresses need to be updated after deployment to Alfajores
// Run deployment scripts from /contracts/script to deploy and get new addresses
export const CONTRACT_ADDRESSES = {
  // Deployed contracts - Deployed to Celo Alfajores
  YIELDMAKER_VAULT: "0x2f00C10f7e0B6772a0d01d0F742590753eDBE08B", // ✅ YieldmakerVault on Celo Alfajores
  SIMPLE_HOLD_STRATEGY: "0xb446fD8B6ADc9BF71C3f531218F625EF1c86F87A", // ✅ SimpleHoldStrategy on Celo Alfajores



  // Asset addresses
  CUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", // ✅ cUSD on Celo Alfajores

  // Protocol addresses - TODO: Find Alfajores protocol addresses
  // NOTE: Aave V3 may not be deployed on Alfajores yet
  AAVE_POOL: "0x0000000000000000000000000000000000000000", // ⚠️ TODO: Get Aave V3 on Alfajores
  AAVE_STRATEGY: "0x0000000000000000000000000000000000000000", // ⚠️ TODO: Deploy AaveStrategy to Alfajores

  // Self Protocol Verification - Deployed to Celo Alfajores
  SELF_VERIFICATION_REGISTRY: "0xb446fD8B6ADc9BF71C3f531218F625EF1c86F87A", // ✅ SelfVerificationRegistry on Celo Alfajores
 
  AAVE_POOL_ADDRESS_PROVIDER: "0x0000000000000000000000000000000000000000", // TODO: Get Aave V3 PoolAddressProvider on Celo L2
 
  COMPOUND_COMPTROLLER: "0x0000000000000000000000000000000000000000", // Set when deploying
  YEARN_VAULT: "0x0000000000000000000000000000000000000000", // Set when deploying
  UNISWAP_V3_POOL: "0x0000000000000000000000000000000000000000", // Set when deploying
} as const;

export type ContractAddresses = typeof CONTRACT_ADDRESSES;
