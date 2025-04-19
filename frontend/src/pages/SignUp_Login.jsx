import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import '../stylesheet/SignUp_Login.css'

const backend_url = import.meta.env.VITE_BACKEND_URL;

function SignUpLogin() {
  const [action, setAction] = useState("Sign Up");
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullname: '',
    password: '',
  });

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (action === 'Sign Up') {
      if (!validateEmail(formData.email)) {
        alert('Please enter a valid email address.');
        return false;
      }

      if (!validatePassword(formData.password)) {
        alert(
          'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.'
        );
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
      const response = await axios.post(`http://localhost:8000/${endpoint}`, formData);
      if (response.data.success || action === "Sign Up") {
        navigate(response.data.path);
      } else {
        alert(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response.data.message);
    }
  };

  const handleClick = () => {
    setAction((prev) => (prev === "Sign Up" ? "Log In" : "Sign Up"));
  };

  return (
    <div className="sbox">
      <div className="scontainer">
        <div className="sheader">
          <div className="stext">{action}</div>
          <div className="sunderline"></div>
        </div>

        <form onSubmit={handleSubmit}>
          {action === "Sign Up" && (
            <>
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
                  type="text"
                  name="fullname"
                  className="sinput_style"
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
              className="sinput_style"
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
              className="sinput_style"
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

          <button type="submit" className={action === "Sign Up" ? "signSubmit" : "logSubmit"}>
            Submit
          </button>

          <h3 className="pseudoClass">
            <span className="or">or</span>
          </h3>
          <div className="haveAccount">
            {action === "Sign Up" ? "Already" : "Don't"} have an account?
            <span onClick={handleClick}>
              {" "}{action === "Sign Up" ? "Log In" : "Sign Up"}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpLogin;
