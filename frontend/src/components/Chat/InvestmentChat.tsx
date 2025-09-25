import React, { useRef, useEffect } from "react";
import { User } from "../../types";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { getStatusColor } from "../../types/investment";
import { useInvestmentData } from "../../hooks/useInvestmentData";

interface InvestmentChatProps {
  user: User;
}

const InvestmentChat: React.FC<InvestmentChatProps> = ({}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { filteredData, statistics } = useInvestmentData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredData]);

  // getStatusColor is now imported from investment types

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header Stats - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl p-3 border border-emerald-500/20">
          <p className="text-emerald-400 text-xs font-medium mb-1">
            Current Month
          </p>
          <p className="text-white font-bold text-lg">
            ${statistics.currentMonthData?.invested.toLocaleString() || 0}
          </p>
          <p className="text-gray-400 text-xs">Invested</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl p-3 border border-blue-500/20">
          <p className="text-blue-400 text-xs font-medium mb-1">Projected</p>
          <p className="text-white font-bold text-lg">
            ${statistics.projectedEarnings.toFixed(2)}
          </p>
          <p className="text-gray-400 text-xs">This month</p>
        </div>
      </div>

      {/* Investment History - Compact Cards */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium text-sm">Investment History</h3>
          <span className="text-gray-400 text-xs">
            {filteredData.length} entries
          </span>
        </div>

        <ScrollArea className="h-full">
          <div className="space-y-2 pr-2">
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/30 rounded-xl p-3 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <h4 className="font-medium text-white text-sm">
                      {item.month.split(" ")[0]}
                    </h4>
                    <Badge
                      className={`${getStatusColor(
                        item.status
                      )} text-xs px-2 py-0.5`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-xs">{item.apy}% APY</p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400 mb-1">Invested</p>
                    <p className="text-white font-semibold">
                      ${(item.invested / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Earned</p>
                    <p className="text-emerald-400 font-semibold">
                      ${item.earned.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Return</p>
                    <p className="text-blue-400 font-semibold">
                      {((item.earned / item.invested) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (item.earned / item.invested) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
    </div>
  );
};

export default InvestmentChat;
