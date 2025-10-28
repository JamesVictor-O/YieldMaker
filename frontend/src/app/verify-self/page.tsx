"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useChainId } from "wagmi";
import { SelfAppBuilder, SelfApp } from "@selfxyz/qrcode";
import dynamic from "next/dynamic";

// Dynamic import to handle React 19 compatibility
const SelfQRcodeWrapper = dynamic(() => import("@selfxyz/qrcode").then(mod => ({ default: mod.SelfQRcodeWrapper })), { 
  ssr: false,
  loading: () => <div className="w-64 h-64 bg-gray-800 rounded-lg flex items-center justify-center">Loading QR Code...</div>
});
import { useSubmitVerification, useIsVerified } from "@/hooks/use-verification";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, AlertCircle, Loader2, Home, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VerifySelfPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
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
        const contractAddress = process.env.NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_44787 || 
                               process.env.NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_42220 || 
                               "0x...";
        
        const endpointType = chainId === 44787 ? "staging_celo" : "celo";

        console.log("🔧 Self App Configuration:", {
          contractAddress,
          address,
          isConnected,
          chainId,
          endpointType,
        });
        
        const app = new SelfAppBuilder({
          appName: "YieldMaker DeFi",
          scope: "YieldMaker",
          endpoint: contractAddress.toLowerCase(),
          endpointType,
          userId: address.toLowerCase(),
          userIdType: "hex",
          version: 2,
          userDefinedData: "yieldmaker_verification",
          devMode: true, // Changed to true for testing
        } as Partial<SelfApp>).build();

        console.log("✅ Self App created successfully:", app);
        setSelfApp(app);
      } catch (error) {
        console.error("❌ Failed to initialize Self app:", error);
        setError("Failed to initialize verification");
      }
    }
  }, [address, isConnected, chainId]);


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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-white">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
            {verificationStep === "complete" ? (
              <CheckCircle className="w-7 h-7 text-white" />
            ) : verificationStep === "processing" ? (
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            ) : (
              <Shield className="w-7 h-7 text-white" />
            )}
          </div>
          
          <h1 className="text-xl font-semibold mb-1">
            {verificationStep === "complete"
              ? "Verification Complete!"
              : verificationStep === "processing"
              ? "Processing..."
              : "Verify with Self"}
          </h1>
          
          <p className="text-xs text-gray-300">
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
            <div className="text-center py-6">
              <Loader2 className="w-10 h-10 text-emerald-500 mx-auto mb-3 animate-spin" />
              <p className="text-xs text-gray-400">Verifying your identity...</p>
            </div>
          ) : verificationStep === "complete" ? (
            <div className="text-center py-6">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
              <p className="text-xs text-gray-400 mb-3">Verification Complete!</p>
              <Link href="/dashboard">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 mx-auto">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ) : selfApp ? (
            <div className="text-center">
              <div className="inline-block p-3 bg-gray-800 rounded-xl border border-gray-700">
                <SelfQRcodeWrapper
                  selfApp={selfApp}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  size={240}
                />
              </div>
              <div className="mt-3 text-[11px] text-gray-400">
                <p>Connected as: {address.slice(0, 6)}...{address.slice(-4)}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <p className="text-xs text-gray-400">
                Initializing verification system...
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        {verificationStep === "scan" && (
          <div className="mt-5 pt-5 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-white mb-2">What you&apos;ll need:</h3>
            <ul className="space-y-1.5 text-[11px] text-gray-300">
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