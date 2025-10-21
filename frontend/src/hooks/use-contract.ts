import { useReadContract, useChainId } from 'wagmi';
import { CONTRACT_CONFIG } from '@/lib/contract';

export function useContractAddress() {
  const chainId = useChainId();
  return CONTRACT_CONFIG.addresses[chainId as keyof typeof CONTRACT_CONFIG.addresses] as `0x${string}` | undefined;
}

export function useSelfVerificationRead(
  functionName: any,
  args?: readonly any[],
  options?: { enabled?: boolean }
) {
  const contractAddress = useContractAddress();
  const chainId = useChainId();
  const isMainnet = chainId === 42220; // Celo mainnet

  return useReadContract({
    address: contractAddress,
    abi: CONTRACT_CONFIG.abi,
    functionName,
    args: args as any,
    query: {
      enabled: !!contractAddress && options?.enabled !== false,
      staleTime: isMainnet ? 45000 : 10000,
      gcTime: isMainnet ? 15 * 60 * 1000 : 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchInterval: isMainnet ? 60000 : false,
      retry: isMainnet ? 5 : 3,
      retryDelay: (attemptIndex: number) => Math.min(3000 * 2 ** attemptIndex, 20000),
    },
  } as any);
}


