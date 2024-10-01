// eslint-disable-next-line no-undef
const Migration = artifacts.require("Migration");
// eslint-disable-next-line no-undef
const Tether = artifacts.require("Tether");
// eslint-disable-next-line no-undef
const RWD = artifacts.require("RWD");
// eslint-disable-next-line no-undef
const DecentralBank = artifacts.require("DecentralBank");

// Попробовать переписать все под использование Asyn Await
module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Migration);
  await deployer.deploy(Tether);
  const tether = await Tether.deployed();

  await deployer.deploy(RWD);
  const rwd = await RWD.deployed();

  await deployer.deploy(DecentralBank, rwd.address, tether.address);
  const decentralBank = await DecentralBank.deployed();

  // Transfer all RWD tokens to Decentral Bank
  await rwd.transfer(decentralBank.address, 1000000000000000000n);

  // Transfer 100 mock Tether tokens to investors
  await tether.transfer(accounts[1], 1000000000000000000n);
};
