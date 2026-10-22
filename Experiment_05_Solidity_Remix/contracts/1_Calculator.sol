// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Arithmetic Calculator
 * @dev Experiment 5 - Part 1: Arithmetic Operations in Solidity
 */
contract Calculator {
    
    // Addition
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }

    // Subtraction (with underflow guard)
    function subtract(uint256 a, uint256 b) public pure returns (uint256) {
        require(a >= b, "Error: Underflow detected. 'a' must be >= 'b'");
        return a - b;
    }

    // Multiplication
    function multiply(uint256 a, uint256 b) public pure returns (uint256) {
        return a * b;
    }

    // Division (with zero-division guard)
    function divide(uint256 a, uint256 b) public pure returns (uint256) {
        require(b > 0, "Error: Division by zero is undefined");
        return a / b;
    }

    // Modulo (Remainder)
    function modulo(uint256 a, uint256 b) public pure returns (uint256) {
        require(b > 0, "Error: Modulo by zero is undefined");
        return a % b;
    }
}
