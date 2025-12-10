
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored tokens here if you're using auth (optional)
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome to Mass Transit Control System</h1>
      <div className="space-x-4">
        <Link
          to="/report-choice"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Report Issue / Hazard
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
