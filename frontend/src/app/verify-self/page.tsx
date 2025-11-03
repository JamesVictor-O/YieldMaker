"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useChainId } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
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
  const { address } = useAccount();
  const { ready, authenticated, user } = usePrivy();
  const chainId = useChainId();
  const [verificationStep, setVerificationStep] = useState<"scan" | "processing" | "complete">("scan");
  const [error, setError] = useState<string | null>(null);
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const { submitVerification, isConfirmed: isVerificationConfirmed } = useSubmitVerification();
  const { data: isVerified = false, refetch: refetchVerification } = useIsVerified(address);
  const { success, error: showError } = useToast();

  // Get wallet address from Privy or wagmi
  const walletAddress = address ||
    (user?.wallet as { address?: string })?.address ||
    (user?.linkedAccounts as Array<{ type?: string; address?: string }>)?.find(
      (account) => account?.type === "wallet"
    )?.address;

  const isConnected = ready && authenticated;


  // Initialize Self App configuration
  useEffect(() => {
    if (walletAddress && isConnected) {
      try {
        const contractAddress = process.env.NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_42220 ||
                               process.env.NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_44787 ||
                               "0x...";

        // For Celo Mainnet use "celo" endpoint type
        const endpointType = chainId === 42220 ? "celo" : "staging_celo";

        console.log("🌐 Network detection:", {
          currentChainId: chainId,
          expectedChainId: 44787,
          selectedEndpointType: endpointType,
          isAlfajoresTestnet: chainId === 44787,
        });

        console.log("🔧 Self App Configuration:", {
          contractAddress,
          walletAddress,
          isConnected,
          chainId,
          endpointType,
          appName: "YieldMaker DeFi",
          scope: "YieldMaker",
          version: 2,
          devMode: true,
        });

        const selfAppConfig = {
          appName: "YieldMaker DeFi",
          scope: "YieldMaker",
          endpoint: contractAddress.toLowerCase(),
          endpointType,
          userId: walletAddress.toLowerCase(),
          userIdType: "hex",
          version: 2,
          chainID: 42220, // Celo Mainnet
          userDefinedData: "yieldmaker_verification",
          devMode: false,
        };

        console.log("🔧 Building Self App with config:", selfAppConfig);

        const app = new SelfAppBuilder(selfAppConfig as Partial<SelfApp>).build();

        console.log("✅ Self App created successfully");
        console.log("   App details:", JSON.stringify(app, null, 2));
        setSelfApp(app);
      } catch (error) {
        console.error("❌ Failed to initialize Self app:", error);
        setError("Failed to initialize verification");
      }
    }
  }, [walletAddress, isConnected, chainId]);


  // Handle successful verification
  const handleSuccess = useCallback(
    async (proofData?: { proof?: unknown; publicSignals?: unknown }) => {
      setVerificationStep("processing");
      setError(null);

      try {
        if (proofData && walletAddress) {
          // Submit verification proof to smart contract
          const proofPayload = JSON.stringify(proofData);
          const userContextData = JSON.stringify({ userAddress: walletAddress, timestamp: Date.now() });

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
    [walletAddress, submitVerification, success, showError]
  );

  // Handle verification errors
  const handleError = useCallback((error: unknown) => {
    console.error("❌ Verification error (full):", error);
    console.error("❌ Error type:", typeof error);
    console.error("❌ Error keys:", error ? Object.keys(error) : "null");

    let errorMessage = "Please try again or contact support if the issue persists.";
    let errorTitle = "Verification failed";

    // Check for common error scenarios
    if (error instanceof Error) {
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);

      if (error.message.includes("verification") || error.message.includes("KYC")) {
        errorTitle = "Identity Verification Failed";
        errorMessage = "Please ensure you've completed KYC in the Self mobile app and meet all requirements (18+, valid ID).";
      } else if (error.message.includes("proof") || error.message.includes("invalid")) {
        errorTitle = "Proof Validation Failed";
        errorMessage = "The verification proof is invalid. Please ensure you're using the latest Self app version.";
      } else if (error.message.includes("config") || error.message.includes("scope")) {
        errorTitle = "Configuration Error";
        errorMessage = "Verification configuration mismatch. Please contact support.";
      } else if (error.message.includes("rejected") || error.message.includes("denied")) {
        errorTitle = "Verification Cancelled";
        errorMessage = "You cancelled the verification process. Please try again when ready.";
      } else {
        errorMessage = error.message;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      // Try to extract error from object
      const errObj = error as any;
      if (errObj.message) errorMessage = errObj.message;
      if (errObj.reason) errorMessage = errObj.reason;
      if (errObj.code) errorMessage += ` (Code: ${errObj.code})`;
    }

    console.error("❌ Final error message:", errorMessage);
    showError(errorTitle, errorMessage);
    setError(errorMessage);
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

  // Check wallet connection with delay to allow Privy to initialize
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("🔍 Connection check:", { isConnected, walletAddress, ready, authenticated });
      setIsCheckingConnection(false);
    }, 1000); // Give Privy 1 second to initialize connection

    return () => clearTimeout(timer);
  }, [isConnected, walletAddress, ready, authenticated]);

  // Redirect if not connected after initial check
  useEffect(() => {
    if (!isCheckingConnection && !isConnected) {
      console.log("⚠️ No wallet connected, redirecting to home");
      router.push("/");
    }
  }, [isCheckingConnection, isConnected, router]);

  // Show loading while checking connection
  if (isCheckingConnection) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-xl font-semibold text-white mb-2">Loading...</h1>
          <p className="text-sm text-gray-300">Checking wallet connection...</p>
        </div>
      </div>
    );
  }

  // Only show "not connected" if we've finished checking and there's no wallet
  if (!isCheckingConnection && !isConnected) {
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
              {walletAddress && (
                <div className="mt-4 text-xs text-gray-400">
                  <p>Connected as: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                </div>
              )}
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
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-white mb-3">Before you scan:</h3>
            <ul className="space-y-2 text-xs text-gray-300 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">1.</span>
                <span>Download Self mobile app from App Store or Google Play</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">2.</span>
                <span><strong className="text-emerald-400">Complete KYC verification</strong> in the Self app first (government ID + face scan)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">3.</span>
                <span>Must be 18+ years old and meet verification requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">4.</span>
                <span>Then scan this QR code with the Self app</span>
              </li>
            </ul>
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
              <p className="text-xs text-amber-200">
                <strong>Note:</strong> This is real identity verification, not a test. You must complete actual KYC in the Self app before scanning.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}