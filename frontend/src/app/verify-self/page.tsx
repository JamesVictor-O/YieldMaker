"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { SelfQRcodeWrapper, SelfAppBuilder } from "@selfxyz/qrcode";
import { useSubmitVerification } from "@/hooks/use-verification";
import { Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function VerifySelfPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [verificationStep, setVerificationStep] = useState<"scan" | "processing" | "complete">("scan");
  const [error, setError] = useState<string | null>(null);
  const { submitVerification, isPending, isConfirmed } = useSubmitVerification();

  // Validate hex address format
  const isValidHexAddress = (value?: string | null) =>
    !!value && /^0x[0-9a-fA-F]{40}$/.test(value);

  // Build Self App configuration
  const selfApp = useMemo(() => {
    if (!isValidHexAddress(address)) return undefined;

    try {
      // CRITICAL FIX: Use your contract address as endpoint, not an API URL
      const contractAddress = process.env.NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS || "0x...";
      
      return new SelfAppBuilder({
        appName: "YieldMaker",
        scope: "YieldMaker", // Clear scope identifier, not from env
        endpoint: contractAddress.toLowerCase(), // Contract address, not API endpoint
        endpointType: "celo", // Blockchain network (celo, ethereum, polygon, etc.)
        userId: address,
        userIdType: "hex",
        version: 2,
        userDefinedData: "yieldmaker_verification",
        disclosures: {
          minimumAge: 18,
          ofac: true, // Changed to true for better compliance
          excludedCountries: [], // Required array
        },
        devMode: false, // Set to true for testing, false for production
      }).build();
    } catch (err) {
      console.error("Failed to build Self app:", err);
      setError("Failed to initialize verification");
      return undefined;
    }
  }, [address]);

  // Convert string to hex for blockchain data
  const stringToHex = (s: string) =>
    "0x" + Array.from(new TextEncoder().encode(s))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  // Handle successful verification
  const handleSuccess = useCallback(
    async (proofData?: any) => {
      setVerificationStep("processing");
      setError(null);

      try {
        if (proofData && address) {
          // Submit verification directly on-chain
          await new Promise((resolve) => setTimeout(resolve, 200));
          submitVerification({
            proofPayload: stringToHex(JSON.stringify(proofData)),
            userContextData: stringToHex(
              JSON.stringify({ userAddress: address, timestamp: Date.now() })
            ),
          });
        }

        // Update local storage
        if (address) {
          const key = `onboarding_${address}`;
          try {
            const raw = localStorage.getItem(key);
            const parsed = raw ? JSON.parse(raw) : {};
            const updated = {
              ...parsed,
              selfVerified: true,
              hasCompletedOnboarding: true,
              verifiedAt: Date.now(),
            };
            localStorage.setItem(key, JSON.stringify(updated));
          } catch (storageError) {
            console.error("Local storage error:", storageError);
          }
        }

         setVerificationStep("complete");
        
        // Redirect after brief success display
         setTimeout(() => {
           router.push("/dashboard");
         }, 2000);
      } catch (e: any) {
        console.error("Verification error:", e);
        setError(e.message || "Verification failed. Please try again.");
        setVerificationStep("scan");
      }
    },
    [address, router]
  );

  // Handle verification errors
  const handleError = useCallback((error: any) => {
    console.error("Self verification error:", error);
    setError("Verification failed. Please try again.");
    setVerificationStep("scan");
  }, []);

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
          <p className="text-sm text-gray-300">Please connect your wallet to continue.</p>
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
              <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
            </div>
          ) : selfApp ? (
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <SelfQRcodeWrapper
                  selfApp={selfApp}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  darkMode={true}
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
            <h3 className="text-sm font-semibold text-white mb-3">What you'll need:</h3>
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