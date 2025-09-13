// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol"; 



interface IAavePool {
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);
     function getReserveData(address asset) external view returns (DataTypes.ReserveData memory);
    function getUserAccountData(
        address user
    )
        external
        view
        returns (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        );
}

interface IAToken {
    function getScaledUserBalance(address user) external view returns (uint256);
    function scaledBalanceToTotalUnderlyingBalance(uint256 scaledBalance) external view returns (uint256);
    function balanceOf(address user) external view returns (uint256);
    function redeem(address user, uint256 amount, address to) external;  // For emergencyWithdraw
}

contract AaveStrategy is IStrategy {
    IAavePool public aavePool;
    IERC20 public asset;
    address public vault;
    address public immutable owner;
    IAToken public aToken;  // Reference to the aToken for this asset

    constructor(address _aavePool, address _asset, address _vault) {
        aavePool = IAavePool(_aavePool);
        asset = IERC20(_asset);
        vault = _vault;
        owner = msg.sender;
        DataTypes.ReserveData memory reserveData = aavePool.getReserveData(_asset);
        require(reserveData.aTokenAddress != address(0), "Reserve not initialized on Aave");
        aToken = IAToken(reserveData.aTokenAddress);
    }

    modifier onlyVault() {
        require(msg.sender == vault, "Not vault");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setVault(address _vault) external onlyOwner {
        require(_vault != address(0), "Invalid vault address");
        vault = _vault;
    }

    function invest(uint256 amount) external override onlyVault {
        asset.approve(address(aavePool), amount);
        aavePool.supply(address(asset), amount, address(this), 0);
    }

    function withdraw(uint256 amount) external override onlyVault {
        aavePool.withdraw(address(asset), amount, vault);
    }

    function totalAssets() external view override returns (uint256) {
        // Get total supplied (aToken balance converted to underlying)
        uint256 scaledBalance = aToken.getScaledUserBalance(address(this));
        uint256 supplied = aToken.scaledBalanceToTotalUnderlyingBalance(scaledBalance);
        // Plus any idle underlying tokens in the strategy
        uint256 idle = asset.balanceOf(address(this));
        return supplied + idle;
    }

    function emergencyWithdraw() external override onlyVault {
        // Withdraw any idle balance first
        uint256 idle = asset.balanceOf(address(this));
        if (idle > 0) {
            aavePool.withdraw(address(asset), idle, vault);
        }
        // Then full redeem from aToken
        uint256 aTokenBalance = aToken.balanceOf(address(this));
        if (aTokenBalance > 0) {
            aToken.redeem(address(this), aTokenBalance, vault);
        }
    }
}