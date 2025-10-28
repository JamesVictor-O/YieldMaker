import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export interface FarcasterSDKState {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  isInFarcaster: boolean;
}

export function useFarcasterSDK() {
  const [state, setState] = useState<FarcasterSDKState>({
    isReady: false,
    isLoading: true,
    error: null,
    isInFarcaster: false,
  });

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Signal that the app is ready to display
        await sdk.actions.ready();

        // Check if we're running inside Farcaster by examining the context
        const context = await sdk.context;
        const isInFarcaster = context?.client?.platformType !== undefined;

        setState({
          isReady: true,
          isLoading: false,
          error: null,
          isInFarcaster: isInFarcaster || false,
        });

        // Log context information for debugging
        if (isInFarcaster) {
          console.log("🚀 Running inside Farcaster MiniApp");
          console.log("Context:", context);
        } else {
          console.log("🌐 Running in regular browser");
          console.log("Context:", context);
        }
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
          isReady: false,
        }));
      }
    };

    initializeSDK();
  }, []);

  return {
    ...state,
    sdk,
  };
}
