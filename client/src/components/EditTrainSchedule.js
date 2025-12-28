// frontend/src/pages/schedule/EditTrainSchedule.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./EditTrainSchedule.css";

export default function EditTrainSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trainName: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/schedules/${id}`);
        const data = res.data;

        setFormData({
          trainName: data.trainName || "",
          from: data.from || "",
          to: data.to || "",
          departureTime: data.departureTime ? data.departureTime.slice(0, 5) : "",
          arrivalTime: data.arrivalTime ? data.arrivalTime.slice(0, 5) : "",
          price: data.price || "",
        });

        setLoading(false);
      } catch (err) {
        alert("Failed to load schedule");
        navigate("/admin-dashboard");
      }
    };

    if (id) fetchSchedule();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/schedules/${id}`, {
        ...formData,
        price: Number(formData.price),
      });

      alert("Schedule updated successfully!");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update schedule");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="edit-container">
      {/* Back Button */}
      <Link to="/admin-dashboard" className="back-btn">
        Back to Schedules
      </Link>

      <div className="form-wrapper">
        <h1 className="form-title">Edit Train Schedule</h1>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            {/* Train Name */}
            <div>
              <label className="form-label">Train Name :</label>
              <input
                type="text"
                name="trainName"
                value={formData.trainName}
                onChange={handleChange}
                required
                placeholder="e.g. এমআরটি লাইন-১"
                className="form-input"
              />
            </div>

            {/* From Station */}
            <div>
              <label className="form-label">From Station :</label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                required
                placeholder="e.g. Purbachal"
                className="form-input"
              />
            </div>

            {/* To Station */}
            <div>
              <label className="form-label">To Station :</label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                required
                placeholder="e.g. Notun Bazar"
                className="form-input"
              />
            </div>

            {/* Departure Time */}
            <div>
              <label className="form-label">Departure Time :</label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
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
                value={formData.arrivalTime}
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
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g. 850"
                className="form-input"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn update">
              Update Schedule
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
