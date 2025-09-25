import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther, isAddress } from "viem";
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
import { useVaultSend, useVaultBalance } from "@/hooks/contracts/useVault";

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  currentBalance: number;
}

const SendModal: React.FC<SendModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentBalance,
}) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { address } = useAccount();

  // Smart contract hooks
  const {
    send,
    isPending,
    isConfirming,
    isConfirmed,
    error: sendError,
  } = useVaultSend();
  const { balance: vaultBalance } = useVaultBalance();

  const isLoading = isPending || isConfirming;
  const vaultBalanceFormatted = vaultBalance
    ? formatEther(vaultBalance as bigint)
    : "0";

  const validateWalletAddress = (address: string): boolean => {
    if (!isAddress(address)) {
      setError("Please enter a valid wallet address");
      return false;
    }
    setError("");
    return true;
  };

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setError("Please enter a valid amount greater than 0");
      return false;
    }

    // Check against actual vault balance
    const maxSend = Math.min(currentBalance, parseFloat(vaultBalanceFormatted));
    if (numValue > maxSend) {
      setError(`Insufficient balance. Max send: ${maxSend.toFixed(4)}`);
      return false;
    }

    if (numValue > 25000) {
      setError("Maximum send amount is $25,000 per transaction");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipientAddress(value);
    if (value && amount) {
      validateWalletAddress(value);
      validateAmount(amount);
    } else {
      setError("");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value && recipientAddress) {
      validateAmount(value);
      validateWalletAddress(recipientAddress);
    } else {
      setError("");
    }
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    if (recipientAddress) {
      validateAmount(quickAmount.toString());
      validateWalletAddress(recipientAddress);
    }
  };

  const handleSend = async () => {
    if (
      !validateWalletAddress(recipientAddress) ||
      !validateAmount(amount) ||
      !address
    ) {
      return;
    }

    setError("");

    try {
      send(recipientAddress, amount);
    } catch (err) {
      setError(
        `Transfer failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  // Handle send confirmation
  useEffect(() => {
    if (isConfirmed) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess(parseFloat(amount));
        setRecipientAddress("");
        setAmount("");
        setSuccess(false);
      }, 1500);
    }
  }, [isConfirmed, amount, onSuccess]);

  // Handle errors
  useEffect(() => {
    if (sendError) {
      setError(`Transfer failed: ${sendError.message}`);
    }
  }, [sendError]);

  const handleClose = () => {
    if (!isLoading) {
      setRecipientAddress("");
      setAmount("");
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  const formatAddress = (address: string) => {
    if (address.length > 10) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg p-2 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💸</span>
            </div>
            Send Funds
          </DialogTitle>
          <DialogDescription>
            Send funds to another wallet address securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Balance */}
          <div className="bg-gray-50 rounded-lg p-3 text-center sm:text-left">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-lg font-semibold text-gray-900">
              ${currentBalance.toLocaleString()}
            </p>
          </div>

          {/* Recipient Address Input */}
          <div className="space-y-2">
            <Label htmlFor="recipient-address">Recipient Wallet Address</Label>
            <Input
              id="recipient-address"
              type="text"
              placeholder="0x..."
              value={recipientAddress}
              onChange={handleAddressChange}
              disabled={isLoading}
              className="font-mono text-sm w-full"
            />
            {recipientAddress && (
              <p className="text-xs text-gray-500">
                Recipient: {formatAddress(recipientAddress)}
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="send-amount">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="send-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                className="pl-8 w-full"
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
            <Label className="text-sm text-gray-500">Quick Amount</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[50, 100, 250, 500, 1000, 2500].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount)}
                  disabled={isLoading}
                  className="text-xs w-full"
                >
                  ${quickAmount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Recipient</span>
              <span className="font-mono text-xs">
                {recipientAddress
                  ? formatAddress(recipientAddress)
                  : "Not specified"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Send Amount</span>
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

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-sm">⚠️</span>
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Important:</p>
                <p>
                  Please double-check the recipient address. Transactions cannot
                  be reversed once confirmed.
                </p>
              </div>
            </div>
          </div>

          {/* Success State */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">✓ Success</Badge>
                <span className="text-sm text-green-800">
                  Transfer successful! Funds have been sent to the recipient.
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 w-full">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!recipientAddress || !amount || isLoading || !!error}
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "Confirm Send"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendModal;
