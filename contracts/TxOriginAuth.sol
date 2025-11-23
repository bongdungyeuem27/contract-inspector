// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Auth relies on tx.origin, allowing phishing through intermediary contracts.
contract TxOriginAuth {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function withdraw(address payable to) external {
        require(tx.origin == owner, "not owner origin");
        to.transfer(address(this).balance);
    }

    receive() external payable {}
}
