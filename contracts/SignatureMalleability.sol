// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Signature checks omit malleability protections on "s" and "v".
contract SignatureMalleability {
    address public signer;

    constructor(address _signer) {
        signer = _signer;
    }

    function verify(bytes32 hash, uint8 v, bytes32 r, bytes32 s) external view returns (bool) {
        return ecrecover(hash, v, r, s) == signer;
    }
}
