/**
 * EXPERIMENT 8: Merkle Trees in Blockchain & Tamper Detection (CLI)
 * 
 * Aim: Write a simple program to build a web-based application that simulates
 * a blockchain, constructs Merkle Trees for transactions in each block, and
 * demonstrates how tampering any transaction affects the blockchain integrity.
 */

const crypto = require('crypto');

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Exact Recursive Merkle Tree construction function from syllabus
function buildMerkleTree(hashes) {
    if (hashes.length === 1) return hashes[0];
    let next = [];
    for (let i = 0; i < hashes.length; i += 2) {
        // If odd number of elements, duplicate last hash (standard Bitcoin/blockchain rule)
        const left = hashes[i];
        const right = (i + 1 < hashes.length) ? hashes[i + 1] : hashes[i];
        next.push(sha256(left + right));
    }
    return buildMerkleTree(next);
}

// Compute full tree levels for visualization
function getMerkleTreeLevels(txList) {
    const leafHashes = txList.map(tx => sha256(typeof tx === 'string' ? tx : JSON.stringify(tx)));
    const levels = [leafHashes];

    let current = leafHashes;
    while (current.length > 1) {
        let next = [];
        for (let i = 0; i < current.length; i += 2) {
            const left = current[i];
            const right = (i + 1 < current.length) ? current[i + 1] : current[i];
            next.push(sha256(left + right));
        }
        levels.push(next);
        current = next;
    }
    return {
        levels,
        root: current[0]
    };
}

class Block {
    constructor(index, previousHash, transactions) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = new Date().toISOString();
        this.transactions = transactions;
        this.merkleRoot = this.calculateMerkleRoot();
        this.nonce = 1042;
        this.hash = this.calculateBlockHash();
    }

    calculateMerkleRoot() {
        const hashes = this.transactions.map(tx => sha256(typeof tx === 'string' ? tx : JSON.stringify(tx)));
        return buildMerkleTree(hashes);
    }

    calculateBlockHash() {
        return sha256(this.index + this.previousHash + this.timestamp + this.merkleRoot + this.nonce);
    }
}

// ---------------------------------------------------------------------
// DEMONSTRATION & TAMPER DETECTION
// ---------------------------------------------------------------------
console.log('='.repeat(80));
console.log(' PRACTICAL 8: MERKLE TREE CONSTRUCTION & BLOCKCHAIN TAMPER DETECTION');
console.log('='.repeat(80));

// 1. Initial Genuine Transactions
const initialTransactions = [
    "Tx 0: Alice -> Bob: 10 ETH",
    "Tx 1: Bob -> Charlie: 5 ETH",
    "Tx 2: Charlie -> Dave: 2 ETH",
    "Tx 3: Dave -> Eve: 1 ETH"
];

console.log('\n[1] CONSTRUCTING ORIGINAL BLOCK WITH 4 TRANSACTIONS:');
initialTransactions.forEach((tx, i) => {
    console.log(`    • [${i}] ${tx}  --> Hash: ${sha256(tx).substring(0, 16)}...`);
});

const originalTree = getMerkleTreeLevels(initialTransactions);
const validBlock = new Block(1, '0000000000000000000000000000000000000000000000000000000000000000', [...initialTransactions]);

console.log('\n[2] MERKLE TREE HIERARCHY (BOTTOM TO TOP):');
console.log('    Level 0 (Leaf Hashes)        : 4 Hashes');
originalTree.levels[0].forEach((h, i) => console.log(`      H_${i}  : ${h}`));
console.log('    Level 1 (Intermediate Hashes): 2 Parent Hashes');
originalTree.levels[1].forEach((h, i) => console.log(`      H_P${i} : ${h}`));
console.log('    Level 2 (Merkle Root)        : Top Root Hash');
console.log(`      ROOT : ${originalTree.root}`);
console.log(`\n    Calculated Block Hash: ${validBlock.hash}`);

// 2. Tampering Attack Demonstration
console.log('\n' + '='.repeat(80));
console.log(' [3] SIMULATING MALICIOUS TRANSACTION TAMPERING ATTACK:');
console.log('='.repeat(80));

const tamperedTransactions = [...initialTransactions];
// Malicious actor modifies Tx 1 to steal funds: 5 ETH -> 500 ETH
tamperedTransactions[1] = "Tx 1: Bob -> Charlie: 500 ETH [TAMPERED]";

console.log(`    Target Transaction Modified:`);
console.log(`    - Original : "${initialTransactions[1]}"`);
console.log(`    + Tampered : "${tamperedTransactions[1]}"`);

const tamperedTree = getMerkleTreeLevels(tamperedTransactions);
const tamperedMerkleRoot = tamperedTree.root;

// Recalculating Block Hash with the tampered Merkle Root
const tamperedBlockHash = sha256(validBlock.index + validBlock.previousHash + validBlock.timestamp + tamperedMerkleRoot + validBlock.nonce);

console.log('\n[4] IMPACT OF TAMPERING ON CRYPTOGRAPHIC INTEGRITY:');
console.log(`
┌───────────────────────┬──────────────────────────────────────────────────────────────────┐
│ Tree Component        │ Value                                                            │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ Original Tx 1 Hash    │ ${originalTree.levels[0][1]} │
│ Tampered Tx 1 Hash    │ ${tamperedTree.levels[0][1]} │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ Original Level 1 H_01 │ ${originalTree.levels[1][0]} │
│ Tampered Level 1 H_01 │ ${tamperedTree.levels[1][0]} │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ Original Merkle Root  │ ${originalTree.root} │
│ Tampered Merkle Root  │ ${tamperedTree.root} │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ Original Block Hash   │ ${validBlock.hash} │
│ Tampered Block Hash   │ ${tamperedBlockHash} │
└───────────────────────┴──────────────────────────────────────────────────────────────────┘
`);

// 3. Blockchain Tamper Verification
console.log('[5] BLOCKCHAIN INTEGRITY VERIFICATION:');
const isRootMatching = (validBlock.merkleRoot === tamperedMerkleRoot);
const isBlockValid = (validBlock.hash === tamperedBlockHash);

console.log(`    • Stored Block Merkle Root vs Recomputed : ${isRootMatching ? '[✓] MATCH' : '[x] MISMATCH (TAMPER DETECTED!)'}`);
console.log(`    • Stored Block Hash vs Recomputed        : ${isBlockValid ? '[✓] VALID' : '[x] INVALID (LEDGER CORRUPTED!)'}`);
console.log(`    • Network Action                         : Block rejected by consensus nodes.`);

console.log('\n' + '='.repeat(80));
console.log(' Output: Merkle Root and changed block hashes are displayed after tampering.');
console.log('='.repeat(80) + '\n');
