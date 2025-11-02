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

  const [isNavigating, setIsNavigating] = useState(false);
  const handleSelfVerify = async () => {
    if (isNavigating) return;
    setIsNavigating(true);
    // Persist the user's answers so the welcome flow is not shown again
    try {
      await finalizeOnboarding(false);
    } catch {}
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
    <div className="min-h-screen flex flex-col pt-14 ">
      <div className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className="max-w-xl mx-auto rounded-2xl border border-gray-800 bg-gray-900">
          {/* Progress Section */}
          <div className="px-4 py-4 sm:px-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white md:text-gray-300">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-emerald-400">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 w-full bg-gray-800 rounded-full h-1 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between mt-3">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300 ${
                    index <= currentStep
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400"
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
          <div className="px-4 py-5 sm:px-6">
            {isQuestionStep && currentQuestion ? (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-lg sm:text-2xl font-semibold text-white mb-1">
                    {currentQuestion.question}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {currentQuestion.subtitle}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedAnswer === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleAnswer(currentQuestion.id, option.value)
                        }
                        className={`w-full p-4 text-left border rounded-xl transition-colors ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-600/10"
                            : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {isSelected ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium text-white mb-0.5">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-400">
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
                <div className="text-center mb-4">
                  <h2 className="text-lg sm:text-2xl font-semibold text-white mb-1">
                    Verify with Self (optional)
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Get access to more yield opportunities by proving you are a unique human. You can always do this later.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 px-4 py-3 border-t border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80">
            <div className="max-w-xl mx-auto flex flex-row justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${
                  currentStep === 0
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              {isQuestionStep ? (
                <button
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                    selectedAnswer
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
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
                    className="px-3 py-2 rounded-lg font-semibold bg-gray-800 text-gray-200 hover:bg-gray-700"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={handleSelfVerify}
                    disabled={isNavigating}
                    className={`px-3 py-2 rounded-lg font-semibold text-white ${
                      isNavigating
                        ? "bg-emerald-700/60 cursor-wait"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {isNavigating ? "Opening..." : "Verify with Self"}
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
