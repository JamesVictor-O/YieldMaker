// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import {SelfVerificationRegistry} from "../src/SelfVerificationRegistry.sol";

/**
 * @title DeploySelfVerificationRegistryFixed
 * @notice Deploy SelfVerificationRegistry to Celo Alfajores Testnet with safety checks
 * @dev Usage: forge script script/DeploySelfVerificationRegistryFixed.s.sol --rpc-url $CELO_ALFAJORES_RPC --broadcast --verify -vvvv
 */
contract DeploySelfVerificationRegistryFixed is Script {
    // Celo Alfajores Testnet Constants
    uint256 constant CELO_ALFAJORES_CHAIN_ID = 44787;
    address constant SELF_HUB_ADDRESS = 0x68c931C9a534D37aa78094877F46fE46a49F1A51; // Self Hub on Alfajores
    bytes32 constant VERIFICATION_CONFIG_ID = 0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61;

    // Minimum balance required for deployment (testnet)
    uint256 constant MIN_DEPLOYER_BALANCE = 0.1 ether; // 0.1 CELO

    function setUp() public {}

    function run() public {
        // Get deployer private key from environment
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        // Get hashed scope from environment (calculated via scripts/calculateScope.ts)
        uint256 scope = vm.envUint("HASHED_SCOPE");

        // Safety checks
        require(block.chainid == CELO_ALFAJORES_CHAIN_ID, "Must deploy to Celo Alfajores (44787)");
        require(deployer.balance >= MIN_DEPLOYER_BALANCE, "Deployer balance too low (need >= 0.1 CELO)");

        console2.log("\n=== DEPLOYING TO CELO ALFAJORES TESTNET ===");
        console2.log("Chain ID:", block.chainid);
        console2.log("Deployer:", deployer);
        console2.log("Balance:", deployer.balance / 1e18, "CELO");
        console2.log("Self Hub:", SELF_HUB_ADDRESS);
        console2.log("Scope (HASHED_SCOPE):", scope);
        console2.log("Verification Config ID:");
        console2.logBytes32(VERIFICATION_CONFIG_ID);
        console2.log("");

        vm.startBroadcast(deployerKey);

        SelfVerificationRegistry registry = new SelfVerificationRegistry(
            SELF_HUB_ADDRESS,
            scope,
            VERIFICATION_CONFIG_ID
        );

        vm.stopBroadcast();

        // Post-deployment verification
        console2.log("\n=== DEPLOYMENT SUCCESSFUL ===");
        console2.log("SelfVerificationRegistry:", address(registry));
        console2.log("Owner:", registry.owner());
        console2.log("Verification Config ID:");
        console2.logBytes32(registry.verificationConfigId());
        console2.log("\nVerify on explorer:");
        console2.log("https://alfajores.celoscan.io/address/", vm.toString(address(registry)));

        // Verify contract size
        uint256 size;
        assembly {
            size := extcodesize(registry)
        }
        require(size > 0, "Contract deployment failed - no code at address");
        console2.log("Contract size:", size, "bytes");

        console2.log("\n=== NEXT STEPS ===");
        console2.log("1. Verify contract on block explorer (if --verify flag was used)");
        console2.log("2. Set registry in YieldmakerVault:");
        console2.log("   vault.setVerificationRegistry(", vm.toString(address(registry)), ")");
        console2.log("3. Mark strategies requiring verification:");
        console2.log("   vault.setStrategyVerificationRequirement(<strategy_address>, true)");
    }
}
