import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import Web3Provider from "@/components/Providers/Web3Provider";
import FarcasterSDKProvider from "@/components/Providers/FarcasterSDKProvider";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yieldmaker - AI-Powered DeFi Yield Investing",
  description:
    "Simplify DeFi yield investing with AI-powered recommendations. Safe, secure, and accessible to everyone.",
  keywords: [
    "DeFi",
    "yield farming",
    "crypto",
    "investment",
    "AI",
    "blockchain",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Web3Provider>
          <FarcasterSDKProvider>
            {children}
            <ToastContainer />
          </FarcasterSDKProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
