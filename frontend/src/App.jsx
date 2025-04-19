import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import SignUpLogin from './pages/SignUp_Login'
import ProtectedRoute from './components/ProtectedRoute'
import './stylesheets/SignUp_Login.css'
import { Toaster } from 'react-hot-toast'

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const path = window.location.pathname
    if (token && (path === "/" || path === "/SignUp")) {
      navigate("/dashboard")
    }
  }, [])

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/SignUp" element={<SignUpLogin />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
