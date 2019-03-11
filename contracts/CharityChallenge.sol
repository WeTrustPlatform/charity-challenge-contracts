pragma solidity ^0.5.0;

import "./IMarket.sol";

contract CharityChallenge {

    event Received(address indexed sender, uint256 value);

    event Donated(address indexed npo, uint256 value);

    event Claimed(address indexed claimer, uint256 value);

    event SafetyHatchClaimed(address indexed claimer, uint256 value);

    address payable public contractOwner;

    // wanna keep this as first npo address for compatibility
    address payable public npoAddress;
    // key is npo address, value is ratio
    mapping(address => uint8) public npoRatios;

    address payable[] public npoAddresses;

    address public marketAddress;

    IMarket market;

    uint256 public challengeEndTime;

    uint256 public challengeSafetyHatchTime1;

    uint256 public challengeSafetyHatchTime2;

    bool public isEventFinalizedAndValid;

    bool public hasChallengeAccomplished;

    bool private safetyHatchClaimSucceeded;

    mapping(address => uint256) public donorBalances;

    uint256 public donorCount;

    bool private mReentrancyLock = false;
    modifier nonReentrant() {
        require(!mReentrancyLock);
        mReentrancyLock = true;
        _;
        mReentrancyLock = false;
    }

    constructor(
        address payable _contractOwner,
        address payable[] memory _npoAddresses,
        uint8[] memory _ratios,
        address _marketAddress
    ) public
    {
        require(_npoAddresses.length == _ratios.length);
        uint length = _npoAddresses.length;
        contractOwner = _contractOwner;
        // for backward compatibility
        npoAddress = _npoAddresses[0];
        for (uint i = 0; i < length; i++) {
          address payable npo = _npoAddresses[i];
          npoAddresses.push(npo);
          npoRatios[npo] = _ratios[i];
        }
        marketAddress = _marketAddress;
        market = IMarket(_marketAddress);
        challengeEndTime = market.getEndTime();
        challengeSafetyHatchTime1 = challengeEndTime + 30 days;
        challengeSafetyHatchTime2 = challengeSafetyHatchTime1 + 30 days;
        isEventFinalizedAndValid = false;
        hasChallengeAccomplished = false;
    }

    function() external payable {
        require(now <= challengeEndTime);
        require(msg.value > 0);
        if (donorBalances[msg.sender] == 0 && msg.value > 0) {
          donorCount++;
        }
        donorBalances[msg.sender] += msg.value;
        emit Received(msg.sender, msg.value);
    }

    function balanceOf(address _donorAddress) public view returns (uint256) {
        if (safetyHatchClaimSucceeded) {
            return 0;
        }
        return donorBalances[_donorAddress];
    }

    function finalize() nonReentrant external {
        require(now > challengeEndTime);
        require(now <= challengeSafetyHatchTime1);
        require(!isEventFinalizedAndValid);

        bool hasError;
        (hasChallengeAccomplished, hasError) = checkAugur();
        if (!hasError) {
            isEventFinalizedAndValid = true;
            if (hasChallengeAccomplished) {
                uint256 totalContractBalance = address(this).balance;
                uint8 sumRatio = 0;
                uint length = npoAddresses.length;
                for (uint i = 0; i < length; i++) {
                  address payable npo = npoAddresses[i];
                  sumRatio += npoRatios[npo];
                }
                for (uint i = 0; i < length; i++) {
                  address payable npo = npoAddresses[i];
                  uint8 ratio = npoRatios[npo];
                  uint256 amount = totalContractBalance * ratio / sumRatio;
                  npo.transfer(amount);
                  emit Donated(npo, amount);
                }
            }
        }
    }

    function claim() nonReentrant external {
        require(now > challengeEndTime);
        require(isEventFinalizedAndValid || now > challengeSafetyHatchTime1);
        require(!hasChallengeAccomplished || now > challengeSafetyHatchTime1);
        require(balanceOf(msg.sender) > 0);

        uint256 claimedAmount = balanceOf(msg.sender);
        donorBalances[msg.sender] = 0;
        msg.sender.transfer(claimedAmount);
        emit Claimed(msg.sender, claimedAmount);
    }

    function safetyHatchClaim() external {
        require(now > challengeSafetyHatchTime2);
        require(msg.sender == contractOwner);

        uint totalContractBalance = address(this).balance;
        safetyHatchClaimSucceeded = true;
        contractOwner.transfer(address(this).balance);
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
