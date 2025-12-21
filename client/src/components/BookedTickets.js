import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookedTickets.css";

export default function BookedTickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      
      if (!userEmail) {
        setError("Please log in to view your bookings");
        setLoading(false);
        return;
      }

      const res = await axios.get(`http://localhost:5000/api/bookings/user/${userEmail}`);
      
      // Filter unique bookings by paymentIntentId (to avoid duplicates)
      const uniqueBookings = res.data.bookings.filter((booking, index, self) =>
        index === self.findIndex((b) => b.paymentIntentId === booking.paymentIntentId && booking.paymentIntentId)
      );
      
      setBookings(uniqueBookings);
    } catch (err) {
      setError("Failed to load bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="booked-tickets-container">
      <div className="booked-header">
        <button onClick={() => navigate("/home")} className="back-btn">
          ← Back to Home
        </button>
        <h1>My Booked Tickets</h1>
      </div>

      {loading ? (
        <div className="loading-state">Loading your tickets...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <h2>No Tickets Found</h2>
          <p>You haven't booked any tickets yet.</p>
          <button onClick={() => navigate("/train-schedules")} className="book-now-btn">
            Book a Ticket
          </button>
        </div>
      ) : (
        <div className="tickets-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="ticket-card">
              <div className="ticket-header">
                <h3>{booking.trainName}</h3>
                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>

              <div className="ticket-body">
                <div className="route-info">
                  <div className="station">
                    <label>From</label>
                    <p>{booking.from}</p>
                  </div>
                  <div className="arrow">→</div>
                  <div className="station">
                    <label>To</label>
                    <p>{booking.to}</p>
                  </div>
                </div>

                <div className="time-info">
                  <div className="time-item">
                    <label>Departure</label>
                    <p>{booking.departureTime}</p>
                  </div>
                  <div className="time-item">
                    <label>Arrival</label>
                    <p>{booking.arrivalTime}</p>
                  </div>
                </div>

                <div className="passenger-info">
                  <div className="info-row">
                    <label>Passenger:</label>
                    <span>{booking.userName}</span>
                  </div>
                  <div className="info-row">
                    <label>Email:</label>
                    <span>{booking.userEmail}</span>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="info-row">
                    <label>Booking Date:</label>
                    <span>{formatDate(booking.bookingTime)}</span>
                  </div>
                  <div className="info-row price-row">
                    <label>Price:</label>
                    <span className="price">৳{booking.price}</span>
                  </div>
                </div>

                {booking.paymentIntentId && (
                  <div className="payment-id">
                    <small>Payment ID: {booking.paymentIntentId.slice(0, 20)}...</small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
