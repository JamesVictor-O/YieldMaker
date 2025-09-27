// Contract addresses for Celo Alfajores
export const CONTRACT_ADDRESSES = {
  // Deployed contracts - V2 (Working Version)
  YIELDMAKER_VAULT: "0xd1DE9b72508BCDF6914575a9E99D31a99413AC1F", // ✅ NEW - Working vault
  SIMPLE_HOLD_STRATEGY: "0x50389e8ca7eA09AA04962667f4C4B8563AdaDefF", // ✅ NEW - Working strategy

  // Old contracts (deprecated)
  // OLD_VAULT: "0x67736df04f47c06274f4bc73ecb7b5ae7cb06e91", // ❌ OLD - Broken vault
  // NULL_STRATEGY: "0xcbb6fec30216dbe4983b8e932edf340f8b5862cc", // ❌ OLD - Broken strategy

  // Asset addresses
  CUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", // cUSD on Alfajores

  // Protocol addresses
  // NOTE: Aave V3 is already live on Celo L2! Need to find actual contract addresses
  AAVE_POOL: "0x0000000000000000000000000000000000000000", // TODO: Get Aave V3 Pool address on Celo L2
  AAVE_POOL_ADDRESS_PROVIDER: "0x0000000000000000000000000000000000000000", // TODO: Get Aave V3 PoolAddressProvider on Celo L2
  AAVE_STRATEGY: "0x0000000000000000000000000000000000000000", // TODO: Deploy AaveStrategy contract
  COMPOUND_COMPTROLLER: "0x0000000000000000000000000000000000000000", // Set when deploying
  YEARN_VAULT: "0x0000000000000000000000000000000000000000", // Set when deploying
  UNISWAP_V3_POOL: "0x0000000000000000000000000000000000000000", // Set when deploying
} as const;

export type ContractAddresses = typeof CONTRACT_ADDRESSES;
