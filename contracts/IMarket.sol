pragma solidity ^0.4.24;

// Market API used to interract with augur, we only need to describe the
// functions we'll be using.
// cf https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/IMarket.sol
contract IMarket {
    function isFinalized() public view returns (bool) {}
    function isInvalid() public view returns (bool) {}
    function getWinningPayoutNumerator(uint256 _outcome) public view returns (uint256) {}
}