// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/mocks/MockAavePool.sol";
import "../src/AaveStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";

// Mock ERC20 token for testing
contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10 ** 18); // Mint 1M tokens
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract MockAavePoolTest is Test {
    MockAavePool public pool;
    MockAToken public aToken;
    MockERC20 public asset;
    AaveStrategy public strategy;

    address public user = address(0x1);
    address public vault = address(0x2);
    uint256 public constant DEPOSIT_AMOUNT = 1000 * 10 ** 18; // 1000 tokens

    function setUp() public {
        // Deploy mock asset (cUSD)
        asset = new MockERC20("Mock cUSD", "cUSD");

        // Deploy mock pool
        pool = new MockAavePool();

        // Deploy mock aToken
        aToken = new MockAToken(
            "Aave cUSD",
            "acUSD",
            address(pool),
            address(asset)
        );

        // Initialize reserve
        pool.initReserve(address(asset), address(aToken));

        // Deploy strategy
        strategy = new AaveStrategy(address(pool), address(asset), vault);

        // Setup user with tokens
        asset.mint(user, DEPOSIT_AMOUNT * 10);
        vm.prank(user);
        asset.approve(address(pool), type(uint256).max);

        // Setup strategy with tokens for testing
        asset.mint(address(strategy), DEPOSIT_AMOUNT);

        // Give strategy approval to spend its own tokens
        vm.prank(address(strategy));
        asset.approve(address(pool), type(uint256).max);

        // Pre-fund the pool with extra liquidity to cover interest payments
        // This simulates other users' deposits and borrower interest payments
        asset.mint(address(pool), DEPOSIT_AMOUNT * 5);
    }

    function testPoolInitialization() public {
        DataTypes.ReserveData memory reserveData = pool.getReserveData(
            address(asset)
        );

        assertEq(reserveData.aTokenAddress, address(aToken));
        assertGt(reserveData.liquidityIndex, 0);
        assertGt(reserveData.currentLiquidityRate, 0);
    }

    function testSupplyAndWithdraw() public {
        vm.startPrank(user);

        // Supply tokens
        pool.supply(address(asset), DEPOSIT_AMOUNT, user, 0);

        // Check balances
        assertEq(pool.getUserBalance(address(asset), user), DEPOSIT_AMOUNT);
        assertEq(aToken.balanceOf(user), DEPOSIT_AMOUNT);

        // Wait some time to accrue interest
        vm.warp(block.timestamp + 365 days); // 1 year

        // Check interest accrued (should be around 8.2% more)
        uint256 balanceAfterYear = pool.getUserBalance(address(asset), user);
        console.log("Balance after 1 year:", balanceAfterYear);
        console.log("Expected interest:", (DEPOSIT_AMOUNT * 82) / 1000); // ~8.2%

        // Should have earned approximately 8.2% interest
        assertGt(balanceAfterYear, DEPOSIT_AMOUNT);
        assertLt(balanceAfterYear, (DEPOSIT_AMOUNT * 11) / 10); // Less than 10% to be safe

        // Withdraw all
        uint256 withdrawAmount = pool.withdraw(
            address(asset),
            type(uint256).max,
            user
        );
        assertEq(withdrawAmount, balanceAfterYear);
        assertEq(pool.getUserBalance(address(asset), user), 0);

        vm.stopPrank();
    }

    function testStrategyIntegration() public {
        // Test that our AaveStrategy works with the mock pool
        vm.startPrank(vault);

        // Strategy should be able to invest
        strategy.invest(DEPOSIT_AMOUNT);

        // Check that tokens were deposited
        assertEq(strategy.totalAssets(), DEPOSIT_AMOUNT);

        // Wait some time for interest
        vm.warp(block.timestamp + 30 days);

        // Total assets should have grown
        uint256 assetsAfterMonth = strategy.totalAssets();
        assertGt(assetsAfterMonth, DEPOSIT_AMOUNT);

        // Strategy should be able to withdraw (withdraw only the original amount for now)
        strategy.withdraw(DEPOSIT_AMOUNT);

        // Check that assets were withdrawn to vault
        assertGt(asset.balanceOf(vault), 0);

        vm.stopPrank();
    }

    function testAPYCalculation() public {
        uint256 apy = pool.getCurrentAPY(address(asset));
        console.log("Current APY (basis points):", apy);

        // Should be around 820 basis points (8.2%)
        assertGt(apy, 800);
        assertLt(apy, 850);
    }

    function testEmergencyWithdraw() public {
        vm.startPrank(vault);

        // Invest some funds
        strategy.invest(DEPOSIT_AMOUNT);

        // Emergency withdraw should get all funds back
        uint256 vaultBalanceBefore = asset.balanceOf(vault);
        strategy.emergencyWithdraw();
        uint256 vaultBalanceAfter = asset.balanceOf(vault);

        assertGt(vaultBalanceAfter, vaultBalanceBefore);
        assertEq(strategy.totalAssets(), 0);

        vm.stopPrank();
    }

    function testInterestAccrual() public {
        vm.startPrank(user);

        // Supply tokens
        pool.supply(address(asset), DEPOSIT_AMOUNT, user, 0);

        uint256 initialBalance = pool.getUserBalance(address(asset), user);

        // Fast forward 1 day
        vm.warp(block.timestamp + 1 days);

        uint256 balanceAfterDay = pool.getUserBalance(address(asset), user);

        // Should have earned some interest
        assertGt(balanceAfterDay, initialBalance);

        console.log("Initial balance:", initialBalance);
        console.log("Balance after 1 day:", balanceAfterDay);
        console.log("Daily interest earned:", balanceAfterDay - initialBalance);

        vm.stopPrank();
    }
}
