// eslint-disable-next-line no-undef
const DecentralBank = artifacts.require("DecentralBank");

// eslint-disable-next-line no-lone-blocks
{/*
    Команда truffle exec используется в рамках фреймворка Truffle 
    для выполнения JavaScript-скриптов в контексте Ethereum-смарт-контрактов.
     Она позволяет разработчикам запускать скрипты, которые могут взаимодействовать с контрактами, 
     выполнять транзакции или выполнять другие операции, связанные с блокчейном.
*/}

module.exports = async function issueRewards(callback) {
    const decentralBank = await DecentralBank.deployed();
    await decentralBank.issueTokens();
    console.log('Token have been issued successfully!')
    callback();
}