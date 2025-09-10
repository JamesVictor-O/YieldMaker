// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

contract AaveStrategy is IStrategy {
    IAavePool public aavePool;
    IERC20 public asset;
    address public vault;

    constructor(address _aavePool, address _asset, address _vault) {
        aavePool = IAavePool(_aavePool);
        asset = IERC20(_asset);
        vault = _vault;
    }

    modifier onlyVault() {
        require(msg.sender == vault, "Not vault");
        _;
    }

    function invest(uint256 amount) external override onlyVault {
        asset.approve(address(aavePool), amount);
        aavePool.supply(address(asset), amount, address(this), 0);
    }

    function withdraw(uint256 amount) external override onlyVault {
        aavePool.withdraw(address(asset), amount, vault);
    }

    function totalAssets() external view override returns (uint256) {
        // For simplicity, just return asset balance. For full integration, query aToken balance.
        return asset.balanceOf(address(this));
    }

    function emergencyWithdraw() external override onlyVault {
        uint256 balance = asset.balanceOf(address(this));
        if (balance > 0) {
            aavePool.withdraw(address(asset), balance, vault);
        }
    }
}
