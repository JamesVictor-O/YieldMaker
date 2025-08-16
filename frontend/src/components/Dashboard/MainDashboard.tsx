import React from 'react';
import { User } from '../../types';
import AIChat from '../Chat/AIChat';
import WelcomeFlow from './WelcomeFlow';

interface MainDashboardProps {
  user: User;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ user }) => {
  const [showWelcome, setShowWelcome] = React.useState(user.isNewUser);

  const handleWelcomeComplete = (riskProfile: 'conservative' | 'moderate' | 'aggressive') => {
    // Update user profile
    user.riskProfile = riskProfile;
    setShowWelcome(false);
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <WelcomeFlow user={user} onComplete={handleWelcomeComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Portfolio</p>
              <p className="text-2xl font-bold text-gray-900">${user.balance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Earnings</p>
              <p className="text-2xl font-bold text-green-600">$0.00</p>
              <p className="text-xs text-gray-400">0% APY</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Risk Level</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{user.riskProfile || 'Not Set'}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <AIChat user={user} />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Opportunities</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Aave USDC</h4>
                    <p className="text-sm text-gray-500">Stable lending protocol</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">8.2% APY</p>
                    <p className="text-xs text-gray-400">Low Risk</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">$13.2B TVL • Audited • Ethereum</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Invest Now
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Compound ETH</h4>
                    <p className="text-sm text-gray-500">Ethereum lending</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">12.4% APY</p>
                    <p className="text-xs text-gray-400">Medium Risk</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">$8.1B TVL • Audited • Ethereum</span>
                </div>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;