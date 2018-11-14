pragma solidity ^0.4.24;

contract CharityChallenge {

    address public contractOwner;

    address public npoAddress;

    string public challengeName;

    constructor(address _contractOwner, address _npoAddress, string _challengeName) public {
        contractOwner = _contractOwner;
        npoAddress = _npoAddress;
        challengeName = _challengeName;
    }
}