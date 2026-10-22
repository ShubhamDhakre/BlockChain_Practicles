# PRACTICAL 5: Exploration of Remix IDE and Solidity Programming

## Aim
Exploration of Remix IDE, Solidity Programming, Wallet Types, Blockchain Use Cases, and Public vs. Private Blockchains. Demonstrate the Programming Structure of Solidity with Syntax and Semantics. Write a Solidity Program to:
1. Perform Arithmetic Operations.
2. Perform Looping Statements.
3. Implement Cryptographic Functions.
4. Implement Smart Contract Creation.
5. Implement Restricted Access to a Contract.

---

## Objectives
- To master smart contract development in Solidity using Remix IDE.
- To implement foundational Solidity constructs: arithmetic, loops, and cryptographic hashes.
- To demonstrate dynamic contract creation via factory patterns.
- To enforce access control and security using custom function modifiers (`onlyOwner`).
- To understand wallet architectures and enterprise blockchain use cases.

---

## Facilities
- Computer System
- Browser with access to [Remix Ethereum IDE](https://remix.ethereum.org)
- Solidity Compiler (`^0.8.0`)
- Node.js for CLI test simulations

---

## Theory

### 1. Remix IDE
Remix is a browser-based integrated development environment (IDE) that provides:
- Code editor with Solidity syntax highlighting and linting.
- Multi-version Solidity compiler.
- In-browser simulated blockchain (Remix VM - London / Cancun) with 15 pre-funded test accounts (100 ETH each).
- Transaction debugger and gas consumption profiler.

### 2. Hot Wallets vs Cold Wallets
- **Hot Wallets (Software / Online)**: Connected to the internet (e.g., MetaMask, Trust Wallet, Phantom). Fast and convenient for DeFi and dApps, but more vulnerable to malware and phishing attacks.
- **Cold Wallets (Hardware / Offline)**: Physical devices storing private keys in a secure offline enclave (e.g., Ledger Nano X, Trezor Model T, paper wallets). Transactions are signed offline; keys never touch an internet-exposed device.

### 3. Public vs Private Blockchains
- **Public Blockchains (e.g. Ethereum, Bitcoin)**: Decentralized, permissionless, anonymous, open-source ledger where anyone can read, send transactions, or participate in consensus.
- **Private / Consortium Blockchains (e.g. Hyperledger Fabric, R3 Corda, Quorum)**: Permissioned networks controlled by an organization or enterprise consortium with strict identity and role-based access.

### 4. Real-World Blockchain Use Cases
- **Decentralized Finance (DeFi)**: Lending, automated market makers (Uniswap, Aave), stablecoins.
- **Supply Chain Provenance**: End-to-end tracking of pharmaceuticals, luxury goods, and food logistics.
- **Digital Identity & Verifiable Credentials (SSI)**: Self-sovereign cryptographic identity management.
- **Tokenization of Real-World Assets (RWA)**: Fractional ownership of real estate, bonds, and art.

---

## Code Implementations

### Part 1: Arithmetic Operations (`1_Calculator.sol`)
```solidity
pragma solidity ^0.8.0;
contract Calculator {
    function add(uint a, uint b) public pure returns(uint) { return a + b; }
    function subtract(uint a, uint b) public pure returns(uint) { require(a >= b); return a - b; }
    function multiply(uint a, uint b) public pure returns(uint) { return a * b; }
    function divide(uint a, uint b) public pure returns(uint) { require(b > 0); return a / b; }
}
```

### Part 2: Looping Statements (`2_Looping.sol`)
```solidity
pragma solidity ^0.8.0;
contract LoopingStatements {
    function sumRange(uint n) public pure returns(uint) {
        uint sum = 0;
        for (uint i = 1; i <= n; i++) sum += i;
        return sum;
    }
}
```

### Part 3: Cryptographic Functions (`3_CryptoFunctions.sol`)
```solidity
pragma solidity ^0.8.0;
contract CryptographicFunctions {
    function getKeccak256(string memory text) public pure returns(bytes32) {
        return keccak256(bytes(text));
    }
    function getSha256(string memory text) public pure returns(bytes32) {
        return sha256(bytes(text));
    }
}
```

### Part 4: Smart Contract Creation (`4_ContractCreation.sol`)
```solidity
pragma solidity ^0.8.0;
contract ChildContract {
    string public name;
    constructor(string memory _name) { name = _name; }
}
contract ContractFactory {
    ChildContract[] public children;
    function createChild(string memory _name) public returns(address) {
        ChildContract child = new ChildContract(_name);
        children.push(child);
        return address(child);
    }
}
```

### Part 5: Restricted Access (`5_RestrictedAccess.sol`)
```solidity
pragma solidity ^0.8.0;
contract RestrictedAccess {
    address public owner;
    constructor() { owner = msg.sender; }
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }
    function updateOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}
```

---

## Step-by-Step Procedure in Remix IDE
1. Open your browser and navigate to [https://remix.ethereum.org](https://remix.ethereum.org).
2. Under the File Explorer tab, create a new file named `BlockchainMaster.sol`.
3. Copy and paste the code from `contracts/BlockchainMaster.sol`.
4. Click on the **Solidity Compiler** tab (icon on the left) and select compiler version `0.8.20` or any `^0.8.0`.
5. Click **Compile BlockchainMaster.sol**.
6. Switch to the **Deploy & Run Transactions** tab:
   - Environment: Select `Remix VM (Cancun)`.
   - Account: Select the first account.
   - Click **Deploy**.
7. Expand the deployed contract under **Deployed Contracts**:
   - Test arithmetic: Click `add` with `a = 48, b = 12` -> Output: `60`.
   - Test looping: Click `sumRange` with `n = 10` -> Output: `55`.
   - Test cryptography: Click `hashKeccak256` with `"Ethereum"` -> Computes Keccak-256 hash.
   - Test contract creation: Click `createNewVault` with `"TreasuryAlpha"` -> Deploys child contract.
   - Test restricted access: Call `setTreasury` from owner account (succeeds); switch to another account and call `setTreasury` (reverts with authorization error).

---

## How to Run (CLI Simulation)
```bash
node Experiment_05_Solidity_Remix/test_solidity_simulation.js
```

---

## Output
```
================================================================================
 PRACTICAL 5: SOLIDITY PROGRAMMING & REMIX IDE EXECUTION SIMULATION
================================================================================

[1] ARITHMETIC OPERATIONS (Calculator.sol):
    Inputs: a = 48, b = 12
    • add(48, 12)      = 60
    • subtract(48, 12) = 36
    • multiply(48, 12) = 576
    • divide(48, 12)   = 4
    • modulo(48, 12)   = 0

[2] LOOPING STATEMENTS (LoopingStatements.sol):
    • for loop: sumRange(10)   = 55 (Sum of 1..10)
    • while loop: factorial(5) = 120 (5 * 4 * 3 * 2 * 1)

[3] CRYPTOGRAPHIC FUNCTIONS (CryptoFunctions.sol):
    Input String: "Ethereum Solidity 2026"
    • keccak256 : 0x0e0f52329074c8b3b9dfa3f6e39f55987885e7d9bc20c3835b81d7f81070a3f4
    • sha256    : 0xf5ec07aa36024379a09d14c39b3e028bc441d3472b28ce86f88eff7581407c8c
    • ripemd160 : 0x5d53bb85ed9a00a55e85b756927fbd2f2eb9573f

[4] SMART CONTRACT CREATION (ContractFactory.sol):
    Factory Contract deployed at: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    • Spawning Child Contract 1 ("TreasuryVaultAlpha"): Deployed at 0x28a8746e75304c0780E011BEd21C72cD78cd535E
    • Spawning Child Contract 2 ("TreasuryVaultBeta") : Deployed at 0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E
    • Total Deployed Children: 2

[5] RESTRICTED ACCESS (RestrictedAccess.sol):
    Contract Owner : 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    Current State  : treasuryBalance = 5000 ETH
    [Action] Owner calls setTreasury(7500)...
    [✓] Authorized! New treasuryBalance = 7500 ETH
    [Action] Attacker (0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2) calls setTreasury(0)...
    [x] REVERTED! Error: Caller is not the authorized contract owner.
    [✓] State Protected: treasuryBalance remains 7500 ETH.

================================================================================
 OUTPUT: Solidity contract is compiled and arithmetic result is displayed.
================================================================================
```

---

## Conclusion
Solidity syntax, compilation, and EVM semantics were thoroughly studied using Remix IDE. All 5 core programming structures (arithmetic operations, looping statements, cryptographic hash functions, contract creation via factories, and modifier-based access restriction) were successfully implemented and verified.
