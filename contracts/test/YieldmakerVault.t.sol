// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/YieldmakerVault.sol";
import "../src/AaveStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract MockAavePool {
    uint256 public totalSupplied;
    mapping(address => uint256) public balances;

    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16
    ) external {
        ERC20(asset).transferFrom(msg.sender, address(this), amount);
        balances[onBehalfOf] += amount;
        totalSupplied += amount;
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        // Track balances for the strategy contract (msg.sender)
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        totalSupplied -= amount;
        ERC20(asset).transfer(to, amount);
        return amount;
    }

    function getUserAccountData(
        address user
    )
        external
        view
        returns (uint256, uint256, uint256, uint256, uint256, uint256)
    {
        return (balances[user], 0, 0, 0, 0, 0);
    }
}

contract YieldmakerVaultTest is Test {
    YieldmakerVault public vault;
    MockUSDC public usdc;
    MockAavePool public aavePool;
    AaveStrategy public strategy;
    address public owner = address(0xABCD);
    address public user = address(0x1234);

    function setUp() public {
        usdc = new MockUSDC();
        aavePool = new MockAavePool();

        // Deploy vault with a temporary dummy strategy
        vault = new YieldmakerVault(IERC20(address(usdc)), address(0));

        // Now deploy the real strategy with the vault address
        strategy = new AaveStrategy(
            address(aavePool),
            address(usdc),
            address(vault)
        );

        // Transfer ownership from address(this) to owner
        vm.prank(address(this));
        vault.transferOwnership(owner);

        // Set correct strategy
        vm.prank(owner);
        vault.setStrategy(address(strategy));

        // Mint USDC to user
        usdc.mint(user, 1000e6);
        vm.startPrank(user);
        usdc.approve(address(vault), 1000e6);
        vm.stopPrank();
    }

    function testDepositAndInvest() public {
        vm.startPrank(user);
        vault.deposit(500e6, user);
        vm.stopPrank();
        assertEq(usdc.balanceOf(address(aavePool)), 500e6);
        assertEq(vault.totalAssets(), 500e6);
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
        address newStrategy = address(
            new AaveStrategy(address(aavePool), address(usdc), address(vault))
        );
        vm.prank(owner);
        vault.setStrategy(newStrategy);
        assertEq(vault.totalAssets(), usdc.balanceOf(address(aavePool)));
    }
}
