// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ChildContract
 * @dev Simple child contract to be deployed dynamically by a factory
 */
contract ChildContract {
    string public childName;
    address public creator;
    uint256 public createdAt;

    constructor(string memory _name, address _creator) {
        childName = _name;
        creator = _creator;
        createdAt = block.timestamp;
    }

    function getDetails() public view returns (string memory, address, uint256) {
        return (childName, creator, createdAt);
    }
}

/**
 * @title ContractFactory
 * @dev Experiment 5 - Part 4: Smart Contract Creation from another contract
 */
contract ContractFactory {
    // Array of deployed child contract addresses
    ChildContract[] public deployedChildren;

    event ChildCreated(address indexed childAddress, string name, address indexed owner);

    // Factory method to deploy a new child contract dynamically
    function createChild(string memory _name) public returns (address) {
        // Creates a new instance of ChildContract on the blockchain
        ChildContract child = new ChildContract(_name, msg.sender);
        deployedChildren.push(child);

        emit ChildCreated(address(child), _name, msg.sender);
        return address(child);
    }

    function getChildrenCount() public view returns (uint256) {
        return deployedChildren.length;
    }

    function getChild(uint256 index) public view returns (address) {
        require(index < deployedChildren.length, "Index out of bounds");
        return address(deployedChildren[index]);
    }
}
