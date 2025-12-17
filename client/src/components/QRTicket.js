import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import "./QRTicket.css";

const QRTicket = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const qrRef = useRef(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      
      if (!userEmail) {
        setError("Please log in to view your tickets");
        setLoading(false);
        return;
      }

      const res = await axios.get(`http://localhost:5000/api/bookings/user/${userEmail}`);
      
      // Filter confirmed bookings
      const confirmedBookings = res.data.bookings.filter(
        booking => booking.status === 'confirmed'
      );
      
      setBookings(confirmedBookings);
    } catch (err) {
      setError("Failed to load bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateQRData = (booking) => {
    return JSON.stringify({
      bookingId: booking._id,
      trainName: booking.trainName,
      from: booking.from,
      to: booking.to,
      departure: booking.departureTime,
      arrival: booking.arrivalTime,
      passenger: booking.userName,
      email: booking.userEmail,
      price: booking.price,
      status: booking.status,
      paymentId: booking.paymentIntentId
    });
  };

  const handleGenerateQR = async (booking) => {
    try {
      // Delete the booking from the database
      await axios.delete(`http://localhost:5000/api/bookings/${booking._id}`);
      
      // Set selected booking to show QR
      setSelectedBooking(booking);
      
      // Remove from local state
      setBookings(bookings.filter(b => b._id !== booking._id));
      
    } catch (err) {
      alert("Failed to generate QR ticket. Please try again.");
      console.error(err);
    }
  };

  const downloadQR = () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `ticket-${selectedBooking.trainName}-${selectedBooking._id}.png`;
    link.href = url;
    link.click();
  };

  const closeQR = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="qr-tickets-container">
      <div className="qr-header">
        <h1>Get QR Ticket</h1>
        <button onClick={() => navigate("/home")} className="back-btn">
          ← Back to Home
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading your bookings...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : bookings.length === 0 && !selectedBooking ? (
        <div className="empty-state">
          <h2>No Bookings Available</h2>
          <p>You don't have any confirmed bookings to generate QR tickets.</p>
          <button onClick={() => navigate("/train-schedules")} className="book-now-btn">
            Book a Ticket
          </button>
        </div>
      ) : (
        <>
          {!selectedBooking ? (
            <>
              <div className="qr-instructions">
                📱 Select a booking below to generate your QR ticket. Once generated, the booking will be converted to a QR code for boarding.
              </div>
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-info">
                      <h3 className="booking-train-name">{booking.trainName}</h3>
                      <div className="booking-details">
                        <div className="detail-item">
                          <label>Route:</label>
                          <span>{booking.from} → {booking.to}</span>
                        </div>
                        <div className="detail-item">
                          <label>Passenger:</label>
                          <span>{booking.userName}</span>
                        </div>
                        <div className="detail-item">
                          <label>Departure:</label>
                          <span>{booking.departureTime}</span>
                        </div>
                        <div className="detail-item">
                          <label>Arrival:</label>
                          <span>{booking.arrivalTime}</span>
                        </div>
                        <div className="detail-item">
                          <label>Price:</label>
                          <span className="detail-price">৳{booking.price}</span>
                        </div>
                        <div className="detail-item">
                          <label>Status:</label>
                          <span style={{color: '#10b981', textTransform: 'uppercase'}}>{booking.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="booking-action">
                      <button onClick={() => handleGenerateQR(booking)} className="generate-btn">
                        Generate QR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="qr-modal">
              <div className="qr-success-header">
                <h2>✓ QR Ticket Generated</h2>
                <p>Your ticket is ready. Download or scan the QR code below.</p>
              </div>
              
              <div className="qr-train-info">
                <h3>{selectedBooking.trainName}</h3>
                <p>{selectedBooking.from} → {selectedBooking.to}</p>
              </div>

              <div ref={qrRef} className="qr-code-wrapper">
                <QRCodeCanvas
                  value={generateQRData(selectedBooking)}
                  size={300}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="qr-details">
                <div className="qr-detail-row">
                  <label>Passenger:</label>
                  <span>{selectedBooking.userName}</span>
                </div>
                <div className="qr-detail-row">
                  <label>Departure:</label>
                  <span>{selectedBooking.departureTime}</span>
                </div>
                <div className="qr-detail-row">
                  <label>Arrival:</label>
                  <span>{selectedBooking.arrivalTime}</span>
                </div>
                <div className="qr-detail-row">
                  <label>Price:</label>
                  <span className="qr-price">৳{selectedBooking.price}</span>
                </div>
              </div>

              <div className="qr-actions">
                <button onClick={downloadQR} className="download-btn">
                  Download QR Code
                </button>
                <button onClick={closeQR} className="close-btn">
                  Close
                </button>
              </div>

              <div className="qr-footer">
                <p>Booking ID: {selectedBooking._id}</p>
                {selectedBooking.paymentIntentId && (
                  <p>Payment: {selectedBooking.paymentIntentId.slice(0, 20)}...</p>
                )}
                <p className="warning">⚠ Note: This booking has been removed from your booking list</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QRTicket;
