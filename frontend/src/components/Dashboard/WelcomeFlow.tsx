import React, { useState } from "react";
import { useAccount } from "wagmi";
import { saveOnboardingAnswers } from "../../utils/api";
import { User } from "../../types";
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

interface WelcomeFlowProps {
  user: User;
  onComplete: (riskProfile: "conservative" | "moderate" | "aggressive") => void;
}

const WelcomeFlow: React.FC<WelcomeFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { address } = useAccount();
  const router = useRouter();

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

  const totalSteps = questions.length + 1; // extra step for optional Self verification

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const finalizeOnboarding = async (selfVerified: boolean) => {
    const mergedAnswers = { ...answers, self_verified: selfVerified ? "true" : "false" };
    try {
      await saveOnboardingAnswers(mergedAnswers, address);
    } catch (e) {
      console.error("Failed to save onboarding data:", e);
    }
    const riskProfile = calculateRiskProfile(mergedAnswers);
    if (address) {
      try {
        const localStorageKey = `onboarding_${address}`;
        const onboardingStatus = {
          hasCompletedOnboarding: true,
          riskProfile,
          selfVerified,
        };
        localStorage.setItem(localStorageKey, JSON.stringify(onboardingStatus));
      } catch {}
    }
    onComplete(riskProfile);
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === questions.length - 1) {
      // Move to optional Self verification step
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSelfVerify = async () => {
    // Navigate to verification page; onboarding completion will be updated
    router.push("/verify-self");
  };

  const handleSkipSelf = async () => {
    await finalizeOnboarding(false);
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

  const isQuestionStep = currentStep < questions.length;
  const currentQuestion = isQuestionStep ? questions[currentStep] : undefined;
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="md:h-screen sm:px-6 lg:px-8 flex md:items-center md:justify-center mt-15 md:mt-0">
      <div className="w-full">
        {/* Main Card */}
        <div className=" rounded shadow-xl overflow-hidden">
          {/* Progress Section */}
          <div className="px-6 py-6 sm:px-8 md:border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white md:text-gray-300">
                Step {currentStep + 1} of {totalSteps}
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
              {Array.from({ length: totalSteps }).map((_, index) => (
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

          {/* Content Section */}
          <div className="px-6 md:py-8 sm:px-8">
            {isQuestionStep && currentQuestion ? (
              <>
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
              </>
            ) : (
              <>
                <div className="text-center mb-4 md:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 md:mb-3">
                    Verify with Self (optional)
                  </h2>
                  <p className="text-white md:text-gray-400 text-sm sm:text-base">
                    Get access to more yield opportunities by proving you are a unique human. You can skip this and do it later.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
                  <button
                    onClick={handleSelfVerify}
                    className="px-4 py-3 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    Verify with Self
                  </button>
                  <button
                    onClick={handleSkipSelf}
                    className="px-4 py-3 rounded-xl font-semibold bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              </>
            )}
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

              {isQuestionStep ? (
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
                      ? "Continue"
                      : "Continue"}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSkipSelf}
                    className="px-3 py-2 rounded-xl font-semibold bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={handleSelfVerify}
                    className="px-3 py-2 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    Verify with Self
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeFlow;
