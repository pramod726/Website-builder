import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !savedUser) {
        toast.error("Access denied! Please login first.");
      navigate("/"); // Redirect to login if no auth
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    fetch("http://localhost:8000/api/user/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.success("Logged out successfully")
          navigate("/");
        } else {
          toast.error(response.data.message || "Logout failed");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "Something went wrong!");
      });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome {user?.name} 👋</h1>
      <p>Email: {user?.email}</p>
      <p>Username: {user?.username}</p>
      <button onClick={handleLogout} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
