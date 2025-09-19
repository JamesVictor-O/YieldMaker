// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AaveStrategy.sol";
import "../src/mocks/MockERC20.sol";
import "../src/mocks/MockLendingPool.sol";

contract AaveStrategyTest is Test {
    AaveStrategy public strategy;
    MockERC20 public asset;
    MockLendingPool public lendingPool;
    address public owner = address(this);
    address public user = address(0x123);
    address public vault = address(0xBEEF);

    function setUp() public {
        asset = new MockERC20("Mock USDC", "mUSDC", 6);
        lendingPool = new MockLendingPool(address(asset));
        strategy = new AaveStrategy(
            address(lendingPool),
            address(asset),
            vault
        );
        asset.mint(user, 1_000_000e6);
        vm.prank(user);
        asset.approve(address(strategy), type(uint256).max);
    }

    function testInitialState() public {
        assertEq(address(strategy.asset()), address(asset));
        assertEq(asset.balanceOf(address(strategy)), 0);
    }

    function testInvestAndWithdraw() public {
        uint256 amount = 1000e6;
        vm.prank(user);
        strategy.invest(amount);
        assertEq(asset.balanceOf(address(lendingPool)), amount);

        // Simulate yield
        lendingPool.simulateYield(100e6);

        vm.prank(user);
        strategy.withdraw(amount);
        assertEq(asset.balanceOf(address(strategy)), amount + 100e6);
    }

    function testEmergencyWithdrawOnlyOwner() public {
        uint256 amount = 500e6;
        vm.prank(user);
        strategy.invest(amount);

        // Only owner can call emergencyWithdraw
        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(user);
        strategy.emergencyWithdraw();

        // Owner can call
        strategy.emergencyWithdraw();
        assertEq(asset.balanceOf(address(strategy)), amount);
    }

    function testZeroDepositReverts() public {
        vm.expectRevert();
        vm.prank(user);
        strategy.invest(0);
    }

    function testOverWithdrawReverts() public {
        uint256 amount = 100e6;
        vm.prank(user);
        strategy.invest(amount);

        vm.expectRevert();
        vm.prank(user);
        strategy.withdraw(amount + 1);
    }
}
