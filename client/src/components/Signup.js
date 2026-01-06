
//below is the updated code for signup with additional fields and google signup integration
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { FaTrain } from "react-icons/fa";



const Signup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch("https://cse471-project-production.up.railway.app/api/users/register", {
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

        alert(t("User registered successfully!"));
        navigate("/home");
      } else {
        alert(result.message || t("Something went wrong."));
      }
    } catch (error) {
      console.error("Error:", error);
      alert(t("Something went wrong."));
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: Branding */}
        <div className="hidden lg:block">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-center gap-3 text-emerald-300 mb-4">
              <FaTrain />
              <span className="font-semibold">{t("Mass Transit")}</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">{t("createAccount")}</h2>
            <p className="mt-2 text-slate-300">{t("signupSubtitle")}</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full max-w-md mx-auto bg-slate-900/60 rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-center mb-1">{t("createAccount")}</h2>
          <p className="text-sm text-slate-300 text-center mb-6">{t("signupSubtitle")}</p>


        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder={t("name")}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-emerald-400/40"
          />


          <input
            type="email"
            name="email"
            placeholder={t("email")}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-emerald-400/40"
          />


          <input
            type="password"
            name="password"
            placeholder={t("password")}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-emerald-400/40"
          />


          <input
            type="text"
            name="phone"
            placeholder={t("phoneNumber")}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-emerald-400/40"
          />


          <input
            type="date"
            name="dateOfBirth"
            aria-label={t("dateOfBirth")}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-emerald-400/40"
          />


          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md transition"
          >
            {t("signUp")}
          </button>
        </form>


        <div className="my-4 flex items-center justify-center">
          <span className="text-gray-500 text-sm">{t("orSignUpWithGoogle")}</span>
        </div>


        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const decoded = jwtDecode(credentialResponse.credential);


              const response = await fetch("https://cse471-project-production.up.railway.app/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: decoded.name,
                  email: decoded.email,
                  password: decoded.sub,
                  phone: "0000000000",
                  dateOfBirth: "2000-01-01",
                }),
              });


              const result = await response.json();


              if (response.ok) {
                localStorage.setItem("userId", result.user._id);
                localStorage.setItem("user", JSON.stringify(result.user));

                alert(t("signedUpWithGoogleSuccess"));
                navigate("/home");
              } else {
                alert(result.message || t("googleSignupFailed"));
              }
            } catch (error) {
              console.error("Google Signup Error:", error);
              alert(t("googleSignupFailed"));
            }
          }}
          onError={() => alert(t("googleSignupFailed"))}
          text="signup_with"
        />


        <p className="text-sm text-center mt-4 text-slate-300">
          {t("alreadyHaveAccount")} {" "}
          <Link to="/login" className="text-emerald-300 hover:underline">
            {t("loginLink")}
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
};


export default Signup;
