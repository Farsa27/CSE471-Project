

//below is the updated code for login with profile persisting
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchWithFallback } from "../utils/apiHelper";
import "../i18n/languageConfig";
import { FaTrain } from "react-icons/fa";

const Login = () => {
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showDobPrompt, setShowDobPrompt] = useState(false);
  const [dobInput, setDobInput] = useState("");
  const [googleUser, setGoogleUser] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // First, try admin login
      const adminResponse = await fetchWithFallback("https://cse471-project-backend-51jt.onrender.com/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const adminResult = await adminResponse.json();

      if (adminResponse.ok && adminResult.success) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminEmail", adminResult.admin.email);
        navigate("/admin-dashboard");
        return;
      }

      // If not admin, try regular user login
      const response = await fetchWithFallback("https://cse471-project-backend-51jt.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", result.user._id);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("userName", result.user.name);
        localStorage.setItem("userEmail", result.user.email);
        navigate("/home");
      } else {
        alert(result.message || t("Invalid credentials."));
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert(t("Unable to connect to server. Please try again."));
    }
  };

  const promptDob = (user) => {
    setGoogleUser(user);
    setShowDobPrompt(true);
  };

  const handleDobSubmit = async () => {
    if (!dobInput) return alert(t("Please enter your Date of Birth."));

    try {
      if (!googleUser || !googleUser._id) return alert(t("Missing user id"));

      const response = await fetch(
        `https://cse471-project-backend-51jt.onrender.com/api/users/update-dob/${googleUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dateOfBirth: dobInput }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", result.user._id);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("userName", result.user.name);
        localStorage.setItem("userEmail", result.user.email);
        setShowDobPrompt(false);
        navigate("/home");
      } else {
        alert(result.message || t("DOB update failed."));
      }
    } catch (err) {
      console.error("DOB update failed:", err);
      alert(t("DOB update failed"));
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const checkRes = await fetchWithFallback(
        "https://cse471-project-backend-51jt.onrender.com/api/users/google-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: decoded.email }),
        }
      );

      const checkResult = await checkRes.json();

      if (checkRes.ok) {
        if (checkResult.user.dateOfBirth === "2000-01-01") {
          promptDob(checkResult.user);
        } else {
          localStorage.setItem("userId", checkResult.user._id);
          localStorage.setItem("user", JSON.stringify(checkResult.user));
          localStorage.setItem("userName", checkResult.user.name);
          localStorage.setItem("userEmail", checkResult.user.email);
          navigate("/home");
        }
      } else {
        alert(
          checkResult.message ||
            t("User not found. Please sign up first with Google.")
        );
      }
    } catch (error) {
      alert(t("Google login failed"));
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

      const response = await fetchWithFallback(
        "https://cse471-project-backend-51jt.onrender.com/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        promptDob(result.user);
      } else {
        alert(result.message || t("Google signup failed."));
      }
    } catch (error) {
      console.error("Google Signup Error:", error);
      alert(t("Google signup failed."));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: Brand / Intro */}
        <div className="hidden lg:block">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-center gap-3 text-emerald-300 mb-4">
              <FaTrain />
              <span className="font-semibold">{t("Mass Transit")}</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">{t("login")}</h2>
            <p className="mt-2 text-slate-300">
              {t("Seamless metro access — sign in to manage tickets, routes and more.")}
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="max-w-md w-full mx-auto bg-slate-900/60 rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t("login")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder={t("email")}
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-emerald-400/40"
          />

          <input
            type="password"
            name="password"
            placeholder={t("password")}
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-emerald-400/40"
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded transition"
          >
            {t("Login")}
          </button>
          </form>

          <div className="my-4 flex items-center justify-between text-slate-300">
            <span className="border-b w-1/5 border-white/10"></span>
            <span className="text-xs uppercase">{t("OR")}</span>
            <span className="border-b w-1/5 border-white/10"></span>
          </div>

          <div className="flex justify-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert(t("Google login failed"))}
              text="signin_with"
            />
          </div>

          <p className="text-sm text-center mt-2 text-slate-300">
            {t("Dont have an account? ")} {" "}
            <Link to="/signup" className="text-emerald-300 hover:underline">
              Sign up
            </Link>
          </p>

          <div className="my-2 flex items-center justify-between text-slate-300">
            <span className="border-b w-1/5 border-white/10"></span>
            <span className="text-xs uppercase">{t("OR")}</span>
            <span className="border-b w-1/5 border-white/10"></span>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => alert(t("Google signup failed"))}
              text="signup_with"
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => i18n.changeLanguage("en")}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded border border-white/10"
            >
              English
            </button>
            <button
              onClick={() => i18n.changeLanguage("bn")}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded border border-white/10"
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>

      {showDobPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 text-slate-100 border border-white/10 p-6 rounded-xl w-[420px] max-w-[92%]">
            <h2 className="text-lg font-semibold mb-4">
              Please enter your Date of Birth
            </h2>
            <input
              type="date"
              value={dobInput}
              onChange={(e) => setDobInput(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded mb-4 outline-none focus:ring-2 focus:ring-emerald-400/40"
            />
            <button
              onClick={handleDobSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
