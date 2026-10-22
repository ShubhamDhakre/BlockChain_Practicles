# PRACTICAL 8: Blockchain Merkle Tree & Tamper Detection

## Aim
Write a simple program to build a web-based application that simulates a blockchain, constructs Merkle Trees for transactions in each block, and demonstrates how tampering any transaction affects the blockchain integrity.

---

## Objectives
- To understand binary Merkle Tree data structures and cryptographic verification.
- To construct and visualize Merkle Trees from transaction hashes.
- To demonstrate how tampering with a single transaction alters parent nodes and the Merkle Root.
- To understand Simplified Payment Verification (SPV) and block header validation.

---

## Facilities
- Computer System
- Node.js Runtime (v18+)
- Web Browser

---

## Theory

### 1. What is a Merkle Tree?
A **Merkle Tree** (hash tree) is a binary tree in which every leaf node is labeled with the cryptographic hash of a data block (transaction), and every non-leaf node is labeled with the cryptographic hash of the labels of its child nodes:
$$\text{Parent Hash} = \text{SHA-256}(\text{Child}_{\text{Left}} + \text{Child}_{\text{Right}})$$

At the apex of the tree sits a single hash called the **Merkle Root**, which summarizes all transactions contained in the block. The Merkle Root is stored directly inside the lightweight **Block Header**.

### 2. Properties & Benefits
- **$O(\log N)$ Verification**: Proving that a specific transaction is included in a block requires only $O(\log N)$ hashes (a Merkle Audit Path), enabling **Simplified Payment Verification (SPV)** / Light Clients on mobile devices without downloading the multi-gigabyte blockchain.
- **Cryptographic Tamper Sensitivity**: If even a single character, timestamp, or satoshi/wei amount in any transaction is modified:
  1. The transaction leaf hash changes completely due to the avalanche effect.
  2. The immediate parent hash changes.
  3. Every ancestor hash up to the Merkle Root changes.
  4. The block's header hash changes.
  5. The previous hash pointer stored in the next block becomes invalid, breaking the entire downstream blockchain.

---

## Recursive Construction Logic
```javascript
function buildMerkleTree(hashes) {
    if (hashes.length === 1) return hashes[0];
    let next = [];
    for (let i = 0; i < hashes.length; i += 2) {
        // If odd number of hashes, duplicate the last hash (Bitcoin standard)
        const left = hashes[i];
        const right = (i + 1 < hashes.length) ? hashes[i + 1] : hashes[i];
        next.push(sha256(left + right));
    }
    return buildMerkleTree(next);
}
```

---

## Procedure
1. Create a block containing 4 sample transactions:
   - Tx 0: `Alice -> Bob: 10 ETH`
   - Tx 1: `Bob -> Charlie: 5 ETH`
   - Tx 2: `Charlie -> Dave: 2 ETH`
   - Tx 3: `Dave -> Eve: 1 ETH`
2. Hash each transaction using SHA-256 to form the leaf layer ($H_0, H_1, H_2, H_3$).
3. Pair and concatenate adjacent leaf hashes to compute Level 1 parent hashes:
   $$H_{01} = \text{SHA-256}(H_0 + H_1), \quad H_{23} = \text{SHA-256}(H_2 + H_3)$$
4. Compute the Merkle Root at Level 2:
   $$\text{Merkle Root} = \text{SHA-256}(H_{01} + H_{23})$$
5. Calculate the Block Hash incorporating the Merkle Root.
6. Mutate transaction 1 (e.g., change amount from 5 ETH to 500 ETH) and re-evaluate the tree.
7. Observe how the Merkle root changes, failing parity validation with the stored block header.

---

## How to Run
### Option A: CLI Terminal Execution
```bash
node Experiment_08_Merkle_Tree_Tamper/merkle_tamper_demo.js
```

### Option B: Interactive Web Visualizer
Open `Experiment_08_Merkle_Tree_Tamper/index.html` in your browser or run:
```bash
npm start
# Navigate to http://localhost:3000/Experiment_08_Merkle_Tree_Tamper/
```

---

