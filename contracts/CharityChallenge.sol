pragma solidity ^0.4.24;

import "./IMarket.sol";

contract CharityChallenge {

    event Received(address indexed sender, uint256 value);

    event Donated(address indexed npo, uint256 value);

    event Claimed(address indexed claimer, uint256 value);

    event SafetyHatchClaimed(address indexed claimer, uint256 value);

    address public contractOwner;

    address public npoAddress;

    address public marketAddress;

    IMarket market;

    string public challengeName;

    uint256 public challengeEndTime;

    uint256 public challengeSafetyHatchTime1;

    uint256 public challengeSafetyHatchTime2;

    bool public isEventFinalizedAndValid;

    bool public hasChallengeAccomplished;

    mapping(address => uint256) public donorBalances;

    address[] private donors;

    constructor(
        address _contractOwner,
        address _npoAddress,
        address _marketAddress,
        string _challengeName,
        uint256 _challengeEndTime
    ) public
    {
        contractOwner = _contractOwner;
        npoAddress = _npoAddress;
        challengeName = _challengeName;
        marketAddress = _marketAddress;
        market = IMarket(_marketAddress);
        challengeEndTime = _challengeEndTime;
        challengeSafetyHatchTime1 = challengeEndTime + 30 days;
        challengeSafetyHatchTime2 = challengeSafetyHatchTime1 + 30 days;
        isEventFinalizedAndValid = false;
        hasChallengeAccomplished = false;
    }

    function() public payable {
        require(now <= challengeEndTime);
        require(msg.value > 0);

        if (balanceOf(msg.sender) == 0) {
            donors.push(msg.sender);
        }
        donorBalances[msg.sender] += msg.value;
        emit Received(msg.sender, msg.value);
    }

    function balanceOf(address _donorAddress) public view returns (uint256) {
        return donorBalances[_donorAddress];
    }

    function finalize() external {
        require(now > challengeEndTime);
        require(now <= challengeSafetyHatchTime1);
        require(!isEventFinalizedAndValid);

        bool hasError;
        (hasChallengeAccomplished, hasError) = checkAugur();
        if (!hasError) {
            if (hasChallengeAccomplished) {
                uint256 totalContractBalance = address(this).balance;
                npoAddress.transfer(address(this).balance);
                emit Donated(npoAddress, totalContractBalance);
            }
            isEventFinalizedAndValid = true;
        }
    }

    function claim() external {
        require(now > challengeEndTime);
        require(isEventFinalizedAndValid || now > challengeSafetyHatchTime1);
        require(!hasChallengeAccomplished || now > challengeSafetyHatchTime1);
        require(now <= challengeSafetyHatchTime2);
        require(balanceOf(msg.sender) > 0);

        uint256 claimedAmount = balanceOf(msg.sender);
        msg.sender.transfer(claimedAmount);
        donorBalances[msg.sender] = 0;
        emit Claimed(msg.sender, claimedAmount);
    }

    function safetyHatchClaim() external {
        require(now > challengeSafetyHatchTime2);
        require(msg.sender == contractOwner);

        uint totalContractBalance = address(this).balance;
        contractOwner.transfer(address(this).balance);
        for (uint256 i = 0; i < donors.length; i++) {
            donorBalances[donors[i]] = 0;
        }
        emit SafetyHatchClaimed(contractOwner, totalContractBalance);
    }

    function checkAugur() private view returns (bool happened, bool errored) {
        if (market.isFinalized()) {
            if (market.isInvalid()) {
                return (false, true);
            } else {
                uint256 no = market.getWinningPayoutNumerator(0);
                uint256 yes = market.getWinningPayoutNumerator(1);
                return (yes > no, false);
            }
        } else {
            return (false, true);
        }
    }
}
