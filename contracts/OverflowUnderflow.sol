// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

// Arithmetic wraps around because Solidity <0.8.0 lacks checked math.
contract OverflowUnderflow {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "low bal");
        balances[msg.sender] -= amount;
        msg.sender.transfer(amount);
    }
}
