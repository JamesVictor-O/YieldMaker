// Contract addresses for Celo Alfajores
export const CONTRACT_ADDRESSES = {
  // Deployed contracts - V2 (Working Version)
  YIELDMAKER_VAULT: "0xd1DE9b72508BCDF6914575a9E99D31a99413AC1F", // ✅ NEW - Working vault
  SIMPLE_HOLD_STRATEGY: "0x50389e8ca7eA09AA04962667f4C4B8563AdaDefF", // ✅ NEW - Working strategy



  // Asset addresses
  CUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", // cUSD on Alfajores

  // Protocol addresses
  // NOTE: Aave V3 is already live on Celo L2! Need to find actual contract addresses
  AAVE_POOL: "0x0B51348AB44895539A22832A1E49eD11C648bE35",
  AAVE_STRATEGY: "0x217129a6a9CA7CD2A0dbB42e4c9B93b7b2809f09",
 
  AAVE_POOL_ADDRESS_PROVIDER: "0x0000000000000000000000000000000000000000", // TODO: Get Aave V3 PoolAddressProvider on Celo L2
 
  COMPOUND_COMPTROLLER: "0x0000000000000000000000000000000000000000", // Set when deploying
  YEARN_VAULT: "0x0000000000000000000000000000000000000000", // Set when deploying
  UNISWAP_V3_POOL: "0x0000000000000000000000000000000000000000", // Set when deploying
} as const;

export type ContractAddresses = typeof CONTRACT_ADDRESSES;
