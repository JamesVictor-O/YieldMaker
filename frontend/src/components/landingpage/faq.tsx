"use client";
import React, { useState } from "react";

type FAQItem = { q: string; a: string };

const items: FAQItem[] = [
  {
    q: "Is Yieldmaker non-custodial?",
    a: "Yes. Funds remain in smart contracts you control. We never take custody.",
  },
  {
    q: "What fees does the platform charge?",
    a: "We aim for transparent, low fees. Some strategies include performance fees only when you earn.",
  },
  {
    q: "Which chains are supported?",
    a: "Celo mainnet, with more chains coming soon.",
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 bg-[#0b0f0c]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-2xl sm:text-4xl font-bold text-white mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {items.map((item, idx) => {
            const isOpen = idx === openIdx;
            return (
              <div
                key={item.q}
                className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left px-4 sm:px-5 py-3 sm:py-4"
                >
                  <span className="text-sm sm:text-base text-white font-medium">
                    {item.q}
                  </span>
                  <span className="text-gray-300">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4">
                    <p className="text-sm sm:text-base text-gray-300">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
