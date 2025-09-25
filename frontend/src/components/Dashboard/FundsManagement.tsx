import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import WithdrawModal from "./modals/WithdrawModal";
import SendModal from "./modals/SendModal";
import DepositModal from "./modals/DepositModal";

interface FundsManagementProps {
  userBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

const FundsManagement: React.FC<FundsManagementProps> = ({
  userBalance,
  onBalanceUpdate,
}) => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);

  const handleDepositSuccess = (amount: number) => {
    onBalanceUpdate(userBalance + amount);
    setIsDepositOpen(false);
  };

  const handleWithdrawSuccess = (amount: number) => {
    onBalanceUpdate(userBalance - amount);
    setIsWithdrawOpen(false);
  };

  const handleSendSuccess = (amount: number) => {
    onBalanceUpdate(userBalance - amount);
    setIsSendOpen(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Balance Card - Mobile Optimized */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 bg-emerald-500 rounded-full"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg">
                Portfolio
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Available Balance
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-2 py-1 text-xs">
            Active
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="text-3xl sm:text-4xl font-bold text-white">
            ${userBalance.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-emerald-400">+2.4%</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">Last 24h</span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Mobile First */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={() => setIsDepositOpen(true)}
          className="h-14 sm:h-16 flex flex-col items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl border-0 shadow-lg active:scale-95 transition-all"
        >
          <div className="text-base sm:text-lg">↗️</div>
          <div className="text-xs sm:text-sm font-medium">Deposit</div>
        </Button>

        <Button
          onClick={() => setIsWithdrawOpen(true)}
          variant="outline"
          className="h-14 sm:h-16 flex flex-col items-center justify-center gap-1 bg-gray-800/50 hover:bg-gray-700/70 text-white border-gray-700 hover:border-gray-600 rounded-xl active:scale-95 transition-all"
        >
          <div className="text-base sm:text-lg">↙️</div>
          <div className="text-xs sm:text-sm font-medium">Withdraw</div>
        </Button>

        <Button
          onClick={() => setIsSendOpen(true)}
          variant="outline"
          className="h-14 sm:h-16 flex flex-col items-center justify-center gap-1 bg-gray-800/50 hover:bg-gray-700/70 text-white border-gray-700 hover:border-gray-600 rounded-xl active:scale-95 transition-all"
        >
          <div className="text-base sm:text-lg">→</div>
          <div className="text-xs sm:text-sm font-medium">Send</div>
        </Button>
      </div>

      {/* Quick Stats - Compact Mobile */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs mb-1">Total Deposits</p>
          <p className="text-white font-semibold text-sm sm:text-base">
            $12,450
          </p>
          <p className="text-emerald-400 text-xs">+5.2%</p>
        </div>
        <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs mb-1">Total Earned</p>
          <p className="text-white font-semibold text-sm sm:text-base">
            $1,250
          </p>
          <p className="text-blue-400 text-xs">8.2% APY</p>
        </div>
      </div>

      {/* Recent Activity - Minimal */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium text-sm sm:text-base">
            Recent Activity
          </h4>
          <button className="text-gray-400 text-xs hover:text-white transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-2">
          {/* Compact Transaction Items */}
          <div className="flex items-center justify-between bg-gray-800/20 rounded-xl p-3 hover:bg-gray-800/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-sm">↗️</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Deposit</p>
                <p className="text-gray-400 text-xs">2h ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 font-semibold text-sm">+$500</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-800/20 rounded-xl p-3 hover:bg-gray-800/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-sm">→</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Send</p>
                <p className="text-gray-400 text-xs">1d ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-red-400 font-semibold text-sm">-$200</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onSuccess={handleDepositSuccess}
        currentBalance={userBalance}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onSuccess={handleWithdrawSuccess}
        currentBalance={userBalance}
      />

      <SendModal
        isOpen={isSendOpen}
        onClose={() => setIsSendOpen(false)}
        onSuccess={handleSendSuccess}
        currentBalance={userBalance}
      />
    </div>
  );
};

export default FundsManagement;
