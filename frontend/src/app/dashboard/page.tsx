"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import MainDashboard from "@/components/Dashboard/MainDashboard";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";

export default function DashboardPage() {
  const { ready, authenticated, user: privyUser, login } = usePrivy();
  const [user, setUser] = useState<User | null>(null);

  // Use the onboarding hook to manage user state properly
  const {
    isNewUser,
    riskProfile,
    isLoading: isOnboardingLoading,
    markOnboardingComplete,
   
  } = useUserOnboarding();

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
    if (isConnected && address && !isOnboardingLoading) {
      setUser({
        address,
        balance: 0, // This would be fetched from the blockchain
        isNewUser,
        riskProfile,
      });
    }
  }, [isConnected, address, isNewUser, riskProfile, isOnboardingLoading]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border border-gray-800">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-white">
              Connect Your Wallet
            </CardTitle>
            <p className="text-sm text-gray-400">Access your personalized DeFi dashboard</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-gray-800 border border-gray-700" />
            <Button onClick={login} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              Connect Wallet
            </Button>
            <p className="text-xs text-gray-500">Secure connection powered by Privy</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || isOnboardingLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-white">
              Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto animate-pulse"></div>
            <p className="text-gray-400">
              {isOnboardingLoading
                ? "Checking your profile..."
                : "Loading your profile..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=" bg-gray-950 md:p-4">
    

      <div className="max-w-7xl mx-auto m">
        <MainDashboard
          user={user}
          onOnboardingComplete={markOnboardingComplete}
        />
      </div>
    </div>
  );
}
