// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MockERC20.sol";

contract MockLendingPool {
    MockERC20 public asset;
    uint256 public totalDeposits;
    uint256 public simulatedYield;

    constructor(address _asset) {
        asset = MockERC20(_asset);
    }

    function deposit(uint256 amount) external {
        asset.transferFrom(msg.sender, address(this), amount);
        totalDeposits += amount;
    }

    function withdraw(uint256 amount) external {
        require(amount <= totalDeposits, "Insufficient pool balance");
        asset.transfer(msg.sender, amount);
        totalDeposits -= amount;
    }

    function simulateYield(uint256 yieldAmount) external {
        simulatedYield += yieldAmount;
        asset.mint(address(this), yieldAmount);
    }
}
