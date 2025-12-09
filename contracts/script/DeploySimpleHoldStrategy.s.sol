// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/strategies/SimpleHoldStrategy.sol";

contract DeploySimpleHoldStrategy is Script {
    // Celo Alfajores addresses
    address constant CUSD = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address constant VAULT = 0x67736DF04f47c06274F4Bc73Ecb7B5ae7CB06E91;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy SimpleHoldStrategy
        SimpleHoldStrategy strategy = new SimpleHoldStrategy(CUSD, VAULT);

        console.log("SimpleHoldStrategy deployed to:", address(strategy));
        console.log("Asset (cUSD):", CUSD);
        console.log("Vault:", VAULT);
        console.log("Strategy Owner:", strategy.owner());

        vm.stopBroadcast();
    }
}
