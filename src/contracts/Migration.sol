// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Migration {
    address public owner;
    uint public last_completed_megration;

    constructor() payable {
        owner = msg.sender;
        // last_completed_megration = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not owner!");
        _;
    }

    function setCompleted(uint _completed) public onlyOwner {
        last_completed_megration = _completed;
    }

    function upgrade(address new_addres) public onlyOwner {
        Migration upgraded = Migration(new_addres);
        upgraded.setCompleted(last_completed_megration);
    }
}
