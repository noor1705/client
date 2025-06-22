import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/UploadDocument.module.css";
import { FaUpload, FaTimes, FaFileAlt } from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const UploadDocument = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    semester: "Fall",
    academicYear: new Date().getFullYear(),
    courseName: "",
    instructorName: "",
    accessType: "free",
    price: "",
    tags: "",
    file: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.courseName || !formData.file) {
      return setMessage("⚠️ Title, Course Name, and File are required.");
    }

    if (formData.accessType === "paid" && (!formData.price || formData.price < 0)) {
      return setMessage("⚠️ Please provide a valid price for paid documents.");
    }

    const payload = new FormData();
    for (let key in formData) {
      if (key === "tags") {
        const cleaned = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
        payload.append("tags", JSON.stringify(cleaned));
      } else {
        payload.append(key, formData[key]);
      }
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE}/api/document/upload`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.msg);
      setTimeout(() => navigate("/dashboard"), 100);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed.");
    }
  };

  const handleCancel = () => {
    navigate("/Landing");
  };

  return (
    <div className={styles.uploadContainer}>
      <h2><FaFileAlt /> Upload Document</h2>

      <form onSubmit={handleSubmit} className={styles.form}>

        <input
          type="text"
          name="title"
          placeholder="Title *"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <input
          type="text"
          name="courseName"
          placeholder="Course Name *"
          value={formData.courseName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="instructorName"
          placeholder="Instructor Name"
          value={formData.instructorName}
          onChange={handleChange}
        />

        <select name="semester" value={formData.semester} onChange={handleChange}>
          <option value="Fall">Fall</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
        </select>

        <select
          name="academicYear"
          value={formData.academicYear}
          onChange={handleChange}
        >
          {Array.from({ length: 51 }, (_, i) => 2000 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select name="accessType" value={formData.accessType} onChange={handleChange}>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        {formData.accessType === "paid" && (
          <input
            type="number"
            name="price"
            placeholder="Enter price (e.g. 100)"
            value={formData.price}
            onChange={handleChange}
            min={0}
            required
          />
        )}

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
        />

        <input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
        />

        <div className={styles.buttons}>
          <button type="submit" className={styles.uploadBtn}>
            <FaUpload /> Upload
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelBtn}
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default UploadDocument;
