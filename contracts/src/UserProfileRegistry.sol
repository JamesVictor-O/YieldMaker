// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UserProfileRegistry
 * @dev Stores essential user profile data on-chain for strategy decisions
 * @notice Detailed preferences are stored off-chain for privacy and cost efficiency
 */
contract UserProfileRegistry is Ownable {
    enum RiskProfile {
        CONSERVATIVE, // 0
        MODERATE, // 1
        AGGRESSIVE // 2
    }

    struct UserProfile {
        RiskProfile riskProfile;
        uint32 lastUpdated;
        bool isActive;
        uint8 experienceLevel; // 0=beginner, 1=intermediate, 2=advanced
    }

    mapping(address => UserProfile) public userProfiles;

    event ProfileUpdated(
        address indexed user,
        RiskProfile riskProfile,
        uint8 experienceLevel,
        uint32 timestamp
    );

    event ProfileDeactivated(address indexed user, uint32 timestamp);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Updates user's risk profile - called by backend after onboarding
     * @param user The user's wallet address
     * @param _riskProfile The calculated risk profile
     * @param _experienceLevel User's DeFi experience level
     */
    function updateProfile(
        address user,
        RiskProfile _riskProfile,
        uint8 _experienceLevel
    ) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(_experienceLevel <= 2, "Invalid experience level");

        userProfiles[user] = UserProfile({
            riskProfile: _riskProfile,
            lastUpdated: uint32(block.timestamp),
            isActive: true,
            experienceLevel: _experienceLevel
        });

        emit ProfileUpdated(
            user,
            _riskProfile,
            _experienceLevel,
            uint32(block.timestamp)
        );
    }

    /**
     * @dev Allows users to deactivate their profile
     */
    function deactivateProfile() external {
        require(userProfiles[msg.sender].isActive, "Profile already inactive");

        userProfiles[msg.sender].isActive = false;
        emit ProfileDeactivated(msg.sender, uint32(block.timestamp));
    }

    /**
     * @dev Get user's risk profile for strategy decisions
     * @param user The user's wallet address
     * @return riskProfile The user's risk profile
     */
    function getUserRiskProfile(
        address user
    ) external view returns (RiskProfile) {
        require(userProfiles[user].isActive, "User profile not active");
        return userProfiles[user].riskProfile;
    }

    /**
     * @dev Check if user has completed onboarding
     * @param user The user's wallet address
     * @return bool True if user has active profile
     */
    function hasActiveProfile(address user) external view returns (bool) {
        return userProfiles[user].isActive;
    }

    /**
     * @dev Get complete user profile
     * @param user The user's wallet address
     * @return profile The complete user profile
     */
    function getUserProfile(
        address user
    ) external view returns (UserProfile memory) {
        return userProfiles[user];
    }

    /**
     * @dev Emergency function to update multiple profiles (for migration)
     * @param users Array of user addresses
     * @param profiles Array of corresponding profiles
     */
    function batchUpdateProfiles(
        address[] calldata users,
        UserProfile[] calldata profiles
    ) external onlyOwner {
        require(users.length == profiles.length, "Arrays length mismatch");

        for (uint i = 0; i < users.length; i++) {
            require(users[i] != address(0), "Invalid user address");
            userProfiles[users[i]] = profiles[i];

            emit ProfileUpdated(
                users[i],
                profiles[i].riskProfile,
                profiles[i].experienceLevel,
                uint32(block.timestamp)
            );
        }
    }
}
