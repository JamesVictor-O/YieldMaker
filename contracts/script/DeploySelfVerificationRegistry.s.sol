// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import {SelfVerificationRegistry} from "../src/SelfVerificationRegistry.sol";

/**
 * @title DeploySelfVerificationRegistry
 * @notice Deploy SelfVerificationRegistry with automatic network detection
 * @dev Supports Celo Mainnet, Sepolia Testnet, and other networks
 *
 * Usage:
 * - Testnet: forge script script/DeploySelfVerificationRegistry.s.sol --rpc-url $CELO_SEPOLIA_RPC --broadcast -vvvv
 * - Mainnet: forge script script/DeploySelfVerificationRegistry.s.sol --rpc-url $CELO_MAINNET_RPC --broadcast --verify -vvvv
 */
contract DeploySelfVerificationRegistry is Script {
    // Celo Network Constants
    uint256 constant CELO_MAINNET_CHAIN_ID = 42220;
    uint256 constant CELO_SEPOLIA_CHAIN_ID = 11142220;

    // Self Protocol Hub Addresses
    address constant MAINNET_HUB = 0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF;
    address constant TESTNET_HUB = 0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74;

    // Verification Config ID (same for both networks)
    bytes32 constant VERIFICATION_CONFIG_ID = 0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61;

    function setUp() public {}

    function run() public {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        // Get hashed scope from environment (calculated via scripts/calculateScope.ts)
        uint256 scope = vm.envUint("HASHED_SCOPE");

        // Detect network and set appropriate hub address
        address hubAddress;
        string memory networkName;
        uint256 minBalance;
        string memory explorerUrl;

        if (block.chainid == CELO_MAINNET_CHAIN_ID) {
            hubAddress = MAINNET_HUB;
            networkName = "Celo Mainnet";
            minBalance = 1 ether; // 1 CELO for mainnet
            explorerUrl = "https://celoscan.io/address/";

            console2.log("\n!!! WARNING: DEPLOYING TO MAINNET !!!");
            console2.log("!!! Ensure all parameters are correct !!!\n");
        } else if (block.chainid == CELO_SEPOLIA_CHAIN_ID) {
            hubAddress = TESTNET_HUB;
            networkName = "Celo Sepolia Testnet";
            minBalance = 0.1 ether; // 0.1 CELO for testnet
            explorerUrl = "https://celo-sepolia.celoscan.io/address/";
        } else {
            // For local/other networks, use testnet hub as fallback
            hubAddress = TESTNET_HUB;
            networkName = "Local/Unknown Network";
            minBalance = 0;
            explorerUrl = "N/A";

            console2.log("\n!!! WARNING: Unknown network - using testnet hub !!!");
        }

        // Safety check: minimum balance
        require(deployer.balance >= minBalance, "Deployer balance too low");

        console2.log("\n=== DEPLOYING SELF VERIFICATION REGISTRY ===");
        console2.log("Network:", networkName);
        console2.log("Chain ID:", block.chainid);
        console2.log("Deployer:", deployer);
        console2.log("Balance:", deployer.balance / 1e18, "CELO");
        console2.log("Self Hub:", hubAddress);
        console2.log("Scope (HASHED_SCOPE):", scope);
        console2.log("Verification Config ID:");
        console2.logBytes32(VERIFICATION_CONFIG_ID);
        console2.log("");

        vm.startBroadcast(deployerKey);

        SelfVerificationRegistry registry = new SelfVerificationRegistry(
            hubAddress,
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

        if (keccak256(bytes(explorerUrl)) != keccak256(bytes("N/A"))) {
            console2.log("\nVerify on explorer:");
            console2.log(explorerUrl, vm.toString(address(registry)));
        }

        // Verify contract size
        uint256 size;
        assembly {
            size := extcodesize(registry)
        }
        require(size > 0, "Contract deployment failed - no code at address");
        console2.log("Contract size:", size, "bytes");

        console2.log("\n=== NEXT STEPS ===");
        console2.log("1. Verify contract on block explorer (use --verify flag)");
        console2.log("2. Set registry in YieldmakerVault:");
        console2.log("   vault.setVerificationRegistry(", vm.toString(address(registry)), ")");
        console2.log("3. Mark strategies requiring verification:");
        console2.log("   vault.setStrategyVerificationRequirement(<strategy_address>, true)");
    }
}


