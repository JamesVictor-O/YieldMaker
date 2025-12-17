// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import "../src/strategies/AaveStrategy.sol";

contract DeployAaveStrategy is Script {
    // Celo L2 Addresses - TODO: Replace with actual addresses
    address constant AAVE_POOL = 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951; // TODO: Get actual Aave V3 Pool address on Celo L2
    address constant CUSD_TOKEN = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1; // cUSD on Celo (this might be different on L2)
    address constant VAULT_ADDRESS = 0xd1DE9b72508BCDF6914575a9E99D31a99413AC1F; // YieldMaker Vault address

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying AaveStrategy...");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Aave Pool:", AAVE_POOL);
        console.log("Asset (cUSD):", CUSD_TOKEN);
        console.log("Vault:", VAULT_ADDRESS);

        // Deploy the Aave Strategy
        AaveStrategy aaveStrategy = new AaveStrategy(
            AAVE_POOL,
            CUSD_TOKEN,
            VAULT_ADDRESS
        );

        console.log("AaveStrategy deployed at:", address(aaveStrategy));

        // Verify the deployment
        console.log("Strategy asset:", address(aaveStrategy.asset()));
        console.log("Strategy vault:", aaveStrategy.vault());
        console.log("Strategy owner:", aaveStrategy.owner());

        // Get the aToken address
        console.log("aToken address:", address(aaveStrategy.aToken()));

        vm.stopBroadcast();
    }
}
