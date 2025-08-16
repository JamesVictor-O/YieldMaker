const HeroSection = () => {
  return (
    <div>
      <section className="pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-light-blue text-primary-blue rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-accent-green rounded-full mr-2 animate-pulse"></span>
              Your AI Guide to Safe DeFi Yields
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-dark mb-6 animate-slide-up">
              Unlock <span className="text-[#FFCE4A]">DeFi</span> Profits
              <span className="text-primary-blue">
                {" "}
                with <span className="text-[#FFCE4A]">AI</span> Simplicity
              </span>
            </h1>

            <p className="text-xl text-text-light mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              From everyday <span className="text-[#FFCE4A]">Savers</span> to
              everyday <span className="text-[#FFCE4A]">Earners</span> ,
              Yieldmaker’s AI guides you to safe, high-yield DeFi opportunities
              with simple conversations no crypto expertise needed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
              <a
                href="/dashboard"
                className="bg-[#00DBDD] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#03a8ab] transition-all duration-200 transform hover:scale-105 w-full sm:w-auto text-center"
              >
                Start Earning Now
              </a>
              <button className="text-primary-blue border-2 border-primary-blue px-8 py-4 rounded-full text-lg font-semibold hover:bg-light-blue transition-all duration-200 w-full sm:w-auto">
                Watch Demo
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-text-light animate-slide-up">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-primary-blue rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-accent-green rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm">Trusted by 1,000+ early users</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-accent-green"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">$100M+ TVL Analyzed</span>
              </div>
            </div>
          </div>

          <div className="mt-16 relative animate-float">
            <div className="max-w-4xl mx-auto bg-[#1A1A1A] border border-gray-200 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-accent-green rounded-full"></div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 flex items-center px-4">
                  <span className="text-black text-sm">
                    Chat with Yieldmaker AI...
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-light-blue text-primary-blue px-4 py-2 rounded-2xl rounded-bl-sm max-w-xs">
                    Hi! I have $500 USDC and want to earn safely. What do you
                    recommend?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary-blue text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-xs">
                    Great! Based on your profile, I recommend Aave USDC lending
                    at 8.2% APY. It&apos;s audited with $13B TVL. Shall I help
                    you deposit?
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="bg-accent-green text-white px-6 py-2 rounded-full text-sm font-medium">
                    ✓ Deposit Successful - Earning 8.2% APY
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-[#0e0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-dark mb-4">
              Why Choose Yieldmaker?
            </h2>
            <p className="text-xl text-text-light max-w-2xl mx-auto">
              We&apos;ve simplified DeFi investing into three simple steps,
              powered by AI that understands your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-100 hover:border-primary-blue transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-light-blue rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-2">
                Conversational AI
              </h3>
              <p className="text-text-light">
                Simply tell us your goals in plain language. No technical jargon
                or complex interfaces.
              </p>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-100 hover:border-primary-blue transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-light-blue rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-2">
                Safety First
              </h3>
              <p className="text-text-light">
                Our AI only recommends audited protocols with proven track
                records and high TVL.
              </p>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-100 hover:border-primary-blue transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-light-blue rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-2">
                One-Click Investing
              </h3>
              <p className="text-text-light">
                Connect your wallet and let our AI handle deposits and
                rebalancing automatically.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
