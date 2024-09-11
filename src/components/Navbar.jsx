/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import bankPng from "../image.svg";
import s from "./Navbar.module.css";
import Web3 from "web3";

export default function Navbar({ accounts, balance, connect, onConnect, network }) {
  return (
    <>
      <header>
        <nav
          className="navbar navbar-dark fixed-top shadow p-0"
          style={{ backgroundColor: "#003366", height: "50px" }}
        >
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex align-items-center">
              <img
                src={bankPng}
                alt="bank"
                width="50"
                height="40"
                className="d-inline-block lign-top"
              />
              <a
                href=""
                style={{ color: "white" }}
                className="navbar-brand col-sm-3 col-md-2 mr-0"
              >
                DAPP Staking{" "}
              </a>
            </div>

            {connect ? (
              <ul className="navbar-nav px-4 d-flex align-items-center">
                <li className="text-nowrap nav-item d-none d-sm-block mt-2">
                  <span style={{ color: "white" }}>Account: {accounts} </span>
                  <span style={{ color: "white" }}>Balance: {balance} ETH</span>
                </li>
              </ul>
            ) : (
              <button onClick={() => onConnect()} className="mr-2">
                Connect Wallet
              </button>
            )}

            {/* <ul className="navbar-nav px-4 d-flex align-items-center">
                    <li className="text-nowrap nav-item d-none d-sm-block mt-2">
                        <span style={{color:"white"}}>Account: {accounts}  </span>
                        <span style={{color:"white"}}>Balance: {balance} ETH</span>
                    </li>
                </ul>
                <button className="mr-2">Connect Wallet</button> */}
          </div>
        </nav>
      </header>
    </>
  );
}
