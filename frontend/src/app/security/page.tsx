"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse mb-4"></div>
          <p className="text-gray-600">Loading security information...</p>
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Security & Risk Analysis
          </h1>
          <p className="text-gray-600">
            Monitor the security status of your DeFi protocols and investments
          </p>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Portfolio Security</p>
                <p className="text-2xl font-bold text-green-600">High</p>
                <p className="text-xs text-gray-400">
                  Based on protocol scores
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Audited Protocols</p>
                <p className="text-2xl font-bold text-blue-600">3/3</p>
                <p className="text-xs text-gray-400">100% coverage</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Risk Level</p>
                <p className="text-2xl font-bold text-yellow-600 capitalize">
                  {user.riskProfile}
                </p>
                <p className="text-xs text-gray-400">Your profile</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Protocol Security Scores */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Protocol Security Scores
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Security analysis based on TVL, audits, hack history, and chain
              security
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {mockSecurityData.map((protocol) => (
              <div key={protocol.protocol} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {protocol.protocol}
                    </h3>
                    <p className="text-sm text-gray-500">
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
                          ? "bg-green-100 text-green-800"
                          : protocol.riskLevel === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {protocol.riskLevel} risk
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Audit Score</span>
                      <span className="text-sm font-medium text-gray-900">
                        {protocol.auditScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
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
                      <span className="text-sm text-gray-600">
                        Chain Security
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {protocol.chainSecurity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Hack History
                      </span>
                      <span className="text-sm font-medium text-gray-900">
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Security Best Practices
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
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
