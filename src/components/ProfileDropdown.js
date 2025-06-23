// components/ProfileDropdown.js
import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/ProfileDropdown.module.css";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Go to home page
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div className={styles.profilePhoto} onClick={toggleDropdown} title="Profile">
        {user?.profilePic ? (
          <img src={user.profilePic} alt="User" className={styles.profileImgCircle} />
        ) : (
          user?.name?.charAt(0).toUpperCase() || "J"
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
