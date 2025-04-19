import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"

// import '../stylesheet/SignUp_Login.css'

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function SignUpLogin() {
  const [action, setAction] = useState("Sign Up");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
  });

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    if (action === "Sign Up") {
      if (!validateEmail(formData.email)) {
        alert("Please enter a valid email.");
        return false;
      }
      if (!validatePassword(formData.password)) {
        toast.error("Password must be ≥8 chars, include upper, lower, number & special char.")
        return false;
      }
    }
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      if (!validateForm()) return;
  
      try {
        const endpoint = action === "Sign Up" ? "api/user/signUp" : "api/user/logIn";
        const response = await axios.post(`http://localhost:8000/${endpoint}`, formData, {
          withCredentials: true, // Important to allow cookies
        });
    
        if (response.data.success) {
          // Save token & user info in localStorage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
    
          // Navigate to dashboard/homepage
          toast.success(response.data.message || "Login successful");
          navigate("/dashboard");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.response?.data?.message);
      }    
  };

  const handleClick = () => {
    setAction((prev) => (prev === "Sign Up" ? "Log In" : "Sign Up"));
  };

  return (
    <div className="sbox">
      <div className="scontainer">
        <button
          className="closeBtn"
          onClick={() => navigate("/")}
          aria-label="Close"
        >
          ×
        </button>

        <div className="sheader">
          <h2 className="stext">{action}</h2>
          <div className="sunderline" />
        </div>

        <form onSubmit={handleSubmit}>
          {action === "Sign Up" && (
            <>
              <div className="sinput">
            <input
              type="text"
              name="username"
              className="sinput_style"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
              <div className="sinput">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

<div className="sinput">
                <input
                  type="email"
                  name="email"
                  className="sinput_style"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

          <div className="sinput">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {action !== "Sign Up" && (
              <div className="lostpassword">
                Lost Password? <a href="/forget-password">click here</a>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={action === "Sign Up" ? "signSubmit" : "logSubmit"}
          >
            Submit
          </button>

          <div className="or">or</div>
          <div className="haveAccount">
            {action === "Sign Up" ? "Already have an account?" : "Don't have an account?"}
            <span onClick={() => setAction((a) => (a === "Sign Up" ? "Log In" : "Sign Up"))}>
              {action === "Sign Up" ? "Log In" : "Sign Up"}
            </span>
          </div>
        </form>
      </div>
    </div>
);
}
