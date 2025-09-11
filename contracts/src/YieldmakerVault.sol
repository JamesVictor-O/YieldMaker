// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IStrategy.sol";

contract YieldmakerVault is ERC4626, Ownable {
    IStrategy public strategy;
    bool public paused;

    // events
    event StrategyUpdated(address indexed newStrategy);
    event Paused(address account);
    event Unpaused(address account);

    // constructor

    constructor(
        IERC20 _asset,
        address _strategy
    ) ERC4626(_asset) ERC20("Yieldmaker USDC", "yUSDC") Ownable(msg.sender) {
        strategy = IStrategy(_strategy);
    }

    modifier whenNotPaused() {
        require(!paused, "Vault is paused");
        _;
    }

    // function setStrategy(address _newStrategy) external onlyOwner {
    //     require(_newStrategy != address(0), "Invalid strategy");

    //     uint256 assetsToMove = strategy.totalAssets();
    //     if (assetsToMove > 0) {
    //         strategy.withdraw(assetsToMove);
    //     }

    //     strategy = IStrategy(_newStrategy);
    //     emit StrategyUpdated(_newStrategy);

    //     uint256 vaultBalance = IERC20(asset()).balanceOf(address(this));
    //     if (vaultBalance > 0) {
    //         IERC20(asset()).approve(_newStrategy, vaultBalance);
    //         strategy.invest(vaultBalance);
    //     }
    // }

    function setStrategy(address _newStrategy) external onlyOwner {
        require(_newStrategy != address(0), "Invalid strategy");

        if (address(strategy) != address(0)) {
            uint256 assetsToMove = strategy.totalAssets();
            if (assetsToMove > 0) {
                strategy.withdraw(assetsToMove);
            }
        }

        strategy = IStrategy(_newStrategy);
        emit StrategyUpdated(_newStrategy);

        uint256 vaultBalance = IERC20(asset()).balanceOf(address(this));
        if (vaultBalance > 0) {
            IERC20(asset()).approve(_newStrategy, vaultBalance);
            strategy.invest(vaultBalance);
        }
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function totalAssets() public view override returns (uint256) {
        return strategy.totalAssets();
    }

    function deposit(
        uint256 assets,
        address receiver
    ) public override whenNotPaused returns (uint256) {
        uint256 shares = super.deposit(assets, receiver);
        IERC20(asset()).approve(address(strategy), assets);
        strategy.invest(assets);
        return shares;
    }

    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public override whenNotPaused returns (uint256) {
        strategy.withdraw(assets);
        return super.withdraw(assets, receiver, owner);
    }

    function emergencyWithdraw() external onlyOwner {
        strategy.emergencyWithdraw();
        paused = true;
    }
}
