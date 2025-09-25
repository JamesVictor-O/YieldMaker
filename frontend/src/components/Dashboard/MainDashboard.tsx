import { useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { User } from "../../types";
import InvestmentChat from "../Chat/InvestmentChat";
import { CardHeader, CardTitle } from "../ui/card";
import WelcomeFlow from "./WelcomeFlow";
import FundsManagement from "./FundsManagement";
import { useVaultBalance, useVaultInfo } from "@/hooks/contracts/useVault";
import { useAvailableStrategies } from "@/hooks/contracts/useStrategies";
import { Button } from "../ui/button";
import { useInvestmentData } from "../../hooks/useInvestmentData";

interface MainDashboardProps {
  user: User;
  onOnboardingComplete?: (
    riskProfile: "conservative" | "moderate" | "aggressive"
  ) => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({
  user,
  onOnboardingComplete,
}) => {
  const [showWelcome, setShowWelcome] = useState(user.isNewUser);

  const { address } = useAccount();
  // Smart contract hooks for real-time data
  const { balance: vaultBalance, isLoading: balanceLoading } =
    useVaultBalance();
  const { totalAssets, strategy: currentStrategy } = useVaultInfo();

  // Investment data management
  const {
    investmentData,
    statistics,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
  } = useInvestmentData();

  const availableStrategies = useAvailableStrategies();

  // Convert vault balance to readable format - handle BigInt properly
  const vaultBalanceFormatted =
    vaultBalance && typeof vaultBalance === "bigint"
      ? parseFloat(formatEther(vaultBalance))
      : 0;
  const totalAssetsFormatted =
    totalAssets && typeof totalAssets === "bigint"
      ? parseFloat(formatEther(totalAssets))
      : 0;

  // Use real vault balance instead of mock balance
  const userBalance = vaultBalanceFormatted;

  const handleWelcomeComplete = (
    riskProfile: "conservative" | "moderate" | "aggressive"
  ) => {
    user.riskProfile = riskProfile;
    setShowWelcome(false);

    // Mark onboarding as complete in the parent component
    if (onOnboardingComplete) {
      onOnboardingComplete(riskProfile);
    }
  };

  const handleBalanceUpdate = (newBalance: number) => {
    // This will be automatically updated by the smart contract hooks
    // No need to manually update state
  };

  if (showWelcome) {
    return (
      <div className="">
        <WelcomeFlow user={user} onComplete={handleWelcomeComplete} />
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen text-white">
      {/* Mobile-First Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Top Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Total Portfolio */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-gray-400 font-medium">
                Portfolio
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              ${formatNumber(userBalance)}
            </h3>
            <p className="text-xs text-gray-400">Total Value</p>
          </div>

          {/* Current Earnings */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-xs text-gray-400 font-medium">
                Earnings
              </span>
            </div>
            {balanceLoading ? (
              <div className="w-16 h-6 bg-gray-700 animate-pulse rounded mb-1"></div>
            ) : (
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-1">
                ${formatNumber(Math.max(0, userBalance - user.balance))}
              </h3>
            )}
            <p className="text-xs text-gray-400">
              {totalAssetsFormatted > 0
                ? `${((userBalance / totalAssetsFormatted) * 100).toFixed(1)}%`
                : "0%"}{" "}
              share
            </p>
          </div>

          {/* Risk Level */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  user.riskProfile === "conservative"
                    ? "bg-green-500"
                    : user.riskProfile === "moderate"
                    ? "bg-yellow-500"
                    : user.riskProfile === "aggressive"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              ></div>
              <span className="text-xs text-gray-400 font-medium">
                Risk Level
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white capitalize mb-1">
              {user.riskProfile || "Not Set"}
            </h3>
            <p className="text-xs text-gray-400">
              {user.riskProfile === "conservative"
                ? "Low Risk"
                : user.riskProfile === "moderate"
                ? "Medium Risk"
                : user.riskProfile === "aggressive"
                ? "High Risk"
                : "Not Set"}
            </p>
          </div>

          {/* APY Display - New 4th Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-gray-400 font-medium">
                Current APY
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">
              8.2%
            </h3>
            <p className="text-xs text-gray-400">Annual Yield</p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>

          {/* Portfolio Value */}
        </div>

        {/* Main Content Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Investment History - Takes more space on mobile */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 sm:p-6">
              <InvestmentChat user={user} />
            </div>
          </div>

          {/* Funds Management - Mobile Optimized */}
          <div>
            <FundsManagement
              userBalance={userBalance}
              onBalanceUpdate={handleBalanceUpdate}
            />
          </div>
        </div>

        {/* Active Positions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            Active Positions
          </h3>

          <div className="space-y-4">
            {userBalance > 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">YM</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        YieldMaker Vault
                      </h4>
                      <p className="text-sm text-gray-400">
                        {currentStrategy !==
                        "0x0000000000000000000000000000000000000000"
                          ? "Active Strategy Deployed"
                          : "No Strategy (Holding cUSD)"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      ${formatNumber(userBalance)}
                    </p>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-400">Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Total Vault: ${formatNumber(totalAssetsFormatted)} • Celo
                  </span>
                  <button className="text-blue-400 hover:text-blue-300 font-medium">
                    Manage
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No active positions</p>
                <p className="text-sm text-gray-500">
                  Deposit funds to start earning yields
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Available Opportunities */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Available Opportunities
            </h3>
            <button className="text-blue-400 hover:text-blue-300 font-medium">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {availableStrategies.map((strategy) => {
              const isCurrentStrategy = strategy.address === currentStrategy;
              const riskColor =
                strategy.risk === "low"
                  ? "bg-green-500"
                  : strategy.risk === "medium"
                  ? "bg-yellow-500"
                  : "bg-red-500";
              const bgColor =
                strategy.risk === "low"
                  ? "bg-green-600"
                  : strategy.risk === "medium"
                  ? "bg-yellow-600"
                  : "bg-red-600";

              return (
                <div
                  key={strategy.address}
                  className={`bg-gray-800 border rounded-xl p-5 hover:border-gray-600 transition-colors ${
                    isCurrentStrategy ? "border-blue-500" : "border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}
                      >
                        <span className="text-white font-bold text-xs">
                          {strategy.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">
                          {strategy.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {strategy.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">
                        {strategy.apy ? `${strategy.apy}%` : "TBD"}
                      </p>
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-1.5 h-1.5 ${riskColor} rounded-full`}
                        ></div>
                        <span className="text-xs text-gray-400 capitalize">
                          {strategy.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    Strategy • Celo Network
                  </div>
                  <button
                    className={`w-full py-2 px-3 font-medium rounded-lg text-sm transition-colors ${
                      isCurrentStrategy
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    disabled={isCurrentStrategy}
                  >
                    {isCurrentStrategy ? "Current Strategy" : "Switch To"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
