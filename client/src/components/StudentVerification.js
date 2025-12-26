import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentVerification.css";

export default function StudentVerification() {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("none");
  const [expiryDate, setExpiryDate] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({ idCard: null, secondDoc: null });
  const [previewUrls, setPreviewUrls] = useState({ idCard: "", secondDoc: "" });
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      alert("Please log in first");
      navigate("/login");
      return;
    }

    // Check verification status
    axios
      .get(`http://localhost:5000/api/student-verification/status/${userId}`)
      .then((res) => {
        setVerificationStatus(res.data.studentVerificationStatus);
        setExpiryDate(res.data.expiryDate);
      })
      .catch((err) => console.error("Error fetching status:", err));
  }, [userId, navigate]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [type]: file }));
      setPreviewUrls(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFiles.idCard || !selectedFiles.secondDoc) {
      alert("Please select both student ID card and NID/Birth certificate");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("documents", selectedFiles.idCard);
    formData.append("documents", selectedFiles.secondDoc);
    formData.append("userId", userId);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/student-verification/submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);
      setVerificationStatus("pending");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit verification");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="student-verification-container">
      <div className="student-verification-card">
        <button onClick={() => navigate("/home")} className="back-button">
          ← Back to Home
        </button>

        <h2>Student Verification</h2>

        {verificationStatus === "none" && (
          <div className="verification-form">
            <p className="info-text">
              Upload your student ID card and NID/Birth certificate to get a 20 Taka discount on every ticket! Valid for 6 months.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="upload-section">
                <label htmlFor="idCard" className="upload-label">
                  <div className="upload-box">
                    {previewUrls.idCard ? (
                      <img src={previewUrls.idCard} alt="Preview" className="preview-image" />
                    ) : (
                      <div className="upload-placeholder">
                        <span className="upload-icon">📷</span>
                        <p>Student ID Card</p>
                      </div>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="idCard"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "idCard")}
                  className="file-input"
                />
              </div>

              <div className="upload-section">
                <label htmlFor="secondDoc" className="upload-label">
                  <div className="upload-box">
                    {previewUrls.secondDoc ? (
                      <img src={previewUrls.secondDoc} alt="Preview" className="preview-image" />
                    ) : (
                      <div className="upload-placeholder">
                        <span className="upload-icon">📄</span>
                        <p>NID / Birth Certificate</p>
                      </div>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="secondDoc"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "secondDoc")}
                  className="file-input"
                />
              </div>

              <button type="submit" disabled={loading} className="submit-button">
                {loading ? "Submitting..." : "Submit for Verification"}
              </button>
            </form>
          </div>
        )}

        {verificationStatus === "pending" && (
          <div className="status-message pending">
            <span className="status-icon">⏳</span>
            <h3>Verification Pending</h3>
            <p>Your student verification is under review. Please wait for admin approval.</p>
          </div>
        )}

        {verificationStatus === "verified" && (
          <div className="status-message verified">
            <span className="status-icon">✓</span>
            <h3>Verified Student</h3>
            <p>You are verified as a student! You will get 20 Taka discount on every ticket.</p>
            {expiryDate && (
              <p className="expiry-info">
                Valid until: <strong>{formatDate(expiryDate)}</strong>
              </p>
            )}
          </div>
        )}

        {verificationStatus === "rejected" && (
          <div className="status-message rejected">
            <span className="status-icon">✗</span>
            <h3>Verification Rejected</h3>
            <p>Your verification was rejected. Please contact support or try again with clearer images.</p>
            <button
              onClick={() => {
                setVerificationStatus("none");
                setPreviewUrls({ idCard: "", secondDoc: "" });
                setSelectedFiles({ idCard: null, secondDoc: null });
              }}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
