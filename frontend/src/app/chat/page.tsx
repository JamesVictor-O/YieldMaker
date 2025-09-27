"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import AIChat from "@/components/Chat/AIChat";
import { User } from "@/types";
import ConnectWallet from "@/components/Web3/ConnectWallet";

export default function ChatPage() {
   const { ready, authenticated, user: privyUser } = usePrivy();
  const [user, setUser] = useState<User | null>(null);

    type MinimalWallet = { address?: string };
  type MinimalLinkedAccount = { type?: string; address?: string };

  const getWalletAddress = (): string | undefined => {
    const embeddedAddress = (privyUser?.wallet as MinimalWallet | undefined)
      ?.address;
    const linkedAddress = (
      privyUser?.linkedAccounts as MinimalLinkedAccount[] | undefined
    )?.find((account) => account?.type === "wallet")?.address;
    return embeddedAddress || linkedAddress;
  };

  const isConnected = ready && authenticated;
  const address = getWalletAddress();

  useEffect(() => {
    if (isConnected && address) {
      setUser({
        address,
        balance: 0,
        isNewUser: false,
        riskProfile: "moderate",
      });
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Investment Assistant
          </h1>
          <p className="text-gray-600">
            Get personalized DeFi investment advice and strategy recommendations
          </p>
        </div>
        <AIChat user={user}/>
      </div>
    </div>
  );
}
