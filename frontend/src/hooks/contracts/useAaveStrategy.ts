import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";

// Actual ABI from deployed AaveStrategy contract
const AAVE_STRATEGY_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_aavePool", type: "address", internalType: "address" },
      { name: "_asset", type: "address", internalType: "address" },
      { name: "_vault", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "aToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IAToken" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "aavePool",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IPool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "asset",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "emergencyWithdraw",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "invest",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setVault",
    inputs: [{ name: "_vault", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalAssets",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "vault",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

// Hook to get total assets in the strategy
export function useAaveStrategyBalance() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`,
    abi: AAVE_STRATEGY_ABI,
    functionName: "totalAssets",
  });

  return {
    balance: data || BigInt(0),
    balanceFormatted: data ? parseFloat(formatEther(data)) : 0,
    isError,
    isLoading,
    refetch,
  };
}

// Hook to get strategy info
export function useAaveStrategyInfo() {
  const { data: asset } = useReadContract({
    address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`,
    abi: AAVE_STRATEGY_ABI,
    functionName: "asset",
  });

  const { data: vault } = useReadContract({
    address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`,
    abi: AAVE_STRATEGY_ABI,
    functionName: "vault",
  });

  const { data: aToken } = useReadContract({
    address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`,
    abi: AAVE_STRATEGY_ABI,
    functionName: "aToken",
  });

  const { data: aavePool } = useReadContract({
    address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`,
    abi: AAVE_STRATEGY_ABI,
    functionName: "aavePool",
  });

  return {
    asset,
    vault,
    aToken,
    aavePool,
  };
}

// Hook for strategy operations (invest/withdraw) - only callable by vault
export function useAaveStrategyOperations() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const invest = (amount: string) => {
    console.log("Investing in Aave strategy:", {
      amount,
      amountWei: parseEther(amount).toString(),
      strategy: CONTRACT_ADDRESSES.AAVE_STRATEGY,
    });

    writeContract({
      address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`,
      abi: AAVE_STRATEGY_ABI,
      functionName: "invest",
      args: [parseEther(amount)],
    });
  };

  const withdraw = (amount: string) => {
    console.log("Withdrawing from Aave strategy:", {
      amount,
      amountWei: parseEther(amount).toString(),
      strategy: CONTRACT_ADDRESSES.AAVE_STRATEGY,
    });

    writeContract({
      address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`,
      abi: AAVE_STRATEGY_ABI,
      functionName: "withdraw",
      args: [parseEther(amount)],
    });
  };

  const emergencyWithdraw = () => {
    console.log("Emergency withdrawing from Aave strategy");

    writeContract({
      address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`,
      abi: AAVE_STRATEGY_ABI,
      functionName: "emergencyWithdraw",
    });
  };

  return {
    invest,
    withdraw,
    emergencyWithdraw,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook to use the Aave strategy with a specific address (for testing)
export function useAaveStrategy(strategyAddress: `0x${string}`) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const { data: totalAssets, refetch: refetchTotalAssets } = useReadContract({
    address: strategyAddress,
    abi: AAVE_STRATEGY_ABI,
    functionName: "totalAssets",
  });

  const invest = (amount: string) => {
    writeContract({
      address: strategyAddress,
      abi: AAVE_STRATEGY_ABI,
      functionName: "invest",
      args: [parseEther(amount)],
    });
  };

  const withdraw = (amount: string) => {
    writeContract({
      address: strategyAddress,
      abi: AAVE_STRATEGY_ABI,
      functionName: "withdraw",
      args: [parseEther(amount)],
    });
  };

  return {
    invest,
    withdraw,
    totalAssets: totalAssets ? parseFloat(formatEther(totalAssets)) : 0,
    refetchTotalAssets,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
