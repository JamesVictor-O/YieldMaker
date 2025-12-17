"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useChainId } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { SelfAppBuilder, SelfApp } from "@selfxyz/qrcode";
import dynamic from "next/dynamic";
const SelfQRcodeWrapper = dynamic(
  () =>
    import("@selfxyz/qrcode").then((mod) => ({
      default: mod.SelfQRcodeWrapper,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-64 h-64 bg-gray-800 rounded-lg flex items-center justify-center">
        Loading QR Code...
      </div>
    ),
  }
);
import { useSubmitVerification, useIsVerified } from "@/hooks/use-verification";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Home,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function VerifySelfPage() {
  const router = useRouter();
  const { address } = useAccount();
  const { ready, authenticated, user } = usePrivy();
  const chainId = useChainId();
  const [verificationStep, setVerificationStep] = useState<
    "scan" | "processing" | "complete"
  >("scan");
  const [error, setError] = useState<string | null>(null);
  const [qrSize, setQrSize] = useState<number>(240);
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const { submitVerification, isConfirmed: isVerificationConfirmed } =
    useSubmitVerification();
  const { data: isVerified = false, refetch: refetchVerification } =
    useIsVerified(address);
  const { success, error: showError } = useToast();
  const walletAddress =
    address ||
    (user?.wallet as { address?: string })?.address ||
    (user?.linkedAccounts as Array<{ type?: string; address?: string }>)?.find(
      (account) => account?.type === "wallet"
    )?.address;

  const isConnected = ready && authenticated;
  useEffect(() => {
    const computeSize = () => {
      if (typeof window === "undefined") return 240;
      const w = window.innerWidth;
      if (w < 360) return 200;
      if (w < 640) return 220;
      if (w < 768) return 240;
      if (w < 1024) return 280;
      return 300;
    };
    const update = () => setQrSize(computeSize());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (walletAddress && isConnected) {
      try {
        const contractAddr =
          chainId === 42220
            ? process.env.NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_42220 || ""
            : process.env.NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_44787 || "";

        if (!contractAddr || contractAddr === "0x..." || contractAddr === "") {
          setError(
            `Contract address not configured for chain ${chainId}. Please set NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_${chainId} in your environment.`
          );
          return;
        }

        const normalizedEndpoint = contractAddr.toLowerCase();

        if (
          !normalizedEndpoint.startsWith("0x") ||
          normalizedEndpoint.length !== 42
        ) {
          setError("Invalid contract address format");
          return;
        }

        const selfAppConfig = {
          appName: "YieldMaker DeFi",
          scope: "YieldMaker",
          endpoint: normalizedEndpoint,
          endpointType: chainId === 42220 ? "celo" : "celo-staging",
          userId: walletAddress.toLowerCase(),
          userIdType: "hex",
          version: 2,
          userDefinedData: "yieldmaker_verification",
          chainID: chainId,
          devMode: false,
        };

        const app = new SelfAppBuilder(
          selfAppConfig as Partial<SelfApp>
        ).build();
        setSelfApp(app);
      } catch {
        setError("Failed to initialize verification");
      }
    }
  }, [walletAddress, isConnected, chainId]);

  const handleSuccess = useCallback(
    async (proofData?: { proof?: unknown; publicSignals?: unknown }) => {
      setVerificationStep("processing");
      setError(null);
      try {
        if (proofData && walletAddress) {
          const proofPayload = JSON.stringify(proofData);
          const userContextData = JSON.stringify({
            userAddress: walletAddress,
            timestamp: Date.now(),
          });
          submitVerification({
            proofPayload: `0x${Buffer.from(proofPayload).toString("hex")}`,
            userContextData: `0x${Buffer.from(userContextData).toString(
              "hex"
            )}`,
          });
          success(
            "Verification submitted!",
            "Your proof has been submitted to the blockchain for verification."
          );
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setVerificationStep("complete");
          success(
            "Verification completed!",
            "You are now a verified user with access to premium features."
          );
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to submit verification proof.";
        showError("Verification failed", errorMessage);
        setVerificationStep("scan");
      }
    },
    [walletAddress, submitVerification, success, showError]
  );

  const handleError = useCallback(
    (error: unknown) => {
      let errorMessage =
        "Please try again or contact support if the issue persists.";
      let errorTitle = "Verification failed";

      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();

        if (
          errorMsg.includes("scopemismatch") ||
          errorMsg.includes("scope mismatch")
        ) {
          errorTitle = "Scope Mismatch Error";
          errorMessage =
            "The scope value doesn't match between frontend and contract. Please contact support.";
        } else if (
          errorMsg.includes("-32000") ||
          errorMsg.includes("execution reverted")
        ) {
          errorTitle = "Transaction Reverted";
          errorMessage =
            "The verification transaction was rejected. Please ensure you're using a real passport on mainnet.";
        } else if (
          errorMsg.includes("invalid 'to' address") ||
          errorMsg.includes("invalid to address")
        ) {
          errorTitle = "Invalid Endpoint";
          errorMessage = "Configuration error. Please contact support.";
        } else if (errorMsg.includes("invalididentitycommitmentroot")) {
          errorTitle = "Identity Root Mismatch";
          errorMessage =
            "Mock passports only work on testnet. Please use a real passport for mainnet verification.";
        } else if (
          errorMsg.includes("verification") ||
          errorMsg.includes("kyc")
        ) {
          errorTitle = "Identity Verification Failed";
          errorMessage =
            "Please ensure you've completed KYC in the Self mobile app and meet all requirements (18+, valid ID).";
        } else if (errorMsg.includes("proof") || errorMsg.includes("invalid")) {
          errorTitle = "Proof Validation Failed";
          errorMessage =
            "The verification proof is invalid. Please ensure you're using the latest Self app version.";
        } else if (
          errorMsg.includes("rejected") ||
          errorMsg.includes("denied")
        ) {
          errorTitle = "Verification Cancelled";
          errorMessage =
            "You cancelled the verification process. Please try again when ready.";
        } else {
          errorMessage = error.message;
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        const maybeMessage = (error as { message?: unknown }).message;
        const maybeReason = (error as { reason?: unknown }).reason;
        const maybeCode = (error as { code?: unknown }).code;
        if (typeof maybeMessage === "string") errorMessage = maybeMessage;
        if (typeof maybeReason === "string") errorMessage = maybeReason;
        if (typeof maybeCode === "string" || typeof maybeCode === "number") {
          errorMessage += ` (Code: ${maybeCode})`;
        }
      }

      showError(errorTitle, errorMessage);
      setError(errorMessage);
      setVerificationStep("scan");
    },
    [showError]
  );
  useEffect(() => {
    if (isVerificationConfirmed) {
      setVerificationStep("complete");
      refetchVerification();
      success(
        "Verification complete!",
        "You are now a verified user with access to premium features."
      );
    }
  }, [isVerificationConfirmed, refetchVerification, success]);
  useEffect(() => {
    if (isVerified && verificationStep !== "complete") {
      setVerificationStep("complete");
    }
  }, [isVerified, verificationStep]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingConnection(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isCheckingConnection && !isConnected) {
      router.push("/");
    }
  }, [isCheckingConnection, isConnected, router]);

  // Show loading while checking connection
  if (isCheckingConnection) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md md:max-w-lg w-full text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Loading...
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Checking wallet connection...
          </p>
        </div>
      </div>
    );
  }

  // Only show "not connected" if we've finished checking and there's no wallet
  if (!isCheckingConnection && !isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md md:max-w-lg w-full text-center">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Wallet Not Connected
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mb-6">
            Please connect your wallet to continue.
          </p>
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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gray-950">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md md:max-w-lg w-full text-white">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
            {verificationStep === "complete" ? (
              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            ) : verificationStep === "processing" ? (
              <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-spin" />
            ) : (
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            )}
          </div>

          <h1 className="text-lg sm:text-xl font-semibold mb-1">
            {verificationStep === "complete"
              ? "Verification Complete!"
              : verificationStep === "processing"
              ? "Processing..."
              : "Verify with Self"}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300">
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
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500 mx-auto mb-3 animate-spin" />
              <p className="text-xs sm:text-sm text-gray-400">
                Verifying your identity...
              </p>
            </div>
          ) : verificationStep === "complete" ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-green-500 mx-auto mb-3" />
              <p className="text-xs sm:text-sm text-gray-400 mb-3">
                Verification Complete!
              </p>
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
                  size={qrSize}
                />
              </div>
              {walletAddress && (
                <div className="mt-4 text-xs text-gray-400">
                  <p>
                    Connected as: {walletAddress.slice(0, 6)}...
                    {walletAddress.slice(-4)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mx-auto mb-3" />
              <p className="text-xs sm:text-sm text-gray-400">
                Initializing verification system...
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        {verificationStep === "scan" && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-white mb-3">
              Before you scan:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">1.</span>
                <span>
                  Download Self mobile app from App Store or Google Play
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">2.</span>
                <span>
                  <strong className="text-emerald-400">
                    Complete KYC verification
                  </strong>{" "}
                  in the Self app first (government ID + face scan)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">3.</span>
                <span>
                  Must be 18+ years old and meet verification requirements
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">4.</span>
                <span>Then scan this QR code with the Self app</span>
              </li>
            </ul>
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
              <p className="text-xs sm:text-sm text-amber-200">
                <strong>Note:</strong> This is real identity verification, not a
                test. You must complete actual KYC in the Self app before
                scanning.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
