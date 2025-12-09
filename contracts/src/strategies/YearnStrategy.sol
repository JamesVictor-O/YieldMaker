// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Mock Yearn interface
interface IYearnVault {
    function deposit(uint256 amount) external;

    function withdraw(uint256 maxShares) external;

    function balanceOf(address account) external view returns (uint256);
}

contract YearnStrategy is IStrategy {
    IYearnVault public yearnVault;
    IERC20 public asset;
    address public vault;

    constructor(address _yearnVault, address _asset, address _vault) {
        yearnVault = IYearnVault(_yearnVault);
        asset = IERC20(_asset);
        vault = _vault;
    }

    modifier onlyVault() {
        require(msg.sender == vault, "Not vault");
        _;
    }

    function invest(uint256 amount) external override onlyVault {
        asset.approve(address(yearnVault), amount);
        yearnVault.deposit(amount);
    }

    function withdraw(uint256 maxShares) external override onlyVault {
        yearnVault.withdraw(maxShares);
        asset.transfer(vault, asset.balanceOf(address(this)));
    }

    function totalAssets() external view override returns (uint256) {
        return yearnVault.balanceOf(address(this));
    }

    function emergencyWithdraw() external override onlyVault {
        uint256 shares = yearnVault.balanceOf(address(this));
        if (shares > 0) {
            yearnVault.withdraw(shares);
            asset.transfer(vault, asset.balanceOf(address(this)));
        }
    }
}
