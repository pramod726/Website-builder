import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/request-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (res.ok) navigate('/thank-you')
      else alert('Oops, something went wrong.')
    } catch {
      alert('Server error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 md:px-12 py-12"
    style={{
        background: 'linear-gradient(135deg, #3a2bea, #7e1aed)',
      }}>
      
      {/* Headline */}
      <h1 className="text-white text-8xl md:text-6xl m-3px font-bold text-center mb-4"
        style={{color: 'white', fontSize: '3rem'}}>
        What do you want to build?
      </h1>


      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap flex-col items-center w-1/2 max-w-2xl bg-gray-800 rounded-xl p-100px shadow-lg backdrop-blur-sm"
      >
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={5}
          placeholder="Explain your idea in detail. The more details, the better the result."
          className="w-full bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-[22px] px-6 py-4 resize-none text-center placeholder:text-center placeholder:italic" style={{fontSize: '1rem', color: 'white', fontWeight: 'bold', textAlign: 'center' , justifytext: 'center'}}/>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-1/4 py-3 h-100px rounded-full bg-purple-600 hover:bg-red-500 text-white font-semibold text-lg transition disabled:opacity-50" style={{height:'35px'}}   
        >
          {loading ? 'Generating...' : 'Generate My Website 🚀'}
        </button>
      </form>
    </div>
  )
}
