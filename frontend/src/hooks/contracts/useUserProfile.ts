// Temporarily disabled until UserProfileRegistry contract is deployed
// import { useReadContract } from "wagmi";
// import { CONTRACT_ADDRESSES } from "@/contracts/addresses";

// Enum matching the contract
export enum RiskProfile {
  CONSERVATIVE = 0,
  MODERATE = 1,
  AGGRESSIVE = 2,
}

export interface UserProfile {
  riskProfile: RiskProfile;
  lastUpdated: number;
  isActive: boolean;
  experienceLevel: number; // 0=beginner, 1=intermediate, 2=advanced
}

// Hook to check if user has an active profile on-chain
export function useHasActiveProfile(userAddress?: string) {
  // Mock implementation until contract is deployed
  return {
    hasProfile: false,
    isLoading: false,
    error: null,
  };
}

// Hook to get user's risk profile from the blockchain
export function useUserRiskProfile(userAddress?: string) {
  // Mock implementation until contract is deployed
  return {
    riskProfile: undefined as RiskProfile | undefined,
    isLoading: false,
    error: null,
  };
}

// Hook to get complete user profile from the blockchain
export function useUserProfile(userAddress?: string) {
  // Mock implementation until contract is deployed
  return {
    profile: undefined as UserProfile | undefined,
    isLoading: false,
    error: null,
    refetch: async () => {},
  };
}

// Utility function to convert risk profile enum to string
export function riskProfileToString(riskProfile: RiskProfile): string {
  switch (riskProfile) {
    case RiskProfile.CONSERVATIVE:
      return "conservative";
    case RiskProfile.MODERATE:
      return "moderate";
    case RiskProfile.AGGRESSIVE:
      return "aggressive";
    default:
      return "unknown";
  }
}

// Utility function to convert experience level to string
export function experienceLevelToString(level: number): string {
  switch (level) {
    case 0:
      return "beginner";
    case 1:
      return "intermediate";
    case 2:
      return "advanced";
    default:
      return "unknown";
  }
}

// Utility function to determine if user should see certain strategies
export function getRecommendedStrategies(riskProfile: RiskProfile) {
  switch (riskProfile) {
    case RiskProfile.CONSERVATIVE:
      return ["aave", "compound"]; // Low-risk strategies
    case RiskProfile.MODERATE:
      return ["aave", "compound", "yearn"]; // Medium-risk strategies
    case RiskProfile.AGGRESSIVE:
      return ["aave", "compound", "yearn", "uniswap"]; // All strategies
    default:
      return ["aave"]; // Default to safest
  }
}
