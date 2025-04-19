import React from 'react'
import { useNavigate } from 'react-router-dom'

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed tracking-wide">
        Build your project with speed and style
      </h2>
      <p className="text-purple-200 text-lg md:text-xl leading-relaxed">
        The ultimate platform to launch your ideas effortlessly.
      </p>
      <button
        className="mt-4 bg-white w-48 h-12 text-purple-700 font-semibold text-lg py-3 px-10 rounded-lg border-2 border-purple-300 shadow-md hover:bg-purple-50 hover:shadow-lg hover:scale-105 transition-all duration-300 outline-none ring-4 ring-purple-400"
        style={{ margin: 20 }}
        onClick={() => navigate('/auth')}
        aria-label="Get Started"
        type="button"
      >
        Get Started
      </button>
    </section>
  )
}

export default HeroSection
