"use client";

import React from "react";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";

const Header = () => {
  const { ready, authenticated, user, login, logout } = usePrivy();

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

  return (
    <div>
      <header className="fixed top-0 w-full bg-white  boarder-shadow-2xl  shadow-2xl  border-gray-600 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="bg-transparent"
                />
              </div>
              <span className="text-xl font-bold text-text-dark">
                Yieldmaker
              </span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-text-light hover:text-primary-blue transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-text-light hover:text-primary-blue transition-colors duration-200"
              >
                How it Works
              </a>
              <a
                href="#safety"
                className="text-text-light hover:text-primary-blue transition-colors duration-200"
              >
                Safety
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r bg-[#00DBDD] text-white px-8 py-2 rounded-lg hover:bg-[#5aaaab] transition-all shadow-lg ml-5">
                {isConnected ? (
                  <button onClick={logout} className="flex items-center">
                    <span className="text-white font-medium">
                      {displayAddress ?? "Account"}
                    </span>
                  </button>
                ) : (
                  <button onClick={login} className="flex items-center">
                    <span className="text-white font-medium">
                      Connect Wallet
                    </span>
                  </button>
                )}
              </div>

              <button className="md:hidden p-2">
                <svg
                  className="w-6 h-6 text-text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          id="mobile-menu"
          className="hidden md:hidden bg-[#00DBDD] border-t border-gray-100"
        >
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block text-text-light hover:text-primary-blue transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-text-light hover:text-primary-blue transition-colors"
            >
              How it Works
            </a>
            <a
              href="#safety"
              className="block text-text-light hover:text-primary-blue transition-colors"
            >
              Safety
            </a>

            <div className="bg-gradient-to-r bg-[#00DBDD] text-white px-8 py-2 rounded-lg hover:bg-[#5aaaab] transition-all shadow-lg">
              {isConnected ? (
                <button onClick={logout} className="flex items-center">
                  <span className="text-white font-medium">
                    {displayAddress ?? "Account"}
                  </span>
                </button>
              ) : (
                <button onClick={login} className="flex items-center">
                  <span className="text-white font-medium">Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
