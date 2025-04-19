import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpLogin from './pages/SignUp_Login'
import './stylesheets/SignUp_Login.css'
// import '../src/assets/index.css'
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<SignUpLogin/>} />
    </Routes>
    </>
  )
}


export default App