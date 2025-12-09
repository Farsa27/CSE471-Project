
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Clear any stored tokens here if you're using auth (optional)
//     navigate("/"); // Redirect to login page
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-2xl font-bold mb-4">Welcome to Mass Transit Control System</h1>
//       <button
//         onClick={handleLogout}
//         className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default Home;

//feature-2
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
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
        setUser(data);
        setFormData(data);
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

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    if (res.ok) {
      alert("Profile updated!");
      setUser(result);
      setShowProfile(false);
    } else {
      alert(result.message || "Update failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={() => setShowProfile(true)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Welcome to Mass Transit Control System</h1>

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">User Profile</h2>
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
  );
};

export default Home;
