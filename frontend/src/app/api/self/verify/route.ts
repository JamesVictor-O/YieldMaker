import { NextResponse } from 'next/server';
import { SelfBackendVerifier, DefaultConfigStore } from '@selfxyz/core';
import { ethers } from 'ethers';

// Minimal ABI for the registry contract
const SELF_REGISTRY_ABI = [
  // function recordVerification(address user, bytes32 nullifier) external
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'bytes32', name: 'nullifier', type: 'bytes32' },
    ],
    name: 'recordVerification',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attestationId, proof, publicSignals, userContextData } = body || {};

    if (!attestationId || !proof || !publicSignals || !userContextData) {
      return NextResponse.json(
        { message: 'attestationId, proof, publicSignals, and userContextData are required' },
        { status: 400 }
      );
    }

    const scope = process.env.NEXT_PUBLIC_SELF_SCOPE || 'yieldmaker';
    const endpoint = `${process.env.NEXT_PUBLIC_URL || ''}/api/self/verify`;

    const configStore = new DefaultConfigStore({
      minimumAge: 18,
      // Customize as needed
      // excludedCountries: ['IRN', 'PRK'],
      ofac: false,
    });

    // Allow passport attestation id = 1 by default (types 1|2)
    const allowedIds = new Map<1 | 2, boolean>([[1, true]]);

    const verifier = new SelfBackendVerifier(
      scope,
      endpoint,
      false, // mainnet default; set true for mock/test
      allowedIds,
      configStore,
      'hex' // we identify users by wallet address
    );

    const result = await verifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );

    if (!result?.isValidDetails?.isValid) {
      return NextResponse.json(
        { status: 'error', result: false, details: result?.isValidDetails },
        { status: 400 }
      );
    }

    // On-chain record (optional but requested): requires env vars
    const rpcUrl = process.env.CELO_RPC_URL;
    const privKey = process.env.SELF_REGISTRY_SIGNER_KEY;
    const registryAddress = process.env.SELF_REGISTRY_ADDRESS;

    if (rpcUrl && privKey && registryAddress) {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const wallet = new ethers.Wallet(privKey, provider);
      const contract = new ethers.Contract(registryAddress, SELF_REGISTRY_ABI, wallet);

      const userHex = result.userData?.userIdentifier as string | undefined; // 0x... address
      const nullifierHex = result.discloseOutput?.nullifier as string | undefined;

      if (!userHex || !nullifierHex) {
        return NextResponse.json(
          { status: 'error', result: false, reason: 'Missing user or nullifier in result' },
          { status: 500 }
        );
      }

      const tx = await contract.recordVerification(userHex, nullifierHex);
      await tx.wait();
    }

    return NextResponse.json({ status: 'success', result: true, discloseOutput: result.discloseOutput });
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', result: false, message: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}


