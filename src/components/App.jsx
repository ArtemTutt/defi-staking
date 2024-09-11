/* eslint-disable no-undef */
import React, { useEffect } from "react";
import s from "./App.module.css";
import Navbar from "./Navbar";
import Web3 from "web3";
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DB from '../truffle_abis/DecentralBank.json';
import { useWeb3 } from '../hooks/useWeb3';

export default function App() {
    // const [contractAddress, setContractAddress] = React.useState(null);
    // const [contractAbi, setContractAbi] = React.useState([]);
    // const [balanceTet, setBalanceTet] = React.useState(null);
    // // data for RWD and DecentralBank
    // const [contractAbiRWD, setContractAbiRWD] = React.useState([]);
    // const [contractAddressRWD, setContractAddressRWD] = React.useState(null);
    // const [balanceRWD, setBalanceRWD] = React.useState(null);
    
    // const [contractAbiDB, setContractAbiDB] = React.useState([]);
    // const [contractAddressDB, setContractAddressDB] = React.useState(null);
    // const [balanceDB, setBalanceDB] = React.useState(null);
    
    const {account, balance, network, connect, fetchAccountData, contractData, loadContractData, contractBalannce} = useWeb3();
    
    // const web3 = new Web3('HTTP://127.0.0.1:7545');
    
    
    // async function loadBlockchainData() {
    //     const tether = new web3.eth.Contract(contractData.tether.abi, contractData.tether.address);
    //     console.log(tether);
    //     if (tether.methods.balanceOf) {
    //         const tetherBalance = await tether.methods.balanceOf(account).call();
    //     } else {
    //         console.error('Method balanceOf not found in the contract ABI');
    //     }
    // }
    
    // loadBlockchainData();
    // console.log(balanceTet)
    
    // const getTetherData = async () => {
        //     await fetchAccountData();
    //     let add;
    //     const networkData = await Tether.networks[network];
    //     if (networkData) {
    //         if (networkData && networkData.address) {
    //             add = await networkData.address;
    //             setContractAddress(add);
    //             setContractAbi(Tether.abi);
    //         } else {
    //             console.error('Address not found for the specified network:', network);
    //         }
    //     }
    // }
    // getTetherData();
    
    // const getRWDandDecentralBank = async () => {
        //     await fetchAccountData();
    //     let addRWD;
    //     let addDB;
    //     if (account) {
    //         const networkDataRWD = await RWD.networks[network];
    //         const networkDataDB = await DB.networks[network];
    //         if (networkDataRWD && networkDataRWD.address) {
    //             addRWD = await networkDataRWD.address;
    //             setContractAddressRWD(addRWD);
    //             setContractAbiRWD(RWD.abi)
    //         }  else {
    //             console.error('Address not found for the specified network:', network);
    //         }
    //         if (networkDataDB && networkDataDB.address) {
    //             addDB = await networkDataDB.address;
    //             setContractAddressDB(addDB);
    //             setContractAbiDB(DB.abi)
    //         }  else {
    //             console.error('Address not found for the specified network:', network);
    //         }
    //     }
    // }
    // getRWDandDecentralBank()
    
    
    // useEffect(() => {
        //     fetchAccountData();
    //     const handleNetworkChange = async (chainId) => {
        //         setNetwork(chainId);
    //         console.log("Сеть изменена на:", chainId);
    //         // Запрашиваем новый баланс после смены сети
    //         await fetchAccountData(); // создать отдельную функцию чтобы запрашивать баланс
    //     };
    
    //     // Подписываемся на события
    //     window.ethereum.on('chainChanged', handleNetworkChange);
    
    //     // Чистим подписки при размонтировании компонента
    //     return () => {
        //         window.ethereum.removeListener('chainChanged', handleNetworkChange);
    //     };
    // }, []);
    
    const onConnect = () => {
        fetchAccountData();
    };
    
    return (
        <>
        <Navbar accounts={account} balance={balance} connect={connect} network={network} onConnect={onConnect}/>
            <p style={{marginTop: 50}}>Tether Balance: {contractData.tether.address} and {contractBalannce.tether.balance}</p>
            <p style={{marginTop: 50}}>RWD Balance: {contractData.rwd.address} and баланс токенов acc2 которые он застейкал {contractBalannce.rwd.balance}</p>
            <p style={{marginTop: 50}}>RWD Balance: {contractData.decentralBank.address} and {contractBalannce.decentralBank.balance}</p>
        </>
    );
}