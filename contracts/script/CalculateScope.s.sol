// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console2.sol";

contract CalculateScope is Script {
    function run() public {
        // Calculate scope hash for "YieldMaker"
        bytes32 scopeHash = keccak256(abi.encodePacked("YieldMaker"));
        uint256 scopeValue = uint256(scopeHash);
        
        console2.log("Scope string: YieldMaker");
        console2.log("Scope hash (bytes32):");
        console2.logBytes32(scopeHash);
        console2.log("Scope value (uint256):", scopeValue);
        
        // This is the value you need to set in your .env as SELF_SCOPE
        console2.log("Set SELF_SCOPE in .env to:", scopeValue);
    }
}




