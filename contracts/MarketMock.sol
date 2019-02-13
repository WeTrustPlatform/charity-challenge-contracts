pragma solidity ^0.5.0;

import "./IMarket.sol";

contract MarketMock is IMarket {
    bool finalized;
    bool invalid;
    uint32[2] payoutNumerators;

    constructor() public {
    }

    function isFinalized() public view returns (bool) {
        return finalized;
    }
    
    function isInvalid() public view returns (bool) {
        return invalid;
    }

    function getWinningPayoutNumerator(uint256 _outcome) public view returns (uint256) {
        return payoutNumerators[_outcome];
    }
    
    function setFinalized(bool _finalized) public {
        finalized = _finalized;
    }

    function setInvalid(bool _invalid) public {
        invalid = _invalid;
    }

    function setPayoutNumerators(uint32[2] memory _payoutNumerators) public {
        payoutNumerators = _payoutNumerators;
    }
}
