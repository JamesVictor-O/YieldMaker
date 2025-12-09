"use client";
import React from "react";
import Link from "next/link";

const InvestorStats = () => {
  const stats = [
    { label: "TOTAL FUNDS LOCKED", value: "$45M+" },
    { label: "AVERAGE APY", value: "12.8%" },
    { label: "ACTIVE USERS", value: "15k+" },
    { label: "LAST FEES", value: "$0" },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#0b0f0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-5 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <div className="text-emerald-400 text-xs sm:text-[11px] tracking-wide mb-1">
                  {s.label}
                </div>
                <div className="text-white font-bold text-xl sm:text-2xl">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link href="/dashboard">
              <button className="px-4 sm:px-5 py-2 rounded-lg bg-white text-black hover:bg-gray-100 font-semibold">
                Explore Vaults
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestorStats;
