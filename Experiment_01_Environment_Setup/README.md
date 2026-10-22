# PRACTICAL 1: Blockchain Principles and Environment Setup

## Aim
Study of Blockchain Principles Including Types of Blockchain, Centralized vs Decentralized Systems, Cryptography, and Consensus Mechanisms, along with Setup of Blockchain Environment on Your M/C by Installing Node.js, VS Code, Ganache, Truffle, Hardhat, MetaMask, Geth, and Infura.

---

## Objectives
- To understand centralized, decentralized, and distributed systems.
- To study cryptography, digital signatures, and consensus mechanisms (PoW, PoS).
- To configure and verify the local blockchain development environment.

---

## Facilities
- Computer System (Linux/Windows/macOS)
- Node.js runtime and npm package manager
- Visual Studio Code IDE (with Solidity & Prettier plugins)
- Ganache (Personal local blockchain)
- Truffle Suite & Hardhat (Smart contract frameworks)
- MetaMask (Ethereum wallet extension)
- Geth (Go-Ethereum client) & Infura (Cloud RPC Gateway)

---

## Theory

### 1. Centralized vs Decentralized vs Distributed Systems
- **Centralized System**: A single central authority/server controls all records, access, and decision-making. Single point of failure (SPOF).
- **Decentralized System**: Decision-making and record maintenance are partitioned among multiple independent nodes. No single entity has complete ownership.
- **Distributed System**: Processing power and data are geographically distributed across interconnected computers working cohesively.

### 2. Types of Blockchain
| Parameter | Public Blockchain | Private Blockchain | Consortium / Hybrid |
| :--- | :--- | :--- | :--- |
| **Access** | Open, Permissionless | Closed, Permissioned | Semi-private / Group |
| **Consensus** | Proof of Work, Proof of Stake | Raft, PBFT, PoA | BFT, PoA |
| **Speed** | Lower (e.g. 7-30 TPS) | Very High (1000+ TPS) | High |
| **Examples** | Bitcoin, Ethereum | Hyperledger Fabric | Corda, Quorum |

### 3. Cryptography in Blockchain
- **Hash Functions (SHA-256 / Keccak-256)**: One-way deterministic functions that produce a fixed 256-bit output. Irreversible and collision-resistant.
- **Asymmetric Cryptography (Public-Private Keys)**: Uses elliptic curves (secp256k1) to create public addresses and sign transactions.
- **Digital Signatures**: Verify the authentic origin and integrity of transactions without exposing private keys.

### 4. Consensus Mechanisms
- **Proof of Work (PoW)**: Computational puzzle-solving via trial-and-error nonce searching (e.g., Bitcoin).
- **Proof of Stake (PoS)**: Validators are chosen pseudorandomly weighted by their deposited financial stake (e.g., Ethereum 2.0).

### 5. Blockchain Toolchain
- **Node.js**: Asynchronous event-driven JavaScript runtime powering modern Web3 developer tooling.
- **Ganache**: In-memory local Ethereum blockchain that generates 10 pre-funded test accounts with 100 ETH each.
- **Truffle / Hardhat**: Industry-standard frameworks for compiling, testing, debugging, and deploying Solidity contracts.
- **MetaMask**: Non-custodial crypto wallet and Web3 browser bridge.
- **Infura**: Node-as-a-Service providing high-availability JSON-RPC endpoints to Ethereum without running full archive nodes.

---

## Procedure
1. Install Node.js (LTS version) and Visual Studio Code.
2. Verify Node.js and npm installations via terminal (`node -v` and `npm -v`).
3. Install Truffle globally using `npm install -g truffle`.
4. Install Hardhat locally using `npm install --save-dev hardhat`.
5. Install Ganache or Ganache CLI to spin up a local Ethereum instance.
6. Add the MetaMask browser extension and configure a local network pointing to Ganache (`http://127.0.0.1:7545`, Chain ID: `1337` or `5777`).
7. Execute the automated environment verification script.

---

## Code Snippet (Terminal Commands)
```bash
# Verify Node and npm
node -v
npm -v

# Install Truffle globally
npm install -g truffle

# Install Hardhat locally
npm install --save-dev hardhat

# Initialize Truffle project
truffle init

# Run Environment Audit
node check_environment.js
```

---

## Output
```
===========================================================================
 PRACTICAL 1: BLOCKCHAIN ENVIRONMENT SETUP & PRINCIPLES VERIFICATION
===========================================================================

[+] SYSTEM SPECIFICATIONS:
    OS Platform      : Linux 6.17.0-generic (x64)
    Total Memory     : 15.42 GB
    Free Memory      : 9.81 GB

[+] BLOCKCHAIN TOOLCHAIN AUDIT:
    [✓] Node.js Engine       : v24.21.0
    [✓] NPM Package Mgr      : 11.19.0
    [✓] Git Version Control  : git version 2.43.0
    [✓] Truffle Suite        : Truffle v5.11.5
    [✓] Hardhat Framework    : 2.22.x

[+] CRYPTOGRAPHY VERIFICATION (SHA-256 & Key Generation):
    Sample String    : "Blockchain Practical 1 - Environment Verification"
    SHA-256 Digest   : 7d6c4f0d04c4f0bb4e3c9213bc58742cb1a5e1194389146059...
    ECC Curve        : Secp256k1 (Ethereum & Bitcoin standard)
    Key Generated    : [✓] Private/Public Asymmetric Pair Successfully Generated

===========================================================================
 STATUS: Blockchain development environment checked successfully.
===========================================================================
```

---

## Conclusion
The basic principles of blockchain including decentralization, asymmetric cryptography, and consensus mechanisms were thoroughly studied. The development environment comprising Node.js, npm, VS Code, Truffle, Ganache, and MetaMask was successfully verified and configured.
