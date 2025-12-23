
//below is the updated code for signup with additional fields and google signup integration
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";



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
      const response = await fetch("http://localhost:5000/api/users/register", {
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

        alert("User registered successfully!");
        navigate("/home");
      } else {
        alert(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-1">{t("createAccount")}</h2>
        <p className="text-sm text-gray-600 text-center mb-6">{t("signupSubtitle")}</p>


        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder={t("name")}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />


          <input
            type="email"
            name="email"
            placeholder={t("email")}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />


          <input
            type="password"
            name="password"
            placeholder={t("password")}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />


          <input
            type="text"
            name="phone"
            placeholder={t("phoneNumber")}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />


          <input
            type="date"
            name="dateOfBirth"
            aria-label={t("dateOfBirth")}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />


          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
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


              const response = await fetch("http://localhost:5000/api/users/register", {
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


        <p className="text-sm text-center mt-4">
          {t("alreadyHaveAccount")} {" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            {t("loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
};


export default Signup;