// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Floating pragma risks unexpected compiler changes affecting safety assumptions.
contract FloatingPragma {
    uint256 public stored;

    function set(uint256 v) external {
        stored = v;
    }
}
