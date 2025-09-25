"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { celoAlfajores } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

interface Web3ProviderProps {
  children: ReactNode;
}

// Create a query client
const queryClient = new QueryClient();

// Wagmi config for Celo Alfajores testnet
const config = getDefaultConfig({
  appName: "Yieldmaker",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "dummy-project-id",
  chains: [celoAlfajores],
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
        <RainbowKitProvider initialChain={celoAlfajores} locale="en-US">
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
