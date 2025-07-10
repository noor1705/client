import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";      
import {
  FaHome,
  FaSearch,  FaBookOpen,
  FaInfoCircle,
  FaWallet,
FaSignOutAlt
} from "react-icons/fa";
import axios from "axios";
import styles from "../styles/About.module.css";

import logo from "../assets/logo.svg";
const API_BASE = "http://localhost:5000";

const AboutUs = () => {
  const navigate = useNavigate();
const token = localStorage.getItem("token");
    if (!token) return navigate("/");


  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/"); // redirect to home
};
  return (
    <div className={styles.aboutPage}>
      {/* Header + Navbar */}
      <header className={styles.siteHeader}>
    <div className={styles.headerContainer}>
      <div className={styles.siteLogo}>
        <img src={logo} alt="Doc-Spot Logo" />
        <span>Doc-Spot</span>
      </div>
      <nav>
        <ul>
<NavLink to="/landing" className={({ isActive }) => isActive ? styles.active : ""}>
  <FaHome /> Home
</NavLink>
<NavLink to="/explore" className={({ isActive }) => isActive ? styles.active : ""}>
  <FaSearch /> Explore
</NavLink>

<NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ""}>
  <FaBookOpen /> My Docs
</NavLink>
<NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ""}>
  <FaInfoCircle /> About Us
</NavLink>

        </ul>
      </nav>
<div className={styles.authButtons}>
  <NavLink to="/wallet" className={styles.btnSignup}><FaWallet /> My Wallet</NavLink>
  <button onClick={handleLogout} className={styles.logoutButton}>
    <FaSignOutAlt /> Logout
  </button>
</div>
    </div>
  </header>

      {/* Main About Content */}
      <main className={styles.aboutMain}>
        <section className={styles.aboutSection}>
          <h1 className={styles.aboutTitle}>
            Empowering Students Through Shared Knowledge
          </h1>
          <p className={styles.aboutSubtitle}>
            Your gateway to academic resources, built by students, for students.
          </p>
        </section>

        <section className={styles.aboutSection}>
          <h2>Our Mission</h2>
          <p>
            At <strong>Doc Spot</strong>, we aim to bridge the academic gap
            between students by creating a centralized platform where course
            materials, notes, and discussions come together in one place.
          </p>
        </section>

        <section className={styles.aboutSection}>
          <h2>Why We Exist</h2>
          <p>
            As students ourselves, we know the struggle of finding reliable
            study material across semesters and universities. Doc Spot was born
            from the idea that shared knowledge empowers growth — academically
            and collaboratively.
          </p>
        </section>

        <section className={styles.aboutSection}>
          <h2>Built by Students</h2>
          <p>
            We are a <strong>student-led startup</strong> driven by a passion
            to solve real academic problems using technology. Every feature is
            inspired by our own challenges and feedback from fellow students
            across the country.
          </p>
        </section>

        <section className={styles.aboutQuote}>
          <blockquote>"Alone we study faster, together we study smarter."</blockquote>
        </section>
      </main>

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

export default AboutUs;
