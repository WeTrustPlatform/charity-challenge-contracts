pragma solidity ^0.4.24;

import "./IMarket.sol";

contract CharityChallenge {

    event Received(address indexed sender, uint256 value);

    event Log(bool value); // TODO: to remove

    address public contractOwner;

    address public npoAddress;

    address public marketAddress;

    IMarket market;

    string public challengeName;

    uint256 public challengeEndTime;

    bool public hasFinalizeCalled;

    bool public hasChallengeAccomplished;

    mapping(address => uint256) public donorBalances;

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
        hasFinalizeCalled = false;
        hasChallengeAccomplished = false;
    }

    function() public payable {
        require(now <= challengeEndTime);
        require(msg.value > 0);
        donorBalances[msg.sender] += msg.value;
        emit Received(msg.sender, msg.value);
    }

    function balanceOf(address _donorAddress) public view returns (uint256) {
        return donorBalances[_donorAddress];
    }

    function finalize() external {
        require(now > challengeEndTime);
        require(!hasFinalizeCalled);

        (hasChallengeAccomplished,) = checkAugur();
        if (hasChallengeAccomplished) {
            // TODO: unit test this
            npoAddress.transfer(address(this).balance);
        } else {
            // TODO: implement loop each result to set claim status
        }
        hasFinalizeCalled = true;
    }

    function claim() external {
        require(now > challengeEndTime);
        require(hasFinalizeCalled);
        require(!hasChallengeAccomplished);

        // TODO: unit test this
        msg.sender.transfer(donorBalances[msg.sender]);
    }

    // TODO: Implement this method
    function checkAugur() public view returns (bool happened, bool errored) {
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
