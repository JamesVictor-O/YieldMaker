
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IStrategy.sol";

contract YieldmakerVault is ERC4626, Ownable {
    IStrategy public strategy;
    bool public paused;

    // Optional Self verification registry and per-strategy gating
    interface ISelfVerificationRegistry {
        function isCreatorVerified(address creator) external view returns (bool);
    }

    ISelfVerificationRegistry public verificationRegistry;
    mapping(address => bool) public strategyRequiresVerification;

    // events
    event StrategyUpdated(address indexed newStrategy);
    event Paused(address account);
    event Unpaused(address account);
    event VerificationRegistryUpdated(address indexed registry);
    event StrategyVerificationRequirementUpdated(address indexed strategy, bool required);

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

    function setStrategy(address _newStrategy) external onlyOwner {
        require(_newStrategy != address(0), "Invalid strategy");

        uint256 assetsToMove = strategy.totalAssets();
        if (assetsToMove > 0) {
            strategy.withdraw(assetsToMove);
        }

        strategy = IStrategy(_newStrategy);
        emit StrategyUpdated(_newStrategy);

        uint256 vaultBalance = IERC20(asset()).balanceOf(address(this));
        if (vaultBalance > 0) {
            IERC20(asset()).transfer(address(strategy), vaultBalance);
            strategy.invest(vaultBalance);
        }
    }

    // Admin: configure Self verification registry (optional)
    function setVerificationRegistry(address _registry) external onlyOwner {
        verificationRegistry = ISelfVerificationRegistry(_registry);
        emit VerificationRegistryUpdated(_registry);
    }

    // Admin: mark strategies that require verification to deposit
    function setStrategyVerificationRequirement(address _strategy, bool _required) external onlyOwner {
        require(_strategy != address(0), "Invalid strategy");
        strategyRequiresVerification[_strategy] = _required;
        emit StrategyVerificationRequirementUpdated(_strategy, _required);
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
        // If current strategy requires verification, enforce Self verification for depositor
        if (
            address(verificationRegistry) != address(0) &&
            strategyRequiresVerification[address(strategy)]
        ) {
            require(
                verificationRegistry.isCreatorVerified(msg.sender),
                "Verification required for this strategy"
            );
        }
        uint256 shares = super.deposit(assets, receiver);
        
        // Transfer the assets from vault to strategy, then invest
        IERC20(asset()).transfer(address(strategy), assets);
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