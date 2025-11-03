"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";

const Header = () => {
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
    <div>
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo Section - Mobile Optimized */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className=" h-6 w-8 md:w-16 md:h-16  sm:w-8 sm:h-8 rounded-lg  flex items-center justify-center">
                <Image
                  src="/Logo3.png"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="bg-transparent w-full h-full py-3 object-contain"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-sm font-medium"
              >
                How it Works
              </a>
              <a
                href="#safety"
                className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-sm font-medium"
              >
                Safety
              </a>
            </nav>

            {/* CTA Button - Mobile First */}
            <div className="flex items-center gap-2">
              {/* Main CTA Button */}
              <div className="bg-white hover:bg-gray-300 text-black px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-lg transition-all active:scale-95">
                {isConnected ? (
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5"
                  >
                    <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                    <span className="font-medium text-xs sm:text-sm">
                      {displayAddress ?? "Account"}
                    </span>
                  </button>
                ) : (
                  <button onClick={login} className="flex items-center gap-1.5">
                    <span className="font-medium text-xs sm:text-sm">
                      <span className="hidden sm:inline">Start </span>Earning
                    </span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Toggle - Only show if we have navigation */}
              <button
                className="md:hidden p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <svg
                  className={`w-5 h-5 text-gray-300 transition-transform duration-200 ${
                    mobileMenuOpen ? "rotate-180" : ""
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
          </div>
        </div>

        {/* Mobile Menu - Dark Theme */}
        <div
          className={`md:hidden bg-gray-950/95 backdrop-blur-md border-t border-gray-800/50 transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "max-h-64 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 py-3 space-y-1">
            <a
              href="#features"
              className="block text-gray-300 hover:text-emerald-400 hover:bg-gray-800/30 transition-colors py-2.5 px-3 rounded-lg text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-gray-300 hover:text-emerald-400 hover:bg-gray-800/30 transition-colors py-2.5 px-3 rounded-lg text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </a>
            <a
              href="#safety"
              className="block text-gray-300 hover:text-emerald-400 hover:bg-gray-800/30 transition-colors py-2.5 px-3 rounded-lg text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Safety
            </a>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
