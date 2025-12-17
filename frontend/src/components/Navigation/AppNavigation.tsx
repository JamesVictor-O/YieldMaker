"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import {
  BarChart3,
  MessageSquare,
  Settings,
  Menu,
  X,
  TrendingUp,
  Shield,
  Wallet,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "AI Chat", href: "/chat", icon: MessageSquare },
  { name: "Portfolio", href: "/portfolio", icon: TrendingUp },
  { name: "Security", href: "/security", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function AppNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
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
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Mobile sidebar - Optimized */}
        <div
          className={`fixed inset-y-0 left-0 w-80 sm:w-72 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile sidebar header - Compact */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl  flex items-center justify-center shadow-lg">
                <Image
                  src="/Logo3.png"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="bg-transparent"
                />
              </div>
              <h1 className="text-lg font-bold text-white">YieldMaker</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 active:scale-95"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Mobile navigation - Compact */}
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800/40 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? "text-emerald-400"
                        : "text-gray-400 group-hover:text-emerald-400"
                    }`}
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile wallet section - Compact */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-3">
              {isConnected ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {displayAddress ?? "Connected"}
                      </p>
                      <p className="text-xs text-gray-400">Wallet Connected</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors duration-200 active:scale-95"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Disconnect</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg active:scale-95"
                >
                  <span className="text-sm">Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-gray-900 via-black to-gray-900 border-r border-gray-800/50 shadow-2xl">
          {/* Desktop logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-gray-800/50">
            <div className="w-10 h-10 rounded-xl  flex items-center justify-center shadow-lg">
              <Image
                src="/Logo3.png"
                alt="Logo"
                width={24}
                height={24}
                className="bg-transparent"
              />
            </div>
            <span className="text-xl font-bold text-white">YieldMaker</span>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 p-6 space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800/40 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? "text-emerald-400"
                        : "text-gray-400 group-hover:text-emerald-400"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop wallet section */}
          <div className="p-6 border-t border-gray-800/50">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
              {isConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {displayAddress ?? "Connected"}
                      </p>
                      <p className="text-xs text-gray-400">Wallet Connected</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center space-x-2 w-full py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Disconnect</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile top bar - Dark Theme Consistent */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-md border-b border-gray-800/50 shadow-xl">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 active:scale-95"
            >
              <Menu className="w-5 h-5 text-gray-300" />
            </button>

          </div>
          <div className="bg-gray-800/60 border border-gray-700/50 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700/70 transition-all duration-200 active:scale-95">
            {isConnected ? (
              <button onClick={logout} className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="font-medium text-xs">
                  {displayAddress ?? "Account"}
                </span>
              </button>
            ) : (
              <button onClick={login} className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                <span className="font-medium text-xs">Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
