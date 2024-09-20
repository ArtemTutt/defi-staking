/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import bankPng from "../image.svg";
import s from "./Main.module.css";
import Web3 from "web3";
import { useWeb3 } from '../hooks/useWeb3';

export default function Main() {
  const [amount, setAmount] = useState(0);
  const {contractBalannce, usdtStakingBalance, deposit, withdraw, withdrawBit} = useWeb3();
  
  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };

  console.log(contractBalannce)
  
  // const handleDeposit = () => {
    //   console.log(`Deposit: ${amount} USDT`);
  // };
  
  // const handleWithdraw = () => {
    //   console.log(`Withdraw: ${amount} RWD`);
  // };
  
  const depostiToken = (asdf) => {
    deposit(asdf);
    setAmount(0);
    console.log("Я передаю значение в useWeb3", asdf)
  }
  
  
  
  const withdrawTokenAll = () => {
    withdraw();
    setAmount(0);
  }

  const withdrawTokenBit = (asdf) => {
    withdrawBit(asdf);
    setAmount(0);
  }
  
  return (
    <div className={s.container}>
    <div className={s.form_container}>
    <p>Ваш общий баланс USDT: {contractBalannce.tether.balance}</p>
    <div style={{ display: "flex", justifyContent: 'space-around' }}>
    <div>
    <h2>Staking Balance</h2>
    <p className={s.currency_label}>USDT: {usdtStakingBalance} </p>
    </div>
    <div>
    <h2>Reward Balance</h2>
    <p className={s.currency_label}>RWD: {contractBalannce.rwd.balance}</p>
    </div>
    </div>
    <input
    onChange={handleInputChange}
    value={amount}
    type="number"
    placeholder="Введите количество монет..."
    className={s.input_field}
    />
    <div> 
    <button style={{width: "100%", marginBottom: 10}} className={s.btn} onClick={() => depostiToken(amount)}>Deposit</button>
    </div>
    <div style={{display: "flex", justifyContent: "space-between"}}>
    <button style={{width: "48%", marginBottom: 10}} className={s.btn} onClick={() => withdrawTokenAll()}>Withdraw All</button>
    <button style={{width: "48%", marginBottom: 10}} className={s.btn} onClick={() => withdrawTokenBit(amount)}>Withdraw</button>
    </div>
    <span style={{color: "blue"}}>AIRDROP</span>
    </div>
    </div>
  );
}
