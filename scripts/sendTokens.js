// eslint-disable-next-line no-undef
const DecentralBank = artifacts.require("DecentralBank");
// eslint-disable-next-line no-undef
const Tether = artifacts.require("Tether");


module.exports = async function issueRewards(callback) {
    // eslint-disable-next-line no-undef
    const [acc1, acc2] = await web3.eth.getAccounts();
    const decentralBank = await DecentralBank.deployed();
    const tether = await Tether.deployed();

    const addressDB = await decentralBank.address; 
    const addressTether = await decentralBank.address; 


    await tether.approve(addressDB, "1000000000000000000", {from: acc2});
    await decentralBank.stakingTokens(1000000, {from: acc2})
    const balStak = await decentralBank.stakingBalance(acc2)


    console.log(balStak.toString())
    callback();
}