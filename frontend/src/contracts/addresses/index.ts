// Contract addresses for Celo Mainnet
// NOTE: Update these after mainnet deployment. Placeholders are set where needed.
export const CONTRACT_ADDRESSES = {
  // Deployed contracts - Celo Mainnet (set after deployment)
  YIELDMAKER_VAULT: "0x2dd953527574B89003bC83Ef32673cCF88027A65",
  SIMPLE_HOLD_STRATEGY: "0x2F38698b28bB939C671e021cf7BAab6BD023C0Ee",



  // Asset addresses (Celo Mainnet)
  CUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a", // ✅ cUSD on Celo Mainnet

  // Protocol addresses - set when integrating on mainnet
  AAVE_POOL: "0x0000000000000000000000000000000000000000", // TODO
  AAVE_STRATEGY: "0x0000000000000000000000000000000000000000", // TODO

  // Self Protocol Verification - Celo Mainnet (set after deploy)
  SELF_VERIFICATION_REGISTRY: "0xFCcbf5FA91a8388a27AB5cFc4D80d0f7785D74AE",
 
  AAVE_POOL_ADDRESS_PROVIDER: "0x0000000000000000000000000000000000000000", // TODO: Get Aave V3 PoolAddressProvider on Celo L2
 
  COMPOUND_COMPTROLLER: "0x0000000000000000000000000000000000000000", // Set when deploying
  YEARN_VAULT: "0x0000000000000000000000000000000000000000", // Set when deploying
  UNISWAP_V3_POOL: "0x0000000000000000000000000000000000000000", // Set when deploying
} as const;

export type ContractAddresses = typeof CONTRACT_ADDRESSES;
