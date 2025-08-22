import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import WithdrawModal  from "./modals/WithdrawModal";
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">💰</span>
          </div>
          Funds Management
        </CardTitle>
        <p className="text-sm text-gray-500">
          Manage your funds with secure transactions
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${userBalance.toLocaleString()}
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setIsDepositOpen(true)}
            className="h-16 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <div className="text-lg">📥</div>
            <div className="text-sm font-medium">Deposit</div>
          </Button>

          <Button
            onClick={() => setIsWithdrawOpen(true)}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-2"
          >
            <div className="text-lg">📤</div>
            <div className="text-sm font-medium">Withdraw</div>
          </Button>

          <Button
            onClick={() => setIsSendOpen(true)}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-2"
          >
            <div className="text-lg">💸</div>
            <div className="text-sm font-medium">Send</div>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500">Total Deposits</p>
            <p className="text-lg font-semibold text-blue-600">$12,450</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-gray-500">Total Withdrawals</p>
            <p className="text-lg font-semibold text-orange-600">$8,200</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Recent Transactions</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">📥</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Deposit</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">+$500</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">💸</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Send to 0x1234...5678</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-red-600">-$200</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

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
    </Card>
  );
};

export default FundsManagement;
