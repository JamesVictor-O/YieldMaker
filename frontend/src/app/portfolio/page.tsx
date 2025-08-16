"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { User, Protocol } from "@/types";
import ConnectWallet from "@/components/Web3/ConnectWallet";

// Mock data - in real app this would come from blockchain/backend
const mockProtocols: Protocol[] = [
  {
    id: "1",
    name: "Aave USDC",
    apy: 8.2,
    tvl: "$13.2B",
    risk: "low",
    audited: true,
    description: "Stablecoin lending on Aave",
  },
  {
    id: "2",
    name: "Compound ETH",
    apy: 12.4,
    tvl: "$8.1B",
    risk: "medium",
    audited: true,
    description: "ETH lending on Compound",
  },
  {
    id: "3",
    name: "Yearn USDC",
    apy: 15.7,
    tvl: "$2.3B",
    risk: "high",
    audited: true,
    description: "USDC yield farming on Yearn",
  },
];

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<User | null>(null);
  const [investments, setInvestments] = useState<
    Array<Protocol & { amount: number; earnings: number }>
  >([]);

  useEffect(() => {
    if (isConnected && address) {
      setUser({
        address,
        balance: 2500,
        isNewUser: false,
        riskProfile: "moderate",
      });

      // Mock investments
      setInvestments([
        { ...mockProtocols[0], amount: 1000, earnings: 82 },
        { ...mockProtocols[1], amount: 800, earnings: 99.2 },
        { ...mockProtocols[2], amount: 700, earnings: 109.9 },
      ]);
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
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
          <p className="text-gray-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalEarnings = investments.reduce((sum, inv) => sum + inv.earnings, 0);
  const totalValue = totalInvested + totalEarnings;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Portfolio
          </h1>
          <p className="text-gray-600">
            Track your DeFi investments and performance
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalInvested.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalEarnings.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Risk Level</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {user.riskProfile}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Investments List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Active Investments
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {investments.map((investment) => (
              <div key={investment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {investment.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          investment.risk === "low"
                            ? "bg-green-100 text-green-800"
                            : investment.risk === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {investment.risk} risk
                      </span>
                      {investment.audited && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Audited
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {investment.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>TVL: {investment.tvl}</span>
                      <span>Amount: ${investment.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {investment.apy}% APY
                    </div>
                    <div className="text-sm text-gray-600">
                      Earnings: ${investment.earnings.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
