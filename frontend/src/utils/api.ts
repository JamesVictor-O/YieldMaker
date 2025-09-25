// Utility to send onboarding answers to backend
export async function saveOnboardingAnswers(
  answers: Record<string, string>,
  walletAddress?: string
) {
  // Prepare data for backend
  const onboardingData = {
    ...answers,
    walletAddress,
    timestamp: new Date().toISOString(),
  };

  // Replace with your actual API endpoint
  const res = await fetch("/api/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(onboardingData),
  });

  if (!res.ok) throw new Error("Failed to save onboarding answers");

  const result = await res.json();

  // Backend should:
  // 1. Store detailed answers in database
  // 2. Calculate risk profile
  // 3. Optionally call UserProfileRegistry.updateProfile() on-chain
  // 4. Return the calculated risk profile

  return result;
}

// Utility to get user profile from backend
export async function getUserProfile(walletAddress: string) {
  const res = await fetch(`/api/user/profile?address=${walletAddress}`);
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

// Utility to update user preferences (backend only)
export async function updateUserPreferences(
  walletAddress: string,
  preferences: Record<string, unknown>
) {
  const res = await fetch("/api/user/preferences", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, preferences }),
  });
  if (!res.ok) throw new Error("Failed to update preferences");
  return res.json();
}
