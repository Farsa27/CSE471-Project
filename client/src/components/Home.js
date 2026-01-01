

//feature-2
// 
//below is the updated code for profile viewing and editing
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaUserCircle, FaSignOutAlt, FaGlobe, FaBell, FaTrain, FaTicketAlt, FaMapMarkerAlt, FaExclamationTriangle, FaComments, FaImages, FaWifi, FaStar } from "react-icons/fa";
import AdSlider from "./AdSlider";

const Home = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [favoriteRoutes, setFavoriteRoutes] = useState([]);

  const userId = localStorage.getItem("userId");

  const fetchFavoriteRoutes = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/favorite-routes`);
      const data = await res.json();
      console.log("Fetched favorite routes:", data);
      if (res.ok) {
        setFavoriteRoutes(data.favoriteRoutes || []);
      }
    } catch (error) {
      console.error("Failed to fetch favorite routes:", error);
    }
  }, [userId]);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    const res = await fetch(`http://localhost:5000/api/users/${userId}`);
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setFormData(data.user);
    } else {
      alert(t("Failed to fetch user data."));
    }
  }, [userId, t]);

  useEffect(() => {
    fetchUser();
    fetchFavoriteRoutes();
  }, [fetchUser, fetchFavoriteRoutes]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleNotification = () => {
    alert(t("You have new notifications!"));
  };

  const handleBookFavoriteRoute = async (route) => {
    const userName = localStorage.getItem("userName") || "Guest User";
    const userEmail = localStorage.getItem("userEmail") || "";

    if (!userEmail) {
      alert(t("Please log in to book a ticket"));
      navigate("/login");
      return;
    }

    // Prepare booking data
    const bookingData = {
      trainId: route.scheduleId,
      trainName: route.trainName,
      from: route.from,
      to: route.to,
      departure: route.departureTime,
      arrival: route.arrivalTime,
      price: route.price,
      passengerName: userName,
      passengerEmail: userEmail
    };

    // Close profile and navigate to payment
    setShowProfile(false);
    navigate("/payment-checkout", { state: { bookingData } });
  };

  const handleUpdate = async () => {
    const { name, email, phone, password } = formData;

    if (!name || !email || !phone || !password) {
      alert(t("All fields are required."));
      return;
    }


    const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const result = await res.json();

    if (res.ok) {
      alert(t("Profile updated!"));
      setUser(result.user);
      setFormData(result.user);
      setEditMode(false);
      setShowProfile(false);
    } else {
      alert(result.message || t("Update failed."));
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Top Nav */}
      <header className="sticky top-0 z-20 backdrop-blur bg-slate-900/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaTrain className="text-emerald-400" size={22} />
            <span className="font-semibold tracking-wide">{t("Mass Transit")}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => i18n.changeLanguage(i18n.language === "en" ? "bn" : "en")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10"
              title={t("translate")}
            >
              <FaGlobe />
              <span className="hidden sm:inline">{i18n.language === "en" ? "BN" : "EN"}</span>
            </button>
            <button
              onClick={handleNotification}
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white/5 hover:bg-white/10 border border-white/10"
              aria-label="notifications"
            >
              <FaBell />
            </button>
            <button
              onClick={() => {
                fetchFavoriteRoutes();
                setShowProfile(true);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <FaUserCircle />
              <span className="hidden sm:inline">{t("profile")}</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-rose-600 hover:bg-rose-700"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">{t("logout")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                {t("welcome")}
              </h1>
              <p className="mt-3 text-slate-300">
                {t("schedules")} · {t("bookedTicket")} · {t("qrTicket")} · {t("report")}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <AdSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <button onClick={() => navigate("/train-schedules")} className="group rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-300 grid place-items-center">
                  <FaTrain />
                </div>
                <div>
                  <div className="font-semibold">{t("schedules")}</div>
                  <div className="text-sm text-slate-300">{t("Browse all routes and times")}</div>
                </div>
              </div>
            </button>

            <button onClick={() => navigate("/booked-tickets")} className="group rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/20 text-amber-300 grid place-items-center">
                  <FaTicketAlt />
                </div>
                <div>
                  <div className="font-semibold">{t("bookedTicket")}</div>
                  <div className="text-sm text-slate-300">{t("See your recent tickets")}</div>
                </div>
              </div>
            </button>

            <button onClick={() => navigate("/qr-ticket")} className="group rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 text-green-300 grid place-items-center">
                  <FaTicketAlt />
                </div>
                <div>
                  <div className="font-semibold">{t("qrTicket")}</div>
                  <div className="text-sm text-slate-300">{t("Generate your boarding QR")}</div>
                </div>
              </div>
            </button>

            <button onClick={() => navigate("/station-map")} className="group rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-violet-500/20 text-violet-300 grid place-items-center">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <div className="font-semibold">{t("myLocation")}</div>
                  <div className="text-sm text-slate-300">{t("View nearby stations")}</div>
                </div>
              </div>
            </button>

            <button onClick={() => navigate("/report-choice")} className="group rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 text-indigo-300 grid place-items-center">
                  <FaExclamationTriangle />
                </div>
                <div>
                  <div className="font-semibold">{t("report")}</div>
                  <div className="text-sm text-slate-300">{t("Report an issue quickly")}</div>
                </div>
              </div>
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => navigate("/lost-items-form")} className="rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-pink-500/20 text-pink-300 grid place-items-center">
                    <FaImages />
                  </div>
                  <div>
                    <div className="font-semibold">{t("lostFoundForm")}</div>
                    <div className="text-sm text-slate-300">{t("Submit lost item details")}</div>
                  </div>
                </div>
              </button>
              <button onClick={() => navigate("/lost-items-gallery")} className="rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-teal-500/20 text-teal-300 grid place-items-center">
                    <FaImages />
                  </div>
                  <div>
                    <div className="font-semibold">{t("viewLostItems")}</div>
                    <div className="text-sm text-slate-300">{t("Browse Found items")}</div>
                  </div>
                </div>
              </button>
            </div>

            <button onClick={() => navigate("/feedback")} className="group rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 text-orange-300 grid place-items-center">
                  <FaComments />
                </div>
                <div>
                  <div className="font-semibold">{t ? t("feedback") : "Feedback"}</div>
                  <div className="text-sm text-slate-300">{t("Tell us how we're doing")}</div>
                </div>
              </div>
            </button>
            <button onClick={() => navigate("/student-verification")} className="group rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-300 grid place-items-center">
                  <FaUserCircle />
                </div>
                <div>
                  <div className="font-semibold">{t("Verify as Student")}</div>
                  <div className="text-sm text-slate-300">{t("Get student discount (20 Taka)")}</div>
                </div>
              </div>
            </button>

            <button onClick={() => navigate("/wifi-subscription")} className="group rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-300 grid place-items-center">
                  <FaWifi />
                </div>
                <div>
                  <div className="font-semibold">{t("Wifi Subscription")}</div>
                  <div className="text-sm text-slate-300">{t("Monthly WiFi access (100 Taka)")}</div>
                </div>
              </div>
            </button>          </div>
        </div>
      </section>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-xl w-[700px] max-w-[95%] max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUserCircle /> {t("profile")}
            </h2>
            
            {/* Profile Information */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Personal Information</h3>
              {["name", "email", "phone", "password"].map((field) => (
                <input
                  key={field}
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleProfileChange}
                  placeholder={field}
                  className="mb-3 w-full px-3 py-2 bg-white/5 border border-white/10 rounded outline-none focus:ring-2 focus:ring-emerald-400/40"
                  readOnly={!editMode}
                />
              ))}
            </div>

            {/* Favorite Routes Section */}
            {favoriteRoutes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase flex items-center gap-2">
                  <FaStar className="text-amber-400" />
                  My Favorite Routes ({favoriteRoutes.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {favoriteRoutes.map((route, index) => (
                    <div 
                      key={index}
                      className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 hover:bg-amber-500/20 transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-amber-400 truncate">{route.trainName}</div>
                          <div className="text-sm text-slate-300 truncate">
                            {route.from} → {route.to}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {route.departureTime} - {route.arrivalTime} • ৳{route.price}
                          </div>
                        </div>
                        <button
                          onClick={() => handleBookFavoriteRoute(route)}
                          className="px-3 py-1.5 text-sm rounded bg-emerald-600 hover:bg-emerald-700 transition whitespace-nowrap"
                        >
                          {t("Book")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {favoriteRoutes.length === 0 && (
              <div className="mb-6 text-center py-6 bg-white/5 rounded-lg border border-white/10">
                <FaStar className="text-slate-600 mx-auto mb-2" size={32} />
                <p className="text-slate-400 text-sm">No favorite routes yet</p>
                <p className="text-slate-500 text-xs mt-1">Star routes in Train Schedules to see them here</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-2">
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10">
                  {t("edit")}
                </button>
              ) : (
                <>
                  <button onClick={handleUpdate} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white">
                    {t("save")}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData(user);
                    }}
                    className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10"
                  >
                    {t("cancel")}
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setShowProfile(false);
                  setEditMode(false);
                }}
                className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
