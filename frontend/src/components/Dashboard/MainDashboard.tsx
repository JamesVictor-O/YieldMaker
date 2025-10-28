import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatEther } from "viem";
import { User } from "@/types";
import WelcomeFlow from "./WelcomeFlow";
import FundsManagement from "./FundsManagement";
import StrategyManager from "./StrategyManager";
import { useVaultBalance, useVaultInfo } from "@/hooks/contracts/useVault";
import { useAvailableStrategies } from "@/hooks/contracts/useStrategies";
import { useMockAavePoolAPY } from "@/hooks/contracts/useMockAavePool";
import { useAaveStrategyBalance } from "@/hooks/contracts/useAaveStrategy";
import { useAccount } from "wagmi";
import { useIsVerified } from "@/hooks/use-verification";
import { useContractAddress } from "@/hooks/use-contract";

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
  const [userInitialDeposit, setUserInitialDeposit] = useState(0);

  // Smart contract hooks for real-time data
  const { balance: vaultBalance, isLoading: balanceLoading } =
    useVaultBalance();
  const { totalAssets, strategy: currentStrategy } = useVaultInfo();
  const { address } = useAccount();
  const { data: isVerified = false,  } = useIsVerified(address as `0x${string}`);
  const registryAddress = useContractAddress();

  const availableStrategies = useAvailableStrategies();
  const router = useRouter();

  // Get real-time APY from our deployed MockAavePool
  const { apyDisplay, isLoading: apyLoading } = useMockAavePoolAPY();

  // Get Aave strategy balance
  const { balanceFormatted: aaveStrategyBalance } = useAaveStrategyBalance();

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

  // Load user's initial deposit from localStorage (or could be from blockchain events)
  useEffect(() => {
    if (address) {
      const savedInitialDeposit = localStorage.getItem(
        `initialDeposit_${address}`
      );
      if (savedInitialDeposit) {
        setUserInitialDeposit(parseFloat(savedInitialDeposit));
      } else {
        // If no initial deposit saved, assume current balance is the initial deposit
        // This handles existing users who already have deposits
        if (vaultBalanceFormatted > 0) {
          setUserInitialDeposit(vaultBalanceFormatted);
          localStorage.setItem(
            `initialDeposit_${address}`,
            vaultBalanceFormatted.toString()
          );
        }
      }
    }
  }, [address, vaultBalanceFormatted]);

  // Self verification status is fully on-chain now via useIsVerified

  // Calculate real earnings
  const realEarnings = Math.max(0, userBalance - userInitialDeposit);

  // Update initial deposit when user makes new deposits
  const handleBalanceUpdate = (newBalance: number) => {
    if (address && newBalance > userBalance) {
      // User made a deposit, update initial deposit tracker
      const additionalDeposit = newBalance - userBalance;
      const newInitialDeposit = userInitialDeposit + additionalDeposit;
      setUserInitialDeposit(newInitialDeposit);
      localStorage.setItem(
        `initialDeposit_${address}`,
        newInitialDeposit.toString()
      );
    }
  };

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
      <div className="max-w-7xl mx-auto px-3 pt-16 sm:px-4 lg:px-6 py-4">
        {/* Top Stats Cards - Clean Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Total Portfolio */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-emerald-600 transition-all">
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
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-emerald-600 transition-all">
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
                ${formatNumber(realEarnings)}
              </h3>
            )}
            <p className="text-xs text-gray-400">
              {userInitialDeposit > 0
                ? `${((realEarnings / userInitialDeposit) * 100).toFixed(2)}%`
                : "0%"}{" "}
              return
            </p>
          </div>

          {/* Risk Level */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-emerald-600 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  user.riskProfile === "conservative"
                    ? "bg-blue-500"
                    : user.riskProfile === "moderate"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs text-gray-400 font-medium">Risk</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 capitalize">
              {user.riskProfile}
            </h3>
            <p className="text-xs text-gray-400">Strategy</p>
          </div>

          {/* Active Strategy */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-emerald-600 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-gray-400 font-medium">
                Strategy
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1">
              {availableStrategies.find((s) => s.address === currentStrategy)
                ?.name || "Simple Hold"}
            </h3>
            <p className="text-xs text-gray-400">Active</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Funds Management */}
          <div className="lg:col-span-2">
            <FundsManagement
              userBalance={userBalance}
              userInitialDeposit={userInitialDeposit}
              realEarnings={realEarnings}
              onBalanceUpdate={handleBalanceUpdate}
            />
          </div>

          {/* Right Column - Strategy & Performance */}
          <div className="space-y-6">
            {/* Self Verification Prompt (shown when not verified on-chain or registry not configured) */}
            {(!isVerified || !registryAddress) && (
              <div className="bg-amber-900/20 border border-amber-800/30 rounded-2xl p-6">
                <h3 className="text-white font-semibold text-lg mb-2">Get Verified with Self</h3>
                <p className="text-sm text-amber-200/90 mb-4">
                  Verify your humanity to unlock more yield opportunities. You can do this anytime.
                </p>
                <button
                  onClick={() => router.push("/verify-self")}
                  className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  Get Verified with Self
                </button>
              </div>
            )}
            {/* Strategy Overview */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-emerald-600 transition-all">
              <h3 className="text-white font-semibold text-lg mb-4">
                Strategy Overview
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">
                    Current Strategy
                  </span>
                  <span className="text-white font-medium">
                    {availableStrategies.find(
                      (s) => s.address === currentStrategy
                    )?.name || "Simple Hold"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Expected APY</span>
                  <span className="text-emerald-400 font-medium">
                    {apyLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      apyDisplay || "8.2%"
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Total Assets</span>
                  <span className="text-white font-medium">
                    ${formatNumber(totalAssetsFormatted)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Your Share</span>
                  <span className="text-white font-medium">
                    {totalAssetsFormatted > 0
                      ? `${((userBalance / totalAssetsFormatted) * 100).toFixed(
                          1
                        )}%`
                      : "0%"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Aave Strategy</span>
                  <span className="text-white font-medium">
                    ${formatNumber(aaveStrategyBalance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Strategy Manager */}
            <StrategyManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
