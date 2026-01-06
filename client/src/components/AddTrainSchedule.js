// frontend/src/pages/schedule/AddTrainSchedule.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./AddTrainSchedule.css";

export default function AddTrainSchedule() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    trainName: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.trainName || !form.from || !form.to || !form.price) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/schedules", {
        trainName: form.trainName,
        from: form.from,
        to: form.to,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        price: Number(form.price),
      });

      alert("Train schedule added successfully!");
      navigate("/admin-dashboard"); 
    } catch (err) {
      console.error(err);
      alert("Failed to add schedule");
    }
  };

  return (
    <div className="add-container">
      {/* Back Button */}
      <Link to="/admin-dashboard" className="back-btn">
        ← Back to Dashboard
      </Link>

      <div className="form-wrapper">
        <h1 className="form-title">Add New Train Schedule</h1>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            {/* Train Name */}
            <div>
              <label className="form-label">Train Name :</label>
              <input
                type="text"
                name="trainName"
                value={form.trainName}
                onChange={handleChange}
                placeholder="e.g. MRT Line 6"
                required
                className="form-input"
              />
            </div>

            {/* From Station */}
            <div>
              <label className="form-label">From Station :</label>
              <input
                type="text"
                name="from"
                value={form.from}
                onChange={handleChange}
                placeholder="e.g. Uttara North"
                required
                className="form-input"
              />
            </div>

            {/* To Station */}
            <div>
              <label className="form-label">To Station :</label>
              <input
                type="text"
                name="to"
                value={form.to}
                onChange={handleChange}
                placeholder="e.g. Motijheel"
                required
                className="form-input"
              />
            </div>

            {/* Departure Time */}
            <div>
              <label className="form-label">Departure Time :</label>
              <input
                type="time"
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Arrival Time */}
            <div>
              <label className="form-label">Arrival Time :</label>
              <input
                type="time"
                name="arrivalTime"
                value={form.arrivalTime}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Ticket Price */}
            <div>
              <label className="form-label">Ticket Price (৳) :</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 100"
                min="0"
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn save">
              Save Schedule
            </button>

            <Link to="/admin-dashboard" className="btn cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}