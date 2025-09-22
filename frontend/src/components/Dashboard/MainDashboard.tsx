import React from "react";
import { User } from "../../types";
import InvestmentChat from "../Chat/InvestmentChat";
import WelcomeFlow from "./WelcomeFlow";
import FundsManagement from "./FundsManagement";
import { TrendingUp,  AlertCircle, ExternalLink, Copy } from "lucide-react";

interface MainDashboardProps {
  user: User;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ user }) => {
  const [showWelcome, setShowWelcome] = React.useState(user.isNewUser);
  const [userBalance, setUserBalance] = React.useState(user.balance);

  const handleWelcomeComplete = (
    riskProfile: "conservative" | "moderate" | "aggressive"
  ) => {
    user.riskProfile = riskProfile;
    setShowWelcome(false);
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setUserBalance(newBalance);
    user.balance = newBalance;
  };

  if (showWelcome) {
    return (
      <div className="">
        <WelcomeFlow user={user} onComplete={handleWelcomeComplete} />
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen  text-white p-4 lg:p-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Total Portfolio */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
          
            <span className="text-xs text-gray-400 uppercase tracking-wider">Portfolio</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">
              ${formatNumber(userBalance)}
            </h3>
            <p className="text-sm text-gray-400">Total Value</p>
          </div>
        </div>

        {/* Current Earnings */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
           
            <span className="text-xs text-gray-400 uppercase tracking-wider">Earnings</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-green-400">$3,945</h3>
            <p className="text-sm text-gray-400">+8.2% APY</p>
          </div>
        </div>
        {/* Risk Level */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            
            <span className="text-xs text-gray-400 uppercase tracking-wider">Risk</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white capitalize">
              {user.riskProfile || "Not Set"}
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                user.riskProfile === "conservative" ? "bg-green-500" :
                user.riskProfile === "moderate" ? "bg-yellow-500" :
                user.riskProfile === "aggressive" ? "bg-red-500" : "bg-gray-500"
              }`}></div>
              <p className="text-sm text-gray-400">
                {user.riskProfile === "conservative" ? "Low Risk" :
                 user.riskProfile === "moderate" ? "Medium Risk" :
                 user.riskProfile === "aggressive" ? "High Risk" : "Not Set"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>
        
        
        {/* Portfolio Value */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-300"> Current Portfolio Balance</h3>
            <div className="flex items-center space-x-2">
              <Copy className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
              <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">${userBalance.toFixed(2)}</h2>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Investment Chat */}
        <div className="xl:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">AI Investment Assistant</h3>
            <InvestmentChat user={user} />
          </div>
        </div>

        {/* Funds Management */}
        <div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Manage Funds</h3>
            <FundsManagement
              userBalance={userBalance}
              onBalanceUpdate={handleBalanceUpdate}
            />
          </div>
        </div>
      </div>

      {/* Active Positions */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Active Positions</h3>
        
        <div className="space-y-4">
          {/* Position 1 */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AA</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Aave USDC</h4>
                  <p className="text-sm text-gray-400">Stable lending protocol</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-400">8.2% APY</p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-400">Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">$13.2B TVL • Ethereum</span>
              <button className="text-blue-400 hover:text-blue-300 font-medium">
                Manage
              </button>
            </div>
          </div>

          {/* Position 2 */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CE</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Compound ETH</h4>
                  <p className="text-sm text-gray-400">Ethereum lending</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-400">12.4% APY</p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-400">Medium Risk</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">$8.1B TVL • Ethereum</span>
              <button className="text-blue-400 hover:text-blue-300 font-medium">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Opportunities */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Available Opportunities</h3>
          <button className="text-blue-400 hover:text-blue-300 font-medium">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Opportunity 1 */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">YF</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Yearn Finance</h4>
                  <p className="text-xs text-gray-400">Yield farming</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-400">15.8%</p>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-400">High</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mb-3">$2.8B TVL • Multi-chain</div>
            <button className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors">
              Explore
            </button>
          </div>

          {/* Opportunity 2 */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">LP</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Liquidity Pool</h4>
                  <p className="text-xs text-gray-400">DEX farming</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-400">22.1%</p>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-400">High</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mb-3">$445M TVL • Polygon</div>
            <button className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors">
              Explore
            </button>
          </div>

          {/* Opportunity 3 */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">ST</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Stablecoin Farm</h4>
                  <p className="text-xs text-gray-400">Low risk yield</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-400">6.5%</p>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-400">Low</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mb-3">$8.9B TVL • Arbitrum</div>
            <button className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors">
              Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;