import React, { useState, useRef, useEffect } from "react";
import { User } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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

const InvestmentChat: React.FC<InvestmentChatProps> = ({ user }) => {
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
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="h-full max-h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">$</span>
          </div>
          Investment History
        </CardTitle>
        <p className="text-sm text-gray-500">
          Your monthly investment and earnings breakdown
        </p>
      </CardHeader>

      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Invested</p>
            <p className="text-lg font-bold text-gray-900">
              ${totalInvested.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Earned</p>
            <p className="text-lg font-bold text-green-600">
              ${totalEarned.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Avg APY</p>
            <p className="text-lg font-bold text-blue-600">
              {averageApy.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          <Button
            variant={selectedMonth === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMonth("all")}
          >
            All Months
          </Button>
          {investmentData.map((item) => (
            <Button
              key={item.month}
              variant={selectedMonth === item.month ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMonth(item.month)}
            >
              {item.month.split(" ")[0]}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-3">
          {filteredData.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{item.month}</h4>
                  <p className="text-sm text-gray-500">{item.protocol}</p>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Invested</p>
                  <p className="font-semibold text-gray-900">
                    ${item.invested.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Earned</p>
                  <p className="font-semibold text-green-600">
                    ${item.earned.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-xs text-gray-500">APY: {item.apy}%</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-green-600 h-1.5 rounded-full"
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

      <div className="p-6 border-t">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Current Month</p>
            <p className="font-semibold text-gray-900">
              $
              {investmentData[
                investmentData.length - 1
              ]?.invested.toLocaleString() || 0}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Projected Earnings</p>
            <p className="font-semibold text-green-600">
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
