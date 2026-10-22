# Blockchain Technology Laboratory Practicals (Semester VII)

Complete, fully implemented, and executable laboratory suite for 7th Semester Blockchain Technology. Every practical contains **full working source code**, **interactive web visualizers**, **CLI execution scripts**, and **detailed theoretical lab manual writeups** (Aim, Objectives, Theory, Code, Outputs, and Conclusions) directly matching your syllabus.

---

## 📑 Table of Practicals

| Practical | Title / Topic | Tech Stack | Execution Mode | Directory |
| :---: | :--- | :--- | :---: | :--- |
| **01** | **Blockchain Environment Setup & Principles** | Node.js, Ganache, Truffle, Hardhat, MetaMask | CLI | [`Experiment_01_Environment_Setup/`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_01_Environment_Setup/) |
| **02** | **Interactive Blockchain Mining & Energy Visualizer** | HTML5, CSS3, Web Crypto, Node.js | Web + CLI | [`Experiment_02_Mining_Visualizer/`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_02_Mining_Visualizer/) |
| **03** | **RSA Public Key Encryption & Private Key Decryption** | Web Crypto API (`crypto.subtle`), Node.js | Web + CLI | [`Experiment_03_RSA_WebCrypto/`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_03_RSA_WebCrypto/) |
| **04** | **Consensus Mechanisms: PoW vs PoS Performance & Security** | JavaScript, Node.js, Web Charts | Web + CLI | [`Experiment_04_Consensus_Mechanisms/`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_04_Consensus_Mechanisms/) |
| **05** | **Solidity Programming & Remix IDE** | Solidity `^0.8.0`, Remix IDE, Node.js | Solidity + CLI | [`Experiment_05_Solidity_Remix/`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_05_Solidity_Remix/) |
| **06** | **RLP (Recursive Length Prefix) Encoding & JSON Comparison**| Ethereum RLP, Node.js, Binary Byte Breakdown | Web + CLI | [`Experiment_06_RLP_Encoding/`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_06_RLP_Encoding/) |
| **07** | **Ether Transfer with Ganache, MetaMask, and Truffle** | Solidity, Truffle Suite, Ganache, MetaMask | Truffle + CLI | [`Experiment_07_Ether_Transfer_Truffle/`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_07_Ether_Transfer_Truffle/) |
| **08** | **Merkle Trees & Blockchain Tamper Detection** | Binary Hash Tree, SHA-256, Dynamic Web UI | Web + CLI | [`Experiment_08_Merkle_Tree_Tamper/`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_08_Merkle_Tree_Tamper/) |

---

## 🚀 How to Run It (Quickstart Guide)

### Prerequisites
- **Node.js** (v18 or higher recommended; verified working on v24)
- **Web Browser** (Chrome, Firefox, Edge, or Brave)

---

### Method 1: Interactive Web Portal (Best Experience)
Launch the unified local web server to interact with all visualizers (Experiments 2, 3, 4, 6, and 8) through a sleek graphical dashboard:

```bash
# 1. Start the local server
npm start

# 2. Open your web browser and navigate to:
http://localhost:3000
```

From this portal, you can launch:
- ⚡ **Practical 2**: Dynamic Proof-of-Work Mining, Nonce spinning, and Energy calculation.
- 🔑 **Practical 3**: In-browser RSA 2048-bit Key Pair generation, encryption, decryption, and tamper rejection.
- ⚖️ **Practical 4**: PoW puzzle mining vs PoS stake-weighted validator lottery comparison.
- 📦 **Practical 6**: Ethereum RLP byte breakdown and live JSON size comparison.
- 🌳 **Practical 8**: Real-time Merkle Tree with interactive transaction editing and cascade tamper detection.

---

### Method 2: Running Any Experiment via NPM CLI
You can execute each practical's CLI simulation with a single short command:

```bash
# Run Practical 1 (Environment Setup & Verification)
npm run exp1

# Run Practical 2 (Mining Visualizer & Energy Analysis)
npm run exp2

# Run Practical 3 (RSA Public/Private Key Encryption/Decryption)
npm run exp3

# Run Practical 4 (PoW vs PoS Consensus Benchmarks & Security)
npm run exp4

# Run Practical 5 (Solidity Syntax, Arithmetic, Loops, Crypto, Factory, Access Control)
npm run exp5

# Run Practical 6 (RLP Ethereum Transaction Serialization vs JSON)
npm run exp6

# Run Practical 7 (Ether Transfer Smart Contract Simulation with Ganache accounts)
npm run exp7

# Run Practical 8 (Merkle Tree Construction & Tamper Detection Attack)
npm run exp8
```

---

### Method 3: Run All Experiments in Sequence
To execute and verify all 8 experiments automatically in one go:
```bash
npm run run-all
```

---

## 📚 Experiment Summaries & Technical Details

### Practical 1: Setup of Blockchain Environment & Principles
- **Aim**: Study of Blockchain Principles Including Types of Blockchain, Centralized vs Decentralized Systems, Cryptography, and Consensus Mechanisms, along with Setup of Blockchain Environment on Your M/C by Installing Node.js, VS Code, Ganache, Truffle, Hardhat, MetaMask, Geth, and Infura.
- **Run Command**: `npm run exp1`
- **Output**: Audits OS specs, Node.js engine, package managers, compiles SHA-256 and Secp256k1 key generation.

