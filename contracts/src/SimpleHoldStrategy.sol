// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IStrategy.sol";

/**
 * @title SimpleHoldStrategy
 * @dev A basic strategy that holds assets and tracks them properly
 * This fixes the NullStrategy issue where totalAssets() always returned 0
 */
contract SimpleHoldStrategy is IStrategy, Ownable {
    IERC20 public immutable asset;
    address public vault;
    uint256 private _totalAssets;

    event Invested(uint256 amount);
    event Withdrawn(uint256 amount);
    event EmergencyWithdraw(uint256 amount);

    modifier onlyVault() {
        require(msg.sender == vault, "Only vault can call");
        _;
    }

    constructor(address _asset, address _vault) Ownable(msg.sender) {
        require(_asset != address(0), "Invalid asset address");
        require(_vault != address(0), "Invalid vault address");

        asset = IERC20(_asset);
        vault = _vault;
    }

    /**
     * @dev Invest assets - simply track the amount
     * @param amount Amount of assets to invest
     */
    function invest(uint256 amount) external override onlyVault {
        require(amount > 0, "Amount must be greater than 0");

        // Verify we received the assets
        uint256 balanceBefore = asset.balanceOf(address(this));
        require(balanceBefore >= _totalAssets + amount, "Assets not received");

        _totalAssets += amount;
        emit Invested(amount);
    }

    /**
     * @dev Withdraw assets back to vault
     * @param amount Amount of assets to withdraw
     */
    function withdraw(uint256 amount) external override onlyVault {
        require(amount > 0, "Amount must be greater than 0");
        require(_totalAssets >= amount, "Insufficient assets");

        _totalAssets -= amount;

        // Transfer assets back to vault
        bool success = asset.transfer(vault, amount);
        require(success, "Transfer failed");

        emit Withdrawn(amount);
    }

    /**
     * @dev Get total assets managed by this strategy
     * @return Total assets amount
     */
    function totalAssets() external view override returns (uint256) {
        return _totalAssets;
    }

    /**
     * @dev Emergency withdraw all assets back to vault
     * Only callable by vault in emergency situations
     */
    function emergencyWithdraw() external override onlyVault {
        uint256 balance = asset.balanceOf(address(this));

        if (balance > 0) {
            bool success = asset.transfer(vault, balance);
            require(success, "Emergency transfer failed");
        }

        emit EmergencyWithdraw(balance);
        _totalAssets = 0;
    }

    /**
     * @dev Update vault address (only owner)
     * @param _newVault New vault address
     */
    function updateVault(address _newVault) external onlyOwner {
        require(_newVault != address(0), "Invalid vault address");
        vault = _newVault;
    }

    /**
     * @dev Get actual balance of assets in this contract
     * @return Actual balance
     */
    function getActualBalance() external view returns (uint256) {
        return asset.balanceOf(address(this));
    }
}
