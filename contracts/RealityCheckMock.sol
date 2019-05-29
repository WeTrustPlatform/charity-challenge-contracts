pragma solidity ^0.5.2;

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

    function askQuestion(
        uint256 template_id, string memory question,
        address arbitrator, uint32 timeout, uint32 opening_ts, uint256 nonce) public returns (bytes32) {

        return 0xafffceb5788b34ac2ad5f638db53a805bd98419d3a1f00066d4357657736c9be;
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
