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

        // Add timeout to prevent blocking the app for too long
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("SDK initialization timeout")), 2000)
        );

        // Signal that the app is ready to display
        await Promise.race([
          sdk.actions.ready(),
          timeout,
        ]).catch(() => {
          // If timeout, continue anyway - app can work without Farcaster SDK
          console.log("Farcaster SDK initialization timed out, continuing...");
        });

        // Check if we're running inside Farcaster by examining the context
        // Use timeout here too
        let context;
        let isInFarcaster = false;
        
        try {
          context = await Promise.race([
            sdk.context,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Context timeout")), 1000)),
          ]) as any;
          isInFarcaster = context?.client?.platformType !== undefined;
        } catch {
          // If context check fails, assume we're not in Farcaster
          isInFarcaster = false;
        }

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
        }
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error);
        // Don't block the app - just mark as not ready but allow rendering
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: null, // Don't show error to user, just continue
          isReady: false,
          isInFarcaster: false,
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
