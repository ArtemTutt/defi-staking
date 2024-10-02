/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import bankPng from "../image.svg";
import s from "./Main.module.css";
import Web3 from "web3";
import MyError from "./MyError";
import { useWeb3 } from "../hooks/useWeb3";

export default function Main() {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(false);
  const {
    contractBalannce,
    usdtStakingBalance,
    deposit,
    withdraw,
    withdrawBit,
    airDrop
  } = useWeb3();
  
  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };
  
  // console.log(contractBalannce.rwd.balance);
  
  // const handleDeposit = () => {
    //   console.log(`Deposit: ${amount} USDT`);
  // };
  
  // const handleWithdraw = () => {
    //   console.log(`Withdraw: ${amount} RWD`);
  // };
  
  const depostiToken = (asdf, setError) => {
    deposit(asdf, setError);
    setAmount(0);
    console.log("Я передаю значение в useWeb3", asdf);
  };
  
  const withdrawTokenAll = () => {
    withdraw();
    setAmount(0);
  };
  
  const withdrawTokenBit = (asdf, setError) => {
    withdrawBit(asdf, setError);
    setAmount(0);
  };
  
  const giveMeMyDrop = () => {
    airDrop();
  }
  
  return (
    <div className={s.container}>
    <div className={s.form_container}>
    <p>Ваш общий баланс USDT: {contractBalannce.tether.balance}</p>
    <div style={{ display: "flex", justifyContent: "space-around" }}>
    <div>
    <h2>Staking Balance</h2>
    <p className={s.currency_label}>USDT: {usdtStakingBalance} </p>
    </div>
    <div>
    <h2>Reward Balance</h2>
    <p className={s.currency_label}>
    RWD: {contractBalannce.rwd.balance}
    </p>
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
    <button
    style={{ width: "100%", marginBottom: 10 }}
    className={s.btn}
    onClick={() => depostiToken(amount, setError)}
    >
    Deposit
    </button>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
    <button
    style={{ width: "48%", marginBottom: 10 }}
    className={s.btn}
    onClick={() => withdrawTokenAll()}
    >
    Withdraw All
    </button>
    <button
    style={{ width: "48%", marginBottom: 10 }}
    className={s.btn}
    onClick={() => withdrawTokenBit(amount, setError)}
    >
    Withdraw
    </button>
    </div>
    <button onClick={() => giveMeMyDrop()} style={{ color: "white", backgroundColor: "red" }}>AIRDROP</button>
    </div>
    {error && (
      <MyError>
      Ошибка отправки: Нельзя вывести или положить сумму меньше нуля
      </MyError>
    )}
    </div>
  );
}
