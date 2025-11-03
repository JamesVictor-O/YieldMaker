// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/YieldmakerVault.sol";
import "../src/SimpleHoldStrategy.sol";

contract DeployYieldmakerVaultV2Mainnet is Script {
    // Celo Mainnet addresses
    address constant CUSD = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
    uint256 constant CELO_MAINNET_CHAIN_ID = 42220;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // STRICT SAFETY CHECK FOR MAINNET
        require(block.chainid == CELO_MAINNET_CHAIN_ID, "Must deploy to Celo Mainnet (42220)");
        require(deployer.balance >= 1 ether, "Deployer balance too low (need >= 1 CELO)");

        console.log("\n=== DEPLOYING TO CELO MAINNET ===");
        console.log("WARNING: THIS WILL COST REAL FUNDS");
        console.log("==================================\n");

        console.log("Deployer:", deployer);
        console.log("Asset (cUSD):", CUSD);
        console.log("Chain ID:", block.chainid);

        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy SimpleHoldStrategy with deployer as temporary vault address
        SimpleHoldStrategy strategy = new SimpleHoldStrategy(CUSD, deployer);
        console.log("SimpleHoldStrategy deployed to:", address(strategy));

        // Step 2: Deploy YieldmakerVault with the strategy
        YieldmakerVault vault = new YieldmakerVault(
            IERC20(CUSD),
            address(strategy)
        );
        console.log("YieldmakerVault deployed to:", address(vault));

        // Step 3: Update strategy's vault address to the actual vault
        strategy.updateVault(address(vault));
        console.log("Strategy vault address updated");

        // Step 4: Verify the setup
        console.log("\n=== Deployment Summary ===");
        console.log("Network: Celo Mainnet");
        console.log("Vault Address:", address(vault));
        console.log("Strategy Address:", address(strategy));
        console.log("Vault Asset:", vault.asset());
        console.log("Vault Strategy:", address(vault.strategy()));
        console.log("Vault Owner:", vault.owner());
        console.log("Strategy Owner:", strategy.owner());

        vm.stopBroadcast();

        console.log("\n=== MAINNET DEPLOYMENT SUCCESSFUL ===\n");

        console.log("Verify contracts on:");
        console.log("https://celoscan.io/address/", vm.toString(address(vault)));
        console.log("https://celoscan.io/address/", vm.toString(address(strategy)));
    }
}
