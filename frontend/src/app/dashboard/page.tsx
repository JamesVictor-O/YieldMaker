"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import MainDashboard from "@/components/Dashboard/MainDashboard";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      setUser({
        address,
        balance: 0, // This would be fetched from the blockchain
        isNewUser: true,
        riskProfile: undefined,
      });
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Connect Your Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Please connect your wallet to access the dashboard
            </p>
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
            <Button variant="outline" className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto mt-20">
        <MainDashboard user={user} />
      </div>
    </div>
  );
}
