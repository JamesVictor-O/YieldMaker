'use client';

import { useFarcasterSDK } from '@/hooks/useFarcasterSDK';

export default function FarcasterIndicator() {
  const { isInFarcaster } = useFarcasterSDK();

  if (!isInFarcaster) {
    return null;
  }

  return (
    <div className="bg-purple-600 text-white px-4 py-2 text-center text-sm font-medium">
      🚀 Running in Farcaster MiniApp
    </div>
  );
}
