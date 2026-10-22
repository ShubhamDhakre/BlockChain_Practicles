/**
 * EXPERIMENT 1: Blockchain Environment & Principles Verification
 * 
 * Aim: Study of Blockchain Principles Including Types of Blockchain, Centralized vs Decentralized
 * Systems, Cryptography, and Consensus Mechanisms, along with Setup of Blockchain Environment on
 * Your M/C by Installing Node.js, VS Code, Ganache, Truffle, Hardhat, MetaMask, Geth, and Infura.
 */

const os = require('os');
const { execSync } = require('child_process');
const crypto = require('crypto');

function getCommandVersion(cmd) {
    try {
        const output = execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'], timeout: 8000 }).toString().trim();
        return output.split('\n')[0];
    } catch {
        return 'Not Installed / Not in PATH';
    }
}

console.log('='.repeat(75));
console.log(' PRACTICAL 1: BLOCKCHAIN ENVIRONMENT SETUP & PRINCIPLES VERIFICATION');
console.log('='.repeat(75));

// 1. System & Runtime Environment
console.log('\n[+] SYSTEM SPECIFICATIONS:');
console.log(`    OS Platform      : ${os.type()} ${os.release()} (${os.arch()})`);
console.log(`    CPU Model        : ${os.cpus()[0]?.model || 'N/A'}`);
console.log(`    Total Memory     : ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`);
console.log(`    Free Memory      : ${(os.freemem() / (1024 ** 3)).toFixed(2)} GB`);

// 2. Developer Tools Check
console.log('\n[+] BLOCKCHAIN TOOLCHAIN AUDIT:');
const tools = [
    { name: 'Node.js Engine', cmd: 'node -v' },
    { name: 'NPM Package Mgr', cmd: 'npm -v' },
    { name: 'Git Version Control', cmd: 'git --version' },
    { name: 'Hardhat Framework', cmd: 'npx hardhat --version 2>/dev/null || hardhat --version' },
    { name: 'Truffle Suite', cmd: 'truffle version 2>/dev/null' },
    { name: 'Ganache CLI', cmd: 'ganache --version 2>/dev/null' },
    { name: 'Geth (Go-Ethereum)', cmd: 'geth version 2>/dev/null' }
];

tools.forEach(tool => {
    const version = getCommandVersion(tool.cmd);
    const status = version.startsWith('Not') ? '[x]' : '[✓]';
    console.log(`    ${status} ${tool.name.padEnd(20)} : ${version}`);
});

// 3. Cryptography & Key Generation Verification
console.log('\n[+] CRYPTOGRAPHY VERIFICATION (SHA-256 & Key Generation):');
const sampleData = 'Blockchain Practical 1 - Environment Verification';
const sha256Hash = crypto.createHash('sha256').update(sampleData).digest('hex');
console.log(`    Sample String    : "${sampleData}"`);
console.log(`    SHA-256 Digest   : ${sha256Hash}`);

// Generate simulated Secp256k1 keypair (Ethereum standard)
const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1'
});
console.log(`    ECC Curve        : Secp256k1 (Ethereum & Bitcoin standard)`);
console.log(`    Key Generated    : [✓] Private/Public Asymmetric Pair Successfully Generated`);

// 4. Theoretical Blockchain Principles Overview
console.log('\n[+] BLOCKCHAIN ARCHITECTURE ROLES SUMMARY:');
console.log('    • Node.js & npm  : JavaScript runtime & package manager for smart contract tooling.');
console.log('    • VS Code        : Code editor with Solidity extensions & compiler plugins.');
console.log('    • Ganache        : One-click personal local blockchain for rapid development.');
console.log('    • Truffle        : Development environment, testing framework & asset pipeline.');
console.log('    • Hardhat        : Flexible Ethereum development environment for compiling & debugging.');
console.log('    • MetaMask       : Self-custodial browser extension wallet & Web3 provider.');
console.log('    • Geth           : Official Go implementation of Ethereum protocol node client.');
console.log('    • Infura         : Scalable API gateway to Ethereum Mainnet & Testnets (Sepolia/Holesky).');

console.log('\n' + '='.repeat(75));
console.log(' STATUS: Blockchain development environment checked successfully.');
console.log('='.repeat(75) + '\n');
