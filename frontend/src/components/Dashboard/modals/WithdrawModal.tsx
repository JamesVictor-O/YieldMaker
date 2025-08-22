import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  currentBalance: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentBalance,
}) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setError("Please enter a valid amount greater than 0");
      return false;
    }
    if (numValue > currentBalance) {
      setError("Insufficient balance for this withdrawal");
      return false;
    }
    if (numValue > 50000) {
      setError("Maximum withdrawal amount is $50,000 per transaction");
      return false;
    }
    setError("");
    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value) {
      validateAmount(value);
    } else {
      setError("");
    }
  };

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = (currentBalance * percentage) / 100;
    setAmount(quickAmount.toFixed(2));
    setError("");
  };

  const handleWithdrawAll = () => {
    setAmount(currentBalance.toFixed(2));
    setError("");
  };

  const handleWithdraw = async () => {
    if (!validateAmount(amount)) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);
      setTimeout(() => {
        onSuccess(parseFloat(amount));
        setAmount("");
        setSuccess(false);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError("Withdrawal failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setAmount("");
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📤</span>
            </div>
            Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Withdraw funds from your YieldMaker account to your connected
            wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Balance */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-lg font-semibold text-gray-900">
              ${currentBalance.toLocaleString()}
            </p>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                className="pl-8"
                disabled={isLoading}
                min="0"
                max={currentBalance}
                step="0.01"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-500">Quick Withdrawal</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(25)}
                disabled={isLoading}
                className="text-xs"
              >
                25% (${(currentBalance * 0.25).toFixed(0)})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(50)}
                disabled={isLoading}
                className="text-xs"
              >
                50% (${(currentBalance * 0.5).toFixed(0)})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(75)}
                disabled={isLoading}
                className="text-xs"
              >
                75% (${(currentBalance * 0.75).toFixed(0)})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleWithdrawAll}
                disabled={isLoading}
                className="text-xs"
              >
                All (${currentBalance.toFixed(0)})
              </Button>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Withdrawal Amount</span>
              <span className="font-medium">
                ${amount ? parseFloat(amount).toLocaleString() : "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Network Fee</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-sm font-semibold">
              <span> You'll Receive</span>
              <span>
                ${amount ? parseFloat(amount).toLocaleString() : "0.00"}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between text-sm">
              <span className="text-gray-500">Remaining Balance</span>
              <span className="font-medium">
                $
                {amount
                  ? (currentBalance - parseFloat(amount)).toLocaleString()
                  : currentBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Success State */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">✓ Success</Badge>
                <span className="text-sm text-green-800">
                  Withdrawal successful! Funds will be sent to your wallet
                  shortly.
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={!amount || isLoading || !!error}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "Confirm Withdrawal"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
