// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Unbounded loop over dynamic array can revert transfers as the list grows.
contract GasLimitDoS {
    address[] public payees;

    function addPayee(address p) external {
        payees.push(p);
    }

    function distribute() external payable {
        uint256 share = msg.value / payees.length;
        for (uint256 i; i < payees.length; i++) {
            (bool ok, ) = payable(payees[i]).call{value: share}("");
            require(ok, "payout failed");
        }
    }
}
