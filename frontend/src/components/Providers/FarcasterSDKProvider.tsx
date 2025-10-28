"use client";

import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";

interface FarcasterSDKProviderProps {
  children: React.ReactNode;
}

export default function FarcasterSDKProvider({
  children,
}: FarcasterSDKProviderProps) {
  const { isReady, isLoading, error, isInFarcaster } = useFarcasterSDK();

  // Show loading screen while SDK initializes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing YieldMaker...</p>
        </div>
      </div>
    );
  }

  // Show error screen if SDK initialization failed
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Initialization Error
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render the app once SDK is ready
  return <>{children}</>;
}
