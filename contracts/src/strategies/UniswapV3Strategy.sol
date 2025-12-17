// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Mock Uniswap V3 interface for liquidity provision
interface IUniswapV3Pool {
    function mint(
        address recipient,
        int24 tickLower,
        int24 tickUpper,
        uint128 amount,
        bytes calldata data
    ) external returns (uint256 amount0, uint256 amount1);

    function burn(
        int24 tickLower,
        int24 tickUpper,
        uint128 amount
    ) external returns (uint256 amount0, uint256 amount1);

    function collect(
        address recipient,
        int24 tickLower,
        int24 tickUpper,
        uint128 amount
    ) external returns (uint256 collected0, uint256 collected1);
}

contract UniswapV3Strategy is IStrategy {
    IUniswapV3Pool public uniswapPool;
    IERC20 public asset;
    address public vault;

    constructor(address _uniswapPool, address _asset, address _vault) {
        uniswapPool = IUniswapV3Pool(_uniswapPool);
        asset = IERC20(_asset);
        vault = _vault;
    }

    modifier onlyVault() {
        require(msg.sender == vault, "Not vault");
        _;
    }

    function invest(uint256 amount) external override onlyVault {
        asset.approve(address(uniswapPool), amount);
        // Example: Provide liquidity in a fixed tick range (mock values)
        uniswapPool.mint(address(this), -60000, 60000, uint128(amount), "");
    }

    function withdraw(uint256 amount) external override onlyVault {
        // Example: Remove liquidity from the same tick range (mock values)
        uniswapPool.burn(-60000, 60000, uint128(amount));
        asset.transfer(vault, asset.balanceOf(address(this)));
    }

    function totalAssets() external view override returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function emergencyWithdraw() external override onlyVault {
        // Remove all liquidity and transfer assets to vault
        // For demo, assume all liquidity is in the same tick range
        // In production, track positions and amounts
        uniswapPool.burn(-60000, 60000, type(uint128).max);
        asset.transfer(vault, asset.balanceOf(address(this)));
    }
}
