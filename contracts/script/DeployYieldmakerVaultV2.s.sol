// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/YieldmakerVault.sol";
import "../src/SimpleHoldStrategy.sol";

contract DeployYieldmakerVaultV2 is Script {
    // Celo Alfajores addresses
    address constant CUSD = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deployer:", deployer);
        console.log("Asset (cUSD):", CUSD);

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
        console.log("=== Deployment Summary ===");
        console.log("Vault Address:", address(vault));
        console.log("Strategy Address:", address(strategy));
        console.log("Vault Asset:", vault.asset());
        console.log("Vault Strategy:", address(vault.strategy()));
        console.log("Vault Owner:", vault.owner());
        console.log("Strategy Owner:", strategy.owner());

        vm.stopBroadcast();
    }
}
