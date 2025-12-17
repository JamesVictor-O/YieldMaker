"use client";

import React from "react";
import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";

interface FarcasterSDKProviderProps {
  children: React.ReactNode;
}

export default function FarcasterSDKProvider({
  children,
}: FarcasterSDKProviderProps) {
  const { isReady, isLoading, error, isInFarcaster } = useFarcasterSDK();

  // Don't block the app - render immediately and initialize in background
  // Only show loading for a very short time (max 500ms) to avoid bad UX
  const [showBriefLoading, setShowBriefLoading] = React.useState(true);

  React.useEffect(() => {
    // Hide loading screen after max 500ms, even if SDK is still initializing
    const timer = setTimeout(() => {
      setShowBriefLoading(false);
    }, 500);

    // If SDK finishes before timeout, hide loading immediately
    if (!isLoading) {
      clearTimeout(timer);
      setShowBriefLoading(false);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Show brief loading screen only for first 500ms
  if (showBriefLoading && isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Always render the app - don't block on SDK initialization
  // SDK will initialize in the background
  return <>{children}</>;
}
