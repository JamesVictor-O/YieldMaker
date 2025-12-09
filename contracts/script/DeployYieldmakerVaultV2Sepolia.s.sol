// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/YieldmakerVault.sol";
import "../src/strategies/SimpleHoldStrategy.sol";

/**
 * @title DeployYieldmakerVaultV2Sepolia
 * @notice Deploy YieldmakerVault with SimpleHoldStrategy to Celo Sepolia
 * @dev Usage: forge script script/DeployYieldmakerVaultV2Sepolia.s.sol --rpc-url $CELO_SEPOLIA_RPC --broadcast -vvvv
 */
contract DeployYieldmakerVaultV2Sepolia is Script {
    // Celo Sepolia addresses
    address constant CUSD = 0xEF4d55D6dE8e8d73232827Cd1e9b2F2dBb45bC80;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("\n=== DEPLOYING TO CELO SEPOLIA ===");
        console.log("Deployer:", deployer);
        console.log("Asset (cUSD):", CUSD);
        console.log("Chain ID:", block.chainid);
        require(block.chainid == 11142220, "Must deploy to Celo Sepolia (11142220)");

        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy SimpleHoldStrategy with deployer as temporary vault address
        console.log("\n[1/3] Deploying SimpleHoldStrategy...");
        SimpleHoldStrategy strategy = new SimpleHoldStrategy(CUSD, deployer);
        console.log("SimpleHoldStrategy deployed to:", address(strategy));

        // Step 2: Deploy YieldmakerVault with the strategy
        console.log("\n[2/3] Deploying YieldmakerVault...");
        YieldmakerVault vault = new YieldmakerVault(
            IERC20(CUSD),
            address(strategy)
        );
        console.log("YieldmakerVault deployed to:", address(vault));

        // Step 3: Update strategy's vault address to the actual vault
        console.log("\n[3/3] Updating strategy vault address...");
        strategy.updateVault(address(vault));
        console.log("Strategy vault address updated");

        vm.stopBroadcast();

        // Verify the setup
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Vault Address:", address(vault));
        console.log("Strategy Address:", address(strategy));
        console.log("Vault Asset:", vault.asset());
        console.log("Vault Strategy:", address(vault.strategy()));
        console.log("Vault Owner:", vault.owner());
        console.log("Strategy Owner:", strategy.owner());

        console.log("\nVerify on explorer:");
        console.log("https://celo-sepolia.celoscan.io/address/", vm.toString(address(vault)));
        console.log("https://celo-sepolia.celoscan.io/address/", vm.toString(address(strategy)));

        // Verify contract size
        uint256 vaultSize;
        uint256 strategySize;
        assembly {
            vaultSize := extcodesize(vault)
            strategySize := extcodesize(strategy)
        }
        require(vaultSize > 0, "Vault deployment failed");
        require(strategySize > 0, "Strategy deployment failed");
        console.log("\nVault contract size:", vaultSize, "bytes");
        console.log("Strategy contract size:", strategySize, "bytes");
    }
}
