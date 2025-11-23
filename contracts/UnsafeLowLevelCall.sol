// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Low-level call ignores return value; funds can be stuck without noticing failure.
contract UnsafeLowLevelCall {
    function pay(address to) external payable {
        // Missing success check
        payable(to).call{value: msg.value}("");
    }
}
