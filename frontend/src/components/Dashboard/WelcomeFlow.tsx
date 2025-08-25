import React, { useState } from 'react';
import { User } from '../../types';

interface WelcomeFlowProps {
  user: User;
  onComplete: (riskProfile: 'conservative' | 'moderate' | 'aggressive') => void;
}

const WelcomeFlow: React.FC<WelcomeFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: 'experience',
      question: "How familiar are you with DeFi?",
      options: [
        { value: 'beginner', label: "Complete beginner - I'm new to crypto" },
        { value: 'intermediate', label: "Some experience - I've used basic crypto apps" },
        { value: 'advanced', label: "Very experienced - I understand smart contracts" }
      ]
    },
    {
      id: 'risk_tolerance',
      question: "How much risk are you comfortable with?",
      options: [
        { value: 'low', label: "Low - I prefer stable, predictable returns" },
        { value: 'medium', label: "Medium - I can handle some volatility for better returns" },
        { value: 'high', label: "High - I want maximum yields, even with higher risk" }
      ]
    },
    {
      id: 'investment_amount',
      question: "How much are you planning to invest?",
      options: [
        { value: 'small', label: "Under $1,000" },
        { value: 'medium', label: "$1,000 - $10,000" },
        { value: 'large', label: "Over $10,000" }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate risk profile based on answers
      const riskProfile = calculateRiskProfile(answers);
      onComplete(riskProfile);
    }
  };

  const calculateRiskProfile = (answers: Record<string, string>) => {
    // Simple logic to determine risk profile
    if (answers.risk_tolerance === 'low' || answers.experience === 'beginner') {
      return 'conservative';
    } else if (answers.risk_tolerance === 'high' && answers.experience === 'advanced') {
      return 'aggressive';
    }
    return 'moderate';
  };

  const currentQuestion = questions[currentStep];
  const selectedAnswer = answers[currentQuestion.id];

  return (
    <div className="max-w-2xl  mx-auto bg-white rounded-2xl p-8 border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Yieldmaker! 👋</h2>
          <span className="text-sm text-gray-500">{currentStep + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(currentQuestion.id, option.value)}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                selectedAnswer === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedAnswer === option.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
                <span className="text-gray-900">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-6 py-2 text-gray-600 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentStep === questions.length - 1 ? 'Complete Setup' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default WelcomeFlow;