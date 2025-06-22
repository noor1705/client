// src/pages/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Home.css";


const API_BASE = "http://localhost:5000";
const Home = () => {
   const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [recentDocs, setRecentDocs] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  
const [loginData, setLoginData] = useState({
  email: "",
  password: ""
});
const [loginError, setLoginError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/document/recent`)
      .then((res) => setRecentDocs(res.data))
      .catch(() => {
        setRecentDocs([
          {
            id: 1,
            title: "DSA Midterm Paper",
            description: "Fall 2023, BSCS, Data Structures",
            premium: false,
          },
          {
            id: 2,
            title: "OOP Project Guidelines",
            description: "Spring 2024, BSCS, OOP Course",
            premium: true,
          },
          {
            id: 3,
            title: "AI Lecture Notes",
            description: "Fall 2022, BSCS, AI Course",
            premium: false,
          },
        ]);
      });
  }, []);

  const handleSearch = () => {
    setSearched(true);
    setResults(
      recentDocs.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query.toLowerCase()) ||
          doc.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const resetSignupData = () => {
    setSignupError("");
    setSignupData({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/signup`, {
        name: signupData.fullname,
        email: signupData.email,
        password: signupData.password,
      });

      alert(res.data.message || "Signup successful. Please check your email.");
      setShowSignup(false);
      resetSignupData();
    } catch (error) {
      console.error("Signup error:", error);
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
    const res = await axios.post(`${API_BASE}/api/auth/login`, {
      email: loginData.email,
      password: loginData.password
    });

    alert(res.data.msg || "Login successful!");
    
    // Store the token
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setShowLogin(false);
    // Optionally redirect or reload:
    // window.location.reload();
    // ✅ React Router redirect
    navigate("/landing");
  } catch (err) {
    const msg = err.response?.data?.msg || "Login failed.";
    setLoginError(msg);
  }
};

  useEffect(() => {
    if (showLogin || showSignup) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showLogin, showSignup]);

  return (
    <>
      <main className={showLogin || showSignup ? "blurred" : ""}>
        <header className="navbar sticky">
          <div className="container">
            <h1 className="logo">Doc-Spot</h1>
            <ul className="nav-links">
              <li>
                <button
                  className="nav-btn"
                  onClick={() => {
                    resetSignupData();
                    setShowLogin(true);
                  }}
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  className="nav-btn"
                  onClick={() => {
                    resetSignupData();
                    setShowSignup(true);
                  }}
                >
                  Signup
                </button>
              </li>
            </ul>
          </div>
        </header>

        <section className="hero">
          <h2>Find University Documents Instantly</h2>
          <p>Search course files, past papers, and notes uploaded by students.</p>

          <div className="search-container">
            <i className="search-icon">🔍</i>
            <input
              type="text"
              placeholder="Search by title, tag, university..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                id="search-clear"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setSearched(false);
                }}
              >
                ✕
              </button>
            )}
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </section>

        <section className="documents container">
          <h3>{searched ? "Search Results" : "Recent Documents"}</h3>
          <div className="doc-grid">
            {(searched ? results : recentDocs).map((doc) => (
              <div className={`doc-card ${doc.premium ? "premium" : ""}`} key={doc.id}>
  {doc.premium && <span className="premium-badge">Premium</span>}
  <h4>{doc.title}</h4>
  <p><strong>Description:</strong> {doc.description}</p>
  <p><strong>Course:</strong> {doc.course}</p>
  <div className="tags">
    {doc.tags && doc.tags.map((tag, index) => (
      <span key={index} className="tag">{tag}</span>
    ))}
  </div>
</div>

            ))}
          </div>
        </section>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Doc-Spot. All rights reserved.</p>
        </footer>
      </main>

      {showLogin && (
  <div className="modal">
    <div className="modal-content">
      <span className="close-btn" onClick={() => setShowLogin(false)}>
        ×
      </span>
      <h2 className="logo" style={{ marginBottom: "1rem" }}>
        Login to Doc-Spot
      </h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            required
            placeholder="Enter your password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
        </div>

        {loginError && <div className="error-message">{loginError}</div>}

        <button type="submit" className="submit-btn">Login</button>
        <div className="auth-options">
          {/* <button type="button" className="auth-btn google-btn">
            G Sign in with Google
          </button> */}
        </div>
        <p className="form-footer">
          Don't have an account?{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              resetSignupData();
              setShowLogin(false);
              setShowSignup(true);
            }}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  </div>
)}

      {showSignup && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowSignup(false)}>
              ×
            </span>
            <h2 className="logo" style={{ marginBottom: "1rem" }}>
              Sign Up for Doc-Spot
            </h2>
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  required
                  placeholder="Enter your full name"
                  value={signupData.fullname}
                  onChange={(e) => setSignupData({ ...signupData, fullname: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>University Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your university email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Create a password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Re-enter your password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>
                  I agree to the Terms and Conditions{" "}
                  <input
                    type="checkbox"
                    name="terms"
                    required
                    checked={signupData.terms}
                    onChange={(e) => setSignupData({ ...signupData, terms: e.target.checked })}
                  />
                </label>
              </div>
              {signupError && <div className="error-message">{signupError}</div>}
              <button type="submit" className="submit-btn create-account-btn">
                Create Account
              </button>
              <div className="auth-options">
                <button type="button" className="auth-btn google-btn">
                  G Sign in with Google
                </button>
              </div>
              <p className="form-footer">
                Already have an account?{" "}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    resetSignupData();
                    setShowSignup(false);
                    setShowLogin(true);
                  }}
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
</>
  );
};

export default Home;
 