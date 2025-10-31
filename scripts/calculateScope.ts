/**
 * Calculate the hashed scope for the SelfVerificationRegistry contract deployment
 *
 * This script:
 * 1. Predicts the contract address based on deployer nonce
 * 2. Calculates the scope hash using the predicted address and app name
 *
 * Run this script before deploying to generate the HASHED_SCOPE value
 *
 * Usage:
 * npx ts-node scripts/calculateScope.ts
 */

import { ethers } from "ethers";
import { hashEndpointWithScope } from "@selfxyz/core";
import * as dotenv from "dotenv";

dotenv.config();

const APP_NAME = "YieldMaker";

async function main() {
  // Get environment variables
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.CELO_TESTNET_RPC_URL || "https://alfajores-forno.celo-testnet.org"

  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found in environment variables");
  }

  // Connect to network
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("\n=== YieldMaker Scope Calculation ===");
  console.log("Deployer address:", wallet.address);

  // Get current nonce
  const nonce = await wallet.getNonce();
  console.log("Current nonce:", nonce);

  // Predict the contract address
  const predictedAddress = ethers.getCreateAddress({
    from: wallet.address,
    nonce: nonce,
  });

  console.log("Predicted contract address:", predictedAddress);

  // Calculate the hashed scope
  const hashedScope = hashEndpointWithScope(predictedAddress, APP_NAME);

  console.log("\n=== Results ===");
  console.log("App name:", APP_NAME);
  console.log("Hashed scope:", hashedScope);
  console.log("\nAdd this to your .env file:");
  console.log(`HASHED_SCOPE=${hashedScope}`);
  console.log("\n  Important: Deploy immediately after running this script");
  console.log("    If you make any transactions, the nonce will change!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
