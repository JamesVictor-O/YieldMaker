import React from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  TrendingUp,
  Bitcoin,
  Coins,
} from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
          

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
              Institutional-Grade <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">
                DeFi Yields
              </span>
              , <br />
              Powered by AI.
            </h1>

            <p className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Stop guessing. Let Yieldmaker&apos;s intelligent algorithms
              optimize your crypto portfolio for maximum returns and minimized
              risk. Auto-compounding, gas-efficient, and secure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <Button
                size="lg"
                className="shadow-[0_0_20px_rgba(19,236,109,0.3)] hover:scale-105 transform"
              >
                Start Earning
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Audited by Certik</span>
              </div>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Non-Custodial</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative lg:h-auto w-full aspect-square lg:aspect-auto flex items-center justify-center">
            {/* Abstract Dashboard Representation */}
            <div className="relative w-full max-w-md lg:max-w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-2xl blur-2xl -z-10 transform rotate-6 scale-95"></div>

              <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                {/* Mock Graph Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-text-secondary">
                      Total Portfolio Value
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      $124,592.45
                    </h3>
                  </div>
                  <div className="px-3 py-1 bg-primary/10 rounded-lg text-primary text-sm font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +12.4% APY
                  </div>
                </div>

                {/* Mock Graph Bars */}
                <div className="flex items-end justify-between gap-2 h-48 w-full mb-6">
                  {[40, 55, 35, 65, 50, 75].map((height, i) => (
                    <div
                      key={i}
                      className="w-full bg-primary/20 rounded-t-sm transition-all duration-500 hover:bg-primary/40 cursor-pointer relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute bottom-0 left-0 w-full bg-primary/10 h-0 group-hover:h-full transition-all duration-300"></div>
                    </div>
                  ))}
                  <div className="w-full bg-primary rounded-t-sm h-[90%] shadow-[0_0_15px_rgba(19,236,109,0.4)] relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-dark border border-border-dark text-white text-xs py-1 px-2 rounded opacity-0 hover:opacity-100 transition-opacity">
                      Today
                    </div>
                  </div>
                </div>

                {/* Mock List Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-background-dark/50 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                        <Bitcoin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Bitcoin Strategy
                        </p>
                        <p className="text-xs text-slate-500 dark:text-text-secondary">
                          Conservative • Low Risk
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        $42,300
                      </p>
                      <p className="text-xs text-primary font-medium">+5.2%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-background-dark/50 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Stablecoin LP
                        </p>
                        <p className="text-xs text-slate-500 dark:text-text-secondary">
                          Aggressive • High Yield
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        $82,292
                      </p>
                      <p className="text-xs text-primary font-medium">+18.4%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
