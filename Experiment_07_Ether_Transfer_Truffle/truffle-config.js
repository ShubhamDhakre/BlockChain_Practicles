/**
 * Truffle Configuration for Practical 7
 * Configured for local Ganache instance (GUI: 7545, CLI: 8545)
 */

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,            // Standard Ganache GUI port (or 8545 for ganache-cli)
      network_id: "*",       // Match any network id
      gas: 6721975,
      gasPrice: 20000000000  // 20 Gwei
    }
  },

  mocha: {
    timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
