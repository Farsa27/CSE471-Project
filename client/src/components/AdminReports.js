import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminReports.css";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all"); // all, app, station
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("/api/reports/all");
      setReports(res.data.reports);
    } catch (err) {
      setError("Failed to load reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId) => {
    if (!window.confirm("Mark this report as resolved and remove it?")) return;

    try {
      await axios.delete(`/api/reports/${reportId}`);
      
      // Update local state to remove the report
      setReports(reports.filter(r => r._id !== reportId));
      
      alert("Report resolved and removed successfully!");
    } catch (err) {
      console.error("Error resolving report:", err);
      alert("Failed to resolve report. Please try again.");
    }
  };

  const filteredReports = reports.filter(r => {
    if (filter === "all") return true;
    return r.type === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-reports-container">
      <div className="reports-header">
        <h1>User Reports</h1>
        <button onClick={() => navigate("/admin-dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="filter-section">
        <button 
          className={filter === "all" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("all")}
        >
          All Reports ({reports.length})
        </button>
        <button 
          className={filter === "app" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("app")}
        >
          App Bugs ({reports.filter(r => r.type === "app").length})
        </button>
        <button 
          className={filter === "station" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("station")}
        >
          Station Hazards ({reports.filter(r => r.type === "station").length})
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading reports...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : filteredReports.length === 0 ? (
        <div className="empty-state">
          <h2>No Reports Found</h2>
          <p>There are no {filter !== "all" ? filter : ""} reports at this time.</p>
        </div>
      ) : (
        <div className="reports-grid">
          {filteredReports.map((report) => (
            <div key={report._id} className={`report-card ${report.type}`}>
              <div className="report-header">
                <div className="report-type-badge">
                  {report.type === "app" ? "🐛 App Bug" : "⚠️ Station Hazard"}
                </div>
                <div className="report-date">{formatDate(report.createdAt)}</div>
              </div>

              <div className="report-body">
                {report.type === "app" ? (
                  <>
                    {report.subject && (
                      <div className="report-field">
                        <label>Subject:</label>
                        <p>{report.subject}</p>
                      </div>
                    )}
                    <div className="report-field">
                      <label>Description:</label>
                      <p>{report.description}</p>
                    </div>
                    {report.rating && (
                      <div className="report-field">
                        <label>App Quality Rating:</label>
                        <p className="rating">{"⭐".repeat(report.rating)} ({report.rating}/5)</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="report-field">
                      <label>Station Location:</label>
                      <p>{report.stationLocation}</p>
                    </div>
                    <div className="report-field">
                      <label>Description:</label>
                      <p>{report.description}</p>
                    </div>
                  </>
                )}

                <div className="report-field">
                  <label>Reported By:</label>
                  <p>
                    {report.reporter?.name || "Unknown"} 
                    <span className="reporter-email"> ({report.reporter?.email || "N/A"})</span>
                  </p>
                </div>

                {report.media && report.media.length > 0 && (
                  <div className="report-field">
                    <label>Attachments:</label>
                    <div className="media-grid">
                      {report.media.map((url, index) => (
                        <a 
                          key={index} 
                          href={`${url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="media-link"
                        >
                          📎 File {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="report-footer">
                <button 
                  onClick={() => handleResolve(report._id)}
                  className="resolve-btn"
                >
                  ✓ Mark as Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

