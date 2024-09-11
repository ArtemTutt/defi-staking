/* eslint-disable */
// import { default as Web3 } from "web3";

const Migration = artifacts.require("Migration");
const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

contract("DecentralBank", (accounts) => {
  let tether;
  let rwd;
  let db;
  
  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }
  
  before(async () => {
    tether = await Tether.deployed();
    rwd = await RWD.deployed();
    db = await DecentralBank.deployed(rwd.address, tether.address);
    
    {
      /*
      Так как действия по трансферу токенов к аккаунту инвестора и на акк банка
      выполняются в 1_initial_migration, и они подтягиваются и в тесты => повторное действие трансфера не нужно
      в разделе before, ведь токены уже расположены на адресах контрактак и можно сразу переходить к тестированию
      (возможно для более правильного тестирования, нам нужно отдельно инициализировать трансфер в test областях для
      более корректной работы)
      */
    }
    
    // Transfer all RWD tokens to Decentral Bank
    // await rwd.transfer(db.address, tokens("1000"));
    // Transfer 100 mock Tether tokens to investors
    // await tether.transfer(accounts[1], 1000000000000000000n, {from: accounts[0]});
  });
  
  // All of the code goes here for testing
  describe("Mock Tether Deployment", async () => {
    it("deploys successfully Tether", async () => {
      //   const tether = await Tether.deployed();
      const name = await tether.name();
      assert.equal(name, "Tether");
    });
    it("check transfers successfully", async () => {
      //   const tether = await Tether.deployed();
      const balance = await tether.balanceOf(accounts[1]);
      assert.equal(balance.toString(), "1000000000000000000");
    });
  });
  
  describe("RWD Deployment", async () => {
    it("deploys successfully RWD", async () => {
      //   const rwd = await RWD.deployed();
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });
  
  describe("Decentral Bank Deployment", async () => {
    it("deploys successfully Decentral Bank", async () => {
      //   const rwd = await RWD.deployed();
      const name = await db.name();
      assert.equal(name, "Decentral Bank");
    });
    
    it("contract has tokens", async () => {
      const balance = await rwd.balanceOf(db.address);
      assert.equal(balance.toString(), "1000000000000000000");
    });
  });
  
  describe("Yield staking ", async () => {
    it("rewards tokens for staking", async () => {
      // check investors balance
      const balance = await tether.balanceOf(accounts[1]);
      assert.equal(balance.toString(), "1000000000000000000");
    });
    
    it("Check staking rewards", async () => {
      // Check staking rewards
      await tether.approve(db.address, "1000000000000000000", {from: accounts[1]});
      await db.stakingTokens("1000000000000000000", {from: accounts[1]});
    });
    
    it("Check Update Balance of Customer", async () => {
      // check Update Balance of Customer 
      const balance = await tether.balanceOf(accounts[1]);
      assert.equal(balance.toString(), "0", "Balance should be 0");
    });
    
    it("Check Balance of DecBank", async () => {
      // Check Balance of DecBank 
      const balance = await tether.balanceOf(db.address);
      assert.equal(balance.toString(), "1000000000000000000");
    })
  });
  
  describe("Yield unStakingAll", async () => {
    it("Check Balance of DecBank", async () => {
      // Check Balance of DecBank
      const balance = await tether.balanceOf(db.address);
      assert.equal(balance.toString(), "1000000000000000000");
    });
    it("Check unStakingAll", async () => {
      // Check unStaking 
      await db.unStakingTokensAll({from: accounts[1]});
    });
    it("Check balance of Customer", async () => {
      // Check balance of Customer 
      const balance = await tether.balanceOf(accounts[1]);
      assert.equal(balance.toString(), "1000000000000000000", "Balance should be 1 ETH");
    });
  });

  describe("Yield unStakingSomeTokens", async () => {
    it("Check Balance of DecBank", async () => {
      // Check Balance of DecBank
      const balance = await tether.balanceOf(db.address);
      assert.equal(balance.toString(), "1000000000000000000");
    });
    it("Check unStaking", async () => {
      // Check unStaking 
      await db.unStakingTokens("100000000000", {from: accounts[1]});
    });
    it("Check balance of Customer", async () => {
      // Check balance of Customer 
      const balance = await tether.balanceOf(accounts[1]);
      assert.equal(balance.toString(), "100000000000", "Balance should be 0.00001 ETH"); 
    });
  });
});
