import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const Verify = () => {
  const [status, setStatus] = useState("Verifying...");
  const [showResend, setShowResend] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email"); 

  useEffect(() => {
    const token = params.get("token");
    if (!token) return setStatus("Invalid verification link.");

    axios.get(`${API_BASE}/api/auth/verify?token=${token}`)
  .then(res => {setStatus(res.data.message || "Email verified!");setShowResend(false);setTimeout(() => {navigate("/Landing");}, 1000);
      })
      .catch(err => {
        setStatus(err.response?.data || "Verification failed or token expired.");
        setShowResend(true);
      });
  }, [params, navigate]);

  const handleResend = () => {
    if (!email) return alert("Missing user email.");
    axios.post(`${API_BASE}/api/auth/resend-verification`, { email })
      .then(res => setStatus(res.data.message))
      .catch(err => setStatus(err.response?.data || "Failed to resend email."));
  };

  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <h2>{status}</h2>
      {showResend && email && (
        <button onClick={handleResend} style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          Resend Verification Email
        </button>
      )}
    </div>
  );
};

export default Verify;
