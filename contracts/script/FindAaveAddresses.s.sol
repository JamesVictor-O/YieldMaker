// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";

// Minimal interfaces to query Aave contracts
interface IPoolAddressesProvider {
    function getPool() external view returns (address);

    function getPoolDataProvider() external view returns (address);
}

interface IPoolDataProvider {
    function getReserveTokensAddresses(
        address asset
    )
        external
        view
        returns (
            address aTokenAddress,
            address stableDebtTokenAddress,
            address variableDebtTokenAddress
        );

    function getAllReservesTokens() external view returns (TokenData[] memory);

    struct TokenData {
        string symbol;
        address tokenAddress;
    }
}

contract FindAaveAddresses is Script {
    // Known Aave V3 PoolAddressesProvider addresses (common across networks)
    // These are the typical addresses Aave uses - we'll try them
    address[] public POSSIBLE_PROVIDERS = [
        0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e, // Common Aave V3 provider
        0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb, // Alternative provider
        0xC911B590248d127aD18546B186cC6B324e99F02c // Another common provider
    ];

    // Celo assets we're interested in
    address constant CUSD_CELO_L1 = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1; // This might be different on L2

    function run() external view {
        console.log("=== Searching for Aave V3 addresses on Celo L2 ===");
        console.log("Chain ID:", block.chainid);
        console.log("");

        // Try each possible provider address
        for (uint i = 0; i < POSSIBLE_PROVIDERS.length; i++) {
            address provider = POSSIBLE_PROVIDERS[i];
            console.log("Checking provider:", provider);

            try this.checkProvider(provider) {
                console.log("Found working provider!");
                break;
            } catch {
                console.log("Provider not found or not working");
                console.log("");
            }
        }

        console.log("=== Manual Search Instructions ===");
        console.log("If no providers found, you can:");
        console.log(
            "1. Visit: https://app.aave.com/markets/?marketName=proto_celo_v3"
        );
        console.log("2. Open browser dev tools");
        console.log("3. Look for contract addresses in network requests");
        console.log(
            "4. Or check Celo L2 block explorer for recent Aave transactions"
        );
    }

    function checkProvider(address provider) external view {
        // Check if this address has code
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(provider)
        }

        if (codeSize == 0) {
            revert("No code at address");
        }

        console.log("Found contract at provider address");

        try IPoolAddressesProvider(provider).getPool() returns (address pool) {
            console.log("Pool address:", pool);

            try IPoolAddressesProvider(provider).getPoolDataProvider() returns (
                address dataProvider
            ) {
                console.log("PoolDataProvider address:", dataProvider);

                // Try to get all reserves
                try
                    IPoolDataProvider(dataProvider).getAllReservesTokens()
                returns (IPoolDataProvider.TokenData[] memory tokens) {
                    console.log("Found", tokens.length, "reserve tokens:");
                    for (uint j = 0; j < tokens.length; j++) {
                        console.log(
                            "Token:",
                            tokens[j].symbol,
                            "at",
                            tokens[j].tokenAddress
                        );

                        // Get aToken address for this reserve
                        try
                            IPoolDataProvider(dataProvider)
                                .getReserveTokensAddresses(
                                    tokens[j].tokenAddress
                                )
                        returns (
                            address aToken,
                            address stableDebt,
                            address variableDebt
                        ) {
                            console.log("  aToken:", aToken);
                        } catch {
                            console.log("  Could not get aToken address");
                        }
                    }
                } catch {
                    console.log("Could not get reserve tokens");
                }
            } catch {
                console.log("Could not get PoolDataProvider");
            }
        } catch {
            console.log("Could not get Pool address");
        }
    }
}
