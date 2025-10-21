// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import {SelfVerificationRegistry} from "../src/SelfVerificationRegistry.sol";

contract DeploySelfVerificationRegistry is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address hubV2 = vm.envAddress("SELF_HUB_V2");
        uint256 scope = vm.envUint("SELF_SCOPE");
        bytes32 configId = vm.envBytes32("SELF_CONFIG_ID");

        vm.startBroadcast(deployerKey);

        SelfVerificationRegistry registry = new SelfVerificationRegistry(
            hubV2,
            scope,
            configId
        );

        console2.log("SelfVerificationRegistry deployed:", address(registry));
        console2.log("HubV2:", hubV2);
        console2.log("Scope:", scope);
        console2.logBytes32(configId);

        vm.stopBroadcast();
    }
}


