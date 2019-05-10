pragma solidity ^0.5.0;

import "./IRealityCheck.sol";

contract RealityCheckMock is IRealityCheck {
    bool finalized;
    bool invalid;
    bytes32 finalAnswer;

    constructor() public {
    }

    function isFinalized(bytes32 question_id) public view returns (bool) {
        return finalized;
    }

    function getFinalAnswer(bytes32 question_id) public view returns (bytes32) {
        return finalAnswer;
    }
    
    function setFinalized(bool _finalized) public {
        finalized = _finalized;
    }

    function setInvalid(bool _invalid) public {
        invalid = _invalid;
    }

    function setFinalAnswer(bytes32 _finalAnswer) public {
        finalAnswer = _finalAnswer;
    }
}
