// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Pseudo-randomness derived from predictable block data is manipulable.
contract WeakRandomness {
    function roll() external view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 1)))) % 100;
    }
}
