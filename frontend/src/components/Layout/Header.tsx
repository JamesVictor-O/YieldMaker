import React from 'react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          
          <span className="text-xl font-bold text-gray-900">Yieldmaker</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">{formatAddress(user.address)}</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Portfolio Value</p>
            <p className="font-semibold text-gray-900">${user.balance.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
