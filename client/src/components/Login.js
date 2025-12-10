import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        // persist minimal user info for subsequent requests
        if (result.user) localStorage.setItem("user", JSON.stringify(result.user));
        alert("Login successful!");
        navigate("/home");
      } else {
        alert(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const checkRes = await fetch("http://localhost:5000/api/users/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: decoded.email }),
      });

      const checkResult = await checkRes.json();

      if (checkRes.ok) {
        // Store the full user object returned from backend
        if (checkResult.user) {
          localStorage.setItem("user", JSON.stringify(checkResult.user));
        }
        alert(`Logged in as: ${decoded.email}`);
        navigate("/home");
      } else {
        alert(checkResult.message || "User not found. Please sign up first with Google.");
      }
    } catch (error) {
      alert("Google login failed");
      console.error("Google login error:", error);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const userData = {
        name: decoded.name || `${decoded.given_name} ${decoded.family_name}`,
        email: decoded.email,
        password: decoded.sub,
        phone: "0000000000",
        dateOfBirth: "2000-01-01",
      };

      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.user) localStorage.setItem("user", JSON.stringify(result.user));
        alert("Signed up with Google successfully!");
        navigate("/home");
      } else {
        alert(result.message || "Google signup failed.");
      }
    } catch (error) {
      console.error("Google Signup Error:", error);
      alert("Google signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Log In to MassTransit
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        {/* Divider: OR Sign In With Google */}
        <div className="my-4 flex items-center justify-between">
          <span className="border-b w-1/5"></span>
          <span className="text-xs text-gray-500 uppercase">OR</span>
          <span className="border-b w-1/5"></span>
        </div>

        {/* Google Login */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Google login failed")}
            text="signin_with"
          />
        </div>

        {/* Link to Signup */}
        <p className="text-sm text-center mt-2">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

        {/* Divider: OR Google Signup */}
        <div className="my-2 flex items-center justify-between">
          <span className="border-b w-1/5"></span>
          <span className="text-xs text-gray-500 uppercase">OR</span>
          <span className="border-b w-1/5"></span>
        </div>

        {/* Google Signup */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={() => alert("Google signup failed")}
            text="signup_with"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
