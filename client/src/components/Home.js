

// //feature-2
// // 
// //below is the updated code for profile viewing and editing
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";


// const Home = () => {
//   const navigate = useNavigate();
//   const [showProfile, setShowProfile] = useState(false);
//   const [user, setUser] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});


//   const userId = localStorage.getItem("userId");


//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!userId) return;
//       const res = await fetch(`http://localhost:5000/api/users/${userId}`);
//       const data = await res.json();
//       if (res.ok) {
//         setUser(data.user); // FIX: extract user from data
//         setFormData(data.user); // FIX: same here
//       } else {
//         alert("Failed to fetch user data.");
//       }
//     };


//     fetchUser();
//   }, [userId]);


//   const handleLogout = () => {
//     localStorage.removeItem("userId");
//     navigate("/");
//   };


//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };


//   const handleUpdate = async () => {
//     const { name, email, phone, password } = formData;


//     if (!name || !email || !phone || !password) {
//       alert("All fields are required.");
//       return;
//     }


//     const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, phone, password }),
//     });


//     const result = await res.json();


//     if (res.ok) {
//       alert("Profile updated!");
//       setUser(result.user); // FIX: use updated user object
//       setFormData(result.user);
//       setEditMode(false);
//       setShowProfile(false);
//     } else {
//       alert(result.message || "Update failed.");
//     }
//   };


//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <div className="absolute top-4 right-4 flex items-center space-x-2">
//         <button
//           onClick={() => setShowProfile(true)}
//           className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
//         >
//           Profile
//         </button>
//         <button
//           onClick={handleLogout}
//           className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//         >
//           Logout
//         </button>
//       </div>


//       <h1 className="text-2xl font-bold mb-4">Welcome to Mass Transit Control System</h1>
      
//       <button
//         onClick={() => navigate("/train-schedules")}
//         className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         View Train Schedules
//       </button>

//       <button
//         onClick={() => navigate("/booked-tickets")}
//         className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
//       >
//         My Booked Tickets
//       </button>

//       <button
//         onClick={() => navigate("/qr-ticket")}
//         className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//       >
//         Get QR Ticket
//       </button>

//       <button
//         onClick={() => navigate("/station-map")}
//         className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//       >
//         My Location
//       </button>


//       <button
//         onClick={() => navigate("/report-choice")}
//         className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//       >
//         Report an Issue
//       </button>

//       {showProfile && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-xl font-bold mb-4">User Profile</h2>
//             {["name", "email", "phone", "password"].map((field) => (
//               <input
//                 key={field}
//                 type={field === "password" ? "password" : "text"}
//                 name={field}
//                 value={formData[field] || ""}
//                 onChange={handleProfileChange}
//                 placeholder={field}
//                 className="mb-2 w-full px-3 py-2 border rounded"
//                 readOnly={!editMode}
//               />
//             ))}
//             <div className="flex justify-end space-x-2 mt-4">
//               {!editMode ? (
//                 <button
//                   onClick={() => setEditMode(true)}
//                   className="bg-blue-500 text-white px-4 py-1 rounded"
//                 >
//                   Edit
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     onClick={handleUpdate}
//                     className="bg-green-600 text-white px-4 py-1 rounded"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => {
//                       setEditMode(false);
//                       setFormData(user);
//                     }}
//                     className="bg-gray-400 text-white px-4 py-1 rounded"
//                   >
//                     Cancel
//                   </button>
//                 </>
//               )}
//               <button
//                 onClick={() => {
//                   setShowProfile(false);
//                   setEditMode(false);
//                 }}
//                 className="bg-red-500 text-white px-4 py-1 rounded"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// export default Home;


//feature-2
// 
//below is the updated code for profile viewing and editing
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaUserCircle, FaSignOutAlt, FaGlobe, FaBell, FaTrain, FaTicketAlt, FaMapMarkerAlt, FaExclamationTriangle, FaComments, FaImages, FaWifi } from "react-icons/fa";
import AdSlider from "./AdSlider";

const Home = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      const res = await fetch(`http://localhost:5000/api/users/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setFormData(data.user);
      } else {
        alert("Failed to fetch user data.");
      }
    };

    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleNotification = () => {
    alert("You have new notifications!");
  };

  const handleUpdate = async () => {
    const { name, email, phone, password } = formData;

    if (!name || !email || !phone || !password) {
      alert("All fields are required.");
      return;
    }


    const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Profile updated!");
      setUser(result.user);
      setFormData(result.user);
      setEditMode(false);
      setShowProfile(false);
    } else {
      alert(result.message || "Update failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Top Nav */}
      <header className="sticky top-0 z-20 backdrop-blur bg-slate-900/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaTrain className="text-emerald-400" size={22} />
            <span className="font-semibold tracking-wide">MassTransit</span>
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
              onClick={() => setShowProfile(true)}
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
                  <div className="text-sm text-slate-300">Browse all routes and times</div>
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
                  <div className="text-sm text-slate-300">See your recent tickets</div>
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
                  <div className="text-sm text-slate-300">Generate your boarding QR</div>
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
                  <div className="text-sm text-slate-300">View nearby stations</div>
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
                  <div className="text-sm text-slate-300">Report an issue quickly</div>
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
                    <div className="text-sm text-slate-300">Submit lost item details</div>
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
                    <div className="text-sm text-slate-300">Browse found items</div>
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
                  <div className="text-sm text-slate-300">Tell us how we’re doing</div>
                </div>
              </div>
            </button>
            <button onClick={() => navigate("/student-verification")} className="group rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-300 grid place-items-center">
                  <FaUserCircle />
                </div>
                <div>
                  <div className="font-semibold">Verify as Student</div>
                  <div className="text-sm text-slate-300">Get student discount (20 Taka)</div>
                </div>
              </div>
            </button>

            <button onClick={() => navigate("/wifi-subscription")} className="group rounded-xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-300 grid place-items-center">
                  <FaWifi />
                </div>
                <div>
                  <div className="font-semibold">WiFi Subscription</div>
                  <div className="text-sm text-slate-300">Monthly WiFi access (100 Taka)</div>
                </div>
              </div>
            </button>          </div>
        </div>
      </section>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 rounded-xl w-[500px] max-w-[92%] p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUserCircle /> {t("profile")}
            </h2>
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
            <div className="flex justify-end gap-2 mt-2">
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10">
                  Edit
                </button>
              ) : (
                <>
                  <button onClick={handleUpdate} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData(user);
                    }}
                    className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10"
                  >
                    Cancel
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
