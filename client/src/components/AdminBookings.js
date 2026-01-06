// frontend/src/pages/admin/AdminBookings.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminBookings.css"; // import your CSS file

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/bookings");
      setBookings(res.data.bookings || []);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      // When admin approves or rejects, delete the booking
      await axios.delete(`/api/bookings/${id}`);
      alert(`Booking ${status} and removed from system`);
      fetchBookings();
    } catch {
      alert("Failed to update status");
    }
  };

  // Remove the deleteBooking function as it's no longer needed

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Portal for Booked Tickets</h1>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="empty">No bookings found</div>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Train</th>
              <th>From → To</th>
              <th>Passenger</th>
              <th>Departure / Arrival</th>
              <th>Fare</th>
              <th>Payment ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="font-mono text-xs">{b.ticketId}</td>
                <td className="train-name">{b.trainName}</td>
                <td>{b.from} → {b.to}</td>
                <td>
                  {b.passengerName || b.userName} <br />
                  <span className="passenger-phone">{b.userEmail}</span>
                </td>
                <td>
                  <div>{b.departureTime}</div>
                  <div>{b.arrivalTime}</div>
                </td>
                <td className="fare">৳{b.price}</td>
                <td className="font-mono text-xs">{b.paymentIntentId ? b.paymentIntentId.slice(0, 15) + '...' : 'N/A'}</td>
                <td>
                  <span
                    className={`status ${
                      b.status === "Approved"
                        ? "approved"
                        : b.status === "Rejected"
                        ? "rejected"
                        : b.status === "confirmed"
                        ? "approved"
                        : "pending"
                    }`}
                  >
                    {b.status || "Pending"}
                  </span>
                </td>
                <td className="actions">
                  <button
                    onClick={() => updateStatus(b._id, "Approved")}
                    className="btn approve"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(b._id, "Rejected")}
                    className="btn reject"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

