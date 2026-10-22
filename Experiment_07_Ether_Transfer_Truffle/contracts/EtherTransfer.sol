// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EtherTransfer
 * @dev Practical 7: Ether Transfer Smart Contract for Ganache & Truffle
 */
contract EtherTransfer {
    address payable public defaultRecipient;
    address public owner;

    event EtherReceived(address indexed sender, uint256 amount);
    event EtherTransferred(address indexed from, address indexed to, uint256 amount);

    // Constructor accepts initial recipient address (from accounts[1] in Truffle migration)
    constructor(address payable _defaultRecipient) {
        owner = msg.sender;
        defaultRecipient = _defaultRecipient;
    }

    // Fallback function to accept incoming Ether directly
    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }

    // Deposit Ether into the contract
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        emit EtherReceived(msg.sender, msg.value);
    }

    // Transfer Ether to a specific recipient address
    function transferTo(address payable _recipient) external payable {
        require(msg.value > 0, "Transfer amount must be greater than zero");
        require(_recipient != address(0), "Recipient cannot be zero address");

        // Forward Ether directly to the recipient
        (bool sent, ) = _recipient.call{value: msg.value}("");
        require(sent, "Ether transfer failed");

        emit EtherTransferred(msg.sender, _recipient, msg.value);
    }

    // Transfer Ether to the default configured recipient
    function transferToDefaultRecipient() external payable {
        require(msg.value > 0, "Transfer amount must be greater than zero");
        require(defaultRecipient != address(0), "Default recipient not set");

        (bool sent, ) = defaultRecipient.call{value: msg.value}("");
        require(sent, "Ether transfer to default recipient failed");

        emit EtherTransferred(msg.sender, defaultRecipient, msg.value);
    }

    // Transfer contract's stored balance to the default recipient
    function withdrawToDefaultRecipient(uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw balance");
        require(amount <= address(this).balance, "Insufficient contract balance");
        require(defaultRecipient != address(0), "Default recipient not set");

        (bool sent, ) = defaultRecipient.call{value: amount}("");
        require(sent, "Withdrawal failed");

        emit EtherTransferred(address(this), defaultRecipient, amount);
    }

    // Check balance stored in the contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
