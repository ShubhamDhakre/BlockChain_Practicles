/**
 * EXPERIMENT 4: Exploring Consensus Mechanisms (PoW vs PoS)
 * Implementation, Empirical Benchmarking & Security Analysis
 * 
 * Aim: Exploring Consensus Mechanisms
 * 1. Implementation and Comparison: Develop and compare various consensus mechanisms, such as Proof of Work and Proof of Stake
 * 2. Performance and Security Analysis: Evaluate the performance and security characteristics of each consensus mechanism and compare the performance of both mechanism
 */

const crypto = require('crypto');

function calculateHash(block) {
    return crypto
        .createHash('sha256')
        .update(block.index + block.previousHash + block.timestamp + JSON.stringify(block.data) + block.nonce)
        .digest('hex');
}

// ---------------------------------------------------------------------
// 1. PROOF OF WORK (PoW) IMPLEMENTATION
// ---------------------------------------------------------------------
class PoWSystem {
    constructor(difficulty = "000") {
        this.difficulty = difficulty;
    }

    mineBlock(block, miners) {
        const startTime = process.hrtime.bigint();
        
        // Simulating 3 competing miners racing to find the nonce
        let winnerMiner = null;
        let totalHashesCalculated = 0;

        // Loop matching syllabus code snippet:
        while (!block.hash.startsWith(this.difficulty)) {
            block.nonce++;
            block.hash = calculateHash(block);
            totalHashesCalculated++;
        }

        // Assign win among miners strictly weighted by their hashing power
        const totalPower = miners.reduce((acc, m) => acc + m.power, 0);
        let randPower = Math.random() * totalPower;
        for (const miner of miners) {
            if (randPower < miner.power) {
                winnerMiner = miner;
                break;
            }
            randPower -= miner.power;
        }
        if (!winnerMiner) winnerMiner = miners[0];

        const endTime = process.hrtime.bigint();
        const durationMs = Number(endTime - startTime) / 1_000_000;
        // 65W TDP estimated energy: Energy = Power (Watts) * Time (s)
        const energyJoules = 65 * (durationMs / 1000);

        return {
            block,
            winner: winnerMiner.name,
            hashes: totalHashesCalculated,
            durationMs,
            energyJoules
        };
    }
}

// ---------------------------------------------------------------------
// 2. PROOF OF STAKE (PoS) IMPLEMENTATION
// ---------------------------------------------------------------------
class PoSSystem {
    constructor(validators) {
        this.validators = validators; // Array of { name, stake }
        this.totalStake = validators.reduce((acc, v) => acc + v.stake, 0);
    }

    // Weighted random selection based on staked token balance
    selectValidator() {
        let rand = Math.random() * this.totalStake;
        for (const validator of this.validators) {
            if (rand < validator.stake) {
                return validator;
            }
            rand -= validator.stake;
        }
        return this.validators[0];
    }

    createBlock(block) {
        const startTime = process.hrtime.bigint();

        // No heavy mining puzzle: directly select validator & sign block
        const validator = this.selectValidator();
        block.validator = validator.name;
        block.nonce = 0; // Not required in PoS
        block.hash = calculateHash(block);

        const endTime = process.hrtime.bigint();
        const durationMs = Number(endTime - startTime) / 1_000_000;
        // PoS requires only negligible validator signature verification (~0.05 Watts)
        const energyJoules = 0.05 * (durationMs / 1000);

        return {
            block,
            winner: validator.name,
            stake: validator.stake,
            durationMs,
            energyJoules
        };
    }
}

// ---------------------------------------------------------------------
// BENCHMARK EXECUTION & COMPARISON
// ---------------------------------------------------------------------
console.log('='.repeat(80));
console.log(' PRACTICAL 4: EXPLORING CONSENSUS MECHANISMS (PoW vs PoS)');
console.log('='.repeat(80));

const miners = [
    { name: 'Miner_Alpha (40% Hashrate)', power: 40 },
    { name: 'Miner_Beta (35% Hashrate)', power: 35 },
    { name: 'Miner_Gamma (25% Hashrate)', power: 25 }
];

