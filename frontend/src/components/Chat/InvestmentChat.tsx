import React, { useState, useRef, useEffect } from "react";
import { User } from "../../types";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

interface InvestmentData {
  month: string;
  invested: number;
  earned: number;
  apy: number;
  protocol: string;
  status: "active" | "completed" | "pending";
}

interface InvestmentChatProps {
  user: User;
}

const InvestmentChat: React.FC<InvestmentChatProps> = ({ }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock investment data - in a real app this would come from the blockchain
  const investmentData: InvestmentData[] = [
    {
      month: "January 2024",
      invested: 5000,
      earned: 245.5,
      apy: 8.2,
      protocol: "Aave USDC",
      status: "active",
    },
    {
      month: "February 2024",
      invested: 7500,
      earned: 412.3,
      apy: 8.2,
      protocol: "Aave USDC",
      status: "active",
    },
    {
      month: "March 2024",
      invested: 10000,
      earned: 589.75,
      apy: 8.2,
      protocol: "Aave USDC",
      status: "active",
    },
    {
      month: "April 2024",
      invested: 12000,
      earned: 720.4,
      apy: 8.2,
      protocol: "Aave USDC",
      status: "active",
    },
    {
      month: "May 2024",
      invested: 15000,
      earned: 892.15,
      apy: 8.2,
      protocol: "Aave USDC",
      status: "active",
    },
    {
      month: "June 2024",
      invested: 18000,
      earned: 1085.6,
      apy: 8.2,
      protocol: "Aave USDC",
      status: "active",
    },
  ];

  const filteredData =
    selectedMonth === "all"
      ? investmentData
      : investmentData.filter((item) => item.month === selectedMonth);

  const totalInvested = investmentData.reduce(
    (sum, item) => sum + item.invested,
    0
  );
  const totalEarned = investmentData.reduce(
    (sum, item) => sum + item.earned,
    0
  );
  const averageApy =
    investmentData.reduce((sum, item) => sum + item.apy, 0) /
    investmentData.length;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <Card className="h-full max-h-[600px] overflow-y-auto flex flex-col bg-transparent border-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">$</span>
          </div>
          <span className="text-white">Investment History</span>
        </CardTitle>
        <p className="text-sm text-gray-400">
          Your monthly investment and earnings breakdown
        </p>
      </CardHeader>

      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">Total Invested</p>
            <p className="text-lg font-bold text-white">
              ${totalInvested.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Total Earned</p>
            <p className="text-lg font-bold text-emerald-400">
              ${totalEarned.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Avg APY</p>
            <p className="text-lg font-bold text-blue-400">
              {averageApy.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          <Button
            variant={selectedMonth === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMonth("all")}
            className={selectedMonth === "all" 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 hover:text-white"
            }
          >
            All Months
          </Button>
          {investmentData.map((item) => (
            <Button
              key={item.month}
              variant={selectedMonth === item.month ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMonth(item.month)}
              className={selectedMonth === item.month
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 hover:text-white"
              }
            >
              {item.month.split(" ")[0]}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-3">
          {filteredData.map((item, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-white">{item.month}</h4>
                  <p className="text-sm text-gray-400">{item.protocol}</p>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>

              <Separator className="my-2 bg-gray-600" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Invested</p>
                  <p className="font-semibold text-white">
                    ${item.invested.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Earned</p>
                  <p className="font-semibold text-emerald-400">
                    ${item.earned.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-xs text-gray-400">APY: {item.apy}%</p>
                <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
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

      <div className="p-6 border-t border-gray-600">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Current Month</p>
            <p className="font-semibold text-white">
              $
              {investmentData[
                investmentData.length - 1
              ]?.invested.toLocaleString() || 0}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Projected Earnings</p>
            <p className="font-semibold text-emerald-400">
              $
              {(
                ((investmentData[investmentData.length - 1]?.invested || 0) *
                  0.082) /
                12
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvestmentChat;