import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";

// TODO: Import the actual ABI once the strategy is deployed
const AAVE_STRATEGY_ABI = [
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "invest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAssets",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Hook to get total assets in the strategy
export function useAaveStrategyBalance() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`, // TODO: Add actual address
    abi: AAVE_STRATEGY_ABI,
    functionName: "totalAssets",
  });

  return {
    balance: data || BigInt(0),
    formatted: data ? formatEther(data) : "0",
    isLoading,
    isError,
    refetch,
  };
}

// Hook to invest in Aave strategy
export function useAaveStrategyInvest() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const invest = (amount: string) => {
    const amountWei = parseEther(amount);
    writeContract({
      address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`, // TODO: Add actual address
      abi: AAVE_STRATEGY_ABI,
      functionName: "invest",
      args: [amountWei],
    });
  };

  return {
    invest,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook to withdraw from Aave strategy
export function useAaveStrategyWithdraw() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const withdraw = (amount: string) => {
    const amountWei = parseEther(amount);
    writeContract({
      address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`, // TODO: Add actual address
      abi: AAVE_STRATEGY_ABI,
      functionName: "withdraw",
      args: [amountWei],
    });
  };

  return {
    withdraw,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook for emergency withdraw
export function useAaveStrategyEmergencyWithdraw() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const emergencyWithdraw = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.AAVE_STRATEGY as `0x${string}`, // TODO: Add actual address
      abi: AAVE_STRATEGY_ABI,
      functionName: "emergencyWithdraw",
      args: [],
    });
  };

  return {
    emergencyWithdraw,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
