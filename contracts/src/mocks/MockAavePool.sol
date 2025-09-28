// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";

/// @title MockAavePool
/// @notice A mock lending protocol that simulates Aave V3 functionality for testing
/// @dev Implements the core functions needed by YieldMaker's Aave strategy
contract MockAavePool is Ownable {
    using SafeERC20 for IERC20;

    // Events matching Aave V3
    event Supply(
        address indexed reserve,
        address user,
        address indexed onBehalfOf,
        uint256 amount,
        uint16 indexed referralCode
    );

    event Withdraw(
        address indexed reserve,
        address indexed user,
        address indexed to,
        uint256 amount
    );

    // Simplified internal reserve data for our mock
    struct InternalReserveData {
        uint256 liquidityIndex;
        uint256 currentLiquidityRate;
        uint256 lastUpdateTimestamp;
        address aTokenAddress;
        bool isActive;
        bool isFrozen;
    }

    // User data for each reserve
    struct UserReserveData {
        uint256 scaledBalance;
        uint256 lastUpdateTimestamp;
    }

    // State variables
    mapping(address => InternalReserveData) public reserves;
    mapping(address => mapping(address => UserReserveData)) public userReserves;

    // Mock interest rate: 8.2% APY = 0.082 per year = 82000000000000000000000000 in Ray (0.082 * 1e27)
    uint256 public constant MOCK_LIQUIDITY_RATE = 82000000000000000000000000; // 8.2% in Ray format
    uint256 public constant RAY = 1e27;
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    constructor() Ownable(msg.sender) {}

    /// @notice Initialize a reserve (similar to Aave's reserve initialization)
    /// @param asset The address of the underlying asset
    /// @param aToken The address of the corresponding aToken
    function initReserve(address asset, address aToken) external onlyOwner {
        require(asset != address(0), "Invalid asset");
        require(aToken != address(0), "Invalid aToken");

        reserves[asset] = InternalReserveData({
            liquidityIndex: RAY, // Start with 1.0 in Ray
            currentLiquidityRate: MOCK_LIQUIDITY_RATE,
            lastUpdateTimestamp: block.timestamp,
            aTokenAddress: aToken,
            isActive: true,
            isFrozen: false
        });
    }

    /// @notice Supply assets to the protocol (Aave V3 compatible)
    /// @param asset The address of the underlying asset to supply
    /// @param amount The amount to be supplied
    /// @param onBehalfOf The address that will receive the aTokens
    /// @param referralCode Code used to register the integrator originating the operation
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external {
        require(amount > 0, "Invalid amount");
        require(reserves[asset].isActive, "Reserve not active");
        require(!reserves[asset].isFrozen, "Reserve frozen");

        // Update reserve state
        _updateReserveState(asset);

        // Transfer tokens from user
        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);

        // Calculate scaled amount (amount / liquidity index)
        uint256 scaledAmount = (amount * RAY) / reserves[asset].liquidityIndex;

        // Update user balance
        userReserves[asset][onBehalfOf].scaledBalance += scaledAmount;
        userReserves[asset][onBehalfOf].lastUpdateTimestamp = block.timestamp;

        // Mint aTokens to user
        MockAToken(reserves[asset].aTokenAddress).mint(onBehalfOf, amount);

        emit Supply(asset, msg.sender, onBehalfOf, amount, referralCode);
    }

    /// @notice Withdraw assets from the protocol (Aave V3 compatible)
    /// @param asset The address of the underlying asset to withdraw
    /// @param amount The amount to be withdrawn (use type(uint256).max for full withdrawal)
    /// @param to The address that will receive the underlying
    /// @return The final amount withdrawn
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        require(reserves[asset].isActive, "Reserve not active");

        // Update reserve state
        _updateReserveState(asset);

        // Get user's current balance
        uint256 userBalance = getUserBalance(asset, msg.sender);
        require(userBalance > 0, "No balance to withdraw");

        // Handle max withdrawal
        uint256 amountToWithdraw = amount;
        if (amount == type(uint256).max) {
            amountToWithdraw = userBalance;
        }

        require(amountToWithdraw <= userBalance, "Insufficient balance");
        require(
            amountToWithdraw <= IERC20(asset).balanceOf(address(this)),
            "Insufficient liquidity"
        );

        // Calculate scaled amount to deduct
        uint256 scaledAmount = (amountToWithdraw * RAY) /
            reserves[asset].liquidityIndex;

        // Update user balance
        userReserves[asset][msg.sender].scaledBalance -= scaledAmount;
        userReserves[asset][msg.sender].lastUpdateTimestamp = block.timestamp;

        // Burn proportional aTokens from user
        uint256 aTokenBalance = MockAToken(reserves[asset].aTokenAddress)
            .balanceOf(msg.sender);
        uint256 aTokensToBurn = aTokenBalance; // For simplicity, burn all aTokens for max withdrawal
        if (amount != type(uint256).max) {
            // Calculate proportional amount for partial withdrawals
            uint256 totalUserBalance = getUserBalance(asset, msg.sender);
            aTokensToBurn =
                (aTokenBalance * amountToWithdraw) /
                totalUserBalance;
        }
        MockAToken(reserves[asset].aTokenAddress).burn(
            msg.sender,
            aTokensToBurn
        );

        // Transfer tokens to user
        IERC20(asset).safeTransfer(to, amountToWithdraw);

        emit Withdraw(asset, msg.sender, to, amountToWithdraw);

        return amountToWithdraw;
    }

    /// @notice Get reserve data for an asset (Aave V3 compatible)
    /// @param asset The address of the underlying asset
    /// @return The reserve data in official Aave format
    function getReserveData(
        address asset
    ) external view returns (DataTypes.ReserveData memory) {
        InternalReserveData memory internal_data = reserves[asset];

        // Create a minimal but valid Aave ReserveData struct
        DataTypes.ReserveData memory reserveData;
        reserveData.liquidityIndex = uint128(
            internal_data.liquidityIndex / 1e9
        ); // Convert from Ray to uint128
        reserveData.currentLiquidityRate = uint128(
            internal_data.currentLiquidityRate / 1e9
        );
        reserveData.lastUpdateTimestamp = uint40(
            internal_data.lastUpdateTimestamp
        );
        reserveData.aTokenAddress = internal_data.aTokenAddress;

        // Set configuration to indicate active reserve
        if (internal_data.isActive) {
            reserveData.configuration.data = 1 << 56; // Set active bit
        }

        return reserveData;
    }

    /// @notice Get user's current balance including accrued interest
    /// @param asset The address of the underlying asset
    /// @param user The address of the user
    /// @return The user's balance including interest
    function getUserBalance(
        address asset,
        address user
    ) public view returns (uint256) {
        UserReserveData memory userData = userReserves[asset][user];
        if (userData.scaledBalance == 0) return 0;

        // Calculate current liquidity index
        uint256 currentIndex = _calculateCurrentLiquidityIndex(asset);

        // Convert scaled balance to actual balance
        return (userData.scaledBalance * currentIndex) / RAY;
    }

    /// @notice Update the liquidity index for a reserve
    /// @param asset The address of the underlying asset
    function _updateReserveState(address asset) internal {
        InternalReserveData storage reserve = reserves[asset];

        if (block.timestamp == reserve.lastUpdateTimestamp) {
            return; // Already updated in this block
        }

        // Calculate new liquidity index
        reserve.liquidityIndex = _calculateCurrentLiquidityIndex(asset);
        reserve.lastUpdateTimestamp = block.timestamp;
    }

    /// @notice Calculate the current liquidity index
    /// @param asset The address of the underlying asset
    /// @return The current liquidity index
    function _calculateCurrentLiquidityIndex(
        address asset
    ) internal view returns (uint256) {
        InternalReserveData memory reserve = reserves[asset];

        if (reserve.currentLiquidityRate == 0) {
            return reserve.liquidityIndex;
        }

        uint256 timeDelta = block.timestamp - reserve.lastUpdateTimestamp;

        // Calculate compound interest: index * (1 + rate * time)
        uint256 rateTimesTime = (reserve.currentLiquidityRate * timeDelta) /
            SECONDS_PER_YEAR;

        return
            reserve.liquidityIndex +
            (reserve.liquidityIndex * rateTimesTime) /
            RAY;
    }

    /// @notice Emergency function to update interest rate
    /// @param asset The address of the underlying asset
    /// @param newRate The new liquidity rate in Ray format
    function setLiquidityRate(
        address asset,
        uint256 newRate
    ) external onlyOwner {
        _updateReserveState(asset);
        reserves[asset].currentLiquidityRate = newRate;
    }

    /// @notice Get the current APY for display purposes
    /// @param asset The address of the underlying asset
    /// @return The APY in basis points (e.g., 820 for 8.2%)
    function getCurrentAPY(address asset) external view returns (uint256) {
        uint256 rate = reserves[asset].currentLiquidityRate;
        // Convert from Ray to basis points: rate * 10000 / RAY
        return (rate * 10000) / RAY;
    }
}

