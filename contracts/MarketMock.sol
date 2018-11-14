pragma solidity ^0.4.24;

import "./IMarket.sol";

contract MarketMock is IMarket {
    bool finalized;

    constructor(bool _finalized) public {
      finalized = _finalized;
    }

    function isFinalized() public view returns (bool) {
        return finalized;
    }
}
