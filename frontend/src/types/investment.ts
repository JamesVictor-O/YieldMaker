export interface InvestmentData {
  month: string;
  invested: number;
  earned: number;
  apy: number;
  protocol: string;
  status: "active" | "completed" | "pending";
}

// Mock investment data - in a real app this would come from the blockchain
export const mockInvestmentData: InvestmentData[] = [
  {
    month: "January 2024",
    invested: 5000,
    earned: 245.5,
    apy: 8.2,
    protocol: "Aave USDC",
    status: "active",
  },
  {
    month: "February 2024",
    invested: 7500,
    earned: 412.3,
    apy: 8.2,
    protocol: "Aave USDC",
    status: "active",
  },
  {
    month: "March 2024",
    invested: 10000,
    earned: 589.75,
    apy: 8.2,
    protocol: "Aave USDC",
    status: "active",
  },
  {
    month: "April 2024",
    invested: 12000,
    earned: 720.4,
    apy: 8.2,
    protocol: "Aave USDC",
    status: "active",
  },
  {
    month: "May 2024",
    invested: 15000,
    earned: 892.15,
    apy: 8.2,
    protocol: "Aave USDC",
    status: "active",
  },
  {
    month: "June 2024",
    invested: 18000,
    earned: 1085.6,
    apy: 8.2,
    protocol: "Aave USDC",
    status: "active",
  },
];

// Helper functions for investment calculations
export const calculateTotalInvested = (data: InvestmentData[]): number => {
  return data.reduce((sum, item) => sum + item.invested, 0);
};

export const calculateTotalEarned = (data: InvestmentData[]): number => {
  return data.reduce((sum, item) => sum + item.earned, 0);
};

export const calculateAverageAPY = (data: InvestmentData[]): number => {
  if (data.length === 0) return 0;
  return data.reduce((sum, item) => sum + item.apy, 0) / data.length;
};

export const getStatusColor = (status: InvestmentData["status"]): string => {
  switch (status) {
    case "active":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "completed":
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
  }
};
