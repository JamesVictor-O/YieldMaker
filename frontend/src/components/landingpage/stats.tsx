"use client";
import React from "react";
import Link from "next/link";

const Stats = () => {
  const metrics = [
    { val: "$45M+", label: "Total Value Locked" },
    { val: "12.8%", label: "Average APY" },
    { val: "15k+", label: "Active Users" },
    { val: "$0", label: "Lost Funds" },
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#0b0f0c] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0d1110] rounded-3xl overflow-hidden relative border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1110] via-[#0d1110]/95 to-transparent z-10" />
          <div className="relative z-20 p-8 sm:p-10 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                Join thousands of investors earning passive income.
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {metrics.map((m, i) => (
                  <div key={m.label}>
                    <p
                      className={`text-3xl sm:text-4xl font-black mb-1 ${
                        i === 0 ? "text-primary" : "text-white"
                      }`}
                    >
                      {m.val}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider font-medium">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/dashboard">
                <button className="bg-white hover:bg-gray-100 text-black rounded-lg h-11 px-5 font-semibold">
                  Explore Vaults
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
