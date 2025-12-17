import { useState, useEffect } from "react";
import axios from "axios";
import "./StaffManagement.css";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: "", position: "", shift: "", contact: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/staff");
      setStaff(res.data);
    } catch {
      setError("Failed to load staff");
    }
  };

  const addStaff = async () => {
    try {
      await axios.post("http://localhost:5000/api/staff", newStaff);
      setNewStaff({ name: "", position: "", shift: "", contact: "" }); // clear form
      fetchStaff();
    } catch {
      setError("Failed to add staff");
    }
  };

  const deleteStaff = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/staff/${id}`);
      fetchStaff();
    } catch {
      setError("Failed to delete staff");
    }
  };

  return (
    <div className="staff-container">
      <h2 className="staff-title">Manage Staff</h2>

      {/* Error message */}
      {error && <div className="error">{error}</div>}

      {/* Add Staff Form */}
      <div className="staff-form">
        <input
          placeholder="Name"
          value={newStaff.name}
          onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
        />
        <input
          placeholder="Position"
          value={newStaff.position}
          onChange={e => setNewStaff({ ...newStaff, position: e.target.value })}
        />
        <input
          placeholder="Shift"
          value={newStaff.shift}
          onChange={e => setNewStaff({ ...newStaff, shift: e.target.value })}
        />
        <input
          placeholder="Contact"
          value={newStaff.contact}
          onChange={e => setNewStaff({ ...newStaff, contact: e.target.value })}
        />
        <button onClick={addStaff}>Add Staff</button>
      </div>

      {/* Staff Table */}
      <table className="staff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Shift</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty">No staff found</td>
            </tr>
          ) : (
            staff.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.position}</td>
                <td>{s.shift}</td>
                <td>{s.contact}</td>
                <td>
                  <button className="btn-delete" onClick={() => deleteStaff(s._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
