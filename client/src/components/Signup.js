
//below is the updated code for signup with additional fields and google signup integrationimport { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";



const Signup = () => {
  const navigate = useNavigate();
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
        <h2 className="text-2xl font-bold text-center mb-1">Create your account</h2>
        <p className="text-sm text-gray-600 text-center mb-6">Sign up to MassTransit</p>


        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />


          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />


          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />


          <input
            type="date"
            name="dateOfBirth"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />


          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>


        <div className="my-4 flex items-center justify-center">
          <span className="text-gray-500 text-sm">OR SIGN UP WITH GOOGLE</span>
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

                alert("Signed up with Google successfully!");
                navigate("/home");
              } else {
                alert(result.message || "Google signup failed.");
              }
            } catch (error) {
              console.error("Google Signup Error:", error);
              alert("Google signup failed.");
            }
          }}
          onError={() => alert("Google signup failed.")}
          text="signup_with"
        />


        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};


export default Signup;