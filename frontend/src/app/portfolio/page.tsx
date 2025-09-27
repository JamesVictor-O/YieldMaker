"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { User, Protocol } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConnectWallet from "@/components/Web3/ConnectWallet";
import { useVaultBalance, useVaultInfo } from "@/hooks/contracts/useVault";
import { useAvailableStrategies } from "@/hooks/contracts/useStrategies";

// Keep protocol data for display purposes, but use real investment amounts
const mockProtocols: Protocol[] = [
  {
    id: "1",
    name: "YieldMaker Vault",
    description: "Automated yield farming with smart risk management",
    apy: 8.2,
    risk: "medium",
    tvl: "$2.3M",
    audited: true,
  },
];

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<User | null>(null);
  const [userInitialDeposit, setUserInitialDeposit] = useState(0);

  // Smart contract hooks for real-time data
  const { balance: vaultBalance, isLoading: balanceLoading } =
    useVaultBalance();
  const { totalAssets } = useVaultInfo();
  const availableStrategies = useAvailableStrategies();

  // Convert vault balance to readable format
  const vaultBalanceFormatted =
    vaultBalance && typeof vaultBalance === "bigint"
      ? parseFloat(formatEther(vaultBalance))
      : 0;
  const totalAssetsFormatted =
    totalAssets && typeof totalAssets === "bigint"
      ? parseFloat(formatEther(totalAssets))
      : 0;

  // Load user's initial deposit from localStorage
  useEffect(() => {
    if (address) {
      const savedInitialDeposit = localStorage.getItem(
        `initialDeposit_${address}`
      );
      if (savedInitialDeposit) {
        setUserInitialDeposit(parseFloat(savedInitialDeposit));
      } else if (vaultBalanceFormatted > 0) {
        // For existing users, assume current balance is initial deposit
        setUserInitialDeposit(vaultBalanceFormatted);
        localStorage.setItem(
          `initialDeposit_${address}`,
          vaultBalanceFormatted.toString()
        );
      }
    }
  }, [address, vaultBalanceFormatted]);

  useEffect(() => {
    if (isConnected && address) {
      setUser({
        address,
        balance: vaultBalanceFormatted, // Use real balance
        isNewUser: false,
        riskProfile: "moderate",
      });
    }
  }, [isConnected, address, vaultBalanceFormatted]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (!user || balanceLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse mb-4"></div>
          <p className="text-gray-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  // Calculate real earnings
  const realEarnings = Math.max(0, vaultBalanceFormatted - userInitialDeposit);
  const totalValue = vaultBalanceFormatted;

  // Create real investment data based on actual vault position
  const investments =
    vaultBalanceFormatted > 0
      ? [
          {
            ...mockProtocols[0],
            amount: userInitialDeposit,
            earnings: realEarnings,
          },
        ]
      : [];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
          <p className="text-gray-600">
            Track your investments and performance across DeFi protocols
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Portfolio Value
              </h3>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ${formatNumber(totalValue)}
            </p>
            <div className="flex items-center space-x-2">
              <Badge
                className={`${
                  realEarnings >= 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {realEarnings >= 0 ? "+" : ""}
                {userInitialDeposit > 0
                  ? ((realEarnings / userInitialDeposit) * 100).toFixed(2)
                  : "0"}
                %
              </Badge>
              <span className="text-sm text-gray-600">Total Return</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Invested
              </h3>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ${formatNumber(userInitialDeposit)}
            </p>
            <p className="text-sm text-gray-600">Principal Amount</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Earnings
              </h3>
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ${formatNumber(realEarnings)}
            </p>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-100 text-purple-800">
                {availableStrategies[0]?.apy || "8.2"}% APY
              </Badge>
            </div>
          </div>
        </div>

        {/* Active Positions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Active Positions
          </h3>

          {investments.length > 0 ? (
            <div className="space-y-4">
              {investments.map((investment, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">YM</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {investment.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {investment.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ${formatNumber(investment.amount + investment.earnings)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          {investment.apy}%
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-500">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-600">Invested</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${formatNumber(investment.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Earnings</p>
                      <p className="text-lg font-semibold text-green-600">
                        +${formatNumber(investment.earnings)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Share of Vault</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {totalAssetsFormatted > 0
                          ? `${(
                              (vaultBalanceFormatted / totalAssetsFormatted) *
                              100
                            ).toFixed(1)}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No Active Positions
              </h4>
              <p className="text-gray-600 mb-6">
                Start investing to see your positions here
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Start Investing
              </Button>
            </div>
          )}
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Performance Over Time
          </h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-600">Performance chart coming soon</p>
              <p className="text-sm text-gray-500">
                Track your portfolio growth over time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
