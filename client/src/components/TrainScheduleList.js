// src/pages/schedule/TrainScheduleList.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaStar } from "react-icons/fa";
import "./TrainScheduleList.css";

export default function TrainScheduleList() {
  const [schedules, setSchedules] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";



  useEffect(() => {
    fetchSchedules();
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:5000/api/users/${userId}`)
        .then((res) => {
          const favs = res.data?.user?.favoriteStations || [];
          setFavorites(favs);
        })
        .catch(() => {
          // silently ignore favorites fetch errors
        });
    }
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/schedules");
      setSchedules(res.data);
    } catch {
      setError("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (train) => {
    // Get user info from localStorage
    const userName = localStorage.getItem("userName") || "Guest User";
    const userEmail = localStorage.getItem("userEmail") || "";

    if (!userEmail) {
      alert("Please log in to book a ticket");
      navigate("/login");
      return;
    }

    try {
      // Check if user already has a booking for this route
      const res = await axios.get(`http://localhost:5000/api/bookings/user/${userEmail}`);
      const existingBookings = res.data.bookings;
      
      const duplicateRoute = existingBookings.find(
        booking => booking.from === train.from && booking.to === train.to
      );

      if (duplicateRoute) {
        alert(`You have already booked a ticket from ${train.from} to ${train.to}. You can only book one ticket per route.`);
        return;
      }

      // Prepare booking data
      const bookingData = {
        trainId: train._id,
        trainName: train.trainName,
        from: train.from,
        to: train.to,
        departure: train.departureTime,
        arrival: train.arrivalTime,
        price: train.price,
        passengerName: userName,
        passengerEmail: userEmail
      };

      // Navigate to payment page with booking data
      navigate("/payment-checkout", { state: { bookingData } });
    } catch (error) {
      console.error("Error checking existing bookings:", error);
      alert("Error checking existing bookings. Please try again.");
    }
  };

  const filtered = schedules.filter(s =>
    s.trainName?.toLowerCase().includes(search.toLowerCase()) ||
    s.from?.toLowerCase().includes(search.toLowerCase()) ||
    s.to?.toLowerCase().includes(search.toLowerCase())
  );

  const prioritized = [...filtered].sort((a, b) => {
    const aFav = favorites.includes(a.from) || favorites.includes(a.to);
    const bFav = favorites.includes(b.from) || favorites.includes(b.to);
    return (bFav ? 1 : 0) - (aFav ? 1 : 0);
  });

  const toggleFavorite = async (station) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to manage favorites");
      navigate("/login");
      return;
    }

    try {
      if (favorites.includes(station)) {
        await axios.delete(`http://localhost:5000/api/users/${userId}/favorites`, {
          data: { station },
        });
        setFavorites((prev) => prev.filter((s) => s !== station));
      } else {
        await axios.post(`http://localhost:5000/api/users/${userId}/favorites`, { station });
        setFavorites((prev) => [...prev, station]);
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
      alert("Failed to update favorites");
    }
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header"></div>

      
      <div className="admin-login">
        <button
          onClick={() => navigate("/admin-login")}
          className="admin-btn login"
        >
          Admin Login
        </button>
      </div>

      
      <div className="search-wrapper">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by train name, from or to station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      
      <div className="table-wrapper">
        {loading ? (
          <div className="loading">Loading schedules...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No trains found</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr className="table-head">
                  <th>Train Name</th>
                  <th>From → To</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Price</th>
                  <th>Options</th>
                  {isAdmin && <th >Admin Actions</th>}
                </tr>
              </thead>
              <tbody>
                {prioritized.map((train, index) => (
                  <tr key={train._id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                    <td>
                      <p className="train-name">{train.trainName}</p>
                      <p className="train-id">ID: {train._id.slice(-8).toUpperCase()}</p>
                    </td>
                    <td className="text-center">
                      <div className="route">
                        <span className="from">
                          {train.from}
                          <button
                            aria-label="favorite from"
                            className="ml-2 inline-flex items-center"
                            onClick={() => toggleFavorite(train.from)}
                            title="Favorite station"
                          >
                            <FaStar color={favorites.includes(train.from) ? "#f59e0b" : "#d1d5db"} />
                          </button>
                        </span>
                        <span className="arrow">→</span>
                        <span className="to">
                          {train.to}
                          <button
                            aria-label="favorite to"
                            className="ml-2 inline-flex items-center"
                            onClick={() => toggleFavorite(train.to)}
                            title="Favorite station"
                          >
                            <FaStar color={favorites.includes(train.to) ? "#f59e0b" : "#d1d5db"} />
                          </button>
                        </span>
                      </div>
                    </td>
                    <td className="text-center">
                      <p className="departure">{train.departureTime}</p>
                    </td>
                    <td className="text-center">
                      <p className="arrival">{train.arrivalTime}</p>
                    </td>
                    <td className="text-center">
                      <p className="price">৳{train.price}</p>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleBooking(train)}
                        className="btn book"
                      >
                        Book Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}