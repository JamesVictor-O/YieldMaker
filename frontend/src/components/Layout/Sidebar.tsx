import React, { useState } from 'react';

const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', name: 'AI Assistant', icon: '💬' },
    { id: 'portfolio', name: 'Portfolio', icon: '📊' },
    { id: 'opportunities', name: 'Opportunities', icon: '🎯' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
