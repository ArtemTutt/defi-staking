// src/hooks/useWeb3.js
import { useEffect, useState } from "react";
import Web3 from "web3";
import Tether from '../truffle_abis/Tether.json';
import RWD from "../truffle_abis/RWD.json";
import DB from "../truffle_abis/DecentralBank.json";

const web3 = new Web3("HTTP://127.0.0.1:7545");

export const useWeb3 = () => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [network, setNetwork] = useState(null);
    const [connect, setConnect] = useState(false);
    const [usdtStakingBalance, setUsdtStakingBalance] = useState(null);
    const [contractData, setContractData] = useState({
        tether: { address: null, abi: [] },
        rwd: { address: null, abi: [] },
        decentralBank: { address: null, abi: []},
    });
    const [contractBalannce, setContractBalance] = useState({
        tether: { balance: null },
        rwd: { balance: null },
        decentralBank: { balance: null },
    });
    
    
    
    const fetchAccountData = async () => {
        if (window.ethereum) {
            try {
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[1]);
                    const balance = await web3.eth.getBalance(accounts[1]);
                    setBalance(web3.utils.fromWei(balance, "ether"));
                    console.log("Баланс:", web3.utils.fromWei(balance, "ether"), "ETH");
                    setConnect(true);
                } else {
                    console.log("Пожалуйста, подключите аккаунт в MetaMask.");
                }
                const networkId = await web3.eth.net.getId();
                setNetwork(networkId);
            } catch (error) {
                console.error("Ошибка при получении данных аккаунта:", error);
            }
        } else {
            console.log("Пожалуйста, установите MetaMask!");
        }
    };
    
    const loadContractData = async () => {
        if (network) {
            const tetherData = await Tether.networks[network];
            const rwdData = await RWD.networks[network];
            const decentralBankData = await DB.networks[network];
            if (tetherData && tetherData.address) {
                const tetherAddres = await tetherData.address;
                setContractData(prev => ({
                    ...prev,
                    tether: {address: tetherAddres, abi: Tether.abi}
                }))
            } else {
                console.error("Address not found for the specified network:", network);
            }
            
            if (rwdData && rwdData.address) {
                const rwdAddres = await rwdData.address;
                setContractData(prev => ({
                    ...prev,
                    rwd: {address: rwdAddres, abi: RWD.abi}
                }))
            } else {
                console.error("Address not found for the specified network:", network);
            }
            
            if (decentralBankData && decentralBankData.address) {
                const dbAddres = await decentralBankData.address;
                setContractData(prev => ({
                    ...prev,
                    decentralBank: {address: dbAddres, abi: DB.abi}
                }))
            } else {
                console.error("Address not found for the specified network:", network);
            }
        }
    };
    
    const loadMethodData = async () => {
        const tether = new web3.eth.Contract(contractData.tether.abi, contractData.tether.address);
        const db = new web3.eth.Contract(contractData.decentralBank.abi, contractData.decentralBank.address);
        if (tether.methods.balanceOf) {
            const tetherBalance = await tether.methods.balanceOf(account).call();
            setContractBalance(prev => ({
                ...prev,
                tether: {balance: tetherBalance }
            }))
        } else {
            console.error('Method balanceOf not found in the contract ABI');
        }
        if (db.methods.stakingBalance) {
            const stakingBalance = await db.methods.stakingBalance(account).call();
            const rwdToken = await db.methods.rewardBalance(account).call();
            setContractBalance(prev => ({
                ...prev,
                rwd: {balance: rwdToken }
            }))
            setUsdtStakingBalance(stakingBalance);
        } else {
            console.error('Method balanceOf not found in the contract ABI');
        }
    }
    
    // const deposit = async () => {
        //     const tether = new web3.eth.Contract(contractData.tether.abi, contractData.tether.address);
    //     const db = new web3.eth.Contract(contractData.decentralBank.abi, contractData.decentralBank.address);
    //     if (tether.methods.approve) {
    //         await tether.methods.approve(contractData.decentralBank.address, "1000000000000000000").send({ from: account });
    //     } else {
    //         console.error('Aprovve не был сделан');
    //     }
    //     if (db.methods.stakingTokens) {
    //         await db.methods.stakingTokens(1000000, {from: account}).call();
    //         const stakingBalance = await db.methods.stakingBalance(account).call(); 
    //         setUsdtStakingBalance(stakingBalance);
    //     } else {
    //         console.error('Стейкинг не произашел');
    //     }
    // }
    
    const deposit = async (amount, setError) => {
        try {
            const tether = new web3.eth.Contract(contractData.tether.abi, contractData.tether.address);
            const db = new web3.eth.Contract(contractData.decentralBank.abi, contractData.decentralBank.address);
            
            // 1. Вызов approve
            const approveResult = await tether.methods.approve(contractData.decentralBank.address, "1000000000000000000")
            .send({ from: account });
            
            console.log('Approve successful:', approveResult);
            
            // 2. Вызов stakingTokens
            
            let stakingResult;
            if (amount !== 0) {
                stakingResult = await db.methods.stakingTokens(amount)
                .send({ from: account, gas: 200000 });
            } else {
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 3000)
            }
            
            console.log('Staking successful:', stakingResult);
            if (stakingResult.status) {
                const rwdToken = await db.methods.rewardBalance(account).call();
                console.log('Rwd token:', rwdToken);
                setContractBalance(prev => ({
                    ...prev,
                    rwd: {balance: rwdToken }
                }))
            }
            
            // 3. Получение баланса стейкинга
            const stakingBalance = await db.methods.stakingBalance(account).call(); 
            setUsdtStakingBalance(stakingBalance);
        } catch (error) {
            console.error('Error during deposit:', error);
        }
    }
    
    
    const withdraw = async () => {
        const db = new web3.eth.Contract(contractData.decentralBank.abi, contractData.decentralBank.address);
        
        const withdrawResult = await db.methods.unStakingTokensAll().send({ from: account, gas: 200000 });
        console.log('Withdraw successful:', withdrawResult);
        
        const stakingBalance = await db.methods.stakingBalance(account).call(); 
        setUsdtStakingBalance(stakingBalance);
    }
    
    const withdrawBit = async (amount, setError) => {
        const db = new web3.eth.Contract(contractData.decentralBank.abi, contractData.decentralBank.address);
        
        if (amount !== 0) {
            const withdrawResult = await db.methods.unStakingTokens(amount).send({ from: account, gas: 200000 });
            console.log('Withdraw successful:', withdrawResult);
        } else {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 3000)
        }
        
        const stakingBalance = await db.methods.stakingBalance(account).call(); 
        setUsdtStakingBalance(stakingBalance);
    }
    
    const airDrop = async () => {
        const db = new web3.eth.Contract(contractData.decentralBank.abi, contractData.decentralBank.address);
        // issueTokens
        if (contractBalannce.rwd.balance !== 0) {
            const issueResult = await db.methods.issueTokens().send({ from: account, gas: 200000 });
        }

        const stakingBalance = await db.methods.stakingBalance(account).call(); 
        setUsdtStakingBalance(stakingBalance);
    }
    
    
    useEffect(() => {
        fetchAccountData();
        loadContractData();
        
        const handleNetworkChange = async (chainId) => {
            setNetwork(chainId);
            await fetchAccountData();
        };
        
        window.ethereum.on("chainChanged", handleNetworkChange);
        return () => {
            window.ethereum.removeListener("chainChanged", handleNetworkChange);
        };
    }, [account, network]);
    
    useEffect(() => {
        if (contractData.tether.abi && contractData.tether.address) {
            loadMethodData(); 
        }
    }, [contractData]); 
    
    useEffect(() => {
        if (contractData.tether.abi && contractData.tether.address) {
            loadMethodData(); 
        }
    }, [usdtStakingBalance, contractBalannce.rwd.balance]); 
    
    return {
        account,
        balance,
        network,
        connect,
        contractData,
        fetchAccountData,
        loadContractData,
        contractBalannce,
        usdtStakingBalance,
        deposit,
        withdraw,
        withdrawBit,
        airDrop
    };
};
