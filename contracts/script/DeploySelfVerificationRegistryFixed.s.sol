// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import {SelfVerificationRegistry} from "../src/SelfVerificationRegistry.sol";

contract DeploySelfVerificationRegistryFixed is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        
        // Fixed values for Celo Alfajores
        address constant SELF_HUB_ADDRESS = 0x68c931C9a534D37aa78094877F46fE46a49F1A51;
        bytes32 constant VERIFICATION_CONFIG_ID = 0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61;
        
        // You need to calculate the scope hash for "YieldMaker"
        // This is typically done with: keccak256(abi.encodePacked("YieldMaker"))
        // For now, using a placeholder - you'll need to calculate this
        uint256 scope = vm.envUint("SELF_SCOPE"); // Set this in your .env

        vm.startBroadcast(deployerKey);

        SelfVerificationRegistry registry = new SelfVerificationRegistry(
            SELF_HUB_ADDRESS,
            scope,
            VERIFICATION_CONFIG_ID
        );

        console2.log("SelfVerificationRegistry deployed:", address(registry));
        console2.log("HubV2:", SELF_HUB_ADDRESS);
        console2.log("Scope:", scope);
        console2.logBytes32(VERIFICATION_CONFIG_ID);

        vm.stopBroadcast();
    }
}
