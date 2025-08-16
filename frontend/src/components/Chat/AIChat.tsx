import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, User, Protocol } from '../../types';

interface AIChatProps {
  user: User;
}

const AIChat: React.FC<AIChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hi! I'm your DeFi assistant. I can see you have $${user.balance.toLocaleString()} in your wallet. What would you like to do today?`,
      timestamp: new Date(),
      suggestions: [
        "Find safe yield opportunities",
        "Explain DeFi basics to me",
        "Show me high APY options",
        "Help me diversify my portfolio"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(content, user),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, user: User): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('safe') || input.includes('low risk')) {
      return `Based on your profile, I recommend Aave USDC lending at 8.2% APY. It's audited by multiple firms, has $13B+ TVL, and is considered very safe. Would you like me to help you deposit some funds?`;
    } else if (input.includes('high') || input.includes('apy')) {
      return `For higher yields, I found Compound ETH lending at 12.4% APY. It has strong security track record and $8B TVL. However, it carries moderate risk due to ETH price volatility. Should I explain the risks?`;
    } else if (input.includes('explain') || input.includes('basics')) {
      return `DeFi (Decentralized Finance) lets you earn interest by lending your crypto to others. Think of it like a savings account, but with higher returns. The protocols I recommend are all audited and battle-tested. What specific part would you like me to explain?`;
    } else {
      return `I understand you're looking for yield opportunities. Based on your $${user.balance.toLocaleString()} balance, I can suggest several options. What's your risk tolerance - conservative, moderate, or aggressive?`;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-2xl border border-gray-200">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">AI</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Yieldmaker AI</h3>
          <p className="text-sm text-gray-500">Your DeFi investment assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white rounded-br-sm' 
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            }`}>
              <p>{message.content}</p>
              {message.suggestions && (
                <div className="mt-3 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left p-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder="Ask me anything about DeFi yields..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim()}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;