### Practical 2: Interactive Blockchain Mining Visualizer & Energy Analysis
- **Aim**: Write a program that implements a web-based interactive blockchain mining visualizer to simulate block creation, proof-of-work, difficulty adjustment, and SHA-256 hash analysis. Also analyse how difficulty level impacts mining time and energy consumption.
- **Run Command**: `npm run exp2` or open [`Experiment_02_Mining_Visualizer/index.html`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_02_Mining_Visualizer/index.html)
- **Key Takeaway**: Demonstrates that each difficulty increment increases nonce attempts and electrical energy consumption exponentially by $16\times$ ($O(16^d)$).

### Practical 3: RSA Public Key Encryption and Decryption (Web Crypto API)
- **Aim**: Write a Simple Web-Based Program to Implement RSA Public Key Encryption and Private Key Decryption Using the Web Crypto API.
- **Run Command**: `npm run exp3` or open [`Experiment_03_RSA_WebCrypto/index.html`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_03_RSA_WebCrypto/index.html)
- **Key Takeaway**: Demonstrates asymmetric cryptography with 2048-bit RSA-OAEP keys, proving that messages encrypted with the public key can only be decrypted by the private key, and unauthorized ciphertext mutation fails integrity verification.

### Practical 4: Exploring Consensus Mechanisms (PoW vs PoS)
- **Aim**: 1. Develop and compare various consensus mechanisms, such as Proof of Work and Proof of Stake. 2. Evaluate performance, resource requirements, energy reduction, and security characteristics (51% attacks).
- **Run Command**: `npm run exp4` or open [`Experiment_04_Consensus_Mechanisms/index.html`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_04_Consensus_Mechanisms/index.html)
- **Key Takeaway**: Proof of Stake processes blocks ~200x faster and reduces energy consumption by over 99.99% compared to Proof of Work, substituting physical hardware competition with economic staking and slashing penalties.

### Practical 5: Exploration of Remix IDE and Solidity Programming
- **Aim**: Exploration of Remix IDE, Solidity Programming, Wallet Types, Blockchain Use Cases, and Public vs. Private Blockchains. Demonstrate Solidity syntax for:
  1. Arithmetic Operations
  2. Looping Statements
  3. Cryptographic Functions (`keccak256`, `sha256`, `ripemd160`)
  4. Smart Contract Creation (Factory pattern via `new`)
  5. Restricted Access to a Contract (`onlyOwner` modifier)
- **Run Command**: `npm run exp5` or open [`Remix Ethereum IDE`](https://remix.ethereum.org) and load [`BlockchainMaster.sol`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_05_Solidity_Remix/contracts/BlockchainMaster.sol).
- **Key Takeaway**: Explains Ethereum Virtual Machine (EVM) execution, state variables, function visibility (`pure`, `view`, `external`), and access control.

### Practical 6: RLP Encoding of Ethereum Transactions
- **Aim**: Write a Simple Program to Understand RLP Encoding of Ethereum Transactions (encode, decode, and analyze difference between RLP and JSON).
- **Run Command**: `npm run exp6` or open [`Experiment_06_RLP_Encoding/index.html`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_06_RLP_Encoding/index.html)
- **Key Takeaway**: RLP delivers deterministic, canonical binary representation without whitespace variance, achieving an ~83% size reduction compared to JSON and providing direct input for Keccak-256 transaction IDs.

### Practical 7: Ether Transfer Smart Contract with Ganache, MetaMask, and Truffle
- **Aim**: Write a Simple Smart Contract to Transfer Ether between Accounts, Then Compile, Deploy, and Debug It Using Ganache, MetaMask, and Truffle.
- **Run Command**: `npm run exp7` (or `truffle compile && truffle test` inside `Experiment_07_Ether_Transfer_Truffle/`)
- **Key Takeaway**: Demonstrates deploying `EtherTransfer.sol` with `deployer.deploy(EtherTransfer, accounts[1])`, deducting Ether and gas from Account 0 and crediting Account 1.

### Practical 8: Merkle Trees & Blockchain Tamper Detection
- **Aim**: Write a simple program to build a web-based application that simulates a blockchain, constructs Merkle Trees for transactions in each block, and demonstrates how tampering any transaction affects the blockchain integrity.
- **Run Command**: `npm run exp8` or open [`Experiment_08_Merkle_Tree_Tamper/index.html`](file:///media/shubhamdhakre/New%20Volume/7th_Semester/BlockChain_Practicles/Experiment_08_Merkle_Tree_Tamper/index.html)
- **Key Takeaway**: Demonstrates binary hash tree computation where modifying even 1 byte in a single transaction propagates up through intermediate parent hashes to change the Merkle Root, invalidating the block hash and breaking chain integrity.

---

## 💡 Viva Voce & Interview Preparation

1. **What is the Avalanche Effect in SHA-256?**
   - A property where changing a single bit in the input causes an unpredictable cascade, drastically changing roughly 50% of output bits.
2. **Why does Proof of Work require dynamic difficulty adjustment?**
   - As global hashrate changes, difficulty adjusts to maintain a constant target block generation time (e.g. ~10 minutes in Bitcoin, ~12 seconds in early Ethereum).
3. **What is the difference between Hot and Cold Wallets?**
   - Hot wallets are connected to the internet (e.g. MetaMask), convenient for day-to-day transactions. Cold wallets are offline hardware devices (e.g. Ledger, Trezor) protecting private keys against network attacks.
4. **Why does Ethereum use RLP instead of JSON?**
   - RLP is binary, compact, and strictly canonical (one input has exactly one representation), which is required for deterministic cryptographic hashing.
5. **How does a Merkle Tree enable Light Clients (SPV)?**
   - Light clients verify if a transaction belongs to a block using a small Merkle audit path of $O(\log N)$ hashes instead of downloading all block transactions.
