// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Verify from "./pages/Verify";
import Landing from "./pages/Landing";
import UploadDocument from "./pages/UploadDocument";
import DocsDashboard from "./pages/DocsDashboard";
import About from "./pages/about";
import Explore from "./pages/Explore";
import Wallet from "./pages/Wallet";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/upload" element={<UploadDocument />} />
        <Route path="/dashboard" element={<DocsDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/wallet" element={<Wallet />} />        
      </Routes>
    </div>
  );
}

export default App;
