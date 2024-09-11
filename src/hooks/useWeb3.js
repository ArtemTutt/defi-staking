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
    const [contractData, setContractData] = useState({
        tether: { address: null, abi: [], balance: null },
        rwd: { address: null, abi: [], balance: null },
        decentralBank: { address: null, abi: [], balance: null },
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
                    const balance = await web3.eth.getBalance(accounts[0]);
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
            if (tetherData && tetherData.address) {
                const tetherAddres = await tetherData.address;
                setContractData(prev => ({
                    ...prev,
                    tether: {address: tetherAddres, abi: Tether.abi}
                }))
            } else {
                console.error("Address not found for the specified network:", network);
            }
        }
    };
    
    const loadMethodData = async () => {
        const tether = new web3.eth.Contract(contractData.tether.abi, contractData.tether.address);
        console.log(tether);
        if (tether.methods.balanceOf) {
            const tetherBalance = await tether.methods.balanceOf(account).call();
            setContractBalance(prev => ({
                ...prev,
                tether: {balance: tetherBalance }
            }))
        } else {
            console.error('Method balanceOf not found in the contract ABI');
        }
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
    
    return {
        account,
        balance,
        network,
        connect,
        contractData,
        fetchAccountData,
        loadContractData,
        contractBalannce,
    };
};
