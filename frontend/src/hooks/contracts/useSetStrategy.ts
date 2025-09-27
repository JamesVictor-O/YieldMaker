import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";
import YieldmakerVaultABI from "@/contracts/abis/YieldmakerVault.json";

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
