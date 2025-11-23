// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Anyone can overwrite arbitrary storage slots via sstore.
contract ArbitraryStorageLocation {
    event SlotWritten(bytes32 slot, bytes32 value);

    function unsafeWrite(bytes32 slot, bytes32 value) external {
        assembly {
            sstore(slot, value)
        }
        emit SlotWritten(slot, value);
    }
}
