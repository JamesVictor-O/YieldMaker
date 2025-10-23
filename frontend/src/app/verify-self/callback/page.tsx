"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";

function CallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { address } = useAccount();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    // Placeholder: In a real setup, verify the proof server-side here
    const result = params.get("result");
    const ok = result === "success" || !result; // default to success during stub
    if (ok && address) {
      try {
        const key = `onboarding_${address}`;
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : {};
        const updated = { ...parsed, selfVerified: true, hasCompletedOnboarding: true };
        localStorage.setItem(key, JSON.stringify(updated));
        setStatus("success");
        setTimeout(() => router.replace("/dashboard"), 800);
      } catch {
        setStatus("error");
      }
    } else {
      setStatus("error");
    }
  }, [params, address, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full text-white text-center">
        {status === "verifying" && <p>Verifying your proof...</p>}
        {status === "success" && <p>Verified! Redirecting...</p>}
        {status === "error" && (
          <div>
            <p className="mb-3">Verification failed. Please try again.</p>
            <button
              onClick={() => router.push("/verify-self")}
              className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              Retry Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifySelfCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <CallbackContent />
    </Suspense>
  );
}


