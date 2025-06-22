import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaComments,
  FaBookOpen,
  FaInfoCircle,
  FaWallet,
  FaUser,
} from "react-icons/fa";

import styles from "../styles/About.module.css";

const AboutUs = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Header + Navbar */}
      <header className={styles.siteHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.siteLogo}>
            <img src="/logo.png" alt="Doc-Spot Logo" />
            <span>Doc-Spot</span>
          </div>
          <nav>
            <ul>
              <li>
                <NavLink
                  to="/landing"
                  className={({ isActive }) =>
                    isActive ? styles.activeNavLink : undefined
                  }
                >
                  <FaHome /> Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/explore"
                  className={({ isActive }) =>
                    isActive ? styles.activeNavLink : undefined
                  }
                >
                  <FaSearch /> Explore
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/discussion"
                  className={({ isActive }) =>
                    isActive ? styles.activeNavLink : undefined
                  }
                >
                  <FaComments /> Discussions
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? styles.activeNavLink : undefined
                  }
                >
                  <FaBookOpen /> My Docs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? styles.activeNavLink : undefined
                  }
                >
                  <FaInfoCircle /> About Us
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Auth Buttons with My Wallet and Profile */}
          <div className={styles.authButtons}>
            <NavLink to="/wallet" className={styles.btnSignup}>
              <FaWallet /> My Wallet
            </NavLink>
            <NavLink
              to="/profile"
              className={styles.btnSignup}
              style={{ marginLeft: "10px" }}
            >
              <FaUser /> Profile
            </NavLink>
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