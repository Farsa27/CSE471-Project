import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyStudents.css";

export default function VerifyStudents() {
  const navigate = useNavigate();
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [verifiedStudents, setVerifiedStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const pendingRes = await axios.get("http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/student-verification/pending");
      setPendingVerifications(pendingRes.data.users);
      
      // Fetch verified students
      const allUsersRes = await axios.get("http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/users");
      const verified = allUsersRes.data.users.filter(u => u.isStudent && u.studentVerificationStatus === "verified");
      setVerifiedStudents(verified);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      alert("Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (userId, action) => {
    try {
      await axios.put(
        `http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/student-verification/verify/${userId}`,
        { action }
      );

      alert(`Student ${action === "verify" ? "verified" : "rejected"} successfully!`);
      fetchVerifications(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.message || "Failed to process verification");
    }
  };

  const handleUnverify = async (userId) => {
    if (!window.confirm("Are you sure you want to unverify this student?")) return;
    
    try {
      await axios.put(`http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/student-verification/unverify/${userId}`);
      alert("Student unverified successfully!");
      fetchVerifications();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to unverify student");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="verify-students-container">
      <div className="verify-students-card">
        <button onClick={() => navigate("/admin-dashboard")} className="back-button">
          ← Back to Dashboard
        </button>

        <h2>Student Verifications</h2>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending ({pendingVerifications.length})
          </button>
          <button
            className={`tab ${activeTab === "verified" ? "active" : ""}`}
            onClick={() => setActiveTab("verified")}
          >
            Verified ({verifiedStudents.length})
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : activeTab === "pending" ? (
          pendingVerifications.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✓</span>
              <p>No pending verifications</p>
            </div>
          ) : (
            <div className="verifications-grid">
              {pendingVerifications.map((user) => (
                <div key={user._id} className="verification-card">
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p className="email">{user.email}</p>
                    <p className="phone">{user.phone}</p>
                    <p className="dob">{user.dateOfBirth}</p>
                  </div>

                  <div className="documents-section">
                    <div className="id-card-section">
                      <h4>Student ID Card</h4>
                      <img
                        src={`http://localhost:5000|https://cse471-project-backend-51jt.onrender.com${user.studentIdCard}`}
                        alt="Student ID Card"
                        className="id-card-image"
                      />
                    </div>
                    <div className="id-card-section">
                      <h4>NID / Birth Certificate</h4>
                      <img
                        src={`http://localhost:5000|https://cse471-project-backend-51jt.onrender.com${user.studentSecondDocument}`}
                        alt="Second Document"
                        className="id-card-image"
                      />
                    </div>
                  </div>

                  <div className="action-buttons">
                    <button
                      onClick={() => handleVerification(user._id, "verify")}
                      className="verify-button"
                    >
                      ✓ Verify
                    </button>
                    <button
                      onClick={() => handleVerification(user._id, "reject")}
                      className="reject-button"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          verifiedStudents.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👥</span>
              <p>No verified students</p>
            </div>
          ) : (
            <div className="verifications-grid">
              {verifiedStudents.map((user) => (
                <div key={user._id} className="verification-card verified-card">
                  <div className="verified-badge">✓ Verified</div>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p className="email">{user.email}</p>
                    <p className="phone">{user.phone}</p>
                    <p className="expiry">Valid until: <strong>{formatDate(user.studentVerificationExpiry)}</strong></p>
                  </div>

                  <div className="action-buttons">
                    <button
                      onClick={() => handleUnverify(user._id)}
                      className="unverify-button"
                    >
                      Unverify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

