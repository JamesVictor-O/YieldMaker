import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Footer from "./footer";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Mobile First with Background Image */}
      <section
        className="relative pt-16 sm:pt-20 pb-8 min-h-screen flex flex-col justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/landingpage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Clean Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
           

            {/* Main Heading - Mobile Optimized */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              Turn <span className="text-emerald-400">Savings</span> into{" "}
              <span className="text-emerald-400">Earnings</span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              YieldMaker&apos;s AI guides you to{" "}
              <span className="text-emerald-400 font-semibold">
                safe, high-yield
              </span>{" "}
              DeFi opportunities with simple conversations—no crypto expertise
              needed.
            </p>

            {/* Stats Row - Mobile Friendly */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 px-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">
                  8.2%
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
                  Average APY
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">
                  $13B+
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
                  Total Value Locked
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">
                  24/7
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
                  AI Assistant
                </div>
              </div>
            </div>

            {/* CTA Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
              <Button
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <a href="/dashboard" className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Start Earning Now
                </a>
              </Button>
              
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-gray-300 px-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs sm:text-sm">Audited Protocols</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs sm:text-sm">Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs sm:text-sm">No Hidden Fees</span>
              </div>
            </div>
          </div>

          {/* Demo Chat Interface - Mobile Optimized */}
          {/* <div className="mt-8 sm:mt-12 lg:mt-16 relative animate-float px-2 sm:px-0">
            <Card className="max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto bg-[#1A1A1A] border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-accent-green rounded-full"></div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 sm:h-8 flex items-center px-2 sm:px-4">
                    <span className="text-black text-xs sm:text-sm truncate">
                      Chat with Yieldmaker AI...
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-4 sm:pb-6">
               
                <div className="flex justify-start">
                  <div className="bg-light-blue text-white px-3 sm:px-4 py-2 rounded-2xl rounded-bl-sm max-w-[85%] sm:max-w-xs">
                    <p className="text-xs sm:text-sm">
                      Hi! I have $500 USDC and want to earn safely. What do you
                      recommend?
                    </p>
                  </div>
                </div>
                
               
                <div className="flex justify-end">
                  <div className="bg-primary-blue text-white px-3 sm:px-4 py-2 rounded-2xl rounded-br-sm max-w-[85%] sm:max-w-xs">
                    <p className="text-xs sm:text-sm">
                      Great! Based on your profile, I recommend Aave USDC
                      lending at 8.2% APY. It&apos;s audited with $13B TVL.
                      Shall I help you deposit?
                    </p>
                  </div>
                </div>
                
                
                <div className="flex justify-center pt-2">
                  <Badge className="bg-accent-green text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                    ✓ Deposit Successful - Earning 8.2% APY
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      {/* <section id="features" className="py-12 sm:py-16 lg:py-20 bg-[#0e0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
              Why Choose{" "}
              <span className="text-[#00DBDD]">Yieldmaker?</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white max-w-xs sm:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
              We&apos;ve simplified DeFi investing into three simple steps,
              powered by AI that understands your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-0">
            
           
            <Card className="bg-[#1A1A1A] border border-gray-800 hover:border-[#00DBDD] transition-all duration-300 transform hover:scale-105 rounded-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00DBDD] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-white">
                  Conversational AI
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Simply tell us your goals in plain language. No technical
                  jargon or complex interfaces.
                </p>
              </CardContent>
            </Card>

          
            <Card className="bg-[#1A1A1A] border border-gray-800 hover:border-[#00DBDD] transition-all duration-300 transform hover:scale-105 rounded-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00DBDD] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-white">
                  Safety First
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Our AI only recommends audited protocols with proven track
                  records and high TVL.
                </p>
              </CardContent>
            </Card>

            
            <Card className="bg-[#1A1A1A] border border-gray-800 hover:border-[#00DBDD] transition-all duration-300 transform hover:scale-105 rounded-xl sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00DBDD] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-white">
                  One-Click Investing
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Connect your wallet and let our AI handle deposits and
                  rebalancing automatically.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* <Footer /> */}
    </div>
  );
};

export default HeroSection;
