// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/YieldmakerVault.sol";
import "../src/AaveStrategy.sol";  
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}



contract DummyStrategy is IStrategy {
    function invest(uint256) external override {}
    function withdraw(uint256) external override {}
    function totalAssets() external pure override returns (uint256) { return 0; }
    function emergencyWithdraw() external override {}
}

contract MockAToken is ERC20 {
    mapping(address => uint256) public scaledBalances;
    address public pool;  // Changed: Mutable for setUp

    constructor() ERC20("Mock aUSDC", "maUSDC") {
        pool = address(0);  // Temp
    }

    // New: Setter for pool ref (called in setUp after pool deploy)
    function updatePool(address _pool) external {
        require(pool == address(0), "Pool already set");  // Once-only
        pool = _pool;
    }

    function mint(address to, uint256 amount) external {
        super._mint(to, amount);
        scaledBalances[to] += amount;
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
        scaledBalances[from] -= amount;
    }

    function getScaledUserBalance(address user) external view returns (uint256) {
        return scaledBalances[user];
    }

    function scaledBalanceToTotalUnderlyingBalance(uint256 scaledBalance) external view returns (uint256) {
        return scaledBalance;  // 1:1 for tests
    }

    function redeem(address user, uint256 amount, address to) external {
        _burn(user, amount);
        require(pool != address(0), "Pool not set");
        MockAavePool(pool)._redeemUnderlying(to, amount);
    }
}

contract MockAavePool is IAavePool {
    uint256 public totalSupplied;
    mapping(address => uint256) public balances;
    IERC20 public usdc;
    address public immutable mockATokenAddress;

    constructor(address _mockAToken, address _usdc) {
        mockATokenAddress = _mockAToken;
        usdc = IERC20(_usdc);
    }

    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16
    ) external override {
        require(asset == address(usdc), "Only USDC supported");
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        balances[onBehalfOf] += amount;
        totalSupplied += amount;
        MockAToken(mockATokenAddress).mint(onBehalfOf, amount);
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external override returns (uint256) {
        require(asset == address(usdc), "Only USDC supported");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        totalSupplied -= amount;
        MockAToken(mockATokenAddress).burn(msg.sender, amount);
        IERC20(asset).transfer(to, amount);
        return amount;
    }

    function _redeemUnderlying(address to, uint256 amount) external {
        require(msg.sender == mockATokenAddress, "Only aToken");
        usdc.transfer(to, amount);
    }

    function getUserAccountData(
        address user
    )
        external
        view
        override
        returns (uint256, uint256, uint256, uint256, uint256, uint256)
    {
        return (balances[user], 0, 0, 0, 0, type(uint256).max);
    }

    function getReserveData(address)
        external
        view
        override
        returns (DataTypes.ReserveData memory)
    {
        DataTypes.ReserveData memory data;
        data.aTokenAddress = mockATokenAddress;
        data.configuration.data = 0;
        data.liquidityIndex = 1e27;
        data.lastUpdateTimestamp = uint40(block.timestamp);
        return data;
    }
}

contract YieldmakerVaultTest is Test {
    YieldmakerVault public vault;
    MockUSDC public usdc;
    MockAavePool public aavePool;
    MockAToken public mockAToken;
    AaveStrategy public strategy;
    DummyStrategy public dummyStrategy;
    address public owner = address(0xABCD);
    address public user = address(0x1234);

    function setUp() public {
        usdc = new MockUSDC();
        // Fixed: Deploy aToken first (temp pool=0), then pool with aToken, then update aToken's pool ref
        mockAToken = new MockAToken();
        aavePool = new MockAavePool(address(mockAToken), address(usdc));
        mockAToken.updatePool(address(aavePool));  // Now consistent refs
        dummyStrategy = new DummyStrategy();
        vault = new YieldmakerVault(IERC20(address(usdc)), address(dummyStrategy));
        strategy = new AaveStrategy(
            address(aavePool),
            address(usdc),
            address(vault)
        );
        vault.transferOwnership(owner);
        vm.prank(owner);
        vault.setStrategy(address(strategy));
        usdc.mint(user, 1000e6);
        vm.startPrank(user);
        usdc.approve(address(vault), 1000e6);
        vm.stopPrank();
    }

    function testDepositAndInvest() public {
        vm.startPrank(user);
        vault.deposit(500e6, user);
        vm.stopPrank();
        assertEq(vault.totalAssets(), 500e6);
        assertEq(mockAToken.balanceOf(address(strategy)), 500e6);
    }

    function testWithdraw() public {
        vm.startPrank(user);
        vault.deposit(500e6, user);
        vault.withdraw(200e6, user, user);
        vm.stopPrank();
        assertEq(usdc.balanceOf(user), 700e6);
        assertEq(vault.totalAssets(), 300e6);
    }

    function testEmergencyWithdraw() public {
        vm.startPrank(user);
        vault.deposit(500e6, user);
        vm.stopPrank();
        vm.prank(owner);
        vault.emergencyWithdraw();
        assertEq(usdc.balanceOf(address(vault)), 500e6);
        assertEq(vault.totalAssets(), 0);
    }

    function testStrategySwitching() public {
        vm.startPrank(user);
        vault.deposit(500e6, user);
        vm.stopPrank();
        
        AaveStrategy newStrategy = new AaveStrategy(
            address(aavePool), 
            address(usdc), 
            address(vault)
        );
        
        vm.prank(owner);
        vault.setStrategy(address(newStrategy));
        
        assertEq(vault.totalAssets(), 500e6);
    }
}