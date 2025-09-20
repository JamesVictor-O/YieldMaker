// Contract addresses for Celo Alfajores
export const CONTRACT_ADDRESSES = {
  // Deployed contracts
  YIELDMAKER_VAULT: "0x67736df04f47c06274f4bc73ecb7b5ae7cb06e91",
  NULL_STRATEGY: "0xcbb6fec30216dbe4983b8e932edf340f8b5862cc",
  
  // Asset addresses
  CUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", // cUSD on Alfajores
  
  // Protocol addresses (to be set when deploying strategies)
  AAVE_POOL: "0x0000000000000000000000000000000000000000", // Set when deploying
  COMPOUND_COMPTROLLER: "0x0000000000000000000000000000000000000000", // Set when deploying
  YEARN_VAULT: "0x0000000000000000000000000000000000000000", // Set when deploying
  UNISWAP_V3_POOL: "0x0000000000000000000000000000000000000000", // Set when deploying
} as const;

export type ContractAddresses = typeof CONTRACT_ADDRESSES;
