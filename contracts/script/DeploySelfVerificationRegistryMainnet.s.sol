// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import {SelfVerificationRegistry} from "../src/SelfVerificationRegistry.sol";

/**
 * @title DeploySelfVerificationRegistryMainnet
 * @notice Deploy SelfVerificationRegistry to Celo Mainnet with strict safety checks
 * @dev Usage: forge script script/DeploySelfVerificationRegistryMainnet.s.sol --rpc-url $CELO_MAINNET_RPC --broadcast --verify -vvvv
 */
contract DeploySelfVerificationRegistryMainnet is Script {
    // Celo Mainnet Constants
    uint256 constant CELO_MAINNET_CHAIN_ID = 42220;
    address constant SELF_HUB_ADDRESS = 0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF;
    bytes32 constant VERIFICATION_CONFIG_ID = 0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61;

    // Minimum balance required for deployment (mainnet)
    uint256 constant MIN_DEPLOYER_BALANCE = 1 ether; // 1 CELO

    function setUp() public {}

    function run() public {
        // Get deployer private key from environment
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        // Get hashed scope from environment (calculated via scripts/calculateScope.ts)
        uint256 scope = vm.envUint("HASHED_SCOPE");

        // STRICT SAFETY CHECKS FOR MAINNET
        require(block.chainid == CELO_MAINNET_CHAIN_ID, "Must deploy to Celo Mainnet (42220)");
        require(deployer.balance >= MIN_DEPLOYER_BALANCE, "Deployer balance too low (need >= 1 CELO)");

        console2.log("\n=== DEPLOYING TO CELO MAINNET ===");
        console2.log("WARNING: THIS WILL COST REAL FUNDS");
        console2.log("==================================\n");

        console2.log("Network: Celo Mainnet");
        console2.log("Chain ID:", block.chainid);
        console2.log("Deployer:", deployer);
        console2.log("Balance:", deployer.balance / 1e18, "CELO");
        console2.log("Self Hub:", SELF_HUB_ADDRESS);
        console2.log("Scope (HASHED_SCOPE):", scope);
        console2.log("Verification Config ID:");
        console2.logBytes32(VERIFICATION_CONFIG_ID);

        console2.log("\n!!! FINAL WARNING !!!");
        console2.log("- Ensure HASHED_SCOPE is calculated correctly");
        console2.log("- Ensure you have NOT made any transactions since calculating scope");
        console2.log("- This deployment will be PERMANENT and IMMUTABLE");
        console2.log("");

        vm.startBroadcast(deployerKey);

        SelfVerificationRegistry registry = new SelfVerificationRegistry(
            SELF_HUB_ADDRESS,
            scope,
            VERIFICATION_CONFIG_ID
        );

        vm.stopBroadcast();

        // Post-deployment verification
        console2.log("\n=== DEPLOYMENT SUCCESSFUL ===\n");

        console2.log("SelfVerificationRegistry:", address(registry));
        console2.log("Owner:", registry.owner());
        console2.log("Verification Config ID:");
        console2.logBytes32(registry.verificationConfigId());
        console2.log("\nVerify on explorer:");
        console2.log("https://celoscan.io/address/", vm.toString(address(registry)));

        // Verify contract size
        uint256 size;
        assembly {
            size := extcodesize(registry)
        }
        require(size > 0, "Contract deployment failed - no code at address");
        console2.log("Contract size:", size, "bytes");

        console2.log("\n=== NEXT STEPS ===");
        console2.log("1. Save contract address:", vm.toString(address(registry)));
        console2.log("2. Wait for block explorer verification to complete");
        console2.log("3. Set registry in YieldmakerVault:");
        console2.log("   vault.setVerificationRegistry(", vm.toString(address(registry)), ")");
        console2.log("4. Mark strategies requiring verification:");
        console2.log("   vault.setStrategyVerificationRequirement(<strategy_address>, true)");
        console2.log("5. Test verification flow on mainnet before announcing");
    }
}
