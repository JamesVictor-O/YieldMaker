"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, Shield, TrendingUp } from "lucide-react";

export default function ConnectWallet() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-lg text-gray-600 max-w-md">
          Start earning DeFi yields with AI-powered recommendations
        </p>
      </div>

      <div className="mb-8">
        <ConnectButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Safe & Secure</h3>
          <p className="text-sm text-gray-600">
            All protocols are audited and verified for safety
          </p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
          <p className="text-sm text-gray-600">
            Get personalized yield recommendations
          </p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Wallet className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Easy to Use</h3>
          <p className="text-sm text-gray-600">
            Simple interface for beginners and experts
          </p>
        </div>
      </div>
    </div>
  );
}
