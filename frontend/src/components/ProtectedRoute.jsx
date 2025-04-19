// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom"
import toast from "react-hot-toast"

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  if (!token) {
    toast.error("Access denied! Please login first.")
    return <Navigate to="/SignUp" />
  }
  return children
}

export default ProtectedRoute
