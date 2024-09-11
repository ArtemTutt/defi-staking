module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id // connect to any network
    },
  },
  contracts_directory: "./src/contracts",
  contracts_build_directory: "./src/truffle_abis",
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200, // Optimize for how many times you intend to run the code
      },
      evmVersion: "byzantium",
    },
  },
};
