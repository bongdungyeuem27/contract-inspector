// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Critical setter lacks access control, letting anyone overwrite ownership.
contract InsufficientAccessControl {
    address public owner;
    uint256 public fee;

    constructor(uint256 _fee) {
        owner = msg.sender;
        fee = _fee;
    }

    function changeOwner(address newOwner) external {
        owner = newOwner;
    }

    function setFee(uint256 newFee) external {
        fee = newFee;
    }
}
