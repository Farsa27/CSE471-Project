

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
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button
            onClick={() => setShowProfile(true)}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            {t("profile")}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {t("logout")}
          </button>
          <button
            onClick={() => i18n.changeLanguage(i18n.language === "en" ? "bn" : "en")}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            title={t("translate")}
          >
            {i18n.language === "en" ? "BN" : "EN"}
          </button>
          <button
            onClick={handleNotification}
            className="relative bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 flex items-center gap-2"
            style={{ width: "40px", height: "40px" }}
          >
            🔔
          </button>

        </div>

        <h1 className="text-2xl font-bold mb-4">{t("welcome")}</h1>

        <button
          onClick={() => navigate("/train-schedules")}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t("schedules")}
        </button>

        <button
          onClick={() => navigate("/booked-tickets")}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          {t("bookedTicket")}
        </button>

        <button
          onClick={() => navigate("/qr-ticket")}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {t("qrTicket")}
        </button>

        <button
          onClick={() => navigate("/station-map")}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {t("myLocation")}
        </button>

        <button
          onClick={() => navigate("/report-choice")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {t("report")}
        </button>
        <button
          onClick={() => navigate("/lost-items-form")}
          className="mt-2 px-2 py-2 bg-pink-500 text-white px-5 py-2 rounded"
        >
          {t("lostFoundForm")}
        </button>
        <button
          onClick={() => navigate("/lost-items-gallery")}
          className="mt-2 px-2 py-2 bg-teal-500 text-white px-5 py-2 rounded"
        >
          {t("viewLostItems")}
        </button>

        {showProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">{t("profile")}</h2>
              {["name", "email", "phone", "password"].map((field) => (
                <input
                  key={field}
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleProfileChange}
                  placeholder={field}
                  className="mb-2 w-full px-3 py-2 border rounded"
                  readOnly={!editMode}
                />
              ))}
              <div className="flex justify-end space-x-2 mt-4">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 text-white px-4 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setFormData(user);
                      }}
                      className="bg-gray-400 text-white px-4 py-1 rounded"
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
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Close
                </button>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advertisement Slider */}
      <AdSlider />
    </>
  );
};

export default Home;
