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
  currentBalance,
}) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"input" | "approve" | "deposit" | "waiting">(
    "input"
  );
  const [needsApproval, setNeedsApproval] = useState(false);

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
  const {
    balance: userTokenBalance,
    formatted: formattedBalance,
    refetch: refetchBalance,
  } = useUserTokenBalance(CONTRACT_ADDRESSES.CUSD, address);

  // Check current allowance
  const {
    allowance,
    formatted: formattedAllowance,
    refetch: refetchAllowance,
  } = useTokenAllowance(
    CONTRACT_ADDRESSES.CUSD,
    address || "0x0",
    CONTRACT_ADDRESSES.YIELDMAKER_VAULT
  );

  const isLoading =
    isApprovePending ||
    isApproveConfirming ||
    isDepositPending ||
    isDepositConfirming ||
    step === "waiting";

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
    } else {
      setError("");
    }
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    setError("");
  };

  const checkApprovalNeeded = async (
    amountToDeposit: string
  ): Promise<boolean> => {
    try {
      await refetchAllowance();
      const amountWei = parseEther(amountToDeposit);
      return allowance < amountWei;
    } catch (err) {
      console.error("Error checking approval:", err);
      return true; // Assume approval needed if check fails
    }
  };

  const handleDeposit = async () => {
    if (!validateAmount(amount) || !address) {
      return;
    }

    setError("");

    try {
      // Check if approval is needed
      const approvalNeeded = await checkApprovalNeeded(amount);
      setNeedsApproval(approvalNeeded);

      if (approvalNeeded) {
        // Step 1: Approve tokens
        setStep("approve");
        await approve(CONTRACT_ADDRESSES.YIELDMAKER_VAULT, amount);
      } else {
        // Step 2: Deposit directly if already approved
        setStep("deposit");
        await deposit(amount, address);
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setError(
        `Transaction failed: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setStep("input");
    }
  };

  const handleActualDeposit = useCallback(async () => {
    if (!address || !amount) {
      console.error("Missing address or amount");
      return;
    }

    try {
      console.log(
        "Starting deposit for amount:",
        amount,
        "to address:",
        address
      );
      setStep("deposit");
      await deposit(amount, address);
    } catch (err) {
      console.error("Deposit error:", err);
      setError(
        `Deposit failed: ${err instanceof Error ? err.message : String(err)}`
      );
      setStep("input");
    }
  }, [address, amount, deposit]);

  // Handle approval confirmation
  useEffect(() => {
    console.log("Approval state:", { isApproveConfirmed, step, needsApproval });

    if (isApproveConfirmed && step === "approve" && needsApproval) {
      console.log("Approval confirmed, proceeding to deposit");
      setStep("waiting");

      // Wait for blockchain state to update, then proceed with deposit
      const timer = setTimeout(async () => {
        try {
          await refetchAllowance();
          await handleActualDeposit();
        } catch (err) {
          console.error("Error after approval:", err);
          setError("Failed to proceed after approval");
          setStep("input");
        }
      }, 2000); // Increased wait time

      return () => clearTimeout(timer);
    }
  }, [
    isApproveConfirmed,
    step,
    needsApproval,
    refetchAllowance,
    handleActualDeposit,
  ]);

  // Handle deposit confirmation
  useEffect(() => {
    console.log("Deposit state:", { isDepositConfirmed, step });

    if (isDepositConfirmed && (step === "deposit" || step === "waiting")) {
      console.log("Deposit confirmed");
      setSuccess(true);
      // Refresh balance data
      refetchBalance();

      const timer = setTimeout(() => {
        onSuccess(parseFloat(amount));
        handleClose();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isDepositConfirmed, step, amount, onSuccess, refetchBalance]);

  // Handle errors
  useEffect(() => {
    if (approveError) {
      console.error("Approve error:", approveError);
      setError(`Approval failed: ${approveError.message}`);
      setStep("input");
    }
    if (depositError) {
      console.error("Deposit error:", depositError);
      setError(`Deposit failed: ${depositError.message}`);
      setStep("input");
    }
  }, [approveError, depositError]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened, resetting state");
      setStep("input");
      setError("");
      setSuccess(false);
      setNeedsApproval(false);
      setAmount("");
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!isLoading) {
      setAmount("");
      setError("");
      setSuccess(false);
      setStep("input");
      setNeedsApproval(false);
      onClose();
    }
  };

  const getStepMessage = () => {
    switch (step) {
      case "approve":
        return "Approving token...";
      case "waiting":
        return "Waiting for approval confirmation...";
      case "deposit":
        return "Depositing...";
      default:
        return "Processing...";
    }
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

    if (step === "approve" || needsApproval) {
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
              <span className="text-white text-xs">📥</span>
            </div>
            Deposit Funds
          </DialogTitle>
          <DialogDescription>
            Add funds to your YieldMaker account to start earning yields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Balance & Step Indicator */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Vault Balance</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${currentBalance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">cUSD Balance</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formattedBalance} cUSD
                </p>
              </div>
            </div>

            {/* Step Indicator */}
            {step !== "input" && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    step === "approve" || step === "waiting"
                      ? "bg-yellow-500 animate-pulse"
                      : step === "deposit"
                      ? "bg-blue-500 animate-pulse"
                      : "bg-green-500"
                  }`}
                ></div>
                <span className="text-gray-600">{getStepMessage()}</span>
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="amount"
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
            <Label className="text-sm text-gray-500">Quick Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {[100, 500, 1000, 2500, 5000, 10000].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount)}
                  disabled={isLoading}
                  className="text-xs"
                >
                  ${quickAmount.toLocaleString()}
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
