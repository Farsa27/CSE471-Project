import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";
import { t } from "i18next";

export default function AdminDashboard() {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackError, setFeedbackError] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const res = await axios.get("http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/schedules");
      setSchedules(res.data);
    } catch {
      setError("Failed to load schedules");
    }
  };

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/feedback");
      setFeedbacks(res.data?.feedbacks || []);
    } catch {
      setFeedbackError("Failed to load feedback");
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchFeedbacks();
  }, []);

  // Delete schedule
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;
    try {
      await axios.delete(`http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/schedules/${id}`);
      fetchSchedules();
    } catch {
      setError("Failed to delete schedule");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">{t("Admin Dashboard")}</h1>

      {/* Navigation */}
      <div className="nav-buttons">
        <Link to="/admin-bookings" className="btn manage">{t("Manage Bookings")}</Link>
        <Link to="/staff-management" className="btn staff">{t("Staff Management")}</Link>
        <Link to="/admin-reports" className="btn reports">{t("View Reports")}</Link>
        <Link to="/verify-students" className="btn verify">{t("Verify Students")}</Link>
        <Link to="/upload-ad" className="btn upload-ad">{t("Upload Ad")}</Link>
        <button onClick={handleLogout} className="btn logout">{t("logout")}</button>
      </div>

      {/* Add Schedule */}
      <div className="add-button">
        <Link to="/add-schedule" className="btn add">+ {t("Add New Schedule")}</Link>
      </div>

      {/* Schedule Table */}
      <div className="table-wrapper">
        {error && <div className="error">{t("Failed to load schedules")}</div>}
        {schedules.length === 0 ? (
          <div className="empty">{t("No schedules found")}</div>
        ) : (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>{t("Train")}</th>
                <th>{t("From → To")}</th>
                <th>{t("Departure")}</th>
                <th>{t("Arrival")}</th>
                <th>{t("Price")}</th>
                <th>{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="train-name">{s.trainName}</div>
                    <div className="train-id">ID: {s._id.slice(-8).toUpperCase()}</div>
                  </td>
                  <td>{s.from} → {s.to}</td>
                  <td>{s.departureTime}</td>
                  <td>{s.arrivalTime}</td>
                  <td className="price">৳{s.price}</td>
                  <td className="actions">
                    <button
                      onClick={() => navigate(`/edit-schedule/${s._id}`)}
                      className="btn edit"
                    >
                      {t("Edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="btn delete"
                    >
                      {t("Delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

  

      {/* Feedback & Ratings (collapsible) */}
      {showFeedback && (
        <div id="admin-feedback-panel" className="feedback-wrapper">
          <h2 className="section-title">{t("Recent Feedback & Ratings")}</h2>
          {feedbackError && <div className="error">{feedbackError}</div>}
          {feedbacks.length === 0 ? (
            <div className="empty">{t("No feedback submitted yet")}</div>
          ) : (
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>{t("Rating")}</th>
                  <th>{t("Comment")}</th>
                  <th>{t("Submitted")}</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((f) => (
                  <tr key={f._id}>
                    <td className="rating-stars" aria-label={`Rating ${f.rating} out of 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < f.rating ? "on" : "off"}>★</span>
                      ))}
                    </td>
                    <td>{f.comment || "—"}</td>
                    <td>{new Date(f.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
        {/* Feedback toggle (bottom) */}
        <div className="feedback-toggle">
          <button
            className="btn feedback-toggle"
            onClick={() => setShowFeedback((v) => !v)}
            aria-expanded={showFeedback}
            aria-controls="admin-feedback-panel"
          >
            {showFeedback ? "Hide Feedback" : "View Feedback"}
            {feedbacks.length > 0 ? ` (${feedbacks.length})` : ""}
          </button>
        </div>

    </div>
  );
}

