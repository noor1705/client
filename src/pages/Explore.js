// ExplorePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,NavLink } from "react-router-dom";
import styles from "../styles/Explore.module.css";
import {
  FaHome, FaSearch, FaBookOpen, FaInfoCircle,
  FaWallet, FaArrowUp, FaDownload, FaSortAmountDown, FaSortAmountUp,FaSignOutAlt
} from "react-icons/fa";
import logo from "../assets/logo.svg";

const API_BASE = "http://localhost:5000";

const ExplorePage = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [seeMore, setSeeMore] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState({ upvotes: "desc", date: "desc" });
  const [modalDoc, setModalDoc] = useState(null);
  const dummyDocs = [
    {
      _id: "1",
      title: "Computer Networks Final Notes",
      description: "These notes cover OSI model, TCP/IP, Routing protocols, DNS, HTTP, and more. Suitable for fast review before exams...",
      tags: ["networks", "final", "university"],
      publisher: "Ali Raza",
      publisherId: "1",
      upvotes: 12,
      accessType: "free",
      createdAt: new Date(),
    },
    {
      _id: "2",
      title: "Compiler Design Cheatsheet",
      description: "Brief guide on lexical analysis, syntax analysis, semantic analysis, code generation, and optimization...",
      tags: ["compiler", "cheatsheet", "semester 6"],
      publisher: "Sana Malik",
      publisherId: "2",
      
      upvotes: 8,
      accessType: "paid",
      price: 50,
      createdAt: new Date(),
    },
  ];
    const navigate = useNavigate();
  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) return navigate("/");
    if (token) {
      axios.get(`${API_BASE}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setUser(res.data))
        .catch(() => setUser({ name: "User123"}));
    } else {
      setUser({ name: "User123" });
    }

    axios.get(`${API_BASE}/api/document/all`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setDocs(res.data))
      .catch(() => setDocs(dummyDocs));
  }, [token]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowFilters(false);
      return;
    }
    axios.get(`${API_BASE}/api/explore/search?query=${searchTerm}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setSearchResults(res.data);
      setShowFilters(true);
    }).catch(() => {
      const filtered = docs.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()));
      setSearchResults(filtered);
      setShowFilters(true);
    });
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    axios.get(`${API_BASE}/api/explore/search?query=${tag}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setSearchResults(res.data);
      setShowFilters(true);
    }).catch(() => {
      const filtered = docs.filter(doc => doc.tags.includes(tag));
      setSearchResults(filtered);
      setShowFilters(true);
    });
  };

  const filterByUniversity = () => {if (!user?.university) return;
    const filtered = (searchResults.length ? searchResults : docs).filter(
      doc => doc.university === user.university
    );
    setSearchResults(filtered);
  };

  const sortByDate = () => {
    const order = sortOrder.date === "asc" ? "desc" : "asc";
    const sorted = [...(searchResults.length ? searchResults : docs)].sort((a, b) => {
      return order === "asc" ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
    });
    setSearchResults(sorted);
    setSortOrder(prev => ({ ...prev, date: order }));
  };

  const sortByUpvotes = () => {
    const order = sortOrder.upvotes === "asc" ? "desc" : "asc";
    const sorted = [...(searchResults.length ? searchResults : docs)].sort((a, b) => {
      return order === "asc" ? a.upvotes - b.upvotes : b.upvotes - a.upvotes;
    });
    setSearchResults(sorted);
    setSortOrder(prev => ({ ...prev, upvotes: order }));
  };

  const toggleSeeMore = (id) => {setSeeMore(prev => ({ ...prev, [id]: !prev[id] }));
  };
const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/"); // redirect to home
};
const handleDownload = (doc) => {
  if (doc.accessType === "free") {
    axios.post(`${API_BASE}/api/document/download/${doc._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const fileUrl = res.data.fileUrl;
      if (fileUrl) {
        window.open(fileUrl, "_blank");
      } else {
        alert("File URL missing.");
      }
    }).catch(() => alert("Download failed"));
  } else {
    setModalDoc(doc); 
  }
};


  const confirmPaidDownload = () => {
  if (!modalDoc || !modalDoc._id) {
    alert("Document not found.");
    return;
  }

  axios.post(`${API_BASE}/api/document/buy/${modalDoc._id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      alert("Purchase successful. Downloading...");
      
      const fileUrl = res.data.fileUrl;
      if (fileUrl) {
        window.open(fileUrl, "_blank");  
      } else {
        alert("File URL missing.");
      }

      setModalDoc(null);
    })
    .catch(() => alert("Purchase failed"));
};


  const handleUpvote = (docId) => {
    axios.post(`${API_BASE}/api/document/upvote/${docId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setDocs(prev => prev.map(doc => doc._id === docId ? { ...doc, upvotes: doc.upvotes + 1 } : doc));
      setSearchResults(prev => prev.map(doc => doc._id === docId ? { ...doc, upvotes: doc.upvotes + 1 } : doc));
    }).catch(() => alert("Upvote failed"));
  };

  const docsToShow = searchResults.length ? searchResults : docs;

  return (
    <div className={styles.explorePage}>
  {modalDoc && (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalBox}>
        <h3>Purchase Document</h3>
        <p>This document costs Rs. {modalDoc.price}. Do you want to proceed?</p>
        <button onClick={confirmPaidDownload}>Yes, Buy</button>
        <button onClick={() => setModalDoc(null)}>Cancel</button>
      </div>
    </div>
  )}

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

  <div className={styles.searchContainer}>
    <input
      type="text"
      value={searchTerm}
      placeholder="Search documents..."
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button onClick={handleSearch}>
      <FaSearch /> Search
    </button>
  </div>

  {/* Filters */}
  {showFilters && docsToShow.length > 0 && (
    <div className={styles.filterButtons}>
      <button onClick={filterByUniversity}>Filter by University</button>
      <button onClick={sortByDate}>
        Sort by Date {sortOrder.date === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
      </button>
      <button onClick={sortByUpvotes}>
        Sort by Upvotes {sortOrder.upvotes === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
      </button>
    </div>
  )}

  {/* Results */}
  <div className={styles.resultGrid}>
    {docsToShow.length === 0 ? (
      <p>No results found.</p>
    ) : (
      docsToShow.map((doc) => (
        <div key={doc._id} className={styles.resultCard}>
          <div className={styles.cardTop}>
  <div>
    <h3 className={styles.cardTitle}>{doc.title}</h3>
    <p className={styles.uploadedBy}>Uploaded by {doc.publisher}</p>
  </div>
  <div className={styles.actionIcons}>
    <button onClick={() => handleUpvote(doc._id)} title="Upvote">
      <FaArrowUp /> {doc.upvotes}
    </button>
  </div>
</div>

          <p className={styles.cardDescription}>
            {seeMore[doc._id] || doc.description.length <= 150
              ? doc.description
              : `${doc.description.slice(0, 150)}... `}
            {doc.description.length > 150 && (
              <button onClick={() => toggleSeeMore(doc._id)} className={styles.seeMoreBtn}>
                {seeMore[doc._id] ? "See less" : "See more"}
              </button>
            )}
          </p>
          <div className={styles.tagList}>
            {doc.tags.map((tag, idx) => (
              <button key={idx} onClick={() => handleTagClick(tag)} className={styles.tagButton}>
                #{tag}
              </button>
            ))}
          </div>
          <div className={styles.downloadArea}>
            <span className={doc.accessType === "free" ? styles.freeBadge : styles.paidBadge}>
              {doc.accessType === "free" ? "Free" : `Rs. ${doc.price}`}
            </span>
            <button onClick={() => handleDownload(doc)} className={styles.downloadBtn}>
              <FaDownload /> Download
            </button>
          </div>
        </div>
      ))
    )}
  </div>
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

export default ExplorePage;
