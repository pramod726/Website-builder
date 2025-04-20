import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function ProjectView() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      
      if (!userData) {
        toast.error("Authentication required");
        navigate("/SignUp");
        return;
      }

      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/user/projects/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ _id: userData.id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProject(data.project);
      } else {
        toast.error(data.message || "Failed to load project");
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      toast.error("Failed to load project details");
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async () => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }
    
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(`http://localhost:8000/api/user/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ _id: userData.id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Project deleted successfully");
        navigate('/dashboard');
      } else {
        toast.error(data.message || "Failed to delete project");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error("Something went wrong while deleting the project");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-500">Project not found</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">{project.title}</h1>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
              project.status === 'active' ? 'bg-green-100 text-green-800' : 
              project.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {project.status}
            </span>
          </div>
          <button
            onClick={deleteProject}
            className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center"
          >
            <Trash2 size={16} className="mr-1" /> Delete Project
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 flex-1">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Project Info */}
          <div className="mb-8">
            <div className="text-sm text-gray-500 mb-4">
              <p>Created: {formatDate(project.createdAt)}</p>
              <p>Last Updated: {formatDate(project.updatedAt)}</p>
            </div>
          </div>

          {/* Conversation History */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Conversation History</h2>
            {project.interactions.length > 0 ? (
              <div className="space-y-4">
                {project.interactions.map((interaction, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-lg ${
                      interaction.role === 'user' 
                        ? 'bg-indigo-50 border-l-4 border-indigo-500' 
                        : 'bg-gray-50 border-l-4 border-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {interaction.role === 'user' ? 'You' : 'Assistant'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(interaction.timestamp)}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">
                      {interaction.message}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No conversation history yet.</p>
            )}
          </div>

          {/* Generated Files */}
          <div>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Generated Files</h2>
            {project.files.length > 0 ? (
              <div className="space-y-4">
                {project.files.map((file, idx) => (
                  <div key={idx} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                      <div className="font-mono text-sm">
                        {file.name} <span className="text-gray-500">(.{file.type})</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated: {formatDate(file.updatedAt)}
                      </div>
                    </div>
                    <pre className="p-4 bg-gray-50 overflow-x-auto text-sm">
                      <code>{file.content}</code>
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No files generated yet.</p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
        &copy; 2025 ProjectPress. All rights reserved.
      </footer>
    </div>
  );
}