const validators = [
    { name: 'Validator_Alice (50 ETH)', stake: 50 },
    { name: 'Validator_Bob (30 ETH)', stake: 30 },
    { name: 'Validator_Charlie (20 ETH)', stake: 20 }
];

const powSystem = new PoWSystem("000"); // 3 leading zeros
const posSystem = new PoSSystem(validators);

const comparisonTable = [];
let totalPowTime = 0, totalPosTime = 0;
let totalPowEnergy = 0, totalPosEnergy = 0;

console.log('\n[+] SIMULATING 5 CONSECUTIVE BLOCKS UNDER BOTH PROTOCOLS:\n');

for (let i = 1; i <= 5; i++) {
    const rawBlockPoW = {
        index: i,
        previousHash: '000abf8941728c' + i,
        timestamp: new Date().toISOString(),
        data: `Block #${i} Tx Batch`,
        nonce: 0,
        hash: ''
    };
    rawBlockPoW.hash = calculateHash(rawBlockPoW);

    const rawBlockPoS = { ...rawBlockPoW };

    // Run PoW
    const powResult = powSystem.mineBlock(rawBlockPoW, miners);
    // Run PoS
    const posResult = posSystem.createBlock(rawBlockPoS);

    totalPowTime += powResult.durationMs;
    totalPosTime += posResult.durationMs;
    totalPowEnergy += powResult.energyJoules;
    totalPosEnergy += posResult.energyJoules;

    comparisonTable.push({
        'Block': `#${i}`,
        'PoW Winner': powResult.winner.split(' ')[0],
        'PoW Hashes': powResult.hashes.toLocaleString(),
        'PoW Time (ms)': powResult.durationMs.toFixed(2),
        'PoW Energy (J)': powResult.energyJoules.toFixed(4),
        'PoS Validator': posResult.winner.split(' ')[0],
        'PoS Time (ms)': posResult.durationMs.toFixed(3),
        'PoS Energy (J)': (posResult.energyJoules * 1000).toFixed(6) + ' mJ'
    });
}

console.table(comparisonTable);

console.log('='.repeat(80));
console.log(' CUMULATIVE PERFORMANCE METRICS (5 BLOCKS):');
console.log('='.repeat(80));
console.log(`    Total PoW Time       : ${totalPowTime.toFixed(2)} ms`);
console.log(`    Total PoS Time       : ${totalPosTime.toFixed(3)} ms (Fast-path ~${(totalPowTime / (totalPosTime || 0.001)).toFixed(0)}x faster)`);
console.log(`    Total PoW Energy     : ${totalPowEnergy.toFixed(4)} Joules`);
console.log(`    Total PoS Energy     : ${(totalPosEnergy * 1000).toFixed(6)} milliJoules`);
console.log(`    Energy Reduction     : ~${((1 - totalPosEnergy / totalPowEnergy) * 100).toFixed(4)}% less energy used in PoS!`);

console.log('\n' + '='.repeat(80));
console.log(' SECURITY & ATTACK VULNERABILITY COMPARISON:');
console.log('='.repeat(80));
console.log(`
┌───────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
│ Parameter             │ Proof of Work (PoW)              │ Proof of Stake (PoS)             │
├───────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
│ Primary Resource      │ Computational Hardware & Power   │ Economic Tokens (Staked Capital) │
│ 51% Attack Cost       │ Rent/Acquire >50% Hashrate       │ Acquire >50% Staked Supply       │
│ Attack Consequence    │ Miner retains physical hardware  │ Slashing: Stolen stake burned    │
│ Nothing-at-Stake Risk │ Not Applicable (Burning energy)  │ Mitigated via Slashing penalties │
│ Environmental Impact  │ Massive Carbon Footprint         │ ~99.95% Green & Eco-friendly     │
│ Sybil Attack Defense  │ Bound by physical computing cost │ Bound by financial acquisition   │
│ Finality              │ Probabilistic (e.g. 6 blocks)    │ Deterministic (Epoch Finality)   │
└───────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
`);

console.log('OUTPUT: PoW and PoS performance comparison is displayed.');
console.log('='.repeat(80) + '\n');
