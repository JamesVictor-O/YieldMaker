"use client";

import { ReactNode } from "react";
import { WagmiProvider, http } from "wagmi";
import {sepolia, mainnet, polygon, arbitrum } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const config =   getDefaultConfig({
    appName: "Yieldmaker",
    projectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your-project-id",
    chains: [sepolia, mainnet, polygon, arbitrum],
    transports: {
      [sepolia.id]: http(),
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [arbitrum.id]: http(),
    },
  })

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: ReactNode;
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={sepolia}
          locale="en-US"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
