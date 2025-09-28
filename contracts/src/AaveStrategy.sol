
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol"; 
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";  
interface IAToken {
    function getScaledUserBalance(address user) external view returns (uint256);

    function scaledBalanceToTotalUnderlyingBalance(
        uint256 scaledBalance
    ) external view returns (uint256);

    function balanceOf(address user) external view returns (uint256);

    function redeem(address user, uint256 amount, address to) external; // For emergencyWithdraw
}
contract AaveStrategy is IStrategy {
    IPool public immutable aavePool; 
    IERC20 public immutable asset;
    address public vault;
    address public immutable owner;
    IAToken public aToken;  

    constructor(address _aavePool, address _asset, address _vault) {
        aavePool = IPool(_aavePool);
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
        // Approve pool to spend assets
        asset.approve(address(aavePool), amount);
        // Supply to Aave (onBehalfOf = this strategy, receives aTokens)
        aavePool.supply(address(asset), amount, address(this), 0);
    }

    function withdraw(uint256 amount) external override onlyVault {
        // Withdraw underlying to vault (returns actual amount withdrawn)
        uint256 withdrawn = aavePool.withdraw(address(asset), amount, vault);
        // Note: If amount == type(uint256).max, it withdraws max available
    }

    function totalAssets() external view override returns (uint256) {
        // aToken.balanceOf(this) = total underlying balance (V3 auto-scales with liquidity index)
        uint256 supplied = aToken.balanceOf(address(this));
        // Add any idle underlying in strategy
        uint256 idle = asset.balanceOf(address(this));
        return supplied + idle;
    }

    function emergencyWithdraw() external override onlyVault {
        // Withdraw all idle first
        uint256 idle = asset.balanceOf(address(this));
        if (idle > 0) {
            aavePool.withdraw(address(asset), idle, vault);
        }
        // Withdraw full supplied (use max amount)
        uint256 aTokenBalance = aToken.balanceOf(address(this));
        if (aTokenBalance > 0) {
            aavePool.withdraw(address(asset), type(uint256).max, vault);
        }
    }
}