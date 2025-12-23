import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/schedules");
      setSchedules(res.data);
    } catch {
      setError("Failed to load schedules");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Delete schedule
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/schedules/${id}`);
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
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Navigation */}
      <div className="nav-buttons">
        <Link to="/admin-bookings" className="btn manage">Manage Bookings</Link>
        <Link to="/staff-management" className="btn staff">Staff Management</Link>
        <Link to="/admin-reports" className="btn reports">View Reports</Link>
        <Link to="/verify-students" className="btn verify">Verify Students</Link>
        <button onClick={handleLogout} className="btn logout">Logout</button>
      </div>

      {/* Add Schedule */}
      <div className="add-button">
        <Link to="/add-schedule" className="btn add">+ Add New Schedule</Link>
      </div>

      {/* Schedule Table */}
      <div className="table-wrapper">
        {error && <div className="error">{error}</div>}
        {schedules.length === 0 ? (
          <div className="empty">No schedules found</div>
        ) : (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Train</th>
                <th>From → To</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Price</th>
                <th>Actions</th>
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
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="btn delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
