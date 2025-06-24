import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import styles from "../styles/Landing.module.css";
import logo from "../assets/logo.svg";
import {
  FaUpload,
  FaSearch,
  FaHome,
  FaBookOpen,
  FaInfoCircle,
  FaWallet,FaSignOutAlt,
} from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const dummyActivity = [
    { time: "2h ago", action: "Upvoted", link: "Remote Work Burnout" },
    { time: "1d ago", action: "Bought", link: "AI in Education" },
    { time: "1 week ago", action: "Published", link: "The Future of Digital Health" },
  ];

  const dummyContributions = [
    { title: "Introduction to React", date: "2025-06-10" },
    { title: "Advanced Algorithms Notes", date: "2025-06-05" },
    { title: "Database Optimization Tips", date: "2025-05-25" },
  ];

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_BASE}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error(err);
          setUser({
            name: "User123",
            walletBalance: "120 pts",
            topicsFollowed: "12",
            activity: dummyActivity,
            contributions: dummyContributions,
          });
        });
    } else {
      setUser({
        name: "User123",
        walletBalance: "120 pts",
        topicsFollowed: "12",
        activity: dummyActivity,
        contributions: dummyContributions,
      });
    }
  }, [token]);
const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/"); // redirect to home
};
  return (
    <div className={styles.landingPage}>
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
          </nav>
        <div className={styles.authButtons}>
          <NavLink to="/wallet" className={styles.btnSignup}><FaWallet /> My Wallet</NavLink>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
        </div>
      </header>

      <section className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <button className={styles.btnAction} onClick={() => navigate("/upload")}><FaUpload /> Upload New Document</button>
          <button className={styles.btnAction} onClick={() => navigate("/explore")}><FaSearch /> Explore Topics</button>
        </div>
      </section>
      <section className={styles.activityFeed}>
        <h2>Recent Activity</h2>
        <ul className={styles.feedList}>
          {(user?.activity || dummyActivity).map((item, index) => (
            <li key={index}>
              <span className={styles.timestamp}>{item.time}:</span>{" "}
              <a href="#">{item.action} "{item.link}"</a>
            </li>
          ))}
        </ul>
      </section>

      {/* Contributions Section */}
      <section className={styles.contributions}>
        <h2>My Stats</h2>
        <div className={styles.contributionsGrid}>
          {(user?.contributions || dummyContributions).map((contrib, index) => (
            <div key={index} className={styles.contributionCard}>
              <h3 className={styles.contributionTitle}>{contrib.title}</h3>
              <p className={styles.contributionDate}>
                {new Date(contrib.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      </section>

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

export default LandingPage;
