// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

// Self Protocol V2 imports
import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";

/**
 * @title SelfVerificationRegistry
 * @notice Minimal registry to track Self Protocol verified users on-chain
 * @dev Mirrors the integration style from a reference contract using SelfVerificationRoot (V2)
 */
contract SelfVerificationRegistry is Ownable, SelfVerificationRoot {
    // Tracks verification status per user
    mapping(address => bool) public verifiedCreators;
    // Prevents proof replay using nullifier
    mapping(bytes32 => bool) public usedNullifiers;
    // Verification configuration ID (generated via tools.self.xyz)
    bytes32 public verificationConfigId;

    event CreatorVerified(address indexed creator, bytes32 attestationId);

    constructor(
        address identityVerificationHubV2Address,
        uint256 scopeValue,
        bytes32 _verificationConfigId
    ) Ownable(msg.sender) SelfVerificationRoot(identityVerificationHubV2Address, scopeValue) {
        verificationConfigId = _verificationConfigId;
    }

    /**
     * @notice Returns the configuration ID for verification
     * @dev Determines verification requirements (e.g., 18+, OFAC, country rules)
     */
    function getConfigId(
        bytes32 /* _destinationChainId */,
        bytes32 /* _userIdentifier */,
        bytes memory /* _userDefinedData */
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }

    /**
     * @notice Hook called by base after successful hub validation
     * @dev Marks user as verified and records nullifier
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory _output,
        bytes memory /* _userData */
    ) internal override {
        require(!usedNullifiers[_output.nullifier], "Nullifier already used");
        usedNullifiers[_output.nullifier] = true;

        // Extract EVM address from userIdentifier
        address userAddress = address(uint160(_output.userIdentifier));

        verifiedCreators[userAddress] = true;
        emit CreatorVerified(userAddress, _output.attestationId);
    }

    /**
     * @notice Admin: update verification configuration ID
     */
    function setVerificationConfigId(bytes32 _configId) external onlyOwner {
        verificationConfigId = _configId;
    }

    /**
     * @notice Admin: update scope
     */
    function setScope(uint256 newScope) external onlyOwner {
        _setScope(newScope);
    }

    // ---------- Public views to match frontend hooks ----------

    function isCreatorVerified(address creator) external view returns (bool) {
        return verifiedCreators[creator];
    }

    function getVerificationInfo(address creator)
        external
        view
        returns (
            bool isVerified,
            uint256 bonusPools,
            uint256 verificationTimestamp,
            string memory status
        )
    {
        isVerified = verifiedCreators[creator];
        bonusPools = isVerified ? 1 : 0;
        // For a registry, we don't store timestamps; return 0 or block.timestamp if desired
        verificationTimestamp = isVerified ? block.timestamp : 0;
        status = isVerified
            ? "Verified - Eligible for bonus benefits"
            : "Unverified - Complete Self verification";
    }
}


