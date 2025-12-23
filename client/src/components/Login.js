// //below is the updated code for login with profile persisting
// import { useState } from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate, Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import "../i18n/languageConfig";

// const Login = () => {
//   const { t, i18n } = useTranslation();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:5000/api/users/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         localStorage.setItem("userId", result.user._id);
//         localStorage.setItem("user", JSON.stringify(result.user));
//         localStorage.setItem("userName", result.user.name);
//         localStorage.setItem("userEmail", result.user.email);
//         navigate("/home");
//       } else {
//         alert(result.message || "Something went wrong.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong.");
//     }
//   };

//   const handleGoogleLogin = async (credentialResponse) => {
//     try {
//       const decoded = jwtDecode(credentialResponse.credential);

//       const checkRes = await fetch(
//         "http://localhost:5000/api/users/google-login",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: decoded.email }),
//         }
//       );

//       const checkResult = await checkRes.json();

//       if (checkRes.ok) {
//         navigate("/home");
//       } else {
//         alert(
//           checkResult.message ||
//             "User not found. Please sign up first with Google."
//         );
//       }
//     } catch (error) {
//       alert("Google login failed");
//       console.error("Google login error:", error);
//     }
//   };

//   const handleGoogleSignup = async (credentialResponse) => {
//     try {
//       const decoded = jwtDecode(credentialResponse.credential);

//       const userData = {
//         name:
//           decoded.name ||
//           `${decoded.given_name} ${decoded.family_name}`,
//         email: decoded.email,
//         password: decoded.sub,
//         phone: "0000000000",
//         dateOfBirth: "2000-01-01",
//       };

//       const response = await fetch(
//         "http://localhost:5000/api/users/register",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(userData),
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         localStorage.setItem("userId", result.user._id);
//         localStorage.setItem("user", JSON.stringify(result.user));
//         localStorage.setItem("userName", result.user.name);
//         localStorage.setItem("userEmail", result.user.email);

//         alert("Signed up with Google successfully!");
//         navigate("/home");
//       } else {
//         alert(result.message || "Google signup failed.");
//       }
//     } catch (error) {
//       console.error("Google Signup Error:", error);
//       alert("Google signup failed.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           {t("login")}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             name="email"
//             placeholder={t("email")}
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder={t("password")}
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded"
//           />

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//           >
//             {t("Login")}
//           </button>
//         </form>

//         <div className="my-4 flex items-center justify-between">
//           <span className="border-b w-1/5"></span>
//           <span className="text-xs text-gray-500 uppercase">{t("OR")}</span>
//           <span className="border-b w-1/5"></span>
//         </div>

//         <div className="flex justify-center mb-4">
//           <GoogleLogin
//             onSuccess={handleGoogleLogin}
//             onError={() => alert("Google login failed")}
//             text="signin_with"
//           />
//         </div>

//         <p className="text-sm text-center mt-2">
//           {/* Don’t have an account?{" "} */}
//           {t("Dont have an account? Sign Up")}{" "}
//           <Link to="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </p>

//         <div className="my-2 flex items-center justify-between">
//           <span className="border-b w-1/5"></span>
//           <span className="text-xs text-gray-500 uppercase">{t("OR")}</span>
//           <span className="border-b w-1/5"></span>
//         </div>

//         <div className="flex justify-center">
//           <GoogleLogin
//             onSuccess={handleGoogleSignup}
//             onError={() => alert("Google signup failed")}
//             text="signup_with"
//           />
//         </div>

//         <div className="mt-4">
//           <button
//             onClick={() => i18n.changeLanguage("en")}
//             className="px-3 py-1 bg-gray-300 rounded mr-2"
//           >
//             English
//           </button>
//           <button
//             onClick={() => i18n.changeLanguage("bn")}
//             className="px-3 py-1 bg-gray-300 rounded"
//           >
//             বাংলা
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

//below is the updated code for login with profile persisting
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../i18n/languageConfig";

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
      const response = await fetch("http://localhost:5000/api/users/login", {
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
        alert(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  const promptDob = (user) => {
    setGoogleUser(user);
    setShowDobPrompt(true);
  };

  const handleDobSubmit = async () => {
    if (!dobInput) return alert("Please enter your Date of Birth.");

    try {
      if (!googleUser || !googleUser._id) return alert("Missing user id");

      const response = await fetch(
        `http://localhost:5000/api/users/update-dob/${googleUser._id}`,
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
        alert(result.message || "DOB update failed.");
      }
    } catch (err) {
      console.error("DOB update failed:", err);
      alert("DOB update failed");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const checkRes = await fetch(
        "http://localhost:5000/api/users/google-login",
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
            "User not found. Please sign up first with Google."
        );
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

      const response = await fetch(
        "http://localhost:5000/api/users/register",
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
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder={t("password")}
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {t("Login")}
          </button>
        </form>

        <div className="my-4 flex items-center justify-between">
          <span className="border-b w-1/5"></span>
          <span className="text-xs text-gray-500 uppercase">{t("OR")}</span>
          <span className="border-b w-1/5"></span>
        </div>

        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Google login failed")}
            text="signin_with"
          />
        </div>

        <p className="text-sm text-center mt-2">
          {t("Dont have an account? Sign Up")} {" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

        <div className="my-2 flex items-center justify-between">
          <span className="border-b w-1/5"></span>
          <span className="text-xs text-gray-500 uppercase">{t("OR")}</span>
          <span className="border-b w-1/5"></span>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={() => alert("Google signup failed")}
            text="signup_with"
          />
        </div>

        <div className="mt-4">
          <button
            onClick={() => i18n.changeLanguage("en")}
            className="px-3 py-1 bg-gray-300 rounded mr-2"
          >
            English
          </button>
          <button
            onClick={() => i18n.changeLanguage("bn")}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            বাংলা
          </button>
        </div>
      </div>

      {showDobPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              Please enter your Date of Birth
            </h2>
            <input
              type="date"
              value={dobInput}
              onChange={(e) => setDobInput(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <button
              onClick={handleDobSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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