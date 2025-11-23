// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// User-controlled delegatecall lets attackers execute code in this contract's context.
contract DangerousDelegatecall {
    address public implementation;
    address public owner;

    constructor(address _impl) {
        implementation = _impl;
        owner = msg.sender;
    }

    function upgrade(address _impl) external {
        implementation = _impl;
    }

    function callImplementation(bytes calldata data) external payable returns (bytes memory) {
        (bool ok, bytes memory res) = implementation.delegatecall(data);
        require(ok, "delegatecall failed");
        return res;
    }
}
