// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Uninitialized storage pointer corrupts state by writing to slot 0.
contract UninitializedStoragePointer {
    struct Data {
        uint256 value;
    }

    Data[] public list;
    uint256 public sentinel = 7;

    function overwrite(uint256 newValue) external {
        Data storage dataRef;
        dataRef.value = newValue; // writes to slot 0 (sentinel) because dataRef is uninitialized
    }
}
