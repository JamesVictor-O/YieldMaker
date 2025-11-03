"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

interface Web3ProviderProps {
  children: ReactNode;
}

// Create a query client
const queryClient = new QueryClient();

// Define Celo Mainnet
const celoMainnet = defineChain({
  id: 42220,
  name: 'Celo',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo.org']
    },
  },
  blockExplorers: {
    default: {
      name: 'CeloScan',
      url: 'https://celoscan.io'
    },
  },
  testnet: false,
});

// Wagmi config for Celo Mainnet
const config = getDefaultConfig({
  appName: "Yieldmaker",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "dummy-project-id",
  chains: [celoMainnet],
  ssr: true,
});

export default function Web3Provider({ children }: Web3ProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId) {
    throw new Error("Missing NEXT_PUBLIC_PRIVY_APP_ID");
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={celoMainnet} locale="en-US">
          <PrivyProvider
            appId={appId}
            config={{
              // Create embedded wallets for users who don't have a wallet
              embeddedWallets: {
                ethereum: {
                  createOnLogin: "users-without-wallets",
                },
              },
            }}
          >
            {children}
          </PrivyProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
