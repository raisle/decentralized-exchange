require('babel-register');
require('babel-polyfill');
require('dotenv').config();

const Web3 = require("web3");

module.exports = {
    networks: {
        development: {
            provider: () => new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
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
