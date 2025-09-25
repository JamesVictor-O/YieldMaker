import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";
import YieldmakerVaultABI from "@/contracts/abis/YieldmakerVault.json";
import type { VaultInfo } from "@/contracts/types";

// Hook for reading vault information
export function useVaultInfo() {
  const { data: totalAssets } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT,
    abi: YieldmakerVaultABI,
    functionName: "totalAssets",
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT,
    abi: YieldmakerVaultABI,
    functionName: "totalSupply",
  });

  const { data: asset } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT,
    abi: YieldmakerVaultABI,
    functionName: "asset",
  });

  const { data: strategy } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT,
    abi: YieldmakerVaultABI,
    functionName: "strategy",
  });

  const { data: paused } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT,
    abi: YieldmakerVaultABI,
    functionName: "paused",
  });

  return {
    totalAssets: totalAssets || BigInt(0),
    totalSupply: totalSupply || BigInt(0),
    asset: asset || "0x0",
    strategy: strategy || "0x0",
    paused: paused || false,
  } as VaultInfo;
}

// Hook for depositing into vault
export function useVaultDeposit() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const deposit = (amount: string, receiver: string) => {
    const assets = parseEther(amount);
    writeContract({
      address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT,
      abi: YieldmakerVaultABI,
      functionName: "deposit",
      args: [assets, receiver],
    });
  };

  return {
    deposit,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook for withdrawing from vault
export function useVaultWithdraw() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const withdraw = (amount: string, receiver: string, owner: string) => {
    const assets = parseEther(amount);
    writeContract({
      address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT,
      abi: YieldmakerVaultABI,
      functionName: "withdraw",
      args: [assets, receiver, owner],
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

// Hook for setting strategy
export function useSetStrategy() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const setStrategy = (strategyAddress: string) => {
    writeContract({
      address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT,
      abi: YieldmakerVaultABI,
      functionName: "setStrategy",
      args: [strategyAddress],
    });
  };

  return {
    setStrategy,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook for emergency withdraw
export function useEmergencyWithdraw() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const emergencyWithdraw = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT,
      abi: YieldmakerVaultABI,
      functionName: "emergencyWithdraw",
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

export function useVaultBalance() {
  const { address } = useAccount();
  const {
    data: balance,
    isLoading,
    error,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT,
    abi: YieldmakerVaultABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  return { balance: balance || BigInt(0), isLoading, error };
}

export function useVaultSend() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const send = (to: string, amount: string) => {
    const shares = parseEther(amount);
    writeContract({
      address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT,
      abi: YieldmakerVaultABI,
      functionName: "transfer",
      args: [to, shares],
    });
  };

  return { send, hash, isPending, isConfirming, isConfirmed, error };
}
