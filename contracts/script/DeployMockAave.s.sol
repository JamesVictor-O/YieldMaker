// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import "../src/mocks/MockAavePool.sol";
import "../src/strategies/AaveStrategy.sol";

contract DeployMockAave is Script {
    // Celo Alfajores addresses
    address constant CUSD_TOKEN = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1; // cUSD on Alfajores
    address constant VAULT_ADDRESS = 0xd1DE9b72508BCDF6914575a9E99D31a99413AC1F; // YieldMaker Vault

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying Mock Aave Pool and Strategy...");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("cUSD Token:", CUSD_TOKEN);
        console.log("Vault:", VAULT_ADDRESS);

        // 1. Deploy MockAavePool
        MockAavePool mockPool = new MockAavePool();
        console.log("MockAavePool deployed at:", address(mockPool));

        // 2. Deploy MockAToken for cUSD
        MockAToken acUSD = new MockAToken(
            "Aave cUSD",
            "acUSD",
            address(mockPool),
            CUSD_TOKEN
        );
        console.log("MockAToken (acUSD) deployed at:", address(acUSD));

        // 3. Initialize the reserve in the pool
        mockPool.initReserve(CUSD_TOKEN, address(acUSD));
        console.log("Reserve initialized for cUSD");

        // 4. Deploy AaveStrategy pointing to our mock pool
        AaveStrategy aaveStrategy = new AaveStrategy(
            address(mockPool),
            CUSD_TOKEN,
            VAULT_ADDRESS
        );
        console.log("AaveStrategy deployed at:", address(aaveStrategy));

        // 5. Verify the deployment
        console.log("Strategy asset:", address(aaveStrategy.asset()));
        console.log("Strategy vault:", aaveStrategy.vault());
        console.log("Strategy owner:", aaveStrategy.owner());
        console.log("Strategy aToken:", address(aaveStrategy.aToken()));

        // 6. Check mock pool configuration
        console.log(
            "Current APY:",
            mockPool.getCurrentAPY(CUSD_TOKEN),
            "basis points"
        );

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("MockAavePool:", address(mockPool));
        console.log("MockAToken (acUSD):", address(acUSD));
        console.log("AaveStrategy:", address(aaveStrategy));
        console.log("Expected APY: ~8.2%");
        console.log("\nUpdate your frontend with these addresses!");
    }
}
