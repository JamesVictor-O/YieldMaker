import React from "react";
import { User } from "../../types";
import InvestmentChat from "../Chat/InvestmentChat";
import WelcomeFlow from "./WelcomeFlow";
import FundsManagement from "./FundsManagement";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface MainDashboardProps {
  user: User;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ user }) => {
  const [showWelcome, setShowWelcome] = React.useState(user.isNewUser);
  const [userBalance, setUserBalance] = React.useState(user.balance);

  const handleWelcomeComplete = (
    riskProfile: "conservative" | "moderate" | "aggressive"
  ) => {
    // Update user profile
    user.riskProfile = riskProfile;
    setShowWelcome(false);
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setUserBalance(newBalance);
    // Update the user object as well
    user.balance = newBalance;
  };

  if (showWelcome) {
    return (
      <div className="flex items-center justify-center p-4">
        <WelcomeFlow user={user} onComplete={handleWelcomeComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              ${userBalance.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Current balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Current Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">$3,945.70</p>
            <p className="text-xs text-green-500 mt-1">+8.2% APY</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900 capitalize">
                {user.riskProfile || "Not Set"}
              </p>
              <Badge variant="outline" className="text-xs">
                {user.riskProfile === "conservative"
                  ? "Low"
                  : user.riskProfile === "moderate"
                  ? "Medium"
                  : user.riskProfile === "aggressive"
                  ? "High"
                  : "Not Set"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investment Chat */}
        <div className="lg:col-span-2">
          <InvestmentChat user={user} />
        </div>

        {/* Funds Management */}
        <div>
          <FundsManagement
            userBalance={userBalance}
            onBalanceUpdate={handleBalanceUpdate}
          />
        </div>
      </div>

      {/* Recommended Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">⚡</span>
            </div>
            Recommended Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">Aave USDC</h4>
                <p className="text-sm text-gray-500">Stable lending protocol</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">8.2% APY</p>
                <Badge variant="secondary" className="text-xs">
                  Low Risk
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500">
                $13.2B TVL • Audited • Ethereum
              </span>
            </div>
            <Button className="w-full">Invest Now</Button>
          </div>

          <Separator />

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">Compound ETH</h4>
                <p className="text-sm text-gray-500">Ethereum lending</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">12.4% APY</p>
                <Badge variant="outline" className="text-xs">
                  Medium Risk
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-500">
                $8.1B TVL • Audited • Ethereum
              </span>
            </div>
            <Button variant="outline" className="w-full">
              Learn More
            </Button>
          </div>

          <Separator />

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">Yearn Finance</h4>
                <p className="text-sm text-gray-500">Automated yield farming</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">15.8% APY</p>
                <Badge variant="destructive" className="text-xs">
                  High Risk
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-500">
                $2.8B TVL • Audited • Multi-chain
              </span>
            </div>
            <Button variant="outline" className="w-full">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-12">
              <div className="text-center">
                <div className="text-lg">💰</div>
                <div className="text-xs">Deposit</div>
              </div>
            </Button>
            <Button variant="outline" className="h-12">
              <div className="text-center">
                <div className="text-lg">📊</div>
                <div className="text-xs">Analytics</div>
              </div>
            </Button>
            <Button variant="outline" className="h-12">
              <div className="text-center">
                <div className="text-lg">⚙️</div>
                <div className="text-xs">Settings</div>
              </div>
            </Button>
            <Button variant="outline" className="h-12">
              <div className="text-center">
                <div className="text-lg">📈</div>
                <div className="text-xs">Portfolio</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainDashboard;
