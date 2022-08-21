require('babel-register');
require('babel-polyfill');
require('dotenv').config();

module.exports = {
  networks: {
    development: {
      host: "",
      port: 7545,
      network_id: "*" // To match any network id
    }
  },
contracts_directory: './src/contracts/',
contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
