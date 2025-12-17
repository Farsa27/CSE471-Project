import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

const QRTicket = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      
      // Filter unique bookings by paymentIntentId
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

  const generateQRCode = async (booking) => {
    const qrData = {
      bookingId: booking._id,
      trainName: booking.trainName,
      from: booking.from,
      to: booking.to,
      departure: booking.departureTime,
      arrival: booking.arrivalTime,
      passenger: booking.userName,
      email: booking.userEmail,
      price: booking.price,
      generatedAt: new Date().toISOString(),
    };

    setSelectedBooking(qrData);

    // Delete the booking from database
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${booking._id}`);
      
      // Update the bookings list
      setBookings(bookings.filter(b => b._id !== booking._id));
      
      // Show success message
      setTimeout(() => {
        alert("Ticket activated! This booking has been removed from your booked tickets list.");
      }, 500);
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("QR code generated but failed to remove booking. Please try again.");
    }
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `ticket-${selectedBooking.trainName}.png`;
    link.href = url;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Generate QR Ticket</h2>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Back to Home
          </button>
        </div>

        {!selectedBooking ? (
          <div>
            {error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded">
                {error}
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white p-8 rounded shadow text-center">
                <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
                <p className="text-gray-600 mb-4">You don't have any booked tickets yet.</p>
                <button
                  onClick={() => navigate("/train-schedules")}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Book a Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Select a booking to generate QR code:</h3>
                {bookings.map((booking, index) => (
                  <div key={booking._id} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            #{index + 1}
                          </span>
                          <h4 className="text-xl font-bold">{booking.trainName}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-sm text-gray-500">Route</p>
                            <p className="font-semibold">{booking.from} → {booking.to}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Departure</p>
                            <p className="font-semibold">{booking.departureTime}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Arrival</p>
                            <p className="font-semibold">{booking.arrivalTime}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="font-semibold text-green-600">৳{booking.price}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => generateQRCode(booking)}
                        className="ml-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        Generate QR Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded shadow max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6 text-green-600">✓ QR Ticket Generated</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <QRCodeCanvas
                value={JSON.stringify(selectedBooking)}
                size={300}
                className="mx-auto mb-4"
              />
              
              <div className="text-left max-w-md mx-auto space-y-2 mt-6">
                <p className="text-sm"><strong>Train:</strong> {selectedBooking.trainName}</p>
                <p className="text-sm"><strong>Route:</strong> {selectedBooking.from} → {selectedBooking.to}</p>
                <p className="text-sm"><strong>Departure:</strong> {selectedBooking.departure}</p>
                <p className="text-sm"><strong>Arrival:</strong> {selectedBooking.arrival}</p>
                <p className="text-sm"><strong>Passenger:</strong> {selectedBooking.passenger}</p>
                <p className="text-sm"><strong>Price:</strong> ৳{selectedBooking.price}</p>
                <p className="text-xs text-gray-500 mt-3">
                  Generated: {new Date(selectedBooking.generatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={downloadQRCode}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Download QR Code
              </button>
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  if (bookings.length === 0) {
                    navigate("/home");
                  }
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
              >
                {bookings.length === 0 ? "Go to Home" : "Generate Another"}
              </button>
            </div>

            <p className="text-sm text-orange-600 mt-6 font-semibold">
              Note: This booking has been removed from your booked tickets list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRTicket;
