import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";

// ABI for our MockAavePool contract
const MOCK_AAVE_POOL_ABI = [
  {
    type: "function",
    name: "getCurrentAPY",
    inputs: [{ name: "asset", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserBalance",
    inputs: [
      { name: "asset", type: "address", internalType: "address" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getReserveData",
    inputs: [{ name: "asset", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct DataTypes.ReserveData",
        components: [
          {
            name: "configuration",
            type: "tuple",
            internalType: "struct DataTypes.ReserveConfigurationMap",
            components: [
              { name: "data", type: "uint256", internalType: "uint256" },
            ],
          },
          { name: "liquidityIndex", type: "uint128", internalType: "uint128" },
          {
            name: "currentLiquidityRate",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "variableBorrowIndex",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "currentVariableBorrowRate",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "currentStableBorrowRate",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "lastUpdateTimestamp",
            type: "uint40",
            internalType: "uint40",
          },
          { name: "id", type: "uint16", internalType: "uint16" },
          { name: "aTokenAddress", type: "address", internalType: "address" },
          {
            name: "stableDebtTokenAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "variableDebtTokenAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "interestRateStrategyAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "accruedToTreasury",
            type: "uint128",
            internalType: "uint128",
          },
          { name: "unbacked", type: "uint128", internalType: "uint128" },
          {
            name: "isolationModeTotalDebt",
            type: "uint128",
            internalType: "uint128",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
] as const;

// Hook to get current APY from MockAavePool
export function useMockAavePoolAPY() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.AAVE_POOL as `0x${string}`,
    abi: MOCK_AAVE_POOL_ABI,
    functionName: "getCurrentAPY",
    args: [CONTRACT_ADDRESSES.CUSD as `0x${string}`],
  });

  return {
    apy: data || BigInt(0),
    apyFormatted: data ? Number(data) / 100 : 0, // Convert basis points to percentage
    apyDisplay: data ? `${(Number(data) / 100).toFixed(1)}%` : "0.0%",
    isError,
    isLoading,
    refetch,
  };
}

// Hook to get user balance in the pool
export function useMockAavePoolUserBalance(userAddress: string) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.AAVE_POOL as `0x${string}`,
    abi: MOCK_AAVE_POOL_ABI,
    functionName: "getUserBalance",
    args: [
      CONTRACT_ADDRESSES.CUSD as `0x${string}`,
      userAddress as `0x${string}`,
    ],
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    balance: data || BigInt(0),
    balanceFormatted: data ? Number(data) / 1e18 : 0,
    isError,
    isLoading,
    refetch,
  };
}

// Hook to get reserve data
export function useMockAavePoolReserveData() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.AAVE_POOL as `0x${string}`,
    abi: MOCK_AAVE_POOL_ABI,
    functionName: "getReserveData",
    args: [CONTRACT_ADDRESSES.CUSD as `0x${string}`],
  });

  return {
    reserveData: data,
    aTokenAddress: data?.aTokenAddress,
    liquidityIndex: data?.liquidityIndex,
    currentLiquidityRate: data?.currentLiquidityRate,
    lastUpdateTimestamp: data?.lastUpdateTimestamp,
    isError,
    isLoading,
    refetch,
  };
}
