// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";

/**
 * @title TestSelfVerificationRoot
 * @notice Test implementation of SelfVerificationRoot for testing purposes
 * @dev This contract provides a concrete implementation of the abstract SelfVerificationRoot
 */
contract ProofOfHuman is SelfVerificationRoot {
    // Storage for testing purposes
    bool public verificationSuccessful;
    ISelfVerificationRoot.GenericDiscloseOutputV2 public lastOutput;
    bytes public lastUserData;
    SelfStructs.VerificationConfigV2 public verificationConfig;
    bytes32 public verificationConfigId;
    address public lastUserAddress;

    // Events for testing
    event VerificationCompleted(
        ISelfVerificationRoot.GenericDiscloseOutputV2 output,
        bytes userData
    );

    /**
     * @notice Constructor for the test contract
     * @param identityVerificationHubV2Address The address of the Identity Verification Hub V2
     */
    constructor(
        address identityVerificationHubV2Address,
        uint256 scope,
        bytes32 _verificationConfigId
    ) SelfVerificationRoot(identityVerificationHubV2Address, scope) {
        verificationConfigId = _verificationConfigId;
    }
    /**
     * @notice Implementation of customVerificationHook for testing
     * @dev This function is called by onVerificationSuccess after hub address validation
     * @param output The verification output from the hub
     * @param userData The user data passed through verification
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        verificationSuccessful = true;
        lastOutput = output;
        lastUserData = userData;
        lastUserAddress = address(uint160(output.userIdentifier));

        emit VerificationCompleted(output, userData);
    }

    /**
     * @notice Reset the test state
     */
    function resetTestState() external {
        verificationSuccessful = false;
        lastOutput = ISelfVerificationRoot.GenericDiscloseOutputV2({
            attestationId: bytes32(0),
            userIdentifier: 0,
            nullifier: 0,
            forbiddenCountriesListPacked: [
                uint256(0),
                uint256(0),
                uint256(0),
                uint256(0)
            ],
            issuingState: "",
            name: new string[](3),
            idNumber: "",
            nationality: "",
            dateOfBirth: "",
            gender: "",
            expiryDate: "",
            olderThan: 0,
            ofac: [false, false, false]
        });
        lastUserData = "";
        lastUserAddress = address(0);
    }

    /**
     * @notice Expose the internal _setScope function for testing
     * @param newScope The new scope value to set
     */
    function setScope(uint256 newScope) external {
        _setScope(newScope);
    }

    function setVerificationConfig(
        SelfStructs.VerificationConfigV2 memory config
    ) external {
        verificationConfig = config;
        _identityVerificationHubV2.setVerificationConfigV2(verificationConfig);
    }

    function setVerificationConfigNoHub(
        SelfStructs.VerificationConfigV2 memory config
    ) external {
        verificationConfig = config;
    }

    function setConfigId(bytes32 configId) external {
        verificationConfigId = configId;
    }

    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier,
        bytes memory userDefinedData
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }

    /**
     * @notice Test function to simulate calling onVerificationSuccess from hub
     * @dev This function is only for testing purposes to verify access control
     * @param output The verification output
     * @param userData The user data
     */
    function testOnVerificationSuccess(
        bytes memory output,
        bytes memory userData
    ) external {
        // This should fail if called by anyone other than the hub
        onVerificationSuccess(output, userData);
    }
}
