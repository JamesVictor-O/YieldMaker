// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Mock Compound interface
interface ICompound {
    function supply(address asset, uint256 amount) external;

    function withdraw(address asset, uint256 amount) external;
}

contract CompoundStrategy is IStrategy {
    ICompound public compound;
    IERC20 public asset;
    address public vault;

    constructor(address _compound, address _asset, address _vault) {
        compound = ICompound(_compound);
        asset = IERC20(_asset);
        vault = _vault;
    }

    modifier onlyVault() {
        require(msg.sender == vault, "Not vault");
        _;
    }

    function invest(uint256 amount) external override onlyVault {
        asset.approve(address(compound), amount);
        compound.supply(address(asset), amount);
    }

    function withdraw(uint256 amount) external override onlyVault {
        compound.withdraw(address(asset), amount);
        asset.transfer(vault, amount);
    }

    function totalAssets() external view override returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function emergencyWithdraw() external override onlyVault {
        uint256 balance = asset.balanceOf(address(this));
        if (balance > 0) {
            compound.withdraw(address(asset), balance);
            asset.transfer(vault, balance);
        }
    }
}
