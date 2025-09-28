import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useMockAavePoolAPY } from "@/hooks/contracts/useMockAavePool";
import {
  useAaveStrategyBalance,
  useAaveStrategyInfo,
} from "@/hooks/contracts/useAaveStrategy";
import {
  useVaultBalance,
  useVaultInfo,
  useSetStrategy,
} from "@/hooks/contracts/useVault";
import { formatNumber } from "@/lib/utils";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";

const StrategyManager: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const { address } = useAccount();

  // Get strategy data
  const {
    apyDisplay,
    apyFormatted,
    isLoading: apyLoading,
  } = useMockAavePoolAPY();
  const { balanceFormatted: strategyBalance, isLoading: balanceLoading } =
    useAaveStrategyBalance();
  const { asset, vault, aToken, aavePool } = useAaveStrategyInfo();
  const { balance: vaultBalance } = useVaultBalance();

  // Get vault info to check current strategy
  const { strategy: currentStrategy } = useVaultInfo();

  // Strategy management
  const {
    setStrategy,
    isPending: isSettingStrategy,
    isConfirmed: strategyChanged,
    error: strategyError,
  } = useSetStrategy();

  // Convert vault balance to readable format
  const vaultBalanceFormatted = vaultBalance
    ? parseFloat(vaultBalance.toString()) / 1e18
    : 0;

  // Check if Aave strategy is currently active
  const isAaveStrategyActive =
    currentStrategy?.toLowerCase() ===
    CONTRACT_ADDRESSES.AAVE_STRATEGY.toLowerCase();

  // Handle strategy switching
  const handleSwitchToAave = async () => {
    try {
      await setStrategy(CONTRACT_ADDRESSES.AAVE_STRATEGY);
    } catch (error) {
      console.error("Failed to switch to Aave strategy:", error);
    }
  };

  if (!address) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">
          Strategy Manager
        </h3>
        <p className="text-gray-400">
          Connect your wallet to view strategy details
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-emerald-600 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Aave Strategy</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Strategy Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-1">Current APY</div>
          <div className="text-white font-semibold">
            {apyLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              apyDisplay || "8.2%"
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-1">Strategy Balance</div>
          <div className="text-white font-semibold">
            {balanceLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `$${formatNumber(strategyBalance)}`
            )}
          </div>
        </div>
      </div>

      {/* Vault Balance Info */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="text-gray-400 text-xs mb-1">Your Vault Balance</div>
        <div className="text-white font-semibold">
          ${formatNumber(vaultBalanceFormatted)}
        </div>
        <div className="text-gray-500 text-xs mt-1">
          Available for strategy deployment
        </div>
      </div>

      {/* Strategy Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isAaveStrategyActive ? "bg-emerald-500" : "bg-orange-500"
            }`}
          ></div>
          <span className="text-gray-400 text-sm">
            {isAaveStrategyActive
              ? "Aave Strategy Active"
              : "Different Strategy Active"}
          </span>
        </div>

        {!isAaveStrategyActive && (
          <button
            onClick={handleSwitchToAave}
            disabled={isSettingStrategy}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs rounded-lg transition-colors"
          >
            {isSettingStrategy ? "Switching..." : "Switch to Aave"}
          </button>
        )}
      </div>

      {/* Strategy change success/error messages */}
      {strategyChanged && (
        <div className="mb-4 p-3 bg-emerald-900/20 border border-emerald-800/30 rounded-lg">
          <div className="text-emerald-400 text-xs">
            ✅ Strategy successfully switched to Aave!
          </div>
        </div>
      )}

      {strategyError && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
          <div className="text-red-400 text-xs">
            ❌ Failed to switch strategy: {strategyError.message}
          </div>
        </div>
      )}

      {/* Strategy Details */}
      {showDetails && (
        <div className="border-t border-gray-700 pt-4 mt-4">
          <h4 className="text-white font-medium mb-3">Strategy Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Strategy:</span>
              <span className="text-white font-mono text-xs">
                {currentStrategy
                  ? `${currentStrategy.slice(0, 6)}...${currentStrategy.slice(
                      -4
                    )}`
                  : "Loading..."}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Asset:</span>
              <span className="text-white font-mono text-xs">
                {asset
                  ? `${asset.slice(0, 6)}...${asset.slice(-4)}`
                  : "Loading..."}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vault:</span>
              <span className="text-white font-mono text-xs">
                {vault
                  ? `${vault.slice(0, 6)}...${vault.slice(-4)}`
                  : "Loading..."}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">aToken:</span>
              <span className="text-white font-mono text-xs">
                {aToken
                  ? `${aToken.slice(0, 6)}...${aToken.slice(-4)}`
                  : "Loading..."}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Aave Pool:</span>
              <span className="text-white font-mono text-xs">
                {aavePool
                  ? `${aavePool.slice(0, 6)}...${aavePool.slice(-4)}`
                  : "Loading..."}
              </span>
            </div>
          </div>

          {/* Expected Earnings */}
          {strategyBalance > 0 && apyFormatted > 0 && (
            <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-800/30 rounded-lg">
              <div className="text-emerald-400 text-xs mb-1">
                Projected Annual Earnings
              </div>
              <div className="text-emerald-300 font-semibold">
                ${formatNumber((strategyBalance * apyFormatted) / 100)}
              </div>
              <div className="text-emerald-500 text-xs mt-1">
                ~${formatNumber((strategyBalance * apyFormatted) / 100 / 365)}{" "}
                per day
              </div>
            </div>
          )}
        </div>
      )}

      {/* Note about strategy management */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
        <div className="text-blue-400 text-xs mb-1">📝 Note</div>
        <div className="text-blue-300 text-xs">
          Strategy investments are managed automatically by the vault. Use the
          deposit function to add funds that can be deployed to this strategy.
        </div>
      </div>
    </div>
  );
};

export default StrategyManager;