/// @title MockAToken
/// @notice Mock aToken that represents deposits in the MockAavePool
contract MockAToken is ERC20, Ownable {
    address public immutable POOL;
    address public immutable UNDERLYING_ASSET;

    constructor(
        string memory name,
        string memory symbol,
        address pool,
        address underlyingAsset
    ) ERC20(name, symbol) Ownable(msg.sender) {
        POOL = pool;
        UNDERLYING_ASSET = underlyingAsset;
    }

    /// @notice Mint aTokens to user (only pool can call)
    function mint(address to, uint256 amount) external {
        require(msg.sender == POOL, "Only pool can mint");
        _mint(to, amount);
    }

    /// @notice Burn aTokens from user (only pool can call)
    function burn(address from, uint256 amount) external {
        require(msg.sender == POOL, "Only pool can burn");
        _burn(from, amount);
    }

    /// @notice Get the balance of the user including accrued interest (Aave-style)
    /// @dev This makes aToken balance grow with interest like real Aave
    function balanceOf(address account) public view override returns (uint256) {
        // If this account has a balance, return the interest-bearing balance from pool
        if (super.balanceOf(account) > 0) {
            return MockAavePool(POOL).getUserBalance(UNDERLYING_ASSET, account);
        }
        return 0;
    }

    /// @notice Total supply reflects the total supplied to the pool
    function totalSupply() public view override returns (uint256) {
        return IERC20(UNDERLYING_ASSET).balanceOf(POOL);
    }
}
