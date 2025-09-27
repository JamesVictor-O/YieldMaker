import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
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
import { useVaultDeposit } from "@/hooks/contracts/useVault";
import {
  useTokenApproval,
  useUserTokenBalance,
  useTokenAllowance,
} from "@/hooks/contracts/useERC20";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  currentBalance: number;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [pendingDeposit, setPendingDeposit] = useState<{
    amount: string;
    address: string;
  } | null>(null);

  const { address } = useAccount();

  // Smart contract hooks
  const {
    deposit,
    isPending: isDepositPending,
    isConfirming: isDepositConfirming,
    isConfirmed: isDepositConfirmed,
    error: depositError,
  } = useVaultDeposit();

  const {
    approve,
    isPending: isApprovePending,
    isConfirming: isApproveConfirming,
    isConfirmed: isApproveConfirmed,
    error: approveError,
  } = useTokenApproval(CONTRACT_ADDRESSES.CUSD);

  // Get user's cUSD balance
  const { formatted: formattedBalance, refetch: refetchBalance } =
    useUserTokenBalance(CONTRACT_ADDRESSES.CUSD, address);

  // Check current allowance
  const { allowance, refetch: refetchAllowance } = useTokenAllowance(
    CONTRACT_ADDRESSES.CUSD,
    address || "0x0",
    CONTRACT_ADDRESSES.YIELDMAKER_VAULT
  );

  // Overall loading state
  const isLoading =
    isApprovePending ||
    isApproveConfirming ||
    isDepositPending ||
    isDepositConfirming;

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setError("Please enter a valid amount greater than 0");
      return false;
    }

    // Check if user has enough balance
    const userBalance = parseFloat(formattedBalance);
    if (numValue > userBalance) {
      setError(`Insufficient balance. You have ${formattedBalance} cUSD`);
      return false;
    }

    if (numValue > 100000) {
      setError("Maximum deposit amount is $100,000");
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
      // Check if approval will be needed for this amount
      checkApprovalNeeded(value);
    } else {
      setError("");
      setNeedsApproval(false);
    }
  };

  const handleQuickAmount = (quickAmount: number) => {
    const amountStr = quickAmount.toString();
    setAmount(amountStr);
    setError("");
    // Check if approval will be needed for this amount
    checkApprovalNeeded(amountStr);
  };

  // Check if approval is needed
  const checkApprovalNeeded = useCallback(
    async (amountToDeposit: string) => {
      try {
        await refetchAllowance();
        const amountWei = parseEther(amountToDeposit);
        const needed = allowance < amountWei;
        setNeedsApproval(needed);
        console.log("Approval check:", {
          amount: amountToDeposit,
          allowance: allowance.toString(),
          amountWei: amountWei.toString(),
          needsApproval: needed,
        });
      } catch (err) {
        console.error("Error checking approval:", err);
        setNeedsApproval(true);
      }
    },
    [allowance, refetchAllowance]
  );

  // Main deposit handler
  const handleDeposit = async () => {
    if (!validateAmount(amount) || !address) {
      return;
    }
  
    setError("");
  
    try {
      // Validate amount before proceeding
      if (!amount || parseFloat(amount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }
  
      // Check if approval is needed
      await checkApprovalNeeded(amount);
  
      if (needsApproval) {
        // Trigger approval with vault address as spender
        await approve(CONTRACT_ADDRESSES.YIELDMAKER_VAULT, amount);
        // Store pending deposit to trigger after approval
        setPendingDeposit({ amount, address });
      } else {
        // Proceed with deposit if approval is not needed
        await deposit(amount, address);
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setError(
        `Transaction failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  // Handle approval success - trigger deposit
  useEffect(() => {
    if (isApproveConfirmed && pendingDeposit) {
      console.log("Approval confirmed, proceeding with deposit");

      // Wait a moment for blockchain state to update, then deposit
      const timer = setTimeout(() => {
        deposit(pendingDeposit.amount, pendingDeposit.address);
        setPendingDeposit(null); // Clear pending state
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isApproveConfirmed, pendingDeposit, deposit]);

  // Handle deposit success
  useEffect(() => {
    if (isDepositConfirmed) {
      console.log("Deposit confirmed");
      setSuccess(true);
      refetchBalance();

      const timer = setTimeout(() => {
        onSuccess(parseFloat(amount));
        handleClose();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isDepositConfirmed, amount, onSuccess, refetchBalance]);

  // Handle errors
  useEffect(() => {
    if (approveError) {
      console.error("Approve error:", approveError);
      setError(`Approval failed: ${approveError.message}`);
      setPendingDeposit(null);
    }
    if (depositError) {
      console.error("Deposit error:", depositError);
      setError(`Deposit failed: ${depositError.message}`);
      setPendingDeposit(null);
    }
  }, [approveError, depositError]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened, resetting state");
      setError("");
      setSuccess(false);
      setNeedsApproval(false);
      setPendingDeposit(null);
      setAmount("");

      // Refresh allowance when modal opens
      if (address) {
        refetchAllowance();
        refetchBalance();
      }
    }
  }, [isOpen, address, refetchAllowance, refetchBalance]);

  const handleClose = () => {
    if (!isLoading) {
      setAmount("");
      setError("");
      setSuccess(false);
      setNeedsApproval(false);
      setPendingDeposit(null);
      onClose();
    }
  };

  const getStepMessage = () => {
    if (isApprovePending || isApproveConfirming) {
      return "Step 1: Approving token access...";
    }
    if (isDepositPending || isDepositConfirming) {
      return "Step 2: Depositing funds...";
    }
    return "Processing...";
  };

  const getButtonText = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {getStepMessage()}
        </div>
      );
    }

    // Show different button text based on approval status
    if (needsApproval) {
      return "Approve & Deposit";
    }

    return "Confirm Deposit";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💰</span>
            </div>
            Deposit Funds
          </DialogTitle>
          <DialogDescription>
            Add funds to your YieldMaker vault to start earning yield.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Balance */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Your cUSD Balance</p>
            <p className="text-lg font-semibold text-gray-900">
              ${parseFloat(formattedBalance).toLocaleString()}
            </p>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="deposit-amount">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                className="pl-8"
                disabled={isLoading}
                min="0"
                step="0.01"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick amounts</Label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount)}
                  disabled={isLoading}
                  className="text-xs"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount</span>
              <span className="font-medium">
                ${amount ? parseFloat(amount).toLocaleString() : "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Network Fee</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>
                ${amount ? parseFloat(amount).toLocaleString() : "0.00"}
              </span>
            </div>
          </div>

          {/* Success State */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">✓ Success</Badge>
                <span className="text-sm text-green-800">
                  Deposit successful! Your funds will be available shortly.
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
            onClick={handleDeposit}
            disabled={!amount || isLoading || !!error || !address}
            className="bg-green-600 hover:bg-green-700"
          >
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
