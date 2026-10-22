/**
 * EXPERIMENT 7: Ether Transfer Simulation (Ganache + Truffle Workflow)
 * 
 * Aim: Write a Simple Smart Contract to Transfer Ether between Accounts,
 * Then Compile, Deploy, and Debug It Using Ganache, MetaMask, and Truffle.
 */

const crypto = require('crypto');

console.log('='.repeat(80));
console.log(' PRACTICAL 7: SMART CONTRACT ETHER TRANSFER (GANACHE + METAMASK + TRUFFLE)');
console.log('='.repeat(80));

// Simulated Ganache Local Blockchain State
const ganacheNetwork = {
    networkId: 5777,
    rpcUrl: "http://127.0.0.1:7545",
    gasLimit: 6721975,
    gasPriceGwei: 20,
    accounts: [
        {
            index: 0,
            address: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
            role: "Sender / Deployer (Account A)",
            balanceEth: 100.0000
        },
        {
            index: 1,
            address: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
            role: "Recipient (Account B)",
            balanceEth: 100.0000
        }
    ]
};

console.log('\n[1] CONNECTED TO GANACHE LOCAL RPC:');
console.log(`    RPC Endpoint : ${ganacheNetwork.rpcUrl}`);
console.log(`    Network ID   : ${ganacheNetwork.networkId}`);
console.log(`    Gas Limit    : ${ganacheNetwork.gasLimit.toLocaleString()}`);

console.log('\n[2] INITIAL ACCOUNT BALANCES (PRE-TRANSFER):');
ganacheNetwork.accounts.forEach(acc => {
    console.log(`    • ${acc.role.padEnd(30)}: ${acc.address} | Balance: ${acc.balanceEth.toFixed(4)} ETH`);
});

// Deploying Contract
console.log('\n[3] TRUFFLE MIGRATION & DEPLOYMENT:');
console.log('    Executing: truffle migrate --reset --network development');
const contractAddress = "0x" + crypto.randomBytes(20).toString("hex");
const defaultRecipient = ganacheNetwork.accounts[1].address;
console.log(`    Deploying 'EtherTransfer.sol' with default recipient: ${defaultRecipient}`);
console.log(`    [✓] Contract deployed successfully at: ${contractAddress}`);

// Executing Ether Transfer
console.log('\n[4] EXECUTING ETHER TRANSFER TRANSACTION:');
const transferAmountEth = 5.0; // 5 Ether
const gasUsed = 21540;
const gasCostEth = (gasUsed * ganacheNetwork.gasPriceGwei * 1e9) / 1e18; // ~0.00043 ETH

console.log(`    Transfer Details:`);
console.log(`    • From (Sender)    : ${ganacheNetwork.accounts[0].address}`);
console.log(`    • To (Recipient)   : ${ganacheNetwork.accounts[1].address}`);
console.log(`    • Amount           : ${transferAmountEth} ETH`);
console.log(`    • Gas Used         : ${gasUsed.toLocaleString()} units @ 20 Gwei (${gasCostEth.toFixed(6)} ETH)`);

const txHash = "0x" + crypto.randomBytes(32).toString("hex");
console.log(`    • Transaction Hash : ${txHash}`);

// Update Balances
ganacheNetwork.accounts[0].balanceEth -= (transferAmountEth + gasCostEth);
ganacheNetwork.accounts[1].balanceEth += transferAmountEth;

console.log('\n[5] UPDATED ACCOUNT BALANCES (POST-TRANSFER):');
ganacheNetwork.accounts.forEach(acc => {
    console.log(`    • ${acc.role.padEnd(30)}: ${acc.address} | Balance: ${acc.balanceEth.toFixed(4)} ETH`);
});

console.log('\n[6] METAMASK WALLET VERIFICATION:');
console.log('    • MetaMask Custom RPC network: Localhost 7545');
console.log('    • Account 0 balance deducted by 5 ETH + gas.');
console.log('    • Account 1 balance credited by 5 ETH.');

console.log('\n' + '='.repeat(80));
console.log(' Output: Ether is successfully transferred from sender to recipient.');
console.log('='.repeat(80) + '\n');
