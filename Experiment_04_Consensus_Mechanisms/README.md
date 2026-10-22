# PRACTICAL 4: Exploring Consensus Mechanisms (PoW vs PoS)

## Aim
### 1. Implementation and Comparison:
Develop and compare various consensus mechanisms, such as Proof of Work and Proof of Stake.
### 2. Performance and Security Analysis:
Evaluate the performance and security characteristics of each consensus mechanism and compare the performance of both mechanisms.

---

## Objectives
- To understand the fundamental working principles of Proof of Work (PoW) and Proof of Stake (PoS).
- To compare resource requirements (CPU cycles, memory, and energy consumption).
- To analyse network security, 51% attack vectors, and finality guarantees.

---

## Facilities
- Computer System
- Visual Studio Code (VS Code)
- JavaScript Runtime (Node.js) & Web Browser

---

## Theory

### 1. Proof of Work (PoW)
- Used in Bitcoin and early Ethereum.
- Miners compete globally to find a `nonce` such that the SHA-256 block hash is below a specific target difficulty (e.g. starts with `000...`).
- High computational difficulty ensures history immutability; rewriting a past block requires outpacing the rest of the entire network's combined hash power (51% attack).
- Drawback: Enormous electricity and specialized hardware (ASICs) consumption.

### 2. Proof of Stake (PoS)
- Used in Ethereum (The Merge / Casper FFG), Cardano, Solana, and Polkadot.
- Eliminates energy-intensive hashing. Instead, block creators (called **validators**) are pseudo-randomly selected based on the size of their staked tokens (e.g. 32 ETH in Ethereum).
- If a validator attempts double signing or acts maliciously, their deposited stake is permanently **slashed** (destroyed).
- Solves the environmental crisis, reducing energy expenditure by over 99.95%.

---

## Comprehensive Security & Architectural Comparison

| Metric / Parameter | Proof of Work (PoW) | Proof of Stake (PoS) |
| :--- | :--- | :--- |
| **Primary Resource** | Computational hardware (GPUs/ASICs) & Watts | Staked native cryptocurrency tokens |
| **Block Creator Selection** | First to brute-force valid nonce | Weighted random selection based on stake |
| **Average Block Creation Time** | Variable (seconds to minutes depending on diff) | Instantaneous / Fixed slots (e.g. 12 seconds) |
| **Energy Consumption** | ~100+ TWh/year (Grid scale) | ~0.0026 TWh/year (~99.95% reduction) |
| **Sybil Attack Resistance** | Physical cost of purchasing hardware | Economic cost of purchasing majority tokens |
| **51% Attack Cost** | Acquiring 51% of global hardware hashrate | Purchasing 51% of total staked circulating supply |
| **Attack Consequence** | Attacker retains hardware even if fork rejects | Attacker's entire staked capital is slashed & burned |
| **Nothing-at-Stake Problem** | Not applicable (miners cannot split real power) | Addressed via slashing penalties for signing dual forks |
| **Transaction Finality** | Probabilistic (e.g., 6 confirmations) | Deterministic (Epoch-level Casper checkpoint finality) |

---

## Procedure
1. Define a block data model with `index`, `previousHash`, `timestamp`, `data`, and `nonce`.
2. Implement `proofOfWork(block)` using a `while` loop that increments `block.nonce` until `block.hash.startsWith("000")`.
3. Implement `proofOfStake(block)` using a weighted random lottery based on validator stakes ($W_i = \text{Stake}_i / \sum \text{Stake}$).
4. Measure and compare execution time, hash iterations, and estimated energy expenditure over 5 consecutive blocks.
5. Print out the performance summary table and security characteristics.

---

## Code Snippet
```javascript
// Proof of Work snippet from syllabus:
function proofOfWork(block) {
  while (!block.hash.startsWith("000")) {
    block.nonce++;
    block.hash = calculateHash(block);
  }
  return block;
}

// Proof of Stake: Weighted validator selection
function selectPoSValidator(validators) {
  const totalStake = validators.reduce((sum, v) => sum + v.stake, 0);
  let random = Math.random() * totalStake;
  for (const validator of validators) {
    if (random < validator.stake) return validator;
    random -= validator.stake;
  }
}
```

---

## How to Run
### Option A: CLI Execution
```bash
node Experiment_04_Consensus_Mechanisms/consensus_comparison.js
```

### Option B: Interactive Web Comparison
Open `Experiment_04_Consensus_Mechanisms/index.html` in your browser or run:
```bash
npm start
# Navigate to http://localhost:3000/Experiment_04_Consensus_Mechanisms/
```

---

## Output
```
================================================================================
 PRACTICAL 4: EXPLORING CONSENSUS MECHANISMS (PoW vs PoS)
================================================================================

[+] SIMULATING 5 CONSECUTIVE BLOCKS UNDER BOTH PROTOCOLS:

┌─────────┬───────┬───────────────┬────────────┬───────────────┬────────────────┬───────────────────┬───────────────┬────────────────┐
│ (index) │ Block │ PoW Winner    │ PoW Hashes │ PoW Time (ms) │ PoW Energy (J) │ PoS Validator     │ PoS Time (ms) │ PoS Energy (J) │
├─────────┼───────┼───────────────┼────────────┼───────────────┼────────────────┼───────────────────┼───────────────┼────────────────┤
│ 0       │ '#1'  │ 'Miner_Alpha' │ '1,475'    │ '7.70'        │ '0.5006'       │ 'Validator_Bob'   │ '0.051'       │ '0.002564 mJ'  │
│ 1       │ '#2'  │ 'Miner_Beta'  │ '947'      │ '0.86'        │ '0.0556'       │ 'Validator_Bob'   │ '0.008'       │ '0.000416 mJ'  │
│ 2       │ '#3'  │ 'Miner_Gamma' │ '941'      │ '1.12'        │ '0.0725'       │ 'Validator_Alice' │ '0.004'       │ '0.000216 mJ'  │
│ 3       │ '#4'  │ 'Miner_Alpha' │ '4,547'    │ '4.42'        │ '0.2874'       │ 'Validator_Alice' │ '0.006'       │ '0.000297 mJ'  │
│ 4       │ '#5'  │ 'Miner_Alpha' │ '622'      │ '0.88'        │ '0.0575'       │ 'Validator_Bob'   │ '0.006'       │ '0.000287 mJ'  │
└─────────┴───────┴───────────────┴────────────┴───────────────┴────────────────┴───────────────────┴───────────────┴────────────────┘

================================================================================
 CUMULATIVE PERFORMANCE METRICS (5 BLOCKS):
================================================================================
    Total PoW Time       : 14.98 ms
    Total PoS Time       : 0.076 ms (Fast-path ~198x faster)
    Total PoW Energy     : 0.9736 Joules
    Total PoS Energy     : 0.003780 milliJoules
    Energy Reduction     : ~99.9996% less energy used in PoS!

OUTPUT: PoW and PoS performance comparison is displayed.
```

---

## Conclusion
PoW and PoS consensus mechanisms were successfully implemented, evaluated, and compared. Proof of Work provides battle-tested security rooted in thermodynamic expenditure, whereas Proof of Stake delivers drastically superior throughput and energy efficiency (~99.99% reduction in computational waste) while securing the network via economic collateral and slashing deterrents.
