// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title LoopingStatements
 * @dev Experiment 5 - Part 2: Looping Statements in Solidity (for, while, do-while)
 */
contract LoopingStatements {

    // 1. For Loop: Calculate sum of numbers from 1 to n
    function sumUpTo(uint256 n) public pure returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 1; i <= n; i++) {
            total += i;
        }
        return total;
    }

    // 2. While Loop: Calculate factorial of n
    function factorial(uint256 n) public pure returns (uint256) {
        if (n == 0) return 1;
        uint256 result = 1;
        uint256 current = n;
        while (current > 1) {
            result *= current;
            current--;
        }
        return result;
    }

    // 3. For Loop: Sum all elements in a dynamic array
    function sumArray(uint256[] memory numbers) public pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        return sum;
    }
}
