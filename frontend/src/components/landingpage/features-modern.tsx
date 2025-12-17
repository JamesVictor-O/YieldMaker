"use client";
import React from "react";
import { Cpu, MousePointerClick, ShieldCheck, ArrowRight } from "lucide-react";

const FeaturesModern = () => {
  const features = [
    {
      title: "AI Optimization",
      description:
        "Our algorithms monitor thousands of pools 24/7, auto-compounding and shifting strategies to capture maximum APY.",
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      title: "One-Click Invest",
      description:
        "Forget bridges, swaps, and gas on multiple chains. Deposit once, and our vault architecture handles routing.",
      icon: <MousePointerClick className="w-6 h-6" />,
    },
    {
      title: "Risk Management",
      description:
        "Safety first. We deploy to battle-tested protocols. Contracts are audited and non-custodial.",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#0b0f0c]" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-10 mb-12">
          <div className="flex-1">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-3">
              Why Choose Yieldmaker?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl">
              Experience the next evolution of DeFi. We abstract the complexity
              so you can focus on growth.
            </p>
          </div>
          <div className="flex-1 flex items-end justify-start md:justify-end">
            <a
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 group cursor-pointer"
              href="#"
            >
              Read the Whitepaper
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5">
                {f.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-300">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesModern;
