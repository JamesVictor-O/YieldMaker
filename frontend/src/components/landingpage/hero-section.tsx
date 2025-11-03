"use client";
import { Button } from "../ui/button";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="min-h-screen bg-[#101110] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#101110] via-[#1a1a1a] to-[#101110] opacity-50"></div>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-20 pb-8 min-h-screen flex flex-col justify-center">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            {/* Main heading with improved mobile typography */}
            <h1 className="flex flex-col text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#fefeff] mb-6 sm:mb-8 leading-tight font-pop">
              <span className="animate-fade-in-up">Turning Passive Crypto</span>
              <span className="animate-fade-in-up delay-200">
               Holders Into Active DeFi Earners
              </span>
            </h1>

            {/* Subtitle with better mobile spacing */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0 animate-fade-in-up delay-400">
              Earn from DeFi without the complexity{" "}
              <span className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                YieldMaker&apos;s AI
              </span>{" "}
              does all the work for you. You just deposit and relax.
            </p>

            {/* CTA Buttons with improved mobile design */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 animate-fade-in-up delay-600">
              <Button
                asChild
                className="bg-white text-black hover:bg-gray-100 hover:text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                <a
                  href="/dashboard"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Start Earning Now</span>
                </a>
              </Button>
            </div>

            {/* Trust Indicators with improved mobile layout */}
            <div className="mt-10 md:mt-0 flex flex-row  justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-gray-300 px-4 animate-fade-in-up delay-800">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 border border-white/10">
                <svg
                  className="w-4 h-4 text-green-400 hidden md:block"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[10px] sm:text-sm font-medium">
                  Audited Protocols
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 border border-white/10">
                <svg
                  className="w-4 h-4 text-blue-400 hidden md:block"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[10px] sm:text-sm font-medium ">
                  Auto Rebalancing
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 border border-white/10">
                <svg
                  className="w-4 h-4 text-yellow-400 hidden md:block"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[10px] sm:text-sm font-medium">
                  No Hidden Fees
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Improved image positioning for mobile */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 hidden md:block sm:transform-none sm:bottom-0 sm:left-0 z-0">
          <Image
            src="/coin2.png"
            alt="coin"
            width={500}
            height={500}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-60 lg:h-60 opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
