
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaStar } from "react-icons/fa";
import { axiosWithFallback } from "../utils/apiHelper";
import "./TrainScheduleList.css";
import { t } from "i18next";

export default function TrainScheduleList() {
  const [schedules, setSchedules] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [favoriteRoutes, setFavoriteRoutes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
    const userId = localStorage.getItem("userId");
    if (userId) {
      const api = axiosWithFallback(axios);
      api
        .get(`http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/users/${userId}`)
        .then((res) => {
          setFavorites(res.data?.user?.favoriteStations || []);
        })
        .catch(() => {});
      
      // Fetch favorite routes
      api
        .get(`http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/users/${userId}/favorite-routes`)
        .then((res) => {
          setFavoriteRoutes(res.data?.favoriteRoutes || []);
        })
        .catch(() => {});
    }
  }, []);

  const fetchSchedules = async () => {
    try {
      const api = axiosWithFallback(axios);
      const res = await api.get("http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/schedules");
      setSchedules(res.data);
    } catch {
      setError("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (train) => {
    const userName = localStorage.getItem("userName") || "Guest User";
    const userEmail = localStorage.getItem("userEmail") || "";
    const userId = localStorage.getItem("userId");

    if (!userEmail) {
      alert(t("Please log in to book a ticket"));
      navigate("/login");
      return;
    }

    try {
      const api = axiosWithFallback(axios);
      const res = await api.get(`http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/bookings/user/${userEmail}`);
      const existing = res.data.bookings || [];
      const duplicate = existing.find(
        b => b.from === train.from && b.to === train.to &&
             b.departureTime === train.departureTime && b.arrivalTime === train.arrivalTime
      );
      if (duplicate) {
        alert(t("You already booked this train. Choose another."));
        return;
      }

      let finalPrice = train.price;
      try {
        const studentRes = await api.get(`http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/student-verification/status/${userId}`);
        if (studentRes.data.isStudent && studentRes.data.studentVerificationStatus === "verified") {
          finalPrice = Math.max(0, train.price - 20);
        }
      } catch {}

      const bookingData = {
        trainId: train._id,
        trainName: train.trainName,
        from: train.from,
        to: train.to,
        departure: train.departureTime,
        arrival: train.arrivalTime,
        price: finalPrice,
        passengerName: userName,
        passengerEmail: userEmail
      };

      navigate("/payment-checkout", { state: { bookingData } });
    } catch {
      alert(t("Error checking bookings. Try again."));
    }
  };

  const toggleFavoriteRoute = async (train) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert(t("Please log in to manage favorite routes"));
      navigate("/login");
      return;
    }

    try {
      const api = axiosWithFallback(axios);
      const isFavorite = favoriteRoutes.some(r => r.scheduleId === train._id);
      console.log("Toggle favorite route:", train.trainName, "Current favorite:", isFavorite);
      
      if (isFavorite) {
        console.log("Removing from favorites...");
        await api.delete(`http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/users/${userId}/favorite-routes`, {
          data: { scheduleId: train._id },
        });
        setFavoriteRoutes(prev => prev.filter(r => r.scheduleId !== train._id));
        console.log("Removed successfully");
      } else {
        const routeData = {
          scheduleId: train._id,
          trainName: train.trainName,
          from: train.from,
          to: train.to,
          departureTime: train.departureTime,
          arrivalTime: train.arrivalTime,
          price: train.price,
        };
        console.log("Adding to favorites:", routeData);
        const response = await api.post(`http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/users/${userId}/favorite-routes`, routeData);
        console.log("Add response:", response.data);
        setFavoriteRoutes(prev => [...prev, routeData]);
        console.log("Added successfully");
      }
    } catch (err) {
      console.error("Failed to update favorite routes:", err.response?.data || err.message);
      alert(`Failed to update: ${err.response?.data?.message || err.message}`);
    }
  };

  const filtered = schedules.filter(s =>
    s.trainName?.toLowerCase().includes(search.toLowerCase()) ||
    s.from?.toLowerCase().includes(search.toLowerCase()) ||
    s.to?.toLowerCase().includes(search.toLowerCase())
  );

  const prioritized = [...filtered].sort((a, b) => {
    const aIsFavoriteRoute = favoriteRoutes.some(r => r.scheduleId === a._id);
    const bIsFavoriteRoute = favoriteRoutes.some(r => r.scheduleId === b._id);
    
    // Favorite routes come first
    if (aIsFavoriteRoute && !bIsFavoriteRoute) return -1;
    if (!aIsFavoriteRoute && bIsFavoriteRoute) return 1;
    
    // Then sort by favorite stations
    const aFav = favorites.includes(a.from) || favorites.includes(a.to);
    const bFav = favorites.includes(b.from) || favorites.includes(b.to);
    return (bFav ? 1 : 0) - (aFav ? 1 : 0);
  });

  return (
    <div className="schedule-container">
      <div className="top-bar">
        <h1>🚆 {t("Train Schedule")} </h1>
      </div>

      <div className="search-wrapper">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={t("Search by train name,from or to station...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="loading">{t("Loading schedules...")}</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : prioritized.length === 0 ? (
          <div className="empty">{t("No trains found.")}</div>
        ) : (
          <table className="table-container">
            <thead>
              <tr>
                <th>⭐</th>
                <th>{t("Train")}</th>
                <th>{t("Route")}</th>
                <th>{t("Departure")}</th>
                <th>{t("Arrival")}</th>
                <th>{t("Price")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {prioritized.map((train, index) => {
                const isRouteFavorite = favoriteRoutes.some(r => r.scheduleId === train._id);
                return (
                  <tr key={train._id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                    <td>
                      <button 
                        onClick={() => toggleFavoriteRoute(train)} 
                        title="Favorite this route"
                        className="star-btn"
                      >
                        <FaStar 
                          size={20}
                          color={isRouteFavorite ? "#f59e0b" : "#d1d5db"} 
                        />
                      </button>
                    </td>
                    <td>
                      <strong>{train.trainName}</strong>
                      <div>ID: {train._id.slice(-8).toUpperCase()}</div>
                    </td>
                    <td>
                      {train.from} → {train.to}
                    </td>
                    <td>{train.departureTime}</td>
                    <td>{train.arrivalTime}</td>
                    <td>৳{train.price}</td>
                    <td>
                      <button onClick={() => handleBooking(train)} className="btn book">
                        {t("Book")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

