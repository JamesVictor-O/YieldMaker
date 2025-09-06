// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStrategy {
    function invest(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function totalAssets() external view returns (uint256);
    function emergencyWithdraw() external;
}