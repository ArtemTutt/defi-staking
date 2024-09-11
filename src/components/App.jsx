/* eslint-disable no-undef */
import React, { useEffect } from "react";
import s from "./App.module.css";
import Navbar from "./Navbar";
import Web3 from "web3";
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DB from '../truffle_abis/DecentralBank.json';

export default function App() {
    const [account, setAccount] = React.useState(null);
    const [balance, setBalance] = React.useState(null);
    const [connect, setConnect] = React.useState(false);
    const [network, setNetwork] = React.useState(null);
    const [contractAddress, setContractAddress] = React.useState(null);
    const [contractAbi, setContractAbi] = React.useState([]);
    const [balanceTet, setBalanceTet] = React.useState(null);
    // data for RWD and DecentralBank
    const [contractAbiRWD, setContractAbiRWD] = React.useState([]);
    const [contractAddressRWD, setContractAddressRWD] = React.useState(null);
    const [balanceRWD, setBalanceRWD] = React.useState(null);
    
    const [contractAbiDB, setContractAbiDB] = React.useState([]);
    const [contractAddressDB, setContractAddressDB] = React.useState(null);
    const [balanceDB, setBalanceDB] = React.useState(null);
    
    
    
    const web3 = new Web3('HTTP://127.0.0.1:7545');
    
    
    
    async function fetchAccountData() {
        if (window.ethereum) {
            try {
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[1]);
                    const balance = await web3.eth.getBalance(accounts[0]);
                    setBalance(web3.utils.fromWei(balance, "ether"));
                    console.log("Баланс:", web3.utils.fromWei(balance, "ether"), "ETH");
                    setConnect(true);
                } else {
                    console.log("Пожалуйста, подключите аккаунт в MetaMask.");
                }
                const networkId = await web3.eth.net.getId();
                setNetwork(networkId);
                console.log("ID сети:", networkId);
            } catch (error) {
                console.error("Ошибка при получении данных аккаунта:", error);
            }
        } else {
            console.log("Пожалуйста, установите MetaMask!");
        }
    }
    
    async function loadBlockchainData() {
        const tether = new web3.eth.Contract(contractAbi, contractAddress);
        if (tether.methods.balanceOf) {
            const tetherBalance = await tether.methods.balanceOf(account).call();
            setBalanceTet(web3.utils.fromWei(tetherBalance, "ether"));
        } else {
            console.error('Method balanceOf not found in the contract ABI');
        }
    }
    
    loadBlockchainData();
    console.log(balanceTet)
    
    const getTetherData = async () => {
        await fetchAccountData();
        let add;
        const networkData = await Tether.networks[network];
        if (networkData) {
            if (networkData && networkData.address) {
                add = await networkData.address;
                setContractAddress(add);
                setContractAbi(Tether.abi);
            } else {
                console.error('Address not found for the specified network:', network);
            }
        }
    }
    getTetherData();
    
    const getRWDandDecentralBank = async () => {
        await fetchAccountData();
        let addRWD;
        let addDB;
        if (account) {
            const networkDataRWD = await RWD.networks[network];
            const networkDataDB = await DB.networks[network];
            if (networkDataRWD && networkDataRWD.address) {
                addRWD = await networkDataRWD.address;
                setContractAddressRWD(addRWD);
                setContractAbiRWD(RWD.abi)
            }  else {
                console.error('Address not found for the specified network:', network);
            }
            if (networkDataDB && networkDataDB.address) {
                addDB = await networkDataDB.address;
                setContractAddressDB(addDB);
                setContractAbiDB(DB.abi)
            }  else {
                console.error('Address not found for the specified network:', network);
            }
        }
    }
    getRWDandDecentralBank()
    console.log(contractAddressRWD, contractAbiRWD)
    console.log(contractAddressDB, contractAbiDB)
    
    
    useEffect(() => {
        fetchAccountData();
        const handleNetworkChange = async (chainId) => {
            setNetwork(chainId);
            console.log("Сеть изменена на:", chainId);
            // Запрашиваем новый баланс после смены сети
            await fetchAccountData(); // создать отдельную функцию чтобы запрашивать баланс
        };
        
        // Подписываемся на события
        window.ethereum.on('chainChanged', handleNetworkChange);
        
        // Чистим подписки при размонтировании компонента
        return () => {
            window.ethereum.removeListener('chainChanged', handleNetworkChange);
        };
    }, []);
    
    const onConnect = () => {
        fetchAccountData();
    };
    
    return (
        <>
        <Navbar accounts={account} balance={balance} connect={connect} network={network} onConnect={onConnect}/>
        </>
    );
}