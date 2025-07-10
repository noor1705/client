import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import styles from "../styles/Wallet.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import {
  FaHome, FaSearch,  FaBookOpen, FaInfoCircle,
  FaWallet, FaArrowDown, FaArrowUp, FaFileAlt, FaClock,
  FaMoneyBillWave, FaPlusCircle, FaSignOutAlt,FaMinusCircle, FaReceipt
} from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const Wallet = () => {
  const token = localStorage.getItem("token");
  const [balance, setBalance] = useState(0);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

const navigate = useNavigate();

  const handleAddFunds = () => {
    axios
      .post(
        `${API_BASE}/api/wallet/add`,
        { amount: Number(amountToAdd) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setBalance(res.data.balance);
        setTransactions(res.data.transactions);
        setAmountToAdd("");
      })
      .catch(() => alert("Failed to add funds"));
  };

  const handleWithdrawFunds = () => {
    axios
      .post(
        `${API_BASE}/api/wallet/withdraw`,
        { amount: Number(withdrawAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setBalance(res.data.balance);
        setTransactions(res.data.transactions);
        setWithdrawAmount("");
      })
      .catch(() => alert("Failed to withdraw funds"));
  };
const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/"); // redirect to home
};
  return (
    <div className={styles.walletPage}>
      {/* Header */}
      <header className={styles.siteHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.siteLogo}>
            <img src={logo} alt="Doc-Spot Logo" />
            <span>Doc-Spot</span>
          </div>
          <nav>
            <ul>
              <li><NavLink to="/landing" className={({ isActive }) => isActive ? styles.activeNavLink : undefined}><FaHome /> Home</NavLink></li>
              <li><NavLink to="/explore" className={({ isActive }) => isActive ? styles.activeNavLink : undefined}><FaSearch /> Explore</NavLink></li>
              <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.activeNavLink : undefined}><FaBookOpen /> My Docs</NavLink></li>
              <li><NavLink to="/about" className={({ isActive }) => isActive ? styles.activeNavLink : undefined}><FaInfoCircle /> About Us</NavLink></li>
            </ul>
          </nav><div className={styles.authButtons}>
            <NavLink to="/wallet" className={styles.btnSignup}><FaWallet /> My Wallet</NavLink>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Wallet Content */}
      <div className={styles.walletContent}>
        <h2><FaMoneyBillWave /> My Wallet</h2>
        <p>Current Balance: <strong>Rs. {balance}</strong></p>

        {/* Add Funds */}
        <div className={styles.fundForm}>
          <input
            type="number"
            placeholder="Enter amount"
            value={amountToAdd}
            onChange={(e) => setAmountToAdd(e.target.value)}
          />
          <button onClick={handleAddFunds}><FaPlusCircle /> Add Funds</button>
        </div>

        {/* Withdraw Funds */}
        <div className={styles.withdrawForm}>
          <input
            type="number"
            placeholder="Enter amount to withdraw"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button onClick={handleWithdrawFunds}><FaMinusCircle /> Withdraw</button>
        </div>

        {/* Transactions */}
        <div className={styles.transactionHistory}>
          <h3><FaReceipt /> Transaction History</h3>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <ul>
              {transactions.map((txn, idx) => (
                <li key={idx} className={txn.type === "credit" ? styles.credit : styles.debit}>
                  <span className={styles.txnType}>
                    {txn.type === "credit" ? <FaArrowDown color="green" /> : <FaArrowUp color="red" />}
                    Rs. {txn.amount}
                  </span>
                  <span className={styles.txnDetails}>
                    <FaFileAlt /> Doc ID: {txn.documentId}
                  </span>
                  <span className={styles.date}>
                    <FaClock /> {new Date(txn.date).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.siteFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <NavLink to="/about">About Us</NavLink>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Contact</a>
          </div>
          <p>© 2025 Doc-Spot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Wallet;
