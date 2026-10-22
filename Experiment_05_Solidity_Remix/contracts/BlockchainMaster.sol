// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * ============================================================================
 * PRACTICAL 5: COMPREHENSIVE SOLIDITY CONTRACT (REMIX IDE READY)
 * ============================================================================
 * Aim: Exploration of Remix IDE, Solidity Programming, Wallet Types, Blockchain
 * Use Cases, and Public vs. Private Blockchains. Demonstrate the Programming
 * Structure of Solidity with Syntax and Semantics.
 *
 * Implements all 5 required parts:
 * 1. Arithmetic Operations
 * 2. Looping Statements
 * 3. Cryptographic Functions
 * 4. Smart Contract Creation
 * 5. Restricted Access to a Contract
 */

// -------------------------------------------------------------
// Part 4 Helper: Child Contract
// -------------------------------------------------------------
contract ManagedVault {
    string public vaultName;
    address public manager;
    uint256 public balance;

    constructor(string memory _name, address _manager) {
        vaultName = _name;
        manager = _manager;
        balance = 0;
    }

    function deposit(uint256 amount) external {
        balance += amount;
    }
}

// -------------------------------------------------------------
// Master Contract Incorporating Parts 1, 2, 3, 4, 5
// -------------------------------------------------------------
contract BlockchainMaster {
    
    // =========================================================
    // 5. RESTRICTED ACCESS & STATE VARIABLES
    // =========================================================
    address public owner;
    uint256 public treasury;
    ManagedVault[] public createdVaults;

    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    event VaultSpawned(address indexed vaultAddress, string name, address indexed manager);

    constructor() {
        owner = msg.sender;
        treasury = 5000;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized: Only contract owner can call this function");
        _;
    }

    // Restricted Access functions
    function setTreasury(uint256 _treasury) public onlyOwner {
        treasury = _treasury;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }

    // =========================================================
    // 1. ARITHMETIC OPERATIONS
    // =========================================================
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }

    function subtract(uint256 a, uint256 b) public pure returns (uint256) {
        require(a >= b, "Underflow: a must be >= b");
        return a - b;
    }

    function multiply(uint256 a, uint256 b) public pure returns (uint256) {
        return a * b;
    }

    function divide(uint256 a, uint256 b) public pure returns (uint256) {
        require(b > 0, "Division by zero");
        return a / b;
    }

    // =========================================================
    // 2. LOOPING STATEMENTS
    // =========================================================
    function sumRange(uint256 n) public pure returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 1; i <= n; i++) {
            total += i;
        }
        return total;
    }

    function factorial(uint256 n) public pure returns (uint256) {
        uint256 result = 1;
        uint256 current = n;
        while (current > 1) {
            result *= current;
            current--;
        }
        return result;
    }

    // =========================================================
    // 3. CRYPTOGRAPHIC FUNCTIONS
    // =========================================================
    function hashKeccak256(string memory text) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(text));
    }

    function hashSha256(string memory text) public pure returns (bytes32) {
        return sha256(abi.encodePacked(text));
    }

    function hashRipemd160(string memory text) public pure returns (bytes20) {
        return ripemd160(abi.encodePacked(text));
    }

    function verifySigner(bytes32 messageHash, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        address signer = ecrecover(messageHash, v, r, s);
        require(signer != address(0), "Invalid signature");
        return signer;
    }

    // =========================================================
    // 4. SMART CONTRACT CREATION
    // =========================================================
    function createNewVault(string memory name) public returns (address) {
        // Deploying a new contract instance dynamically via 'new'
        ManagedVault vault = new ManagedVault(name, msg.sender);
        createdVaults.push(vault);
        emit VaultSpawned(address(vault), name, msg.sender);
        return address(vault);
    }

    function getVaultsCount() public view returns (uint256) {
        return createdVaults.length;
    }
}
