// src/pages/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ If already logged in, skip login page
  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isAdmin", "true");   // ✅ set admin flag
        navigate("/admin-dashboard");              // ✅ redirect to dashboard
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch {
      setError("Cannot connect to server. Is backend running on port 5001?");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>MASS TRANSIT</h1>
          <h2>CONTROL CENTER</h2>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit">LOG IN</button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/admin/signup")}
          className="secondary-btn"
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}

