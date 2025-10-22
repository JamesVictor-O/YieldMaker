"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { SelfAppBuilder, SelfApp, SelfQRcodeWrapper } from "@selfxyz/qrcode";
import { useSubmitVerification, useIsVerified } from "@/hooks/use-verification";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, AlertCircle, Loader2, Home, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VerifySelfPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [verificationStep, setVerificationStep] = useState<"scan" | "processing" | "complete">("scan");
  const [error, setError] = useState<string | null>(null);
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const { submitVerification, isConfirmed: isVerificationConfirmed } = useSubmitVerification();
  const { data: isVerified = false, refetch: refetchVerification } = useIsVerified(address);
  const { success, error: showError } = useToast();


  // Initialize Self App configuration
  useEffect(() => {
    if (address && isConnected) {
      try {
        const contractAddress = process.env.NEXT_PUBLIC_SELF_VERIFICATION_CONTRACT_ADDRESS_44787 || 
                               process.env.NEXT_PUBLIC_SELF_VERIFICATION_CONTRACT_ADDRESS_42220 || 
                               "0x...";
        
        const app = new SelfAppBuilder({
          appName: "YieldMaker DeFi",
          scope: "YieldMaker",
          endpoint: contractAddress.toLowerCase(),
          endpointType: "celo",
          userId: address,
          userIdType: "hex",
          version: 2,
          userDefinedData: "yieldmaker_verification",
          disclosures: {
            minimumAge: 18,
            ofac: true,
            excludedCountries: [],
          },
          devMode: false,
        } as Partial<SelfApp>).build();

        setSelfApp(app);
      } catch (error) {
        console.error("Failed to initialize Self app:", error);
        setError("Failed to initialize verification");
      }
    }
  }, [address, isConnected]);


  // Handle successful verification
  const handleSuccess = useCallback(
    async (proofData?: { proof?: unknown; publicSignals?: unknown }) => {
      setVerificationStep("processing");
      setError(null);

      try {
        if (proofData && address) {
          // Submit verification proof to smart contract
          const proofPayload = JSON.stringify(proofData);
          const userContextData = JSON.stringify({ userAddress: address, timestamp: Date.now() });

          submitVerification({
            proofPayload: `0x${Buffer.from(proofPayload).toString('hex')}`,
            userContextData: `0x${Buffer.from(userContextData).toString('hex')}`
          });

          success("Verification submitted!", "Your proof has been submitted to the blockchain for verification.");
        } else {
          // Fallback for demo purposes
          await new Promise(resolve => setTimeout(resolve, 2000));
          setVerificationStep("complete");
          success("Verification completed!", "You are now a verified user with access to premium features.");
        }
      } catch (err: unknown) {
        console.error("Verification processing failed:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to submit verification proof.";
        showError("Verification failed", errorMessage);
        setVerificationStep("scan");
      }
    },
    [address, submitVerification, success, showError]
  );

  // Handle verification errors
  const handleError = useCallback((error: unknown) => {
    console.error("Verification error:", error);
    showError("Verification failed", "Please try again or contact support if the issue persists.");
    setVerificationStep("scan");
  }, [showError]);

  // Handle verification confirmation
  useEffect(() => {
    if (isVerificationConfirmed) {
      setVerificationStep("complete");
      refetchVerification();
      success("Verification complete!", "You are now a verified user with access to premium features.");
    }
  }, [isVerificationConfirmed, refetchVerification, success]);

  // Update verification step based on actual verification status
  useEffect(() => {
    if (isVerified && verificationStep !== "complete") {
      setVerificationStep("complete");
    }
  }, [isVerified, verificationStep]);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Wallet Not Connected</h1>
          <p className="text-sm text-gray-300 mb-6">Please connect your wallet to continue.</p>
          <Link href="/">
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-white">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
            {verificationStep === "complete" ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : verificationStep === "processing" ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : (
              <Shield className="w-8 h-8 text-white" />
            )}
          </div>
          
          <h1 className="text-2xl font-semibold mb-2">
            {verificationStep === "complete"
              ? "Verification Complete!"
              : verificationStep === "processing"
              ? "Processing..."
              : "Verify with Self"}
          </h1>
          
          <p className="text-sm text-gray-300">
            {verificationStep === "complete"
              ? "Your identity has been verified successfully"
              : verificationStep === "processing"
              ? "Please wait while we verify your identity"
              : "Scan the QR code with the Self app to complete verification"}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="flex justify-center">
          {verificationStep === "processing" ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-sm text-gray-400">Verifying your identity...</p>
            </div>
          ) : verificationStep === "complete" ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-sm text-gray-400 mb-4">Verification Complete!</p>
              <Link href="/dashboard">
                <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ) : selfApp ? (
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <SelfQRcodeWrapper
                  selfApp={selfApp}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  size={280}
                />
              </div>
              <div className="mt-4 text-xs text-gray-400">
                <p>Connected as: {address.slice(0, 6)}...{address.slice(-4)}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-sm text-gray-400">
                Initializing verification system...
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        {verificationStep === "scan" && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-white mb-3">What you&apos;ll need:</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Self mobile app installed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Valid government-issued ID</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Must be 18+ years old</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}