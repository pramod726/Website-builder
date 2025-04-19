import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronDown, LogOut } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const taglines = [
    "What do you want to build today?",
    "Dream it. Type it. Launch it.",
    "Your ideas, in code – instantly."
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token || !savedUser) {
      toast.error("Access denied! Please login first.");
      navigate("/SignUp");
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    fetch("http://localhost:8000/api/user/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: user.id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.success("Logged out successfully");
          navigate("/");
        } else {
          toast.error(data.message || "Logout failed");
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Something went wrong!");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter your idea before submitting.");
      return;
    }

    try {
      setLoading(true);
      navigate('/chat', { state: { prompt } });
      setPrompt('');
    } catch (err) {
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Toaster position="top-right" />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">ProjectPress</h1>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20"
          >
            Profile <ChevronDown size={18} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-md overflow-hidden">
              <div className="px-4 py-2 border-b">👤 {user?.name}</div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                <LogOut size={16} className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Typewriter */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 bg-gradient-to-b from-indigo-50 to-purple-100 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          <Typewriter
            words={taglines}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 border border-gray-200"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder="Explain your idea in detail. The more details, the better the result."
            className="w-full text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate My Website 🚀'}
          </button>
        </form>
      </section>

      {/* My Projects */}
      <section className="px-6 py-10 bg-white">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">My Projects</h3>
        {user?.projects?.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {user.projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                <h4 className="font-semibold text-indigo-800">{proj.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{proj.description}</p>
                <button
                  className="mt-4 w-full py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You don't have any projects yet. Start by generating one above!</p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 px-6 py-4 text-sm mt-auto flex justify-between items-center">
        <span>&copy; 2025 ProjectPress. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Support</a>
        </div>
      </footer>
    </div>
  );
}
