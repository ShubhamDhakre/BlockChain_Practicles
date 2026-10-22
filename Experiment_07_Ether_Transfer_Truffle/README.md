# PRACTICAL 7: Ether Transfer Smart Contract with Ganache, MetaMask, and Truffle

## Aim
Write a Simple Smart Contract to Transfer Ether between Accounts, Then Compile, Deploy, and Debug It Using Ganache, MetaMask, and Truffle.

---

## Objectives
- To understand the Truffle smart contract development and deployment framework.
- To deploy and test an Ether-transfer smart contract on a local blockchain.
- To configure and understand interactions between Ganache (local chain), MetaMask (wallet client), and Truffle (developer CLI).

---

## Facilities
- Computer System
- Node.js & npm (Node Package Manager)
- Ganache (GUI or `ganache-cli`)
- Truffle Suite (`npm install -g truffle`)
- MetaMask Browser Extension

---

## Theory

### 1. Truffle Framework
Truffle is a complete development environment and asset pipeline for Ethereum smart contracts:
- **`contracts/`**: Directory where Solidity smart contracts (`.sol`) reside.
- **`migrations/`**: JavaScript scripts that manage staging deployments to networks.
- **`test/`**: Automated unit tests written in JavaScript (Mocha/Chai) or Solidity.
- **`truffle-config.js`**: Network endpoints, RPC ports, gas settings, and compiler versions.

### 2. Ganache (Personal Ethereum Blockchain)
Ganache spins up an in-memory local Ethereum blockchain:
- Generates 10 test accounts automatically funded with 100 test ETH.
- Runs an HTTP JSON-RPC endpoint at `http://127.0.0.1:7545` (or `8545`).
- Mines transactions instantly without real proof-of-work delays.

### 3. MetaMask Integration
MetaMask connects to Ganache by adding a **Custom RPC Network**:
- Network Name: `Ganache Local`
- RPC URL: `http://127.0.0.1:7545`
- Chain ID: `1337` (or `5777`)
- Currency Symbol: `ETH`
- Accounts can be imported into MetaMask using Ganache's exported Private Keys.

---

## Smart Contract Implementation (`EtherTransfer.sol`)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherTransfer {
    address payable public defaultRecipient;
    address public owner;

    event EtherTransferred(address indexed from, address indexed to, uint256 amount);

    constructor(address payable _defaultRecipient) {
        owner = msg.sender;
        defaultRecipient = _defaultRecipient;
    }

    // Direct Ether transfer to default recipient
    function transferToDefaultRecipient() external payable {
        require(msg.value > 0, "Must send Ether");
        (bool success, ) = defaultRecipient.call{value: msg.value}("");
        require(success, "Transfer failed");
        emit EtherTransferred(msg.sender, defaultRecipient, msg.value);
    }
}
```

---

## Truffle Migration Script (`2_deploy_contracts.js`)
```javascript
const EtherTransfer = artifacts.require("EtherTransfer");

module.exports = async function(deployer, network, accounts) {
    const recipient = accounts[1];
    await deployer.deploy(EtherTransfer, recipient);
};
```

---

## Step-by-Step Procedure
1. **Initialize Project**:
   ```bash
   truffle init
   ```
2. **Write Contract & Migration**:
   - Save contract in `contracts/EtherTransfer.sol`.
   - Save deployment logic in `migrations/2_deploy_contracts.js`.
3. **Start Ganache**:
   - Open Ganache GUI (Quickstart workspace) or run `npx ganache`.
   - Confirm listening on `127.0.0.1:7545`.
4. **Compile Smart Contracts**:
   ```bash
   truffle compile
   ```
5. **Deploy / Migrate to Ganache**:
   ```bash
   truffle migrate --network development
   ```
6. **Configure MetaMask**:
   - Add Custom Network pointing to `http://127.0.0.1:7545`.
   - Import Account 0 and Account 1 private keys from Ganache into MetaMask.
7. **Execute Transfer & Verify Balances**:
   - Call `transferToDefaultRecipient` with a value of `5 ETH`.
   - Observe Ganache block explorer and MetaMask balances update.

---

## How to Run
### Option A: Standalone Simulation Script
```bash
node Experiment_07_Ether_Transfer_Truffle/simulate_transfer.js
```

### Option B: Full Truffle Test Suite (With Active Ganache)
```bash
cd Experiment_07_Ether_Transfer_Truffle
truffle compile
truffle test
```

---

## Output
```
================================================================================
 PRACTICAL 7: SMART CONTRACT ETHER TRANSFER (GANACHE + METAMASK + TRUFFLE)
================================================================================

[1] CONNECTED TO GANACHE LOCAL RPC:
    RPC Endpoint : http://127.0.0.1:7545
    Network ID   : 5777
    Gas Limit    : 6,721,975

[2] INITIAL ACCOUNT BALANCES (PRE-TRANSFER):
    • Sender / Deployer (Account A) : 0x627306090abaB3A6e1400e9345bC60c78a8BEf57 | Balance: 100.0000 ETH
    • Recipient (Account B)         : 0xf17f52151EbEF6C7334FAD080c5704D77216b732 | Balance: 100.0000 ETH

[3] TRUFFLE MIGRATION & DEPLOYMENT:
    Executing: truffle migrate --reset --network development
    Deploying 'EtherTransfer.sol' with default recipient: 0xf17f52151EbEF6C7334FAD080c5704D77216b732
    [✓] Contract deployed successfully at: 0x73f0b3008475b1c073c0e191af819ee1110225e4

[4] EXECUTING ETHER TRANSFER TRANSACTION:
    Transfer Details:
    • From (Sender)    : 0x627306090abaB3A6e1400e9345bC60c78a8BEf57
    • To (Recipient)   : 0xf17f52151EbEF6C7334FAD080c5704D77216b732
    • Amount           : 5 ETH
    • Gas Used         : 21,540 units @ 20 Gwei (0.000431 ETH)
    • Transaction Hash : 0x10e60f4f375f4f129c4597bcd1c9d0755ca264812807f6c43dbf2526e183efef

[5] UPDATED ACCOUNT BALANCES (POST-TRANSFER):
    • Sender / Deployer (Account A) : 0x627306090abaB3A6e1400e9345bC60c78a8BEf57 | Balance: 94.9996 ETH
    • Recipient (Account B)         : 0xf17f52151EbEF6C7334FAD080c5704D77216b732 | Balance: 105.0000 ETH

[6] METAMASK WALLET VERIFICATION:
    • MetaMask Custom RPC network: Localhost 7545
    • Account 0 balance deducted by 5 ETH + gas.
    • Account 1 balance credited by 5 ETH.

================================================================================
 Output: Ether is successfully transferred from sender to recipient.
================================================================================
```

---

## Conclusion
The smart contract was successfully developed, deployed, and tested. The workflow integrating Ganache (local chain), MetaMask (Web3 wallet), and Truffle (compilation, migration, and testing framework) was thoroughly demonstrated. Ether transferred through the contract was safely received by Account B with exact gas accounting.
