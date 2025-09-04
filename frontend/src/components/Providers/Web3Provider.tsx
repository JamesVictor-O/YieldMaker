"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";

interface Web3ProviderProps {
  children: ReactNode;
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId) {
    throw new Error("Missing NEXT_PUBLIC_PRIVY_APP_ID");
  }

  return (
    // <WagmiProvider config={config}>
    //   <QueryClientProvider client={queryClient}>
    //     <RainbowKitProvider
    //       initialChain={sepolia}
    //       locale="en-US"
    //     >
    //       {children}
    //     </RainbowKitProvider>
    //   </QueryClientProvider>
    // </WagmiProvider>

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
  );
}
