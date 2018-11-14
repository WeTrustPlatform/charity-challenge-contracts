pragma solidity ^0.4.24;

contract CharityChallenge {

    address public contractOwner;

    constructor(address _contractOwner) public {
        contractOwner = _contractOwner;
    }
}