pragma solidity ^0.5.0;

// Market API used to interract with augur, we only need to describe the
// functions we'll be using.
// cf https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/IMarket.sol
interface IMarket {
    function isFinalized() external view returns (bool);
    function isInvalid() external view returns (bool);
    function getWinningPayoutNumerator(uint256 _outcome) external view returns (uint256);
}