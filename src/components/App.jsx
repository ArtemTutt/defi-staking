/* eslint-disable no-undef */
import React, { useEffect } from "react";
import s from "./App.module.css";
import Navbar from "./Navbar";
import Main from "./Main";
import { useWeb3 } from '../hooks/useWeb3';

export default function App() {    
    const {account, balance, network, connect, fetchAccountData, contractData, contractBalannce} = useWeb3();
    

    const onConnect = () => {
        fetchAccountData();
    };
    
    return (
        <>
        <Navbar accounts={account} balance={balance} connect={connect} network={network} onConnect={onConnect}/>
            {/* <p style={{marginTop: 50}}>Tether Balance: {contractData.tether.address} and {contractBalannce.tether.balance}</p>
            <p style={{marginTop: 50}}>RWD Balance: {contractData.rwd.address} and баланс токенов acc2 которые он застейкал {contractBalannce.rwd.balance}</p>
            <p style={{marginTop: 50}}>RWD Balance: {contractData.decentralBank.address} and {contractBalannce.decentralBank.balance}</p> */}
            <div className="container-fluid mt-5">
                <Main/>
            </div>
        </>
    );
}