import { useState, useMemo } from "react";
import {
  mockInvestmentData,
  calculateTotalInvested,
  calculateTotalEarned,
  calculateAverageAPY,
} from "../types/investment";

export const useInvestmentData = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  // In the future, this could fetch real data from the blockchain
  const investmentData = mockInvestmentData;

  const filteredData = useMemo(() => {
    return selectedMonth === "all"
      ? investmentData
      : investmentData.filter((item) => item.month === selectedMonth);
  }, [investmentData, selectedMonth]);

  const statistics = useMemo(
    () => ({
      totalInvested: calculateTotalInvested(investmentData),
      totalEarned: calculateTotalEarned(investmentData),
      averageApy: calculateAverageAPY(investmentData),
      currentMonthData: investmentData[investmentData.length - 1],
      projectedEarnings:
        investmentData.length > 0
          ? ((investmentData[investmentData.length - 1]?.invested || 0) *
              0.082) /
            12
          : 0,
    }),
    [investmentData]
  );

  return {
    investmentData,
    filteredData,
    statistics,
    selectedMonth,
    setSelectedMonth,
    availableMonths: investmentData.map((item) => item.month),
  };
};
