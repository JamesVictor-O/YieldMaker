import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function getRiskColor(risk: "low" | "medium" | "high"): string {
  switch (risk) {
    case "low":
      return "text-green-600 bg-green-100";
    case "medium":
      return "text-yellow-600 bg-yellow-100";
    case "high":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}

export function getRiskLevel(apy: number): "low" | "medium" | "high" {
  if (apy <= 8) return "low";
  if (apy <= 15) return "medium";
  return "high";
}

export function calculateAPY(
  principal: number,
  earnings: number,
  timeInDays: number
): number {
  if (principal === 0 || timeInDays === 0) return 0;
  return (earnings / principal) * (365 / timeInDays) * 100;
}

export function validateWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
