/**
 * EXPERIMENT 2: Blockchain Mining Visualizer & Energy Analysis (CLI)
 * 
 * Aim: Write a program that implements a web-based interactive blockchain mining visualizer
 * to simulate block creation, proof-of-work, difficulty adjustment, and SHA-256 hash analysis.
 * Also analyse how difficulty level impacts mining time and energy consumption.
 */

const crypto = require('crypto');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
        this.miningTimeMs = 0;
        this.energyJoules = 0;
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.data) +
                this.nonce
            )
            .digest('hex');
    }

    mineBlock(difficulty) {
        const target = '0'.repeat(difficulty);
        const startTime = process.hrtime.bigint();

        // Proof of Work: loop until hash starts with 'difficulty' number of zeros
        while (!this.hash.startsWith(target)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        const endTime = process.hrtime.bigint();
        // Calculate elapsed time in milliseconds
        this.miningTimeMs = Number(endTime - startTime) / 1_000_000;
        
        // Energy consumption model:
        // Estimated CPU hashing power consumption ~ 65 Watts average TDP
        // Energy (Joules) = Power (Watts) * Time (Seconds) = 65 * (miningTimeMs / 1000)
        this.energyJoules = (65 * (this.miningTimeMs / 1000));
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        const genesis = new Block(0, '2026-01-01T00:00:00Z', { message: 'Genesis Block' }, '0');
        genesis.hash = genesis.calculateHash();
        return genesis;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock, difficulty) {
        newBlock.previousHash = this.getLatestBlock().hash;
        console.log(`\n[*] Mining Block #${newBlock.index} with Difficulty ${difficulty} (Target: '${'0'.repeat(difficulty)}...')...`);
        newBlock.mineBlock(difficulty);
        this.chain.push(newBlock);
        
        console.log(`    [✓] Block Mined! Nonce: ${newBlock.nonce.toLocaleString()} | Hash: ${newBlock.hash}`);
        console.log(`    [✓] Time Taken: ${newBlock.miningTimeMs.toFixed(3)} ms | Est. Energy: ${this.formatEnergy(newBlock.energyJoules)}`);
    }

    formatEnergy(joules) {
        if (joules < 0.001) return `${(joules * 1000).toFixed(4)} mJ`;
        if (joules > 1000) return `${(joules / 1000).toFixed(4)} kJ`;
        return `${joules.toFixed(4)} J`;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

// -------------------------------------------------------------
// Execution & Empirical Difficulty Analysis
// -------------------------------------------------------------
console.log('='.repeat(80));
console.log(' PRACTICAL 2: BLOCKCHAIN PROOF-OF-WORK MINING & DIFFICULTY IMPACT ANALYSIS');
console.log('='.repeat(80));

const myBlockchain = new Blockchain();
const difficulties = [1, 2, 3, 4, 5];
const analysisResults = [];

console.log('\n[+] SIMULATING BLOCK MINING WITH DYNAMIC DIFFICULTY ADJUSTMENT:');

difficulties.forEach((diff, i) => {
    const blockIndex = i + 1;
    const blockData = {
        sender: `Node_0${blockIndex}`,
        receiver: `Miner_0${blockIndex}`,
        amount: (blockIndex * 12.5).toFixed(2) + ' BTC',
        txId: crypto.randomBytes(4).toString('hex')
    };

    const newBlock = new Block(blockIndex, new Date().toISOString(), blockData);
    myBlockchain.addBlock(newBlock, diff);

    const hashrate = newBlock.miningTimeMs > 0 
        ? Math.round((newBlock.nonce / (newBlock.miningTimeMs / 1000))) 
        : newBlock.nonce * 1000;

    analysisResults.push({
        difficulty: diff,
        targetPrefix: '0'.repeat(diff),
        nonceAttempts: newBlock.nonce,
        timeMs: newBlock.miningTimeMs.toFixed(2),
        hashrate: hashrate.toLocaleString() + ' H/s',
        energy: myBlockchain.formatEnergy(newBlock.energyJoules)
    });
});

console.log('\n' + '='.repeat(80));
console.log(' EMPIRICAL PERFORMANCE & ENERGY ANALYSIS TABLE');
console.log('='.repeat(80));
console.table(analysisResults);

console.log('[+] MATHEMATICAL ANALYSIS:');
console.log('    • SHA-256 outputs a 64-character hexadecimal digest (each char has 16 possible values).');
console.log('    • Probability of leading zero for difficulty d: P(d) = (1/16)^d = 16^(-d).');
console.log('    • Expected hash attempts E(attempts) = 16^d:');
difficulties.forEach(d => {
    console.log(`      Difficulty ${d}: 16^${d} = ${(16 ** d).toLocaleString()} theoretical expected attempts.`);
});
console.log('    • Conclusion: Each difficulty increment increases computational time and energy exponentially by ~16x.');
console.log(`\n[+] Blockchain Validity Status: ${myBlockchain.isChainValid() ? '[✓] VALID' : '[x] INVALID'}\n`);
