import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTicketAlt, FaArrowLeft, FaTrain, FaClock, FaUser, FaEnvelope, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import { t } from "i18next";

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

      const res = await axios.get(`/api/bookings/user/${userEmail}`);
      
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur bg-slate-900/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <FaArrowLeft />
            <span>{t("Back")}</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-300 grid place-items-center">
              <FaTicketAlt />
            </div>
            <h1 className="text-2xl font-bold">{t("My Booked Tickets")}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-300">{t("Loading your tickets...")}</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 grid place-items-center">
              <FaTicketAlt className="text-red-400" size={40} />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-red-400">{error}</h2>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
            >
              Go to Login
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 grid place-items-center">
              <FaTicketAlt className="text-amber-400" size={40} />
            </div>
            <h2 className="text-2xl font-semibold mb-2">{t("No Tickets Found")}</h2>
            <p className="text-slate-400 mb-6">{t("You haven't booked any tickets yet. Start your journey!")}</p>
            <button
              onClick={() => navigate("/train-schedules")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition"
            >
              <FaTrain />
              <span>{t("Book a Ticket")}</span>
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-slate-400">Total bookings: <span className="text-slate-100 font-semibold">{bookings.length}</span></p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/[0.07] transition">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 p-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <FaTrain className="text-amber-400" />
                        <span>{booking.trainName}</span>
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status.toLowerCase() === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                      }`}>
                        <FaCheckCircle className="inline mr-1" size={10} />
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4">
                    {/* Route */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-xs text-slate-400 mb-1">From</div>
                        <div className="font-semibold">{booking.from}</div>
                      </div>
                      <div className="text-amber-400 text-2xl">→</div>
                      <div className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-xs text-slate-400 mb-1">To</div>
                        <div className="font-semibold">{booking.to}</div>
                      </div>
                    </div>

                    {/* Time Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                          <FaClock size={10} />
                          <span>Departure</span>
                        </div>
                        <div className="font-semibold">{booking.departureTime}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                          <FaClock size={10} />
                          <span>Arrival</span>
                        </div>
                        <div className="font-semibold">{booking.arrivalTime}</div>
                      </div>
                    </div>

                    {/* Passenger Info */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2 text-sm">
                        <FaUser className="text-slate-400" size={12} />
                        <span className="text-slate-400">Passenger:</span>
                        <span className="font-medium">{booking.userName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaEnvelope className="text-slate-400" size={12} />
                        <span className="text-slate-400">Email:</span>
                        <span className="font-medium text-xs">{booking.userEmail}</span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Ticket ID:</span>
                        <span className="font-mono font-semibold text-green-300">{booking.ticketId}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Booking Date:</span>
                        <span className="font-medium">{formatDate(booking.bookingTime)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Expires:</span>
                        <span className="font-medium text-amber-300">{formatDate(booking.expiryDate)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Price:</span>
                        <span className="text-2xl font-bold text-amber-300">৳{booking.price}</span>
                      </div>
                    </div>

                    {/* Payment ID */}
                    {booking.paymentIntentId && (
                      <div className="pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <FaCreditCard size={10} />
                          <span className="font-mono">Payment: {booking.paymentIntentId.slice(0, 20)}...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

