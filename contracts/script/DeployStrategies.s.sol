// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/strategies/AaveStrategy.sol";
import "../src/strategies/CompoundStrategy.sol";
import "../src/strategies/YearnStrategy.sol";
import "../src/strategies/UniswapV3Strategy.sol";
import "../src/YieldmakerVault.sol";

contract DeployStrategies is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address asset = vm.envAddress("ASSET_ADDRESS");
        address vaultAddr = vm.envAddress("VAULT_ADDRESS");

        // Optional dependencies for protocols
        address aavePool = vm.envOr("AAVE_POOL", address(0));
        address compoundComptroller = vm.envOr(
            "COMPOUND_COMPTROLLER",
            address(0)
        );
        address yearnVault = vm.envOr("YEARN_VAULT", address(0));
        address uniswapPool = vm.envOr("UNISWAP_V3_POOL", address(0));

        vm.startBroadcast(deployerKey);

        AaveStrategy aave;
        if (aavePool != address(0)) {
            aave = new AaveStrategy(aavePool, asset, vaultAddr);
            console2.log("AaveStrategy:", address(aave));
        } else {
            console2.log("Skipping AaveStrategy (AAVE_POOL not set)");
        }

        CompoundStrategy compound;
        if (compoundComptroller != address(0)) {
            compound = new CompoundStrategy(
                compoundComptroller,
                asset,
                vaultAddr
            );
            console2.log("CompoundStrategy:", address(compound));
        } else {
            console2.log(
                "Skipping CompoundStrategy (COMPOUND_COMPTROLLER not set)"
            );
        }

        YearnStrategy yearn;
        if (yearnVault != address(0)) {
            yearn = new YearnStrategy(yearnVault, asset, vaultAddr);
            console2.log("YearnStrategy:", address(yearn));
        } else {
            console2.log("Skipping YearnStrategy (YEARN_VAULT not set)");
        }

        UniswapV3Strategy uniswap;
        if (uniswapPool != address(0)) {
            uniswap = new UniswapV3Strategy(uniswapPool, asset, vaultAddr);
            console2.log("UniswapV3Strategy:", address(uniswap));
        } else {
            console2.log(
                "Skipping UniswapV3Strategy (UNISWAP_V3_POOL not set)"
            );
        }

        vm.stopBroadcast();
    }
}
