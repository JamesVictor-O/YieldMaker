// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IStrategy.sol";

contract NullStrategy is IStrategy {
    function invest(uint256) external override {}

    function withdraw(uint256) external override {}

    function totalAssets() external pure override returns (uint256) {
        return 0;
    }

    function emergencyWithdraw() external override {}
}
