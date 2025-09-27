import { useState } from "react";
import { Button } from "../ui/button";
import { useSetStrategy } from "../../hooks/contracts/useSetStrategy";
import { CONTRACT_ADDRESSES } from "@/contracts/addresses";

const StrategyUpdater = () => {
  const { setStrategy, isPending, isConfirming, isConfirmed, error } =
    useSetStrategy();
  const [hasUpdated, setHasUpdated] = useState(false);

  const handleUpdateStrategy = () => {
    setStrategy(CONTRACT_ADDRESSES.SIMPLE_HOLD_STRATEGY);
    setHasUpdated(true);
  };

  if (isConfirmed && hasUpdated) {
    return (
      <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 mb-4">
        <h3 className="text-green-400 font-semibold mb-2">
          ✅ Strategy Updated Successfully!
        </h3>
        <p className="text-gray-300 text-sm">
          Your vault is now using the working strategy. Try making a deposit!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mb-4">
      <h3 className="text-yellow-400 font-semibold mb-2">
        ⚠️ Vault Strategy Fix Required
      </h3>
      <p className="text-gray-300 text-sm mb-3">
        Your vault is currently using a broken strategy that prevents deposits.
        Click below to update to the working strategy.
      </p>

      <Button
        onClick={handleUpdateStrategy}
        disabled={isPending || isConfirming}
        className="bg-yellow-600 hover:bg-yellow-700 text-white"
      >
        {isPending || isConfirming ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {isPending ? "Updating Strategy..." : "Confirming..."}
          </>
        ) : (
          "Fix Vault Strategy"
        )}
      </Button>

      {error && (
        <p className="text-red-400 text-sm mt-2">Error: {error.message}</p>
      )}
    </div>
  );
};

export default StrategyUpdater;
