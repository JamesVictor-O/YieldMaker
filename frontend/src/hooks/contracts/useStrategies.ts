import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";
import AaveStrategyABI from "@/contracts/abis/AaveStrategy.json";
import type { StrategyInfo, StrategyConfig } from "@/contracts/types";

// Hook for reading strategy information
export function useStrategyInfo(strategyAddress: string) {
  const { data: totalAssets } = useReadContract({
    address: strategyAddress as `0x${string}`,
    abi: AaveStrategyABI, // All strategies have similar interface
    functionName: "totalAssets",
  });

  const { data: asset } = useReadContract({
    address: strategyAddress as `0x${string}`,
    abi: AaveStrategyABI,
    functionName: "asset",
  });

  const { data: vault } = useReadContract({
    address: strategyAddress as `0x${string}`,
    abi: AaveStrategyABI,
    functionName: "vault",
  });

  return {
    totalAssets: totalAssets || BigInt(0),
    asset: asset || "0x0",
    vault: vault || "0x0",
  } as StrategyInfo;
}

// Hook for getting available strategies
export function useAvailableStrategies(): StrategyConfig[] {
  return [
    {
      type: "aave",
      address: CONTRACT_ADDRESSES.AAVE_POOL,
      name: "Aave Strategy",
      description: "Lend assets on Aave protocol for yield",
      risk: "low",
    },
    {
      type: "compound",
      address: CONTRACT_ADDRESSES.COMPOUND_COMPTROLLER,
      name: "Compound Strategy",
      description: "Supply assets to Compound for interest",
      risk: "low",
    },
    {
      type: "yearn",
      address: CONTRACT_ADDRESSES.YEARN_VAULT,
      name: "Yearn Strategy",
      description: "Auto-compound yield farming with Yearn",
      risk: "medium",
    },
    {
      type: "uniswap",
      address: CONTRACT_ADDRESSES.UNISWAP_V3_POOL,
      name: "Uniswap V3 Strategy",
      description: "Provide liquidity on Uniswap V3",
      risk: "high",
    },
    {
      type: "null",
      address: CONTRACT_ADDRESSES.NULL_STRATEGY,
      name: "No Strategy",
      description: "Hold assets without yield generation",
      risk: "low",
    },
  ];
}
