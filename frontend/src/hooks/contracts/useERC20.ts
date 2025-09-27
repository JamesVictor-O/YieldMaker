import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther, erc20Abi } from "viem";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";

// Use the standard ERC20 ABI from viem
const ERC20_ABI = erc20Abi;

// Hook for reading ERC20 token information
export function useERC20Info(tokenAddress: string) {
  const { data: balance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [CONTRACT_ADDRESSES.YIELDMAKER_VAULT],
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "symbol",
  });

  return {
    balance: balance || BigInt(0),
    decimals: decimals || 18,
    symbol: symbol || "TOKEN",
  };
}

// Hook for user's token balance
export function useUserTokenBalance(
  tokenAddress: string,
  userAddress?: string
) {
  const { data: balance, refetch } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: { enabled: !!userAddress },
  });

  return {
    balance: balance || BigInt(0),
    formatted: balance ? formatEther(balance) : "0",
    refetch,
  };
}

// Hook for token approval
export function useTokenApproval(tokenAddress: string) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  console.log("useTokenApproval hook state:", {
    tokenAddress,
    hash: hash?.toString(),
    isPending,
    isConfirming,
    isConfirmed,
    error: error?.message,
  });

  const approve = (spender: string, amount: string) => {
    if (!amount || amount === "0") {
      console.error("Invalid amount for approval:", amount);
      return;
    }

    const amountWei = parseEther(amount);
    console.log("useTokenApproval - approve called:", {
      tokenAddress,
      spender,
      amount,
      amountWei: amountWei.toString(),
    });

    try {
      console.log("About to call writeContract with:", {
        address: tokenAddress,
        functionName: "approve",
        args: [spender, amountWei.toString()],
        abi: "erc20Abi",
      });

      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [spender as `0x${string}`, amountWei],
      });
      console.log("writeContract called successfully");
    } catch (error) {
      console.error("Error calling writeContract:", error);
    }
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook for checking allowance
export function useTokenAllowance(
  tokenAddress: string,
  owner: string,
  spender: string
) {
  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [owner as `0x${string}`, spender as `0x${string}`],
  });

  return {
    allowance: allowance || BigInt(0),
    formatted: allowance ? formatEther(allowance) : "0",
    refetch,
  };
}
