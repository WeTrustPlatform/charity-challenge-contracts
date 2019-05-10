pragma solidity ^0.5.0;

// RealityCheck API used to interract with realit.io, we only need to describe the
// functions we'll be using.
// cf https://raw.githubusercontent.com/realitio/realitio-dapp/master/truffle/contracts/RealityCheck.sol
interface IRealityCheck {
    function isFinalized(bytes32 question_id) external view returns (bool);
    function getFinalAnswer(bytes32 question_id) external view returns (bytes32);
}
