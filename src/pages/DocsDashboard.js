import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/DocsDashboard.module.css";
import { NavLink } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logo.svg";

// React Icons
import { FaUpload, FaHome, FaSearch, FaFileAlt, FaInfoCircle, FaWallet, FaKey, FaAngleDown, FaAngleUp } from "react-icons/fa";

const DocsDashboard = () => {
  const [user, setUser] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [downloadedDocs, setDownloadedDocs] = useState([]);
  const [showAllUploaded, setShowAllUploaded] = useState(false);
  const [showAllDownloaded, setShowAllDownloaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    const fetchUserAndDocs = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const uploadedRes = await axios.get("http://localhost:5000/api/document/uploaded", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploadedDocs(uploadedRes.data);

        const downloadedRes = await axios.get("http://localhost:5000/api/document/downloaded", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDownloadedDocs(downloadedRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserAndDocs();
  }, [navigate]);

  const handleUpload = () => {
    navigate("/upload");
    
  };
  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/"); // redirect to home
};

  return (
    <div className={styles.dashboardWrapper}>
      {/* Header / Navbar */}
      <header className={styles.siteHeader}>
  <div className={styles.headerContainer}>
    <div className={styles.siteLogo}>
      <img src={logo} alt="Doc-Spot Logo" />
      <span>Doc-Spot</span>
    </div>
    <nav>
      <ul>
        <li>
          <NavLink to="/landing" className={({ isActive }) => isActive ? styles.active : ""}>
            <FaHome /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/explore" className={({ isActive }) => isActive ? styles.active : ""}>
            <FaSearch /> Explore
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ""}>
            <FaFileAlt /> My Docs
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ""}>
            <FaInfoCircle /> About Us
          </NavLink>
        </li>
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


      {/* Upload Button */}
      <button className={styles.uploadTopButton} onClick={handleUpload}>
        <FaUpload /> Upload New Document
      </button>

      <main>
        <h2>{user ? `${user.name}'s Dashboard` : "Dashboard"}</h2>

        {/* Uploaded Documents */}
        <section>
          <h3>Uploaded Documents</h3>
          <ul>
            {(showAllUploaded ? uploadedDocs : uploadedDocs.slice(0, 3)).map((doc) => (
              <li key={doc._id}>
                <strong>{doc.title}</strong> — {doc.courseName} — {doc.accessType.toUpperCase()}
                {doc.accessType === "paid" && doc.passkeys?.length > 0 && (
                  <ul>
                    {doc.passkeys.map((pk, i) => (
                      <li key={i}><FaKey /> {pk.key}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          {uploadedDocs.length > 3 && (
            <button onClick={() => setShowAllUploaded(!showAllUploaded)} className={styles.toggleBtn}>
              {showAllUploaded ? <>Show Less <FaAngleUp /></> : <>See More <FaAngleDown /></>}
            </button>
          )}
        </section>

        {/* Downloaded Documents */}
        <section>
          <h3>Downloaded Documents</h3>
          <ul>
            {(showAllDownloaded ? downloadedDocs : downloadedDocs.slice(0, 3)).map((doc) => (
              <li key={doc._id}>
                <strong>{doc.title}</strong> — {doc.courseName} — {doc.accessType.toUpperCase()}
                {doc.accessType === "paid" && doc.usedKey && (
                  <div><FaKey /> Used Key: {doc.usedKey}</div>
                )}
              </li>
            ))}
          </ul>
          {downloadedDocs.length > 3 && (
            <button onClick={() => setShowAllDownloaded(!showAllDownloaded)} className={styles.toggleBtn}>
              {showAllDownloaded ? <>Show Less <FaAngleUp /></> : <>See More <FaAngleDown /></>}
            </button>
          )}
        </section>

      </main>
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

export default DocsDashboard;
