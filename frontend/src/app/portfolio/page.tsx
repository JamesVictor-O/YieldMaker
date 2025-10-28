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
      <div className="min-h-screen bg-gray-950 p-4">
        <div className="max-w-6xl mx-auto">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (!user || balanceLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-14 h-14 bg-gray-800 rounded-full mx-auto animate-pulse mb-3 border border-gray-700"></div>
          <p className="text-gray-400">Loading your portfolio...</p>
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
    <div className="min-h-screen bg-gray-950 p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-1">Portfolio</h1>
          <p className="text-gray-400">
            Track your investments and performance across DeFi protocols
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Total Portfolio Value
              </h3>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              ${formatNumber(totalValue)}
            </p>
            <div className="flex items-center space-x-2">
              <Badge
                className={`${realEarnings >= 0 ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800/50" : "bg-red-900/30 text-red-400 border border-red-800/50"}`}
              >
                {realEarnings >= 0 ? "+" : ""}
                {userInitialDeposit > 0
                  ? ((realEarnings / userInitialDeposit) * 100).toFixed(2)
                  : "0"}
                %
              </Badge>
              <span className="text-sm text-gray-400">Total Return</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Total Invested
              </h3>
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              ${formatNumber(userInitialDeposit)}
            </p>
            <p className="text-sm text-gray-400">Principal Amount</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Total Earnings
              </h3>
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              ${formatNumber(realEarnings)}
            </p>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-900/30 text-purple-300 border border-purple-800/50">
                {availableStrategies[0]?.apy || "8.2"}% APY
              </Badge>
            </div>
          </div>
        </div>

        {/* Active Positions */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Active Positions
          </h3>

          {investments.length > 0 ? (
            <div className="space-y-4">
              {investments.map((investment, index) => (
                <div key={index} className="border border-gray-800 rounded-lg p-5 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                        <span className="text-white font-semibold text-xs">YM</span>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white">
                          {investment.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {investment.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">
                        ${formatNumber(investment.amount + investment.earnings)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">
                          {investment.apy}%
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-xs text-gray-400">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
                    <div>
                      <p className="text-sm text-gray-400">Invested</p>
                      <p className="text-lg font-semibold text-white">
                        ${formatNumber(investment.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Earnings</p>
                      <p className="text-lg font-semibold text-emerald-400">
                        +${formatNumber(investment.earnings)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Share of Vault</p>
                      <p className="text-lg font-semibold text-white">
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
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center border border-gray-700">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">
                No Active Positions
              </h4>
              <p className="text-gray-400 mb-5">
                Start investing to see your positions here
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Start Investing
              </Button>
            </div>
          )}
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">
            Performance Over Time
          </h3>
          <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-300">Performance chart coming soon</p>
              <p className="text-sm text-gray-400">
                Track your portfolio growth over time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
