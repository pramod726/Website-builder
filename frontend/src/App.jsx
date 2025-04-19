import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpLogin from './pages/SignUp_Login'
import './stylesheets/SignUp_Login.css'
import Chat from './pages/Chat'
// import '../src/assets/index.css'
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/SignUp" element={<SignUpLogin/>} />
      <Route path="/chat" element={<Chat/>} />
    </Routes>
    </>
  )
}


export default App