import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";
import { FaRocket, FaUsers, FaStar } from "react-icons/fa";

// Our Images and Logoes
import heroImage from "../assets/hero.jpg";
import missionImage from "../assets/mission.jpg";
import bringImage from "../assets/bring.jpg";
import offerImage from "../assets/offer.jpg";
import logo from "../assets/logo.svg";
// This is the Local Host Address All Rest APIS LIKE POST and Get are run at in backend -backend server Running on this port
const API_BASE = "http://localhost:5000";
const Home = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signupData, setSignupData] = useState({fullname: "",email: "",password: "",confirmPassword: "",terms: false,});
  const [loginData, setLoginData] = useState({email: "",password: "",})
  useEffect(() => {
    if (showLogin || showSignup) {
      document.body.classList.add(styles.modalOpen);
    } else {document.body.classList.remove(styles.modalOpen);
           }}, 
          [showLogin, showSignup]);
  const resetSignupData = () => {setSignupError("");setSignupData({fullname: "",email: "",password: "",confirmPassword: "",terms: false,});};

  const handleSignup = async (e) =>
    {
    e.preventDefault();
    setSignupError("");
    if (signupData.password !== signupData.confirmPassword) {setSignupError("Passwords do not match.");
      return;
    }
    try 
    {  const res = await axios.post(`${API_BASE}/api/auth/signup`, 
       {name: signupData.fullname,email: signupData.email,password: signupData.password,});

      alert(res.data.message || "Signup successful. Please check your email.");
      setShowSignup(false);
      resetSignupData();
    } catch (error) {
      const msg =
        error.response?.data?.msg ||
        error.response?.statusText ||
        error.message ||
        "Signup failed.";
      setSignupError(msg);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {email: loginData.email,password: loginData.password,
      });

      alert(res.data.msg || "Login successful!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setShowLogin(false);
      navigate("/landing");
    } catch (err) {const msg = err.response?.data?.msg || "Login failed.";
      setLoginError(msg);
    }
  };

  return (
    <>
      <div className={styles.homePage}>
        <main>
          <div className={showLogin || showSignup ? styles.blurred : ""}>
            <header className={styles.navbar}>
              <div className={styles.container}>
                <div className={styles.logo}>
            <img src={logo} alt="Doc-Spot Logo" />
            <span>Doc-Spot</span>
          </div>
                <div className={styles.navLinks}>
                  <button className={styles.navBtn} onClick={() => setShowLogin(true)}>
                    Login
                  </button>
                  <button className={styles.navBtn} onClick={() => setShowSignup(true)}>
                    Signup
                  </button>
                </div>
              </div>
            </header>

            <section className={`${styles.hero} ${styles.container}`}>
              <div className={styles.heroText}>
                <h2>Welcome to Doc-Spot</h2>
                <p>
                  A premium academic document sharing platform connecting university students with reliable learning resources.
                </p>
              </div>
              <img src={heroImage} alt="Hero" className={styles.heroImage} />
            </section>

            <section className={`${styles.section} ${styles.container}`}>
              <div className={styles.sectionContent}>
                <div className={styles.sectionText}>
                  <h3><FaRocket /> Our Mission</h3>
                  <p>
                    To build a collaborative student community that promotes educational excellence by sharing knowledge in the form of curated documents.
                  </p>
                </div>
                <img src={missionImage} alt="Mission" className={styles.sectionImage} />
              </div>
            </section>

            <section className={`${styles.sectionAlt} ${styles.container}`}>
              <div className={styles.sectionContent}>
                <img src={bringImage} alt="What We Bring" className={styles.sectionImage} />
                <div className={styles.sectionText}>
                  <h3><FaUsers /> What We Bring</h3>
                  <p>
                    A trusted space for students to upload notes, access past papers, and monetize their content—while helping others succeed.
                  </p>
                </div>
              </div>
            </section>

            <section className={`${styles.section} ${styles.container}`}>
              <div className={styles.sectionContent}>
                <div className={styles.sectionText}>
                  <h3><FaStar /> What We Offer</h3>
                  <p>
                    Verified document uploads<br />
                    Wallet-based buy/sell system<br />
                    Powerful explore and filter functionality<br />
                    Secure user profiles with transaction history
                  </p>
                </div>
                <img src={offerImage} alt="What We Offer" className={styles.sectionImage} />
              </div>
            </section>

            <footer className={styles.footer}>
              <p>&copy; {new Date().getFullYear()} Doc-Spot. All rights reserved.</p>
            </footer>
          </div>
        </main>

        {showLogin && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <span className={styles.closeBtn} onClick={() => setShowLogin(false)}>×</span>
              <h2 className={styles.logo}>Login to Doc-Spot</h2>
              <form onSubmit={handleLogin}>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>
                {loginError && <div className={styles.errorMessage}>{loginError}</div>}
                <button type="submit" className={styles.submitBtn}>Login</button>
                <p className={styles.formFooter}>
                  Don't have an account?{" "}
                  <button type="button" className={styles.linkBtn}
                    onClick={() => {setShowLogin(false);
                      setShowSignup(true);
                    }}>
                    Sign up
                  </button>
                </p>
              </form>
            </div>
          </div>
        )}

        {showSignup && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <span className={styles.closeBtn} onClick={() => setShowSignup(false)}>×</span>
              <h2 className={styles.logo}>Sign Up for Doc-Spot</h2>
              <form onSubmit={handleSignup}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={signupData.fullname}
                    onChange={(e) => setSignupData({ ...signupData, fullname: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>University Email</label>
                  <input
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      required
                      checked={signupData.terms}
                      onChange={(e) => setSignupData({ ...signupData, terms: e.target.checked })}
                    /> I agree to the Terms and Conditions
                  </label>
                </div>
                {signupError && <div className={styles.errorMessage}>{signupError}</div>}
                <button type="submit" className={styles.submitBtn}>Create Account</button>
                <p className={styles.formFooter}>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={() => {
                      resetSignupData();
                      setShowSignup(false);
                      setShowLogin(true);
                    }}
                  >Sign in
                  </button>
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
