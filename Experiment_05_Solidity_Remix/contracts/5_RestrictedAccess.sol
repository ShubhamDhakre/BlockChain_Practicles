// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title RestrictedAccess
 * @dev Experiment 5 - Part 5: Restricted Access to a Contract (Access Control & Modifiers)
 */
contract RestrictedAccess {
    address public owner;
    uint256 public secretTreasuryBalance;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event TreasuryUpdated(uint256 newBalance, address indexed updatedBy);

    // Constructor sets the deploying address as the initial owner
    constructor() {
        owner = msg.sender;
        secretTreasuryBalance = 1000;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // Function Modifier to restrict execution strictly to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Error: Caller is not the authorized contract owner");
        _; // Target function body executes here
    }

    // 1. Restricted function: Only owner can update treasury
    function updateTreasury(uint256 _newBalance) public onlyOwner {
        secretTreasuryBalance = _newBalance;
        emit TreasuryUpdated(_newBalance, msg.sender);
    }

    // 2. Restricted function: Transfer ownership to another address
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Error: New owner cannot be zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // 3. Public function: Anyone can read public state
    function getTreasuryBalance() public view returns (uint256) {
        return secretTreasuryBalance;
    }
}