## Output
```
================================================================================
 PRACTICAL 8: MERKLE TREE CONSTRUCTION & BLOCKCHAIN TAMPER DETECTION
================================================================================

[1] CONSTRUCTING ORIGINAL BLOCK WITH 4 TRANSACTIONS:
    • [0] Tx 0: Alice -> Bob: 10 ETH  --> Hash: bd640edba891a170...
    • [1] Tx 1: Bob -> Charlie: 5 ETH  --> Hash: 4506d9b644d12e95...
    • [2] Tx 2: Charlie -> Dave: 2 ETH  --> Hash: b2457a5fec0700b0...
    • [3] Tx 3: Dave -> Eve: 1 ETH  --> Hash: edf3a40993604edc...

[2] MERKLE TREE HIERARCHY (BOTTOM TO TOP):
    Level 0 (Leaf Hashes)        : 4 Hashes
      H_0  : bd640edba891a1705468bb09a80983f4828cd99ba3278e3b3827856ca07d243d
      H_1  : 4506d9b644d12e954c008e356128f6c22c04ac3283cfbf2ed869665855adf5c5
      H_2  : b2457a5fec0700b0aaf2ad144a980e72ae69789abf6d3b1e900ca976b3e0b688
      H_3  : edf3a40993604edc6375bd24ddba3c8d62df69b69831a32cc853a4ba3915ff9f
    Level 1 (Intermediate Hashes): 2 Parent Hashes
      H_P0 : c5aee0f294c7c0dfce373bce3eb82093af30a6abde4a2430d62d8cca7dee4e4d
      H_P1 : ad42283a7369303e7461a0960e5c262cdba54b66a63324fb558bc14ff0145e0f
    Level 2 (Merkle Root)        : Top Root Hash
      ROOT : 507810ab020c6750a8c3fe5a25219e64d99310a9c9c922f4ebe1f9889cf575e5

    Calculated Block Hash: b4a27c7919643b0e3598534d56717da98e53eabf5fdd49f83672c33b37e4243b

================================================================================
 [3] SIMULATING MALICIOUS TRANSACTION TAMPERING ATTACK:
================================================================================
    Target Transaction Modified:
    - Original : "Tx 1: Bob -> Charlie: 5 ETH"
    + Tampered : "Tx 1: Bob -> Charlie: 500 ETH [TAMPERED]"

[4] IMPACT OF TAMPERING ON CRYPTOGRAPHIC INTEGRITY:

┌───────────────────────┬──────────────────────────────────────────────────────────────────┐
│ Tree Component        │ Value                                                            │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ Original Tx 1 Hash    │ 4506d9b644d12e954c008e356128f6c22c04ac3283cfbf2ed869665855adf5c5 │
│ Tampered Tx 1 Hash    │ e96f1e26d5f14bf9b837acb971f036ebef307753bc1d9463ea9bb3150a3fa3de │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ Original Level 1 H_01 │ c5aee0f294c7c0dfce373bce3eb82093af30a6abde4a2430d62d8cca7dee4e4d │
│ Tampered Level 1 H_01 │ 46290b10d26543a708880898ea5ca1f3148f490d4b3653526d2445b48a02420d │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ Original Merkle Root  │ 507810ab020c6750a8c3fe5a25219e64d99310a9c9c922f4ebe1f9889cf575e5 │
│ Tampered Merkle Root  │ 712b52165c64ca7e257351b7989bd3a1c826f59633656eb0c43949d43bea0b2f │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ Original Block Hash   │ b4a27c7919643b0e3598534d56717da98e53eabf5fdd49f83672c33b37e4243b │
│ Tampered Block Hash   │ 1bb1e34e7505221cb9732370a0a326073d21878c2fbcdad12bd6506a06a593a6 │
└───────────────────────┴──────────────────────────────────────────────────────────────────┘

[5] BLOCKCHAIN INTEGRITY VERIFICATION:
    • Stored Block Merkle Root vs Recomputed : [x] MISMATCH (TAMPER DETECTED!)
    • Stored Block Hash vs Recomputed        : [x] INVALID (LEDGER CORRUPTED!)
    • Network Action                         : Block rejected by consensus nodes.

================================================================================
 Output: Merkle Root and changed block hashes are displayed after tampering.
================================================================================
```

---

## Conclusion
The Merkle Tree and blockchain tamper-detection mechanism were successfully demonstrated. Modifying any single transaction completely changes its SHA-256 hash, which cascades upward to alter intermediate parent hashes and the Merkle Root. Consequently, the recomputed block hash does not match the block header, immediately alerting nodes to reject the fraudulent block and preserving distributed ledger immutability.
