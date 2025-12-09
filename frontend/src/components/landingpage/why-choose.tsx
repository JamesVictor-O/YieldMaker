"use client";
import React, { useEffect, useState } from "react";

const WhyChoose = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    const el = document.getElementById("why-choose");
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const cards = [
    {
      title: "AI Optimization",
      desc: "Our smart algorithms monitor thousands of yields 24/7, auto-reallocating to higher, safer APY.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "One-Click Invest",
      desc: "Forget multiple bridges, swaps, and gas. Deposit once, and our smart contracts handle the routing instantly.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6l4 2"
          />
        </svg>
      ),
    },
    {
      title: "Risk Management",
      desc: "Safety first. We only deploy to battle-tested protocols, use circuit breakers, and continuous risk analysis.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6l7 4v4c0 4-3 6-7 8-4-2-7-4-7-8V10l7-4z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="why-choose" className="py-16 sm:py-20 lg:py-24 bg-[#0b0f0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white font-pop">
            Why Choose Yieldmaker?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((c, idx) => (
            <div
              key={c.title}
              className={`rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 transition-all duration-700 ${
                isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: `${idx * 120}ms` }}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/70 mb-4">
                {c.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {c.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-300">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default WhyChoose;
