pragma solidity ^0.4.24;

import "./IMarket.sol";

contract CharityChallenge {

    event Received(address indexed sender, uint256 value);

    address public contractOwner;

    address public npoAddress;

    address public marketAddress;

    IMarket market;

    string public challengeName;

    uint256 public challengeEndTime;

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
    }

    function() public payable {
        require(now < challengeEndTime);
        require(msg.value > 0);
        donorBalances[msg.sender] += msg.value;
        emit Received(msg.sender, msg.value);
    }

    function balanceOf(address _donorAddress) public view returns (uint256) {
        return donorBalances[_donorAddress];
    }

    function checkAugur() public view returns (bool happened, bool errored) {
        if (market.isFinalized()) {
            // check the result
        } else {
            return (false, true);
        }
    }
}
