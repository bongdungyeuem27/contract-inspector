// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Game outcome depends on miner-influencable timestamp.
contract TimestampDependence {
    function guess(uint256 guessNumber) external view returns (bool) {
        return guessNumber == block.timestamp;
    }
}
