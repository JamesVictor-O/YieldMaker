import React, { useState } from "react";
import { useAccount } from "wagmi";
import { saveOnboardingAnswers } from "../../utils/api";
import { User } from "../../types";
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from "lucide-react";

interface WelcomeFlowProps {
  user: User;
  onComplete: (riskProfile: "conservative" | "moderate" | "aggressive") => void;
}

const WelcomeFlow: React.FC<WelcomeFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { address } = useAccount();

  const questions = [
    {
      id: "experience",
      question: "How familiar are you with DeFi?",
      subtitle: "This helps us recommend the best strategies for you",
      options: [
        {
          value: "beginner",
          label: "Complete beginner",
          desc: "I'm new to crypto",
        },
        {
          value: "intermediate",
          label: "Some experience",
          desc: "I've used basic crypto apps",
        },
        {
          value: "advanced",
          label: "Very experienced",
          desc: "I understand smart contracts",
        },
      ],
    },
    {
      id: "risk_tolerance",
      question: "How much risk are you comfortable with?",
      subtitle: "We'll match you with appropriate investment strategies",
      options: [
        {
          value: "low",
          label: "Low risk",
          desc: "I prefer stable, predictable returns",
        },
        {
          value: "medium",
          label: "Medium risk",
          desc: "I can handle some volatility for better returns",
        },
        {
          value: "high",
          label: "High risk",
          desc: "I want maximum yields, even with higher risk",
        },
      ],
    },
    {
      id: "investment_amount",
      question: "How much are you planning to invest?",
      subtitle: "This helps us suggest the most cost-effective strategies",
      options: [
        { value: "small", label: "Under $1,000", desc: "Starting small" },
        {
          value: "medium",
          label: "$1,000 - $10,000",
          desc: "Moderate investment",
        },
        {
          value: "large",
          label: "Over $10,000",
          desc: "Significant investment",
        },
      ],
    },
  ];

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save answers to backend
      try {
        await saveOnboardingAnswers(answers, address);
      } catch (e) {
        // Optionally handle error (show toast, etc)
        console.error("Failed to save onboarding data:", e);
      }
      // Calculate risk profile based on answers
      const riskProfile = calculateRiskProfile(answers);
      onComplete(riskProfile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateRiskProfile = (answers: Record<string, string>) => {
    // Simple logic to determine risk profile
    if (answers.risk_tolerance === "low" || answers.experience === "beginner") {
      return "conservative";
    } else if (
      answers.risk_tolerance === "high" &&
      answers.experience === "advanced"
    ) {
      return "aggressive";
    }
    return "moderate";
  };

  const currentQuestion = questions[currentStep];
  const selectedAnswer = answers[currentQuestion.id];
  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="md:h-screen sm:px-6 lg:px-8 flex md:items-center md:justify-center mt-15 md:mt-0">
      <div className="w-full">
        {/* Main Card */}
        <div className=" rounded shadow-xl overflow-hidden">
          {/* Progress Section */}
          <div className="px-6 py-6 sm:px-8 md:border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white md:text-gray-300">
                Step {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-emerald-400">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between mt-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                    index <= currentStep
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-gray-700 border-gray-600 text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Question Section */}
          <div className="px-6 md:py-8 sm:px-8">
            <div className="text-center mb-4 md:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 md:mb-3">
                {currentQuestion.question}
              </h2>
              <p className="text-white md:text-gray-400 text-sm sm:text-base">
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Options */}
            <div className="md:space-y-4 space-y-2">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleAnswer(currentQuestion.id, option.value)
                    }
                    className={`w-full p-4 sm:p-6 text-left border-2 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {isSelected ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="font-semibold text-white mb-1">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-300">
                          {option.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 py-3 mt-2 sm:px-8 md:bg-gray-700 md:border-t border-gray-600">
            <div className="flex flex-row justify-between items-center space-y-4 sm:space-y-0">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-colors ${
                  currentStep === 0
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-300 hover:text-white hover:bg-gray-600"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-semibold transition-all duration-200 transform ${
                  selectedAnswer
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-lg"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>
                  {currentStep === questions.length - 1
                    ? "Complete Setup"
                    : "Continue"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeFlow;
