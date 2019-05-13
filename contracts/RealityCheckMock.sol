pragma solidity ^0.5.0;

import "./IRealityCheck.sol";

contract RealityCheckMock is IRealityCheck {
    struct Question {
        uint32 opening_ts;
        bool finalized;
        bytes32 finalAnswer;
    }

    mapping(bytes32 => Question) public questions;

    constructor() public {
    }

    function isFinalized(bytes32 question_id) public view returns (bool) {
        return questions[question_id].finalized;
    }

    function getFinalAnswer(bytes32 question_id) public view returns (bytes32) {
        return questions[question_id].finalAnswer;
    }

    function getOpeningTS(bytes32 question_id) public view returns (uint32) {
        return questions[question_id].opening_ts;
    }

    function addQuestion(bytes32 question_id, uint32 opening_ts, bool finalized, bytes32 finalAnswer)
    public payable returns (bytes32) {
        questions[question_id].opening_ts = opening_ts;
        questions[question_id].finalized = finalized;
        questions[question_id].finalAnswer = finalAnswer;
    }

    function setOpeningTS(bytes32 question_id, uint32 opening_ts) public {
        questions[question_id].opening_ts = opening_ts;
    }

    function setFinalized(bytes32 question_id, bool finalized) public {
        questions[question_id].finalized = finalized;
    }

    function setFinalAnswer(bytes32 question_id, bytes32 finalAnswer) public {
        questions[question_id].finalAnswer = finalAnswer;
    }
}
