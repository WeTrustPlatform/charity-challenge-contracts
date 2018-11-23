pragma solidity ^0.4.24;

import "./CharityChallenge.sol";

contract TestableCharityChallenge is CharityChallenge {
    constructor(
        address _contractOwner,
        address _npoAddress,
        address _marketAddress,
        string _challengeName,
        uint256 _challengeEndTime
    ) CharityChallenge(
        _contractOwner,
        _npoAddress,
        _marketAddress,
        _challengeName,
        _challengeEndTime
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