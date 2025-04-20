import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronDown, LogOut } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';

// Ensure cookies are sent with axios
axios.defaults.withCredentials = true;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const taglines = [
    "What do you want to build today?",
    "Dream it. Type it. Launch it.",
    "Your ideas, in code – instantly."
  ];

  // Redirect if not authenticated and load user
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      toast.error('Access denied! Please login first.');
      navigate('/SignUp');
    } else {
      const userObj = JSON.parse(savedUser);
      setUser(userObj);
      console.log('User data:', userObj);
      // Fetch user projects
      axios.get('http://localhost:8000/api/projects',{_id:userObj.id})
        .then(({ data }) => {
          console.log('Projects data:', data);  
          if (data.success) {
            setProjects(data.projects);
          } else {
            toast.error(data.message || 'Failed to load projects');
          }
        })
        .catch(err => {
          console.error('Error fetching projects:', err);
          toast.error('Error loading your projects');
        });
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/logOut', { _id: user.id });
      if (res.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/');
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter your idea before submitting.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:8000/api/projects', {
        title: prompt,
        initialPrompt: prompt,
        _id: user.id,
      });
      console.log('Project creation response:', data);
      if (data.success) {
        const projectId = data.project._id;
        setPrompt('');
        navigate('/chat', { state: { prompt, projectId } });
      } else {
        toast.error(data.message || 'Failed to create project');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      toast.error('Server error.');
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

      {/* Hero Section */}
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

        {/* Prompt Form */}
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
        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                <h4 className="font-semibold text-indigo-800">{proj.title}</h4>
                <p className="text-sm text-gray-600 mt-2">Status: {proj.status}</p>
                <button
                  onClick={() => navigate(`/projects/${proj._id}`)}
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
      <footer className="bg-gray-300 text-black px-6 py-6 text-sm mt-auto flex flex-col md:flex-row items-center justify-between">
        <span>&copy; 2025 ProjectPress. All rights reserved.</span>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <span>Made with</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-red-500 animate-pulse"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
          <span>by Team ByteMe</span>
        </div>
      </footer>
    </div>
  );
}
