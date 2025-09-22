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
        
        {/* Mobile sidebar */}
        <div className={`fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          {/* Mobile sidebar header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="bg-transparent"
                />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Yieldmaker
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>
          
          {/* Mobile navigation */}
          <nav className="p-6 space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${
                    isActive ? "text-cyan-400" : "text-gray-400 group-hover:text-cyan-400"
                  }`} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile wallet section */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 border border-gray-600/30">
              {isConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-white" />
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
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg"
                >
                  Connect Wallet
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
              <Image
                src="/Logo.png"
                alt="Logo"
                width={24}
                height={24}
                className="bg-transparent"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Yieldmaker
            </span>
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
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800/40 hover:text-white"
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${
                    isActive ? "text-cyan-400" : "text-gray-400 group-hover:text-cyan-400"
                  }`} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop wallet section */}
          <div className="p-6 border-t border-gray-800/50">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 border border-gray-600/30">
              {isConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-white" />
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
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100/80 transition-colors duration-200"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          
      
          <div className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg">
            {isConnected ? (
              <button onClick={logout} className="flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span className="font-medium text-sm">
                  {displayAddress ?? "Account"}
                </span>
              </button>
            ) : (
              <button onClick={login} className="flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span className="font-medium text-sm">Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}