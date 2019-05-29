pragma solidity ^0.5.0;

import "./CharityChallenge.sol";

contract TestableCharityChallenge is CharityChallenge {
    constructor(
        address payable _contractOwner,
        address payable[] memory _npoAddresses,
        uint8[] memory _ratios,
        address _marketAddress,
        string memory _question,
        address _arbitrator,
        uint256 _timeout,
        uint256 _challengeEndTime,
        bool _unlockOnNo
    ) CharityChallenge(
        _contractOwner,
        _npoAddresses,
        _ratios,
        _marketAddress,
        _question,
        _arbitrator,
        _timeout,
        _challengeEndTime,
        _unlockOnNo
    ) public {}

    ///////////////////////////////////////////
    // FUNCTIONS BELOW ARE USED FOR TESTING  //
    ///////////////////////////////////////////

    function setChallengeEndTime(uint256 _challengeEndTime) public {
        require(msg.sender == contractOwner);
        challengeEndTime = _challengeEndTime;
    }

    function setChallengeSafetyHatchTime1(uint256 _challengeSafetyHatchTime1) public {
        require(msg.sender == contractOwner);
        challengeSafetyHatchTime1 = _challengeSafetyHatchTime1;
    }

    function setChallengeSafetyHatchTime2(uint256 _challengeSafetyHatchTime2) public {
        require(msg.sender == contractOwner);
        challengeSafetyHatchTime2 = _challengeSafetyHatchTime2;
    }
}