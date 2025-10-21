import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { useSelfVerificationRead, useContractAddress } from './use-contract';
import { CONTRACT_CONFIG } from '@/lib/contract';

export interface VerificationInfo {
  isVerified: boolean;
  bonusPools: number;
  verificationTimestamp: number;
  status: string;
}

export function useIsVerified(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  return useSelfVerificationRead('isCreatorVerified', [targetAddress], {
    enabled: !!targetAddress,
  }) as {
    data: boolean | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
}

export function useVerificationInfo(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  const result = useSelfVerificationRead('getVerificationInfo', [targetAddress], {
    enabled: !!targetAddress,
  });

  const transformedResult = {
    ...result,
    data: result.data
      ? ({
          isVerified: (result.data as any)[0] as boolean,
          bonusPools: Number((result.data as any)[1] as bigint),
          verificationTimestamp: Number((result.data as any)[2] as bigint),
          status: (result.data as any)[3] as string,
        } as VerificationInfo)
      : undefined,
  };

  return transformedResult as {
    data: VerificationInfo | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
}

export function useMultipleVerificationStatus(addresses: `0x${string}`[]) {
  const publicClient = usePublicClient();
  const contractAddress = useContractAddress();
  const chainId = useChainId();
  const isMainnet = chainId === 42220;

  return useQuery({
    queryKey: ['multipleVerificationStatus', addresses],
    queryFn: async () => {
      if (!publicClient || !contractAddress || addresses.length === 0) return [];
      try {
        const calls = addresses.map((address) => ({
          address: contractAddress,
          abi: CONTRACT_CONFIG.abi,
          functionName: 'isCreatorVerified',
          args: [address],
        }));
        const results = await publicClient.multicall({ contracts: calls as any });
        return addresses.map((address, index) => ({
          address,
          isVerified:
            results[index]?.status === 'success' ? (results[index].result as boolean) : false,
        }));
      } catch {
        return addresses.map((address) => ({ address, isVerified: false }));
      }
    },
    enabled: !!publicClient && !!contractAddress && addresses.length > 0,
    staleTime: isMainnet ? 30000 : 60000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useSubmitVerification() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const contractAddress = useContractAddress();
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const chainId = useChainId();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const submitVerification = useMutation({
    mutationFn: async (params: { proofPayload: string; userContextData: string }) => {
      if (!writeContract || !contractAddress) throw new Error('Contract not available');
      return writeContract({
        address: contractAddress,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'verifySelfProof',
        args: [params.proofPayload as `0x${string}`, params.userContextData as `0x${string}`],
      });
    },
    onSuccess: () => {
      if (address) {
        queryClient.invalidateQueries({ queryKey: ['isCreatorVerified', address] });
        queryClient.invalidateQueries({ queryKey: ['getVerificationInfo', address] });
        queryClient.invalidateQueries({ queryKey: ['multipleVerificationStatus'] });
      }
    },
  });

  return {
    submitVerification: submitVerification.mutate,
    submitVerificationAsync: submitVerification.mutateAsync,
    isPending: isPending || submitVerification.isPending,
    isConfirming,
    isConfirmed,
    error: error || submitVerification.error,
    hash,
  };
}

export function useFormattedVerificationStatus(address?: `0x${string}`) {
  const { data: verificationInfo, isLoading, error } = useVerificationInfo(address);

  if (!verificationInfo) {
    return {
      isLoading,
      error,
      statusText: 'Not verified',
      statusColor: 'gray',
      bonusText: 'No bonus',
      verificationInfo: null,
    };
  }

  return {
    isLoading,
    error,
    statusText: verificationInfo.isVerified ? 'Verified' : 'Not verified',
    statusColor: verificationInfo.isVerified ? 'green' : 'gray',
    bonusText: verificationInfo.isVerified
      ? `+${verificationInfo.bonusPools} bonus pool${verificationInfo.bonusPools !== 1 ? 's' : ''}`
      : 'No bonus',
    verificationInfo,
  };
}


