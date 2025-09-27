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

// FIXED: Hook for depositing into vault
export function useVaultDeposit() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const deposit = async (amount: string, receiver: string) => {
    try {
      const assets = parseEther(amount);
      // Return the promise so it can be awaited
      return writeContract({
        address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT as `0x${string}`,
        abi: YieldmakerVaultABI,
        functionName: "deposit",
        args: [assets, receiver as `0x${string}`],
      });
    } catch (err) {
      console.error("Error in deposit function:", err);
      throw err;
    }
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

// FIXED: Hook for withdrawing from vault
export function useVaultWithdraw() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const withdraw = async (amount: string, receiver: string, owner: string) => {
    try {
      console.log("Calling vault withdraw with:", {
        amount,
        receiver,
        owner,
        amountWei: parseEther(amount).toString()
      });

      const assets = parseEther(amount);
      
      return writeContract({
        address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT as `0x${string}`,
        abi: YieldmakerVaultABI,
        functionName: "withdraw",
        args: [assets, receiver as `0x${string}`, owner as `0x${string}`],
      });
    } catch (err) {
      console.error("Error in withdraw function:", err);
      throw err;
    }
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

  const setStrategy = async (strategyAddress: string) => {
    try {
      return writeContract({
        address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT as `0x${string}`,
        abi: YieldmakerVaultABI,
        functionName: "setStrategy",
        args: [strategyAddress as `0x${string}`],
      });
    } catch (err) {
      console.error("Error in setStrategy function:", err);
      throw err;
    }
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

  const emergencyWithdraw = async () => {
    try {
      return writeContract({
        address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT as `0x${string}`,
        abi: YieldmakerVaultABI,
        functionName: "emergencyWithdraw",
      });
    } catch (err) {
      console.error("Error in emergencyWithdraw function:", err);
      throw err;
    }
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

// Hook for checking vault balance
export function useVaultBalance() {
  const { address } = useAccount();
  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT as `0x${string}`,
    abi: YieldmakerVaultABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });
  
  return { 
    balance: balance || BigInt(0), 
    isLoading, 
    error,
    refetch
  };
}

// Hook for sending vault tokens
export function useVaultSend() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const send = async (to: string, amount: string) => {
    try {
      const shares = parseEther(amount);
      
      return writeContract({
        address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT as `0x${string}`,
        abi: YieldmakerVaultABI,
        functionName: "transfer",
        args: [to as `0x${string}`, shares],
      });
    } catch (err) {
      console.error("Error in send function:", err);
      throw err;
    }
  };

  return { 
    send, 
    hash, 
    isPending, 
    isConfirming, 
    isConfirmed, 
    error 
  };
}

// Additional hook to check if vault is paused
export function useVaultStatus() {
  const { data: paused, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELDMAKER_VAULT as `0x${string}`,
    abi: YieldmakerVaultABI,
    functionName: "paused",
  });

  return {
    paused: paused || false,
    refetch
  };
}