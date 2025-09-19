"use client";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Wallet, Shield, TrendingUp } from "lucide-react";

export default function ConnectWallet() {
    const { ready, authenticated, user, login, logout } = usePrivy();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
    type MinimalWallet = { address?: string };
    type MinimalLinkedAccount = { type?: string; address?: string };
  
    const getDisplayAddress = (): string | undefined => {
      const embeddedAddress = (user?.wallet as MinimalWallet | undefined)
        ?.address;
      const linkedAddress = (
        user?.linkedAccounts as MinimalLinkedAccount[] | undefined
      )?.find((account) => account?.type === "wallet")?.address;
      const address = embeddedAddress || linkedAddress;
      if (!address) return undefined;
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };
  
    const isConnected = ready && authenticated;
    const displayAddress = getDisplayAddress();


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
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

         <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Wallet Button */}
              <div className="hidden sm:block">
                <div className="bg-gradient-to-r bg-[#00DBDD] text-white px-6 lg:px-8 py-2 rounded-lg hover:bg-[#5aaaab] transition-all shadow-lg">
                  {isConnected ? (
                    <button onClick={logout} className="flex items-center">
                      <span className="text-white font-medium text-sm lg:text-base">
                        {displayAddress ?? "Account"}
                      </span>
                    </button>
                  ) : (
                    <button onClick={login} className="flex items-center">
                      <span className="text-white font-medium text-sm lg:text-base">
                        Connect Wallet
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Wallet Button */}
              <div className="sm:hidden">
                <div className="bg-gradient-to-r bg-[#00DBDD] text-white px-3 py-2 rounded-lg hover:bg-[#5aaaab] transition-all shadow-lg">
                  {isConnected ? (
                    <button onClick={logout} className="flex items-center">
                      <span className="text-white font-medium text-xs">
                        {displayAddress ?? "Account"}
                      </span>
                    </button>
                  ) : (
                    <button onClick={login} className="flex items-center">
                      <span className="text-white font-medium text-xs">
                        Connect
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <svg
                  className={`w-6 h-6 text-text-dark transition-transform duration-200 ${
                    mobileMenuOpen ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
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
