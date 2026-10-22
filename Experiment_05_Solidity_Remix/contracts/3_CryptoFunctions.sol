// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CryptographicFunctions
 * @dev Experiment 5 - Part 3: Cryptographic Functions in Solidity
 * Built-in functions: keccak256, sha256, ripemd160, ecrecover
 */
contract CryptographicFunctions {

    // 1. Keccak-256 (Ethereum's primary cryptographic hash function)
    function generateKeccak256(string memory text, uint256 number) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(text, number));
    }

    // 2. SHA-256 (Standard cryptographic hash function)
    function generateSha256(string memory text) public pure returns (bytes32) {
        return sha256(abi.encodePacked(text));
    }

    // 3. RIPEMD-160 (Used in Bitcoin & Ethereum address generation)
    function generateRipemd160(string memory text) public pure returns (bytes20) {
        return ripemd160(abi.encodePacked(text));
    }

    // 4. ECDSA Signature Verification using ecrecover
    function recoverSigner(
        bytes32 messageHash,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public pure returns (address) {
        // ecrecover takes the hash and the signature components (v, r, s)
        // and returns the Ethereum address of the signer
        address signer = ecrecover(messageHash, v, r, s);
        require(signer != address(0), "Invalid signature: Zero address recovered");
        return signer;
    }
}
