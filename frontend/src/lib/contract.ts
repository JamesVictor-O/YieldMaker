export const CONTRACT_CONFIG = {
  // Basic ABI for a Self verification registry/contract
  abi: [
    // function isCreatorVerified(address user) view returns (bool)
    {
      inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
      name: 'isCreatorVerified',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    // function getVerificationInfo(address user) view returns (bool isVerified, uint256 bonusPools, uint256 verificationTimestamp, string status)
    {
      inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
      name: 'getVerificationInfo',
      outputs: [
        { internalType: 'bool', name: 'isVerified', type: 'bool' },
        { internalType: 'uint256', name: 'bonusPools', type: 'uint256' },
        { internalType: 'uint256', name: 'verificationTimestamp', type: 'uint256' },
        { internalType: 'string', name: 'status', type: 'string' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    // function verifySelfProof(bytes proofPayload, bytes userContextData)
    {
      inputs: [
        { internalType: 'bytes', name: 'proofPayload', type: 'bytes' },
        { internalType: 'bytes', name: 'userContextData', type: 'bytes' },
      ],
      name: 'verifySelfProof',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  // Addresses per chain; set via envs or update after deployment
  addresses: {
    44787: (process.env.NEXT_PUBLIC_SELF_VERIFICATION_CONTRACT_ADDRESS_44787 || undefined) as
      | `0x${string}`
      | undefined, // Celo Alfajores
    42220: (process.env.NEXT_PUBLIC_SELF_VERIFICATION_CONTRACT_ADDRESS_42220 || undefined) as
      | `0x${string}`
      | undefined, // Celo Mainnet
  },
} as const;


