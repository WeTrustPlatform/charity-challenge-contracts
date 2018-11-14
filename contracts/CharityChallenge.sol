pragma solidity ^0.4.24;

import "./IMarket.sol";

contract CharityChallenge {

    address public contractOwner;

    address public npoAddress;

    address public marketAddress;
    IMarket market;

    string public challengeName;

    constructor(address _contractOwner, address _npoAddress, address _marketAddress, string _challengeName) public {
        contractOwner = _contractOwner;
        npoAddress = _npoAddress;
        challengeName = _challengeName;
        marketAddress = _marketAddress;
        market = IMarket(_marketAddress);
    }

    function checkAugur() public view returns (bool happened, bool errored) {
        if (market.isFinalized()) {
            // check the result
        } else {
            return (false, true);
        }
    }
}
