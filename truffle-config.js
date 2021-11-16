/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

require('dotenv').config()

const HDWalletProvider = require('@truffle/hdwallet-provider')
const {
  INFURA_KEY,
  PRIVATE_KEY
} = process.env

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.

    development: {
      host: "127.0.0.1",         // Localhost (default: none)
      port: 8545,                // Standard Ethereum port (default: none)
      network_id: "*",           // Any network (default: none)
      gasPrice: 0,               // 0 Gwei gas price for localhost
    },

    mainnet: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, `https://mainnet.infura.io/v3/${INFURA_KEY}`),
      network_id: 1,            // Mainnet id
      gas: 7500000,             // Mainnet gas limit is 12.5 mln now, 7.5 mln is enough for our deployment
      gasPrice: 0x174876e800,   // 100 gwei
      confirmations: 0,         // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,       // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true          // Skip dry run before migrations? (default: false for public nets )
    },

    ropsten: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, `https://ropsten.infura.io/v3/${INFURA_KEY}`),
      network_id: 3,            // Ropsten's id
      gas: 5500000,             // Ropsten has a lower block limit than mainnet
      gasPrice: 0x174876e800,   // 100 gwei
      confirmations: 0,         // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,       // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true          // Skip dry run before migrations? (default: false for public nets )
    },

    rinkeby: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, `https://rinkeby.infura.io/v3/${INFURA_KEY}`),
      network_id: 4,            // Rinkeby's id
      gas: 5500000,             // Rinkeby has a lower block limit than mainnet
      gasPrice: 0x174876e800,   // 100 gwei
      confirmations: 0,         // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50,        // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true          // Skip dry run before migrations? (default: false for public nets )
    },

    kovan: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, `https://kovan.infura.io/v3/${INFURA_KEY}`),
      network_id: 42,           // Kovan's id
      gas: 5500000,             // Ropsten has a lower block limit than mainnet
      gasPrice: 0x174876e800,   // 100 gwei
      confirmations: 0,         // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50,        // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true          // Skip dry run before migrations? (default: false for public nets )
    },

    bsc: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, `https://bsc-dataseed.binance.org/`),
      network_id: 56,           // Kovan's id
      gas: 9500000,             // Ropsten has a lower block limit than mainnet
      gasPrice: '10000000000',  // 10 gwei
      confirmations: 0,         // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50,        // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true          // Skip dry run before migrations? (default: false for public nets )
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.2",    // Fetch exact version from solc-bin (default: truffle's version)
      docker: false,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "istanbul"
      }
    }
  }
}
