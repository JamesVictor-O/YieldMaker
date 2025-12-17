// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/YieldmakerVault.sol";
import "../src/interfaces/IStrategy.sol";
import "../src/strategies/NullStrategy.sol";

contract DeployYieldmakerVault is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address asset = vm.envAddress("ASSET_ADDRESS");

        vm.startBroadcast(deployerKey);

        IStrategy placeholder = IStrategy(address(new NullStrategy()));
        YieldmakerVault vault = new YieldmakerVault(
            IERC20(asset),
            address(placeholder)
        );

        console2.log("Vault deployed:", address(vault));
        console2.log("Placeholder strategy:", address(placeholder));

        vm.stopBroadcast();
    }
}
