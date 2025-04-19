import React from 'react'
import Header from '../layouts/Header'
import HeroSection from '../section/HeroSection'

const HomePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white flex flex-col items-center justify-center px-6 text-center animate-fade-in space-y-8">
      <Header />
      <HeroSection />
    </main>
  )
}

export default HomePage
