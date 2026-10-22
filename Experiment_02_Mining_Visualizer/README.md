# PRACTICAL 2: Interactive Blockchain Mining Visualizer & Energy Analysis

## Aim
Write a program that implements a web-based interactive blockchain mining visualizer to simulate block creation, proof-of-work, difficulty adjustment, and SHA-256 hash analysis. Also analyse how difficulty level impacts mining time and energy consumption.

---

## Objectives
- To understand block mining mechanics using Proof of Work (PoW).
- To study the exponential impact of target difficulty on nonce iterations and mining time.
- To understand SHA-256 cryptographic hashing and chain link integrity via `previousHash`.
- To evaluate empirical energy consumption models for blockchain consensus.

---

## Facilities
- Computer System
- Node.js Runtime (v18+)
- Web Browser (Chrome, Firefox, Edge) with HTML5 & Web Crypto API support

---

## Theory

### 1. Structure of a Block
Every block in a blockchain contains:
- **Index**: Position of the block within the chain (Genesis block has index 0).
- **Timestamp**: Time when the block was generated.
- **Data / Payload**: Recorded transactions (sender, receiver, amount, contract calls).
- **Previous Hash**: Digital fingerprint of the preceding block, creating an immutable cryptographic chain.
- **Nonce (Number Used Once)**: An arbitrary integer incremented iteratively by miners to alter the block's hash.
- **Current Hash**: The SHA-256 digest calculated over all the block contents:
  $$\text{Hash} = \text{SHA-256}(\text{Index} + \text{PreviousHash} + \text{Timestamp} + \text{Data} + \text{Nonce})$$

### 2. Proof of Work (PoW) & Difficulty Adjustment
In Proof of Work, the network establishes a difficulty target $d$. A block is considered valid only when its cryptographic hash satisfies the condition:
$$\text{Hash} < \text{Target} \quad \iff \quad \text{Hash begins with } d \text{ leading zeros}$$

Because SHA-256 exhibits the **Avalanche Effect** (any tiny change in input completely scrambles the output unpredictably), miners cannot reverse-engineer or predict a valid hash. They must brute-force nonces through repeated trials:
- For difficulty $d$, the probability of a randomly generated hash having $d$ leading hex zeros is:
  $$P = \left(\frac{1}{16}\right)^d = 16^{-d}$$
- The expected number of hash attempts $E(N)$ is:
  $$E(N) = 16^d$$

### 3. Mining Time & Energy Consumption Model
- **Mining Time ($T$)**:
  $$T = \frac{\text{Nonce Attempts}}{\text{Hash Rate (H/s)}}$$
- **Simulated Energy Consumption ($E$)**:
  $$E = P_{\text{TDP}} \times T_{\text{seconds}} \quad (\text{where } P_{\text{TDP}} \approx 65 \text{ Watts for standard mining hardware})$$
As difficulty increases linearly ($+1$), computational work, time, and electrical energy consumption scale **exponentially by a factor of 16**.

---

## Procedure
1. Create a blockchain class with an initial Genesis block.
2. Define a `Block` data structure with `index`, `timestamp`, `data`, `previousHash`, and `nonce`.
3. Implement `mineBlock(difficulty)` which iterates `nonce++` until the hash satisfies `hash.startsWith("0".repeat(difficulty))`.
4. Measure elapsed time using high-resolution timers (`process.hrtime.bigint()` in Node.js or `performance.now()` in browser).
5. Compute empirical energy usage and plot/tabulate results across difficulty levels 1 through 5.
6. Launch the web visualizer to inspect live nonce spinning and dynamic chain rendering.

---

## Code Snippet
```javascript
mineBlock(difficulty) {
  const target = "0".repeat(difficulty);
  const startTime = performance.now();

  while (!this.hash.startsWith(target)) {
    this.nonce++;
    this.hash = this.calculateHash();
  }

  this.miningTimeMs = performance.now() - startTime;
  this.energyJoules = 65 * (this.miningTimeMs / 1000); // 65W TDP model
}
```

