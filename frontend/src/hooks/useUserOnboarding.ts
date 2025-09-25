import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getUserProfile } from "../utils/api";
import { useHasActiveProfile } from "./contracts/useUserProfile";

interface OnboardingStatus {
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
  riskProfile?: "conservative" | "moderate" | "aggressive";
  isLoading: boolean;
  error?: string;
  markOnboardingComplete: (
    riskProfile: "conservative" | "moderate" | "aggressive"
  ) => void;
  resetOnboarding: () => void;
}

export const useUserOnboarding = (): OnboardingStatus => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [onboardingData, setOnboardingData] = useState<{
    hasCompletedOnboarding: boolean;
    riskProfile?: "conservative" | "moderate" | "aggressive";
  }>({
    hasCompletedOnboarding: false,
  });

  // Check if user has profile on-chain (optional)
  const { hasProfile: hasOnChainProfile, isLoading: isCheckingChain } =
    useHasActiveProfile(address);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(undefined);

        // 1. Check local storage first (fastest)
        const localStorageKey = `onboarding_${address}`;
        const localData = localStorage.getItem(localStorageKey);

        if (localData) {
          const parsed = JSON.parse(localData);
          setOnboardingData(parsed);
          setIsLoading(false);
          return;
        }

        // 2. Check backend for user profile
        try {
          const userProfile = await getUserProfile(address);

          if (userProfile && userProfile.riskProfile) {
            const onboardingStatus = {
              hasCompletedOnboarding: true,
              riskProfile: userProfile.riskProfile,
            };

            // Cache in local storage
            localStorage.setItem(
              localStorageKey,
              JSON.stringify(onboardingStatus)
            );
            setOnboardingData(onboardingStatus);
            setIsLoading(false);
            return;
          }
        } catch (backendError) {
          console.log("Backend profile not found, checking other sources...");
        }

        // 3. If no backend data, user is new
        setOnboardingData({
          hasCompletedOnboarding: false,
        });
      } catch (err) {
        console.error("Error checking onboarding status:", err);
        setError("Failed to load user profile");
        // Default to new user if there's an error
        setOnboardingData({
          hasCompletedOnboarding: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [address]);

  // Function to mark onboarding as complete
  const markOnboardingComplete = (
    riskProfile: "conservative" | "moderate" | "aggressive"
  ) => {
    if (!address) return;

    const onboardingStatus = {
      hasCompletedOnboarding: true,
      riskProfile,
    };

    // Update state
    setOnboardingData(onboardingStatus);

    // Cache in local storage
    const localStorageKey = `onboarding_${address}`;
    localStorage.setItem(localStorageKey, JSON.stringify(onboardingStatus));
  };

  // Function to reset onboarding (for testing or user request)
  const resetOnboarding = () => {
    if (!address) return;

    const localStorageKey = `onboarding_${address}`;
    localStorage.removeItem(localStorageKey);

    setOnboardingData({
      hasCompletedOnboarding: false,
    });
  };

  return {
    isNewUser: !onboardingData.hasCompletedOnboarding,
    hasCompletedOnboarding: onboardingData.hasCompletedOnboarding,
    riskProfile: onboardingData.riskProfile,
    isLoading: isLoading || isCheckingChain,
    error,
    markOnboardingComplete,
    resetOnboarding,
  };
};
