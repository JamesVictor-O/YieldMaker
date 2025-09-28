import { Button } from "../ui/button";

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
          
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Deposit <span className="text-emerald-400">once, </span> {" "}
              <span className="text-emerald-400">earn everywhere</span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
             Earn from DeFi without the complexity{" "}
              <span className="text-emerald-400 font-semibold">
              YieldMakers’s AI
              </span>{" "}
              handles the research, audits, and strategies. You just deposit and relax.
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
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
