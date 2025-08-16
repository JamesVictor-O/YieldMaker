import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/landingpage/header";
import Footer from "@/components/landingpage/footer";
import Web3Provider from "@/components/Providers/Web3Provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider>
          <Header />
          {children}
          {/* <Footer /> */}
        </Web3Provider>
      </body>
    </html>
  );
}
