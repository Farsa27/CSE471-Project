import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { FaQrcode, FaArrowLeft, FaTrain, FaDownload, FaTimes, FaCheckCircle, FaClock, FaUser } from "react-icons/fa";
import { t } from "i18next";

const QRTicket = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ticketExpiry, setTicketExpiry] = useState(null);
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
    // Calculate expiry date (1 week from now)
    const generatedDate = new Date();
    const expiryDate = new Date(generatedDate);
    expiryDate.setDate(expiryDate.getDate() + 7);
    
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
      paymentId: booking.paymentIntentId,
      generatedAt: generatedDate.toISOString(),
      expiresAt: expiryDate.toISOString()
    });
  };

  const handleGenerateQR = async (booking) => {
    try {
      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      setTicketExpiry(expiryDate);
      
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
    setTicketExpiry(null);
    link.click();
  };

  const closeQR = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur bg-slate-900/60 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <FaArrowLeft />
            <span>{t("Back")}</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-300 grid place-items-center">
              <FaQrcode />
            </div>
            <h1 className="text-2xl font-bold">{t("Get QR Ticket")}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-300">"Loading your bookings..."</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 grid place-items-center">
              <FaQrcode className="text-red-400" size={40} />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-red-400">{error}</h2>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
            >
              Go to Login
            </button>
          </div>
        ) : bookings.length === 0 && !selectedBooking ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/20 grid place-items-center">
              <FaQrcode className="text-green-400" size={40} />
            </div>
            <h2 className="text-2xl font-semibold mb-2">{t("No Bookings Available")}</h2>
            <p className="text-slate-400 mb-6">{t("You don't have any confirmed bookings to generate QR tickets.")}</p>
            <button
              onClick={() => navigate("/train-schedules")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
            >
              <FaTrain />
              <span>{t("Book a Ticket")}</span>
            </button>
          </div>
        ) : (
          <>
            {!selectedBooking ? (
              <>
                <div className="mb-6 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <FaQrcode className="text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-100 mb-1">Generate Your QR Ticket</h3>
                      <p className="text-sm text-blue-200/80">
                        Select a booking below to generate your QR ticket. Once generated, the booking will be converted to a QR code for boarding.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/[0.07] transition">
                      <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 p-4 border-b border-white/10">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <FaTrain className="text-green-400" />
                          <span>{booking.trainName}</span>
                        </h3>
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Route:</span>
                          <span className="font-semibold">{booking.from} → {booking.to}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Passenger:</span>
                          <span className="font-semibold">{booking.userName}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Departure:</span>
                          <span className="font-semibold">{booking.departureTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Arrival:</span>
                          <span className="font-semibold">{booking.arrivalTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Price:</span>
                          <span className="text-xl font-bold text-green-300">৳{booking.price}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Status:</span>
                          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase">
                            {booking.status}
                          </span>
                        </div>
                        <button
                          onClick={() => handleGenerateQR(booking)}
                          className="w-full mt-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 font-medium transition flex items-center justify-center gap-2"
                        >
                          <FaQrcode />
                          <span>Generate QR</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  {/* Success Header */}
                  <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 p-6 text-center border-b border-white/10">
                    <FaCheckCircle className="text-emerald-400 mx-auto mb-3" size={48} />
                    <h2 className="text-2xl font-bold mb-2">QR Ticket Generated</h2>
                    <p className="text-slate-300">Your ticket is ready. Download or scan the QR code below.</p>
                  </div>

                  {/* Train Info */}
                  <div className="p-6 text-center border-b border-white/10">
                    <h3 className="text-xl font-bold mb-1">{selectedBooking.trainName}</h3>
                    <p className="text-slate-400">{selectedBooking.from} → {selectedBooking.to}</p>
                  </div>

                  {/* QR Code */}
                  <div ref={qrRef} className="p-8 bg-white flex items-center justify-center">
                    <QRCodeCanvas
                      value={generateQRData(selectedBooking)}
                      size={300}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <FaUser size={12} />
                        <span>Passenger:</span>
                      </div>
                      <span className="font-semibold">{selectedBooking.userName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <FaClock size={12} />
                        <span>Departure:</span>
                      </div>
                      <span className="font-semibold">{selectedBooking.departureTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <FaClock size={12} />
                        <span>Arrival:</span>
                      </div>
                      <span className="font-semibold">{selectedBooking.arrivalTime}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-slate-400">Price:</span>
                      <span className="text-2xl font-bold text-green-300">৳{selectedBooking.price}</span>
                    </div>
                    {ticketExpiry && (
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 text-slate-400">
                          <FaClock size={12} />
                          <span>Expires:</span>
                        </div>
                        <span className="font-semibold text-amber-400">
                          {ticketExpiry.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-6 border-t border-white/10 flex gap-3">
                    <button
                      onClick={downloadQR}
                      className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-700 font-medium transition flex items-center justify-center gap-2"
                    >
                      <FaDownload />
                      <span>Download QR Code</span>
                    </button>
                    <button
                      onClick={closeQR}
                      className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition flex items-center gap-2"
                    >
                      <FaTimes />
                      <span>Close</span>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-white/5 border-t border-white/10 text-xs text-slate-500 space-y-1">
                    <p className="font-mono">Booking ID: {selectedBooking._id}</p>
                    {selectedBooking.paymentIntentId && (
                      <p className="font-mono">Payment: {selectedBooking.paymentIntentId.slice(0, 20)}...</p>
                    )}
                    <p className="text-amber-400 flex items-center gap-2">
                      <span>⚠</span>
                      <span>Note: This booking has been removed from your booking list</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QRTicket;
