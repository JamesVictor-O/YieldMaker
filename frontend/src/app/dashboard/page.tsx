"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import MainDashboard from "@/components/Dashboard/MainDashboard";
import { User } from "@/types";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      // In a real app, you'd fetch user data from your backend
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to access the dashboard
          </p>
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto mt-20">
        <MainDashboard user={user} />
      </div>
    </div>
  );
}
