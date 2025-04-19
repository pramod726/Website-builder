import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../stylesheets/SignUp_Login.css";

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

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pw) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pw);

  const validateForm = () => {
    if (action === "Sign Up") {
      if (!validateEmail(formData.email)) {
        alert("Please enter a valid email.");
        return false;
      }
      if (!validatePassword(formData.password)) {
        alert(
          "Password must be ≥8 chars, include upper, lower, number & special char."
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const endpoint =
        action === "Sign Up" ? "api/user/signUp" : "api/user/logIn";
      const { data } = await axios.post(
        `${backend_url}/${endpoint}`,
        formData
      );

      if (data.success || action === "Sign Up") {
        navigate(data.path || "/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Server error");
    }
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
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
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
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
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