---

## How to Run
### Option A: CLI Terminal Execution
```bash
node Experiment_02_Mining_Visualizer/mining_cli.js
```

### Option B: Interactive Web Visualizer
Open `Experiment_02_Mining_Visualizer/index.html` directly in your browser or run the project web server:
```bash
npm start
# Navigate to http://localhost:3000/Experiment_02_Mining_Visualizer/
```

---

## Output (Empirical Data)
```
================================================================================
 PRACTICAL 2: BLOCKCHAIN PROOF-OF-WORK MINING & DIFFICULTY IMPACT ANALYSIS
================================================================================

[+] SIMULATING BLOCK MINING WITH DYNAMIC DIFFICULTY ADJUSTMENT:
[*] Mining Block #1 with Difficulty 1 (Target: '0...')...
    [✓] Block Mined! Nonce: 43 | Hash: 09b51d383823928f45d42258a1ee3f550efc...
    [✓] Time Taken: 0.181 ms | Est. Energy: 0.0118 J

[*] Mining Block #2 with Difficulty 2 (Target: '00...')...
    [✓] Block Mined! Nonce: 428 | Hash: 00c2f8abd6bc9534a9e460092ac71cf9a4e4...
    [✓] Time Taken: 2.856 ms | Est. Energy: 0.1856 J

[*] Mining Block #3 with Difficulty 3 (Target: '000...')...
    [✓] Block Mined! Nonce: 11,351 | Hash: 000f4fd053b687aee5c49bfcdbd1bdb9...
    [✓] Time Taken: 19.057 ms | Est. Energy: 1.2387 J

[*] Mining Block #4 with Difficulty 4 (Target: '0000...')...
    [✓] Block Mined! Nonce: 29,589 | Hash: 0000a46b30241269239298b2b88a35e9...
    [✓] Time Taken: 27.922 ms | Est. Energy: 1.8150 J

[*] Mining Block #5 with Difficulty 5 (Target: '00000...')...
    [✓] Block Mined! Nonce: 1,771,316 | Hash: 0000036a3d56bc836b4cf112c2dafb3...
    [✓] Time Taken: 1682.386 ms | Est. Energy: 109.3551 J

================================================================================
 EMPIRICAL PERFORMANCE & ENERGY ANALYSIS TABLE
================================================================================
┌─────────┬────────────┬──────────────┬───────────────┬───────────┬─────────────────┬──────────────┐
│ (index) │ difficulty │ targetPrefix │ nonceAttempts │ timeMs    │ hashrate        │ energy       │
├─────────┼────────────┼──────────────┼───────────────┼───────────┼─────────────────┼──────────────┤
│ 0       │ 1          │ '0'          │ 43            │ '0.18'    │ '237,172 H/s'   │ '0.0118 J'   │
│ 1       │ 2          │ '00'         │ 428           │ '2.86'    │ '149,853 H/s'   │ '0.1856 J'   │
│ 2       │ 3          │ '000'        │ 11351         │ '19.06'   │ '595,635 H/s'   │ '1.2387 J'   │
│ 3       │ 4          │ '0000'       │ 29589         │ '27.92'   │ '1,059,687 H/s' │ '1.8150 J'   │
│ 4       │ 5          │ '00000'      │ 1771316       │ '1682.39' │ '1,052,860 H/s' │ '109.3551 J' │
└─────────┴────────────┴──────────────┴───────────────┴───────────┴─────────────────┴──────────────┘
```

---

## Conclusion
The blockchain mining process using Proof of Work was successfully simulated. It was empirically verified that:
1. Proof of Work relies on brute-force nonce exploration without shortcuts.
2. Increasing mining difficulty by 1 unit results in a theoretical ~16-fold increase in nonce attempts.
3. Computational duration and energy consumption scale exponentially with difficulty, establishing security against history tampering while simultaneously raising energy efficiency considerations.
