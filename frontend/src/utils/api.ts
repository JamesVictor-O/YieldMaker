// Utility to send onboarding answers to backend
export async function saveOnboardingAnswers(answers: Record<string, string>) {
  // Replace with your actual API endpoint
  const res = await fetch("/api/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  if (!res.ok) throw new Error("Failed to save onboarding answers");
  return res.json();
}
