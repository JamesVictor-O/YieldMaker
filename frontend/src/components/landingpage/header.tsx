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
      <header className="fixed top-0 w-full z-40 transition-all duration-300 shadow-sm md:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="bg-transparent"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">
                Yieldmaker
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-primary-blue transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-300 hover:text-primary-blue transition-colors duration-200"
              >
                How it Works
              </a>
              <a
                href="#safety"
                className="text-gray-300 hover:text-primary-blue transition-colors duration-200"
              >
                Safety
              </a>
            </nav>

            {/* Desktop Wallet Button & Mobile Menu Button */}
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
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out ${
            mobileMenuOpen 
              ? 'max-h-64 opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 py-4 space-y-4">
            <a
              href="#features"
              className="block text-text-light hover:text-primary-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-text-light hover:text-primary-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </a>
            <a
              href="#safety"
              className="block text-text-light hover:text-primary-blue transition-colors py-2"
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