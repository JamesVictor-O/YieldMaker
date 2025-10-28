"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Shield,
  CheckCircle,
  AlertTriangle,

  Info,
} from "lucide-react";
import { User } from "@/types";
import ConnectWallet from "@/components/Web3/ConnectWallet";

interface SecurityScore {
  protocol: string;
  tvl: string;
  auditScore: number;
  hackHistory: string;
  chainSecurity: string;
  overallScore: number;
  riskLevel: "low" | "medium" | "high";
}

const mockSecurityData: SecurityScore[] = [
  {
    protocol: "Aave",
    tvl: "$13.2B",
    auditScore: 95,
    hackHistory: "No major hacks",
    chainSecurity: "Ethereum (High)",
    overallScore: 92,
    riskLevel: "low",
  },
  {
    protocol: "Compound",
    tvl: "$8.1B",
    auditScore: 88,
    hackHistory: "No major hacks",
    chainSecurity: "Ethereum (High)",
    overallScore: 87,
    riskLevel: "low",
  },
  {
    protocol: "Yearn Finance",
    tvl: "$2.3B",
    auditScore: 82,
    hackHistory: "Minor incidents in 2021",
    chainSecurity: "Ethereum (High)",
    overallScore: 78,
    riskLevel: "medium",
  },
];

export default function SecurityPage() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      setUser({
        address,
        balance: 2500,
        isNewUser: false,
        riskProfile: "moderate",
      });
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-950 p-4">
        <div className="max-w-6xl mx-auto">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-14 h-14 bg-gray-800 rounded-full mx-auto animate-pulse mb-3 border border-gray-700"></div>
          <p className="text-gray-400">Loading security information...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-1">Security & Risk Analysis</h1>
          <p className="text-gray-400">Monitor the security status of your DeFi protocols and investments</p>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Portfolio Security</p>
                <p className="text-2xl font-bold text-emerald-400">High</p>
                <p className="text-xs text-gray-500">
                  Based on protocol scores
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Audited Protocols</p>
                <p className="text-2xl font-bold text-blue-400">3/3</p>
                <p className="text-xs text-gray-500">100% coverage</p>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Risk Level</p>
                <p className="text-2xl font-bold text-yellow-400 capitalize">
                  {user.riskProfile}
                </p>
                <p className="text-xs text-gray-500">Your profile</p>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Protocol Security Scores */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">
              Protocol Security Scores
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Security analysis based on TVL, audits, hack history, and chain
              security
            </p>
          </div>
          <div className="divide-y divide-gray-800">
            {mockSecurityData.map((protocol) => (
              <div key={protocol.protocol} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {protocol.protocol}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Total Value Locked: {protocol.tvl}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(
                        protocol.overallScore
                      )}`}
                    >
                      {protocol.overallScore}/100
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        protocol.riskLevel === "low"
                          ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800/50"
                          : protocol.riskLevel === "medium"
                          ? "bg-yellow-900/30 text-yellow-300 border border-yellow-800/50"
                          : "bg-red-900/30 text-red-400 border border-red-800/50"
                      }`}
                    >
                      {protocol.riskLevel} risk
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Audit Score</span>
                      <span className="text-sm font-medium text-white">
                        {protocol.auditScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getScoreBg(
                          protocol.auditScore
                        )}`}
                        style={{ width: `${protocol.auditScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Chain Security
                      </span>
                      <span className="text-sm font-medium text-white">
                        {protocol.chainSecurity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Hack History
                      </span>
                      <span className="text-sm font-medium text-white">
                        {protocol.hackHistory}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Security Best Practices</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Never share your private keys or seed phrases</li>
                <li>• Use hardware wallets for large amounts</li>
                <li>• Verify contract addresses before transactions</li>
                <li>• Monitor your investments regularly</li>
                <li>• Diversify across multiple protocols and chains</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
