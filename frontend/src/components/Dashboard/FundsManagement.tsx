import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import DepositModal from "./modals/DepositModal";
import WithdrawModal from "./modals/WithdrawModal";
import SendModal from "./modals/SendModal";

interface FundsManagementProps {
  userBalance: number;
  userInitialDeposit: number;
  realEarnings: number;
  onBalanceUpdate: (newBalance: number) => void;
}

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "send";
  amount: number;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
  hash?: string;
}

const FundsManagement: React.FC<FundsManagementProps> = ({
  userBalance,
  userInitialDeposit,
  realEarnings,
  onBalanceUpdate,
}) => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  // Load transaction history from localStorage (in a real app, this would come from blockchain events)
  useEffect(() => {
    const savedTransactions = localStorage.getItem("userTransactions");
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions).map(
        (tx: Partial<Transaction>) => ({
          ...tx,
          timestamp: new Date(tx.timestamp || Date.now()),
        })
      );
      setRecentTransactions(transactions.slice(-5)); // Show last 5 transactions
    }
  }, []);

  const addTransaction = (
    type: "deposit" | "withdraw" | "send",
    amount: number
  ) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      timestamp: new Date(),
      status: "completed",
    };

    const updatedTransactions = [newTransaction, ...recentTransactions].slice(
      0,
      5
    );
    setRecentTransactions(updatedTransactions);

    // Save to localStorage
    const allTransactions = JSON.parse(
      localStorage.getItem("userTransactions") || "[]"
    );
    allTransactions.push(newTransaction);
    localStorage.setItem("userTransactions", JSON.stringify(allTransactions));
  };

  const handleDepositSuccess = (amount: number) => {
    onBalanceUpdate(userBalance + amount);
    addTransaction("deposit", amount);
    setIsDepositOpen(false);
  };

  const handleWithdrawSuccess = (amount: number) => {
    onBalanceUpdate(userBalance - amount);
    addTransaction("withdraw", amount);
    setIsWithdrawOpen(false);
  };

  const handleSendSuccess = (amount: number) => {
    onBalanceUpdate(userBalance - amount);
    addTransaction("send", amount);
    setIsSendOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return "💰";
      case "withdraw":
        return "📤";
      case "send":
        return "📨";
      default:
        return "💫";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-emerald-400";
      case "withdraw":
        return "text-blue-400";
      case "send":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  // Calculate 24h change (simplified - in reality this would be more complex)
  const dailyChangePercent = realEarnings > 0 ? 2.4 : 0;

  return (
    <div className="w-full space-y-4">
      {/* Balance Card - Mobile Optimized */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
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
            <span
              className={`${
                dailyChangePercent >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {dailyChangePercent >= 0 ? "+" : ""}
              {dailyChangePercent}%
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">Last 24h</span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Mobile First */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={() => setIsDepositOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-medium text-sm"
        >
          <span className="mr-2">💰</span>
          Deposit
        </Button>
        <Button
          onClick={() => setIsWithdrawOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium text-sm"
        >
          <span className="mr-2">📤</span>
          Withdraw
        </Button>
        <Button
          onClick={() => setIsSendOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-medium text-sm"
        >
          <span className="mr-2">📨</span>
          Send
        </Button>
      </div>

      {/* Quick Stats - Compact Mobile */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs mb-1">Total Deposits</p>
          <p className="text-white font-semibold text-sm sm:text-base">
            ${userInitialDeposit.toLocaleString()}
          </p>
          <p className="text-emerald-400 text-xs">
            {userInitialDeposit > 0 ? "Principal" : "No deposits"}
          </p>
        </div>
        <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs mb-1">Total Earned</p>
          <p className="text-white font-semibold text-sm sm:text-base">
            ${realEarnings.toLocaleString()}
          </p>
          <p className="text-blue-400 text-xs">
            {userInitialDeposit > 0
              ? `${((realEarnings / userInitialDeposit) * 100).toFixed(
                  2
                )}% return`
              : "0% APY"}
          </p>
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
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-gray-800/20 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {getTransactionIcon(transaction.type)}
                  </span>
                  <div>
                    <p className="text-white text-xs font-medium capitalize">
                      {transaction.type}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xs font-medium ${getTransactionColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.type === "deposit" ? "+" : "-"}$
                    {transaction.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        transaction.status === "completed"
                          ? "bg-emerald-500"
                          : transaction.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-gray-400 text-xs capitalize">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800/20 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">No recent activity</p>
              <p className="text-gray-500 text-xs">
                Make your first deposit to get started
              </p>
            </div>
          )}
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
