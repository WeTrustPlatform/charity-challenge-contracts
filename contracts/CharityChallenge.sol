pragma solidity ^0.4.24;

contract CharityChallenge {

    address public contractOwner;

    address public npoAddress;

    address public marketAddress;
    Market market;

    string public challengeName;

    constructor(address _contractOwner, address _npoAddress, address _marketAddress, string _challengeName) public {
        contractOwner = _contractOwner;
        npoAddress = _npoAddress;
        challengeName = _challengeName;
        marketAddress = _marketAddress;
        market = Market(_marketAddress);
    }

    function checkAugur() public returns (bool happened, bool errored) {
        if (market.isFinalized()) {
            // check the result
        } else {
            return (false, true);
        }
    }
}

// Market API used to interract with augur, we only need to describe the
// functions we'll be using.
// cf https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/IMarket.sol
contract Market {
    function isFinalized() public view returns (bool) {}
}
